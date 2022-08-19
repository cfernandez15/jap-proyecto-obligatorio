window.addEventListener("load", function() {
    if (sessionStorage.getItem("login_status") !== "true") {
        window.location.replace("login.html");
    }
});