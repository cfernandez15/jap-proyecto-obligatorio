// Declaracion de variables

const userImg = document.getElementById("user-img");
const uploadImage = document.getElementById("upload-img");
const uploadImageLabel = document.getElementById("upload-img-label");
const nameCompleteBanner = document.getElementById("nameComplete-banner");
const userName1 = document.getElementById("user-name1");
const userName2 = document.getElementById("user-name2");
const userLastname1 = document.getElementById("user-lastname1");
const userLastName2 = document.getElementById("user-lastname2");
const userAge = document.getElementById("user-age");
const userSex = document.getElementById("user-sex");
const userTel = document.getElementById("user-tel");
const userEmail = document.getElementById("user-email");
const aboutMe = document.getElementById("about-me");
const mustfillFields = [userName1, userLastname1, userEmail];
let user_details = {
  name1: "",
  name2: "",
  lastname1: "",
  lastname2: "",
  age: "",
  sex: "",
  tel: "",
  email: sessionStorage.getItem("user_email"),
};
var myModal1 = document.getElementById("profile-img-modal");
var modal1 = bootstrap.Modal.getOrCreateInstance(myModal1);
var myModal2 = document.getElementById("select-img-modal");
var modal2 = bootstrap.Modal.getOrCreateInstance(myModal2);
let selectedImage;

// Funciones

// Funcion que crea un input al costado del elemento que el usuario da click (dinamico, distintos tipos de input soportados)
const createInput = (element) => {
  if (
    !element.innerHTML.includes("input") &&
    !element.innerHTML.includes("select") &&
    !element.innerHTML.includes("textarea")
  ) {
    if (mustfillFields.some((input) => input.id === element.id)) {
      if (element.id === userEmail.id) {
        element.innerHTML = `
                ${element.innerHTML.split(":")[0]}:
                <input type="email" class="form-control p-1 ms-2" value="${
                  element.innerHTML.split(":")[1].split(" ")[1]
                }" id="inpt${element.id}" onkeypress="editField('${
          element.id
        }', event, this)" required style="height: 24px;width: 35%">
                `;
      } else {
        element.innerHTML = `
                ${element.innerHTML.split(":")[0]}:
                <input type="text" class="form-control p-1 ms-2" value="${
                  element.innerHTML.split(":")[1].split(" ")[1]
                }" id="inpt${element.id}" onkeypress="editField('${
          element.id
        }', event, this)" required style="height: 24px;width: 35%">
                `;
      }
    } else {
      if (element.id === userAge.id || element.id === userTel.id) {
        element.innerHTML = `
                ${element.innerHTML.split(":")[0]}:
                <input type="number" class="form-control p-1 ms-2" value="${
                  element.innerHTML.split(":")[1].split(" ")[1]
                }" id="inpt${element.id}" onkeyup="editField('${
          element.id
        }', event, this)" style="height: 24px;width: 35%">
                `;
      } else if (element.id === userSex.id) {
        element.innerHTML = `
                ${element.innerHTML.split(":")[0]}:
                <select class="form-select p-0 ps-2 ms-2" style="height: 24px;width: 50%" id="inpt${
                  element.id
                }" onchange="editField('${element.id}', event, this)">
                    <option selected disabled value>Elige una opcion</option> 
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Otro">Otro</option>
                    <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                </select>
                `;
      } else if (element.id === aboutMe.id) {
        aboutMe.innerHTML = `
                <textarea class="form-control" id="inpt${element.id}" onkeypress="editField('${element.id}', event, this)" rows="3"></textarea>
                `;
      } else {
        element.innerHTML = `
                ${element.innerHTML.split(":")[0]}:
                <input type="text" class="form-control p-1 ms-2" value="${
                  element.innerHTML.split(":")[1].split(" ")[1]
                }" id="inpt${element.id}" onkeypress="editField('${
          element.id
        }', event, this)" style="height: 24px;width: 35%">
                `;
      }
    }
  }
};

