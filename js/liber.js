'user strict'
const timeout = 1500;
const urlClientes = "data/clientes.json"
const urlProductos = "data/productos.json"

const DISCOUNT_CLUB = 0.95;
const DISCOUNT_PREMIUM = 0.80;
const SALES_DEFAULT = 1.00;

let correctRegister;
let correctLogin;
let cliente = null;
let arrayCarrito = [];
let arrayClientes = [];
let arrayProductos = [];
let discount = SALES_DEFAULT;




window.onload = () => {
    let menu = document.getElementById("img-menu");
    menu.addEventListener("click", extend);

    let carrito = document.getElementById("logo-carrito");
    carrito.addEventListener("click", extend);
    let cerrarCarrito = document.getElementById("cerrar-carrito");
    cerrarCarrito.addEventListener("click", close);

    let register = document.getElementById("user-title");
    register.addEventListener("click", registerModal);

    let compra = document.getElementById("comprar");
    compra.addEventListener("click", comprar);
    let borrar = document.getElementById("borrar");
    borrar.addEventListener("click", clearBag);

    let cerrarSesion = document.getElementById("cerrar-sesion");
    cerrarSesion.addEventListener("click", closeSesion);

    let user = JSON.parse(localStorage.getItem("user"));
    console.log("localStorage user:", user);
    if (user != null) {
        cliente = new Cliente(user.id, user.name, user.dni, user.phone, user.address, user.birth, user.suscp, user.card, user.email, user.password);
        register.removeEventListener("click", registerModal);
        helloUser(cliente);
    } else {
        seeProductbyUser(null);
    }
}

function extend(e) {
    let element = e.target;
    let visibleNode;
    // No tengo ni idea porque necesito moverme dos elementos para adelante pero si no no lo hace bien (coje un texto)
    visibleNode = element.nextSibling.nextSibling;
    if (visibleNode.style.display != "none") {
        visibleNode.setAttribute("style", "display: none;");
    } else {
        visibleNode.removeAttribute("style");
    }
}

function close(e) {
    let element = e.target;

    visibleNode = element.parentNode.parentNode;
    if (visibleNode.style.display != "none") {
        visibleNode.setAttribute("style", "display: none;");
    } else {
        visibleNode.removeAttribute("style");
    }
}

function seeProductbyUser(category) {
    let salesProducts = [];
    let moreProducts = []
    fetch(urlProductos)
        .then(data => data.json())
        .then(products => {
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                let producto = new Producto(product.id, product.name, product.filter, product.path, product.price, product.discount);
                if (category != null && category != "basic") {
                    if (producto.discount) {
                        salesProducts.push(producto);

                    } else {
                        moreProducts.push(producto);
                    }
                }
                arrayProductos.push(producto);
                arrayProductos[producto.id] = producto;
            }

        })
        .then(returnProductos => {
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
                createCard(moreProducts, productos, SALES_DEFAULT);
            } else {
                createCard(arrayProductos, productos, SALES_DEFAULT);
            }

        })

}

function createCard(array, divParent, sales) {
    console.log("crear cartas", array);
    array.forEach(element => {
        let divProduct = document.createElement("div");
        divProduct.setAttribute("class", "card");
        let nameProduct = document.createElement("p");
        let name = element.name;
        nameProduct.innerHTML = name;

        let imgProduct = document.createElement("img");
        let img = element.path;
        imgProduct.setAttribute("src", img);

        let priceProduct = document.createElement("input");
        let price = parseFloat(element.price) * parseFloat(sales);
        let priceText = "Precio: " + price.toFixed(2) + " €";
        priceProduct.setAttribute("value", priceText);
        priceProduct.setAttribute("type", "button");
        let idProducto = element.id;
        priceProduct.setAttribute("id", idProducto);
        priceProduct.setAttribute("class", "addBag");
        priceProduct.addEventListener("click", addBag);

        divProduct.appendChild(nameProduct);
        divProduct.appendChild(imgProduct);
        divProduct.appendChild(priceProduct);
        divParent.appendChild(divProduct);
    });
}



