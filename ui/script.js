const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const bindBtn = document.getElementById('bind')
const statusEl = document.getElementById('status');
const cpsInput = document.getElementById('cps');

let listeningForKey = false;

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