/* ==========================================================================
   ADMIN — Dynamic Portfolio Editor & Flexibility Manager
   ========================================================================== */

const DATA_URL = '/data.json';
const SAVE_URL = '/api/save';

// Default data baseline
const DEFAULTS = {
    profileImage: 'images/profile.jpg',
    name: 'Kizaah Josh V. Dela Cruz',
    greeting: "Hello, I'm",
    roles: 'Full-Stack Developer, Technical Support, Project Manager',
    heroDescription: 'Crafting elegant solutions at the intersection of cloud architecture, full-stack development, and DevOps engineering. Turning complex problems into seamless digital experiences.',
    stat1Number: '2', stat1Label: 'Years Experience',
    stat2Number: '20', stat2Label: 'Projects Delivered',
    stat3Number: '12', stat3Label: 'Happy Clients',
    badgeText: 'Available for opportunities',
    codeCardTitle: 'architect.ts',
    codeCardContent: `interface Developer {
  name: "Kizaah Josh V. Dela Cruz";
  role: "Full-Stack & Cloud";
  languages: string[];
  passion: "Building resilient systems";
}

const engineer: Developer = {
  name: "Kizaah Josh V. Dela Cruz",
  role: "Full-Stack & Cloud",
  languages: [
    "TypeScript", "Python",
    "Go", "Rust"
  ],
  passion: "Building resilient systems"
};`,
    aboutP1: "I'm a passionate IT professional with <strong>8+ years</strong> of experience building scalable, resilient systems. My journey started with tinkering in Linux terminals and evolved into architecting cloud-native solutions for enterprise clients.",
    aboutP2: "I thrive at the intersection of <strong>development and operations</strong>, bridging the gap between elegant code and robust infrastructure. Whether it's designing microservices architectures, optimizing CI/CD pipelines, or mentoring teams — I bring both technical depth and strategic thinking.",
    aboutP3: "When I'm not coding, you'll find me contributing to open-source projects, writing technical blog posts, or exploring the latest in AI/ML and Web3 technologies.",
    cert1: '',
    cert2: '',
    cert3: '',
    float1: '20+ Projects',
    float2: 'Full Stack',
    skillsCategories: [
        {
            id: 'cat_1',
            title: 'Technical Skills',
            tags: 'React, Next.js, TypeScript, Vue.js, Tailwind CSS, SASS, Three.js'
        },
        {
            id: 'cat_2',
            title: 'Backend & Tools',
            tags: 'MySQL, SMTP (PHPMailer), CyberPanel, Tomorrow.io API, QR Code integration'
        },
        {
            id: 'cat_3',
            title: 'Cloud & DevOps',
            tags: 'AWS, GCP, Azure, Docker, Kubernetes, Terraform, CI/CD'
        },
        {
            id: 'cat_4',
            title: 'Databases',
            tags: 'PostgreSQL, MongoDB, Redis, DynamoDB, Elasticsearch, Neo4j'
        }
    ],
    projectsList: [
        {
            id: 'proj_1',
            title: 'Inventory Management System (OJT)',
            desc: 'Web-based inventory system that tracks, assigns, and manages items using QR code scanning; led the OJT team during development.',
            tags: 'PHP, Laravel, MySQL',
            demo: '#',
            source: '#'
        },
        {
            id: 'proj_2',
            title: 'Travel and Tours Customer Booking System',
            desc: 'Package booking and reservation management, automated email notifications via SMTP, real-time weather forecasting integration for enhanced travel planning, and server administration using CyberPanel.',
            tags: 'PHP, Laravel, MySQL, SMTP, CyberPanel, Tomorrow.io API',
            demo: '#',
            source: '#'
        }
    ],
    experienceList: [
        {
            id: 'exp_1',
            date: '2022 — Present',
            title: 'Senior Cloud Architect',
            company: 'TechNova Solutions',
            desc: 'Leading cloud migration strategies for Fortune 500 clients. Architected multi-region Kubernetes clusters serving 100M+ requests/day. Reduced infrastructure costs by 40% through auto-scaling optimization.'
        }
    ],
    socialLinks: [
        { id: 'soc_1', platform: 'github', label: 'GitHub', url: 'https://github.com/Kizaahjoshdc2003' },
        { id: 'soc_2', platform: 'linkedin', label: 'LinkedIn', url: '' },
        { id: 'soc_3', platform: 'email', label: 'Email', url: 'mailto:kizaahjoshdelacruz@gmail.com' },
        { id: 'soc_4', platform: 'twitter', label: 'Twitter / X', url: '' },
        { id: 'soc_5', platform: 'telegram', label: 'Telegram', url: '' },
        { id: 'soc_6', platform: 'whatsapp', label: 'WhatsApp', url: '' },
        { id: 'soc_7', platform: 'facebook', label: 'Facebook', url: '' }
    ],
    email: 'kizaahjoshdelacruz@gmail.com',
    location: '#100 Mabuhay Street, Area 5, Bagong Silangan, Quezon City',
    github: 'https://github.com/Kizaahjoshdc2003', linkedin: '#', twitter: '#', devto: '#'
};

