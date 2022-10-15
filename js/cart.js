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

 // ID del usuario, para acceder al .json del carrito (en este caso por letra es fijo)
 const user_id = '25801';


 // array del carrito y variable que usamos para el total 
 let cart = [];
 let total = 0;

 // Eventos
 document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("user_cart")) {
        JSON.parse(localStorage.getItem("user_cart")).forEach( product => cart.push(product));
    }
    if (localStorage.getItem("isCartLoaded")) {
        showCart(cart);
    } else {
        getJSONData(CART_INFO_URL+user_id+EXT_TYPE).then(function(resultObj) {
            if (resultObj.status === "ok") {
                cart.push(resultObj.data);
                localStorage.setItem("user_cart", JSON.stringify(cart));
                const cart_itemsNumber = document.getElementById("cart-items");
                cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
                showCart(cart);
                localStorage.setItem("isCartLoaded", true);
            }
        })
    }
})

// Funciones 

// Funcion que remueve un producto del carrito 
const removeProduct = (index) => {
    Number.parseInt(localStorage.getItem("cart_items_number"))-Number.parseInt(cart[index].articles[0].count) == 0? localStorage.removeItem("cart_items_number") : localStorage.setItem("cart_items_number", Number.parseInt(localStorage.getItem("cart_items_number"))-Number.parseInt(cart[index].articles[0].count));
    cart.splice(index, 1);
    localStorage.setItem("user_cart", JSON.stringify(cart));
    total = 0;
    showCart(cart);
    const cart_itemsNumber = document.getElementById("cart-items");
    cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
}

// Funcion para mostrar el carrito a partir de un array dado por parametro
const showCart = (array) => {
    cart_container.innerHTML = "";
    if (array.length >= 1) {
        array.forEach( (cart, index) => {
            let {name, currency, count, id, image, unitCost} = cart.articles[0];
            currency2 = cart.articles[0].currency == "USD"? 1 : 0;
            total = currency == "USD"? total + (unitCost*count) : total + (unitCost*count)/40;
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
                    <h4 class="text-muted text-end float-end">Subtotal: ${currency} <span class="text-muted text-end float-end ps-2" id="cost${index}">${unitCost*count}</span></h4>
                    </div>
                </div>
                <button class="btn-close" onclick="removeProduct(${index})"></button>
                </div>
            </li>
          `
          cart_control_container.style.visibility = "initial";
        });
        
    } else {
        cart_container.innerHTML = `<h2 class="text-secondary text-center">No hay productos en su carrito.<h2>`
        cart_control_container.style.visibility = "hidden";
    }
    const currency_select = document.getElementById("currency-select");
    total = currency_select.value == "UYU"? total*40 : total;
    total_text.innerText = total.toFixed(2);
    
}

// Funcion para calcular el subtotal de un producto X cuando uno cambia la cantidad deseada a comprar del mismo
const getSubtotal = (unitCost,count, id, currency, prodId) => {
    cart.forEach( product => {
        if (product.articles[0].id == prodId) {
            localStorage.setItem("cart_items_number", (Number.parseInt(localStorage.getItem("cart_items_number"))-Number.parseInt(product.articles[0].count))+Number.parseInt(count));
            const currency_select = document.getElementById("currency-select");
            total = currency_select.value == "UYU"? currency == 1? (total - ((product.articles[0].unitCost*product.articles[0].count)*40)+(unitCost*count)*40) : (total - (product.articles[0].unitCost*product.articles[0].count)+unitCost*count) : currency == 1 ? (total - (product.articles[0].unitCost*product.articles[0].count)+unitCost*count) : (total - ((product.articles[0].unitCost*product.articles[0].count)/40)+(unitCost*count)/40); 
            product.articles[0].count = count;
            localStorage.setItem("user_cart", JSON.stringify(cart));
        }
    });
    let subtotal = isFinite(unitCost*count)? unitCost*count : 0;
    document.getElementById("cost"+id).innerHTML = `${subtotal}`;
    cart_itemsNumber.innerHTML = localStorage.getItem("cart_items_number");
    total_text.innerText = total.toFixed(2);
}

// Funcion de conversion del total a dolares / pesos uruguayos (por defecto se muestra el precio en dolares)
const convertPriceToCurrency = (currency) => {
    total = currency == "UYU"? total * 40 : total / 40; 
    total_text.innerText = total.toFixed(2);
}

// Funcion para proceder a los siguientes pasos despues de darle 'siguiente' en la pantalla del carrito (incompleta por el momento, pero es un avance para los pasos 2 y 3)
const nextStep = (step) => {
    step = step.slice(-1);
    switch (step) {
        case "1":
        total_container.style.visibility = "hidden";
        cart_container.classList.add("d-none");
        cart_title.classList.add("d-none");
        steps_container.classList.remove("d-none");
        document.getElementById("cart-next"+step).id = "cart-next2";
        break;
        case "2":
        step1_progressbar.classList.remove("border-dark");        
        step1_progressbar.classList.add("border-primary");
        step2_objective.classList.remove("bg-dark");        
        step2_objective.classList.add("bg-primary");
        step1_container.classList.add("d-none");
        step2_container.classList.remove("d-none");
        document.getElementById("cart-next"+step).id = "cart-next3";
        break;
        case "3":
        step2_progressbar.classList.remove("border-dark");
        step2_progressbar.classList.add("border-primary");
        step3_objective.classList.remove("bg-dark");
        step3_objective.classList.add("bg-primary");
        step2_container.classList.add("d-none");
        step3_container.classList.remove("d-none");
        document.getElementById("cart-next"+step).classList.add("d-none");
        break;
    }

}