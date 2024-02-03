
//Traemos la info que este guardada en localStorage
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

//Conectamos al HTML
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorcarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#acciones-carrito");
let botonesEliminar = document.querySelector(".carrito-producto-eliminar");
let numerito = document.querySelector("#numerito");
const botonVaciar = document.querySelector("#accion-vaciar");
const total = document.querySelector("#total");
const botonComprar = document.querySelector("#comprar");

function cargarProductosCarrito() {

    if (productosEnCarrito && productosEnCarrito.length > 0) {

        // Limpiamos el contenido actual del contenedor
        contenedorcarritoProductos.innerHTML = "";

        contenedorCarritoVacio.classList.add("disabled");
        contenedorcarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");


        productosEnCarrito.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                        
            <div class="carrito-imagen-container">
            <img class="carrito-imagen" src="${producto.imagen}" alt="${producto.nombre}">
            </div>  

            <div class="carrito-producto-titulo centrar">            
            <h3 class="nombre-producto-carrito">${producto.nombre}</h3>
            </div>

            <div class="carrito-producto-cantidad centrar">            
            <div class="cantidad-contador">
                <p class="mas-menos">-</p>
                <p class="numero-cantidad">${producto.cantidad}</p>
                <p class="mas-menos">+</p>
            </div>
            </div>

            <div class="carrito-producto-precio centrar">            
            <p>$ ${producto.precio}</p>
            </div>

            <div class="carrito-producto-subtotal centrar">
            <p>$ ${producto.precio * producto.cantidad}</p>
            </div>
         
            <div>
            <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash3"></i></button>
            </div>        
            `;

            contenedorcarritoProductos.append(div);
            actualizarNumerito();

        })

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorcarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
    }

};

cargarProductosCarrito();

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = String(nuevoNumerito || 0);
}





function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
};

function eliminarDelCarrito(e) {
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    productosEnCarrito.splice(index, 1);

    // Actualizar el carrito primero
    cargarProductosCarrito();

    // Luego, actualizar el numerito
    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}


botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
    actualizarNumerito();
}


function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$ ${totalCalculado}`;
}


botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
    actualizarNumerito();

    //Aqui debo agregar de una libreria el Muchas gracias por tu compra. 
}