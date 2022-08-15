let email;
let password;

function login() {
        if (checkLogin) {
            updateInputValues(); 
            toggleLoginStatus();
            setUserData(email,password);
            window.location.replace('index.html');
        }   
}

function checkLogin() {
    updateInputValues();
    if (email.length < 1 && password.length < 1) {
        showValidation(0);
        return false;
    } else if (email.length < 1 && !password.length < 1 ) {
        showValidation(1);
        return false;
    } else if (!email.length <1 && password.length < 1) {
        showValidation(2);
        return false;
    } else {
        return true;
    }
}

function showValidation(option) {
    const EMAIL_TEXT_BELOW = document.getElementById("email-text");
    const PASSWORD_TEXT_BELOW = document.getElementById("password-text");
    const LOGIN_FORM = document.getElementById("login-form");
    switch (option) {
        case 0:
            LOGIN_FORM.classList.add("was-validated");
            EMAIL_TEXT_BELOW.style.visibility = "visible";
            EMAIL_TEXT_BELOW.classList.add("invalid-feedback");
            PASSWORD_TEXT_BELOW.style.visibility = "visible";
            PASSWORD_TEXT_BELOW.classList.add("invalid-feedback");
            break;
        case 1:
            LOGIN_FORM.classList.add("was-validated");
            EMAIL_TEXT_BELOW.style.visibility = "visible";
            EMAIL_TEXT_BELOW.classList.add("invalid-feedback");
            break;
        case 2:
            LOGIN_FORM.classList.add("was-validated");
            PASSWORD_TEXT_BELOW.style.visibility = "visible";
            PASSWORD_TEXT_BELOW.classList.add("invalid-feedback");
            break;
    }
}

function toggleLoginStatus() {
    if (sessionStorage.getItem("login_status") === "true") {
        sessionStorage.setItem("login_status","false");
    } else {
        sessionStorage.setItem("login_status","true");
    }
}

function setUserData(email, password) {
    localStorage.setItem("user_email",email)
    localStorage.setItem("user_password",password);
}

function getUserData() {
    let user_data = [localStorage.getItem("user_email"),localStorage.getItem("user_password")];
    console.log(user_data);
    return user_data;
}

function updateInputValues() {
    email = document.getElementById("floatingInputEmail").value;
    password = document.getElementById("floatingInputPassword").value;
}

function handleCredentialResponse(response) {
    response = JSON.stringify(parseJwt(response.credential));
    response = JSON.parse(response);
    localStorage.setItem("user_email",response.email);
    localStorage.removeItem("user_password");
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