// WebSocket connection
const socket = io();

// DOM Elements
const jsonEditor = document.getElementById('jsonEditor');
const renderBtn = document.getElementById('renderBtn');
const validateBtn = document.getElementById('validateBtn');
const exampleSelect = document.getElementById('exampleSelect');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const cancelBtn = document.getElementById('cancelBtn');

const initialState = document.getElementById('initialState');
const processingState = document.getElementById('processingState');
const completedState = document.getElementById('completedState');

const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressDetails = document.getElementById('progressDetails');
const videoPreview = document.getElementById('videoPreview');

// State
let currentJobId = null;

// Example JSON
const exampleJSON = {
    image: {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        effect: 'kenburns',
        zoom: 1.3
    },
    audio: {
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        volume: 0.8
    },
    config: {
        width: 1920,
        height: 1080,
        fps: 30
    }
};

// Initialize
jsonEditor.value = JSON.stringify(exampleJSON, null, 2);

// Load Examples List
async function loadExamplesList() {
    try {
        const response = await fetch('/api/examples');
        const data = await response.json();

        if (data.success && data.examples) {
            exampleSelect.innerHTML = '<option value="" disabled selected style="background: #333;">Load Example...</option>';
            data.examples.forEach(ex => {
                const option = document.createElement('option');
                option.value = JSON.stringify(ex.content, null, 2);
                option.textContent = ex.name;
                option.style.background = '#333';
                exampleSelect.appendChild(option);
            });
        }
    } catch (e) {
        console.error('Failed to load examples', e);
    }
}
loadExamplesList();

// Handle selection
exampleSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        jsonEditor.value = e.target.value;
        showNotification('Example loaded', 'Ready to render!', 'success');
        e.target.selectedIndex = 0; // Reset to placeholder
    }
});

// Validate JSON (Server-side)
validateBtn.addEventListener('click', async () => {
    try {
        let json;
        try {
            json = JSON.parse(jsonEditor.value);
        } catch (e) {
            throw new Error('Invalid JSON syntax');
        }

        const response = await fetch('/api/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json)
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Valid Configuration', data.message, 'success');
        } else {
            console.error(data.details);
            const msg = data.details ? data.details.map(d => d.message).join('. ') : data.error;
            throw new Error(msg);
        }
    } catch (error) {
        showNotification('Invalid Configuration', error.message, 'error');
    }
});

// Render video
renderBtn.addEventListener('click', async () => {
    try {
        const spec = JSON.parse(jsonEditor.value);

        renderBtn.disabled = true;
        showState('processing');

        const response = await fetch('/api/render', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(spec),
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Render failed');
        }

        currentJobId = data.jobId;
        lastProgress = 0; // Reset progress tracker
        showNotification('Render started', `Job ID: ${currentJobId}`, 'success');

        // Subscribe to progress updates
        socket.emit('subscribe', currentJobId);

        // Poll status
        pollStatus(currentJobId);

    } catch (error) {
        showNotification('Render failed', error.message, 'error');
        renderBtn.disabled = false;
        showState('initial');
    }
});

// Poll job status
async function pollStatus(jobId) {
    try {
        const response = await fetch(`/api/status/${jobId}`);
        const data = await response.json();

        if (!data.success) {
            throw new Error('Failed to get status');
        }

        const job = data.job;

        // Extraer métricas del job si existen
        const metrics = {
            fps: job.fps || 0,
            speed: job.speed || 0,
            timemark: job.timemark || '00:00:00',
            status: job.status
        };

        updateProgress(job.progress || 0, metrics);

        if (job.status === 'completed') {
            showState('completed');
            videoPreview.src = `/api/download/${jobId}`;
            renderBtn.disabled = false;
            showNotification('Render complete', 'Video ready!', 'success');
            lastProgress = 0;
            return;
        }

        if (job.status === 'failed') {
            throw new Error(job.error || 'Render failed');
        }

        // Continue polling every second
        setTimeout(() => pollStatus(jobId), 1000);

    } catch (error) {
        showNotification('Status error', error.message, 'error');
        renderBtn.disabled = false;
        showState('initial');
    }
}

