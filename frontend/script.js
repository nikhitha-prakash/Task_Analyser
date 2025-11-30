async function sendTasksToBackend(actionType) {
    const inputTextArea = document.getElementById('taskInputArea');
    const resultsContainer = document.getElementById('resultsContainer');
    const analyzeBtn = document.getElementById('analyzeButton');
    const suggestBtn = document.getElementById('suggestButton');
    const suggestionBanner = document.getElementById('suggestionMessage');
    const outputTitle = document.getElementById('outputTitle');
    
    const userTextData = inputTextArea.value;

    if (!userTextData.trim()) {
        alert("Please enter JSON data first.");
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(userTextData);
    } catch (e) {
        alert("Invalid JSON format. Please check your syntax.");
        return;
    }

    const endpoint = actionType === 'suggest' ? '/api/tasks/suggest/' : '/api/tasks/analyze/';
    
    analyzeBtn.disabled = true;
    suggestBtn.disabled = true;

    try {
        const serverResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedData)
        });

        if (!serverResponse.ok) {
            throw new Error("Server connection failed.");
        }

        const responseJson = await serverResponse.json();
        resultsContainer.innerHTML = "";
        
        let tasksToRender = [];

        if (actionType === 'suggest') {
            tasksToRender = responseJson.tasks;
            suggestionBanner.innerText = responseJson.message;
            suggestionBanner.classList.remove('hidden');
            outputTitle.innerText = 'Top Suggestions';
        } else {
            tasksToRender = responseJson;
            suggestionBanner.classList.add('hidden');
            outputTitle.innerText = 'Analysis Results';
        }
        
        tasksToRender.forEach(taskItem => {
            createTaskCard(taskItem);
        });

    } catch (errorDetails) {
        console.error(errorDetails);
        resultsContainer.innerHTML = `
            <div class="empty-state" style="color: red;">
                <p>Error: ${errorDetails.message}</p>
                <small>Check your JSON syntax.</small>
            </div>`;
    } finally {
        analyzeBtn.disabled = false;
        suggestBtn.disabled = false;
    }
}

function createTaskCard(task) {
    const resultsContainer = document.getElementById('resultsContainer');
    const cardDiv = document.createElement('div');
    
    let priorityClass = 'priority-low';
    
    if (task.score >= 80) {
        priorityClass = 'priority-high';
    } else if (task.score >= 40) {
        priorityClass = 'priority-medium';
    }

    cardDiv.className = `task-card ${priorityClass}`;

    const depCount = task.dependencies ? task.dependencies.length : 0;
    const depDisplay = depCount > 0 ? `${depCount} Dependencies` : '';

    cardDiv.innerHTML = `
        <div class="score-badge">
            ${task.score}
        </div>
        
        <div class="card-content">
            <h3 class="card-title">${task.title}</h3>
            <div class="card-meta">
                <span>Due: ${task.due_date}</span>
                <span>Imp: ${task.importance}</span>
                <span>${task.estimated_hours}h</span>
                ${depDisplay ? `<span>${depDisplay}</span>` : ''}
            </div>
        </div>
    `;

    resultsContainer.appendChild(cardDiv);
}

function clearInput() {
    document.getElementById('taskInputArea').value = '';
    document.getElementById('resultsContainer').innerHTML = `
        <div class="empty-state">
            <p>Waiting for data...</p>
            <small>Paste your JSON tasks and select an action.</small>
        </div>
    `;
    document.getElementById('suggestionMessage').classList.add('hidden');
    document.getElementById('outputTitle').innerText = 'Priority Matrix';
}

document.addEventListener('DOMContentLoaded', () => {
    const sampleData = [
        {
            "title": "Fix critical server crash",
            "due_date": "2025-11-25",
            "importance": 10,
            "estimated_hours": 2,
            "dependencies": []
        },
        {
            "title": "Update client documentation",
            "due_date": "2025-12-10",
            "importance": 4,
            "estimated_hours": 3,
            "dependencies": [1, 4]
        },
        {
            "title": "Quick team sync",
            "due_date": "2025-12-01",
            "importance": 6,
            "estimated_hours": 1,
            "dependencies": []
        }
    ];
    document.getElementById('taskInputArea').value = JSON.stringify(sampleData, null, 4);
});