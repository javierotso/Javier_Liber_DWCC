'user strict'
let array_carrito;
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

//----------------------------------------------------------------------------------- 
//Tienda
function comprar() {
    console.log("funcion comprar");
    let tbody = document.getElementById("contenido-carrito");
    let child = tbody.childNodes;
    let empty = tbody.firstChild.nextSibling;

    if (empty.style.display != "none") {        
        alert("No existen productos que comprar"); 
    } else {
        //Comienda en el tres por que existe un nodo text mas el nodo empty
        for (let i = 3; i < child.length; i++) {
            tbody.removeChild(child[i]);
        }
        empty.removeAttribute("style");        
        alert("Su compra se a realizado con exito")     
    }

}




//----------------------------------------------------------------------------------- 
//Modales
function registerModal(){
    console.log("modal register");
    let modal = document.getElementsByClassName("modal-register");
    let element = modal[0];
    element.removeAttribute("style");
    let cerrar = element.firstElementChild.firstElementChild;
    cerrar.addEventListener("click", close)

    let login = document.getElementById("singIn");
    login.addEventListener("click", () => {
        loginModal();
        element.setAttribute("style", "display: none;");
    });

    let crear = document.getElementById("crear");
    crear.addEventListener("click", () => {
        register();
        element.setAttribute("style", "display: none;");
    });
}

function loginModal(){
    console.log("modal login");
    let modal = document.getElementsByClassName("modal-login");
    let element = modal[0];
    element.removeAttribute("style");
    let cerrar = element.firstElementChild.firstElementChild;
    cerrar.addEventListener("click", close)

    let iniciar = document.getElementById("iniciar");
    iniciar.addEventListener("click", () => {
        login();
        element.setAttribute("style", "display: none;");
    });
    
}

function login(){

}

function register(){

}