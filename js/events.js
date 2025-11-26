(function(){
  const grid = document.querySelector('[data-events-grid]');
  if(!grid) return;
  fetch('data/events.json')
    .then(r=>r.json())
    .then(events=>{
      grid.innerHTML = events.map(ev => {
        const imgDiv = ev.thumbImage
          ? `<div class=\"card-img\"><img src=\"${ev.thumbImage}\" alt=\"${ev.title}\"/></div>`
          : `<div class=\"card-img ${ev.thumbClass || ''}\"></div>`;
        return `
        <article class=\"card\" data-id=\"${ev.id}\">
          ${imgDiv}
          <div class="card-body">
            <h3>${ev.title}</h3>
            <p>${ev.displayDate} · ${ev.venue} · Desde $${ev.priceFrom}</p>
            <div class="card-actions">
                <a href="event.html?id=${ev.id}" class="btn-small">Comprar</a>
                <a href="event.html?id=${ev.id}" class="btn-link">Detalles</a>
            </div>
          </div>
        </article>`;
      }).join('');
    })
    .catch(err=>{
      console.error('Error cargando eventos', err);
      grid.innerHTML = '<p style="color:var(--muted)">No se pudo cargar la lista de eventos.</p>';
    });
})();
