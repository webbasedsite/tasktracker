// ==================================
// Task Tracker
// Admin Dashboard Script
// ==================================


// Check Admin Login

const adminId = localStorage.getItem("userId");


if(adminId !== "ADMIN"){

    window.location.href = "index.html";

}



// Demo Employees

const employees = [

    {
        id:"M001",
        name:"Rakib",
        hub:"Dhaka-01",
        assigned:5,
        completed:5,
        pending:0
    },

    {
        id:"M002",
        name:"Karim",
        hub:"Dhaka-01",
        assigned:5,
        completed:4,
        pending:1
    },

    {
        id:"M003",
        name:"Sumon",
        hub:"Dhaka-02",
        assigned:6,
        completed:5,
        pending:1
    }

];




// Demo Tasks

const tasks = [

    {
        hub:"Dhaka-01",
        status:"Completed",
        late:false
    },

    {
        hub:"Dhaka-01",
        status:"Completed",
        late:false
    },

    {
        hub:"Dhaka-01",
        status:"Pending",
        late:true
    },

    {
        hub:"Dhaka-02",
        status:"Completed",
        late:false
    }

];




// Load Dashboard

function loadAdminDashboard(){


    // Employee Count

    document.getElementById("totalEmployee")
    .innerText = employees.length;



    // Total Task

    let totalTask =
    employees.reduce(
        (sum,e)=>sum+e.assigned,0
    );


    document.getElementById("totalAdminTask")
    .innerText=totalTask;



    // Completed

    let completed =
    employees.reduce(
        (sum,e)=>sum+e.completed,0
    );


    document.getElementById("adminCompleted")
    .innerText=completed;



    // Pending

    let pending =
    employees.reduce(
        (sum,e)=>sum+e.pending,0
    );


    document.getElementById("adminPending")
    .innerText=pending;



    loadEmployeeTable();

    loadHubTable();

    loadActivity();


}



// Employee Performance


function loadEmployeeTable(){


    let table =
    document.getElementById("employeeTable");


    table.innerHTML="";


    employees.forEach(emp=>{


        let score =
        Math.round(
            (emp.completed / emp.assigned)*100
        );


        table.innerHTML +=

        `

        <tr>

        <td>

        ${emp.id}

        <br>

        <small>${emp.name}</small>

        </td>


        <td>${emp.assigned}</td>


        <td class="text-success fw-bold">

        ${emp.completed}

        </td>


        <td class="text-danger">

        ${emp.pending}

        </td>


        <td>

        <span class="score">

        ${score}%

        </span>

        </td>


        </tr>

        `;


    });


}





// Hub Summary


function loadHubTable(){


    let table =
    document.getElementById("hubTable");


    table.innerHTML="";


    let hubs={};



    employees.forEach(emp=>{


        if(!hubs[emp.hub]){


            hubs[emp.hub]={

                total:0,
                completed:0,
                pending:0

            };


        }


        hubs[emp.hub].total += emp.assigned;

        hubs[emp.hub].completed += emp.completed;

        hubs[emp.hub].pending += emp.pending;


    });



    Object.keys(hubs)
    .forEach(hub=>{


        table.innerHTML +=

        `

        <tr>

        <td>${hub}</td>

        <td>${hubs[hub].total}</td>

        <td class="text-success">

        ${hubs[hub].completed}

        </td>

        <td class="text-danger">

        ${hubs[hub].pending}

        </td>

        <td>

        0

        </td>

        </tr>

        `;


    });


}





// Activity Log


function loadActivity(){


    let list =
    document.getElementById("activityList");


    let activities=[

        "M001 Completed Stock Check - 08:40 AM",

        "M002 Started Delivery - 08:45 AM",

        "M003 Completed Report - 09:20 AM"

    ];



    list.innerHTML="";


    activities.forEach(item=>{


        list.innerHTML +=

        `

        <li class="list-group-item">

        <i class="fa-solid fa-clock text-primary"></i>

        ${item}

        </li>

        `;


    });


}





// Logout


document
.getElementById("adminLogout")
.addEventListener("click",()=>{


    localStorage.removeItem("userId");


    window.location.href="index.html";


});





// Start

loadAdminDashboard();
