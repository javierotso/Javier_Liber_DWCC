//Animacion
//Constante animacion
const radioTotal = 14;
const curvatura = 20;
const timeDot = 450;
// let timePhoto;
const timeAnimateDot = 2;
const velocidadOptima = 168;
const motionDot = '<animateMotion dur="' + timeAnimateDot + 's" path="M0,0 0,-20 z"/>';
// let transformPhoto = '<animateTransform attributeName="transform" attributeType="XML" type="scale" from="1" to="0" dur="' + timeAnimatePhoto + 's"/>';
// let motionPhoto = '<animateMotion dur="' + timeAnimatePhoto + 's"><mpath xlink:href="#path"></mpath></animateMotion>';

//OJO!!! Las animaciones solo me funcionan la primera vez =*(

/**
 * Este método desplaza el punto de contador hacia abajo hasta situarlo en la posicion definitiva
 */
function dropDot() {
    line.removeAttribute('class');
    text.innerHTML = '';
    circle.innerHTML = '';

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
function showUp(timePhoto) {
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
            }, timeDot);
        }
    }, timePhoto);
}
//Solo funcion la primera vez.
function movePhoto(photo) {
    /*Consegimos todos los valores de la imagen para aplicarlos después a la animación */
    // let element = e.target;
    // let photo = element.previousSibling;
    let pathPhoto = photo.src;
    let movePhoto = document.getElementById('movePhoto');

    let cloneSvg = movePhoto.cloneNode(true);

    let heightSvg = heightWeb();
    movePhoto.setAttribute('height', heightSvg);

    let imgProduct = document.getElementById('imgProduct');
    let mask = document.getElementById('mask');
    // movePhoto.removeAttribute('style');

    setTimeout(() => {
        imgProduct.setAttribute('xlink:href', pathPhoto);
        let coordStart = calcularCentro(photo);
        let coordEnd = calcularCentro(document.getElementById("logo-carrito"));

        let ruta = "M " + coordStart['x'] + ' ' + coordStart['y'] + ' Q ' + coordEnd['x'] + ' ' + coordStart['y'] + ' ' + coordEnd['x'] + ' ' + (coordEnd['y'] - 40);
        let path = document.getElementById('path');
        path.setAttribute('d', ruta)

        let timeAnimatePhoto = tiempoAnimacion(coordStart, coordEnd);
        let transformPhoto = '<animateTransform attributeName="transform" attributeType="XML" type="scale" from="1" to="0" dur="' + timeAnimatePhoto + 's"/>';
        let motionPhoto = '<animateMotion dur="' + timeAnimatePhoto + 's"><mpath xlink:href="#path"></mpath></animateMotion>';
        console.log(timeAnimatePhoto);

        mask.innerHTML = transformPhoto + motionPhoto
        let timePhoto = (timeAnimatePhoto * 1000);
        
        
        
        //Tenemos que volver invisible el svg para que nos deje volver a usar la web.
        setTimeout(() => {
            // movePhoto.setAttribute('style', 'display:none');
            // mask.innerHTML = "";
            // movePhoto.removeAttribute('height');
            // path.removeAttribute('d');
            // imgProduct.setAttribute('xlink:href', '');
            movePhoto.parentElement.appendChild(cloneSvg);
            movePhoto.parentElement.removeChild(movePhoto);
        }, timePhoto);
        showUp(timePhoto);
    }, 1);
}

function heightWeb() {
    /*Fijamos la altura de svg a la altura total de la web:
    Para ello buscamos el ultimo objeto visible de la web y tomamos su coordenaday y su altura */
    let elem = document.querySelector('#div-productos>div:last-child');
    let heightWeb = parseFloat(elem.offsetTop) + parseFloat(elem.offsetHeight);
    return heightWeb;
}

function calcularCentro(element) {
    let a = element.getBoundingClientRect();
    let centro = [];
    centro['x'] = parseInt(a.left) + parseInt(element.width / 2);
    centro['y'] = parseInt(a.top) + parseInt(element.height / 2) + parseInt(scrollY);

    return centro;
}

function tiempoAnimacion(inicio, fin) {
    let distancia = Math.sqrt((Math.pow(fin["x"] - inicio["x"], 2)) + (Math.pow(fin["y"] - inicio["y"], 2)));
    return parseFloat(distancia / velocidadOptima).toFixed(1);

}