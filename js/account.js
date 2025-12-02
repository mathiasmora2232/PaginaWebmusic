function renderAccount(){
  const orders = getStorage('orders') || [];
  const tickets = getStorage('tickets') || [];
  const tbody = document.getElementById('orders-body');
  const tlist = document.getElementById('tickets-container') || document.getElementById('tickets-list');
  const qrs = document.getElementById('qr-container') || document.getElementById('tickets-qr');
  if(tbody){
    tbody.innerHTML = orders.map(o=> `<tr><td>${o.id}</td><td>${(o.items[0]||{}).eventId}</td><td>${o.items.reduce((s,i)=>s+i.qty,0)}</td><td>$ ${o.total.toFixed(2)}</td><td>${o.status}</td></tr>`).join('');
  }
  if(tlist){
    tlist.innerHTML = tickets.map(t=> `<div class=\"feature\"><strong>${t.eventId}</strong><div class=\"muted\">Asiento ${t.seat}</div><div>Código: ${t.code}</div></div>`).join('');
  }
  if(qrs){
    qrs.innerHTML = tickets.slice(0,4).map(t=> `<img alt=\"QR ${t.code}\" src=\"${t.qr}\"/>`).join('');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{ renderAccount(); });
