'user strict'
/* Cositas por hacer
* La función register que ya existe acabarla (guardar el id en local)
* LISTO --------------- Función de obtener productos con filtro. 
* LISTO --------------- Sumar el total del carrito
* LISTO --------------- Añadir Carrusel
* Animacion carrito
* ** Cambiar ruta imagenes 
* ** Revisar estilos formulario
* ** Revisar entrada salida datos
* LISTO --------------- ** Revisar precio con descuento
*/
//constantes internas
const timeout = 1500;
const urlClientes = "data/clientes.json"
const urlProductos = "data/productos.json"

//constantes tienda
const DISCOUNT_CLUB = 0.95;
const DISCOUNT_PREMIUM = 0.80;
const SALES_DEFAULT = 1.00;

//Variables
let correctRegister;
let correctLogin;
let clienteLogeado = null;
let arrayCarrito = [];
let arrayClientes = [];
let arrayProductos = [];
let discount = SALES_DEFAULT;

/*Lista de productos */
let allProductList = [];
allProductList["salesProduct"] = [];
allProductList["products"] = [];




window.onload = () => {
    /*Escucha del menu lateral*/
    let menu = document.getElementById("img-menu");
    menu.addEventListener("click", extend);
    /*Escucha del icono carrito*/
    let carrito = document.getElementById("div-logo-carrito");
    carrito.addEventListener("click", extend);
    /*Escucha cerrar lista carrito*/
    let cerrarCarrito = document.getElementById("cerrar-carrito");
    cerrarCarrito.addEventListener("click", close);
    /*Escucha texto de registro usuario*/
    let register = document.getElementById("user-title");
    register.addEventListener("click", registerModal);
    /*Escucha la foto de usuario para cerrar sesion*/
    let cerrarSesion = document.getElementById("cerrar-sesion");
    cerrarSesion.addEventListener("click", closeSesion);
    /*Escucha del boton borrar*/
    let borra = document.getElementById("borrar");
    borra.addEventListener("click", borrar);

    /* Ponemos a la escucha los filtros del menú lateral */
    const NAV = document.getElementById("nav");
    NAV.addEventListener("click", filtrarProductosEvent);

    /* Ponemos a la escucha los botones del carrusel */
    const BTN_LEFT = document.getElementById("moverIzquierda");
    BTN_LEFT.addEventListener("click", moverCarrouselIzquierda);

    const BTN_RGHT = document.getElementById("moverDerecha");
    BTN_RGHT.addEventListener("click", moverCarrouselDerecha);

    /*Comprobar que si existe un usuario logeado*/
    let user = JSON.parse(localStorage.getItem("user"));
    console.log("localStorage user:", user);
    if (user != null) {
        /*Escucha del boton comprar solo si hay usuario*/
        let compra = document.getElementById("comprar");
        compra.addEventListener("click", comprar);

        clienteLogeado = new Cliente(user.id, user.name, user.dni, user.phone, user.address, user.birth, user.suscp, user.card, user.email, user.password, user.img);
        register.removeEventListener("click", registerModal);
        helloUser(clienteLogeado);
    }

    /*Obtenemos los productos */
    getProducts();

}

/**
 * Función que despliega los menus;
 */
function extend(e) {
    /* Elemento pulsado para saber que menu desplegar */
    let element = e.target;
    /* Esto es mejorable */
    if (e.target.getAttribute("id") == "logo-carrito") {
        console.log(element);
        element = element.parentNode;
    }
    /* Elemento "hermano" que debe mostrarse/ocultarse */
    // No tengo ni idea porque necesito moverme dos elementos para adelante pero si no no lo hace bien (coje un texto)
    let visibleNode = element.nextSibling.nextSibling;

    if (visibleNode.style.display != "none") {
        visibleNode.setAttribute("style", "display: none;");
    } else {
        visibleNode.removeAttribute("style");
    }
}
/**
 * Función que cierra las ventanas con icono de cerrar;
 */
function close(e) {
    /* Elemento pulsado para saber quedebemos cerrar */
    let element = e.target;
    /* Elemento "abuelo" que debe cerrarse */
    let visibleNode = element.parentNode.parentNode;

    if (visibleNode.style.display != "none") {
        visibleNode.setAttribute("style", "display: none;");
    } else {
        visibleNode.removeAttribute("style");
    }
}
/**
 * 
 * @param {*} products array con los productos a mostrar, ha de tener un key "salesProduct" (con los productos en oferta) 
 * y otro "products" con el resto de productos.
 */
