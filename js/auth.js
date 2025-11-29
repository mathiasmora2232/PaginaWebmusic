// Stubs de funciones para Auth
function register(email, password, confirmPassword) {}
function login(email, password) {}
function logout() {}

// Hook UI (no implementado)
document.addEventListener('DOMContentLoaded', ()=>{
  const btnLogin = document.getElementById('btn-login');
  const btnRegister = document.getElementById('btn-register');
  const btnLogout = document.getElementById('btn-logout');
  btnLogin && btnLogin.addEventListener('click', ()=>{
    const email = document.getElementById('login-email')?.value || '';
    const pass = document.getElementById('login-password')?.value || '';
    login(email, pass);
  });
  btnRegister && btnRegister.addEventListener('click', ()=>{
    const email = document.getElementById('register-email')?.value || '';
    const pass = document.getElementById('register-password')?.value || '';
    const pass2 = document.getElementById('register-password2')?.value || '';
    register(email, pass, pass2);
  });
  btnLogout && btnLogout.addEventListener('click', logout);
});
