// Declaracion de variables

// contenedores / items del dom que queremos modificar en un futuro
const cart_container = document.getElementById("cart-list");
const cart_title = document.getElementById("cart-title");
const total_container = document.getElementById("total-container");
const cart_control_container = document.getElementById("cart-control");
const steps_container = document.getElementById("cart-steps");
const step1_container = document.getElementById("step1");
const cart_itemsNumber = document.getElementById("cart-items");
const total_text = document.getElementById("total");
const step2_container = document.getElementById("step2");
const step3_container = document.getElementById("step3");
const step2_progressbar = document.getElementById("step2-progressbar");
const step3_objective = document.getElementById("step3-objective");
const step1_progressbar = document.getElementById("step1-progressbar");
const step2_objective = document.getElementById("step2-objective");
const prevStep_btn = document.getElementById("cart-prev1");
const nextStep_btn = document.getElementById("cart-next1");
const purchase_btn = document.getElementById("cart-purchase");
const bankAccount_inpt = document.getElementById("floatingCuentaBancaria");
const cardNumber_inpt = document.getElementById("floatingCardNumber");
const securityCode_inpt = document.getElementById("floatingSecurityCode");
const cardExpiryDate_inpt = document.getElementById("floatingVencimiento");
const errorText_pm = document.getElementById("errorText");

// ID del usuario, para acceder al .json del carrito (en este caso por letra es fijo)
const user_id = "25801";

// array del carrito y variable que usamos para el total
let cart = [];
let total = 0;
let adress;
let delivery_type;
let cardNumber;
let bankAccount;
let currentCurrency;

// Declaracion de funciones

// Funcion que remueve un producto del carrito
const removeProduct = (index) => {
  Number.parseInt(localStorage.getItem("cart_items_number")) -
    Number.parseInt(cart[index].articles[0].count) ==
  0
    ? localStorage.removeItem("cart_items_number")
    : localStorage.setItem(
        "cart_items_number",
        Number.parseInt(localStorage.getItem("cart_items_number")) -
          Number.parseInt(cart[index].articles[0].count)
      );
  cart.splice(index, 1);
  localStorage.setItem("user_cart", JSON.stringify(cart));
  total = 0;
  showCart(cart);
  const cart_itemsNumber = document.getElementById("cart-items");
  cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
};

// Funcion para mostrar el carrito a partir de un array dado por parametro
const showCart = (array) => {
  cart_container.innerHTML = "";
  if (array.length >= 1) {
    array.forEach((cart, index) => {
      let { name, currency, count, id, image, unitCost } = cart.articles[0];
      currency2 = cart.articles[0].currency == "USD" ? 1 : 0;
      total =
        currency == "USD"
          ? total + unitCost * count
          : total + (unitCost * count) / 40;
      cart_container.innerHTML += `
            <li class="list-group-item">
                <div class="container p-0 d-flex w-auto" style="height: 150px;">
                    <img src="${image}" class="w-auto rounded border">
                <div class="d-flex container flex-column justify-content-between p-0">
                    <h3 class="text-dark ps-3">${name} - ${currency} ${unitCost} c/u</h3>
                <div class="d-flex justify-content-between">
                    <div class="d-flex">
                        <h4 class="text-muted text-end px-3">Cantidad:</h4>
                        <input class="form-control float-end" onInput="getSubtotal(${unitCost},this.value, ${index}, ${currency2}, ${id})" id="cant" type="number" value="${count}" min="1" style="width: 4em; height: 2em">
                    </div>
                    <h4 class="text-muted text-end float-end">Subtotal: ${currency} <span class="text-muted text-end float-end ps-2" id="cost${index}">${
        unitCost * count
      }</span></h4>
                    </div>
                </div>
                    <i class="bi bi-trash-fill cursor-active btn btn-outline-danger d-flex justify-content-around pt-2" onclick="removeProduct(${index})" style="font-size: 18px; height: 36px; width: 36px;"></i>
                </div>
            </li>
          `;
      cart_control_container.style.visibility = "initial";
    });
  } else {
    cart_container.innerHTML = `<h2 class="text-secondary text-center">No hay productos en su carrito.<h2>`;
    cart_control_container.style.visibility = "hidden";
  }
  const currency_select = document.getElementById("currency-select");
  total = currency_select.value == "UYU" ? total * 40 : total;
  total_text.innerText = total.toFixed(2);
};

