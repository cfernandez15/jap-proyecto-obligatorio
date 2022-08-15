let productsArray = [];
let product_type = null;
let product_code = localStorage.getItem("catID");

document.addEventListener("DOMContentLoaded", function(e){
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
        <strong>No hay items para mostrar en esta categoria!.</strong>
        </div>
         `
        document.getElementsByTagName("body").innerHTML = htmlContentToAppend;
    } else {

    }
    
    for (let i = 0; i < productsArray.length; i++) {
        let products = productsArray[i];
        
        htmlContentToAppend += `
      
        <div class="col py-2 cursor-active">
        <div class="card">
      <div class="card-header p-0 bg-transparent"><img src="${products.image}" alt="${products.description}" class="border border-light" style="width:100%;min-width: 270px;min-height:250px;display:inline-block;"></div>
      <div class="card-body" style="min-height: 150px;"><h4 class="mb-1">${products.name}</h4><p class="mb-2">${products.description}</p></div>
      <div class="card-footer"><h6 class="text-dark float-end">${products.cost} ${products.currency} </h6><small class="text-muted float-start">${products.soldCount} vendidos  </small></div>
        </div>
        </div>
        `
        // htmlContentToAppend += `
        // <div class="list-group-item list-group-item-action cursor-active">
        //     <div class="row">
        //         <div class="col-3">
        //             <img src="${products.image}" alt="${products.description}" class="rounded" style="width:100%;border-style:solid">
        //         </div>
        //         <div class="col">
        //             <div class="d-flex w-100 justify-content-between">
        //                 <h4 class="mb-1">${products.name} - ${products.currency} ${products.cost}</h4>
        //                 <small class="text-muted">${products.soldCount} vendidos</small>
        //             </div>
        //             <p class="mb-1">${products.description}</p>
        //         </div>
        //     </div>
        // </div>
        // `
        
    }
    document.getElementById("prod-type-title").innerHTML = ""+product_type+"";
    document.getElementById("prod-type-text").innerHTML += "<strong>"+product_type+".";
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
    


 
      
    
    





/* <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
<div class="row">
    <div class="col-3">
        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
    </div>
    <div class="col">
        <div class="d-flex w-100 justify-content-between">
            <h4 class="mb-1">${category.name}</h4>
            <small class="text-muted">${category.productCount} artículos</small>
        </div>
        <p class="mb-1">${category.description}</p>
    </div>
</div> */