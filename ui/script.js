const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const bindBtn = document.getElementById('bind')
const statusEl = document.getElementById('status');
const cpsInput = document.getElementById('cps');

let listeningForKey = false;
const repo = "sanderhd/tap"
let pollInterval = null;

function setRunningState(isRunning) {
    if (isRunning) {
        statusEl.textContent = 'running';
        statusEl.classList.remove('text-zinc-500');
        statusEl.classList.add('text-green-400');

        startBtn.disabled = true;
        startBtn.classList.add('opacity-30', 'cursor-not-allowed');

        stopBtn.disabled = false;
        stopBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    } else {
        statusEl.textContent = 'idle';
        statusEl.classList.remove('text-green-400');
        statusEl.classList.add('text-zinc-500');

        startBtn.disabled = false;
        startBtn.classList.remove('opacity-30', 'cursor-not-allowed');

        stopBtn.disabled = true;
        stopBtn.classList.add('opacity-40', 'cursor-not-allowed');
    }
}

function compareVersions(a, b) {
    const pa = a.replace(/^v/, "").split(".").map(Number);
    const pb = b.replace(/^v/, "").split(".").map(Number);

    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na > nb) return 1;
        if (na < nb) return -1;
    }

    return 0;
}

async function checkForUpdate(currentVersion) {
    try {
        const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        if (!res.ok) return;
        const data = await res.json();
        const latest = data.tag_name;

        if (compareVersions(latest, currentVersion) > 0) {
            showUpdateNotice(latest, data.html_url);
        }
    } catch (e) {
        console.warn("Update check failed:", e);
    }
}

async function pollStatus() {
    try {
        const isRunning = await window.pywebview.api.get_status();
        setRunningState(isRunning);
    } catch (e) {
        console.warn("Status poll failed:", e)
    }
}

window.addEventListener("pywebviewready", () => {
    pollInterval = setInterval(pollStatus, 200);
})

function showUpdateNotice(latestVersion, url) {
    const versionEl = document.getElementById("version");
    versionEl.innerHTML = `
        <a href="#" id="update-link" title="Update beschikbaar: ${latestVersion}"
           class="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors">
            ${versionEl.textContent}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
            </svg>
        </a>
    `;
    document.getElementById("update-link").addEventListener("click", (e) => {
        e.preventDefault();
        window.pywebview.api.open_url(url);
    });
}

window.addEventListener("pywebviewready", async () => {
    const version = await window.pywebview.api.get_version();
    document.getElementById("version").textContent = version;
    checkForUpdate(version);
});

startBtn.addEventListener("click", async () => {
    const cps = cpsInput.value;
    const button = document.querySelector(
        'input[name="button"]:checked'
    ).value;
    await window.pywebview.api.start_clicker(cps, button);
    setRunningState(true);
});

stopBtn.addEventListener("click", async () => {
    await window.pywebview.api.stop_clicker();
    setRunningState(false);
});

bindBtn.addEventListener("click", async () => {
    listeningForKey = true;
    bindBtn.textContent = "Press any key..."
    bindBtn.className = "w-full text-sm py-2 rounded-md border transition-colors border-green-500 text-green-400";
})

window.addEventListener("keydown", async (e) => {
    if (!listeningForKey) return;

    e.preventDefault();

    const key = e.key.toLowerCase();

    listeningForKey = false;
    bindBtn.textContent = `Bound: ${key.toUpperCase()}`;

    await window.pywebview.api.set_hotkey(key);
})

setRunningState(false);