const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const statusEl = document.getElementById('status');
const cpsInput = document.getElementById('cps');

function setRunningState(isRunning) {
    if (isRunning) {
        statusEl.textContent = 'running';
        statusEl.classList.remove('text-zinc-500');
        statusEl.classList.add('text-green-400');

        startBtn.disabled = true;
        startBtn.classList.add('opacity-40', 'cursor-not-allowed');

        stopBtn.disabled = false;
        stopBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    } else {
        statusEl.textContent = 'idle';
        statusEl.classList.remove('text-green-400');
        statusEl.classList.add('text-zinc-500');

        startBtn.disabled = false;
        startBtn.classList.remove('opacity-40', 'cursor-not-allowed');

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

setRunningState(false);