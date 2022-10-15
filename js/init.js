const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

function logOut() {
  toggleLoginStatus();
  setUserData(0,0,0);
  window.location.replace('login.html');
}

function toggleLoginStatus() {
  if (sessionStorage.getItem("login_status") === "true") {
      sessionStorage.setItem("login_status","false");
  } else {
      sessionStorage.setItem("login_status","true");
  }
}

function setUserData(opt,email, password) {
  if (opt === 0) {
      sessionStorage.removeItem("user_email");
      sessionStorage.removeItem("user_password");
  } else {
      sessionStorage.setItem("user_email",email)
      sessionStorage.setItem("user_password",password);
  }
  
}

function setProductId(id) {
  localStorage.setItem("prodId", id);
  window.location = "product-info.html";
}

window.addEventListener('DOMContentLoaded', function() {
  if (sessionStorage.getItem("login_status") !== "true" && !window.location.href.includes("login.html")) {
    window.location.replace("login.html");
  } else if (sessionStorage.getItem("login_status") == "true"  && !window.location.href.includes("login.html")) {
    if (!localStorage.getItem("isCartLoaded")) {
      localStorage.setItem("cart_items_number", 1);
    }
    const navbar_user = document.getElementById("user");
    const cart_itemsNumber = document.getElementById("cart-items");
    cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
    navbar_user.innerHTML = `<i class="bi bi-person-circle"></i> `+sessionStorage.getItem("user_email");
  }
})