// Funcion para calcular el subtotal de un producto X cuando uno cambia la cantidad deseada a comprar del mismo
const getSubtotal = (unitCost, count, id, currency, prodId) => {
  cart.forEach((product) => {
    if (product.articles[0].id == prodId) {
      localStorage.setItem(
        "cart_items_number",
        Number.parseInt(localStorage.getItem("cart_items_number")) -
          Number.parseInt(product.articles[0].count) +
          Number.parseInt(count)
      );
      const currency_select = document.getElementById("currency-select");
      total =
        currency_select.value == "UYU"
          ? currency == 1
            ? total -
              product.articles[0].unitCost * product.articles[0].count * 40 +
              unitCost * count * 40
            : total -
              product.articles[0].unitCost * product.articles[0].count +
              unitCost * count
          : currency == 1
          ? total -
            product.articles[0].unitCost * product.articles[0].count +
            unitCost * count
          : total -
            (product.articles[0].unitCost * product.articles[0].count) / 40 +
            (unitCost * count) / 40;
      product.articles[0].count = count;
      localStorage.setItem("user_cart", JSON.stringify(cart));
    }
  });
  let subtotal = isFinite(unitCost * count) ? unitCost * count : 0;
  document.getElementById("cost" + id).innerHTML = `${subtotal}`;
  cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
  total_text.innerText = total.toFixed(2);
};

// Funcion de conversion del total a dolares / pesos uruguayos (por defecto se muestra el precio en dolares)
const convertPriceToCurrency = (currency) => {
  currentCurrency = currentCurrency
    ? currentCurrency == "UYU"
      ? "USD"
      : "UYU"
    : "UYU";
  total = currency == "UYU" ? total * 40 : total / 40;
  total_text.innerText = total.toFixed(2);
};

