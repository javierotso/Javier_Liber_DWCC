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
  borra.addEventListener("click", () => {
    funcionModal = OK_VACIAR;
    createModal("Vaciar carrito", "¿Está seguro de que desea vaciar el carrito?", null);
  });

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

    clienteLogeado = new Cliente(
      user.id,
      user.name,
      user.dni,
      user.phone,
      user.address,
      user.birth,
      user.suscp,
      user.card,
      user.email,
      user.password,
      user.img
    );
    register.removeEventListener("click", registerModal);
    helloUser(clienteLogeado);
  }

  /* Para las animaciones */
  contador = document.getElementById("contador");
  line = document.getElementById("line-contador");
  circle = document.getElementById("circle-contador");
  text = document.getElementById("text-contador");

  /* Obtenemos los productos */
  getProducts();

  /* Obtenemos los usuarios */
  obtenerClientes();
};