function showProductsByUser(products) {
    let divProductos = document.getElementById("div-productos");
    let divCarrousel = document.getElementById("div-carrousel");;

    if (clienteLogeado != null && clienteLogeado.suscp != "basic") {
        divCarrousel.removeAttribute("style");
        switch (clienteLogeado.suscp) {
            case "club":
                discount = DISCOUNT_CLUB;
                break;
            case "premium":
                discount = DISCOUNT_PREMIUM;
                break;
        }
        createCard(products["salesProduct"], divCarrousel, discount);
        createCard(products["products"], divProductos, SALES_DEFAULT);
    } else {
        createCard(products["products"], divProductos, SALES_DEFAULT);
    }
}

/**
 * Función que crea las tarjetar de los productos
 * @param {*} array Array con los elementos de los que debe crear la tarjeta
 * @param {*} divParent Elemento contenedor padre de las tarjetas
 * @param {*} sales El descuento que debe de aplicarsele al precio del producto
 */
function createCard(array, divParent, sales) {
    divParent.innerHTML = "";
    array.forEach(element => {
        let divProduct = document.createElement("div");
        divProduct.setAttribute("class", "card");
        let nameProduct = document.createElement("p");
        let name = element.name;
        nameProduct.innerHTML = name;

        let imgProduct = document.createElement("img");
        imgProduct.classList.add("cardImg");
        let img = element.path;
        imgProduct.setAttribute("src", img);


        /*
        He modificado esto, haciéndolo con un div para que me permita tachar parte del contenido
        */
        let productPrice = document.createElement("div");

        let price = parseFloat(element.price) * parseFloat(sales);
        let idProducto = element.id;

        productPrice.setAttribute("id", idProducto);
        productPrice.setAttribute("class", "addBag clickeable price");
        productPrice.addEventListener("click", addBag);

        /*
        Cambiamos el value en caso de que estemos en el carrousel
        */
        let priceText = "Precio: ";
        if (divParent.id == "div-carrousel") {
            priceText = priceText + price.toFixed(2) + "€ <small><del>" + parseFloat(element.price).toFixed(2) + "€</del></small>";
        } else {
            priceText = priceText + price.toFixed(2) + "€";
        }
        productPrice.innerHTML = priceText;

        /*
        Aquí añadimos los listener para cambiar el contenido al pasar por encima
        */
        productPrice.addEventListener("mouseenter", () => {
            productPrice.innerHTML = "Añadir al carrito";
        });
        productPrice.addEventListener("mouseleave", () => {
            productPrice.innerHTML = priceText;
        });

        divProduct.appendChild(nameProduct);
        divProduct.appendChild(imgProduct);
        divProduct.appendChild(productPrice);
        divParent.appendChild(divProduct);
    });
}


//----------------------------------------------------------------------------------- 
//Tienda
/**
 * Función que simula la realización de la compra de todos los productos del carro
 */
function comprar() {
    console.log("funcion comprar");
    let tbody = document.getElementById("contenido-carrito");

    console.log("carro:", arrayCarrito.length)
    if (arrayCarrito.length > 0) {
        arrayCarrito = [];
        clearBag();
        alert("Su compra se a realizado con exito");
    } else {
        alert("No existen productos que comprar");
    }
}

/**
 * Función que borra todos los productos el carro
 */
function borrar() {
    if (confirm("¿Seguro que desea borrar su carro?")) {
        arrayCarrito = [];
        clearBag();
    }
}

/**
 * Función que añade un producto al carro
 */
function addBag(e) {
    //Debería abrirse la cesta de manera automática¿?
    console.log("añadir carrito")
    let element = e.target;
    let id = element.id;
    let product = arrayProductos[id];

    let totalBag = document.getElementById("total-carrito");

    if (arrayCarrito.length > 0) {
        let repeat = false;
        for (let i = 0; i < arrayCarrito.length && !repeat; i++) {
            const article = arrayCarrito[i];
            if (article.id == id) {
                repeat = true;
            }
        }
        if (!repeat) {
            arrayCarrito.push(product);
            // falta añadir la relacion en el json pedido
        }
    } else {
        arrayCarrito.push(product);
    }

    /* Cada vez que se añada un producto se muestra en la lista automaticamente*/
    listBag(arrayCarrito);
    totalCarrito();

}
/**
 * Función que crea la tabla del carro con los productos añadidos
 * @param {*} array Array con los objetos del carro
 */
