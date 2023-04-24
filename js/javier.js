"use strict";

/**
 * Función que llamaremos cuando un usuario seleccione un tipo de producto en el menú lateral
 *
 * @param {*} e evento
 */
function filtrarProductosEvent(e) {
  let elementId = e.target.getAttribute("id");
  if (elementId !== "nav") {
    getProducts(elementId);
    document.getElementById("nav").style.display = "none";

    /*
        Mostrar título de donde estamos
        */
    let title = document.getElementById("title");
    let titleTxt = "Todo";

    switch (elementId) {
      case "cosmetic":
        titleTxt = "Cosmética";
        break;
      case "higiene":
        titleTxt = "Higiene";
        break;
      case "perfumeria":
        titleTxt = "Perfumería";
        break;
      case "cabello":
        titleTxt = "Cabello";
        break;
      case "maquillaje":
        titleTxt = "Maquillaje";
        break;
    }
    title.innerHTML = titleTxt;
  }
}

/**
 *
 * @param products array con todos los productos disponibles.
 * @param filter categoría deseada para filtrar los productos.
 *
 */
function getFilteredProducts(productList, filter) {
  let filteredProducts = [];
  filteredProducts.salesProduct = [];
  filteredProducts.products = [];
  /*
    Filtramos los productos
    */
  productList.products.forEach((product) => {
    if (product.filter == filter) {
      filteredProducts.products.push(product);
    }
  });
  /*
    Filtramos los productos en oferta 
    */
  productList.salesProduct.forEach((product) => {
    if (product.filter == filter) {
      filteredProducts.salesProduct.push(product);
    }
  });
  return filteredProducts;
}

/**
 * Función que separa los productos según el tipo de usuario y los muestra por pantalla
 *
 */
function filterProductsByUser(productList, filter) {
  allProductList["salesProduct"] = [];
  allProductList["products"] = [];

  if (clienteLogeado != null && clienteLogeado.suscp != "basic") {
    productList.forEach((product) => {
      if (product.discount) {
        allProductList["salesProduct"].push(product);
      } else {
        allProductList["products"].push(product);
      }
    });
  } else {
    allProductList["products"] = productList;
  }

  /* Si no hay filtro de tipo de producto, listo, en caso contrario, hay que filtrar por categoria */
  if (filter && filter.toLowerCase() !== "todos") {
    allProductList = getFilteredProducts(allProductList, filter);
  }

  showProductsByUser(allProductList);
}

/**
 *
 * Función que obtiene todos los productos dispobibles en el fichero.
 *
 */
function getProducts(filter) {
  let productList = [];
  fetch(urlProductos)
    .then((data) => data.json())
    .then((products) => {
      if (products.length > 0) {
        productList = products;
      }
      arrayProductos = products;
      /*
            Cuando tenemos todos los productos, llamamos a la función que filtrará los productos por tipo de usuario
            */
      filterProductsByUser(productList, filter);
    });
}

// ESTAS FUNCIONES DEBERÍAMOS HACERLAS DE OTRA FORMA

/**
 * Función para mover el carrousel a la derecha
 */
function moverCarrouselDerecha() {
  let divCarrousel = document.getElementById("div-carrousel");
  let primeraCard = divCarrousel.firstElementChild;

  divCarrousel.removeChild(primeraCard);
  divCarrousel.appendChild(primeraCard);
}

/**
 * Función para mover el carrousel a la izquierda
 */
function moverCarrouselIzquierda() {
  let divCarrousel = document.getElementById("div-carrousel");
  let primeraCard = divCarrousel.firstElementChild;
  let ultimaCard = divCarrousel.lastElementChild;

  divCarrousel.removeChild(ultimaCard);

  divCarrousel.insertBefore(ultimaCard, primeraCard);
}

/**
 * Cambia el valor del total del carrito
 */
