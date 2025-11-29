// Firmas mínimas para manejo de LocalStorage
function getStorage(key){
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function setStorage(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
function removeStorage(key){
  localStorage.removeItem(key);
}
