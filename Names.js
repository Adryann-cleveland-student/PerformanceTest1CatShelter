const postList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add-post-form');
const nameValues = document.getElementById('name-value');
const AdoptedValues = document.getElementById('AdID-value');
const BreedValues = document.getElementById('BrID-value');

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
    const catName = nameValues.value;
    const adoptedID = Number(AdoptedValues.value) || 0;
    const breedID = Number(BreedValues.value) || 0;

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
    nameValues.value = '';
    AdoptedValues.value = '';
    BreedValues.value = '';
});

// Event listener for edit and delete buttons

postList.addEventListener('click', (e) => {
    let delButtonIsPressed = e.target.id == 'delete-post';
    let editButtonIsPressed = e.target.id == 'edit-post';
    
    let id = e.target.parentElement.dataset.id;
    
    if (delButtonIsPressed) {
        fetch(`${ApiUrl}/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete");
                }
                return res.text(); // Parse the response as plain text
            })
            .then(message => {
                console.log("Delete response:", message); // Log the plain text response
                if (message.trim() == "Record found.") {
                    location.reload(); // Reload the page if the response matches
                } else {
                    console.error("Unexpected response:", message);
                }
            })
            .catch(error => console.error("Error deleting post:", error));
    }
    if (editButtonIsPressed) {
        const parent = e.target.parentElement;
        let nameValues = parent.querySelector('.card-subtitle').textContent;
        let AdoptedValues = parent.querySelector('.age-text').textContent;
        let BreedValues = parent.querySelector('.card-text').textContent;
        
        // Set the form fields to the values of the post being edited
        nameValues.value = breedValue;
        AdoptedValues.value = ageValue;
        BreedValues.value = sizeValue;

        // Modify the submit handler for the update action
        btnSubmit.removeEventListener('click', handleSubmit);
        
        btnSubmit.addEventListener('click', handleSubmit);
        
        function handleSubmit() {
            const updateData = {
                name: BreedValues.value,
                adoptID: parseInt(AdoptedValues.value) || 0,
                brID: parseInt(BreedValues.value) || 0
            };
            
            fetch(`${ApiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to update");
                }
                return res.json();
            })
            .then(updatedPost => {
                console.log("Post updated successfully", updatedPost);
                // After update, re-render the posts
                posts = posts.map(post => post.id === updatedPost.id ? updatedPost : post);
                renderPosts(posts);
            })
            .catch(error => console.error("Error updating post:", error));
        }
    }
});