var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://thi-app.herokuapp.com/v1/api/user/profile/629103426066b93779f14c9d',
  headers: { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTEwMzQyNjA2NmI5Mzc3OWYxNGM5ZCIsImVtYWlsIjoianVzdGNsYXNzaWMyNEBnbWFpbC5jb20iLCJpc0FjdGl2ZSI6dHJ1ZSwiaXNEZWxldGVkIjpmYWxzZSwiYWRkcmVzcyI6Ik5vIDEwLCBlbmQgb2YgdGhlIG9tbml2ZXJzZSIsInBob25lIjoiMDgxMjEyMTIxMjEyIiwiaWF0IjoxNjUzNzc0Nzk1fQ.Mp_oRKEKevYLUGYuSuXSItHCWvsk94iDijg84YTCLwA'
  }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});