(function () {
    function injectAuthorizeProxy() {
        const swaggerRoot = document.querySelector(".swagger-ui");
        const topbar = document.querySelector(".swagger-ui .topbar-wrapper");
        const realAuthorizeBtn = document.querySelector(".swagger-ui .scheme-container .btn.authorize");

        if (!swaggerRoot || !topbar || !realAuthorizeBtn) return;

        // Avoid duplicate
        if (document.getElementById("pokemon-authorize-proxy")) return;

        // Create proxy button
        const proxyBtn = realAuthorizeBtn.cloneNode(true);
        proxyBtn.id = "pokemon-authorize-proxy";

        proxyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            realAuthorizeBtn.click();
        });

        // Wrapper
        const wrapper = document.createElement("div");
        wrapper.style.marginLeft = "auto";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";

        wrapper.appendChild(proxyBtn);
        topbar.appendChild(wrapper);
    }

    const interval = setInterval(() => {
        injectAuthorizeProxy();
    }, 300);

    setTimeout(() => clearInterval(interval), 10000);
})();

// Pokemon-themed Swagger UI - Custom Logo and JWT User Display
(function() {
    'use strict';
    
    // Function to replace Swagger logo with Pokemon logo
    function replaceSwaggerLogo() {
        const selectors = [
            '.topbar-wrapper a',
            '.topbar-wrapper',
            '.topbar a',
            'a[href*="swagger"]'
        ];
        
        let logoElement = null;
        for (const selector of selectors) {
            logoElement = document.querySelector(selector);
            if (logoElement) break;
        }
        
        if (!logoElement) {
            return false;
        }
        
        // Check if already replaced
        if (document.querySelector('.custom-pokemon-logo')) {
            return true;
        }
        
        const customLogo = document.createElement('div');
        customLogo.className = 'custom-pokemon-logo';
        customLogo.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" style="margin-right: 10px;">
                <circle cx="50" cy="50" r="48" fill="#fff" stroke="#000" stroke-width="3"/>
                <path d="M 50 2 A 48 48 0 0 1 98 50 L 50 50 Z" fill="#ff1c1c"/>
                <path d="M 50 50 L 98 50 A 48 48 0 0 1 50 98 Z" fill="#fff"/>
                <path d="M 50 98 A 48 48 0 0 1 2 50 L 50 50 Z" fill="#fff"/>
                <path d="M 50 50 L 2 50 A 48 48 0 0 1 50 2 Z" fill="#ff1c1c"/>
                <line x1="2" y1="50" x2="98" y2="50" stroke="#000" stroke-width="3"/>
                <circle cx="50" cy="50" r="12" fill="#fff" stroke="#000" stroke-width="3"/>
                <circle cx="50" cy="50" r="6" fill="#fff" stroke="#000" stroke-width="2"/>
            </svg>
            <span style="font-size: 24px; font-weight: bold; color: #ffffff; text-shadow: 2px 2px 0px #ffcb05;">
                Kiremon API
            </span>
        `;
        
        logoElement.innerHTML = '';
        logoElement.appendChild(customLogo);
        logoElement.style.display = 'flex';
        logoElement.style.alignItems = 'center';
        logoElement.style.textDecoration = 'none';
        
        const images = logoElement.querySelectorAll('img');
        images.forEach(img => img.remove());
        
        return true;
    }
    
    // Function to update favicon
    function updateFavicon() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ff1c1c';
        ctx.beginPath();
        ctx.arc(16, 16, 15, Math.PI, 0, false);
        ctx.fill();
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(1, 16);
        ctx.lineTo(31, 16);
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(16, 16, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(16, 16, 3, 0, Math.PI * 2);
        ctx.stroke();
        
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.head.appendChild(link);
        }
        link.type = 'image/x-icon';
        link.href = canvas.toDataURL('image/x-icon');
    }
    
    // Function to watch for authorization changes
    function watchAuthChanges() {
        // Watch for authorize modal close
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if authorize button state changed
                const authorizeBtn = document.querySelector('.btn.authorize');
                if (authorizeBtn) {
                    const isAuthorized = authorizeBtn.classList.contains('locked');
                    
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
    
    // Add pulse animation for status dot
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.5;
                transform: scale(1.2);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize everything
    function initialize() {
        replaceSwaggerLogo();
        updateFavicon();
        watchAuthChanges();
    }
    
    // Wait for Swagger UI to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
        replaceSwaggerLogo();
    } else {
        initialize();
    }
    
})();
