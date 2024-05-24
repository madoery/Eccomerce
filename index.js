const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const rowProduct = document.querySelector('.row-product');
const productsList = document.querySelector('.container-items');
let allProducts = [];
const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const paymentButton = document.querySelector('.payment-button');

// Función para cargar datos del sessionStorage
const loadCartData = () => {
    const savedData = sessionStorage.getItem('cartData');
    if (savedData) {
        allProducts = JSON.parse(savedData);
        showHTML();
    }
};

// Función para guardar datos en sessionStorage
const saveDataToSessionStorage = () => {
    sessionStorage.setItem('cartData', JSON.stringify(allProducts));
};

// Función para actualizar el carrito y guardar datos
const updateCart = () => {
    showHTML();
    saveDataToSessionStorage();
    togglePaymentButon();
};

// Cargar datos del sessionStorage al inicio
window.addEventListener('DOMContentLoaded', loadCartData);

// Evento al cambiar de sección dentro de la página
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', event => {
        const target = event.target.getAttribute('target');
        // Si el target no es "_self" (mismo frame), guarda los datos temporalmente
        if (target !== '_self') {
            saveDataToSessionStorage();
        }
    });
});

btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
    updateCart();
});

productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        const exists = allProducts.some(product => product.title === infoProduct.title);

        if (exists) {
            const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                }
                return product;
            });
            allProducts = [...products];
        } else {
            allProducts.push(infoProduct);
        }

        updateCart();
    }
});

rowProduct.addEventListener('click', e => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter(product => product.title !== title);

        updateCart();
    }
});

// Función para mostrar HTML
const showHTML = () => {
    if (!allProducts.length) {
        cartEmpty.classList.remove('hidden');
        rowProduct.classList.add('hidden');
        cartTotal.classList.add('hidden');
    } else {
        cartEmpty.classList.add('hidden');
        rowProduct.classList.remove('hidden');
        cartTotal.classList.remove('hidden');
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg> 
        `;

        rowProduct.append(containerProduct);

        total += parseInt(product.quantity) * parseFloat(product.price.replace('$', ''));
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = `$${total}`;
    countProducts.innerText = totalOfProducts;
};

const togglePaymentButon = () => {
    if (allProducts.length > 0) {
        paymentButton.classList.remove('hidden');
    } else {
        paymentButton.classList.add('hidden');
    }
};

// Limpiar datos del sessionStorage al recargar la página completamente o salir de ella
window.addEventListener('beforeunload', event => {
    const target = event.target.activeElement.getAttribute('target');
    if (!target || target !== '_self') {
        sessionStorage.removeItem('cartData');
    }
});
