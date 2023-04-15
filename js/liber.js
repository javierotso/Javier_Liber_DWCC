'user strict'
/* Cositas por hacer
* La función register que ya existe acabarla (guardar el id en local)
* Función de obterne productos con filtro.
* Sumar el total del carrito
* Añadir Carrusel
* Animacion carrito
* ** Cambiar ruta imagenes 
* **Revisar estilos formulario
* **Revisar entrada salida datos
* **Revisar precio con descuento
*/
//constantes internas
const timeout = 600;
const urlClientes = "data/clientes.json"
const urlProductos = "data/productos.json"

//constantes tienda
const DISCOUNT_CLUB = 0.95;
const DISCOUNT_PREMIUM = 0.90;
const SALES_DEFAULT = 1.00;

//Variables
let correctRegister;
let correctLogin;
let clienteLogeado = null;
let arrayCarrito = [];
let arrayClientes = [];
let arrayProductos = [];
let discount = SALES_DEFAULT;

// Variables animacion
let contador;
let line;
let circle;
let text;



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
    } else {
        seeProductbyUser(null);
    }

    // Variables animacion
    contador = document.getElementById("contador");
    line = document.getElementById("line-contador");
    circle = document.getElementById("circle-contador");
    text = document.getElementById("text-contador");

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
 * Función que muestra seleciona los productos según la suscripción del usuario;
 * @param {*} category Tipo de supcrición del usuario
 */
