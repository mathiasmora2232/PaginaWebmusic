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
        ? `<div class=\"event-thumb poster\"><img src=\"${ev.thumbImage}\" alt=\"${ev.title}\"/></div>`
        : `<div class=\"event-thumb card-img ${ev.thumbClass || ''}\"></div>`;
      const hasCoords = ev.coords && typeof ev.coords.lat === 'number' && typeof ev.coords.lng === 'number';
      const locationLabel = `${ev.venue}${ev.city ? ' · ' + ev.city : ''}`;
      const mapQueryRaw = ev.locationQuery || `${ev.venue} ${ev.city || ''}`.trim();
      const seatMap = ev.seatMapImage
        ? `<div class=\"seat-map\">
             <div class=\"seat-map-content\">
               <div>
                 <h3>Mapa de localidades</h3>
                 <img src=\"${ev.seatMapImage}\" alt=\"Mapa de localidades ${ev.title}\"/>
               </div>
               <div class=\"location-panel\">
                 <h3>Ubicación</h3>
                 <p class=\"muted\">${locationLabel}</p>
                 <div data-location-map ${hasCoords ? `data-lat=\"${ev.coords.lat}\" data-lng=\"${ev.coords.lng}\" data-zoom=\"${(ev.coords.zoom||15)}\"` : `data-query=\"${mapQueryRaw}\"`} ></div>
                 <p><a class=\"btn-link\" target=\"_blank\" rel=\"noopener\" href=\"https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQueryRaw)}\">Ver en Google Maps →</a></p>
               </div>
             </div>
           </div>`
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
    .finally(()=> {
      loadingEl && loadingEl.remove();
      // Inicializa mapa embebido si el contenedor existe
      if (window.renderLocationMap) {
        document.querySelectorAll('[data-location-map]').forEach(el=> window.renderLocationMap(el));
      }
    });
})();