// WebSocket progress updates
socket.on('progress', (data) => {
    if (data.jobId === currentJobId) {
        updateProgress(data.percent, {
            fps: data.fps,
            speed: data.speed,
            timemark: data.timemark,
        });
    }
});

// Update progress UI
let lastProgress = 0;
function updateProgress(percent, details) {
    // Asegurar que el progreso solo avance hacia adelante
    const currentPercent = Math.max(0, Math.min(100, percent));
    if (currentPercent >= lastProgress) {
        lastProgress = currentPercent;
        progressFill.style.width = `${currentPercent}%`;
        progressText.textContent = `${Math.round(currentPercent)}%`;
    }

    // Actualizar métricas solo modificando el texto (sin parpadeo)
    if (details) {
        const fpsValue = document.getElementById('fpsValue');
        const speedValue = document.getElementById('speedValue');
        const timeValue = document.getElementById('timeValue');
        
        if (fpsValue && details.fps !== undefined) {
            fpsValue.textContent = Math.round(details.fps);
        }
        if (speedValue && details.speed !== undefined) {
            speedValue.textContent = details.speed.toFixed(2);
        }
        if (timeValue && details.timemark) {
            timeValue.textContent = details.timemark;
        }
    }
}

// Download video
downloadBtn.addEventListener('click', () => {
    if (currentJobId) {
        window.location.href = `/api/download/${currentJobId}`;
    }
});

// Cancel rendering
cancelBtn.addEventListener('click', async () => {
    if (!currentJobId) return;

    try {
        const response = await fetch(`/api/cancel/${currentJobId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Cancelado', 'Renderizado detenido', 'success');
            currentJobId = null;
            showState('initial');
            renderBtn.disabled = false;
            progressFill.style.width = '0%';
            progressText.textContent = '0%';
            progressDetails.innerHTML = '';
        } else {
            throw new Error(data.error || 'No se pudo cancelar');
        }
    } catch (error) {
        showNotification('Error', error.message, 'error');
    }
});

// Reset to new video
resetBtn.addEventListener('click', () => {
    currentJobId = null;
    showState('initial');
    renderBtn.disabled = false;
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    progressDetails.innerHTML = '';
});

// Show state
function showState(state) {
    initialState.style.display = state === 'initial' ? 'block' : 'none';
    processingState.style.display = state === 'processing' ? 'block' : 'none';
    completedState.style.display = state === 'completed' ? 'block' : 'none';
}

// Show notification
function showNotification(title, message, type = 'success') {
    const container = document.getElementById('notificationContainer');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
    <svg class="notification-icon" viewBox="0 0 24 24" fill="none">
      ${type === 'success'
            ? '<path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2"/>'
            : '<path d="M12 8v4M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>'}
    </svg>
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
  `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Handle WebSocket connection
socket.on('connect', () => {
    console.log('WebSocket connected');
});

socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
});

// --- Documentation Logic ---
const editorView = document.getElementById('editor-view');
const docsView = document.getElementById('docs-view');
const docsContent = document.getElementById('docsContent');
const navLinks = document.querySelectorAll('.nav-link');

function updateNav(hash) {
    navLinks.forEach(link => {
        if (link.getAttribute('href') === hash || (hash === '' && link.getAttribute('href') === '#')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

async function loadDocs() {
    try {
        const response = await fetch('/api/docs');
        const data = await response.json();

        if (data.success) {
            // Configure marked to use github flavored markdown defaults
            // Just use default
            docsContent.innerHTML = marked.parse(data.content);
        } else {
            docsContent.innerHTML = `<div class="error">Failed to load documentation: ${data.error}</div>`;
        }
    } catch (e) {
        docsContent.innerHTML = `<div class="error">Error loading documentation: ${e.message}</div>`;
    }
}

function handleHashChange() {
    const hash = window.location.hash;

    if (hash === '#docs') {
        editorView.style.display = 'none';
        docsView.style.display = 'block';
        updateNav('#docs');

        if (!docsContent.dataset.loaded) {
            loadDocs();
            docsContent.dataset.loaded = 'true';
        }
    } else {
        editorView.style.display = 'block';
        docsView.style.display = 'none';
        updateNav('#');
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleHashChange);

// Initial check
handleHashChange();