function seeProductbyUser(category) {
    let salesProducts = [];
    let moreProducts = []
    fetch(urlProductos)
        .then(data => data.json())
        .then(products => {
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let producto = new Producto(product.id, product.name, product.filter, product.path, product.price, product.discount);

                arrayProductos.push(producto);

                if (category != null && category != "basic") {
                    if (producto.discount) {
                        /* Producto de rebajas para el usuario*/
                        salesProducts.push(producto);
                    } else {
                        /* Producto sin rebajas para el usuario*/
                        moreProducts.push(producto);
                    }
                }
            }
        })
        .then(returnProductos => {
            //No entiendo muy bien como funcionan las promesas pero si no lo hago en este then no tengo acceso al array global arrayProductos
            let productos = document.getElementById("div-productos");
            let carrousel = document.getElementById("div-carrousel");;

            if (salesProducts.length > 0) {
                carrousel.removeAttribute("style");
                switch (category) {
                    case "club":
                        discount = DISCOUNT_CLUB;
                        break;
                    case "premium":
                        discount = DISCOUNT_PREMIUM;
                        break;
                }
                createCard(salesProducts, carrousel, discount);
                createCard(moreProducts, productos, discount);
            } else {
                createCard(arrayProductos, productos, discount);
            }

        })

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

        let priceProduct = document.createElement("input");
        let price = parseFloat(element.price) * parseFloat(sales);
        let priceText = "Precio: " + price.toFixed(2) + " €";
        priceProduct.setAttribute("value", priceText);
        priceProduct.setAttribute("type", "button");
        let idProducto = element.id;
        priceProduct.setAttribute("id", idProducto);
        priceProduct.setAttribute("class", "addBag clickeable");
        priceProduct.addEventListener("click", addBag);
        priceProduct.addEventListener("click", movePhoto);

        divProduct.appendChild(nameProduct);
        divProduct.appendChild(imgProduct);
        divProduct.appendChild(priceProduct);
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
    seeDot();

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
            tdName.innerHTML = product.name;
            let tdCount = document.createElement("td");
            tdCount.setAttribute("class", "count");
            let num = document.createElement("p");
            num.innerHTML = 1;
            let divCount = document.createElement("div");
            divCount.addEventListener("click", changeCount);

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

            let count = 1;
            let price = (parseFloat(product.price) * discount * count).toFixed(2);
            tdPrice.innerHTML = price + " € ";

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
function changeCount(e) {
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

    img.addEventListener("click", extend);
    seeProductbyUser(cliente.suscp);

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


//----------------------------------------------------------------------------------- 
//Animacion
//Constante animacion
const radioTotal = 14;
const motionDot = '<animateMotion dur="2s" path="M0,0 0,-20 z"/>';
const transformPhoto = '<animateTransform attributeName="transform" attributeType="XML" type="scale" from="1 1" to="0 0" dur="4s"/>'
const motionPhotoStart = '<animateMotion dur="4s" path="M0,0 '
const motionPhotoEnd = '"/>';



/**
 * Este método hace que el punto de contador se agrande hasta llegar a su tamaño final y despues aparece el número
 */
function seeDot() {
    console.log('animate: seeDot');
    //Me gusta mas que aparezca pero en ese caso no se una 'animate' en java, se anima con css.
    if (arrayCarrito.length < 2) {
        dropDot();
    } else {
        showUp();
    }

}
/**
 * Este método desplaza el punto de contador hacia abajo hasta situarlo en la posicion definitiva
 */
//Solo funciona la primera vez
function dropDot() {
    console.log('animate: dropDot');
    line.removeAttribute('class');
    text.innerHTML = '';

    let num;
    if (arrayCarrito.length > 9) {
        num = '+';
    } else {
        num = arrayCarrito.length;
    }

    if (arrayCarrito.length > 0) {
        contador.removeAttribute("style");
        circle.innerHTML = motionDot;
        text.innerHTML = num + motionDot;
    }
}
/**
 * Este método hace que el punto de contador se agrande hasta llegar a su tamaño final y después aparece el número
 */
function showUp() {
    console.log('animate: showDot');
    circle.setAttribute('r', 0);
    line.removeAttribute('class');
    text.innerHTML = '';

    let num;
    if (arrayCarrito.length > 9) {
        num = '+';
    } else {
        num = arrayCarrito.length;
    }

    /*Necesito el primer setTimeout para que borre la clase y lavuelva a poner y así se reactibe la animación de 'line' */
    setTimeout(() => {
        if (arrayCarrito.length > 0) {
            line.setAttribute('class', 'count-dot');
            contador.removeAttribute("style");
            setTimeout(() => {
                text.innerHTML = num;
                circle.setAttribute('r', radioTotal);
            }, 450);

        }
    }, 1);
}

function movePhoto(e) {
    /*Consegimos todos los valores de la imagen para aplicarlos después a la animación */
    let element = e.target;
    let photo = element.previousSibling;
    let pathPhoto = photo.getAttribute('src');
    
    /*Consegimos tambien los valores para saber hasta donde llega a la animación */
    let xFinal;
    let yFinal;    
    //Probe con las cordenadas de la imagen pero no funciona porque la imagen esta en 0,0 y después posicionada; =*(    
    // xFinal = parseFloat(window.innerWidth) - 75;
    // console.log(window.innerWidth);
    // console.log(xFinal);
    // yFinal = parseFloat(window.innerHeight) - 75;

    //No funciona porque coge el tamaño de la ventana y sienpre es la misma aunque haga scroll las dimensiones de de la ventana son las mismas
    /*let elem = document.getElementById('logo-carrito');
    let clientRect = elem.getBoundingClientRect();
    console.log(clientRect);
    //Devuelve siempre
        /*DOMRect {x: 640, y: 650, width: 45, height: 45, top: 650, …}
        bottom: 695
        height: 45
        left: 640
        right: 685
        top: 650
        width: 45
        x: 640
        y: 650
        [[Prototype]]: DOMRect

    xFinal = clientRect.x;
    yFinal = clientRect.y;*/

    
    let movePhoto = document.getElementById('movePhoto');
    let heightSvg = heightWeb();
    movePhoto.setAttribute('height', heightSvg);

    let imgProduct = document.getElementById('imgProduct');
    let mask = document.getElementById('mask');

    setTimeout(() => {
        movePhoto.removeAttribute('style');
        imgProduct.setAttribute('xlink:href', pathPhoto);
        let centro = calcularCentro(photo);
        mask.setAttribute("x", centro['x']);
        mask.setAttribute("y", centro['y']);

        // let motionPhoto = motionPhotoStart + xFinal + ',' + yFinal+ motionPhotoEnd;
        // mask.innerHTML = transformPhoto + motionPhoto;
        // console.log(motionPhoto);


        //Tenemos que volver invisible el svg para que nos deje volver a usar la web.
        // setTimeout(() => {
        //     movePhoto.setAttribute('style', 'display:none');
        //     mask.innerHTML = "";
        // }, 5000);
    }, 1);
}

function heightWeb(){
    /*Fijamos la altura de svg a la altura total de la web:
    Para ello buscamos el ultimo objeto visible de la web y tomamos su coordenaday y su altura */
    let elem = document.querySelector('#div-productos div:last-child');
    let heightWeb = parseFloat(elem.offsetTop) + parseFloat(elem.offsetHeight);
    return heightWeb;
}

function calcularCentro(element){
    let centro =[];
    let xPhoto = element.offsetLeft;
    let yPhoto = element.offsetTop;
    let widthPhoto = element.offsetWidth;
    let heightPhoto = element.offsetHeight;

    let xCentro = parseFloat(xPhoto + widthPhoto / 2);
    let yCentro = parseFloat(yPhoto + heightPhoto / 2);

    centro['x'] = xCentro;
    centro['y'] = yCentro;

    return centro;

}

