// ===============================
// Task Tracker
// Login Script
// Google Apps Script Connected
// Production Version
// ===============================


// Elements

const loginForm = document.getElementById("loginForm");

const userIdInput = document.getElementById("userId");

const btnText = document.getElementById("btnText");

const spinner = document.getElementById("loadingSpinner");

const errorMessage = document.getElementById("errorMessage");

const loginBtn = document.querySelector(".login-btn");



// Auto Focus

if(userIdInput){
    userIdInput.focus();
}



// Login Submit

loginForm.addEventListener("submit", async function(e){

    e.preventDefault();


    hideError();



    const userId = userIdInput.value
                    .trim()
                    .toUpperCase();



    if(userId === ""){

        showError(
            "Please enter User ID"
        );

        return;

    }



    startLoading();



    try{


        const response = await fetch(
            API_URL,
            {

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },


            body:JSON.stringify({

                action:"login",

                userId:userId

            })

        });



        const data = await response.json();



        if(data.success === true){



            // Save Session

            localStorage.setItem(
                "userId",
                data.userId
            );


            localStorage.setItem(
                "userName",
                data.name
            );


            localStorage.setItem(
                "hub",
                data.hub
            );


            localStorage.setItem(
                "role",
                data.role
            );


            localStorage.setItem(
                "loginTime",
                new Date().getTime()
            );





            // Redirect


            if(data.role === "ADMIN"){

                window.location.href =
                "admin.html";

            }

            else{

                window.location.href =
                "employee.html";

            }



        }

        else{


            stopLoading();


            showError(
                data.message ||
                "Invalid User ID"
            );


        }



    }


    catch(error){


        console.log(error);


        stopLoading();


        showError(
            "Server Connection Error"
        );


    }



});






// ===============================
// Loading Start
// ===============================


function startLoading(){


    loginBtn.disabled = true;


    btnText.classList.add(
        "d-none"
    );


    spinner.classList.remove(
        "d-none"
    );


}





// ===============================
// Loading Stop
// ===============================


function stopLoading(){


    loginBtn.disabled = false;


    btnText.classList.remove(
        "d-none"
    );


    spinner.classList.add(
        "d-none"
    );


}





// ===============================
// Error Message
// ===============================


function showError(message){


    errorMessage.innerHTML =
    message;


    errorMessage.classList.remove(
        "d-none"
    );


}





function hideError(){


    errorMessage.classList.add(
        "d-none"
    );


}





// ===============================
// Enter Key Login
// ===============================


userIdInput.addEventListener(
"keydown",
function(e){


    if(e.key === "Enter"){


        e.preventDefault();


        loginForm.requestSubmit();


    }


});





// ===============================
// Auto Logout Check
// ===============================


const loginTime =
localStorage.getItem("loginTime");



if(loginTime){


    const sessionTime =
    Date.now() - Number(loginTime);



    // 8 Hours Session

    if(sessionTime > 8 * 60 * 60 * 1000){


        localStorage.clear();


    }


}