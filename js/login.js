let email;
let password;

function login() {
    updateInputValues(); 
    toggleLoginStatus();
    setUserData(1,email,password);
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

 function showPassword() {
    const PASSWORD_INPUT = document.getElementById("floatingInputPassword");
    const PASSWORD_EYE = document.getElementById("password-eye");
    if (PASSWORD_INPUT.type === "password") {
        PASSWORD_EYE.classList.remove("bi-eye");
        PASSWORD_EYE.classList.add("bi-eye-slash");
        PASSWORD_INPUT.type = "text";
    } else {
        PASSWORD_EYE.classList.remove("bi-eye-slash");
        PASSWORD_EYE.classList.add("bi-eye");
        PASSWORD_INPUT.type = "password";
    }
}