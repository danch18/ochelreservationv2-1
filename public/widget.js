(function() {
    if (document.getElementById('ochel-widget')) return;
    
    const widget = document.createElement('div');
    widget.id = 'ochel-widget';
    widget.innerHTML = `
        <div id="ochel-fab" style="
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 60px;
            height: 60px;
            background: #191919;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: all 0.3s ease;
            font-size: 24px;
        ">🍽️</div>
        
        <iframe id="ochel-popup" src="https://ochelreservationv2-e795sue0b-sahid013s-projects.vercel.app" style="
            position: fixed;
            bottom: 100px;
            right: 24px;
            width: 414px;
            height: 600px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            z-index: 10000;
            transform: scale(0);
            opacity: 0;
            transition: all 0.3s ease;
            transform-origin: bottom right;
        "></iframe>
    `;
    
    document.body.appendChild(widget);
    
    const fab = document.getElementById('ochel-fab');
    const popup = document.getElementById('ochel-popup');
    let isOpen = false;
    
    fab.addEventListener('click', function() {
        isOpen = !isOpen;
        if (isOpen) {
            popup.style.transform = 'scale(1)';
            popup.style.opacity = '1';
            fab.style.background = '#e54d2e';
        } else {
            popup.style.transform = 'scale(0)';
            popup.style.opacity = '0';
            fab.style.background = '#191919';
        }
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !widget.contains(e.target)) {
            isOpen = false;
            popup.style.transform = 'scale(0)';
            popup.style.opacity = '0';
            fab.style.background = '#191919';
        }
    });
})();