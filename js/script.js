// Recuperar carrito guardado en el Storage o inicializarlo vacío
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Renderizar los productos en HTML
function imprimirProductosEnHTML(array) {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    for (const producto of array) {
        const card = document.createElement("article");
        card.classList.add("tarjeta-producto");

        card.innerHTML = `
        <div class="contenedor-img">
        <span class="icono-producto">${producto.imagen}</span>
        </div>
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            <p class="precio">$${producto.precio}</p>
            <button data-id="${producto.id}" class="card-boton">Añadir a mi selección</button>
    `;

        contenedor.appendChild(card);
    }


    contenedor.addEventListener("click", (e) => {
        if (e.target.classList.contains("card-boton")) {
            const idProducto = parseInt(e.target.dataset.id);
            const productoSeleccionado = array.find((item) => item.id === idProducto);

            if (productoSeleccionado) {
                agregarAlCarrito(productoSeleccionado);

                // Feedback visual con SweetAlert2 (sin usar alert nativo)
                Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.onmouseenter = Swal.stopTimer;
                        toast.onmouseleave = Swal.resumeTimer;
                    },
                }).fire({
                    icon: "success",
                    title: "Pieza añadida",
                    text: `${productoSeleccionado.nombre} se guardó en tu selección.`,
                });
            }
        }
    });
}

// Guardar y sincronizar con localStorage
function agregarAlCarrito(producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


fetch("./data/productos.json")
    .then((response) => {
        if (!response.ok) {
            throw new Error("No se pudo cargar la base de datos");
        }
        return response.json();
    })
    .then((data) => {
        imprimirProductosEnHTML(data);
    })
    .catch(() => {
        const contenedor = document.getElementById("productos");
        if (contenedor) {
            contenedor.innerHTML = "<p>Ocurrió un error al cargar la colección.</p>";
        }
    });