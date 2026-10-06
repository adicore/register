async function recreateWorkerName(adminPassword, workerName, newWorkerName) {
    const endpoint = 'https://dashboard-admin-pusat.accessed.workers.dev/api/recreate-worker-name';

    console.log(`Memproses migrasi worker dari '${workerName}' ke '${newWorkerName}'...`);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminPassword: adminPassword,
                worker_name: workerName,
                new_worker_name: newWorkerName
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Terjadi kesalahan pada server pusat.');
        }

        console.log('✅ Berhasil:', data.message);
        alert('Sukses: ' + data.message);
        return data;

    } catch (error) {
        console.error('❌ Gagal meredeply worker:', error.message);
        alert('Gagal: ' + error.message);
        throw error;
    }
}
