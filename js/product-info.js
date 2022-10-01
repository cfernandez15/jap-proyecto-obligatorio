let product_info = {}
let product_comments = {};
let product_id = localStorage.getItem("prodId");
let commentsArray = [];
const product_info_container = document.getElementById("product-info");
const comment_container = document.getElementById("comment-container");
const btn_comment = document.getElementById("comment-btn");
const prod_description = document.getElementById("product-description");
let additional_comments_score = [];
let cart = [];

// Eventos 

window.addEventListener("DOMContentLoaded", function() {
    window.scrollTo(0, 0);
    getJSONData(PRODUCT_INFO_URL+product_id+EXT_TYPE).then(function(resultObj){
      if (resultObj.status === "ok"){
          product_info = resultObj.data;
          showProductInfo(product_info);
      }

    getJSONData(PRODUCT_INFO_COMMENTS_URL+product_id+EXT_TYPE).then(function(resultObj){
      if (resultObj.status === "ok"){
          product_comments = resultObj.data;
          showComments(product_comments);
          const stars_score = document.getElementById("name-and-score");
          let score = getProductScore(product_comments);
          stars_score.innerHTML += score;
        }
    });

    const btn_addToCart = document.getElementById("btn_addToCart");
    btn_addToCart.addEventListener("click", function() {
      const {images, cost, currency, name} = product_info;
      addProductToCart(images, name, cost, currency);
    })
  });
  if (localStorage.getItem("comments")) {
    commentsArray = JSON.parse(localStorage.getItem("comments"));
  }
  });

  btn_comment.addEventListener('click',  function() {
    let comment = document.getElementById("comment-textarea").value;
    addComment(comment);
  });

  // Todo relacionado a la info de los productos
  
  function showProductInfo(array) {
    const {category, cost, currency, description, id, images, name, relatedProducts, soldCount} = array
    let carouselHtml = getCarousel(images);
    let htmlContentToAppend;
    htmlContentToAppend = `
    <div class="d-flex">
    ${carouselHtml}
    <div class="d-flex flex-column justify-content-between w-auto container">
    <div>
    <h6 class="text-secondary"><a class="text-decoration-none text-secondary category-link" href="products.html">${category}</a>  |  ${soldCount} vendidos</h6>
    <h2 class="text-dark">${name} </h2>
    <div id="name-and-score"></div>
    <h3 class="text-dark text-end"><strong>${currency} ${cost}</h3>
    </div>
    <div class="d-flex flex-column align-items-center container" style="gap: 0.5em; width: 500px">
    <button type="button" class="btn btn-primary" style="width: 10em">Comprar ahora</button>
    <button id="btn_addToCart" type="button" class="btn btn-outline-primary" style="width: 10em">Agregar al carrito</button>
    </div>
    </div>
    </div>
    `
    prod_description.innerHTML = description;
    product_info_container.innerHTML += htmlContentToAppend;
    showRelatedProducts(array);
  }

  const getCarousel = (imagesArray) => {
    let count = 0;
    let carouselHeader = `
    <!-- Carousel -->
    <div id="demo" class="carousel slide w-50" data-bs-ride="carousel">
    `

    let carouselIndicators = `<div class="carousel-indicators">`;

    let carouselBody = `<div class="carousel-inner">`;

    let carouselControl = `
    <!-- Left and right controls/icons -->
    <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
    </div>
    `
    imagesArray.forEach( element => {
      
      if (count === 0) {
        carouselBody += `
      <div class="carousel-item active">
        <img src="${element}" class="d-block w-100">
      </div>
      `
      carouselIndicators += `
      <button type="button" data-bs-target="#demo" data-bs-slide-to="${count}" class="active"></button>
      `
      } else {
        carouselBody += `
      <div class="carousel-item">
        <img src="${element}" class="d-block w-100">
      </div>
      `
      carouselIndicators += `
      <button type="button" data-bs-target="#demo" data-bs-slide-to="${count}"></button>
      `
      }
      count += 1;
    });
    carouselBody += `
    </div>
    `
    carouselIndicators += `
    </div>
    `
    return carouselHeader+carouselIndicators+carouselBody+carouselControl;
  }

  const showRelatedProducts = (array) => {
    const relatedProducts_container = document.getElementById("related-products");
    let htmlContentToAppend = "";
    array = array.relatedProducts;
    for (let i = 0; i < array.length; i++) {
      htmlContentToAppend += `
      <div id="relatedProduct-card" class="cursor-active d-flex row justify-content-center border" onClick=(setProductId(${array[i].id})) style="max-width:200px;max-height:400px;">
      <img src="${array[i].image}" style="height: 200px;width: 200px;" class="p-0">
      <h3 class="text-dark text-center pt-2">${array[i].name}<h3>
      </div>
      `
    }
    relatedProducts_container.innerHTML = htmlContentToAppend;
  }

  const getProductScore = (array) => {
    let average_score = 0;
    if (localStorage.getItem("additional_comements_score")) {
      additional_comments_score = JSON.parse(localStorage.getItem("additional_comements_score"));
      additional_comments_score.forEach(element => {
        if (element.product === product_id) {
          array.push(element);
        }
      });
    }
    let htmlScore = `<div class="d-flex" style="gap: 0.2em">`;
    array.forEach( element => {
      average_score += element.score;
    })
    average_score = average_score / array.length;
    if (average_score === 5) {
      for (let i = 0; i < average_score; i++) {
        htmlScore += `
      <i class="bi bi-star-fill rating"></i>
      `
      } 
    } else {
      if (average_score.toString().split('.')[1]) {
        for (let i = 0; i < Math.round(average_score)-1; i++) {
          htmlScore += `
          <i class="bi bi-star-fill rating"></i>
          `
        }
          if (parseInt(average_score.toString().split('.')[1].slice(0,1)) >= 5) {
            htmlScore += `
          <i class="bi bi-star-half rating"></i>
          `
          } else {
            htmlScore += `
            <i class="bi bi-star-fill rating"></i>
            `
          }
        for (let i = Math.round(average_score); i < 5; i++) {
          htmlScore += `
          <i class="bi bi-star rating"></i>
          `
        }
      } else {
        for (let i = 0; i < Math.round(average_score); i++) {
          htmlScore += `
          <i class="bi bi-star-fill rating"></i>
          `
        }
        for (let i = Math.round(average_score); i < 5; i++) {
          htmlScore += `
          <i class="bi bi-star rating"></i>
          `
        }
      }
      
    }
    if (array.length > 1 || array.length === 0) {
      htmlScore += `
    <p class="text-secondary ps-2">${array.length} calificaciones</h3></div>
    `
    } else {
      htmlScore += `
    <p class="text-secondary ps-2">${array.length} calificacion</h3></div>
    `
    }
    return htmlScore;
  }
  
  // Todo relacionado a los comentarios

  const showComments = (array) => {
    let htmlContentToAppend = `
    <div class="container bg-light mt-5 py-4 rounded-1">
    <h2 class="text-primary pb-3">Comentarios sobre el producto:</h2>
    <div id="comments">
    `;

    if (array.length < 1 && !localStorage.getItem("comments")) {
      htmlContentToAppend += `
      <h2>No hay comentarios publicados.</h2>
      ` 
    }
    array.forEach(element => {
      htmlContentToAppend += `
    <div class="container border border-2 pt-3 mb-1 px-0">
    <h4 class="text-primary border-bottom border-2 ps-3 pb-2 m-0">${element.user} - ${getStars(element.score)}</h4>
    <p class="text-dark ps-3 pt-2 bg-white m-0 p-5">${element.description}</p>
    <p class="text-secondary text-end border-top border-2 mb-0 ps-0 pe-3">${element.dateTime}</p>
    </div>
    `
    });
    htmlContentToAppend += `
    </div>
    </div>
    `
    comment_container.innerHTML += htmlContentToAppend;
    if (commentsArray.length > 0) {
      commentsArray.forEach( element => {
        if (element.id == localStorage.getItem("prodId")) {
          const comment_container = document.getElementById("comments");
          comment_container.innerHTML += element.content;
        }
      })
    }
  }

  const addComment = (comment) => {
    if (comment.length >= 6) {
      const comment_container = document.getElementById("comments");
      let user = sessionStorage.getItem("user_email");
      let score = getCommentStars();
      let date = getDate();
      let htmlContentToAppend = `
      <div class="container border border-2 pt-3 mb-1 px-0">
      <h4 class="text-primary border-bottom border-2 ps-3 pb-2 m-0">${user} - ${score}</h4>
      <p class="text-dark ps-3 pt-2 bg-white m-0 p-5 text-break overflow-auto" style="max-height: 80px;">${comment}</p>
      <p class="text-secondary text-end border-top border-2 mb-0 ps-0 pe-3">${date}</p>
      </div>
      `
      document.getElementById("comment-alert").classList.add("d-none");
      comment_container.innerHTML += htmlContentToAppend;
      let userComment = {id: product_info.id, content: htmlContentToAppend};
      commentsArray.push(userComment);
      localStorage.setItem('comments',JSON.stringify(commentsArray));
      
      location.reload();
    } else {
      document.getElementById("comment-alert").classList.remove("d-none");
    }
  }
  
  function getDate() {
    let date = new Date();
    let [year, month, day] = [date.getFullYear(), date.getMonth(), date.getDay()];
    let [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
    if (month <= 9) {
      month = "0"+month;
    }
    if (day <= 9) {
      day = "0"+day;
    }
    if (minutes <= 9) {
      minutes = "0"+minutes
    }
    if (hour <= 9) {
      hour = "0"+hour
    } 
    if (seconds <= 9) {
      seconds = "0"+seconds
    }  
    date = year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
    return date;
  }
  // Todo relacionado a las estrellas
  
  const getStars = (score) => {
    let productScore = "";
    if (score === 5) {
      productScore = `
      <i class="bi bi-star-fill rating"></i>
      <i class="bi bi-star-fill rating"></i>
      <i class="bi bi-star-fill rating"></i>
      <i class="bi bi-star-fill rating"></i>
      <i class="bi bi-star-fill rating"></i>
      `
    } else {
      for (let i = 1; i <= score; i++) {
        productScore += `
        <i class="bi bi-star-fill rating"></i>
        `
      }
      let count = score;
      do {
        productScore += `
        <i class="bi bi-star rating"></i>
        `
        count += 1;
      } while (count < 5)
    }
    return productScore;
  }

  function getCommentStars() {
    let score = `
    <i class="bi ${document.getElementById("1").classList[3]} rating"></i>
    <i class="bi ${document.getElementById("2").classList[3]} rating"></i>
    <i class="bi ${document.getElementById("3").classList[3]} rating"></i>
    <i class="bi ${document.getElementById("4").classList[3]} rating"></i>
    <i class="bi ${document.getElementById("5").classList[3]} rating"></i>
    `;
    let user_score = 0;
    for (let i = 1; i <= 5; i++) {
      if (document.getElementById(i).classList.contains("bi-star-fill")) {
        user_score = i;
      }
    }
    let user_comment = {product: localStorage.getItem("prodId"),score: user_score};
    additional_comments_score.push(user_comment);
    localStorage.setItem("additional_comements_score",JSON.stringify(additional_comments_score));
    return score;
  }

  function changeStar(id) {
    if (document.getElementById("1").classList.contains("bi-star-fill") && !document.getElementById("2").classList.contains("bi-star-fill")) {
      document.getElementById("1").classList.remove("bi-star-fill");
      document.getElementById("1").classList.add("bi-star");
    }
    for (let i = 1; i <= id; i++) {
      if (document.getElementById(id).classList.contains("bi-star-fill")) {
        if (id < 5) {
          if (id < 2) {
            for (let i = id; i <= 5; i++) {
              if (i >= 2) {
                document.getElementById(i).classList.remove("bi-star-fill");
                document.getElementById(i).classList.add("bi-star");
              }
            }
          } else {
            for (let i = id; i <= 5; i++) {
              document.getElementById(i).classList.remove("bi-star-fill");
              document.getElementById(i).classList.add("bi-star");
            }
          }
        } 
      } else {
        document.getElementById(i).classList.remove("bi-star");
        document.getElementById(i).classList.add("bi-star-fill");
      }
      
    }
  }

  const addProductToCart = (img, name, cost, currency) => {
    if (localStorage.getItem("cart_items_number")) {
      localStorage.setItem("cart_items_number", Number.parseInt(localStorage.getItem("cart_items_number"))+1);
      cart = localStorage.getItem("htmlCart").split(',');
    } else {
      localStorage.setItem("cart_items_number", 1);
    }
    document.getElementById("cart-items").innerHTML = localStorage.getItem("cart_items_number");
    let HtmlCart = "";
    HtmlCart = `
    <li class="list-group-item" id="${localStorage.getItem("cart_items_number")}">
        <div class="container p-0 d-flex w-auto" style="height: 150px;">
          <img src="${img[0]}" class="w-auto rounded border">
          <div class="d-flex container flex-column justify-content-between p-0">
            <h3 class="text-dark ps-3">${name}</h3>
            <h4 class="text-muted text-end pe-0">Cantidad: x - ${currency} ${cost}</h4>
          </div>
          <button class="btn-close" onclick="removeItem(this)"></button>
        </div>
      </li>
    `
    cart.push(HtmlCart);
    localStorage.setItem("htmlCart", cart);
  }
  