function listBag(array) {
    if (array.length > 0) {
        console.log("lista carro");
        console.log(arrayCarrito);
        let tbody = document.getElementById("contenido-carrito");
        /* Borramos toda la lista*/
        clearBag();
        /* Ocultamos el texto de que no existe producto*/
        let empty = document.getElementById("empty");
        if (empty.style.display != "none") {
            empty.setAttribute("style", "display: none;");
        }

        array.forEach(product => {
            let tr = document.createElement("tr");
            tr.setAttribute("class", "list");
            tr.setAttribute("name", product.id);

            let tdName = document.createElement("td");
            tdName.classList.add("descp");
            tdName.innerHTML = product.name;
            let tdCount = document.createElement("td");
            tdCount.setAttribute("class", "count");
            let num = document.createElement("p");
            /*Añado id para poder cambiar los totales */
            let id_num = "count-" + product.id;
            num.setAttribute("id", id_num);
            num.innerHTML = 1;
            let divCount = document.createElement("div");
            divCount.addEventListener("click", (e) => {
                changeCount(e, product);
            });

            let plus = document.createElement("input");
            plus.setAttribute("type", "button");
            plus.setAttribute("value", "+");
            plus.classList.add("clickeable");
            // plus.addEventListener("click", changeCount);
            let less = document.createElement("input");
            less.setAttribute("type", "button");
            less.setAttribute("value", "-");
            less.classList.add("clickeable");

            // less.addEventListener("click", changeCount);

            let tdPrice = document.createElement("td");
            /*Añado id para cambiar totales */
            let id_price = "price-" + product.id;
            tdPrice.setAttribute("id", id_price);

            let count = 1;
            /*
            Cambio esto, porque estaba aplicando descuento a todos los productos y no solo a los seleccionados
            */
            let price;
            if (product.discount) {
                price = (parseFloat(product.price) * discount).toFixed(2);
            } else {
                price = parseFloat(product.price).toFixed(2);
            }
            tdPrice.innerHTML = price + "€";

            tr.appendChild(tdName);
            tr.appendChild(tdCount);
            tdCount.appendChild(num);
            tdCount.appendChild(divCount);
            divCount.appendChild(plus);
            divCount.appendChild(less);
            tr.appendChild(tdPrice);
            tbody.appendChild(tr);
        });
    }
}
/**
 * Función que borra la tabla del carro.
 */
function clearBag() {
    //No se por queno funciona =( =(
    let clearChild = document.querySelectorAll(".list");
    console.log("limpiar", clearChild);
    console.log("dimension:", clearChild.length);
    for (let i = 0; i < clearChild.length; i++) {
        const element = clearChild[i];
        element.parentElement.removeChild(element);
    }
    let empty = document.getElementById("empty");
    if (empty.style.display != "none") {
        empty.setAttribute("style", "display: none;");
    } else {
        empty.removeAttribute("style");
    }
    totalCarrito();

    // //Al menos a machete si funciona =P       
    // // debería borrar relaciones los pedidos
    // let contenido = document.getElementById("contenido-carrito");
    // contenido.innerHTML = "";
    // let empty = document.createElement("tr");
    // empty.setAttribute("id", "empty");
    // let tdEmpty = document.createElement("td");
    // tdEmpty.setAttribute("colspan", "3");
    // tdEmpty.innerHTML = "No existen productos que mostrar";

    // empty.appendChild(tdEmpty);
    // contenido.appendChild(empty);
}
/**
 * Función que suma/resta unidades del producto selecionado
 * Si la cantidad es 0 saltará una ventana de confirmación que preguntará si se desea eliminar el producto
 */
function changeCount(e, product) {
    /* Elemento pulsado para saber si es suma o resta */
    let element = e.target;
    /* Elemento contenedor del número */
    let num = element.parentNode.previousElementSibling;
    /* Elemento fila de la tabla */
    let trParent = element.parentNode.parentNode.parentNode;
    let count;

    if (element.value == "+") {
        count = parseInt(num.innerHTML) + 1;
        num.innerHTML = count;
    } else if (element.value == "-") {
        count = parseInt(num.innerHTML) - 1;
        num.innerHTML = count;
    }

    /*
    Aquí cambio el subtotal
    */
    let id_Price = "price-" + product.id;
    let productTotal = document.getElementById(id_Price);
    let productPrice;

    if (product.discount) {
        productPrice = (parseFloat(product.price) * discount).toFixed(2);
    } else {
        productPrice = parseFloat(product.price).toFixed(2);
    }
    productTotal.innerHTML = (productPrice * count).toFixed(2) + "€";

    if ((num.innerHTML) == 0) {
        if (confirm("¿Quiere quitar el objeto del carro?")) {
            trParent.parentNode.removeChild(trParent);
            /*Borrar articulo de arrayCarrito*/
            let id = trParent.getAttribute("name");
            let repeat = false;
            for (let i = 0; i < arrayCarrito.length && !repeat; i++) {
                const article = arrayCarrito[i];
                if (article.id == id) {
                    repeat = true;
                    arrayCarrito.splice(i, 1);
                }
            }
        } else {
            num.innerHTML = 1;
        }
    }
    if (arrayCarrito.length == 0) {
        clearBag();
    }

    totalCarrito();
}


//----------------------------------------------------------------------------------- 
//Sesion
/**
 * Funcion para iniciar sesion
 * @param {*} p Elemento de tipo parrafo donde se mostrarán las alertas
 * @param {*} element Elemento del modal
 */
