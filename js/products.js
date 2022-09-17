let productsArray = [];
let currentProductsArray = [];
let product_type = null;
let product_code = localStorage.getItem("catID");
let alterantive_code = sessionStorage.getItem("catID");
const BTN_CRITERIA = document.getElementById("btn-criteria");
const SELECT_TYPE = document.getElementById("sort-type");
const SORT_ICON = document.getElementById("sort-icon");
const SORT_BTN = document.getElementById("sort");
const CLEAR_BTN = document.getElementById("clear");
const SEARCH_INPUT = document.getElementById("search");

document.addEventListener("DOMContentLoaded", function(){
    SEARCH_INPUT.value = "";
    if (product_code === null) {
            getJSONData(PRODUCTS_URL+alterantive_code+EXT_TYPE).then(function(resultObj){
                if (resultObj.status === "ok"){
                    productsArray = resultObj.data.products;
                    currentProductsArray = productsArray;
                    product_type = resultObj.data.catName;
                    showProducts(productsArray);
                }
            });
    } else {
        getJSONData(PRODUCTS_URL+product_code+EXT_TYPE).then(function(resultObj){
            if (resultObj.status === "ok"){
                productsArray = resultObj.data.products
                currentProductsArray = productsArray;
                product_type = resultObj.data.catName;
                showProducts(productsArray);
            }
        });
    }
 });
function setProductId(id) {
    localStorage.setItem("prodId", id);
    window.location = "product-info.html";
}

function showProducts(array) {
    getRating(productsArray);
    let htmlContentToAppend = "";
    if (productsArray.length < 1) {
        htmlContentToAppend +=  `
             <div class="container" style="min-width: 27em;"><h4 class="text-secondary">No hay productos publicados en <strong>${product_type}</strong>.</div>
            `
            document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
        } else if (array.length < 1) {
            htmlContentToAppend +=  `
             <div class="container" style="min-width: 27em;"><h4 class="text-secondary">No hay productos que satisfagan con la busqueda realizada.</div>
            `
            document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
        } else {
        for (let i = 0; i < array.length; i++) {
            let products = array[i];
            
            htmlContentToAppend += `
            <div class="border p-0 cursor-active hover-overlay" style="min-width: 400px" onClick="setProductId(${products.id})">
            <div class="p-0 bg-transparent"><img src="${products.image}" alt="${products.description}" class="border border-light" style="width:100%;max-width: auto;display:inline-block;"></div>
            <div class="pt-2 px-2 border-bottom border-rounded-pill d-flex justify-content-between" style="max-height:100px"><h4 class="text-dark">${products.name}<h4 class="text-dark"><strong>${products.cost} ${products.currency}</strong></h4></div>
            <div class="p-1 bg-light overflow-auto text-start" style="min-height: 90px; max-height:90px"><p class="mb-2">${products.description}</p></div>
            <div class="pe-2 ps-2 py-1 border-top d-flex justify-content-between"><div class="d-flex" id="${products.id}" style="gap: 0.3em;"></div><h6 class="text-dark float-end"><small>${products.soldCount} vendidos</small></h6></div>
            </div>
            `
        }
        document.getElementById("prod-type-title").innerHTML = ""+product_type+"";
        document.getElementById("prod-type-text").innerHTML = "Verás aquí todos los productos de la categoria <strong>"+product_type+".";
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    } 
    
    }
 
