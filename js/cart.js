// Carrito simple usando localStorage
function addToCart(eventId, qty, unitPrice, seatsOrOptions){
  const cart = getStorage('cart') || { items: [] };
  const currentQty = cart.items.reduce((s,i)=> s + i.qty, 0);
  const addQty = Math.max(0, Math.min(10 - currentQty, qty));
  if(addQty <= 0){ alert('Máximo 10 entradas por usuario.'); return; }
  let zoneId = null, seats = [];
  if(Array.isArray(seatsOrOptions)) seats = seatsOrOptions;
  else if(seatsOrOptions && typeof seatsOrOptions === 'object'){ zoneId = seatsOrOptions.zoneId || null; seats = seatsOrOptions.seats || []; }
  cart.items = cart.items.filter(i=> i.eventId !== eventId); // simplificamos a una línea por evento
  cart.items.push({ eventId, qty: addQty, unitPrice, zoneId, seats });
  setStorage('cart', cart);
}
function clearCart(){ setStorage('cart', { items: [] }); }
function createOrderFromCart(user){
  const cart = getStorage('cart');
  if(!cart || !cart.items || cart.items.length===0) return null;
  const orderId = 'ORD-' + Math.random().toString(36).slice(2,8).toUpperCase();
  const total = cart.items.reduce((s,i)=> s + (i.qty * i.unitPrice), 0);
  const order = { id: orderId, user: user||'guest', items: cart.items, total, status: 'pagado', createdAt: Date.now() };
  const orders = getStorage('orders') || [];
  orders.push(order);
  setStorage('orders', orders);
  // Generar tickets con códigos QR (simulados)
  const tickets = getStorage('tickets') || [];
  cart.items.forEach(it => {
    const evTickets = (it.seats && it.seats.length ? it.seats : Array.from({ length: it.qty }, (_,k)=> `S-${k+1}`));
    evTickets.forEach(seat => {
      const code = 'TCK-' + Math.random().toString(36).slice(2,10).toUpperCase();
      tickets.push({ orderId, eventId: it.eventId, seat, code, qr: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(code)}` });
    });
  });
  setStorage('tickets', tickets);
  // limpiar carrito
  clearCart();
  return order;
}

// Compra directa sin carrito: crea orden y tickets
function createOrderDirect(eventId, zoneId, qty, unitPrice, buyer){
  const orderId = 'ORD-' + Math.random().toString(36).slice(2,8).toUpperCase();
  const invoiceNumber = 'FAC-' + new Date().toISOString().slice(0,7).replace('-','') + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
  const item = { eventId, zoneId, qty, unitPrice };
  const total = qty * unitPrice;
  const order = { id: orderId, invoiceNumber, user: buyer||'guest', items: [item], total, status: 'pagado', createdAt: Date.now() };
  const orders = getStorage('orders') || [];
  orders.push(order);
  setStorage('orders', orders);
  const tickets = getStorage('tickets') || [];
  for(let i=0;i<qty;i++){
    const code = 'TCK-' + Math.random().toString(36).slice(2,10).toUpperCase();
    tickets.push({ orderId, eventId, seat: `${zoneId}-${i+1}` , code, qr: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(code)}` });
  }
  setStorage('tickets', tickets);
  return order;
}

document.addEventListener('DOMContentLoaded', ()=>{
  const btnSubmit = document.getElementById('btn-submit-order');
  const params = new URLSearchParams(location.search);
  const eventId = params.get('id');

  // Render resumen checkout directo
  const eventsP = fetch('data/events.json').then(r=>r.json()).catch(()=>[]);
  const zonesP = fetch('data/zones.json').then(r=>r.json()).catch(()=>({default:[]}));
  const takenP = fetch('data/seats_taken.json').then(r=>r.json()).catch(()=>({default:{}}));
  Promise.all([eventsP, zonesP, takenP]).then(([events, zonesData, takenData]) => {
    const byId = {}; events.forEach(e=> byId[e.id]=e);
    const nameEl = document.getElementById('checkout-event-name');
    const totalEl = document.getElementById('checkout-total');
    const zoneSelect = document.getElementById('co-zone');
    const qMinus = document.getElementById('co-minus');
    const qPlus = document.getElementById('co-plus');
    const qVal = document.getElementById('co-qty');

    if(!eventId){ if(nameEl) nameEl.textContent='(sin evento)'; return; }
    const ev = byId[eventId];
    const zones = zonesData[eventId] || zonesData.default || [];
    const taken = takenData[eventId] || takenData.default || {};
    const it = { eventId, zoneId: zones[0]?.id || null, qty: 1, unitPrice: zones[0]?.price || 0 };
    const getAvail = (zoneId)=>{
      const z = zones.find(z=> z.id===zoneId); if(!z) return 0; const used = taken[zoneId]||0; return Math.max(0, z.capacity - used);
    };

    // popular select de zonas
    if(zoneSelect){
      zoneSelect.innerHTML = zones.map(z=> `<option value="${z.id}">${z.name} — $ ${z.price}</option>`).join('');
      if(it.zoneId) zoneSelect.value = it.zoneId;
      zoneSelect.addEventListener('change', ()=>{
        const z = zones.find(z=> z.id===zoneSelect.value);
        if(!z) return;
        it.zoneId = z.id; it.unitPrice = z.price;
        const avail = getAvail(z.id);
        if(it.qty > avail) it.qty = Math.max(1, Math.min(10, avail));
        render();
      });
    }

    function render(){
      const z = zones.find(z=> z.id===(it.zoneId||zones[0]?.id));
      if(z){ it.zoneId = z.id; it.unitPrice = z.price; }
      const avail = getAvail(it.zoneId);
      const maxQty = Math.min(10, avail);
      if(it.qty > maxQty) it.qty = maxQty;
      nameEl && (nameEl.textContent = ev ? ev.title : it.eventId);
      totalEl && (totalEl.textContent = `$ ${(it.qty * it.unitPrice).toFixed(2)}`);
      if(qVal) qVal.textContent = it.qty;
    }

    qMinus && qMinus.addEventListener('click', ()=>{ it.qty = Math.max(1, it.qty - 1); render(); });
    qPlus && qPlus.addEventListener('click', ()=>{ const avail = getAvail(it.zoneId); it.qty = Math.min(Math.min(10, avail), it.qty + 1); render(); });
    btnSubmit && btnSubmit.addEventListener('click', ()=>{
      const buyer = {
        name: document.getElementById('co-name')?.value || 'guest',
        email: document.getElementById('co-email')?.value || ''
      };
      const order = createOrderDirect(it.eventId, it.zoneId, it.qty, it.unitPrice, buyer);
      if(order){ location.href = 'order-confirmation.html'; }
    });
    render();
  });
});
