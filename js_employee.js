// ==================================
// Add New Task
// Employee Own Task
// ==================================

async function addTask(){


    const taskName =
    document.getElementById("newTaskName")
    .value
    .trim();


    const taskType =
    document.getElementById("newTaskType")
    .value;


    const startTime =
    document.getElementById("newTaskStart")
    .value;


    const duration =
    document.getElementById("newTaskDuration")
    .value;




    if(!taskName || !startTime || !duration){

        alert("Please fill all fields");

        return;

    }




    const userId =
    localStorage.getItem("userId");


    const hub =
    localStorage.getItem("hub");



    if(!userId){

        alert("Session expired. Login again");

        window.location.href="index.html";

        return;

    }




    try{


        const response =
        await fetch(API_URL,{

            method:"POST",

            headers:{

                "Content-Type":
                "text/plain;charset=utf-8"

            },


            body:JSON.stringify({

                action:"addTask",

                userId:userId,

                hub:hub,

                task:taskName,

                type:taskType,

                start:startTime,

                duration:duration,

                createdBy:userId

            })


        });





        const data =
        await response.json();





        if(data.success){


            alert("Task Added Successfully");



            const modalElement =
            document.getElementById(
                "addTaskModal"
            );



            const modal =
            bootstrap.Modal.getInstance(
                modalElement
            );



            if(modal){

                modal.hide();

            }




            document.getElementById(
                "newTaskName"
            ).value="";



            document.getElementById(
                "newTaskStart"
            ).value="";



            document.getElementById(
                "newTaskDuration"
            ).value="30";



            document.getElementById(
                "newTaskType"
            ).value="Daily";





            loadTasks();



        }

        else{


            alert(
                data.message ||
                "Task Add Failed"
            );


        }



    }

    catch(error){


        console.error(error);


        alert(
            "Server Connection Error"
        );


    }



}
