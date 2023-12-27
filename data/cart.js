export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Guardar en localStorage
export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar producto al carrito o actualizar la cantidad si ya existe
export function addToCart(productId, additionalQuantity = 1) {
  if (!productId) {
    console.error('Invalid product ID:', productId);
    return; // Previene agregar productos con un product ID invalido
  }
  const numericProductId = parseInt(productId, 10);
  let cartItem = cart.find((item) => item.productId === numericProductId);

  if (cartItem) {
    cartItem.quantity += additionalQuantity; // Aumenta la cantidad
  } else {
    cart.push({
      productId: numericProductId,
      quantity: additionalQuantity,
      deliveryOptionId: '1',
    });
  }

  saveToStorage();
}

//Funcion para remover producto del carrito
export function removeFromCart(productId) {
  const numericProductId = parseInt(productId, 10);
  cart = cart.filter((item) => item.productId !== numericProductId);
  saveToStorage();
}

// Actualiza la cantitdad de un producto en el carrito
export function updateCartQuantity(productId, newQuantity) {
  const numericProductId = parseInt(productId, 10);
  let cartItem = cart.find((item) => item.productId === numericProductId);

  if (cartItem) {
    cartItem.quantity = newQuantity;
    saveToStorage();
  }
}

// Actualiza la opcion del delivery en el carrito
export function updateDeliveryOption(productId, deliveryOptionId) {
  const numericProductId = parseInt(productId, 10);
  let cartItem = cart.find((item) => item.productId === numericProductId);

  if (cartItem) {
    cartItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}
