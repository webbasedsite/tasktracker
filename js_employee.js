// ==================================
// Add New Task
// ==================================

async function addTask(){


    const taskName =
    document.getElementById("newTaskName").value.trim();


    const startTime =
    document.getElementById("newTaskStart").value;


    const duration =
    document.getElementById("newTaskDuration").value;



    if(!taskName || !startTime || !duration){

        alert("Please fill all fields");
        return;

    }



    const userId =
    localStorage.getItem("userId");


    const hub =
    localStorage.getItem("hub");




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

                start:startTime,

                duration:duration

            })


        });



        const data =
        await response.json();




        if(data.success){


            alert("Task Added Successfully");



            // Close Modal

            const modal =
            bootstrap.Modal
            .getInstance(
            document.getElementById("addTaskModal")
            );


            modal.hide();



            // Clear Form

            document.getElementById("newTaskName").value="";
            document.getElementById("newTaskStart").value="";
            document.getElementById("newTaskDuration").value="30";



            // Reload Tasks

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


        console.log(error);

        alert(
        "Server Connection Error"
        );


    }



}
