// =======================================
// Task Tracker Login v3.0
// =======================================



document
.getElementById("loginForm")
.addEventListener(
"submit",
function(e){

e.preventDefault();

login();

});






// =======================================
// LOGIN FUNCTION
// =======================================


async function login(){



const userId =
document
.getElementById("userId")
.value
.trim();



const errorBox =
document
.getElementById("errorMessage");



const btnText =
document
.getElementById("btnText");



const spinner =
document
.getElementById("loadingSpinner");





if(!userId){


errorBox
.classList
.remove("d-none");


errorBox.innerHTML =
"Please Enter User ID";


return;

}





btnText.innerHTML =
"Checking...";


spinner
.classList
.remove("d-none");





try{


const response = await fetch(CONFIG.API_URL,{


method:"POST",


headers:{


"Content-Type":
"text/plain;charset=utf-8"


},



body:JSON.stringify({

action:"login",

userId:userId


})


}

);






const data =
await response.json();






// Stop Loading


btnText.innerHTML =
`
<i class="fa-solid fa-right-to-bracket me-2"></i>
Login
`;



spinner
.classList
.add("d-none");







if(data.success){



// Save User Session


localStorage.setItem(

"taskUser",

JSON.stringify(data)

);




// Backward support

localStorage.setItem(
"userId",
data.userId
);

localStorage.setItem(
"hub",
data.hub
);






// Redirect


if(

String(data.role)
.toUpperCase()
==="ADMIN"

){


window.location.href =
"admin.html";


}

else{


window.location.href =
"employee.html";


}



}

else{


errorBox
.classList
.remove("d-none");


errorBox.innerHTML =
data.message ||
"Invalid User ID";


}



}



catch(error){



console.log(error);



btnText.innerHTML =
`
<i class="fa-solid fa-right-to-bracket me-2"></i>
Login
`;



spinner
.classList
.add("d-none");



errorBox
.classList
.remove("d-none");



errorBox.innerHTML =
"Server Connection Error";



}



}
