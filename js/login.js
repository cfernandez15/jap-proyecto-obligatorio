let email;
let password;

function login() {
    updateInputValues(); 
    toggleLoginStatus();
    setUserData(email,password);
    window.location.replace('index.html');
}

function addInputValidation() {
    const EMAIL_TEXT_BELOW = document.getElementById("email-text");
    const PASSWORD_TEXT_BELOW = document.getElementById("password-text");
    const LOGIN_FORM = document.getElementById("login-form");
    LOGIN_FORM.classList.add("was-validated");
    EMAIL_TEXT_BELOW.style.visibility = "visible";
    EMAIL_TEXT_BELOW.classList.add("invalid-feedback");
    PASSWORD_TEXT_BELOW.style.visibility = "visible";
    PASSWORD_TEXT_BELOW.classList.add("invalid-feedback");
}

function toggleLoginStatus() {
    if (sessionStorage.getItem("login_status") === "true") {
        sessionStorage.setItem("login_status","false");
    } else {
        sessionStorage.setItem("login_status","true");
    }
}

function setUserData(email, password) {
    sessionStorage.setItem("user_email",email)
    sessionStorage.setItem("user_password",password);
}

function getUserData() {
    let user_data = [sessionStorage.getItem("user_email"),sessionStorage.getItem("user_password")];
    return user_data;
}

function updateInputValues() {
    email = document.getElementById("floatingInputEmail").value;
    password = document.getElementById("floatingInputPassword").value;
}

function handleCredentialResponse(response) {
    response = JSON.stringify(parseJwt(response.credential));
    response = JSON.parse(response);
    sessionStorage.setItem("user_email",response.email);
    sessionStorage.removeItem("user_password");
    toggleLoginStatus();
    window.location.replace("index.html");
 }

 function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));
   return JSON.parse(jsonPayload);
 };