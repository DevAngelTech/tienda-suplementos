console.log("Página de Suplementos cargada");

const contador = document.querySelector(".contador");
const botonCarrito = document.querySelector(".carrito");
const botonesAgregar = document.querySelectorAll(".tarjetas .estilos");

const modal = document.getElementById("ventanaCarrito");
const cerrarModal = document.querySelector(".cerrar");
const carritoItems = document.getElementById("carrito-items");
const totalCompra = document.getElementById("totalCompra");

let carrito = [];

function formateaPrecio(n) {
    return `$MXN ${n.toFixed(2)}`;
}

function renderCarrito() {
    carritoItems.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;

        const div = document.createElement("div");
        div.className = "cart-item"; 
        
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="cart-info">
                <span>${item.nombre}</span>
                <span class="cart-precio">${formateaPrecio(item.precio)}</span>
            </div>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        `;
        carritoItems.appendChild(div);
    });

    totalCompra.innerHTML = `<strong>Total: ${formateaPrecio(total)}</strong>`;
    contador.textContent = carrito.length;
}

botonesAgregar.forEach(boton => {
    boton.addEventListener("click", (e) => {
        const tarjeta = e.currentTarget.closest(".tarjetas");
        
        const nombre = tarjeta.querySelector("h4").textContent;
        const precio = parseFloat(tarjeta.querySelector(".precios").textContent.replace("$",""));
        const imagen = tarjeta.querySelector("img").getAttribute("src");

        carrito.push({ nombre, precio, imagen });

        contador.textContent = carrito.length;
        
        if (modal.style.display === "block") renderCarrito(); 
    });
});

botonCarrito.addEventListener("click", () => {
    renderCarrito();
    modal.style.display = "block";
});

cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

carritoItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        const i = Number(e.target.dataset.index); 
        carrito.splice(i, 1);
        renderCarrito();
    }
});

const btnComprar = document.getElementById("btnComprar");

btnComprar.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    alert("¡Gracias por tu compra!");

    carrito = [];
    renderCarrito();
    modal.style.display = "none";
});