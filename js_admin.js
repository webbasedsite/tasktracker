// ==================================
// Task Tracker
// Admin Dashboard Script v3.3
// Backend Connected + Auto Refresh
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
String(ADMIN.role || "")
.toUpperCase() !== "ADMIN"
){


window.location.href="index.html";

return;

}



const nameBox =
document.getElementById(
"adminName"
);


if(nameBox){

nameBox.innerHTML =
ADMIN.name || "Admin";

}



loadDashboard();

loadTasks();



}








// ==================================
// API CALL
// ==================================

async function apiCall(payload){


try{


const response =
await fetch(
CONFIG.API_URL,
{


method:"POST",

headers:{

"Content-Type":
"application/json"

},


body:
JSON.stringify(payload)


}

);



return await response.json();



}

catch(error){


console.error(error);


return{

success:false,

message:
"Server Error"

};


}



}









// ==================================
// DASHBOARD
// ==================================

async function loadDashboard(){



const data =
await apiCall({

action:"dashboard"

});



if(data.success){


setText(
"totalAdminTask",
data.total
);


setText(
"adminCompleted",
data.completed
);


setText(
"adminRunning",
data.running
);


setText(
"adminPending",
data.pending
);



}


}







function setText(id,value){


const el =
document.getElementById(id);



if(el){

el.innerHTML =
value || 0;

}



}









// ==================================
// LOAD TASKS
// ==================================

async function loadTasks(){



const data =
await apiCall({

action:"getAllTasks"

});



if(data.success){


ALL_TASKS =
data.tasks || [];



displayTasks();

createHubReport();

createEmployeeReport();



}

else{


alert(
data.message
);


}



}









// ==================================
// DISPLAY TASKS
// ==================================

function displayTasks(){



const table =
document.getElementById(
"adminTaskTable"
);



if(!table)
return;




table.innerHTML="";




if(
ALL_TASKS.length===0
){


table.innerHTML=
`

<tr>

<td colspan="6"
class="text-center">

No Task Found

</td>

</tr>

`;


return;


}







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

<b>

${task.task}

</b>


<br>


<small>

${task.type}

</small>


</td>




<td>

${task.hub || "-"}

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

🗑

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



if(status==="Completed"){


return `

<span class="badge bg-success">

Completed

</span>

`;



}



if(status==="Running"){


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
document.getElementById(
"adminTaskName"
)
.value
.trim();



const type =
document.getElementById(
"adminTaskType"
)
.value;



const hub =
document.getElementById(
"adminHub"
)
.value;



const start =
document.getElementById(
"adminStart"
)
.value;



const duration =
document.getElementById(
"adminDuration"
)
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






const data =
await apiCall({

action:
"adminAddTask",


task:task,


type:type,


hub:hub,


start:start,


duration:duration,


createdBy:
ADMIN.userId


});





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



const data =
await apiCall({

action:
"updateTaskStatus",


row:row,


status:status


});





if(data.success){



location.reload();



}

else{


alert(
data.message
);


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

)

return;







const data =
await apiCall({

action:
"deleteTask",


row:row


});






if(data.success){


location.reload();



}

else{


alert(
data.message
);



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



if(!table)
return;



table.innerHTML="";



let hubs={};




ALL_TASKS.forEach(t=>{



let hub =
t.hub || "Unknown";



if(!hubs[hub]){


hubs[hub]={

total:0,

completed:0,

pending:0

};


}



hubs[hub].total++;



if(
t.status==="Completed"
)

hubs[hub].completed++;

else

hubs[hub].pending++;



});







Object.keys(hubs)
.forEach(h=>{



let x =
hubs[h];



let rate =
x.total
?
Math.round(
(x.completed/x.total)*100
)
:
0;





table.innerHTML +=

`

<tr>

<td>${h}</td>

<td>${x.total}</td>

<td>${x.completed}</td>

<td>${x.pending}</td>

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



if(!table)
return;




table.innerHTML="";



let emp={};




ALL_TASKS.forEach(t=>{



if(!emp[t.userId]){


emp[t.userId]={

total:0,

completed:0,

hub:t.hub || "-"

};


}



emp[t.userId].total++;



if(
t.status==="Completed"
)

emp[t.userId].completed++;



});








Object.keys(emp)
.forEach(id=>{



let e =
emp[id];



let score =
e.total
?
Math.round(
(e.completed/e.total)*100
)
:
0;





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

const logout =
document.getElementById(
"adminLogout"
);



if(logout){


logout.onclick=function(){


localStorage.removeItem(
"taskUser"
);



window.location.href =
"index.html";



};


}
