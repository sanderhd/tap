document.getElementById('start').addEventListener("click", async () => {
    const cps = document.getElementById("cps").value;

    const button = document.querySelector(
        'input[name="button"]:checked'
    ).value;

    await window.pywebview.api.start_clicker(cps, button);
});

document.getElementById('stop').addEventListener("click", async () => {
    await window.pywebview.stop_clicker();
})