// Funcion para proceder a los siguientes pasos despues de darle 'siguiente' en la pantalla del carrito (incompleta por el momento, pero es un avance para los pasos 2 y 3)
const nextStep = (step) => {
  step = step.slice(-1);
  const emptyCartAlert = document.getElementById("emptyCartAlert");
  switch (step) {
    case "1":
      if (Number.parseInt(localStorage.getItem("cart_items_number")) >= 1) {
        removeEmptyProducts(cart);
        emptyCartAlert.classList.add("invisible");
        total_container.classList.add("d-none");
        prevStep_btn.classList.remove("d-none");
        cart_container.classList.add("d-none");
        cart_title.classList.add("d-none");
        steps_container.classList.remove("d-none");
        nextStep_btn.id = "cart-next2";
      } else {
        emptyCartAlert.classList.remove("invisible");
      }
      break;
    case "2":
      const street_nameInpt = document.getElementById("calle");
      const house_numberInpt = document.getElementById("numero");
      const esqInpt = document.getElementById("esquina");
      let adressInputArray = [street_nameInpt, house_numberInpt, esqInpt];
      if (
        street_nameInpt.checkValidity() &&
        house_numberInpt.checkValidity() &&
        esqInpt.checkValidity()
      ) {
        adress =
          street_nameInpt.value +
          " " +
          house_numberInpt.value +
          " Esq. " +
          esqInpt.value;
        delivery_type = document.getElementById("standar").checked
          ? document.getElementById("standar").value
          : document.getElementById("express").checked
          ? document.getElementById("express").value
          : document.getElementById("premium").value;
        step1_progressbar.classList.remove("border-dark");
        step1_progressbar.classList.add("border-primary");
        step2_objective.classList.remove("bg-dark");
        step2_objective.classList.add("bg-primary");
        step1_container.classList.add("d-none");
        step2_container.classList.remove("d-none");
        prevStep_btn.id = "cart-prev2";
        nextStep_btn.id = "cart-next3";
      } else {
        adressInputArray.forEach((input) => {
          checkInputValidity(input.id);
        });
      }
      break;
    case "3":
      if (cardNumber | bankAccount) {
        const balance_step3 = document.getElementById("balance_step3");
        const adress_step3 = document.getElementById("adress_step3");
        const paymentMethod_step3 = document.getElementById(
          "paymentMethod_step3"
        );
        step2_progressbar.classList.remove("border-dark");
        step2_progressbar.classList.add("border-primary");
        step3_objective.classList.remove("bg-dark");
        step3_objective.classList.add("bg-primary");
        step2_container.classList.add("d-none");
        step3_container.classList.remove("d-none");
        nextStep_btn.classList.add("d-none");
        purchase_btn.classList.remove("d-none");
        prevStep_btn.id = "cart-prev3";
        paymentMethod_step3.innerText = cardNumber
          ? "Tarjeta de credito: " + cardNumber
          : "Cuenta bancaria: " + bankAccount;
        adress_step3.innerText = adress;
        if (currentCurrency == "UYU") {
          currentCurrency = "USD";
          convertPriceToCurrency(currentCurrency);
        }
        let delivery_cost = total * Number.parseFloat(delivery_type);
        let finalTotal = total + delivery_cost;
        let htmlContentToAppend = `
            <div class="d-flex flex-column border border-secondary rounded-2" style="max-width: 75%">
                <div class="d-flex justify-content-between p-2">
                    <h5>Subtotal: </h4>
                    <h5>USD ${total.toFixed(2)}</h4>
                </div>
                <div class="d-flex justify-content-between p-2">
                    <h5>Coste de envío: </h4>
                    <h5>USD ${delivery_cost.toFixed(2)}</h4>
                </div>
                <div class="d-flex justify-content-between border-top p-2">
                    <h5>Total: </h4>
                    <h5>USD ${finalTotal.toFixed(2)}</h4>
                </div>
            </div>
            `;
        balance_step3.innerHTML = htmlContentToAppend;
      } else {
        errorText_pm.classList.remove("d-none");
      }
      break;
  }
};

// Funcion que reedirige al paso anterior en el carrito 
const prevStep = (step) => {
  step = step.slice(-1);
  switch (step) {
    case "1":
      total_container.classList.remove("d-none");
      prevStep_btn.classList.add("d-none");
      cart_container.classList.remove("d-none");
      cart_title.classList.remove("d-none");
      steps_container.classList.add("d-none");
      nextStep_btn.id = "cart-next1";
      break;
    case "2":
      step1_progressbar.classList.add("border-dark");
      step1_progressbar.classList.remove("border-primary");
      step2_objective.classList.add("bg-dark");
      step2_objective.classList.remove("bg-primary");
      step1_container.classList.remove("d-none");
      step2_container.classList.add("d-none");
      prevStep_btn.id = "cart-prev1";
      nextStep_btn.id = "cart-next2";
      break;
    case "3":
      step2_progressbar.classList.add("border-dark");
      step2_progressbar.classList.remove("border-primary");
      step3_objective.classList.add("bg-dark");
      step3_objective.classList.remove("bg-primary");
      step2_container.classList.remove("d-none");
      step3_container.classList.add("d-none");
      nextStep_btn.classList.remove("d-none");
      purchase_btn.classList.add("d-none");
      prevStep_btn.id = "cart-prev2";
      nextStep_btn.id = "cart-next3";
      break;
  }
};

// Funcion que elimina los productos que tengan cantidad 0 al darle a siguiente (si hay un solo producto y tiene cantidad 0 no se puede ir al siguiente paso)
const removeEmptyProducts = (array) => {
  array.forEach((product, index) => {
    if (product.articles[0].count == 0) {
      array.splice(index, 1);
    }
  });
};

