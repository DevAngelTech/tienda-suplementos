console.log("Página de Suplementos cargada");

const contador = document.querySelector(".contador");
const botonCarrito = document.querySelector(".carrito");

const modalCarrito = document.getElementById("ventanaCarrito");
const modalProductos = document.getElementById("modalProductos");
const modalPromos = document.getElementById("modalPromos");
const modalContacto = document.getElementById("modalContacto");

const botonesCerrar = document.querySelectorAll(".cerrar");

const carritoItems = document.getElementById("carrito-items");
const totalCompra = document.getElementById("totalCompra");
const btnComprarCarrito = document.getElementById("btnComprar");

let carrito = [];

const NOMBRE_PROMO = "Proteina Ghost";
const PRECIO_PROMO = 810;

function formateaPrecio(n) {
    return `$MXN ${n.toFixed(2)}`;
}

function organizarCarrito() {
    const descuentos = carrito.filter(item => item.precio < 0);
    const productos = carrito.filter(item => item.precio >= 0);

    let grupos = {};
    let ordenNombres = [];

    productos.forEach(item => {
        if (!grupos[item.nombre]) {
            grupos[item.nombre] = [];
            ordenNombres.push(item.nombre);
        }
        grupos[item.nombre].push(item);
    });

    let nuevoCarrito = [];
    ordenNombres.forEach(nombre => {
        nuevoCarrito.push(...grupos[nombre]);

        if (nombre === NOMBRE_PROMO) {
            nuevoCarrito.push(...descuentos);
        }
    });

    carrito = nuevoCarrito;
}

function actualizarDescuentos() {
    carrito = carrito.filter(item => item.precio >= 0);

    const cantidadPromo = carrito.filter(item => item.nombre === NOMBRE_PROMO).length;
    const descuentosAplicar = Math.floor(cantidadPromo / 2);

    for (let i = 0; i < descuentosAplicar; i++) {
        carrito.push({
            nombre: `Aplicando descuento 2x1 en ${NOMBRE_PROMO}`,
            precio: -PRECIO_PROMO,
            imagen: null
        });
    }
}

function renderCarrito() {
    organizarCarrito();

    carritoItems.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;

        const div = document.createElement("div");
        div.className = "cart-item"; 
        
        const imgTag = item.imagen 
            ? `<img src="${item.imagen}" alt="${item.nombre}">` 
            : `<div style="width:50px;height:50px;background:#eee;display:flex;align-items:center;justify-content:center;font-size:8px;color:black;text-align:center;font-weight:bold;">PROMO<br>2X1</div>`;

        div.innerHTML = `
            ${imgTag}
            <div class="cart-info">
                <span>${item.nombre}</span>
                <span class="cart-precio" style="${item.precio < 0 ? 'color:green;' : ''}">${formateaPrecio(item.precio)}</span>
            </div>
            <button class="btn-eliminar" data-index="${index}">Eliminar</button>
        `;
        carritoItems.appendChild(div);
    });

    totalCompra.innerHTML = `<strong>Total: ${formateaPrecio(total)}</strong>`;
    contador.textContent = carrito.length;
}

function agregarAlCarrito(nombre, precio, imagen) {
    carrito.push({ nombre, precio, imagen });
    
    actualizarDescuentos();
    
    contador.textContent = carrito.length;
    if (modalCarrito.style.display === "block") renderCarrito();
    console.log(`Agregado: ${nombre}`);
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-agregar-carrito")) {
        const tarjeta = e.target.closest(".tarjetas");
        
        const nombre = tarjeta.querySelector("h4").textContent;
        const precioNuevoObj = tarjeta.querySelector(".precio-nuevo");
        const precioNormalObj = tarjeta.querySelector(".precios");
        
        let precioTexto = "0";
        if (precioNuevoObj) {
            precioTexto = precioNuevoObj.textContent;
        } else if (precioNormalObj) {
            precioTexto = precioNormalObj.textContent;
        }

        const precio = parseFloat(precioTexto.replace("$","").replace("MXN",""));
        
        const imgTag = tarjeta.querySelector("img");
        const imagen = imgTag ? imgTag.getAttribute("src") : null;

        agregarAlCarrito(nombre, precio, imagen);
        alert(`¡${nombre} agregado al carrito!`);
    }
});

const navProductos = document.getElementById("navProductos");
const navPromos = document.getElementById("navPromos");
const navContacto = document.getElementById("navContacto");
const btnBannerComprar = document.getElementById("btnBannerComprar");
const btnOfertaHome = document.getElementById("btnOfertaHome");

function abrirModal(modal) {
    modal.style.display = "block";
}

function cerrarTodo() {
    modalCarrito.style.display = "none";
    modalProductos.style.display = "none";
    modalPromos.style.display = "none";
    modalContacto.style.display = "none";
}

navProductos.addEventListener("click", (e) => { e.preventDefault(); abrirModal(modalProductos); });
navPromos.addEventListener("click", (e) => { e.preventDefault(); abrirModal(modalPromos); });
navContacto.addEventListener("click", (e) => { e.preventDefault(); abrirModal(modalContacto); });

botonCarrito.addEventListener("click", () => {
    renderCarrito();
    abrirModal(modalCarrito);
});

if(btnBannerComprar) {
    btnBannerComprar.addEventListener("click", () => abrirModal(modalProductos));
}
if(btnOfertaHome) {
    btnOfertaHome.addEventListener("click", () => abrirModal(modalPromos));
}

botonesCerrar.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.target.closest(".ventana").style.display = "none";
    });
});

window.addEventListener("click", (e) => {
    if (e.target.classList.contains("ventana")) {
        e.target.style.display = "none";
    }
});

carritoItems.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        const i = Number(e.target.dataset.index); 
        
        carrito.splice(i, 1);
        
        actualizarDescuentos();
        
        renderCarrito();
    }
});

btnComprarCarrito.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }
    alert("¡Gracias por tu compra!");
    carrito = [];
    renderCarrito();
    modalCarrito.style.display = "none";
});

const formContacto = document.getElementById("formContacto");
const inputTelefono = document.getElementById("inputTelefono");


if(inputTelefono){
    inputTelefono.addEventListener("input", function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

if(formContacto) {
    formContacto.addEventListener("submit", (e) => {
        e.preventDefault(); 
        
        alert("Gracias por enviar tu comentario. Nosotros te contactaremos.");
        
        formContacto.reset();
        modalContacto.style.display = "none";
    });
}

const btnMenu = document.getElementById("btnMenu");
const menuNav = document.getElementById("navMenu");

if(btnMenu && menuNav) {
    btnMenu.addEventListener("click", () => {
        menuNav.classList.toggle("activo");
    });

    menuNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menuNav.classList.remove("activo");
        });
    });
}

const linkPromo2x1 = document.getElementById("linkPromo2x1");
const modal2x1 = document.getElementById("modal2x1");
const btnsAgregar2x1 = document.querySelectorAll(".btn-agregar-2x1");

if(linkPromo2x1) {
    linkPromo2x1.addEventListener("click", (e) => {
        e.preventDefault();
        modal2x1.style.display = "block";
    });
}

btnsAgregar2x1.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const nombre = e.target.getAttribute("data-nombre");
        const precioUnitario = parseFloat(e.target.getAttribute("data-precio"));
        const imagen = e.target.getAttribute("data-imagen");

        agregarAlCarrito(nombre, precioUnitario, imagen);
        agregarAlCarrito(nombre, precioUnitario, imagen);

        alert("¡Promo 2x1 Aplicada!");
        
        modal2x1.style.display = "none";
        renderCarrito();
        document.getElementById("ventanaCarrito").style.display = "block";
    });
});