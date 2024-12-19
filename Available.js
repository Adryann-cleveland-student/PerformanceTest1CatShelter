

const postList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add-post-form');
const titleValue = document.getElementById('Available-value');
const bodyValue = document.getElementById('Saved-value');
const priceValue = document.getElementById('price-value');
const btnSubmit = document.querySelector('.btn');


let output = "";
const renderPosts = (posts) => {
     posts.forEach(post => {

                output += ` <div class="card mt-4 col-md-6 bg-ligt">
                <div class="card-body" data-id=${post.id}>
                   <h5 class="card-title">ID:${post.id}</h5>
                    <h6 class = "card-subtitle mb-2 text-muted">${post.date_Adopted}</h6>
                    <p class = "Saved-text">${post.date_Rescued}</p>
                    <p class = "card-text">Price: $${post.price}</p>
                    <a href ="#" class="card-link" id="edit-post" >Edit</a>
                    <a href="#" class="card-link" id="delete-post" >Delete</a>
                </div>
            </div>  `;

            });
            postList.innerHTML = output;
}
const ApiUrl = 'https://localhost:7098/api/CatAvailable';
fetch(ApiUrl)
    .then(respnse => respnse.json())
    .then(data => renderPosts(data))
    .catch(error => console.error('Error fetching posts:', error));

    //18:09 video time Javascirpt fetch API with Crud operations by cand dev

postList.addEventListener('click',(e)=>{
    e.preventDefault();
    let delButtonIsPressed = e.target.id == 'delete-post';
    let edditButtonIsPressed = e.target.id == 'edit-post';

    let id = e.target.parentElement.dataset.id;
    //delete - remove exitsing post
    //method: DELETE

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

    if (edditButtonIsPressed) {
        const parent = e.target.parentElement;
        let AdoptContent = parent.querySelector('.card-subtitle').textContent;
        let priceContent = parent.querySelector('.card-text').textContent;

        titleValue.value = AdoptContent;
        priceValue.value = priceContent;

        // Clear any previous event listeners on submit button
        btnSubmit.removeEventListener('click', handleSubmit);

        // Attach a new event listener for the submit button
        btnSubmit.addEventListener('click', handleSubmit);

        function handleSubmit() {
            
            const updateData = {
                Date_Adopted: titleValue.value ? new Date(titleValue.value).toISOString() : null,
                Price: parseFloat(priceValue.value) || 0
            };

            fetch(`${ApiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(updateData)
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to update");
                }
                return res.json();
            })
           
                // Optionally hide or reset the form (if it's in a modal or something)
         
        }
    }
});

    //Create - Insert new post
    //Method: POST

    addPostForm.addEventListener("submit", (e) => {
      //  e.preventDefault();
    
        // Convert datetime-local input values to ISO format
        const dateAdopted = titleValue.value ? new Date(titleValue.value).toISOString() : null;
        const dateRescued = bodyValue.value ? new Date(bodyValue.value).toISOString() : null;
    
        // Create the POST request
        fetch(ApiUrl, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
          
                Date_Adopted: dateAdopted,
                Date_Rescued: dateRescued,
                Price: parseFloat(priceValue.value) || 0
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
            renderPosts([data]);
        })
        .catch(error => console.error("Error submitting form:", error));

        //reset input field to empty
        titleValue.value = '';
        bodyValue.value = '';
        priceValue.value ='';

    });

    

    