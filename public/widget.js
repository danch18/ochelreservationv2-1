(function() {
    if (document.getElementById('ochel-widget')) return;
    
    const iframe = document.createElement('iframe');
    iframe.id = 'ochel-widget';
    iframe.src = 'https://ochelreservationv2.vercel.app';
    
    // Start with button size (with margins)
    iframe.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 220px;
        height: 80px;
        border: none;
        z-index: 9999;
        background: transparent;
        pointer-events: auto;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(iframe);
    
    // Listen for size messages from the iframe
    window.addEventListener('message', function(event) {
        // Verify origin for security
        if (event.origin !== 'https://ochelreservationv2.vercel.app') return;
        
        if (event.data.type === 'popupResize') {
            const { width, height, isOpen } = event.data;
            
            if (isOpen) {
                // Expanded: show full popup with margins to prevent clipping
                iframe.style.width = (width + 50) + 'px';  // Add 50px margin
                iframe.style.height = (height + 50) + 'px'; // Add 50px margin
                iframe.style.bottom = '24px';
                iframe.style.right = '24px';
            } else {
                // Collapsed: show only button
                iframe.style.width = '220px';  // Slightly wider for right alignment
                iframe.style.height = '80px';  // Slightly taller for margins
                iframe.style.bottom = '24px';
                iframe.style.right = '24px';
            }
        }
    });
})();