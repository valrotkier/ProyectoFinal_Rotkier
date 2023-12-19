export let cart = JSON.parse(localStorage.getItem('cart'));
if (!cart) {
  cart = [
    {
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1',
    },
    {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2',
    },
  ];
}

//Local storage
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

//Agregar productos al carrito
export function addToCart(productId) {
  let matchingItem;
  //Chequeamos que el productId ya este en el carrito
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  //Si el producto ya esta en el carrito, incrementa la cantidad x1
  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1',
    });
  }

  saveToStorage();
}

//Funcion para remover producto del carrito
export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem); //va a contener todos los articulos del carrito que no sean iguales al productId
    }
  });
  cart = newCart;
  saveToStorage();
}

//actualizamos la opcion del delivery en el carrito
//hacemos loop en el carrito para encontrar el producto y luego actualizamos el deliveryOptionId del producto
export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}
