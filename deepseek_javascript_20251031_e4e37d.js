document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const randomUAToggle = document.getElementById('random-ua-toggle');
    const saveBtn = document.getElementById('save-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveSettingsBtn = document.getElementById('save-settings');
    const userAgentTextarea = document.getElementById('user-agent');
    const targetUrlInput = document.getElementById('target-url');
    const maxTargetInput = document.getElementById('max-target');
    const statusMessage = document.getElementById('status-message');
    const uaList = document.getElementById('ua-list');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    const completedCount = document.getElementById('completed-count');
    const pendingCount = document.getElementById('pending-count');
    const successRate = document.getElementById('success-rate');
    const earnings = document.getElementById('earnings');
    
    // User Agent List
    const userAgents = [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
        "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/85.0.4183.109 Mobile/15E148 Safari/604.1",
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
    ];
    
    // Process variables
    let processInterval;
    let completed = 0;
    let pending = 0;
    let totalTarget = 0;
    let isRunning = false;
    
    // Populate UA list
    function populateUAList() {
        uaList.innerHTML = '';
        userAgents.forEach((ua, index) => {
            const uaItem = document.createElement('div');
            uaItem.className = 'ua-item';
            uaItem.textContent = ua;
            uaItem.addEventListener('click', function() {
                userAgentTextarea.value = ua;
                statusMessage.textContent = `User Agent #${index + 1} dipilih`;
            });
            uaList.appendChild(uaItem);
        });
    }
    
    // Initialize
    populateUAList();
    
    // Random UA Toggle
    randomUAToggle.addEventListener('change', function() {
        if (this.checked) {
            statusMessage.textContent = 'Mode Random UA aktif - User Agent akan diacak secara otomatis';
        } else {
            statusMessage.textContent = 'Mode Manual - Pilih User Agent secara manual';
        }
    });
    
    // Save/Start Button
    saveBtn.addEventListener('click', function() {
        const targetUrl = targetUrlInput.value.trim();
        
        if (!targetUrl) {
            alert('Masukkan URL tujuan terlebih dahulu!');
            targetUrlInput.focus();
            return;
        }
        
        let selectedUA = userAgentTextarea.value;
        
        // If random UA is enabled, select a random UA
        if (randomUAToggle.checked) {
            const randomIndex = Math.floor(Math.random() * userAgents.length);
            selectedUA = userAgents[randomIndex];
            userAgentTextarea.value = selectedUA;
            statusMessage.textContent = `User Agent diacak: ${selectedUA.substring(0, 50)}...`;
        }
        
        // Get max target
        totalTarget = parseInt(maxTargetInput.value) || 100;
        pending = totalTarget;
        completed = 0;
        
        updateStats();
        
        // Start process simulation
        if (isRunning) {
            clearInterval(processInterval);
            statusMessage.textContent = 'Proses dihentikan';
            saveBtn.innerHTML = '<i class="fas fa-play"></i> START';
            isRunning = false;
        } else {
            statusMessage.textContent = `Proses dimulai dengan User Agent: ${selectedUA.substring(0, 50)}...`;
            saveBtn.innerHTML = '<i class="fas fa-stop"></i> STOP';
            isRunning = true;
            
            // Simulate process
            processInterval = setInterval(() => {
                if (completed < totalTarget) {
                    completed++;
                    pending = totalTarget - completed;
                    
                    // Random success/failure
                    const isSuccess = Math.random() > 0.2; // 80% success rate
                    
                    updateStats();
                    
                    // Update progress bar
                    const progress = (completed / totalTarget) * 100;
                    progressBar.style.width = `${progress}%`;
                    progressPercent.textContent = `${Math.round(progress)}%`;
                    
                    if (completed === totalTarget) {
                        statusMessage.textContent = 'Proses selesai! Semua target telah diproses.';
                        clearInterval(processInterval);
                        saveBtn.innerHTML = '<i class="fas fa-play"></i> START';
                        isRunning = false;
                    }
                }
            }, 100);
        }
    });
    
    // Reset Button
    resetBtn.addEventListener('click', function() {
        targetUrlInput.value = '';
        userAgentTextarea.value = userAgents[0];
        randomUAToggle.checked = false;
        maxTargetInput.value = '';
        statusMessage.textContent = 'Menunggu untuk memulai...';
        
        // Reset progress
        clearInterval(processInterval);
        completed = 0;
        pending = 0;
        totalTarget = 0;
        isRunning = false;
        saveBtn.innerHTML = '<i class="fas fa-play"></i> START';
        
        updateStats();
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';
    });
    
    // Save Settings Button
    saveSettingsBtn.addEventListener('click', function() {
        const maxTarget = maxTargetInput.value.trim();
        
        if (maxTarget) {
            statusMessage.textContent = `Pengaturan disimpan! Max Target: ${maxTarget}`;
        } else {
            statusMessage.textContent = 'Pengaturan disimpan!';
        }
        
        // Show success feedback
        saveSettingsBtn.innerHTML = '<i class="fas fa-check"></i> DISIMPAN';
        saveSettingsBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            saveSettingsBtn.innerHTML = '<i class="fas fa-check-circle"></i> SIMPAN';
            saveSettingsBtn.style.backgroundColor = '';
        }, 2000);
    });
    
    // Update statistics
    function updateStats() {
        completedCount.textContent = completed;
        pendingCount.textContent = pending;
        
        const rate = totalTarget > 0 ? (completed / totalTarget) * 100 : 0;
        successRate.textContent = `${Math.round(rate)}%`;
        
        // Calculate estimated earnings (random for demo)
        const estimated = (completed * 0.05).toFixed(2);
        earnings.textContent = `$${estimated}`;
    }
    
    // Add link preview functionality
    targetUrlInput.addEventListener('blur', function() {
        const url = this.value.trim();
        if (url) {
            // In a real app, you might fetch the page title here
            statusMessage.textContent = `URL tujuan disetel: ${url}`;
        }
    });
});