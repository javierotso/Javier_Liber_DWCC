'use strict'

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

    if (clienteLogeado != null) {
        productList.forEach(product => {
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
    fetch(urlProductos).then(data => data.json())
        .then(products => {
            if (products.length > 0) {
                productList = products;
            }
            /*
            Cuando tenemos todos los productos, llamamos a la función que filtrará los productos por tipo de usuario
            */
            filterProductsByUser(productList, filter);
        });

}