/* ---- State ---- */
let data = {};
let serverAvailable = false;

/* ---- Escape Helpers ---- */
function escapeAttr(str = '') {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    populateFields();
    renderSkillsEditor();
    renderProjectsEditor();
    renderExperienceEditor();
    renderSocialsEditor();
    initTabs();
    initReset();
    initImageUpload();
    checkServer();
    updateLiveBadges();

    // Listen to changes across all inputs to update live badges immediately
    document.body.addEventListener('input', () => {
        updateLiveBadges();
    });
});

async function loadData() {
    try {
        const res = await fetch(DATA_URL + '?_t=' + Date.now());
        if (res.ok) {
            const fileData = await res.json();
            data = { ...DEFAULTS, ...fileData };

            // Ensure skillsCategories is populated
            if (!Array.isArray(data.skillsCategories) || data.skillsCategories.length === 0) {
                data.skillsCategories = [
                    { id: 'cat_1', title: 'Technical Skills', tags: data.skillsFrontend || '' },
                    { id: 'cat_2', title: 'Backend & Tools', tags: data.skillsBackend || '' },
                    { id: 'cat_3', title: 'Cloud & DevOps', tags: data.skillsCloud || '' },
                    { id: 'cat_4', title: 'Databases', tags: data.skillsData || '' }
                ].filter(c => c.tags || c.title);
            }

            // Ensure projectsList is populated
            if (!Array.isArray(data.projectsList) || data.projectsList.length === 0) {
                data.projectsList = [];
                for (let i = 1; i <= 4; i++) {
                    const title = data[`proj${i}Title`];
                    if (title && title.trim()) {
                        data.projectsList.push({
                            id: `proj_${i}`,
                            title: title,
                            desc: data[`proj${i}Desc`] || '',
                            tags: data[`proj${i}Tags`] || '',
                            demo: data[`proj${i}Demo`] || '#',
                            source: data[`proj${i}Source`] || '#'
                        });
                    }
                }
            }

            // Ensure experienceList is populated
            if (!Array.isArray(data.experienceList) || data.experienceList.length === 0) {
                data.experienceList = [];
                for (let i = 1; i <= 4; i++) {
                    const title = data[`exp${i}Title`];
                    const comp = data[`exp${i}Company`];
                    if ((title && title.trim()) || (comp && comp.trim())) {
                        data.experienceList.push({
                            id: `exp_${i}`,
                            date: data[`exp${i}Date`] || '',
                            company: comp || '',
                            title: title || '',
                            desc: data[`exp${i}Desc`] || ''
                        });
                    }
                }
            }

            // Ensure socialLinks is populated
            if (!Array.isArray(data.socialLinks) || data.socialLinks.length === 0) {
                data.socialLinks = [];
                if (data.github && data.github !== '#') data.socialLinks.push({ id: 'soc_gh', platform: 'github', label: 'GitHub', url: data.github });
                if (data.linkedin && data.linkedin !== '#') data.socialLinks.push({ id: 'soc_li', platform: 'linkedin', label: 'LinkedIn', url: data.linkedin });
                if (data.twitter && data.twitter !== '#') data.socialLinks.push({ id: 'soc_tw', platform: 'twitter', label: 'Twitter / X', url: data.twitter });
                if (data.devto && data.devto !== '#') data.socialLinks.push({ id: 'soc_dev', platform: 'devto', label: 'Dev.to', url: data.devto });
                if (data.email) data.socialLinks.push({ id: 'soc_em', platform: 'email', label: 'Email', url: `mailto:${data.email}` });
                if (data.socialLinks.length === 0) {
                    data.socialLinks = JSON.parse(JSON.stringify(DEFAULTS.socialLinks));
                }
            }

            // Fallback code card defaults if not set
            if (data.codeCardTitle === undefined) data.codeCardTitle = DEFAULTS.codeCardTitle;
            if (data.codeCardContent === undefined) data.codeCardContent = DEFAULTS.codeCardContent;
        } else {
            data = { ...DEFAULTS };
        }
    } catch (e) {
        data = { ...DEFAULTS };
    }
}

async function checkServer() {
    try {
        const res = await fetch(SAVE_URL, { method: 'OPTIONS' });
        serverAvailable = (res.status === 204 || res.ok);
    } catch (e) {
        serverAvailable = false;
    }

    if (!serverAvailable) {
        showToast('⚠️ Server not detected — saves will download as a file. Run "node server.js" for auto-save.', 6000);
    }
}

function populateFields() {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        el.value = (data[key] !== undefined && data[key] !== null) ? data[key] : '';
    });
}

/* ---- Tab Switching ---- */
function initTabs() {
    const tabs = document.querySelectorAll('.admin-tab[data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const panel = document.getElementById(`panel-${tab.dataset.tab}`);
            if (panel) panel.classList.add('active');
        });
    });
}

