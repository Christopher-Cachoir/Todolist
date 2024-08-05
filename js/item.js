let app = document.getElementById('app');
const colors = ['btn-primary', 'btn-info', 'btn-secondary', 'btn-success', 'btn-danger'];

let container = document.querySelector('.container')
let mainNav = document.getElementById('mainNav');

let rajoutMenu = document.createElement('DIV');
container.appendChild(rajoutMenu);
let aMenu = document.createElement("A");
aMenu.href = 'index.html';
aMenu.innerHTML = 'Home';
aMenu.classList.add('navbar-brand')
rajoutMenu.appendChild(aMenu);

let aStat = document.createElement("A");
aStat.href = 'stat.html';
aStat.innerHTML = 'Stat';
aStat.classList.add('navbar-brand')
rajoutMenu.appendChild(aStat);

let aTask = document.createElement("A");
aTask.href = 'tasks.html';
aTask.innerHTML = 'Task';
aTask.classList.add('navbar-brand')
rajoutMenu.appendChild(aTask);

function getQueryParams() {
    let params = {};
    let queryString = window.location.search.substring(1);
    let regex = /id-(\d+)/;
    let match = queryString.match(regex);
    if (match) {
        params.id = match[1];
    }
    return params;
}

let params = getQueryParams();
let taskId = params.id;

const style = document.createElement('style');
const cssRules = `
    .tag-button {
        margin: 5px;
        cursor: pointer; 
    }
    .margin-top {
        margin-top: 10px;
        margin-left: 5px;
    }
    .margin-form {
        margin: 10px;
    }
`;
style.innerHTML = cssRules;
document.head.appendChild(style);

let url = `https://api-todos.glitch.me/todos/${taskId}`;

fetch(url)
.then(response => response.json())
.then(task => {
    let titleElement = document.querySelector('h1.masthead-heading.text-uppercase.mb-0');
    titleElement.innerHTML = task.text;

    let divinfo = document.createElement('DIV');
    divinfo.classList.add('text-center', 'align-items-center', 'flex-column');
    app.appendChild(divinfo);

    let div = document.createElement('DIV');
    div.innerHTML = `ID#${task.id}`;
    divinfo.appendChild(div);

    let div1 = document.createElement('DIV');
    let date = new Date(task.created_at);
    let optionsdate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    let formaterdate = new Intl.DateTimeFormat('fr-FR', optionsdate).format(date);
    div1.innerHTML = formaterdate;
    divinfo.appendChild(div1);

    // Créer un div pour les tags
    let tagsContainer = document.createElement('DIV');
    divinfo.appendChild(tagsContainer);

    // Nettoyer les tags existants avant d'ajouter les nouveaux
    tagsContainer.innerHTML = '';

    // Créez les boutons de tags existants
    task.Tags.forEach((tag, index) => {
        createTagButton(tag, colors[index % colors.length]);
    });

    let div3 = document.createElement('DIV');
    divinfo.appendChild(div3);
    if (task.is_complete) {
        div3.innerHTML = 'Fermée';
        div3.classList.add('bg-danger');
    } else {
        div3.innerHTML = 'Ouverte';
        div3.classList.add('bg-success');
    }

    function updateTaskStatus() {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: task.text,
                created_at: task.created_at,
                Tags: task.Tags,
                is_complete: task.is_complete
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Statut de la tâche mis à jour avec succès');
            location.reload();
        })
        .catch(error => {
            alert('Erreur lors de la mise à jour de la tâche');
        });
        
    }

    function updateTaskTags() {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: task.text,
                created_at: task.created_at,
                Tags: task.Tags,
                is_complete: task.is_complete
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP! Statut: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Tags mis à jour avec succès');
        })
        .catch(error => {
            alert('Erreur lors de la mise à jour des tags');
        });
    }

    function createTagButton(tag, colorClass) {
        let button = document.createElement('BUTTON');
        button.innerHTML = tag;
        button.classList.add('btn', 'tag-button', colorClass);
        tagsContainer.appendChild(button);

        // Ajouter un gestionnaire d'événements pour supprimer le tag au clic
        button.addEventListener('click', () => {
            if (task.is_complete) {
                alert('La tâche est fermée et les tags ne peuvent pas être modifiés.');
                return;
            }
            if (confirm(`Êtes-vous sûr de vouloir supprimer le tag "${tag}" ?`)) {
                task.Tags = task.Tags.filter(t => t !== tag);
                button.remove();
                updateTaskTags();
            }
        });
    }

    let updateStatut = document.createElement('BUTTON');
    function updateStatutButton() {
        if (task.is_complete) {
            updateStatut.innerHTML = 'Rouvrir la tâche';
            updateStatut.classList.remove('bg-danger');
            updateStatut.classList.add('bg-success');
        } else {
            updateStatut.innerHTML = 'Fermer la tâche';
            updateStatut.classList.remove('bg-success');
            updateStatut.classList.add('bg-danger');
        }
    }
    app.appendChild(updateStatut);
    updateStatut.classList.add('btn', 'margin-top');
    updateStatutButton();

    updateStatut.addEventListener('click', () => {
        task.is_complete = !task.is_complete;
        updateStatutButton();
        updateTaskStatus();
    });

    let updateButton = document.createElement('BUTTON');
    updateButton.innerHTML = 'Mettre à jour la tâche';
    updateButton.classList.add('btn', 'btn-warning', 'margin-top');
    app.appendChild(updateButton);

    let deleteButton = document.createElement('BUTTON');
    deleteButton.classList.add('btn', 'btn-danger', 'ms-2', 'margin-top');
    deleteButton.textContent = 'Supprimer';
    app.appendChild(deleteButton);
   

    let tagForm = document.createElement('form');
    tagForm.id = 'tag-form';
    tagForm.style.display = 'none';
    tagForm.classList.add('margin-form');

    let tagInput = document.createElement('input');
    tagInput.type = 'text';
    tagInput.placeholder = 'Ajouter un nouveau tag';
    tagInput.required = true;
    tagForm.appendChild(tagInput);
    tagInput.classList.add('form-control')

    let addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.innerHTML = 'Ajouter Tag';
    tagForm.appendChild(addButton);
    addButton.classList.add('margin-form','btn','btn-secondary');

    app.appendChild(tagForm);

    updateButton.addEventListener('click', () => {
        if (task.is_complete) {
            alert('La tâche est fermée et ne peut pas être mise à jour.');
            return;
        }
        tagForm.style.display = tagForm.style.display === 'none' ? 'block' : 'none';
    });

    tagForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (task.is_complete) {
            alert('La tâche est fermée et les tags ne peuvent pas être modifiés.');
            return;
        }

        let newTag = tagInput.value.trim();
        if (newTag && !task.Tags.includes(newTag)) {
            task.Tags.push(newTag);
            createTagButton(newTag, colors[task.Tags.length % colors.length]);
            tagInput.value = '';
            updateTaskTags();
        } else {
            alert('Tag vide ou déjà existant');
        }
    });
    deleteButton.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            fetch(url, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                }
                alert('Tâche supprimée !');
                window.location.href = 'tasks.html';  // Redirection vers tasks.html après la suppression
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
        }
    });
    
});
