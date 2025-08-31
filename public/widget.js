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
    
    // Enable pointer events in bottom-right area where popup is located
    document.addEventListener('mousemove', function(e) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Check if mouse is in bottom-right 500x700 area
        const inPopupArea = e.clientX > viewportWidth - 500 && e.clientY > viewportHeight - 700;
        
        if (inPopupArea) {
            iframe.style.pointerEvents = 'auto';
        } else {
            iframe.style.pointerEvents = 'none';
        }
    });
})();