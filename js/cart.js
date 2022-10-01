 const cart_container = document.getElementById("cart-list");
 let cart = [];

 document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("htmlCart")) {
        cart = localStorage.getItem("htmlCart").split(',');
    }
    showCart(cart);
})

const removeItem = (id) => {
    if (Number.parseInt(localStorage.getItem("cart_items_number")) > 1 ) {
        localStorage.setItem("cart_items_number", Number.parseInt(localStorage.getItem("cart_items_number"))-1);
    } else {
        localStorage.removeItem("cart_items_number");
    }
    let element = cart.filter( element => element.includes(`id=\"${id.parentElement.parentElement.id}\">\n `));
    let index = cart.findIndex( product => product == element);
    cart.splice(index, 1);
    localStorage.setItem("htmlCart", cart);
    document.getElementById("cart-items").innerHTML = localStorage.getItem("cart_items_number");
    showCart(cart);
}

const showCart = (array) => {
    const btn_next_container = document.getElementById("btn-next");
    if (array.length >= 1) {
        array.forEach( element => cart_container.innerHTML += element);
    } else {
        cart_container.innerHTML = `<h2 class="text-secondary text-center">No hay productos en su carrito.<h2>`
        return false;
    }
    btn_next_container.innerHTML = `<a class="btn btn-primary btn-lg float-end" id="">Siguiente</a>`
}