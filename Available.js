

const postList = document.querySelector('.posts-list');
const addPostForm = document.querySelector('.add-post-form');
const titleValue = document.getElementById('Available-value');
const bodyValue = document.getElementById('Saved-value');
const IDnum = document.getElementById('ID-Number');
const priceValue = document.getElementById('price-value');

let output = "";
const renderPosts = (posts) => {
     posts.forEach(post => {

                output += ` <div class="card mt-4 col-md-6 bg-ligt">
                <div class="card-body">
                   <h5 class="card-title">ID: ${post.id}</h5>
                    <h6 class = "card-subtitle mb-2 text-muted">${post.date_Adopted}</h6>
                    <p class = "card-text">${post.date_Rescued}</p>
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

postList.addEventListener('click',()=>{
    console.log("hello");
})

    //Create - Insert new post
    //Method: POST

    addPostForm.addEventListener("submit",(e) =>{
   e.preventDefault();

   //Converting datetime-local input values to ISO format
   const dateAdopted = titleValue.value ? new Date(titleValue.value).toISOString() : null;
   const dateRescued = new Date(bodyValue.value).toISOString();




       fetch(ApiUrl, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
        IdNumber: IDnum.value,
          title: titleValue.value,
          body: bodyValue.value,
          price: parseInt (priceValue.value) || 0
       })
       })
       .then(res => res.json())
       .then(data => {
        console.log("Success:", data);
        const dataArr =[];
        dataArr.push(data);
        renderPosts(dataArr)
       })
       .catch(error=> console.error("Error submitting form:", error));
    })

    

    