/* ==========================================================================
   DYNAMIC SKILLS CATEGORIES EDITOR
   ========================================================================== */
function renderSkillsEditor() {
    const container = document.getElementById('skills-categories-editor');
    if (!container) return;

    if (!Array.isArray(data.skillsCategories) || data.skillsCategories.length === 0) {
        data.skillsCategories = [
            { id: 'cat_1', title: 'Technical Skills', tags: '' }
        ];
    }

    container.innerHTML = data.skillsCategories.map((cat, idx) => `
        <div class="panel-body glass-card skill-category-edit-block" data-category-index="${idx}">
            <div class="block-header">
                <div class="block-title-group">
                    <h3 class="block-title mb-0">Category ${idx + 1}</h3>
                    <span class="status-indicator-badge" id="status-badge-cat-${idx}">Active</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn-clear-item" onclick="clearSkillCategory(${idx})" title="Clear category content">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        <span>Clear</span>
                    </button>
                    <button type="button" class="btn-delete-item" onclick="deleteSkillCategory(${idx})" title="Delete this entire category">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <div class="field-group">
                <div class="field-label-row">
                    <label>Category Title <span class="field-hint">(e.g. Technical Skills, Backend, Tools & APIs)</span></label>
                    <button type="button" class="btn-text-clear" onclick="clearCatField(${idx}, 'title')" title="Clear title">Clear</button>
                </div>
                <input type="text" class="category-title-input" value="${escapeAttr(cat.title || '')}" placeholder="e.g. Technical Skills, Tools, Cloud...">
            </div>
            <div class="field-group">
                <div class="field-label-row">
                    <label>Skills <span class="field-hint">(comma-separated)</span></label>
                    <button type="button" class="btn-text-clear" onclick="clearCatField(${idx}, 'tags')" title="Clear skills">Clear</button>
                </div>
                <input type="text" class="category-tags-input" value="${escapeAttr(cat.tags || '')}" placeholder="React, Node.js, Python, Docker, Git...">
            </div>
        </div>
    `).join('');

    updateLiveBadges();
}

function addSkillCategory() {
    syncSkillsFromDom();
    data.skillsCategories.push({
        id: `cat_${Date.now()}`,
        title: 'New Skill Category',
        tags: ''
    });
    renderSkillsEditor();
    showToast('✨ Added new skill category! Edit title and skills, then click Save.');

    // Scroll to the new category
    const blocks = document.querySelectorAll('.skill-category-edit-block');
    const last = blocks[blocks.length - 1];
    if (last) {
        last.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const titleInput = last.querySelector('.category-title-input');
        if (titleInput) {
            titleInput.focus();
            titleInput.select();
        }
    }
}
window.addSkillCategory = addSkillCategory;

function deleteSkillCategory(idx) {
    syncSkillsFromDom();
    const cat = data.skillsCategories[idx];
    const catName = cat?.title || `Category ${idx + 1}`;
    if (!confirm(`Delete "${catName}" completely?\n\nIt will be removed from your portfolio when you click Save.`)) return;

    data.skillsCategories.splice(idx, 1);
    renderSkillsEditor();
    showToast(`🗑️ Deleted "${catName}". Click "Save Skills" to publish.`);
}
window.deleteSkillCategory = deleteSkillCategory;

function clearSkillCategory(idx) {
    const block = document.querySelector(`.skill-category-edit-block[data-category-index="${idx}"]`);
    if (!block) return;
    block.querySelector('.category-title-input').value = '';
    block.querySelector('.category-tags-input').value = '';
    updateLiveBadges();
    showToast(`Cleared Category ${idx + 1}. Empty categories are hidden from the portfolio.`);
}
window.clearSkillCategory = clearSkillCategory;

function clearCatField(idx, field) {
    const block = document.querySelector(`.skill-category-edit-block[data-category-index="${idx}"]`);
    if (!block) return;
    const input = block.querySelector(field === 'title' ? '.category-title-input' : '.category-tags-input');
    if (input) input.value = '';
    updateLiveBadges();
}
window.clearCatField = clearCatField;

function syncSkillsFromDom() {
    const blocks = document.querySelectorAll('#skills-categories-editor .skill-category-edit-block');
    data.skillsCategories = Array.from(blocks).map((block, idx) => ({
        id: `cat_${idx + 1}`,
        title: block.querySelector('.category-title-input')?.value.trim() || '',
        tags: block.querySelector('.category-tags-input')?.value.trim() || ''
    }));
}

/* ==========================================================================
   DYNAMIC PROJECTS EDITOR
   ========================================================================== */
