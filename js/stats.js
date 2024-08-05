let app = document.getElementById('app');
let container = document.querySelector('.container');

let rajoutMenu = document.createElement('DIV');
container.appendChild(rajoutMenu);

let aMenu = document.createElement("A");
aMenu.href = 'index.html';
aMenu.innerHTML = 'Home';
aMenu.classList.add('navbar-brand');
rajoutMenu.appendChild(aMenu);

let aTask = document.createElement("A");
aTask.href = 'tasks.html';
aTask.innerHTML = 'Task';
aTask.classList.add('navbar-brand');
rajoutMenu.appendChild(aTask);

const style = document.createElement('style');
const cssRules = `
 .rounded-border {
    border-radius: 50%;
    width: 30%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 5px;
    background-color: #cde9e0;
    color: #2c3e50;
}
 .progress-container {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 25px;
    overflow: hidden;
    position: relative;
    height: 30px;
    margin: 10px 0;
}
 .progress-bar {
    height: 100%;
    background-color: #4db8ff;
    text-align: center;
    line-height: 30px;
    color: white;
    white-space: nowrap;
    transition: width 0.4s ease-in-out;
}
 .stats-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    margin-bottom: 20px; /* Ajoutez une marge pour séparer de la barre de progression */
}
.stats-center{
    text-align: center;
    margin-top: 20px;
}
`;
style.innerHTML = cssRules;
document.head.appendChild(style);

async function fetchTaskStatistics() {
    try {
        let response = await fetch("https://api-todos.glitch.me/todos");
        if (!response.ok) {
            throw new Error('Erreur réseau: ' + response.status);
        }
        let data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].todolist) {
            let tasks = data[0].todolist;

            if (Array.isArray(tasks)) {
                let totalTasks = tasks.length;
                let openTasks = tasks.filter(task => !task.is_complete).length;
                let closedTasks = tasks.filter(task => task.is_complete).length;
                let completionPercentage = (closedTasks / totalTasks) * 100 || 0;

                let statsDiv = document.createElement('DIV');
                statsDiv.classList.add('d-flex', 'align-items-center', 'flex-column');

                // Ajouter la barre de progression
                let progressContainer = document.createElement('DIV');
                progressContainer.classList.add('progress-container');

                let progressBar = document.createElement('DIV');
                progressBar.classList.add('progress-bar');
                progressBar.style.width = `${completionPercentage}%`;
                progressBar.textContent = `${Math.round(completionPercentage)}%`;

                progressContainer.appendChild(progressBar);

                // Ajouter les cercles
                let statsContainer = document.createElement('DIV');
                statsContainer.classList.add('stats-container');

                let statsTotal = document.createElement('DIV');
                statsTotal.innerHTML = `<h4>Total des Tâches <br>${totalTasks}</h4>`;
                statsTotal.classList.add('col-4', 'stats-center');

                let statsTerminee = document.createElement('DIV');
                statsTerminee.innerHTML = `<h4>Tâches Terminées <br>${closedTasks}</h4>`;
                statsTerminee.classList.add('col-4', 'stats-center');

                let statsOuverte = document.createElement('DIV');
                statsOuverte.innerHTML = `<h4>Tâches à Faire <br>${openTasks}</h4>`;
                statsOuverte.classList.add('col-4', 'stats-center');

                statsContainer.appendChild(statsTotal);
                statsContainer.appendChild(statsTerminee);
                statsContainer.appendChild(statsOuverte);

                statsDiv.appendChild(progressContainer); // Ajouter la barre de progression
                statsDiv.appendChild(statsContainer); // Ajouter les cercles

                app.innerHTML = '';
                app.appendChild(statsDiv);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
    }
}

fetchTaskStatistics();
