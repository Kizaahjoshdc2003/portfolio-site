/* ==========================================================================
   PORTFOLIO — Interactive Architectural Scripts (Monochrome Edition)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async () => {
    await applyAdminData();       // Apply saved data from data.json
    initLiveClock();              // Real-time navigation clock
    initAmbientSpotlight();       // Cursor flashlight effect
    initCardSpotlightTracing();   // Interactive specular card lighting
    initTypingEffect();           // Monospace role terminal
    initNavigation();             // Dynamic island scroll & spy
    initScrollReveal();           // Editorial viewport reveals
    initCounterAnimation();       // Number count-up
    initContactForm();            // Transmission form handling
    initSmoothScroll();           // Anchor scrolling
    initSecretAdminAccess();      // Secret Ctrl+Shift+A hotkey
});

/* ==========================================================================
   1. LIVE LOCAL TIME CLOCK (Navigation HUD)
   ========================================================================== */
function initLiveClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}:${seconds} PHT`;
    }

    update();
    setInterval(update, 1000);
}

/* ==========================================================================
   2. AMBIENT MONOCHROME SPOTLIGHT (Background flashlight)
   ========================================================================== */
function initAmbientSpotlight() {
    const spotlight = document.getElementById('ambient-spotlight');
    if (!spotlight) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('pointermove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY + window.scrollY;
    }, { passive: true });

    function render() {
        // Smooth lerp
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        spotlight.style.left = `${currentX}px`;
        spotlight.style.top = `${currentY}px`;

        requestAnimationFrame(render);
    }
    render();
}

/* ==========================================================================
   3. CARD SPOTLIGHT TRACING (Specular card highlights on hover)
   ========================================================================== */
function initCardSpotlightTracing() {
    const cards = document.querySelectorAll(
        '.project-card, .skill-category, .about-text, .timeline-content, .contact-card, .code-window'
    );

    cards.forEach(card => {
        card.addEventListener('pointermove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--card-mouse-x', `${x}px`);
            card.style.setProperty('--card-mouse-y', `${y}px`);
        });
    });
}

/* ==========================================================================
   4. APPLY DATA FROM data.json (WITH DYNAMIC HIDE / REMOVE FLEXIBILITY)
   ========================================================================== */

/* Helper: Escape HTML */
function escapeHtml(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* Helper: Category Icon by Title */
function getCategoryIcon(title = '') {
    const t = (title || '').toLowerCase();
    if (t.includes('front') || t.includes('ui') || t.includes('web') || t.includes('design') || t.includes('client')) {
        return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
    }
    if (t.includes('back') || t.includes('server') || t.includes('api') || t.includes('tool') || t.includes('tech') || t.includes('soft')) {
        return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><circle cx="6" cy="6" r="1"/><circle cx="6" cy="18" r="1"/></svg>`;
    }
    if (t.includes('cloud') || t.includes('devops') || t.includes('infra') || t.includes('deploy') || t.includes('sys') || t.includes('admin')) {
        return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`;
    }
    if (t.includes('data') || t.includes('sql') || t.includes('db') || t.includes('storage') || t.includes('analytics')) {
        return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`;
    }
    return `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
}

/* Helper: Platform Icon by Name / URL */
function getSocialIcon(platform = '') {
    const p = String(platform || '').toLowerCase();
    if (p.includes('github') || p.includes('git')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
    }
    if (p.includes('linkedin')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
    }
    if (p.includes('twitter') || p.includes(' x') || p === 'x') {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
    }
    if (p.includes('facebook') || p.includes('fb')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
    }
    if (p.includes('instagram') || p.includes('ig')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`;
    }
    if (p.includes('telegram') || p.includes('tg')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z"/></svg>`;
    }
    if (p.includes('whatsapp') || p.includes('wa')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 0C5.385 0 0 5.386 0 12.031c0 2.122.553 4.182 1.603 5.998L0 24l6.168-1.579c1.76 1.008 3.766 1.642 5.863 1.642 6.645 0 12.031-5.385 12.031-12.032C24.062 5.386 18.676 0 12.031 0zm0 22.012c-1.895 0-3.714-.543-5.267-1.503l-.377-.234-3.666.938.977-3.575-.246-.388c-1.053-1.654-1.611-3.578-1.611-5.219 0-5.504 4.478-9.982 9.982-9.982 5.504 0 9.982 4.478 9.982 9.982 0 5.504-4.478 9.981-9.982 9.981zm5.474-7.466c-.3-.15-1.776-.877-2.052-.977-.275-.1-.476-.15-.676.15s-.777.977-.953 1.178c-.175.2-.351.225-.651.075s-1.267-.467-2.413-1.488c-.892-.795-1.493-1.777-1.669-2.078-.175-.3-.019-.462.131-.611.136-.135.3-.35.45-.526.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525s-.676-1.63-.926-2.233c-.244-.587-.492-.507-.676-.516l-.576-.01c-.2 0-.525.075-.8.375s-1.05 1.026-1.05 2.502 1.075 2.903 1.225 3.104c.15.2 2.115 3.23 5.124 4.53 3.01 1.3 3.01.867 3.56.817.55-.05 1.776-.726 2.026-1.427.25-.701.25-1.302.175-1.427-.075-.125-.275-.2-.575-.35z"/></svg>`;
    }
    if (p.includes('discord')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;
    }
    if (p.includes('youtube') || p.includes('yt')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
    }
    if (p.includes('email') || p.includes('mail')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
    }
    if (p.includes('phone') || p.includes('tel') || p.includes('call')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;
    }
    if (p.includes('devto') || p.includes('dev.to') || p.includes('blog') || p.includes('article')) {
        return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .67-.08.87-.25.21-.18.31-.47.31-.88v-2.09c0-.41-.11-.69-.34-.91zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.29 2.72 0 2.24-.02 2.37-.44 3.15zm4.85-3.17c0 .51-.04.52-1.15.52v1.64c1.11 0 1.15.01 1.15.53v.77h-2.76V8.53h2.76v.78c0 .5-.04.52-1.15.52v1.63c1.11 0 1.15.01 1.15.52v.15zm4.91 2.2c-.39.76-.81 1.06-1.52 1.06-.71 0-1.14-.3-1.52-1.06-.21-.42-.23-.58-.23-2.28 0-1.72.02-1.85.23-2.28.39-.76.81-1.07 1.52-1.07s1.13.31 1.52 1.07c.21.43.23.56.23 2.28 0 1.7-.02 1.86-.23 2.28z"/></svg>`;
    }
    // Generic link
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
}


