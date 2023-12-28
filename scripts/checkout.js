import { cart, removeFromCart, updateDeliveryOption } from '../data/cart.js';
import { fetchProducts, products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

// Fetch de los productos si todavia no fueron cargados
async function ensureProductsLoaded() {
  if (products.length === 0) {
    await fetchProducts();
  }
}

// Funcion para que se muestre la seccion de order summary
async function renderOrderSummary() {
  await ensureProductsLoaded();
  let cartSummaryHTML = '';
  let totalItemPrice = 0;
  let shippingAndHandling = 0;
  let taxRate = 0.1; // 10%

  cart.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) {
      return; // Saltea la iteracion si el producto no se encuentra
    }
    const itemPrice = parseFloat(product.price);
    const itemQuantity = parseInt(cartItem.quantity, 10);

    if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
      totalItemPrice += itemPrice * itemQuantity;
    } else {
      console.error(
        `Invalid price or quantity for product ID: ${cartItem.productId}`
      );
    }

    const deliveryOption = deliveryOptions.find(
      (option) => option.id === cartItem.deliveryOptionId
    );
    if (deliveryOption) {
      shippingAndHandling += deliveryOption.priceCents / 100;
    }
    const deliveryDate = dayjs()
      .add(deliveryOption.deliveryDays, 'days')
      .format('dddd, MMMM D');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${product.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryDate}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${product.title}
            </div>
            <div class="product-price">
              $${product.price}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${
                  cartItem.quantity
                }</span>
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                product.id
              }">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(product, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  let totalBeforeTax = totalItemPrice + shippingAndHandling;
  let estimatedTax = totalBeforeTax * taxRate;
  let orderTotal = totalBeforeTax + estimatedTax;

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
  updateOrderSummaryDisplay(
    totalItemPrice,
    shippingAndHandling,
    totalBeforeTax,
    estimatedTax,
    orderTotal
  );
  attachEventListeners();
  updateCheckoutHeader();
}

function updateOrderSummaryDisplay(itemPrice, shipping, subtotal, tax, total) {
  const updateTextContent = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = `$${value.toFixed(2)}`;
    } else {
      console.error(`Element not found for selector: ${selector}`);
    }
  };

  updateTextContent('.items-cost', itemPrice);
  updateTextContent('.shipping-cost ', shipping);
  updateTextContent('.subtotal-cost', subtotal);
  updateTextContent('.tax-cost', tax);
  updateTextContent('.total-cost', total);
}

//loop entre deliveryOptions
//Para cada opcion generamos HTML
//Combinamos el HTML todo junto
function deliveryOptionsHTML(product, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    //Codigo para el delivery de la libreria externa
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    //Para mostrar si es gratis o con precio
    const priceString =
      deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${
        product.id
      }" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${
          isChecked ? 'checked' : ''
        } class="delivery-option-input" name="delivery-option-${product.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });
  return html;
}

// Funcion para unir los event listerenrs a los elementos creados dinamicamente
function attachEventListeners() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      const productId = event.target.dataset.productId;
      removeFromCart(productId);
      renderOrderSummary();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', (event) => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
    });
  });

  // Agrega event listener a la clase "place-order-button"
  document
    .querySelector('.place-order-button')
    .addEventListener('click', () => {
      // Limpia el localStorage
      localStorage.clear();

      // Actualiza el array de carritos a uno vacio
      cart.length = 0;

      // Actualiza y muestra la seccion de order summary
      renderOrderSummary();

      // Actualiza la parte de arriba del checkout
      updateCheckoutHeader();
    });
}

// Funcion para actualizar la parte de arriba, el header del checkout.
function updateCheckoutHeader() {
  let itemCount = 0;
  if (cart && Array.isArray(cart)) {
    for (let i = 0; i < cart.length; i++) {
      itemCount += cart[i].quantity || 0;
    }
  }
  document.querySelector(
    '.return-to-home-link'
  ).textContent = `${itemCount} items`;
  document.querySelector('.total-item-count').textContent = `${itemCount}`;
}

document.addEventListener('DOMContentLoaded', (event) => {
  renderOrderSummary();
  attachEventListeners(); // Llama a la funcion aca tambien para asegurar que los event listeners esten juntos
});
