document.addEventListener('DOMContentLoaded', () => {
    
    const state = {
        carrito: [],
        promo: {
            name: "Proteina Ghost",
            price: 810,
            image: "Ghostprote.png"
        }
    };

    const ui = {
        contador: document.getElementById("contadorCarrito"),
        btnCarrito: document.getElementById("btnCarrito"),
        btnMenu: document.getElementById("btnMenu"),
        navMenu: document.getElementById("navMenu"),
        navLinks: document.querySelectorAll(".nav-link"),
        carritoItems: document.getElementById("carrito-items"),
        totalCompra: document.getElementById("totalCompra"),
        btnComprar: document.getElementById("btnComprar"),
        formContacto: document.getElementById("formContacto"),
        inputTelefono: document.getElementById("inputTelefono"),
        inputMensaje: document.getElementById("inputMensaje"),
        linkPromo2x1: document.getElementById("linkPromo2x1"),
        btnBannerComprar: document.getElementById("btnBannerComprar"),
        modals: {
            carrito: document.getElementById("ventanaCarrito"),
            productos: document.getElementById("modalProductos"),
            promos: document.getElementById("modalPromos"),
            contacto: document.getElementById("modalContacto"),
            promo2x1: document.getElementById("modal2x1")
        },
        closeButtons: document.querySelectorAll(".cerrar")
    };

    function init() {
        setupEventListeners();
    }

    function formatPrice(amount) {
        return `$MXN ${amount.toFixed(2)}`;
    }

    function updateCartLogic() {
        const discounts = state.carrito.filter(item => item.precio < 0);
        const products = state.carrito.filter(item => item.precio >= 0);

        let groups = {};
        let order = [];

        products.forEach(item => {
            if (!groups[item.nombre]) {
                groups[item.nombre] = [];
                order.push(item.nombre);
            }
            groups[item.nombre].push(item);
        });

        let newCart = [];
        order.forEach(name => {
            newCart.push(...groups[name]);
            if (name === state.promo.name) {
                newCart.push(...discounts);
            }
        });

        state.carrito = newCart;
    }

    function calculateDiscounts() {
        state.carrito = state.carrito.filter(item => item.precio >= 0);
        
        const promoCount = state.carrito.filter(item => item.nombre === state.promo.name).length;
        const discountCount = Math.floor(promoCount / 2);

        for (let i = 0; i < discountCount; i++) {
            state.carrito.push({
                nombre: `Aplicando descuento 2x1 en ${state.promo.name}`,
                precio: -state.promo.price,
                imagen: null
            });
        }
    }

    function renderCart() {
        updateCartLogic();
        
        ui.carritoItems.innerHTML = "";
        let total = 0;

        state.carrito.forEach((item, index) => {
            total += item.precio;
            
            const div = document.createElement("div");
            div.className = "cart-item";
            
            const imgHTML = item.imagen 
                ? `<img src="${item.imagen}" alt="${item.nombre}">`
                : `<div style="width:50px;height:50px;background:#eee;display:flex;align-items:center;justify-content:center;font-size:8px;color:black;text-align:center;font-weight:bold;">PROMO<br>2X1</div>`;

            div.innerHTML = `
                ${imgHTML}
                <div class="cart-info">
                    <span>${item.nombre}</span>
                    <span class="cart-precio" style="${item.precio < 0 ? 'color:green;' : ''}">${formatPrice(item.precio)}</span>
                </div>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            ui.carritoItems.appendChild(div);
        });

        ui.totalCompra.innerHTML = `<strong>Total: ${formatPrice(total)}</strong>`;
        
        // CORRECCIÓN: Solo contamos los ítems con precio positivo (productos reales)
        ui.contador.textContent = state.carrito.filter(item => item.precio >= 0).length;
    }

    function addToCart(nombre, precio, imagen) {
        state.carrito.push({ nombre, precio, imagen });
        calculateDiscounts();
        
        // CORRECCIÓN: Solo contamos los ítems con precio positivo (productos reales)
        ui.contador.textContent = state.carrito.filter(item => item.precio >= 0).length;
        
        if (ui.modals.carrito.style.display === "block") {
            renderCart();
        }
    }

    function openModal(modalId) {
        if(ui.modals[modalId]) {
            ui.modals[modalId].style.display = "block";
        }
    }

    function closeModal(modal) {
        modal.style.display = "none";
    }

    function setupEventListeners() {
        
        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-agregar-carrito")) {
                const card = e.target.closest(".tarjetas");
                const name = card.querySelector("h4").textContent;
                
                const priceNew = card.querySelector(".precio-nuevo");
                const priceNormal = card.querySelector(".precios");
                
                let priceText = "0";
                if (priceNew) priceText = priceNew.textContent;
                else if (priceNormal) priceText = priceNormal.textContent;

                const price = parseFloat(priceText.replace("$","").replace("MXN",""));
                const img = card.querySelector("img") ? card.querySelector("img").getAttribute("src") : null;

                addToCart(name, price, img);
                alert(`¡${name} agregado al carrito!`);
            }

            if (e.target.classList.contains("btn-agregar-2x1")) {
                const name = e.target.dataset.nombre;
                const price = parseFloat(e.target.dataset.precio);
                const img = e.target.dataset.imagen;

                addToCart(name, price, img);
                addToCart(name, price, img);
                alert("¡Promo 2x1 Aplicada!");
                
                closeModal(ui.modals.promo2x1);
                renderCart();
                openModal('carrito');
            }
        });

        ui.carritoItems.addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-eliminar")) {
                const idx = Number(e.target.dataset.index);
                state.carrito.splice(idx, 1);
                calculateDiscounts();
                renderCart();
            }
        });

        ui.btnCarrito.addEventListener("click", () => {
            renderCart();
            openModal('carrito');
        });

        ui.closeButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const modal = e.target.closest(".ventana");
                closeModal(modal);
            });
        });

        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("ventana")) {
                closeModal(e.target);
            }
        });

        ui.btnMenu.addEventListener("click", () => {
            ui.navMenu.classList.toggle("activo");
        });

        ui.navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                ui.navMenu.classList.remove("activo");
                const target = e.target.dataset.target;
                
                if (target === "modalProductos") openModal('productos');
                if (target === "modalPromos") openModal('promos');
                if (target === "modalContacto") openModal('contacto');
            });
        });

        if (ui.btnBannerComprar) {
            ui.btnBannerComprar.addEventListener("click", () => openModal('productos'));
        }

        if (ui.linkPromo2x1) {
            ui.linkPromo2x1.addEventListener("click", (e) => {
                e.preventDefault();
                openModal('promo2x1');
            });
        }

        ui.btnComprar.addEventListener("click", () => {
            if (state.carrito.filter(item => item.precio >= 0).length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }
            alert("¡Gracias por tu compra!");
            state.carrito = [];
            renderCart();
            closeModal(ui.modals.carrito);
        });

        if (ui.formContacto) {
            ui.formContacto.addEventListener("submit", (e) => {
                e.preventDefault();
                alert("Gracias por enviar tu comentario. Nosotros te contactaremos.");
                ui.formContacto.reset();
                closeModal(ui.modals.contacto);
            });
        }

        if (ui.inputTelefono) {
            ui.inputTelefono.addEventListener("input", function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
        }

        if (ui.inputMensaje) {
            ui.inputMensaje.addEventListener("input", function() {
                this.style.height = "auto";
                this.style.height = (this.scrollHeight) + "px";
            });
        }
    }

    init();
});