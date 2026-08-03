
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function imprimirProductosEnHTML(arrayProductos) {
    const contenedor = document.getElementById("productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    for (const producto of arrayProductos) {
        const card = document.createElement("article");
        card.classList.add("tarjeta-producto");

        card.innerHTML = `
            <div class="contenedor-img">
                <span class="icono-producto">${producto.imagen}</span>
            </div>
            <h3>${producto.nombre}</h3>
            <p class="descripcion">${producto.descripcion}</p>
            <p class="precio">$${producto.precio}</p>
            <button id="btn-agregar-${producto.id}" class="card-boton">Añadir a mi selección</button>
        `;

        contenedor.appendChild(card);

        const boton = document.getElementById(`btn-agregar-${producto.id}`);

        boton.addEventListener("click", () => agregarAlCarrito(producto));
    }
}

function agregarAlCarrito(producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

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
        text: `${producto.nombre} se guardó en tu selección.`,
    });
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