/* Helper: Syntax Colorizer for Hero Code Window */
function highlightCode(rawCode) {
    if (!rawCode) return '';
    let code = rawCode
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const strings = [];
    code = code.replace(/(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g, match => {
        strings.push(match);
        return `___STR_${strings.length - 1}___`;
    });

    const comments = [];
    code = code.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;)/g, match => {
        comments.push(match);
        return `___COM_${comments.length - 1}___`;
    });

    // Keywords
    code = code.replace(/\b(interface|type|const|let|var|function|class|return|import|from|export|default|new|async|await|if|else|for|while|public|private|readonly|implements|extends|void|any)\b/g, '<span class="code-keyword">$1</span>');

    // Types
    code = code.replace(/\b(string|number|boolean|Developer|Promise|Array|Record|unknown|never)\b/g, '<span class="code-type">$1</span>');

    // Object keys / properties before :
    code = code.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*:)/g, '<span class="code-prop">$1</span>');

    // Restore strings
    code = code.replace(/___STR_(\d+)___/g, (_, i) => `<span class="code-string">${strings[i]}</span>`);

    // Restore comments
    code = code.replace(/___COM_(\d+)___/g, (_, i) => `<span class="code-comment">${comments[i]}</span>`);

    return code;
}

async function applyAdminData() {
    let data;
    try {
        const res = await fetch('/data.json?_t=' + Date.now()); // cache-bust
        if (!res.ok) return;
        data = await res.json();
    } catch (e) { 
        return; // file not found or not served — keep HTML defaults
    }

    if (!data) return;

    // Helper: safely set text content or hide if empty
    const setText = (selector, value) => {
        const el = document.querySelector(selector);
        if (!el) return;
        if (value !== undefined && value !== null) {
            el.textContent = value;
        }
    };

    /* ---- HERO ---- */
    if (data.name && data.name.trim()) {
        setText('.hero-name', data.name.trim());
        
        // Dynamic title & meta author
        document.title = `${data.name.trim()} — IT Professional Portfolio`;
        const metaAuthor = document.querySelector('meta[name="author"]');
        if (metaAuthor) metaAuthor.setAttribute('content', data.name.trim());

        // Update footer copyright
        const footerCopy = document.querySelector('.footer-copy');
        if (footerCopy) footerCopy.innerHTML = `&copy; ${new Date().getFullYear()} ${data.name.trim()}. All rights reserved.`;

        // Update footer & nav logo initials
        const nameParts = data.name.trim().split(/\s+/);
        const initials = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '')).toUpperCase();
        document.querySelectorAll('.footer-logo, .nav-logo').forEach(el => {
            el.innerHTML = `<span class="logo-bracket">&lt;</span>${initials}<span class="logo-bracket">/&gt;</span>`;
        });

        // About avatar name
        const avatarName = document.querySelector('.avatar-placeholder span');
        if (avatarName) avatarName.textContent = data.name.trim();
    }

    // Hero Code Window Card (Flexible Content & Title)
    const codeVisual = document.getElementById('hero-code-visual') || document.querySelector('.hero-visual');
    const codeTitleEl = document.getElementById('hero-code-title') || document.querySelector('.code-title');
    const codeBodyEl = document.getElementById('hero-code-content') || document.querySelector('.code-body code');

    if (codeTitleEl) {
        if (data.codeCardTitle && data.codeCardTitle.trim()) {
            codeTitleEl.textContent = data.codeCardTitle.trim();
        } else {
            codeTitleEl.textContent = 'architect.ts';
        }
    }

    if (data.codeCardContent !== undefined) {
        if (!data.codeCardContent || !data.codeCardContent.trim()) {
            if (codeVisual) codeVisual.style.display = 'none';
        } else {
            if (codeVisual) codeVisual.style.display = 'block';
            if (codeBodyEl) {
                codeBodyEl.innerHTML = highlightCode(data.codeCardContent);
            }
        }
    }

    if (data.greeting !== undefined) setText('.hero-greeting', data.greeting);
    if (data.heroDescription !== undefined) setText('.hero-description', data.heroDescription);

    // Hero Badge (Hide if empty)
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        if (data.badgeText && data.badgeText.trim()) {
            heroBadge.style.display = 'inline-flex';
            heroBadge.innerHTML = `<span class="status-dot"></span> ${data.badgeText.trim()}`;
        } else {
            heroBadge.style.display = 'none';
        }
    }

    // Stats (Hide individual stat if empty)
    const stats = document.querySelectorAll('.stat-item');
    const statDefs = [
        { num: data.stat1Number, label: data.stat1Label },
        { num: data.stat2Number, label: data.stat2Label },
        { num: data.stat3Number, label: data.stat3Label }
    ];
    statDefs.forEach((stat, idx) => {
        const el = stats[idx];
        if (!el) return;
        if (stat.num && stat.num.trim()) {
            el.style.display = '';
            const numEl = el.querySelector('.stat-number');
            if (numEl) numEl.setAttribute('data-target', stat.num.trim());
            const labelEl = el.querySelector('.stat-label');
            if (labelEl && stat.label) labelEl.textContent = stat.label.trim();
        } else {
            el.style.display = 'none';
        }
    });

    /* ---- ABOUT ---- */
    if (data.profileImage && data.profileImage.trim()) {
        const photo = document.getElementById('profile-photo');
        const fallback = document.getElementById('avatar-fallback');
        if (photo) {
            photo.src = data.profileImage.trim();
            photo.style.display = 'block';
            if (fallback) fallback.style.display = 'none';
        }
    }

    // Bio Paragraphs (Hide if emptied)
    const aboutPs = document.querySelectorAll('.about-text > p');
    const bios = [data.aboutP1, data.aboutP2, data.aboutP3];
    bios.forEach((bio, idx) => {
        const p = aboutPs[idx];
        if (!p) return;
        if (bio && bio.trim()) {
            p.innerHTML = bio;
            p.style.display = 'block';
        } else {
            p.style.display = 'none';
        }
    });

    // Certifications (Hide individual certification or whole section if emptied)
    const certValues = [data.cert1, data.cert2, data.cert3];
    const highlightEls = document.querySelectorAll('.about-highlights .highlight');
    let visibleCerts = 0;

    highlightEls.forEach((el, idx) => {
        const val = certValues[idx];
        const span = el.querySelector('span');
        if (val && val.trim()) {
            if (span) span.textContent = val.trim();
            el.style.display = 'flex';
            visibleCerts++;
        } else {
            el.style.display = 'none';
        }
    });

    const certContainer = document.querySelector('.about-highlights');
    if (certContainer) {
        certContainer.style.display = visibleCerts > 0 ? 'flex' : 'none';
    }

    // Floating Badges (Hide if emptied)
    const float1 = document.getElementById('about-float-1');
    if (float1) {
        if (data.float1 && data.float1.trim()) {
            float1.style.display = 'flex';
            const s = float1.querySelector('span:last-child');
            if (s) s.textContent = data.float1.trim();
        } else {
            float1.style.display = 'none';
        }
    }

    const float2 = document.getElementById('about-float-2');
    if (float2) {
        if (data.float2 && data.float2.trim()) {
            float2.style.display = 'flex';
            const s = float2.querySelector('span:last-child');
            if (s) s.textContent = data.float2.trim();
        } else {
            float2.style.display = 'none';
        }
    }

    /* ---- SKILLS (Flexible Categories & Custom Titles) ---- */
    const skillsContainer = document.getElementById('skills-categories-container') || document.querySelector('.skills-categories');
    const skillsSection = document.getElementById('skills');

    if (Array.isArray(data.skillsCategories) && data.skillsCategories.length > 0) {
        const activeCats = data.skillsCategories.filter(c => (c.title && c.title.trim()) || (c.tags && c.tags.trim()));
        if (activeCats.length === 0) {
            if (skillsSection) skillsSection.style.display = 'none';
        } else {
            if (skillsSection) skillsSection.style.display = 'block';
            if (skillsContainer) {
                skillsContainer.innerHTML = activeCats.map(cat => {
                    const tags = (cat.tags || '').split(',').map(s => s.trim()).filter(Boolean);
                    return `
                    <div class="skill-category">
                        <div class="skill-category-icon">
                            ${getCategoryIcon(cat.title)}
                        </div>
                        <h3>${escapeHtml(cat.title || 'Technical Skills')}</h3>
                        <div class="skill-tags">
                            ${tags.map(tag => `<span class="skill-tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </div>`;
                }).join('');
            }
        }
    } else {
        // Fallback: Legacy 4-category cards
        const renderSkillsCategory = (cardId, csvString) => {
            const card = document.getElementById(cardId);
            if (!card) return;
            const tags = csvString ? csvString.split(',').map(s => s.trim()).filter(Boolean) : [];
            if (tags.length === 0) {
                card.style.display = 'none';
            } else {
                card.style.display = 'block';
                const container = card.querySelector('.skill-tags');
                if (container) {
                    container.innerHTML = tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('');
                }
            }
        };
        renderSkillsCategory('skill-frontend', data.skillsFrontend);
        renderSkillsCategory('skill-backend', data.skillsBackend);
        renderSkillsCategory('skill-cloud', data.skillsCloud);
        renderSkillsCategory('skill-data', data.skillsData);
    }

    /* ---- PROJECTS (Dynamic Flexible List & Custom Titles) ---- */
    const projectsContainer = document.getElementById('projects-grid-container') || document.querySelector('.projects-grid');
    const projectsSection = document.getElementById('projects');

    if (Array.isArray(data.projectsList) && data.projectsList.length > 0) {
        const activeProjs = data.projectsList.filter(p => p.title && p.title.trim());
        if (activeProjs.length === 0) {
            if (projectsSection) projectsSection.style.display = 'none';
        } else {
            if (projectsSection) projectsSection.style.display = 'block';
            if (projectsContainer) {
                projectsContainer.innerHTML = activeProjs.map(p => {
                    const tags = (p.tags || '').split(',').map(t => t.trim()).filter(Boolean);
                    const hasDemo = p.demo && p.demo.trim() && p.demo !== '#';
                    const hasSource = p.source && p.source.trim() && p.source !== '#';
                    return `
                    <article class="project-card">
                        <div class="project-image">
                            <div class="project-image-placeholder">
                                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                            </div>
                        </div>
                        <div class="project-content">
                            ${tags.length > 0 ? `<div class="project-tags">${tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
                            <h3>${escapeHtml(p.title)}</h3>
                            ${p.desc ? `<p>${escapeHtml(p.desc)}</p>` : ''}
                            ${(hasDemo || hasSource) ? `
                            <div class="project-links">
                                ${hasDemo ? `<a href="${escapeHtml(p.demo)}" target="_blank" rel="noopener noreferrer" class="project-link"><span>Live Demo</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
                                ${hasSource ? `<a href="${escapeHtml(p.source)}" target="_blank" rel="noopener noreferrer" class="project-link"><span>Source Code</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></a>` : ''}
                            </div>` : ''}
                        </div>
                    </article>`;
                }).join('');
            }
        }
    } else {
        // Fallback: Legacy Projects 1 to 4
        for (let i = 1; i <= 4; i++) {
            const card = document.getElementById(`project-${i}`);
            if (!card) continue;
            const title = data[`proj${i}Title`];
            const desc = data[`proj${i}Desc`];
            const tags = data[`proj${i}Tags`];
            const demo = data[`proj${i}Demo`];
            const source = data[`proj${i}Source`];

            if (!title || !title.trim()) {
                card.style.display = 'none';
                continue;
            }

            card.style.display = 'flex';
            const h3 = card.querySelector('.project-content h3');
            if (h3) h3.textContent = title.trim();

            const p = card.querySelector('.project-content p');
            if (p) {
                if (desc && desc.trim()) {
                    p.textContent = desc.trim();
                    p.style.display = 'block';
                } else {
                    p.style.display = 'none';
                }
            }

            const tagsContainer = card.querySelector('.project-tags');
            if (tagsContainer) {
                const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];
                if (parsedTags.length > 0) {
                    tagsContainer.innerHTML = parsedTags.map(t => `<span>${t}</span>`).join('');
                    tagsContainer.style.display = 'flex';
                } else {
                    tagsContainer.style.display = 'none';
                }
            }

            const links = card.querySelectorAll('.project-link');
            const hasDemo = demo && demo.trim() && demo !== '#';
            const hasSource = source && source.trim() && source !== '#';

            if (links[0]) {
                if (hasDemo) {
                    links[0].href = demo.trim();
                    links[0].style.display = 'inline-flex';
                } else {
                    links[0].style.display = 'none';
                }
            }
            if (links[1]) {
                if (hasSource) {
                    links[1].href = source.trim();
                    links[1].style.display = 'inline-flex';
                } else {
                    links[1].style.display = 'none';
                }
            }

            const linksContainer = card.querySelector('.project-links');
            if (linksContainer) {
                linksContainer.style.display = (hasDemo || hasSource) ? 'flex' : 'none';
            }
        }
    }

    /* ---- EXPERIENCE (Dynamic Flexible List & Custom Milestones) ---- */
    const timelineContainer = document.getElementById('timeline-container') || document.querySelector('.timeline');
    const expSection = document.getElementById('experience');

    if (Array.isArray(data.experienceList) && data.experienceList.length > 0) {
        const activeExps = data.experienceList.filter(e => (e.title && e.title.trim()) || (e.company && e.company.trim()));
        if (activeExps.length === 0) {
            if (expSection) expSection.style.display = 'none';
        } else {
            if (expSection) expSection.style.display = 'block';
            if (timelineContainer) {
                timelineContainer.innerHTML = activeExps.map(e => `
                <div class="timeline-item">
                    <div class="timeline-marker">
                        <div class="timeline-dot"></div>
                    </div>
                    <div class="timeline-content">
                        ${e.date ? `<span class="timeline-date">${escapeHtml(e.date)}</span>` : ''}
                        <h3>${escapeHtml(e.title || '')}</h3>
                        ${e.company ? `<span class="timeline-company">${escapeHtml(e.company)}</span>` : ''}
                        ${e.desc ? `<p>${escapeHtml(e.desc)}</p>` : ''}
                    </div>
                </div>`).join('');
            }
        }
    } else {
        // Fallback: Legacy Experience 1 to 4
        for (let i = 1; i <= 4; i++) {
            const item = document.getElementById(`exp-${i}`);
            if (!item) continue;
            const title = data[`exp${i}Title`];
            const date = data[`exp${i}Date`];
            const company = data[`exp${i}Company`];
            const desc = data[`exp${i}Desc`];

            if ((!title || !title.trim()) && (!company || !company.trim())) {
                item.style.display = 'none';
                continue;
            }

            item.style.display = 'block';

            const d = item.querySelector('.timeline-date');
            if (d) {
                if (date && date.trim()) {
                    d.textContent = date.trim();
                    d.style.display = 'inline-block';
                } else {
                    d.style.display = 'none';
                }
            }

            const h = item.querySelector('.timeline-content h3');
            if (h) h.textContent = (title || '').trim();

            const c = item.querySelector('.timeline-company');
            if (c) {
                if (company && company.trim()) {
                    c.textContent = company.trim();
                    c.style.display = 'block';
                } else {
                    c.style.display = 'none';
                }
            }

            const p = item.querySelector('.timeline-content p');
            if (p) {
                if (desc && desc.trim()) {
                    p.textContent = desc.trim();
                    p.style.display = 'block';
                } else {
                    p.style.display = 'none';
                }
            }
        }
    }

    /* ---- CONTACT & SOCIAL (Hide if empty) ---- */
    const emailCard = document.getElementById('contact-email-card');
    if (emailCard) {
        if (data.email && data.email.trim()) {
            emailCard.style.display = 'flex';
            const s = emailCard.querySelector('span');
            if (s) s.textContent = data.email.trim();
        } else {
            emailCard.style.display = 'none';
        }
    }

    const locCard = document.getElementById('contact-location-card');
    if (locCard) {
        if (data.location && data.location.trim()) {
            locCard.style.display = 'flex';
            const s = locCard.querySelector('span');
            if (s) s.textContent = data.location.trim();
        } else {
            locCard.style.display = 'none';
        }
    }

    /* ---- FLEXIBLE CONTACTS & SOCIALS (Rendered in About & Contact) ---- */
    let socialItems = [];
    if (Array.isArray(data.socialLinks) && data.socialLinks.length > 0) {
        socialItems = data.socialLinks;
    } else {
        // Fallback to legacy fields
        if (data.github) socialItems.push({ platform: 'github', label: 'GitHub', url: data.github });
        if (data.linkedin) socialItems.push({ platform: 'linkedin', label: 'LinkedIn', url: data.linkedin });
        if (data.twitter) socialItems.push({ platform: 'twitter', label: 'Twitter / X', url: data.twitter });
        if (data.devto) socialItems.push({ platform: 'devto', label: 'Dev.to', url: data.devto });
        if (data.email) socialItems.push({ platform: 'email', label: 'Email', url: `mailto:${data.email}` });
    }

    const activeSocials = socialItems.filter(item => item && item.url && item.url.trim() && item.url.trim() !== '#');

    // 1. Render in About section pills
    const aboutContactsWrapper = document.getElementById('about-contacts-wrapper');
    const aboutContactsPills = document.getElementById('about-contacts-pills');
    if (aboutContactsWrapper && aboutContactsPills) {
        if (activeSocials.length > 0) {
            aboutContactsWrapper.style.display = 'flex';
            aboutContactsPills.innerHTML = activeSocials.map(item => {
                const href = item.url.trim();
                const isMail = href.startsWith('mailto:') || href.startsWith('tel:');
                const target = isMail ? '' : 'target="_blank" rel="noopener noreferrer"';
                return `
                <a href="${escapeHtml(href)}" ${target} class="about-contact-pill" title="${escapeHtml(item.label || item.platform)}">
                    ${getSocialIcon(item.platform || item.label)}
                    <span>${escapeHtml(item.label || item.platform)}</span>
                </a>`;
            }).join('');
        } else {
            aboutContactsWrapper.style.display = 'none';
        }
    }

    // 2. Render in Contact section social links
    const socialLinksContainer = document.getElementById('social-links-container');
    if (socialLinksContainer) {
        if (activeSocials.length > 0) {
            socialLinksContainer.style.display = 'flex';
            socialLinksContainer.innerHTML = activeSocials.map(item => {
                const href = item.url.trim();
                const isMail = href.startsWith('mailto:') || href.startsWith('tel:');
                const target = isMail ? '' : 'target="_blank" rel="noopener noreferrer"';
                return `
                <a href="${escapeHtml(href)}" ${target} class="social-link" title="${escapeHtml(item.label || item.platform)}" aria-label="${escapeHtml(item.label || item.platform)}">
                    ${getSocialIcon(item.platform || item.label)}
                </a>`;
            }).join('');
        } else {
            socialLinksContainer.style.display = 'none';
        }
    }

    // Legacy element IDs update (fallback)
    const updateSocial = (id, url) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (url && url.trim() && url !== '#') {
            el.href = url.trim();
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';
        }
    };
    updateSocial('social-github', data.github);
    updateSocial('social-linkedin', data.linkedin);
    updateSocial('social-twitter', data.twitter);
    updateSocial('social-devto', data.devto);
}

