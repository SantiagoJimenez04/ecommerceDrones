
//Conectamos con el HTML

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
let botonesAgregar = document.querySelectorAll(".agregar-producto");
const numerito = document.querySelector("#numerito");

const inputBuscar = document.querySelector("#inputBuscar");
const botonBuscar = document.querySelector("#botonBuscar");
const mensajeAlerta = document.querySelector("#mensaje-alerta");
const contenedorSpinner = document.querySelector("#cargando");

// Funciones

//Función para cargar todos los productos al HTML
function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="imagen-producto" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="detalles-producto">
                <h3 class="nombre-producto">${producto.nombre}</h3>
                <p class="precio-producto">$ ${producto.precio}</p>
                <button class="agregar-producto" id="${producto.id}">Agregar al Carrito</button>
            </div>
        `;
        contenedorProductos.append(div);
    })
    actualizarBotonesAgregar();
};
cargarProductos(productos);


// Botones de Categorias (dron,baterias,accesorios...)
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("activado"));
        e.currentTarget.classList.add("activado");

        if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            cargarProductos(productos);
        }
    })
});

// Esta función actualiza el Boton agregar así filtre con los botones. 
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".agregar-producto");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

//Traemos la info que este guardada en localStorage
let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}




//Función para agregar al Carrito
function agregarAlCarrito(e) {

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnCarrito.some(producto => producto.id === idBoton)) {

        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

};

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}



// Función para buscar productos


// Evento al presionar Enter en el input
inputBuscar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        realizarBusquedaConCarga();
    }
});

// Evento al hacer clic en el botón de búsqueda
botonBuscar.addEventListener("click", () => {
    realizarBusquedaConCarga();
});

// Evento al cambiar el valor del input
inputBuscar.addEventListener("input", () => {
    if (inputBuscar.value.trim() === "") {
        ocultarMensajeAlerta();
        cargarProductos(productos);
    }
});

function realizarBusquedaConCarga() {
    mostrarSpinner();

    setTimeout(() => {
        realizarBusqueda();
        ocultarSpinner();
    }, 2000); // Ejemplo: oculta el elemento de carga después de 2 segundos
}

function realizarBusqueda() {
    const valorBusqueda = inputBuscar.value.trim().toLowerCase();

    if (valorBusqueda === "") {
        ocultarMensajeAlerta();
        cargarProductos(productos);
    } else {
        const palabrasClave = valorBusqueda.split(" ");
        const resultado = productos.filter((producto) => {
            const nombreProducto = producto.nombre.toLowerCase();
            return palabrasClave.every(palabra => nombreProducto.includes(palabra));
        });

        if (resultado.length > 0) {
            ocultarMensajeAlerta();
            cargarProductos(resultado);
        } else {
            mostrarMensajeAlerta();
        }
    }
}


function mostrarSpinner() {
    contenedorSpinner.classList.remove("disabled");
}

function ocultarSpinner() {
    contenedorSpinner.classList.add("disabled");
}

document.addEventListener("DOMContentLoaded", function() {
    ocultarMensajeAlerta();
});

function mostrarMensajeAlerta() {
    mensajeAlerta.classList.remove("d-none");
}

function ocultarMensajeAlerta() {
    mensajeAlerta.classList.add("d-none");
}








