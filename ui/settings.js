const themes = {
    dark:   { bg: '#09090b', card: '#09090b', border: '#18181b', text: '#f4f4f5', muted: '#71717a', accent: '#f4f4f5', accentFg: '#09090b', inputBg: '#000000' },
    light:  { bg: '#f4f4f5', card: '#ffffff', border: '#e4e4e7', text: '#18181b', muted: '#71717a', accent: '#18181b', accentFg: '#f4f4f5', inputBg: '#f9f9f9' },
    red:    { bg: '#09090b', card: '#100808', border: '#2a1010', text: '#f4f4f5', muted: '#71717a', accent: '#f87171', accentFg: '#09090b', inputBg: '#000000' },
    green:  { bg: '#09090b', card: '#08100a', border: '#0f2a12', text: '#f4f4f5', muted: '#71717a', accent: '#4ade80', accentFg: '#09090b', inputBg: '#000000' },
    blue:   { bg: '#09090b', card: '#080a10', border: '#101528', text: '#f4f4f5', muted: '#71717a', accent: '#60a5fa', accentFg: '#09090b', inputBg: '#000000' },
    purple: { bg: '#09090b', card: '#0a0810', border: '#1a1028', text: '#f4f4f5', muted: '#71717a', accent: '#c084fc', accentFg: '#09090b', inputBg: '#000000' },
};

function toggleSettings() {
    const panel = document.getElementById('settings-panel');
    panel.classList.toggle('translate-x-full');
}

function applyTheme(name) {
    const t = themes[name] || themes.dark;
    const r = document.documentElement;
    r.style.setProperty('--bg', t.bg);
    r.style.setProperty('--card', t.card);
    r.style.setProperty('--border', t.border);
    r.style.setProperty('--text', t.text);
    r.style.setProperty('--text-muted', t.muted);
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-fg', t.accentFg);
    r.style.setProperty('--input-bg', t.inputBg);

    document.querySelectorAll('.theme-btn').forEach(btn => {
        const active = btn.dataset.theme === name;
        btn.classList.toggle('border-zinc-100', active);
        btn.classList.toggle('text-zinc-100', active);
        btn.classList.toggle('border-zinc-900', !active);
        btn.classList.toggle('text-zinc-500', !active);
    });
}

function setTheme(name) {
    applyTheme(name)
    localStorage.setItem('tap-theme', name);
}

async function saveSettings() {
    const cps = parseInt(document.getElementById('default-cps').value);
    const button = document.querySelector('input[name="default-button"]:checked')?.value || 'left';
    const theme = localStorage.getItem('tap-theme') || dark;

    await window.pywebview.api.save_settings({ cps, button, theme });

    document.getElementById('cps').value = cps;
    document.querySelector(`input[name="button"][value="${button}"]`).checked = true;

    toggleSettings();
}

window.addEventListener("pywebviewready", async () => {
    const s = await window.pywebview.api.load_settings();

    if (s) {
        document.getElementById('cps').value = s.cps || 10;
        document.getElementById('default-cps').value = s.cps || 10;

        if (s.button) {
            document.querySelector(`input[name="button"][value="${s.button}"]`).checked = true;
            document.querySelector(`input[name="default-button"][value="${s.button}"]`).checked = true;
        }

        applyTheme(s.theme || 'dark');
    }
})