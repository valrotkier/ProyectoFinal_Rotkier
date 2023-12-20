// Para poder acceder a la variable del carrito sin generar conflictos entre archivos
import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

//Creo una variable para combinar todos los strings juntos
let productsHTML = '';
//Creo una variable para que haga loop en el array de los productos
products.forEach((product) => {
  productsHTML += `
  <div class="product-container">
    <div class="product-image-container">
        <img class="product-image" src="${product.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">
        ${product.name}
    </div>

    <div class="product-rating-container">
        <img class="product-rating-stars" src="images/ratings/rating-${
          product.rating.stars * 10
        }.png">
        <div class="product-rating-count link-primary">
        ${product.rating.count}
        </div>
    </div>

    <div class="product-price">
        $${formatCurrency(product.priceCents)}
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

    <button class="add-to-cart-button button-primary js-add-to-cart"
    data-product-id="${product.id}">
        Add to Cart
    </button>
</div>
  `;
});

//Usamos el DOM para cargar el contenido generado
document.querySelector('.js-products-grid').innerHTML = productsHTML;

function updateCartQuantity() {
  let cartQuantity = 0;
  //hacemos loop del array del carrito
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    addToCart(productId);
    updateCartQuantity();
  });
});

//Para que el localStorage del carrito me cargue cuando cargo o actualizo la pagina
function getCartQuantityFromLocalStorage() {
  const storedCart = JSON.parse(localStorage.getItem('cart'));
  let cartQuantity = 0;

  if (storedCart) {
    storedCart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
  }

  return cartQuantity;
}

document.addEventListener('DOMContentLoaded', () => {
  // Actualizo la cart quantity cuando la  pagina es cargada
  const cartQuantity = getCartQuantityFromLocalStorage();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
});
