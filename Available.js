

const postList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add.post-list');
let output = "";
const renderPosts = (posts) => {
     posts.forEach(post => {

                output += ` <div class="card mt-4 col-md-6 bg-ligt">
                <div class="card-body">
                   <h5 class="card-title">ID: ${post.id}</h5>
                    <h6 class = "card-subtitle mb-2 text-muted">${post.date_Adopted}</h6>
                    <p class = "card-text">${post.date_Rescued}</p>
                    <a href ="#" class="card-link">Edit</a>
                    <a href="#" class="card-link">Delete</a>
                </div>
            </div>  `;

            });
            postList.innerHTML = output;
}
const ApiUrl = 'https://localhost:7098/api/CatAvailable';
fetch(ApiUrl)
    .then(respnse => respnse.json())
    .then(data => renderPosts(data))

    //18:09 video time Javascirpt fetch API with Crud operations by cand dev