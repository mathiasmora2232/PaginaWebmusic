// Renderiza un iframe de Google Maps dentro del contenedor dado.
// Usa el atributo data-query del elemento como término de búsqueda.
// No requiere API Key.
(function(){
    function renderLocationMap(el){
        if(!el) return;
        const lat = el.getAttribute('data-lat');
        const lng = el.getAttribute('data-lng');
        const zoom = el.getAttribute('data-zoom') || '15';
        let src = '';
        if(lat && lng){
            src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
        } else {
            const qRaw = el.getAttribute('data-query') || '';
            const q = encodeURIComponent(qRaw);
            src = `https://www.google.com/maps?q=${q}&output=embed`;
        }
        const iframe = document.createElement('iframe');
        iframe.setAttribute('title','Ubicación del evento');
        iframe.width = '100%';
        iframe.height = '300';
        iframe.style.border = '0';
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.src = src;
        el.innerHTML = '';
        el.appendChild(iframe);
    }
    window.renderLocationMap = renderLocationMap;
})();
