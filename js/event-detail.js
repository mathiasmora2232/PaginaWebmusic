(function(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const container = document.querySelector('[data-event-container]');
  const loadingEl = document.querySelector('[data-loading]');
  if(!id){
    container.innerHTML = '<p class="muted">Falta parámetro id.</p>';
    return;
  }
  fetch('data/events.json')
    .then(r=>r.json())
    .then(list=>{
      const ev = list.find(e=>e.id===id);
      if(!ev){
        container.innerHTML = '<p class="muted">Evento no encontrado.</p>';
        return;
      }
      const thumb = ev.thumbImage
        ? `<div class=\"event-thumb\" style=\"background:url('${ev.thumbImage}') center/cover no-repeat\"></div>`
        : `<div class=\"event-thumb card-img ${ev.thumbClass || ''}\"></div>`;
      const seatMap = ev.seatMapImage
        ? `<div class=\"seat-map\"><h3>Mapa de localidades</h3><img src=\"${ev.seatMapImage}\" alt=\"Mapa de localidades ${ev.title}\"/></div>`
        : '';
      container.innerHTML = `
        <div class=\"event-head\">
          ${thumb}
          <div class=\"event-info\">
            <h2>${ev.title}</h2>
            <p class=\"muted\">${ev.displayDate} · ${ev.venue}</p>
            <p>${ev.description}</p>
            <div class=\"event-actions\">
              <a href=\"${ev.ticketsLink}\" class=\"btn\">Comprar tickets</a>
              <a href=\"events.html\" class=\"btn-outline\">Volver</a>
            </div>
            <div class=\"event-tags\">${ev.genres.map(g=>`<span>${g}</span>`).join('')}</div>
          </div>
        </div>
        ${seatMap}
      `;
    })
    .catch(err=>{
      console.error(err);
      container.innerHTML = '<p class="muted">Error cargando datos.</p>';
    })
    .finally(()=> loadingEl && loadingEl.remove());
})();
