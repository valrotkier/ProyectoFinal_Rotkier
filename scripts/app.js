// Uso modulos con import y export principalmente para poder acceder a la variables y funciones sin generar conflictos entre archivos
import { cart, addToCart, saveToStorage } from '../data/cart.js';
import { fetchProducts, products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

// Variable para almacenar el HTML de los productos
let productsHTML = '';

// Llamo a la función fetchProducts que retorna una promesa para obtener los productos
fetchProducts().then(() => {
  // Itero  con .map sobre cada producto para construir el HTML
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
  // Usamos el DOM para cargar el contenido generado
  document.querySelector('.js-products-grid').innerHTML = productsHTML;
  // Funcion para inicializar y mostrar la cantidad del carrito
  function initializeCartQuantityDisplay() {
    let cartQuantity = 0;
    if (cart && Array.isArray(cart)) {
      // Calculo la cantidad total de productos en el carrito
      cartQuantity = cart.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
    }
    // Muestro la cantidad en el DOM
    document.querySelector('.js-cart-quantity').textContent = cartQuantity;
  }

  initializeCartQuantityDisplay();

  // Agrego eventos a los selectores de cantidad de productos
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

        // Actualizo la cantidad en el carrito
        updateCartQuantity(productId, selectedQuantity);
      });
    });

  // Función para actualizar la cantidad en el carrito
  function updateCartQuantity(productId, quantity) {
    const numericProductId = parseInt(productId, 10);
    // Busco el producto en el carrito
    let cartItem = cart.find((item) => item.productId === numericProductId);

    if (cartItem) {
      // Si el producto existe en el carrito, actualizo la cantidad
      cartItem.quantity = quantity;
    } else {
      // Si el producto no existe en el carrito, con push lo agrega
      cart.push({
        productId: numericProductId,
        quantity,
        deliveryOptionId: '1',
      });
    }

    saveToStorage(); // Actualiza el carrito en localStorage
    initializeCartQuantityDisplay(); // Actualiza y muestra la cantidad del carrito en el DOM
  }

  // Añado eventos a los botones "Add to Cart", recorre cada botón de los productos
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      if (!productId) {
        console.error('Product ID is missing or null', productId);
        return; // Previene que se agregue productos con un productId invalido
      }
      // Obtengo la cantidad seleccionada desde el selector del producto
      const productContainer = button.closest('.product-container');
      const quantitySelect = productContainer.querySelector(
        '.product-quantity-container select'
      );
      const quantity = parseInt(quantitySelect.value, 10);

      // Añado el producto al carrito
      addToCart(productId, quantity);
      initializeCartQuantityDisplay(); // Actualizo y muestro la cantidad del carrito
    });
  });
});
