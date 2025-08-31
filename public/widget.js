(function() {
    if (document.getElementById('ochel-widget')) return;
    
    const iframe = document.createElement('iframe');
    iframe.id = 'ochel-widget';
    iframe.src = 'https://ochelreservationv2.vercel.app';
    iframe.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        pointer-events: none;
        z-index: 9999;
        background: transparent;
    `;
    
    document.body.appendChild(iframe);
})();