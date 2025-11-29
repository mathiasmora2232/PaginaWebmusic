// Stubs de funciones para Carrito/Checkout
function addToCart(eventId, qty, unitPrice) {}
function clearCart() {}
function createOrderFromCart(user) {}

document.addEventListener('DOMContentLoaded', ()=>{
  const btnSubmit = document.getElementById('btn-submit-order');
  btnSubmit && btnSubmit.addEventListener('click', ()=>{
    // Aquí se llamará a createOrderFromCart()
  });
});