/* ==========================================================================
   5. SECRET ADMIN ACCESS (Ctrl+Shift+A)
   ========================================================================== */
function initSecretAdminAccess() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
            e.preventDefault();
            window.location.href = 'admin.html';
        }
    });
}

/* ==========================================================================
   6. TYPING EFFECT (Clean Monospace Terminal)
   ========================================================================== */
function initTypingEffect() {
    let roles = [
        'Full-Stack Developer',
        'Cloud Architect',
        'DevOps Engineer',
        'Systems Strategist',
        'Problem Solver'
    ];

    fetch('data.json?_t=' + Date.now())
        .then(r => r.ok ? r.json() : null)
        .then(data => {
            if (data && data.roles) {
                roles = data.roles.split(',').map(r => r.trim()).filter(Boolean);
            }
        })
        .catch(() => {})
        .finally(() => { 
            startTyping(roles); 
        });
}

function startTyping(roles) {
    const el = document.getElementById('typed-role');
    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let pauseEnd = 0;

    function tick() {
        const currentRole = roles[roleIndex];
        const now = Date.now();

        if (now < pauseEnd) {
            requestAnimationFrame(tick);
            return;
        }

        if (!isDeleting) {
            el.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isDeleting = true;
                pauseEnd = now + 2400; // Longer pause on full word
            }
        } else {
            el.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                pauseEnd = now + 350;
            }
        }

        const speed = isDeleting ? 30 : 65;
        setTimeout(() => requestAnimationFrame(tick), speed);
    }

    setTimeout(() => requestAnimationFrame(tick), 800);
}

