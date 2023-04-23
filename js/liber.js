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
const DEFAULT_IMG = "img/user/usuario.jpg"
const OK_BORRAR = 1;
const OK_VACIAR = 2;

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
let usersList = [];
let funcionModal = OK_BORRAR;

/*Lista de productos */
let allProductList = [];
allProductList["salesProduct"] = [];
allProductList["products"] = [];

/**
 * Función que despliega los menus;
 */
function extend(e) {
    /* Elemento pulsado para saber que menu desplegar */
    let element = e.target;
    /* Esto es mejorable */
    if (e.target.getAttribute("id") == "logo-carrito") {
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
        /**Pongo interval para que se vayan moviendo los productos */
        setInterval(moverCarrouselDerecha, 4000);
        createCard(products["products"], divProductos, SALES_DEFAULT);
    } else {
        createCard(products["products"], divProductos, SALES_DEFAULT);
        noSuscpCarrousel(products["products"]);
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
        productPrice.addEventListener("click", (e) => {
            let repeat = false;
            for (let i = 0; i < arrayCarrito.length && !repeat; i++) {
                const article = arrayCarrito[i];
                if (article.id == idProducto) {
                    repeat = true;

                }
            }
            if (!repeat) {
                addBag(e);
                movePhoto(imgProduct);
            }
        });

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
    let tbody = document.getElementById("contenido-carrito");
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
    clearBag();
    arrayCarrito = [];
}

/**
 * Función que añade un producto al carro
 */
function addBag(e) {
    //Debería abrirse la cesta de manera automática¿?
    let element = e.target;
    let id = element.id;
    let product = arrayProductos[id];

    arrayCarrito.push(product);

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

            let tdImg = document.createElement("td");
            tdImg.classList.add("td-img");
            let img = document.createElement("img");
            img.classList.add("img-carrito");
            img.src = product.path;
            img.atl = product.name;
            tdImg.appendChild(img);
            tr.appendChild(tdImg);

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

            let plus = document.createElement("input");
            plus.setAttribute("type", "button");
            plus.setAttribute("value", "+");
            plus.classList.add("clickeable");
            let less = document.createElement("input");
            less.setAttribute("type", "button");
            less.setAttribute("value", "-");
            less.classList.add("clickeable");

            plus.addEventListener("click", (e) => {
                changeCount(e, product);
            });
            less.addEventListener("click", (e) => {
                changeCount(e, product);
            });


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
    if (arrayCarrito.length > 0) {
        let clearChild = document.querySelectorAll(".list");

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
        document.getElementById("contador").style.display = "none";
        totalCarrito();
    }
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
        if (count == 0) {
            createModal("Eliminar articulo", "¿Quiere quitar el objeto del carro?", trParent);
            funcionModal = OK_BORRAR;

        } else {
            num.innerHTML = count;
        }
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
    productTotal.innerHTML = (productPrice * parseInt(num.innerHTML)).toFixed(2) + "€";
    totalCarrito();

}

function restarFila(trParent) {
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
    /*
    Cambié esta función para que valide usuarios que se registran después y no están guardados en los ficheros
    */
    let correct = false;
    let message = "Compruebe su email y contraseña";

    let userName = document.getElementById("login-username").value;
    let userPass = document.getElementById("user-password").value;

    for (let i = 0; i < usersList.length && !correct; i++) {
        let user = usersList[i];
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

/**
 * Funcion que muestra un mensaje de vivenvenida para el usuario, asi como su foto y su carro 
 * @param {*} cliente Objeto del cliente que ha iniciao sesión 
 */
function helloUser(cliente) {
    let title = document.getElementById("user-title");
    title.classList.remove("clickeable");
    let textHello = "Hola " + cliente.name;
    title.innerHTML = textHello;
    let img = document.getElementById("user-img");
    img.src = cliente["img"];

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

/**
 * Método que crea un modal de confirmación
 * @param {*} title Cabecera del modal
 * @param {*} msg Mensaje del modal
 * @param {*} tr Cuando sea necesario se mandará el objeto tr necesario para la funcion restarFila
 */
function createModal(title, msg, tr) {
    let body = document.querySelector('body');
    let modal = document.createElement('div');
    modal.setAttribute('id', 'divModal');
    modal.setAttribute('class', 'modal');
    let modal_text = '<div><h1>' + title + '</h1><hr/><p>' + msg + '</p><br/><div id="modal-responde" class="buttons"><input id="aceptar" type="button" class="clickeable" value="Aceptar"/><input id="cancelar" type="button" class="clickeable" value="Cancelar"/></div></div>'
    modal.innerHTML = modal_text;
    body.appendChild(modal);
    modalEscucha(tr);
}
/**
 * Método que pone a la escucha los botones del modal
 * @param {*} tr Cuando sea necesario se mandará el objeto tr necesario para la funcion restarFila
 */
function modalEscucha(tr) {
    let btnAccept = document.getElementById("aceptar");
    btnAccept.addEventListener("click", () => {
        switch (funcionModal) {
            case OK_BORRAR:
                restarFila(tr);
                cerrarModal();
                break;
            case OK_VACIAR:
                borrar();
                cerrarModal();
                break;
        }
    }, { once: true });

    document.getElementById("cancelar").addEventListener("click", cerrarModal, { once: true });
}
/**
 * Método para cerrar el modal una vez selecionas una opción
 */
function cerrarModal() {
    let modal = document.getElementById("divModal");
    modal.parentElement.removeChild(modal);
}