function renderProjectsEditor() {
    const container = document.getElementById('projects-editor');
    if (!container) return;

    if (!Array.isArray(data.projectsList) || data.projectsList.length === 0) {
        data.projectsList = [
            { id: 'proj_1', title: '', desc: '', tags: '', demo: '#', source: '#' }
        ];
    }

    container.innerHTML = data.projectsList.map((p, idx) => `
        <div class="panel-body glass-card project-edit-block" data-project-index="${idx}">
            <div class="block-header">
                <div class="block-title-group">
                    <h3 class="block-title mb-0">Project ${idx + 1}</h3>
                    <span class="status-indicator-badge" id="status-badge-proj-${idx}">Active</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn-clear-item" onclick="clearProjectItem(${idx})" title="Clear project content">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        <span>Clear</span>
                    </button>
                    <button type="button" class="btn-delete-item" onclick="deleteProjectItem(${idx})" title="Delete this project completely">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <div class="field-group">
                <label>Project Title <span class="field-hint">(Leave empty to hide from portfolio)</span></label>
                <input type="text" class="proj-title-input" value="${escapeAttr(p.title || '')}" placeholder="Leave empty to hide from portfolio">
            </div>
            <div class="field-group">
                <label>Description</label>
                <textarea class="proj-desc-input" rows="2" placeholder="Brief project summary...">${escapeAttr(p.desc || '')}</textarea>
            </div>
            <div class="field-group">
                <label>Tags <span class="field-hint">(comma-separated)</span></label>
                <input type="text" class="proj-tags-input" value="${escapeAttr(p.tags || '')}" placeholder="React, Node.js, ML">
            </div>
            <div class="field-row">
                <div class="field-group">
                    <label>Demo URL</label>
                    <input type="url" class="proj-demo-input" value="${escapeAttr(p.demo || '')}" placeholder="https://...">
                </div>
                <div class="field-group">
                    <label>Source URL</label>
                    <input type="url" class="proj-source-input" value="${escapeAttr(p.source || '')}" placeholder="https://...">
                </div>
            </div>
        </div>
    `).join('');

    updateLiveBadges();
}

function addNewProject() {
    syncProjectsFromDom();
    data.projectsList.push({
        id: `proj_${Date.now()}`,
        title: '',
        desc: '',
        tags: '',
        demo: '#',
        source: '#'
    });
    renderProjectsEditor();
    showToast('✨ Added new project card! Fill in the details and click Save.');

    const blocks = document.querySelectorAll('#projects-editor .project-edit-block');
    const last = blocks[blocks.length - 1];
    if (last) {
        last.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const titleInput = last.querySelector('.proj-title-input');
        if (titleInput) titleInput.focus();
    }
}
window.addNewProject = addNewProject;

function deleteProjectItem(idx) {
    syncProjectsFromDom();
    const p = data.projectsList[idx];
    const pName = p?.title || `Project ${idx + 1}`;
    if (!confirm(`Delete "${pName}" completely?\n\nIt will be removed from your portfolio when you click Save.`)) return;

    data.projectsList.splice(idx, 1);
    renderProjectsEditor();
    showToast(`🗑️ Deleted "${pName}". Click "Save All Projects" to apply.`);
}
window.deleteProjectItem = deleteProjectItem;

function clearProjectItem(idx) {
    const block = document.querySelector(`#projects-editor .project-edit-block[data-project-index="${idx}"]`);
    if (!block) return;
    block.querySelector('.proj-title-input').value = '';
    block.querySelector('.proj-desc-input').value = '';
    block.querySelector('.proj-tags-input').value = '';
    block.querySelector('.proj-demo-input').value = '';
    block.querySelector('.proj-source-input').value = '';
    updateLiveBadges();
    showToast(`Cleared Project ${idx + 1}. Empty projects are hidden from the portfolio.`);
}
window.clearProjectItem = clearProjectItem;

function syncProjectsFromDom() {
    const blocks = document.querySelectorAll('#projects-editor .project-edit-block');
    data.projectsList = Array.from(blocks).map((block, idx) => ({
        id: `proj_${idx + 1}`,
        title: block.querySelector('.proj-title-input')?.value.trim() || '',
        desc: block.querySelector('.proj-desc-input')?.value.trim() || '',
        tags: block.querySelector('.proj-tags-input')?.value.trim() || '',
        demo: block.querySelector('.proj-demo-input')?.value.trim() || '',
        source: block.querySelector('.proj-source-input')?.value.trim() || ''
    }));
}

/* ==========================================================================
   DYNAMIC EXPERIENCE EDITOR
   ========================================================================== */
