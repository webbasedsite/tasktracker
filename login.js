// =======================================
// Task Tracker Login
// =======================================


// Login Form Submit

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


function login(){



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




// Loading Start


btnText.innerHTML =
"Checking...";


spinner
.classList
.remove("d-none");





fetch(
CONFIG.API_URL,
{


method:"POST",


body:JSON.stringify({

action:"login",

userId:userId

})


}

)

.then(
response =>
response.json()

)


.then(
data=>{


// Loading Stop


btnText.innerHTML =
`
<i class="fa-solid fa-right-to-bracket me-2"></i>
Login
`;


spinner
.classList
.add("d-none");





if(data.success){



// Save Session


localStorage.setItem(
"taskUser",
JSON.stringify(data)
);





// Role Check


if(

data.role
&&
data.role
.toUpperCase()
===
"ADMIN"

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

)



.catch(
error=>{


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

);



}
