const ApiUrl = 'https://localhost:7098/api/CatAvailable';

fetch(ApiUrl)
.then(respnse => {
    if(!respnse.ok) {
        throw new Error ('Network response was not okay');
    }
    return respnse.json();
})
.then(data => {
    console.log(data);
})
.catch(error => {
    console.error('Error:', error);
  });

  