function login(p, element) {
    console.log("function login");
    let correct = false;
    let message = "Compruebe su email y contraseña";

    let userName = document.getElementById("login-username").value;
    let userPass = document.getElementById("user-password").value;

    fetch(urlClientes)
        .then(data => data.json())
        .then(users => {
            for (let i = 0; i < users.length && !correct; i++) {
                let user = users[i];
                if (user.email == userName) {
                    if (user.password == userPass) {
                        /* Guardamos el usuario en el localStorage para tener siempre acceso */
                        localStorage.setItem('user', JSON.stringify(user));
                        correct = true;
                        message = "Ha iniciado sesión con exito"
                    }
                }
            }

            alertMessage(correct, p, message, element);
        })
}
/**
 * Funcion para cerrar sesion
 */
function closeSesion() {
    /* Eliminamos el usuario del localStorage */
    localStorage.removeItem("user");
    clienteLogeado = null;
    window.location.reload();
}


//----------------------------------------------------------------------------------- 
//Usuario
/**
 * Funcion para registrar un nuevo usuario
 * @param {*} p Elemento de tipo parrafo donde se mostrarán las alertas
 * @param {*} element Elemento del modal
 */
function register(p, element) {
    console.log("function register");
    let correct = false;
    let message = "Ha ocurrido un error. Porfavor vuelva a intentarlo";

    // Recoger los valores de todos los campos (puede ser un for?)
    // let userName = document.getElementById("register-name").value;;

    fetch(urlClientes)
        .then(data => data.json())
        .then(users => {
            for (let i = 0; i < users.length && !correct; i++) {
                let user = users[i];
                //comprobar datos  
                //correct = true;
                //message = "Se ha regirtrado con exito";        
            }
        })
        .then(returnLogin => {
            alertMessage(correct, p, message, element);
        })
}
/**
 * Funcion que muestra un mensaje de vivenvenida para el usuario, asi como su foto y su carro 
 * @param {*} cliente Objeto del cliente que ha iniciao sesión 
 */
function helloUser(cliente) {
    console.log("hola", cliente.img);
    let title = document.getElementById("user-title");
    title.classList.remove("clickeable");
    let textHello = "Hola " + cliente.name;
    title.innerHTML = textHello;
    let img = document.getElementById("user-img");
    console.log
    img.src = cliente["img"];
    console.log(img);

    /* Mostramos flechas de carrousel */
    document.getElementById("moverDerecha").style.display = "flex";
    document.getElementById("moverIzquierda").style.display = "flex";

    img.addEventListener("click", extend);

    listBag(arrayCarrito);
}


//----------------------------------------------------------------------------------- 
//Modales
/**
 * Función que muestra el formulario de registro para un nuevo usuario
 */
function registerModal() {
    console.log("modal register");
    /* Limpiamos las alertas previas, si las hay*/
    let pUser = document.getElementById("register-ok");
    pUser.removeAttribute("style");
    pUser.innerHTML = "";

    let modal = document.getElementsByClassName("modal-register");
    let element = modal[0];
    element.removeAttribute("style");

    let cerrar = element.firstElementChild.firstElementChild;
    cerrar.addEventListener("click", close);

    let login = document.getElementById("singIn");
    login.addEventListener("click", () => {
        loginModal();
        element.setAttribute("style", "display: none;");
    });

    let crear = document.getElementById("crear");
    crear.addEventListener("click", () => {
        register(pUser, element)
    });
}
/**
 * Función que muestra el formulario de acceso un usuario ya registrado
 */
function loginModal() {
    console.log("modal login");
    //Limpiamos alerta 
    let pLogin = document.getElementById("login-ok");
    pLogin.removeAttribute("style");
    pLogin.innerHTML = "";

    let modal = document.getElementsByClassName("modal-login");
    let element = modal[0];
    element.removeAttribute("style");

    let cerrar = element.firstElementChild.firstElementChild;
    cerrar.addEventListener("click", close)

    let iniciar = document.getElementById("iniciar");
    iniciar.addEventListener("click", () => {
        login(pLogin, element);
    });

}
/**
 * Función que crea un mensaje de acierto/error en los formularios
 * @param {*} correct Booleano para saber si el mensaje es de acierto o error
 * @param {*} p Elemento parrafo donde se ubicará el mensaje
 * @param {*} message String con el mensaje a mostrar
 * @param {*} element Elemento con el modal a cerrar.
 */
function alertMessage(correct, p, message, element) {
    p.innerHTML = message;
    if (correct) {
        p.setAttribute("style", "color: #247037");
        setTimeout(() => {
            //borrar los datos formulario¿?  
            p.removeAttribute("style");
            p.innerHTML = "";
            element.setAttribute("style", "display: none;");
            window.location.reload();
        }, timeout);

    } else {
        p.setAttribute("style", "color: #C82424");
    }

}

