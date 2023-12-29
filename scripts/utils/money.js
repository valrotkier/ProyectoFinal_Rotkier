// Funcion que formatea el precio en centavos a una cadena de texto en formato de dolar con dos decimales
export function formatCurrency(priceCents) {
  // Redondea el precio en centavos y lo divide por 100 para obtener el valor en dolares
  // Utiliza toFixed(2) para asegurar que el resultado tenga siempre dos decimales
  return (Math.round(priceCents) / 100).toFixed(2);
}

export default formatCurrency;
