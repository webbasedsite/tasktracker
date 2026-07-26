// =======================================
// Employee Dashboard JS
// Task Tracker v3.0 FIXED
// =======================================


let USER = null;





// =======================================
// PAGE LOAD
// =======================================


document.addEventListener(
"DOMContentLoaded",
function(){


checkSession();



});






// =======================================
// CHECK LOGIN SESSION
// =======================================


function checkSession(){



USER =
JSON.parse(
localStorage.getItem("taskUser")
);




if(!USER){


window.location.href =
"index.html";


return;


}




document
.getElementById("employeeName")
.innerHTML =
USER.name;



loadTasks();



}







// =======================================
// LOGOUT
// =======================================


document
.getElementById("logoutBtn")
.addEventListener(
"click",
function(){


localStorage.removeItem(
"taskUser"
);



window.location.href =
"index.html";



});








// =======================================
// LOAD TASKS
// =======================================


async function loadTasks(){


try{


const response =
await fetch(
CONFIG.API_URL,
{

method:"POST",


body:JSON.stringify({

action:"getTasks",

userId:
USER.userId


})


}

);



const data =
await response.json();




if(data.success){


displayTasks(
data.tasks
);


}

else{


alert(data.message);


}




}

catch(error){


console.log(error);


alert(
"Server Error"
);


}



}









// =======================================
// DISPLAY TASKS
// =======================================


function displayTasks(tasks){



const table =
document.getElementById(
"taskTable"
);



table.innerHTML="";



let total=0;

let completed=0;

let pending=0;





if(!tasks || tasks.length==0){


table.innerHTML=
`
<tr>

<td colspan="5"
class="text-center">

No Task Found

</td>

</tr>
`;



updateSummary(
0,
0,
0
);


return;


}





tasks.forEach(
(task,index)=>{



total++;




if(task.status=="Completed"){

completed++;

}

else{

pending++;

}





let action="";




if(task.status=="Pending"){



action=
`
<button 
class="btn btn-success btn-sm"
onclick="startTask(${task.row})">


<i class="fa fa-play"></i>

Start


</button>

`;



}




else if(task.status=="Running"){



action=
`
<button 
class="btn btn-primary btn-sm"
onclick="completeTask(${task.row})">


<i class="fa fa-check"></i>

Complete


</button>

`;



}



else{


action=
`
<span class="badge bg-success">

Done

</span>
`;



}






table.innerHTML +=

`
<tr>


<td>

${index+1}

</td>



<td>

<b>${task.task}</b>

<br>

<small>

${task.type}

</small>

</td>




<td>

${task.start}

<br>

${task.duration} min

</td>




<td>

${statusBadge(task.status)}

</td>




<td>

${action}

</td>


</tr>
`;




});




updateSummary(
total,
completed,
pending
);



}









// =======================================
// ADD TASK
// =======================================


async function addTask(){



const task =
document
.getElementById("newTaskName")
.value
.trim();




const type =
document
.getElementById("newTaskType")
.value;




const start =
document
.getElementById("newTaskStart")
.value;




const duration =
document
.getElementById("newTaskDuration")
.value;






if(
!task ||
!start ||
!duration
){


alert(
"Please Fill All Information"
);


return;


}






const payload = {


action:"addTask",


userId:
USER.userId,


task:task,


type:type,


start:start,


duration:duration,


createdBy:
USER.userId



};






try{



const response =
await fetch(
CONFIG.API_URL,
{

method:"POST",


body:
JSON.stringify(payload)


}

);






const data =
await response.json();





if(data.success){



alert(
data.message
);




clearTaskForm();



closeTaskModal();



loadTasks();



}

else{


alert(
data.message
);


}



}

catch(error){


console.log(error);


alert(
"Server Error"
);


}



}









// =======================================
// CLEAR TASK FORM
// =======================================


function clearTaskForm(){



document
.getElementById("newTaskName")
.value="";



document
.getElementById("newTaskStart")
.value="";



document
.getElementById("newTaskDuration")
.value="30";



}








// =======================================
// CLOSE MODAL
// =======================================


function closeTaskModal(){



const modal =
document.getElementById(
"addTaskModal"
);



const instance =
bootstrap.Modal
.getInstance(modal);



if(instance){


instance.hide();


}



}









// =======================================
// STATUS BADGE
// =======================================


function statusBadge(status){



if(status=="Completed"){


return `

<span class="badge bg-success">

Completed

</span>

`;

}



if(status=="Running"){


return `

<span class="badge bg-warning text-dark">

Running

</span>

`;

}



return `

<span class="badge bg-secondary">

Pending

</span>

`;



}









// =======================================
// SUMMARY
// =======================================


function updateSummary(
total,
completed,
pending
){



document
.getElementById("totalTask")
.innerHTML =
total;




document
.getElementById("completedTask")
.innerHTML =
completed;




document
.getElementById("pendingTask")
.innerHTML =
pending;




let percent=0;



if(total>0){


percent =
Math.round(
(completed/total)*100
);


}





document
.getElementById("progressText")
.innerHTML =
percent+"%";




document
.getElementById("progressBar")
.style.width =
percent+"%";



}









// =======================================
// START TASK
// =======================================


async function startTask(row){

await updateTask(
"startTask",
row
);

location.reload();

}







// =======================================
// COMPLETE TASK
// =======================================


async function completeTask(row){

await updateTask(
"completeTask",
row
);

location.reload();

}









// =======================================
// UPDATE TASK
// =======================================


async function updateTask(
action,
row
){



try{


const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",


body:
JSON.stringify({

action:action,

row:row,

userId:
USER.userId


})


}

);



const data =
await response.json();




if(data.success){

alert(data.message);

location.reload();

}


loadTasks();


}

else{


alert(
data.message
);


}



}

catch(error){


console.log(error);


alert(
"Server Error"
);


}



}