function renderExperienceEditor() {
    const container = document.getElementById('experience-editor');
    if (!container) return;

    if (!Array.isArray(data.experienceList) || data.experienceList.length === 0) {
        data.experienceList = [
            { id: 'exp_1', date: '', company: '', title: '', desc: '' }
        ];
    }

    container.innerHTML = data.experienceList.map((e, idx) => `
        <div class="panel-body glass-card project-edit-block" data-experience-index="${idx}">
            <div class="block-header">
                <div class="block-title-group">
                    <h3 class="block-title mb-0">Experience ${idx + 1}</h3>
                    <span class="status-indicator-badge" id="status-badge-exp-${idx}">Active</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button type="button" class="btn-clear-item" onclick="clearExperienceItem(${idx})" title="Clear experience milestone">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        <span>Clear</span>
                    </button>
                    <button type="button" class="btn-delete-item" onclick="deleteExperienceItem(${idx})" title="Delete this milestone completely">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <div class="field-row">
                <div class="field-group">
                    <label>Date Range</label>
                    <input type="text" class="exp-date-input" value="${escapeAttr(e.date || '')}" placeholder="2022 — Present">
                </div>
                <div class="field-group">
                    <label>Company</label>
                    <input type="text" class="exp-company-input" value="${escapeAttr(e.company || '')}" placeholder="TechNova Solutions">
                </div>
            </div>
            <div class="field-group">
                <label>Job Title <span class="field-hint">(Leave empty to hide this milestone)</span></label>
                <input type="text" class="exp-title-input" value="${escapeAttr(e.title || '')}" placeholder="Senior Cloud Architect">
            </div>
            <div class="field-group">
                <label>Description</label>
                <textarea class="exp-desc-input" rows="3" placeholder="Key responsibilities and achievements...">${escapeAttr(e.desc || '')}</textarea>
            </div>
        </div>
    `).join('');

    updateLiveBadges();
}

function addNewExperience() {
    syncExperienceFromDom();
    data.experienceList.push({
        id: `exp_${Date.now()}`,
        date: '',
        company: '',
        title: '',
        desc: ''
    });
    renderExperienceEditor();
    showToast('✨ Added new experience milestone! Fill in the details and click Save.');

    const blocks = document.querySelectorAll('#experience-editor .project-edit-block');
    const last = blocks[blocks.length - 1];
    if (last) {
        last.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const titleInput = last.querySelector('.exp-title-input');
        if (titleInput) titleInput.focus();
    }
}
window.addNewExperience = addNewExperience;

function deleteExperienceItem(idx) {
    syncExperienceFromDom();
    const e = data.experienceList[idx];
    const eName = e?.title || e?.company || `Experience ${idx + 1}`;
    if (!confirm(`Delete "${eName}" completely?\n\nIt will be removed from your portfolio when you click Save.`)) return;

    data.experienceList.splice(idx, 1);
    renderExperienceEditor();
    showToast(`🗑️ Deleted "${eName}". Click "Save All Experience" to apply.`);
}
window.deleteExperienceItem = deleteExperienceItem;

function clearExperienceItem(idx) {
    const block = document.querySelector(`#experience-editor .project-edit-block[data-experience-index="${idx}"]`);
    if (!block) return;
    block.querySelector('.exp-date-input').value = '';
    block.querySelector('.exp-company-input').value = '';
    block.querySelector('.exp-title-input').value = '';
    block.querySelector('.exp-desc-input').value = '';
    updateLiveBadges();
    showToast(`Cleared Experience ${idx + 1}. Empty milestones are hidden from the portfolio.`);
}
window.clearExperienceItem = clearExperienceItem;

function syncExperienceFromDom() {
    const blocks = document.querySelectorAll('#experience-editor .project-edit-block');
    data.experienceList = Array.from(blocks).map((block, idx) => ({
        id: `exp_${idx + 1}`,
        date: block.querySelector('.exp-date-input')?.value.trim() || '',
        company: block.querySelector('.exp-company-input')?.value.trim() || '',
        title: block.querySelector('.exp-title-input')?.value.trim() || '',
        desc: block.querySelector('.exp-desc-input')?.value.trim() || ''
    }));
}

/* ==========================================================================
   FLEXIBLE CONTACTS & SOCIALS EDITOR
   ========================================================================== */
const SOCIAL_PLATFORMS = [
    { value: 'github', label: 'GitHub' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'discord', label: 'Discord' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'email', label: 'Direct Email (mailto)' },
    { value: 'phone', label: 'Phone / SMS (tel)' },
    { value: 'devto', label: 'Dev.to / Blog' },
    { value: 'medium', label: 'Medium' },
    { value: 'reddit', label: 'Reddit' },
    { value: 'website', label: 'Custom Website / Link' }
];