// Funcion que cuando uno escribe en el input si apreta enter lo elimina (al menos que no cumpla con el checkValidity() del mismo) guarda lo escrito, lo muestra y lo guarda
const editField = (target, e, input) => {
  const element = document.getElementById(target);
  if (element.id === userSex.id) {
    element.innerHTML = `${element.innerHTML.split(":")[0]}: ${input.value}`;
    user_details[target.split("-")[1]] = input.value;
    sessionStorage.setItem("user_details", JSON.stringify(user_details));
  } else {
    let pressedKey = e.keyCode;
    if (pressedKey === 13) {
      if (element.id === aboutMe.id) {
        element.innerHTML = `${input.value}`;
        sessionStorage.setItem("aboutMe", input.value);
      } else {
        if (input.checkValidity()) {
          element.innerHTML = `${element.innerHTML.split(":")[0]}: ${
            input.value
          }`;
          user_details[target.split("-")[1]] = input.value;
          sessionStorage.setItem("user_details", JSON.stringify(user_details));
          if (target.split("-")[1] == "email") {
            sessionStorage.setItem("user_email", input.value);
          }
        } else {
          document.getElementById(input.id).classList.add("is-invalid");
        }
      }
    }
  }
};

// Funcion que a partir de un archivo subido (unicamente imagenes) crea un nuevo objeto fileReader(), lo lee (al archivo) como DataURL, lo guarda en el sessionStorage para futuro uso
// y lo setea como imagen de perfil
const changeImg = (file) => {
  let reader = new FileReader();

  if (file.type && !file.type.startsWith("image/")) {
    uploadImageLabel.classList.remove("btn-outline-info");
    uploadImageLabel.classList.add("btn-outline-danger");
    uploadImageLabel.innerHTML += `
        <i class="bi bi-exclamation-diamond text-danger"></i>
        `;
  } else {
    reader.readAsDataURL(file);
    reader.addEventListener("load", (event) => {
      userImg.src = event.target.result;
      sessionStorage.setItem("imgData", event.target.result);
      uploadImageLabel.classList.add("btn-outline-info");
      uploadImageLabel.classList.remove("btn-outline-danger");
      uploadImageLabel.innerHTML = `Subir archivo`;
      modal1.hide();
    });
  }
};

// Funcion que cuando le das click a las imagenes por defecto que ofrece el perfil las 'selecciona' (muestra un borde haciendo alusion a una seleccion)
// las pone como imagen de perfil y las guarda en el sessionStorage para futuro uso
const selectImage = (imgElement) => {
  let elements = document.getElementsByClassName("rounded");
  for (let element of elements) {
    if (element.id === imgElement.id) {
      if (element.classList.contains("border")) {
        selectedImage = "";
        element.classList.remove("border", "border-3", "border-danger");
      } else {
        document.getElementById("imgError").classList.add("invisible");
        element.classList.add("border", "border-3", "border-danger");
        selectedImage = imgElement.src;
      }
    } else {
      element.classList.remove("border", "border-3", "border-danger");
    }
  }
};

// Funcion que setea la imagen seleccionada como imagen de perfil y la guarda en el sessionStorage
const saveImage = () => {
  if (selectedImage) {
    userImg.src = selectedImage;
    sessionStorage.setItem("imgData", selectedImage);
    modal2.hide();
  } else {
    document.getElementById("imgError").classList.remove("invisible");
  }
};

// Eventos

// Evento 'DOMContentLoaded', cuando el DOM carga en caso de que haya datos ingresados (como nombre, imagen de perfil, etc) los muestra/inserta en la pagina.
document.addEventListener("DOMContentLoaded", () => {
  if (!sessionStorage.getItem("user_details")) userEmail.innerHTML = `Correo electronico: ${sessionStorage.getItem("user_email")}`
  if (sessionStorage.getItem("user_details")) {
    user_details = JSON.parse(sessionStorage.getItem("user_details"));
    Object.keys(user_details).forEach((key) => {
      if (user_details[key].length >= 1) {
        document.getElementById("user-" + key).innerHTML += user_details[key];
      }
    });
    if (user_details.name1.length >= 1 && user_details.lastname1.length >= 1) {
      let nameComplete = user_details.name1 + " " + user_details.lastname1;
      nameCompleteBanner.innerText = nameComplete;
    }
  }
  if (sessionStorage.getItem("imgData")) {
    userImg.src = sessionStorage.getItem("imgData");
  }
  if (sessionStorage.getItem("aboutMe")) {
    aboutMe.innerHTML = sessionStorage.getItem("aboutMe");
  }
});

// Evento 'change' al input de subir imagen, llama a la funcion changeImg
uploadImage.addEventListener("change", () => {
  changeImg(uploadImage.files[0]);
});

// Evento que cuando el modal2 (imagenes por defecto) se abre/muestra oculta el primer modal
myModal2.addEventListener("show.bs.modal", () => {
  modal1.hide();
});
