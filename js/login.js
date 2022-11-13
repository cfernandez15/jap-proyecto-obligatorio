// Declaracion de variables
let email;
let password;
const password_input = document.getElementById("floatingInputPassword");
const password_eye = document.getElementById("password-eye");
const email_text_below = document.getElementById("email-text");
const password_text_below = document.getElementById("password-text");
const login_form = document.getElementById("login-form");

// Declaracion de funciones

// Funcion de logueo, cambia el estado del login, consigue los datos email y password y los usa para setearlos como datos del usuario y al final reedirige a la pagina de inicio
const login = () => {
  updateInputValues();
  toggleLoginStatus();
  setUserData(1, email, password);
  window.location.replace("index.html");
};

// Funcion que muestra el feedback de los input email y contrasenia 
const addInputValidation = () => {
  login_form.classList.add("was-validated");
  email_text_below.style.visibility = "visible";
  email_text_below.classList.add("invalid-feedback");
  password_text_below.style.visibility = "visible";
  password_text_below.classList.add("invalid-feedback");
};

// Funcion que actualiza el valor de email y password a traves del valor de sus respectivos inputs
const updateInputValues = () => {
  email = document.getElementById("floatingInputEmail").value;
  password = document.getElementById("floatingInputPassword").value;
};

// Funcion que maneja las credenciales al iniciar sesion a traves de google (si la escribo en formato funcion flecha tira error por parte de google)
function handleCredentialResponse(response) {
  response = JSON.stringify(parseJwt(response.credential));
  response = JSON.parse(response);
  sessionStorage.setItem("user_email", response.email);
  sessionStorage.removeItem("user_password");
  toggleLoginStatus();
  window.location.replace("index.html");
}

// Funcion para leer las credenciales del inicio de sesion de google
const parseJwt = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

// Funcion para mostrar el valor del input de contrasenia a pedido del usuario
const showPassword = () => {
  if (password_input.type === "password") {
    password_eye.classList.remove("bi-eye");
    password_eye.classList.add("bi-eye-slash");
    password_input.type = "text";
  } else {
    password_eye.classList.remove("bi-eye-slash");
    password_eye.classList.add("bi-eye");
    password_input.type = "password";
  }
};