// Funcion que cambia el metodo de pago, deshabilitando los inputs opuestos
const changePaymentMethod = (method) => {
  if (method == "bankAccount") {
    bankAccount_inpt.removeAttribute("disabled");
    cardNumber_inpt.setAttribute("disabled", "");
    securityCode_inpt.setAttribute("disabled", "");
    cardExpiryDate_inpt.setAttribute("disabled", "");
    removeValidation([cardNumber_inpt, securityCode_inpt, cardExpiryDate_inpt]);
  } else {
    bankAccount_inpt.setAttribute("disabled", "");
    cardNumber_inpt.removeAttribute("disabled");
    securityCode_inpt.removeAttribute("disabled");
    cardExpiryDate_inpt.removeAttribute("disabled");
    removeValidation([bankAccount_inpt]);
  }
};

// Funcion que chequea la validacion de un input a partir de una id
const checkInputValidity = (id) => {
  const input = document.getElementById(id);
  if (input.checkValidity()) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }
};

// Funcion que remueve las validaciones de inputs a partir de un array
const removeValidation = (inputArray) => {
  inputArray.forEach((input) => {
    input.value = "";
    input.classList.remove("is-invalid");
    input.classList.remove("is-valid");
  });
};

// Funcion que agrega el metodo de pago seleccionado a partir de los datos dados por el usuario
const addPaymentMethod = () => {
  const paymentMethod_text = document.getElementById("paymentMethod_text");
  const paymentMethodError = document.getElementById("paymentMethodError");
  var myModalEl = document.getElementById("paymentMethodModal");
  var modal = bootstrap.Modal.getInstance(myModalEl);
  if (
    (bankAccount_inpt.value.length == 12) |
    (cardNumber_inpt.value.length == 12 &&
      securityCode_inpt.value.length == 3 &&
      cardExpiryDate_inpt.value.length == 5)
  ) {
    if (bankAccount_inpt.value) {
      bankAccount = bankAccount_inpt.value;
      paymentMethodError.classList.add("d-none");
      paymentMethod_text.innerText = "Cuenta bancaria: " + bankAccount;
      errorText_pm.classList.add("d-none");
      modal.hide();
    } else {
      cardNumber = cardNumber_inpt.value;
      let securityCode = securityCode_inpt.value;
      let cardExpiryDate = cardExpiryDate_inpt.value;
      paymentMethodError.classList.add("d-none");
      paymentMethod_text.innerText = "Tarjeta de credito: " + cardNumber;
      errorText_pm.classList.add("d-none");
      modal.hide();
    }
  } else {
    paymentMethodError.classList.remove("d-none");
  }
};

// Funcion que finaliza la compra
const finishPurchase = (id) => {
  localStorage.removeItem("user_cart");
  localStorage.removeItem("cart_items_number");
  document.getElementById(id).innerHTML = `
    Procesando pago..
    <span class="spinner-border spinner-border-sm"></span>
    `;
  setTimeout(function () {
    document.getElementById("purchaseCompleted").classList.remove("invisible");
    document.getElementById(id).innerHTML = `
    Pago realizado
    <span class="bi bi-check2-circle"></span>
    `;
  }, 2000);
  setTimeout(function () {
    window.location.replace("index.html");
  }, 4000);
};

// Declaracion de eventos
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("user_cart")) {
    JSON.parse(localStorage.getItem("user_cart")).forEach((product) =>
      cart.push(product)
    );
  }
  if (localStorage.getItem("isCartLoaded")) {
    showCart(cart);
  } else {
    getJSONData(CART_INFO_URL + user_id + EXT_TYPE).then(function (resultObj) {
      if (resultObj.status === "ok") {
        cart.push(resultObj.data);
        localStorage.setItem("user_cart", JSON.stringify(cart));
        const cart_itemsNumber = document.getElementById("cart-items");
        cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
        showCart(cart);
        localStorage.setItem("isCartLoaded", true);
      }
    });
  }
});

