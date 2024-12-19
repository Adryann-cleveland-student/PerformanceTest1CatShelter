const postList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add-post-form');
const breedValues = document.getElementById('breed-value');
const ageValues = document.getElementById('age-value');
const sizeValues = document.getElementById('size-value');

let output = "";

// Function to render posts
const renderPosts = (posts) => {
    output = ''; // Reset output before rendering new posts
    posts.forEach(post => {
        output += `
            <div class="card mt-4 col-md-6 bg-light" data-id="${post.id}">
                <div class="card-body">
                    <h5 class="card-title">ID: ${post.id}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${post.cat_Name}</h6>
                    <p class="card-text">Date Adopted ID: ${post.date_AdoptedID}</p>
                    <p class="card-text">Breed ID: ${post.breedID}</p>
                    <a href="#" class="card-link" id="edit-post">Edit</a>
                    <a href="#" class="card-link" id="delete-post">Delete</a>
                </div>
            </div>`;
    });
    postList.innerHTML = output;
};

// API URL
const ApiUrl = 'https://localhost:7098/api/Names';

// Fetch data from API and render posts
fetch(ApiUrl)
    .then(response => response.json())
    .then(data => renderPosts(data))
    .catch(error => console.error('Error fetching posts:', error));

// Event listener for form submission (POST new cat)
addPostForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Retrieve values from input fields
    const catName = breedValues.value;
    const adoptedID = Number(ageValues.value) || 0;
    const breedID = Number(sizeValues.value) || 0;

    // Create the POST request
    fetch(ApiUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            cat_Name: catName,
            date_AdoptedID: adoptedID,
            breedID: breedID
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Server Error: " + res.statusText);
        }
        return res.json();
    })
    .then(data => {
        console.log("Success:", data);
        renderPosts([data]); // Add the new post to the list
    })
    .catch(error => console.error("Error submitting form:", error));

    // Reset input fields after submission
    breedValues.value = '';
    ageValues.value = '';
    sizeValues.value = '';
});

// Event listener for edit and delete buttons
postList.addEventListener('click', (e) => {
    const delButtonIsPressed = e.target.id === 'delete-post';
    const editButtonIsPressed = e.target.id === 'edit-post';

    const card = e.target.closest('.card');
    const id = card.dataset.id;

    if (delButtonIsPressed) {
        // DELETE request
        fetch(`${ApiUrl}/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete");
                }
                return res.text(); // Parse the response as plain text
            })
            .then(message => {
                console.log("Delete response:", message);
                if (message.trim() === "Record found.") {
                    card.remove(); // Remove the deleted post from the UI
                } else {
                    console.error("Unexpected response:", message);
                }
            })
            .catch(error => console.error("Error deleting post:", error));
    }

    if (editButtonIsPressed) {
        const catName = card.querySelector('.card-subtitle').textContent;
        const adoptedID = card.querySelector('.card-text').textContent.split(":")[1].trim();
        const breedID = card.querySelector('.card-text').textContent.split(":")[2].trim();

        // Populate the form fields with the current values
        breedValues.value = catName;
        ageValues.value = adoptedID;
        sizeValues.value = breedID;

        // Modify the form submission to handle updates
        addPostForm.removeEventListener('submit', handleSubmit);
        addPostForm.addEventListener('submit', handleSubmit);

        function handleSubmit() {
            const updatedData = {
                cat_Name: breedValues.value,
                date_AdoptedID: parseInt(ageValues.value) || 0,
                breedID: parseInt(sizeValues.value) || 0
            };

            fetch(`${ApiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to update");
                }
                return res.json();
            })
            .then(updatedPost => {
                console.log("Post updated successfully", updatedPost);
                renderPosts([updatedPost]); // Re-render the updated post
            })
            .catch(error => console.error("Error updating post:", error));
        }
    }
});