/* ==========================================================================
   7. NAVIGATION & DYNAMIC ISLAND SCROLL
   ========================================================================== */
function initNavigation() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navLinksAll = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 40);
        updateActiveLink();
    }, { passive: true });

    // Initial check
    updateActiveLink();

    // Mobile toggle
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            links.classList.toggle('open');
        });

        // Close on link click
        navLinksAll.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('open');
            });
        });
    }
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 220;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPosition >= top && scrollPosition < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/* ==========================================================================
   8. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
    const revealSelectors = [
        '.section-header',
        '.about-text',
        '.about-image-container',
        '.skill-category',
        '.project-card',
        '.timeline-item',
        '.contact-form',
        '.contact-info'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${(i % 3) * 0.12}s`;
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. COUNTER ANIMATION
   ========================================================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ==========================================================================
   10. CONTACT TRANSMISSION FORM
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;

        // Feedback state
        btn.innerHTML = `
            <span>Transmitting...</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
        `;
        btn.disabled = true;
        btn.style.opacity = '0.75';

        setTimeout(() => {
            btn.innerHTML = `
                <span>Transmission Received</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            btn.style.opacity = '1';
            btn.style.background = '#ffffff';
            btn.style.color = '#000000';

            form.reset();

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.disabled = false;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.opacity = '';
            }, 3500);
        }, 1200);
    });
}

/* ==========================================================================
   11. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/* Spin animation for form submitting */
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; }
`;
document.head.appendChild(spinStyle);
