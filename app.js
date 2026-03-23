// Global variables
let tasks = JSON.parse(localStorage.getItem('smartTodoTasks')) || [];
let currentFilter = 'all';
let editingTaskId = null;
let extractedTasksData = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    updateStats();
    setupDragAndDrop();
    
    // Set initial filter
    document.getElementById('filterAll').classList.add('bg-blue-600', 'text-white');
});

// Task management functions
function addTask(taskText = null) {
    const input = document.getElementById('taskInput');
    const text = taskText || input.value.trim();
    
    if (!text) return;
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
    
    if (!taskText) {
        input.value = '';
    }
    
    // Show success animation
    showNotification('Task added successfully!', 'success');
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
        
        const message = task.completed ? 'Task completed!' : 'Task marked as active!';
        showNotification(message, 'success');
    }
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
        showNotification('Task deleted!', 'info');
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingTaskId = id;
        document.getElementById('editInput').value = task.text;
        document.getElementById('editModal').classList.remove('hidden');
        document.getElementById('editInput').focus();
    }
}

function saveEdit() {
    const newText = document.getElementById('editInput').value.trim();
    if (newText && editingTaskId) {
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.text = newText;
            saveTasks();
            renderTasks();
            closeEditModal();
            showNotification('Task updated!', 'success');
        }
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.add('hidden');
    editingTaskId = null;
}

// Filter functions
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    document.querySelectorAll('[id^="filter"]').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    document.getElementById('filter' + filter.charAt(0).toUpperCase() + filter.slice(1))
        .classList.add('bg-blue-600', 'text-white');
    
    renderTasks();
}

function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Render functions
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item flex items-center gap-3 p-4 border border-gray-200 rounded-lg ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <button 
                onclick="toggleTask(${task.id})" 
                class="flex-shrink-0 w-6 h-6 rounded-full border-2 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'} flex items-center justify-center transition-colors"
            >
                ${task.completed ? '<i class="fas fa-check text-white text-xs"></i>' : ''}
            </button>
            
            <span class="flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} break-words">
                ${escapeHtml(task.text)}
            </span>
            
            <div class="flex gap-2">
                <button 
                    onclick="editTask(${task.id})" 
                    class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit task"
                >
                    <i class="fas fa-edit"></i>
                </button>
                <button 
                    onclick="deleteTask(${task.id})" 
                    class="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete task"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('activeTasks').textContent = active;
    document.getElementById('completedTasks').textContent = completed;
}

// File upload and OCR functions
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file!', 'error');
        return;
    }
    
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const previewArea = document.getElementById('previewArea');
    
    // Show progress
    progressContainer.classList.remove('hidden');
    previewArea.classList.add('hidden');
    progressBar.style.width = '0%';
    progressText.textContent = 'Processing image...';
    
    try {
        // Simulate progress updates
        progressBar.style.width = '20%';
        progressText.textContent = 'Loading OCR engine...';
        
        // Process with Tesseract.js
        const result = await Tesseract.recognize(file, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const progress = Math.round(20 + (m.progress * 70));
                    progressBar.style.width = progress + '%';
                    progressText.textContent = `Extracting text... ${Math.round(m.progress * 100)}%`;
                }
            }
        });
        
        progressBar.style.width = '90%';
        progressText.textContent = 'Parsing tasks...';
        
        // Parse the extracted text into tasks
        const extractedText = result.data.text;
        const parsedTasks = parseTextToTasks(extractedText);
        
        progressBar.style.width = '100%';
        progressText.textContent = 'Complete!';
        
        // Show results
        displayExtractedTasks(parsedTasks);
        
        setTimeout(() => {
            progressContainer.classList.add('hidden');
        }, 1000);
        
    } catch (error) {
        console.error('OCR Error:', error);
        showNotification('Failed to process image. Please try again.', 'error');
        progressContainer.classList.add('hidden');
    }
}

function parseTextToTasks(text) {
    if (!text || text.trim().length === 0) {
        return [];
    }
    
    // Clean up the text
    const cleanText = text.replace(/[^\w\s\n\-•\[\]()]/g, '').trim();
    
    // Split into lines and filter out empty ones
    const lines = cleanText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    const tasks = [];
    
    for (const line of lines) {
        // Skip very short lines (likely noise)
        if (line.length < 3) continue;
        
        // Skip lines that look like headers or dates
        if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(line)) continue;
        if (/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(line)) continue;
        if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(line)) continue;
        
        // Clean up common bullet points and checkboxes
        let taskText = line
            .replace(/^[\-•\*\+]\s*/, '') // Remove bullet points
            .replace(/^\[\s*[x✓]\s*\]\s*/i, '') // Remove checked boxes
            .replace(/^\[\s*\]\s*/, '') // Remove empty boxes
            .replace(/^[o○]\s*/, '') // Remove circle bullets
            .replace(/^\d+[\.\)]\s*/, '') // Remove numbered lists
            .trim();
        
        // Skip if still too short after cleaning
        if (taskText.length < 3) continue;
        
        // Skip common non-task words
        const skipWords = ['notes', 'todo', 'tasks', 'list', 'items', 'things'];
        if (skipWords.some(word => taskText.toLowerCase() === word)) continue;
        
        tasks.push(taskText);
    }
    
    return tasks;
}

function displayExtractedTasks(tasks) {
    extractedTasksData = tasks;
    const extractedTasksDiv = document.getElementById('extractedTasks');
    const previewArea = document.getElementById('previewArea');
    
    if (tasks.length === 0) {
        extractedTasksDiv.innerHTML = '<p class="text-gray-500 italic">No tasks found in the image. Try with a clearer screenshot or adjust the text.</p>';
    } else {
        extractedTasksDiv.innerHTML = tasks.map((task, index) => `
            <div class="flex items-center gap-2 p-2 bg-white rounded border mb-2">
                <input type="checkbox" id="task-${index}" checked class="text-blue-600">
                <label for="task-${index}" class="flex-1 cursor-pointer">${escapeHtml(task)}</label>
            </div>
        `).join('');
    }
    
    previewArea.classList.remove('hidden');
}

function importExtractedTasks() {
    const checkboxes = document.querySelectorAll('#extractedTasks input[type="checkbox"]:checked');
    const selectedTasks = Array.from(checkboxes).map((checkbox, index) => {
        const taskIndex = parseInt(checkbox.id.split('-')[1]);
        return extractedTasksData[taskIndex];
    });
    
    if (selectedTasks.length === 0) {
        showNotification('Please select at least one task to import!', 'warning');
        return;
    }
    
    // Add selected tasks
    selectedTasks.forEach(taskText => {
        addTask(taskText);
    });
    
    // Clear the preview
    document.getElementById('previewArea').classList.add('hidden');
    document.getElementById('fileInput').value = '';
    
    showNotification(`Successfully imported ${selectedTasks.length} task(s)!`, 'success');
}

// Utility functions
function saveTasks() {
    localStorage.setItem('smartTodoTasks', JSON.stringify(tasks));
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    // Set colors based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeEditModal();
    }
    
    // Enter to save edit
    if (e.key === 'Enter' && editingTaskId) {
        saveEdit();
    }
});

// Edit input enter key
document.getElementById('editInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        saveEdit();
    }
});