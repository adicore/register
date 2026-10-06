document.getElementById('redeployForm').addEventListener('submit async', async function(e) {
    e.preventDefault();
    
    const btn = document.getElementById('submitBtn');
    const password = document.getElementById('adminPassword').value;
    const oldName = document.getElementById('oldWorker').value.trim();
    const newName = document.getElementById('newWorker').value.trim();

    btn.disabled = true;
    btn.innerText = 'Sedang Memproses...';

    try {
        await recreateWorkerName(password, oldName, newName);
        document.getElementById('redeployForm').reset();
    } catch (err) {
        // Error sudah ditangkap di dalam fungsi utama
    } finally {
        btn.disabled = false;
        btn.innerText = 'Eksekusi Redeploy Total';
    }
});
