(function() {
    if (document.getElementById('ochel-widget')) return;
    
    const iframe = document.createElement('iframe');
    iframe.id = 'ochel-widget';
    iframe.src = 'https://ochelreservationv2.vercel.app';
    iframe.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 450px;
        height: 650px;
        border: none;
        z-index: 9999;
        background: transparent;
        pointer-events: auto;
    `;
    
    document.body.appendChild(iframe);
})();