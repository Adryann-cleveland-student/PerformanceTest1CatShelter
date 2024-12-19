const postList = document.querySelector('.posts-list');
const BreedValues = document.getElementById('breed-value');
const ageValues = document.getElementById('age-value');
const sizeValues = document.getElementById('size-value');
const addPostForm = document.querySelector('.add-post-form');
const btnSubmit = document.querySelector('.btn');

let output = "";
const renderPosts = (posts) => {
     posts.forEach(post => {

                output += ` <div class="card mt-4 col-md-6 bg-ligt">
                <div class="card-body" data-id=${post.id}>
                   <h5 class="card-title">ID: ${post.id}</h5>
                    <h6 class = "card-subtitle mb-2 text-muted">${post.breed}</h6>
                    <p class = "age-text">${post.age}</p>
                    <p class = "card-text">${post.size}</p>
                    <a href ="#" class="card-link" id="edit-post" >Edit</a>
                    <a href="#" class="card-link" id="delete-post" >Delete</a>
                </div>
            </div>  `;

            });
            postList.innerHTML = output;
}
const ApiUrl = 'https://localhost:7098/api/CatBreeds';
fetch(ApiUrl)
    .then(respnse => respnse.json())
    .then(data => renderPosts(data))
    .catch(error => console.error('Error fetching posts:', error));

      addPostForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        // Retrieve values from input fields
        const breed = BreedValues.value
        const age = Number(ageValues.value) || 0;
        const size = sizeValues.value.trim();
    
        // Create the POST request
        fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ breed, age, size })
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
    
        // Reset input fields
        BreedValues.value = '';
        ageValues.value = '';
        sizeValues.value = '';
    });
  
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
                    if (message.trim() === "Record found.") {
                        location.reload(); // Reload the page if the response matches
                    } else {
                        console.error("Unexpected response:", message);
                    }
                })
                .catch(error => console.error("Error deleting post:", error));
        }
        if (editButtonIsPressed) {
            const parent = e.target.parentElement;
            let breedValue = parent.querySelector('.card-subtitle').textContent;
            let ageValue = parent.querySelector('.age-text').textContent;
            let sizeValue = parent.querySelector('.card-text').textContent;
            
            // Set the form fields to the values of the post being edited
            BreedValues.value = breedValue;
            ageValues.value = ageValue;
            sizeValues.value = sizeValue;
    
            // Modify the submit handler for the update action
            btnSubmit.removeEventListener('click', handleSubmit);
            
            btnSubmit.addEventListener('click', handleSubmit);
            
            function handleSubmit() {
                const updateData = {
                    breed: BreedValues.value,
                    age: parseInt(ageValues.value) || 0,
                    size: sizeValues.value
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