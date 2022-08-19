let productsArray = [];
let product_type = null;
let product_code = localStorage.getItem("catID");

document.addEventListener("DOMContentLoaded", function(){
    getJSONData(PRODUCTS_URL+product_code+EXT_TYPE).then(function(resultObj){
        if (resultObj.status === "ok"){
            productsArray = resultObj.data.products
            product_type = resultObj.data.catName
            showProducts();
        }
    });
 });

function showProducts() {
    let htmlContentToAppend = "";
    if (productsArray.length < 1) {
        
        htmlContentToAppend +=  `
        <div class="alert alert-secondary">
        <p color-secondary>No hay productos publicados en <strong>${product_type}</strong>.</p>
        </div>
         `
        document.getElementsByClassName("pb-5")[0].innerHTML = htmlContentToAppend;
    } 
    for (let i = 0; i < productsArray.length; i++) {
        let products = productsArray[i];
        
        htmlContentToAppend += `
        <div class="col py-2 cursor-active">
        <div class="card hover-overlay">
      <div class="card-header p-0 bg-transparent"><img src="${products.image}" alt="${products.description}" class="border border-light" style="width:100%;min-width: 270px;min-height:250px;display:inline-block;"></div>
      <div class="card-body" style="min-height: 150px;"><h4 class="mb-1">${products.name}</h4><p class="mb-2">${products.description}</p></div>
      <div class="card-footer"><h6 class="text-dark float-end">${products.cost} ${products.currency} </h6><small class="text-muted float-start">${products.soldCount} vendidos  </small></div>
        </div>
        </div>
        `
    }
    document.getElementById("prod-type-title").innerHTML = ""+product_type+"";
    document.getElementById("prod-type-text").innerHTML += "<strong>"+product_type+".";
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
    
window.addEventListener("load", function() {
    if (sessionStorage.getItem("login_status") !== "true") {
        window.location.replace("login.html");
    }
});