function totalCarrito() {
  let carrito = document.querySelectorAll("#contenido-carrito tr.list");
  let totalCarrito = 0;
  carrito.forEach((tr) => {
    let id_producto = tr.getAttribute("name");
    let totalProducto = parseFloat(
      document.getElementById("price-" + id_producto).innerHTML
    );
    totalCarrito = totalCarrito + totalProducto;
  });
  let total = document.getElementById("total-carrito");
  total.innerHTML = totalCarrito.toFixed(2) + "€";
}

/**
 * Guarda en una variable local todos los usuarios que están en el fichero clientes
 */
function obtenerClientes() {
  fetch(urlClientes)
    .then((data) => data.json())
    .then((users) => {
      usersList = users;
    });
}

/**
 * Funcion para registrar un nuevo usuario
 * @param {*} p Elemento de tipo parrafo donde se mostrarán las alertas
 * @param {*} element Elemento del modal
 */
function register(p, element) {
  let correct = true;
  let msg = "Se ha registrado correctamente";

  let fullName = document.getElementById("register-name").value.trim();
  let dni = document.getElementById("register-dni").value.trim();
  let phone = document.getElementById("register-phone").value.trim();
  let address = document.getElementById("register-address").value.trim();
  let birthDate = document.getElementById("register-birth").value.trim();
  let suscp = document.getElementById("register-suscp").value.trim();
  let email = document.getElementById("register-email").value.trim();
  let card = document.getElementById("register-card").value.trim();
  let pwd = document.getElementById("login-password").value;
  let repeatPwd = document.getElementById("login-repeat-password").value;

  console.log(dni);
  if (
    dni != null &&
    dni != "" &&
    phone != null &&
    phone != "" &&
    suscp != null &&
    suscp != "" &&
    email != null &&
    email != "" &&
    pwd != null &&
    pwd != "" &&
    repeatPwd != null &&
    repeatPwd != ""
  ) {
    if (pwd == repeatPwd) {
      for (let i = 0; i < usersList.length && correct; i++) {
        let user = usersList[i];
        if (user.email == email || user.dni == dni || user.phone == phone) {
          correct = false;
          msg = "Ya existe un usuario registrado con los datos introducidos";
        }
      }
    } else {
      correct = false;
      msg = "Las contraseñas no coinciden";
    }
  } else {
    correct = false;
    msg = "Por favor, rellene todos los campos obligatorios";
  }

  if (correct) {
    let userId = parseInt(usersList[usersList.length - 1].id) + 1;
    let user = new Cliente(
      userId,
      fullName,
      dni,
      phone,
      address,
      birthDate,
      suscp,
      card,
      email,
      pwd,
      DEFAULT_IMG
    );
    usersList.push(user);
    localStorage.setItem("user", JSON.stringify(user));
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

  alertMessage(correct, p, msg, element);
}

function noSuscpCarrousel(products) {
  let myProducts = [];

  products.forEach((product) => {
    if (product.discount) {
      myProducts.push(product);
    }
  });

  let carrousel = document.getElementById("carrousel");
  let divCarrousel = document.getElementById("div-carrousel");
  carrousel.removeAttribute("style");
  divCarrousel.removeAttribute("style");
  divCarrousel.innerHTML = "";
  createCard(myProducts, divCarrousel, DISCOUNT_PREMIUM);

  /*
    Tapamos el carrousel 
    */
  let cubreCarrousel = document.getElementById("cubreCarrousel");
  if (cubreCarrousel == null) {
    let cubreCarrusel = document.createElement("div");
    cubreCarrusel.setAttribute("class", "cubreCarrousel");
    cubreCarrusel.setAttribute("id", "cubreCarrousel");
    let h1 = document.createElement("h1");
    h1.innerHTML = "¡SUSCRÍBETE PARA ACCEDER A ESTAS OFERTAS!";
    h1.style.color = "hsl(209, 51%, 29%)";
    cubreCarrusel.appendChild(h1);
    carrousel.parentElement.insertBefore(cubreCarrusel, carrousel);
  }
}