function renderSocialsEditor() {
    const container = document.getElementById('socials-editor-list');
    if (!container) return;

    if (!Array.isArray(data.socialLinks) || data.socialLinks.length === 0) {
        data.socialLinks = [
            { id: 'soc_1', platform: 'github', label: 'GitHub', url: 'https://github.com/Kizaahjoshdc2003' },
            { id: 'soc_2', platform: 'email', label: 'Email', url: 'mailto:kizaahjoshdelacruz@gmail.com' }
        ];
    }

    container.innerHTML = data.socialLinks.map((s, idx) => `
        <div class="project-edit-block" data-social-index="${idx}" style="margin-bottom: 16px;">
            <div class="project-edit-header">
                <div class="block-title-group">
                    <span class="block-num">#${idx + 1}</span>
                    <strong class="block-title mb-0">${escapeAttr(s.label || s.platform || 'Contact Link')}</strong>
                    <span class="status-indicator-badge" id="status-badge-soc-${idx}">Active on site</span>
                </div>
                <div class="label-right">
                    <button type="button" class="btn-clear-item" onclick="clearSocialLink(${idx})" title="Clear link to hide from site">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        <span>Clear</span>
                    </button>
                    <button type="button" class="btn-delete-item" onclick="deleteSocialLink(${idx})" title="Remove contact completely">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
            <div class="field-row">
                <div class="field-group">
                    <label>Platform / Network</label>
                    <select class="soc-platform-select" onchange="onSocialPlatformChange(${idx}, this.value)">
                        ${SOCIAL_PLATFORMS.map(p => `
                            <option value="${p.value}" ${s.platform === p.value ? 'selected' : ''}>${p.label}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="field-group">
                    <label>Display Label <span class="field-hint">(e.g. GitHub, Work WhatsApp)</span></label>
                    <input type="text" class="soc-label-input" value="${escapeAttr(s.label || '')}" placeholder="Label on button">
                </div>
            </div>
            <div class="field-group" style="margin-top: 8px;">
                <label>URL / Transmission Value <span class="field-hint">(Leave empty or # to hide)</span></label>
                <input type="text" class="soc-url-input" value="${escapeAttr(s.url || '')}" placeholder="https://... or mailto:you@domain.com or tel:+123456789">
            </div>
        </div>
    `).join('');

    updateLiveBadges();
}

function onSocialPlatformChange(idx, val) {
    const block = document.querySelector(`#socials-editor-list .project-edit-block[data-social-index="${idx}"]`);
    if (!block) return;
    const labelInput = block.querySelector('.soc-label-input');
    if (labelInput && (!labelInput.value.trim() || SOCIAL_PLATFORMS.some(p => p.label === labelInput.value.trim()))) {
        const found = SOCIAL_PLATFORMS.find(p => p.value === val);
        if (found) labelInput.value = found.label;
    }
    const titleEl = block.querySelector('.block-title');
    if (titleEl && labelInput) {
        titleEl.textContent = labelInput.value.trim() || val;
    }
    updateLiveBadges();
}
window.onSocialPlatformChange = onSocialPlatformChange;

function addNewSocialLink() {
    syncSocialsFromDom();
    data.socialLinks.push({
        id: `soc_${Date.now()}`,
        platform: 'website',
        label: 'Custom Link',
        url: ''
    });
    renderSocialsEditor();
    showToast('✨ Added new contact method! Fill in your link and click Save.');

    const blocks = document.querySelectorAll('#socials-editor-list .project-edit-block');
    const last = blocks[blocks.length - 1];
    if (last) {
        last.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const urlInput = last.querySelector('.soc-url-input');
        if (urlInput) urlInput.focus();
    }
}
window.addNewSocialLink = addNewSocialLink;

function deleteSocialLink(idx) {
    syncSocialsFromDom();
    const s = data.socialLinks[idx];
    const sName = s?.label || s?.platform || `Contact ${idx + 1}`;
    if (!confirm(`Delete "${sName}"?\n\nIt will be removed from your portfolio upon saving.`)) return;

    data.socialLinks.splice(idx, 1);
    renderSocialsEditor();
    showToast(`🗑️ Deleted "${sName}". Click "Save Changes" to publish.`);
}
window.deleteSocialLink = deleteSocialLink;

function clearSocialLink(idx) {
    const block = document.querySelector(`#socials-editor-list .project-edit-block[data-social-index="${idx}"]`);
    if (!block) return;
    block.querySelector('.soc-url-input').value = '';
    updateLiveBadges();
    showToast(`Cleared Contact ${idx + 1}. Empty contacts are hidden from the portfolio.`);
}
window.clearSocialLink = clearSocialLink;

function syncSocialsFromDom() {
    const blocks = document.querySelectorAll('#socials-editor-list .project-edit-block');
    data.socialLinks = Array.from(blocks).map((block, idx) => ({
        id: `soc_${idx + 1}`,
        platform: block.querySelector('.soc-platform-select')?.value || 'website',
        label: block.querySelector('.soc-label-input')?.value.trim() || '',
        url: block.querySelector('.soc-url-input')?.value.trim() || ''
    }));

    // Keep legacy single fields in sync with primary matching items if present
    const gh = data.socialLinks.find(s => s.platform === 'github');
    if (gh) data.github = gh.url || '';
    const li = data.socialLinks.find(s => s.platform === 'linkedin');
    if (li) data.linkedin = li.url || '';
    const tw = data.socialLinks.find(s => s.platform === 'twitter');
    if (tw) data.twitter = tw.url || '';
    const dev = data.socialLinks.find(s => s.platform === 'devto');
    if (dev) data.devto = dev.url || '';
}

/* ==========================================================================
   CODE CARD ACTIONS
   ========================================================================== */
function resetDefaultCodeCard() {
    const titleInput = document.getElementById('edit-code-title');
    const contentTextarea = document.getElementById('edit-code-content');
    if (titleInput) titleInput.value = 'architect.ts';
    if (contentTextarea) contentTextarea.value = DEFAULTS.codeCardContent;
    data.codeCardTitle = 'architect.ts';
    data.codeCardContent = DEFAULTS.codeCardContent;
    updateLiveBadges();
    showToast('🔄 Restored default TypeScript developer interface snippet! Click "Save Changes" to publish.');
}
window.resetDefaultCodeCard = resetDefaultCodeCard;

function clearCodeCard() {
    const contentTextarea = document.getElementById('edit-code-content');
    if (contentTextarea) contentTextarea.value = '';
    data.codeCardContent = '';
    updateLiveBadges();
    showToast('🗑️ Cleared code content. The code window card will be hidden from the hero section upon saving.');
}
window.clearCodeCard = clearCodeCard;

/* ---- Quick Clear Single Field Function ---- */
function clearField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = '';
    const key = el.dataset.key;
    if (key) data[key] = '';
    updateLiveBadges();
    showToast(`Cleared "${key}". Click "Save Changes" to apply.`);
}
window.clearField = clearField;

/* ==========================================================================
   SAVE PANEL (FULL SYNCHRONIZATION)
   ========================================================================== */
async function saveCurrentPanel(panelName) {
    const panel = document.getElementById(`panel-${panelName}`);
    if (!panel) return;

    // 1. Gather all direct data-key attributes in panel
    panel.querySelectorAll('[data-key]').forEach(el => {
        data[el.dataset.key] = el.value.trim();
    });

    // 2. Specific panel syncs
    if (panelName === 'skills') {
        syncSkillsFromDom();
        // Sync legacy keys for backward compatibility
        data.skillsFrontend = data.skillsCategories[0]?.tags || '';
        data.skillsBackend = data.skillsCategories[1]?.tags || '';
        data.skillsCloud = data.skillsCategories[2]?.tags || '';
        data.skillsData = data.skillsCategories[3]?.tags || '';
    } else if (panelName === 'projects') {
        syncProjectsFromDom();
        // Sync legacy keys
        for (let i = 1; i <= Math.max(4, data.projectsList.length); i++) {
            const p = data.projectsList[i - 1] || {};
            data[`proj${i}Title`] = p.title || '';
            data[`proj${i}Desc`] = p.desc || '';
            data[`proj${i}Tags`] = p.tags || '';
            data[`proj${i}Demo`] = p.demo || '';
            data[`proj${i}Source`] = p.source || '';
        }
    } else if (panelName === 'experience') {
        syncExperienceFromDom();
        // Sync legacy keys
        for (let i = 1; i <= Math.max(4, data.experienceList.length); i++) {
            const e = data.experienceList[i - 1] || {};
            data[`exp${i}Date`] = e.date || '';
            data[`exp${i}Company`] = e.company || '';
            data[`exp${i}Title`] = e.title || '';
            data[`exp${i}Desc`] = e.desc || '';
        }
    } else if (panelName === 'hero') {
        // Hero code card content preserves whitespace/newlines
        const codeContentEl = document.getElementById('edit-code-content');
        if (codeContentEl) {
            data.codeCardContent = codeContentEl.value;
        }
    } else if (panelName === 'contact') {
        syncSocialsFromDom();
    }

    updateLiveBadges();

    if (serverAvailable) {
        try {
            const res = await fetch(SAVE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                showToast('✅ Saved! All changes are now live on your portfolio.');
            } else {
                showToast('❌ Server error: ' + (result.error || 'Unknown'), 5000);
            }
        } catch (e) {
            showToast('❌ Network error — could not save.', 5000);
        }
    } else {
        downloadDataJson();
        showToast('📥 Downloaded data.json — replace the file in your project folder.', 5000);
    }
}
window.saveCurrentPanel = saveCurrentPanel;

/* ==========================================================================
   LIVE STATUS BADGES
   ========================================================================== */
function updateLiveBadges() {
    // Code Card
    const codeBadge = document.getElementById('status-badge-codecard');
    const codeEl = document.getElementById('edit-code-content');
    if (codeBadge && codeEl) {
        if (codeEl.value.trim()) {
            codeBadge.textContent = 'Active on site';
            codeBadge.className = 'status-indicator-badge badge-active';
        } else {
            codeBadge.textContent = 'Hidden (Empty)';
            codeBadge.className = 'status-indicator-badge badge-hidden';
        }
    }

    // Dynamic Skill Categories
    const skillBlocks = document.querySelectorAll('#skills-categories-editor .skill-category-edit-block');
    skillBlocks.forEach((block, idx) => {
        const badge = document.getElementById(`status-badge-cat-${idx}`);
        if (!badge) return;
        const title = block.querySelector('.category-title-input')?.value.trim();
        const tags = block.querySelector('.category-tags-input')?.value.trim();
        if (title || tags) {
            badge.textContent = 'Active on site';
            badge.className = 'status-indicator-badge badge-active';
        } else {
            badge.textContent = 'Hidden (Empty)';
            badge.className = 'status-indicator-badge badge-hidden';
        }
    });

    // Dynamic Projects
    const projBlocks = document.querySelectorAll('#projects-editor .project-edit-block');
    projBlocks.forEach((block, idx) => {
        const badge = document.getElementById(`status-badge-proj-${idx}`);
        if (!badge) return;
        const title = block.querySelector('.proj-title-input')?.value.trim();
        if (title) {
            badge.textContent = 'Active on site';
            badge.className = 'status-indicator-badge badge-active';
        } else {
            badge.textContent = 'Hidden (Empty)';
            badge.className = 'status-indicator-badge badge-hidden';
        }
    });

    // Dynamic Experience
    const expBlocks = document.querySelectorAll('#experience-editor .project-edit-block');
    expBlocks.forEach((block, idx) => {
        const badge = document.getElementById(`status-badge-exp-${idx}`);
        if (!badge) return;
        const title = block.querySelector('.exp-title-input')?.value.trim();
        const comp = block.querySelector('.exp-company-input')?.value.trim();
        if (title || comp) {
            badge.textContent = 'Active on site';
            badge.className = 'status-indicator-badge badge-active';
        } else {
            badge.textContent = 'Hidden (Empty)';
            badge.className = 'status-indicator-badge badge-hidden';
        }
    });

    // Dynamic Socials & Contacts
    const socBlocks = document.querySelectorAll('#socials-editor-list .project-edit-block');
    socBlocks.forEach((block, idx) => {
        const badge = document.getElementById(`status-badge-soc-${idx}`);
        if (!badge) return;
        const url = block.querySelector('.soc-url-input')?.value.trim();
        if (url && url !== '#') {
            badge.textContent = 'Active on site';
            badge.className = 'status-indicator-badge badge-active';
        } else {
            badge.textContent = 'Hidden (Empty)';
            badge.className = 'status-indicator-badge badge-hidden';
        }
    });

    // Certifications 1 to 3
    for (let i = 1; i <= 3; i++) {
        const certInput = document.querySelector(`[data-key="cert${i}"]`);
        const badge = document.getElementById(`status-badge-cert${i}`);
        if (!badge) continue;
        const val = certInput ? certInput.value.trim() : '';
        if (val) {
            badge.textContent = 'Visible';
            badge.className = 'status-indicator-badge badge-active';
        } else {
            badge.textContent = 'Hidden (Empty)';
            badge.className = 'status-indicator-badge badge-hidden';
        }
    }
}

/* ---- Download fallback ---- */
function downloadDataJson() {
    const blob = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/* ---- Toast Notification ---- */
function showToast(message, duration = 3500) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, duration);
}

