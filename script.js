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
        const res = await fetch('data.json?_t=' + Date.now()); // cache-bust
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