function sort(array,criteria, type) {
    if (type === "cost" || type === "soldCount") {
        if (criteria === "ASC") {
            currentProductsArray = array.sort(function(a,b) {
                return a[type] - b[type];
            });
        } else {
            currentProductsArray = array.sort(function(a,b) {
                return b[type] - a[type];
            });
        }
    } else {
        if (criteria === "ASC") {
            currentProductsArray = array.sort(function(a,b) {
                if ( a[type] < b[type]) {
                    return -1;
                } else if (a[type] > b[type]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else {
            currentProductsArray = array.sort(function(a,b) {
                if ( a[type] > b[type]) {
                    return -1;
                } else if (a[type] < b[type]){
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    }
    showProducts(currentProductsArray);
}

BTN_CRITERIA.addEventListener('click', function() {
    if (SORT_ICON.classList[1] === "bi-sort-up") {
        SORT_ICON.classList.remove("bi-sort-up");
        SORT_ICON.classList.add("bi-sort-down");
        BTN_CRITERIA.value = "DESC";
        sort(currentProductsArray, BTN_CRITERIA.value, SELECT_TYPE.value);
    } else {
        SORT_ICON.classList.remove("bi-sort-down");
        SORT_ICON.classList.add("bi-sort-up");
        BTN_CRITERIA.value = "ASC";
        sort(currentProductsArray, BTN_CRITERIA.value, SELECT_TYPE.value);
    }
});

SELECT_TYPE.addEventListener('change', function() {
    sort(currentProductsArray, BTN_CRITERIA.value, SELECT_TYPE.value);
});

SORT_BTN.addEventListener('click', function() {
    let min = Number.parseInt(document.getElementById("min").value);
    let max = Number.parseInt(document.getElementById("max").value);
    if (Number.isInteger(min) && !Number.isInteger(max)) {
        currentProductsArray = currentProductsArray.filter( x => x.cost >= min);
        showProducts(currentProductsArray);
    } else if (Number.isInteger(max) && !Number.isInteger(min)) {
        currentProductsArray = currentProductsArray.filter( x => x.cost <= max);
        showProducts(currentProductsArray);
    } else if (Number.isInteger(max) && Number.isInteger(max) && min < max) {
        currentProductsArray = currentProductsArray.filter( x => x.cost <= max && x.cost >= min);
        showProducts(currentProductsArray);
    }
});

CLEAR_BTN.addEventListener('click', function() {
    document.getElementById("min").value = "";
    document.getElementById("max").value = "";
    currentProductsArray = productsArray;
    showProducts(productsArray);
});


let pressed_key = "";
let searchArray = {};
const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","ñ","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9"];

SEARCH_INPUT.addEventListener('keydown', function(e) {
    let search = SEARCH_INPUT.value;
    if (pressed_key == search) {
        if (alphabet.find(x => x.includes(e.key.toLowerCase()))) {
            pressed_key += e.key;
            currentProductsArray = currentProductsArray.filter(x => x.name.includes(pressed_key) || x.description.includes(pressed_key));
            showProducts(currentProductsArray);
        } else if (e.key === " ") {
            if (pressed_key !== "") {
                pressed_key += " ";
            }
        } else {
            if (e.key === "Backspace") {
                currentProductsArray = productsArray;
                pressed_key = pressed_key.slice(0, -1);
                currentProductsArray = currentProductsArray.filter(x => x.name.includes(pressed_key) || x.description.includes(pressed_key));
                showProducts(currentProductsArray);
                if (pressed_key.length < 1) {
                    showProducts(productsArray);
                    currentProductsArray = productsArray;
                }
            } else {
                showProducts(currentProductsArray);
            }
        }   
    } else {
        pressed_key = SEARCH_INPUT.value;
        currentProductsArray = currentProductsArray.filter( x => x.name.includes(pressed_key) || x.description.includes(pressed_key));
        showProducts(currentProductsArray);
        if (pressed_key.length < 1) {
            showProducts(productsArray);
            currentProductsArray = productsArray;
        }
    }
});

function getRating(array) {
    let scores = [];
    array.forEach( element => {
        scores.push(element.id);
    });
    array.forEach( element => {
        getProductsRating(element.id);
    });
}

async function getProductsRating(id) {
    let response = await fetch(PRODUCT_INFO_COMMENTS_URL+id+EXT_TYPE);
    let result = await response.json();
    let averages = [];
    let average_score = 0;
    
    for (let i = 0; i < result.length; i++) {
        averages[i] = result[i];
        
    }
    if (localStorage.getItem("additional_comements_score")) {
        let additional_comments_score = JSON.parse(localStorage.getItem("additional_comements_score"));
        getNewCommentsScore(additional_comments_score, averages);
        console.log(averages);
    }
    
    for (let i = 0; i < averages.length; i++) {
        average_score = average_score + averages[i].score;
    }
    
    average_score = average_score / averages.length;
    let htmlContentToAppend = "";
    if (Number.isNaN(average_score)) {
        htmlContentToAppend = `
        <small>No hay calificaciones</small>
        `
    } else {
        if (average_score === 5) {
            htmlContentToAppend = `
            <i class="bi bi-star-fill rating"></i><i class="bi bi-star-fill rating"></i><i class="bi bi-star-fill rating"></i><i class="bi bi-star-fill rating"></i><i class="bi bi-star-fill rating"></i>
            
            `
        } else {
            if (average_score.toString().split('.')[1]) {
              for (let i = 0; i < Math.round(average_score)-1; i++) {
                htmlContentToAppend += `
                <i class="bi bi-star-fill rating"></i>
                `
              }
                if (parseInt(average_score.toString().split('.')[1].slice(0,1)) >= 5) {
                htmlContentToAppend += `
                <i class="bi bi-star-half rating"></i>
                `
                } else {
                htmlContentToAppend += `
                  <i class="bi bi-star-fill rating"></i>
                  `
                }
              for (let i = Math.round(average_score); i < 5; i++) {
                htmlContentToAppend += `
                <i class="bi bi-star rating"></i>
                `
              }
            } else {
              for (let i = 0; i < Math.round(average_score); i++) {
                htmlContentToAppend += `
                <i class="bi bi-star-fill rating"></i>
                `
              }
              for (let i = Math.round(average_score); i < 5; i++) {
                htmlContentToAppend += `
                <i class="bi bi-star rating"></i>
                `
              }
            }
            
          }
    }
    htmlContentToAppend += `
    <small>(${averages.length})</small>
    `
    const product_rating = document.getElementById(id);
    let actual_content = product_rating.innerHTML;
    product_rating.innerHTML = htmlContentToAppend+actual_content;
}

let lastId = 0;
const getNewCommentsScore = (array1,array2) => {
    if (array2.length > 0) {
        if (lastId < array2[0].product) {
            array1.forEach( element => {
                if (element.product == array2[0].product) {
                    array2.push(element);
                }
            });
            lastId = array2[0].product;
        }
    } 
}
