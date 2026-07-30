
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Renderizar la lista del carrito en el HTML
function imprimirCarrito(array) {
    const contenedor = document.getElementById("carrito");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Carrito vacío
    if (array.length === 0) {
        contenedor.innerHTML = `
        <div class="carrito-vacio">
        <p>Tu selección está vacía actualmente.</p>
        </div>
    `;
        actualizarTotal(0);
        return;
    }

    // Estado: Con productos seleccionados 
    array.forEach((item, index) => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("item-carrito");

        tarjeta.innerHTML = `
        <div class="info-item">
        <span class="icono-item">${item.imagen}</span>
        <h4>${item.nombre}</h4>
        <p class="precio">$${item.precio}</p>
        <button data-index="${index}" class="btn-eliminar" title="Eliminar ítem">✕</button>
        </div>
    `;

        contenedor.appendChild(tarjeta);
    });

    // Delegación de eventos para capturar el click en el botón de eliminar individual
    contenedor.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) {
            const indiceEliminar = parseInt(e.target.dataset.index);
            eliminarProductoIndividual(indiceEliminar);
        }
    });

    // Calcular el total de la reserva
    const total = array.reduce((acc, el) => acc + el.precio, 0);
    actualizarTotal(total);
}

// Función para eliminar UN solo producto según su posición en el array
function eliminarProductoIndividual(index) {
    // Eliminamos solo 1 elemento en la posición del click
    carrito.splice(index, 1);

    // Guardamos el cambio en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Re-renderizamos el carrito
    imprimirCarrito(carrito);

    // Notificación rápida
    Toastify({
        text: "Pieza quitada de tu selección",
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "#1a1a1a",
            color: "#ffffff"
        }
    }).showToast();
}

// Función para actualizar el monto total en el DOM
function actualizarTotal(monto) {
    const elementoTotal = document.getElementById("total-compra");
    if (elementoTotal) {
        elementoTotal.textContent = `$${monto}`;
    }
}

// Evento: Vaciar Selección Completa
const btnVaciar = document.getElementById("vaciar-carrito");
if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
        if (carrito.length === 0) return;

        Swal.fire({
            title: "¿Vaciar tu selección?",
            text: "Esta acción eliminará todas las piezas reservadas.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000000",
            cancelButtonColor: "#888888",
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                localStorage.removeItem("carrito");
                imprimirCarrito(carrito);

                Swal.fire({
                    title: "Selección vaciada",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
}

//Finalizar Reserva
const btnFinalizar = document.getElementById("finalizar-compra");
if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "Tu selección está vacía",
                text: "Añade al menos una pieza antes de confirmar.",
                icon: "info",
                confirmButtonColor: "#000000"
            });
            return;
        }

        Swal.fire({
            title: "Reserva Confirmada",
            text: "Gracias por formar parte de la experiencia Nodo Basquiat.",
            icon: "success",
            confirmButtonColor: "#000000"
        }).then(() => {
            carrito = [];
            localStorage.removeItem("carrito");
            imprimirCarrito(carrito);
        });
    });
}


imprimirCarrito(carrito);