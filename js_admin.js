// ==================================
// Task Tracker
// Admin Dashboard Script v3.0
// Backend Connected
// ==================================



let ADMIN = null;

let ALL_TASKS = [];




// ==================================
// PAGE LOAD
// ==================================


document.addEventListener(
"DOMContentLoaded",
()=>{


checkAdmin();

});






// ==================================
// ADMIN CHECK
// ==================================


function checkAdmin(){



ADMIN =
JSON.parse(
localStorage.getItem("taskUser")
);



if(
!ADMIN ||
ADMIN.role.toUpperCase()
!="ADMIN"
){


window.location.href =
"index.html";


return;


}




document
.getElementById("adminName")
.innerHTML =
ADMIN.name || "Admin";



loadDashboard();

loadTasks();



}





// ==================================
// DASHBOARD
// ==================================


async function loadDashboard(){



try{


const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",


body:JSON.stringify({

action:"dashboard"


})


}

);



const data =
await response.json();





if(data.success){



document
.getElementById("totalAdminTask")
.innerHTML =
data.total;



document
.getElementById("adminCompleted")
.innerHTML =
data.completed;



document
.getElementById("adminRunning")
.innerHTML =
data.running;



document
.getElementById("adminPending")
.innerHTML =
data.pending;



}


}

catch(error){

console.log(error);

}



}







// ==================================
// LOAD ALL TASK
// ==================================


async function loadTasks(){



try{


const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",


body:JSON.stringify({

action:"getAllTasks"


})


}

);



const data =
await response.json();




if(data.success){


ALL_TASKS =
data.tasks;


displayTasks();


createHubReport();


createEmployeeReport();


}



}


catch(error){


console.log(error);


}



}







// ==================================
// TASK TABLE
// ==================================


function displayTasks(){



const table =
document.getElementById(
"adminTaskTable"
);



table.innerHTML="";





ALL_TASKS.forEach(
(task,index)=>{


table.innerHTML +=


`
<tr>


<td>
${index+1}
</td>


<td>

${task.userId}

</td>



<td>

${task.task}

<br>

<small>
${task.type}
</small>

</td>




<td>

${task.hub}

</td>




<td>

${badge(task.status)}

</td>




<td>


<button

class="btn btn-success btn-sm"

onclick="changeStatus(${task.row},'Completed')">

✓

</button>



<button

class="btn btn-danger btn-sm"

onclick="removeTask(${task.row})">

<i class="fa fa-trash"></i>

</button>


</td>


</tr>

`;



});



}







// ==================================
// STATUS BADGE
// ==================================


function badge(status){



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







// ==================================
// CREATE ADMIN TASK
// ==================================


async function createAdminTask(){



const task =
document
.getElementById("adminTaskName")
.value;



const type =
document
.getElementById("adminTaskType")
.value;



const hub =
document
.getElementById("adminHub")
.value;



const start =
document
.getElementById("adminStart")
.value;



const duration =
document
.getElementById("adminDuration")
.value;






if(
!task ||
!start ||
!duration
){


alert(
"Fill all information"
);


return;


}




const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",


body:JSON.stringify({

action:"adminAddTask",

task:task,

type:type,

hub:hub,

start:start,

duration:duration,

createdBy:ADMIN.userId


})


}

);





const data =
await response.json();




if(data.success){



alert(
"Task Created Successfully"
);



location.reload();



}

else{


alert(
data.message
);


}



}







// ==================================
// UPDATE STATUS
// ==================================


async function changeStatus(
row,
status
){



const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",


body:JSON.stringify({


action:
"updateTaskStatus",


row:row,


status:status


})


}

);



const data =
await response.json();



if(data.success){


loadTasks();


loadDashboard();


}



}







// ==================================
// DELETE TASK
// ==================================


async function removeTask(row){



if(
!confirm(
"Delete Task?"
)

)return;





const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",


body:JSON.stringify({

action:"deleteTask",

row:row


})


}

);





const data =
await response.json();



if(data.success){


loadTasks();


loadDashboard();


}



}







// ==================================
// HUB REPORT
// ==================================


function createHubReport(){



const table =
document.getElementById(
"hubTable"
);



table.innerHTML="";



let hubs={};




ALL_TASKS.forEach(t=>{


if(!hubs[t.hub]){


hubs[t.hub]={

total:0,

completed:0,

pending:0

};


}



hubs[t.hub].total++;



if(t.status=="Completed")

hubs[t.hub].completed++;


else

hubs[t.hub].pending++;



});





Object.keys(hubs)
.forEach(hub=>{


let h =
hubs[hub];


let rate =
Math.round(
(h.completed/h.total)*100
);



table.innerHTML +=


`
<tr>

<td>${hub}</td>

<td>${h.total}</td>

<td>${h.completed}</td>

<td>${h.pending}</td>

<td>${rate}%</td>

</tr>
`;



});



}








// ==================================
// EMPLOYEE REPORT
// ==================================


function createEmployeeReport(){



const table =
document.getElementById(
"employeeTable"
);



table.innerHTML="";



let emp={};





ALL_TASKS.forEach(t=>{


if(!emp[t.userId]){


emp[t.userId]={

total:0,

completed:0,

hub:t.hub

};


}


emp[t.userId].total++;



if(t.status=="Completed")

emp[t.userId].completed++;



});





Object.keys(emp)
.forEach(id=>{


let e =
emp[id];


let score =
Math.round(
(e.completed/e.total)*100
);



table.innerHTML +=


`
<tr>

<td>${id}</td>

<td>${e.hub}</td>

<td>${e.total}</td>

<td>${e.completed}</td>

<td>${score}%</td>


</tr>

`;



});



}






// ==================================
// LOGOUT
// ==================================


document
.getElementById(
"adminLogout"
)
.onclick=function(){


localStorage.removeItem(
"taskUser"
);



window.location.href=
"index.html";


};
