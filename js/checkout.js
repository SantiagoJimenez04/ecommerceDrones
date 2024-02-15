
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
                        <button class="btn-menos mas-menos">-</button>
                        <p class="numero-cantidad">${producto.cantidad}</p>
                        <button class="btn-mas mas-menos">+</button>
                    </div>
                </div>

                <div class="carrito-producto-precio centrar">            
                    <p>$${producto.precio.toLocaleString("en-US")}</p>
                </div>

                <div class="carrito-producto-subtotal centrar">
                    <p>$${(producto.precio * producto.cantidad).toLocaleString("en-US")}</p>
                </div>
             
                <div>
                <button class="carrito-producto-eliminar" id="${producto.id}">
                <i class="bi bi-trash3"></i>
                </button>
                </div>`;

            contenedorcarritoProductos.append(div);

            // Añadir eventos a los botones de cantidad
            const btnMenos = div.querySelector('.btn-menos');
            const btnMas = div.querySelector('.btn-mas');

            btnMenos.addEventListener('click', () => {
                modificarCantidad(producto.id, -1);
            });

            btnMas.addEventListener('click', () => {
                modificarCantidad(producto.id, 1);
            });
        });

        actualizarBotonesEliminar();
        actualizarTotal();
        actualizarNumerito(); // Agregamos la actualización del numerito aquí
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorcarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
    }
}


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

    Toastify({
        text: "Producto Eliminado",
        duration: 2000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: {
            background: "rgb(184,118,171)",
            background: "linear-gradient(193deg, rgba(184,118,171,1) 38%, rgba(255,4,0,0.9780287114845938) 100%)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".7rem"
        },
        onClick: function () { } // Callback after click
    }).showToast();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}


botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Quieres vaciar el carrito?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos del carrito.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
            actualizarNumerito();
        }
    })
}




function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado.toLocaleString("en-US")}`;
}


botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {

    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
    actualizarNumerito();

    //Aqui debo agregar de una libreria el Muchas gracias por tu compra. 
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Tu compra ha sido exitosa. ¡Disfrutala!",
        showConfirmButton: false,
        timer: 2500
    });
}




// Función para modificar la cantidad 

function modificarCantidad(idProducto, cantidadModificada) {
    const index = productosEnCarrito.findIndex(producto => producto.id === idProducto);

    if (index !== -1) {
        const producto = productosEnCarrito[index];

        // Actualizar la cantidad
        producto.cantidad += cantidadModificada;

        // Validar que la cantidad no sea menor a 1
        if (producto.cantidad < 1) {
            producto.cantidad = 1;
        }

        // Actualizar la Local Storage
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

        // Volver a cargar los productos en el carrito
        cargarProductosCarrito();
    }
}

