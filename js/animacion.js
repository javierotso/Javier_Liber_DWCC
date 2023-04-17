//Animacion
// Variables animacion
let contador;
let line;
let circle;
let text;
//Constante animacion
const radioTotal = 14;
const timeDot = 450;
const timeAnimateDot = 2;
const timePhoto = 3700;
const timeAnimatePhoto = 4.5;
const motionDot = '<animateMotion dur="'+timeAnimateDot+'s" path="M0,0 0,-20 z"/>';
const transformPhoto = '<animateTransform attributeName="transform" attributeType="XML" type="scale" from="1" to="0" dur="'+timeAnimatePhoto+'s"/>';
const motionPhoto = '<animateMotion dur="'+timeAnimatePhoto+'s"><mpath xlink:href="#path"></mpath></animateMotion>';

//OJO!!! Las animaciones solo me funcionan la primera vez =*(

/**
 * Este método hace que el punto de contador se agrande hasta llegar a su tamaño final y después aparece el número
 */
function showUp() {    
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
function movePhoto(e) {
    /*Consegimos todos los valores de la imagen para aplicarlos después a la animación */
    let element = e.target;
    let photo = element.previousSibling;
    let pathPhoto = photo.getAttribute('src');

    let movePhoto = document.getElementById('movePhoto');
    let heightSvg = heightWeb();
    console.log(heightSvg)
    movePhoto.setAttribute('height', heightSvg);

    let imgProduct = document.getElementById('imgProduct');
    let mask = document.getElementById('mask');
    // movePhoto.removeAttribute('style');

    setTimeout(() => {
        imgProduct.setAttribute('xlink:href', pathPhoto);
        let coordStart = calcularCentro(photo);
        let coordEnd = animateEnd(photo, coordStart);
       
        let ruta = "M"+coordStart['x'] +','+coordStart['y'] + ' ' + coordEnd['x'] + ',' + coordEnd['y'];
        
        let path = document.getElementById('path');
        path.setAttribute('d', ruta)
        mask.innerHTML = transformPhoto + motionPhoto       

        //Tenemos que volver invisible el svg para que nos deje volver a usar la web.
        setTimeout(() => {
            // movePhoto.setAttribute('style', 'display:none');
            mask.innerHTML = "";
            movePhoto.removeAttribute('height');
            path.removeAttribute('d');
            imgProduct.setAttribute('xlink:href', '');
        }, timePhoto);
    }, 1);
}

function heightWeb() {
    /*Fijamos la altura de svg a la altura total de la web:
    Para ello buscamos el ultimo objeto visible de la web y tomamos su coordenaday y su altura */
    let elem = document.querySelector('#div-productos div:last-child');
    let heightWeb = parseFloat(elem.offsetTop) + parseFloat(elem.offsetHeight);
    return heightWeb;
}

function calcularCentro(element) {
    let centro = [];
    let xPhoto = element.offsetLeft;
    let yPhoto = element.offsetTop;
    let widthPhoto = element.offsetWidth;
    let heightPhoto = element.offsetHeight;

    let xCentro = parseFloat(xPhoto + widthPhoto / 2);
    let yCentro = parseFloat(yPhoto + heightPhoto / 2);

    centro['x'] = xCentro;
    centro['y'] = yCentro;
    console.log(centro);

    return centro;
}

function animateEnd(photo, centro) {
    /*Consegimos los valores para saber hasta donde llega a la animación */
    let coord = [];
    let carrito = document.getElementById('logo-carrito');
    let coordCarrito = coordElement(carrito);
    console.log(coordCarrito);
    let coordImagen = coordElement(photo);
    console.log(coordImagen);

    /*Calculamos la diferencia entre la prosicion relativa a la ventana de la foto(principio) y del contador(final). Después sumamos la posicion absoluta dentro de la web de la imagen (principio absoluto). Por último hacemos correciones para marcar el punto central del contador. 
    Esto en ambas coordenadas*/
    coord['x'] = parseFloat(centro['x']) + (parseFloat(coordCarrito['x']) - parseFloat(coordImagen['x'])) - 110;
    coord['y'] = parseFloat(centro['y']) + (parseFloat(coordCarrito['y']) - parseFloat(coordImagen['y'])) - 110;
    console.log(coord)
    return coord;
}

function coordElement(element) {
    let coord = [];
    let clientRect = element.getBoundingClientRect();
    /*Coge el tamaño de la ventana y siempre es la misma, aunque haga scroll las dimensiones de de la ventana son las mismas.
        clientRect del carro devuelve siempre:
            DOMRect {x: 640, y: 650, width: 45, height: 45, top: 650, …}*/
    coord['x'] = clientRect.x;
    coord['y'] = clientRect.y;
    return coord;
}
