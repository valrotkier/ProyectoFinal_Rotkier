let products = [];
// Función asincrónica para cargar productos desde fakestoreapi
const fetchProducts = async () => {
  try {
    // Realiza una solicitud a la API usando fetch y espera la respuesta
    const response = await fetch('https://fakestoreapi.com/products');
    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // Parsea la respuesta como JSON
    const data = await response.json();
    // Asigna los datos al array de productos
    products = data;
    // Tira return de los products cuando son fetched
    return products;
  } catch (error) {
    // Maneja el error apropiadamente
    console.error('Failed to fetch products:', error.message);
    // Aca hago return con un array vacio para manejar el error dentro de la funcion fetchProducts, tambien puedo mostrar throw error en el catch para manejar el error mas adecuadamente si es necesario.
    return [];
  }
};

export { fetchProducts, products };
