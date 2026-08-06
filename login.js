// =======================================
// Task Tracker Login v4.0
// =======================================

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    login();
});

async function login() {

    const userId = document.getElementById("userId").value.trim();

    const errorBox = document.getElementById("errorMessage");
    const btnText = document.getElementById("btnText");
    const spinner = document.getElementById("loadingSpinner");

    errorBox.classList.add("d-none");
    errorBox.innerHTML = "";

    if (!userId) {
        errorBox.classList.remove("d-none");
        errorBox.innerHTML = "Please Enter User ID";
        return;
    }

    btnText.innerHTML = "Checking...";
    spinner.classList.remove("d-none");

    try {

        const response = await fetch(CONFIG.API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "login",
                userId: userId
            })
        });

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        const data = await response.json();

        btnText.innerHTML = `
            <i class="fa-solid fa-right-to-bracket me-2"></i>
            Login
        `;

        spinner.classList.add("d-none");

        if (data.success) {

            localStorage.setItem("taskUser", JSON.stringify(data));
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("name", data.name);
            localStorage.setItem("hub", data.hub);
            localStorage.setItem("role", data.role);

            if (String(data.role).toUpperCase() === "ADMIN") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "employee.html";
            }

        } else {

            errorBox.classList.remove("d-none");
            errorBox.innerHTML = data.message || "Invalid User ID";

        }

    } catch (err) {

        console.error(err);

        btnText.innerHTML = `
            <i class="fa-solid fa-right-to-bracket me-2"></i>
            Login
        `;

        spinner.classList.add("d-none");

        errorBox.classList.remove("d-none");
        errorBox.innerHTML = "Server Connection Error";

    }

}
