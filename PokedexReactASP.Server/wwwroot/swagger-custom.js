(function () {
    'use strict';

    /* ---------- Authorize Proxy ---------- */
    function injectAuthorizeProxy() {
        const topbar = document.querySelector('.swagger-ui .topbar-wrapper');
        const realAuthorizeBtn = document.querySelector(
            '.swagger-ui .scheme-container .btn.authorize'
        );

        if (!topbar || !realAuthorizeBtn) return;

        // avoid duplicate
        if (document.getElementById('pokemon-authorize-proxy')) return;

        const proxyBtn = realAuthorizeBtn.cloneNode(true);
        proxyBtn.id = 'pokemon-authorize-proxy';

        proxyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            realAuthorizeBtn.click(); // trigger real swagger authorize
        });

        const wrapper = document.createElement('div');
        wrapper.style.marginLeft = 'auto';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';

        wrapper.appendChild(proxyBtn);
        topbar.appendChild(wrapper);
    }

    /* ---------- Replace Swagger Logo ---------- */
    function replaceSwaggerLogo() {
        const logoLink = document.querySelector('.swagger-ui .topbar-wrapper > a');
        if (!logoLink) return;
        if (document.querySelector('.custom-pokemon-logo')) return;

        const logo = document.createElement('div');
        logo.className = 'custom-pokemon-logo';
        logo.style.display = 'flex';
        logo.style.alignItems = 'center';

        logo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" style="margin-right: 10px;">
        <circle cx="50" cy="50" r="48" fill="#fff" stroke="#000" stroke-width="3"/> <path d="M 50 2 A 48 48 0 0 1 98 50 L 50 50 Z" fill="#ff1c1c"/> <path d="M 50 50 L 98 50 A 48 48 0 0 1 50 98 Z" fill="#fff"/> <path d="M 50 98 A 48 48 0 0 1 2 50 L 50 50 Z" fill="#fff"/> <path d="M 50 50 L 2 50 A 48 48 0 0 1 50 2 Z" fill="#ff1c1c"/> <line x1="2" y1="50" x2="98" y2="50" stroke="#000" stroke-width="3"/> <circle cx="50" cy="50" r="12" fill="#fff" stroke="#000" stroke-width="3"/> <circle cx="50" cy="50" r="6" fill="#fff" stroke="#000" stroke-width="2"/> </svg>
        <span style="font-size: 24px; font-weight: bold; color: #ffffff; text-shadow: 2px 2px 0px #ffcb05;"> Kiremon API </span>`

        logoLink.innerHTML = '';
        logoLink.appendChild(logo);
        logoLink.style.display = 'flex';
        logoLink.style.alignItems = 'center';
        logoLink.style.textDecoration = 'none';
    }

    /* ---------- Update Favicon ---------- */
    function updateFavicon() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(16, 16, 15, 0, Math.PI * 2);
        ctx.fill(); ctx.fillStyle = '#ff1c1c';
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

    /* ---------- Init ---------- */
    function init() {
        injectAuthorizeProxy();
        updateFavicon();
        replaceSwaggerLogo();
    }

    const timer = setInterval(init, 300);
})();
