const postList = document.querySelector('.posts-list');

let output = "";
const renderPosts = (posts) => {
     posts.forEach(post => {

                output += ` <div class="card mt-4 col-md-6 bg-ligt">
                <div class="card-body">
                   <h5 class="card-title">ID: ${post.id}</h5>
                    <h6 class = "card-subtitle mb-2 text-muted">${post.Breed}</h6>
                    <p class = "card-text">${post.Age}</p>
                    <p class = "card-text">Price: $${post.size}</p>
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