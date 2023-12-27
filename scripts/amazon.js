// Uso modulos con import y export para poder acceder a la variable del carrito sin generar conflictos entre archivos
import { cart, addToCart, saveToStorage } from '../data/cart.js';
import { fetchProducts, products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

let productsHTML = '';

fetchProducts().then(() => {
  //Creo una variable para que haga loop en el array de los productos
  products.map((product) => {
    productsHTML += `
  <div class="product-container">
    <div class="product-image-container">
        <img class="product-image" src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
        ${product.title}
    </div>

    <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${
          Math.round(product.rating.rate) * 10
        }.png">
        <div class="product-rating-count link-primary">
        ${product.rating.count}
        </div>
    </div>

    <div class="product-price">
        $${product.price}
    </div>

    <div class="product-quantity-container">
        <select>
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
      product.id
    }">
    Add to Cart
  </button>
</div>
  `;
  });
  //Usamos el DOM para cargar el contenido generado
  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  function initializeCartQuantityDisplay() {
    let cartQuantity = 0;
    if (cart && Array.isArray(cart)) {
      cartQuantity = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
    }
    document.querySelector('.js-cart-quantity').textContent = cartQuantity;
  }

  initializeCartQuantityDisplay();

  document
    .querySelectorAll('.product-quantity-container select')
    .forEach((selectElement) => {
      selectElement.addEventListener('change', (event) => {
        const productId = event.target
          .closest('.product-container')
          .getAttribute('data-product-id');
        if (!productId) {
          console.error('Product ID is missing or null', productId);
          return; // Previene que se actualice la cantidad para un product ID invalido
        }
        const selectedQuantity = parseInt(event.target.value, 10);

        updateCartQuantity(productId, selectedQuantity);
      });
    });

  function updateCartQuantity(productId, quantity) {
    const numericProductId = parseInt(productId, 10);

    let cartItem = cart.find((item) => item.productId === numericProductId);

    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      cart.push({
        productId: numericProductId,
        quantity,
        deliveryOptionId: '1',
      });
    }

    saveToStorage(); // Actualiza el carrito en localStorage
    initializeCartQuantityDisplay(); // Actualiza y muestra la cantidad del carrito
  }

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      if (!productId) {
        console.error('Product ID is missing or null', productId);
        return; // Previene que se agregue productos con un productId invalido
      }
      const productContainer = button.closest('.product-container');
      const quantitySelect = productContainer.querySelector(
        '.product-quantity-container select'
      );
      const quantity = parseInt(quantitySelect.value, 10);

      addToCart(productId, quantity);
      initializeCartQuantityDisplay(); // Actualiza y muestra la cantidad del carrito
    });
  });
});
