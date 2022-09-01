window.addEventListener("load", function() {
    window.addEventListener("DOMContentLoaded", function() {
        if (sessionStorage.getItem("login_status") !== "true") {
          window.location.replace("login.html");
        } else {
          const USER_EMAIL_TEXT = document.getElementById("user-email"); 
          USER_EMAIL_TEXT.innerHTML = sessionStorage.getItem("user_email");
        }
      });
});