/* ---- Reset to Defaults ---- */
function initReset() {
    const resetBtn = document.getElementById('tab-reset');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', async () => {
        if (confirm('Reset ALL portfolio data to original defaults? This will restore all placeholder projects and skills.')) {
            data = JSON.parse(JSON.stringify(DEFAULTS));
            populateFields();
            renderSkillsEditor();
            renderProjectsEditor();
            renderExperienceEditor();
            renderSocialsEditor();
            updateLiveBadges();

            if (serverAvailable) {
                try {
                    await fetch(SAVE_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    showToast('🔄 All data reset to defaults and saved!');
                } catch (e) {
                    showToast('Reset locally. Could not save to server.', 4000);
                }
            } else {
                downloadDataJson();
                showToast('🔄 Reset! Downloaded default data.json — replace the file in your project folder.', 5000);
            }
        }
    });
}

/* ---- Image Upload ---- */
function initImageUpload() {
    const area = document.getElementById('image-upload-area');
    const input = document.getElementById('profile-upload');
    const preview = document.getElementById('image-preview');
    const pathInput = document.getElementById('edit-profile-image');
    if (!area || !input) return;

    // Show existing image preview
    if (data.profileImage) {
        preview.src = data.profileImage + '?_t=' + Date.now();
        preview.onload = () => preview.classList.add('loaded');
        preview.onerror = () => preview.classList.remove('loaded');
    }

    // Click to upload
    area.addEventListener('click', () => input.click());

    // Drag & drop
    area.addEventListener('dragover', (e) => { e.preventDefault(); area.classList.add('drag-over'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleImageFile(file);
    });

    // File input change
    input.addEventListener('change', () => {
        if (input.files[0]) handleImageFile(input.files[0]);
    });

    async function handleImageFile(file) {
        if (file.size > 5 * 1024 * 1024) {
            showToast('❌ Image too large — max 5MB', 4000);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.classList.add('loaded');
        };
        reader.readAsDataURL(file);

        if (serverAvailable) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (result.success) {
                    data.profileImage = result.path;
                    if (pathInput) pathInput.value = result.path;
                    showToast('✅ Photo uploaded! Click "Save Changes" to publish.', 4000);
                } else {
                    showToast('❌ Upload failed: ' + (result.error || 'Unknown'), 4000);
                }
            } catch (e) {
                showToast('❌ Upload error — is the server running?', 4000);
            }
        } else {
            showToast('⚠️ No server — preview only. Run "node server.js" to upload.', 5000);
        }
    }
}
