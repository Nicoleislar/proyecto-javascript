
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function imprimirCarritoEnHTML(arrayCarrito) {
    const contenedor = document.getElementById("carrito");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (arrayCarrito.length === 0) {
        contenedor.innerHTML = `
        <div class="carrito-vacio">
        <p>Tu selección está vacía actualmente.</p>
        </div>
    `;
        actualizarTotal(0);
        return;
    }

    arrayCarrito.forEach((item, index) => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("item-carrito");

        tarjeta.innerHTML = `
        <div class="info-item">
        <span class="icono-item">${item.imagen}</span>
        <h4>${item.nombre}</h4>
        <p class="precio">$${item.precio}</p>
        <button id="btn-eliminar-${index}" class="btn-eliminar" title="Eliminar ítem">✕</button>
        </div>
    `;

        contenedor.appendChild(tarjeta);

        const botonEliminar = document.getElementById(`btn-eliminar-${index}`);
        if (botonEliminar) {
            botonEliminar.addEventListener("click", () => eliminarProductoIndividual(index));
        }
    });

    const total = arrayCarrito.reduce((acc, el) => acc + el.precio, 0);
    actualizarTotal(total);
}


function eliminarProductoIndividual(index) {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    imprimirCarritoEnHTML(carrito);
}

function actualizarTotal(monto) {
    const elementoTotal = document.getElementById("total-compra");
    if (elementoTotal) {
        elementoTotal.textContent = `$${monto}`;
    }
}


const btnVaciar = document.getElementById("vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
        if (carrito.length === 0) return;

        carrito = [];
        localStorage.removeItem("carrito");
        imprimirCarritoEnHTML(carrito);
    });
}


const btnFinalizar = document.getElementById("finalizar-compra");
if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        if (carrito.length === 0) return;

        Swal.fire({
            title: "Reserva Confirmada",
            text: "Gracias por formar parte de la experiencia Nodo Basquiat.",
            icon: "success",
            confirmButtonColor: "#000000"
        }).then(() => {
            carrito = [];
            localStorage.removeItem("carrito");
            imprimirCarritoEnHTML(carrito);
        });
    });
}

if (carrito.length > 0) {
    imprimirCarritoEnHTML(carrito);
} else {
    imprimirCarritoEnHTML([]);
}