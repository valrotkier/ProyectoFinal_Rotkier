export const cart = [];

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
    });
  }
}
