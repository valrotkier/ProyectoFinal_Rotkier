let products = [];
const fetchProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  const data = await response.json();
  products = data;
  return products; // Tira return de los products cuando son fetched.
};

export { fetchProducts, products };
