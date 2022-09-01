document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        sessionStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        sessionStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        sessionStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

window.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("login_status") !== "true") {
      window.location.replace("login.html");
    } else {
      const USER_EMAIL_TEXT = document.getElementById("user-email"); 
      USER_EMAIL_TEXT.innerHTML = sessionStorage.getItem("user_email");
    }
  });

function logOut() {
    toggleLoginStatus();
    setUserData(0,0,0);
    window.location.replace('login.html');
}