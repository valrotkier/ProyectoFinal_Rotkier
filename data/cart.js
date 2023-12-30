// Variable global para almacenar los productos en el carrito. Se carga desde localStorage o comienza como un array vacio
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Guardar en localStorage
export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar producto al carrito o actualizar la cantidad si ya existe
export function addToCart(productId, additionalQuantity = 1) {
  // Verifica si el productId es válido.
  if (!productId) {
    console.error('Invalid product ID:', productId);
    return; // Previene agregar productos con un product ID invalido
  }
  // Convierte el productId a un valor numérico
  const numericProductId = parseInt(productId, 10);

  // Con find, busca el producto en el carrito por su ID
  let cartItem = cart.find((item) => item.productId === numericProductId);

  // Actualiza la cantidad si el producto ya está en el carrito, de lo contrario, lo agrega al carrito
  if (cartItem) {
    cartItem.quantity += additionalQuantity; // Aumenta la cantidad
  } else {
    cart.push({
      productId: numericProductId,
      quantity: additionalQuantity,
      deliveryOptionId: '1', // Valor predeterminado para la opción de entrega.
    });
  }
  // Guarda el carrito actualizado en localStorage
  saveToStorage();
}

// Funcion para eliminar producto del carrito
export function removeFromCart(productId) {
  const numericProductId = parseInt(productId, 10);
  // Filtra el carrito para excluir el producto con el ID proporcionado
  cart = cart.filter((item) => item.productId !== numericProductId);

  saveToStorage();
}

// Función que actualiza la cantidad de un producto en el carrito
export function updateCartQuantity(productId, newQuantity) {
  const numericProductId = parseInt(productId, 10);
  // Busca el producto en el carrito por su ID
  let cartItem = cart.find((item) => item.productId === numericProductId);

  // Actualiza la cantidad si el producto existe en el carrito
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