//----------------------------------------------------------------------------------- 
//Tienda
function comprar() {
    console.log("funcion comprar");
    let tbody = document.getElementById("contenido-carrito");
    let child = tbody.childNodes;

    console.log("carro",arrayCarrito.length)
    if (arrayCarrito.length > 0) {
        clearBag();        
        alert("Su compra se a realizado con exito");
    } else {
        alert("No existen productos que comprar");
    }

}

function addBag(e) {
    console.log("añadir carrito")
    let element = e.target;
    let id = element.id;
    let repeat = false;
    let product = arrayProductos[id];
    console.log(arrayCarrito);
    if (arrayCarrito.length > 0) {
        for (let i = 0; i < arrayCarrito.length && !repeat; i++) {
            const article = arrayCarrito[i];
            if (article.id == id) {
                repeat = true;
            }
        }
        if (!repeat) {
            console.log("aqui: ", product)
            arrayCarrito.push(product);
            // falta añadir la relacion en el json pedido
        }
    } else {
        console.log("o aqui")
        arrayCarrito.push(product);
    }
    listBag(arrayCarrito);
}

function listBag(array) {
    console.log("lista carro");
    console.log(array);
    let tbody = document.getElementById("contenido-carrito");
    clearBag();

    let empty = document.getElementById("empty");
    if (empty.style.display != "none") {
        empty.setAttribute("style", "display: none;");
    }


    array.forEach(product => {
        let tr = document.createElement("tr");
        tr.setAttribute("class", "list");

        let tdName = document.createElement("td");
        tdName.innerHTML = product.name;
        let tdCount = document.createElement("td");

        let tdPrice = document.createElement("td");

        let count = 1;
        let price = parseFloat(product.price) * discount * count;
        tdPrice.innerHTML = price + " € ";

        tr.appendChild(tdName);
        tr.appendChild(tdCount);
        tr.appendChild(tdPrice);
        tbody.appendChild(tr);
    });
}

function clearBag() {    
    // //No se por queno funciona =( =(
    // let clearChild = document.getElementsByClassName("list");
    // console.log("limpiar", clearChild);
    // console.log("dimension:", clearChild.length);
    // for (let i = 0; i < clearChild.length; i++) {
    //     const element = clearChild[i];
    //     element.parentElement.removeChild(element);
    // }

    // let empty = document.getElementById("empty");
    // if (empty.style.display != "none") {
    //     empty.setAttribute("style", "display: none;");
    // } else {
    //     empty.removeAttribute("style");
    // }

    //Al menos a machete si funciona =P    
    arrayCarrito = [];
    // debería borrar relaciones los pedidos
    let contenido = document.getElementById("contenido-carrito");
    contenido.innerHTML="";
    let empty = document.createElement("tr");
    empty.setAttribute("id", "empty");
    let tdEmpty = document.createElement("td");
    tdEmpty.setAttribute("colspan", "3");
    tdEmpty.innerHTML="No existen productos que mostrar";

    empty.appendChild(tdEmpty);
    contenido.appendChild(empty);
}



//----------------------------------------------------------------------------------- 
//Sesion
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
                        localStorage.setItem('user', JSON.stringify(user));
                        correct = true;
                        message = "Ha iniciado sesión con exito"
                    }
                }
            }
        })
        .then(returnLogin => {
            alertMessage(correct, p, message, element);
        })
}

function closeSesion() {
    localStorage.removeItem("user");
    cliente = null;
    window.location.reload();
}


//----------------------------------------------------------------------------------- 
//Usuario
function helloUser(cliente) {
    console.log("hola", cliente.name);
    let title = document.getElementById("user-title");
    let textHello = "Hola " + cliente.name;
    title.innerHTML = textHello;
    let img = document.getElementById("user-img");
    img.setAttribute("src", cliente["img"]);

    img.addEventListener("click", extend);
    seeProductbyUser(cliente.suscp);
}


//----------------------------------------------------------------------------------- 
//Modales
function registerModal() {
    console.log("modal register");
    //Limpiamos alerta 
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

function loginModal() {
    //Limpiamos alerta 
    let pLogin = document.getElementById("login-ok");
    pLogin.removeAttribute("style");
    pLogin.innerHTML = "";

    console.log("modal login");
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

// function fetchJson(url) {
//     return fetch(url)
//         .then(data => data.json())
// }

