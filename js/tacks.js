let prenom = localStorage.getItem('prenom');
let app = document.getElementById('app');
let container = document.querySelector('.container');
let mainNav = document.getElementById('mainNav');

let rajoutMenu = document.createElement('DIV');
container.appendChild(rajoutMenu);

let aMenu = document.createElement("A");
aMenu.href = 'index.html';
aMenu.innerHTML = 'Home';
aMenu.classList.add('navbar-brand');
rajoutMenu.appendChild(aMenu);

let aStat = document.createElement("A");
aStat.href = 'stat.html';
aStat.innerHTML = 'Stat';
aStat.classList.add('navbar-brand');
rajoutMenu.appendChild(aStat);

document.getElementById('prenom').innerHTML = "bonjour " + prenom;

let url = "https://api-todos.glitch.me/todos";

fetch(url)
.then(response => response.json())
.then(task => {
    let divForm = document.createElement('DIV');
    app.appendChild(divForm);

    let form = document.createElement('form');

    let taskNameLabel = document.createElement('label');
    taskNameLabel.setAttribute('for', 'taskName');
    taskNameLabel.textContent = 'Nom de la tâche:';
    let taskNameInput = document.createElement('input');
    taskNameInput.setAttribute('type', 'text');
    taskNameInput.setAttribute('id', 'taskName');
    taskNameInput.setAttribute('name', 'taskName');
    taskNameInput.classList.add('form-control');

    form.appendChild(taskNameLabel);
    form.appendChild(taskNameInput);
    form.appendChild(document.createElement('br'));

    let tagsLabel = document.createElement('label');
    tagsLabel.setAttribute('for', 'tags');
    tagsLabel.textContent = 'Tags (séparés par des virgules):';
    let tagsInput = document.createElement('input');
    tagsInput.setAttribute('type', 'text');
    tagsInput.setAttribute('id', 'tags');
    tagsInput.setAttribute('name', 'tags');
    tagsInput.classList.add('form-control');

    form.appendChild(tagsLabel);
    form.appendChild(tagsInput);
    form.appendChild(document.createElement('br'));

    let submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Ajouter la tâche';
    submitButton.classList.add('btn', 'btn-secondary');

    form.appendChild(submitButton);
    divForm.appendChild(form);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let taskName = taskNameInput.value.trim();
        let tags = tagsInput.value.split(',').map(tag => tag.trim());

        if (taskName === '') {
            alert('Le nom de la tâche ne peut pas être vide.');
            return;
        }

        if (tags.length === 1 && tags[0] === '') {
            alert('Les tags ne peuvent pas être vides.');
            return;
        }

        let data = {
            text: taskName,
            created_at: new Date().toISOString(),
            Tags: tags,
            is_complete: false
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert('Tâche créée !');
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

fetch(url)
.then(response => response.json())
.then(elements => {
    let tasks = elements[0].todolist;

    tasks.forEach(task => {
        let div = document.createElement('DIV');
        div.classList.add("card", "mt-2");

        let div2 = document.createElement('DIV');
        div.classList.add("card-body");
        div.appendChild(div2);

        let h5 = document.createElement('H5');
        h5.classList.add('card-title');
        h5.innerHTML = task.text;
        div2.appendChild(h5);

        let a = document.createElement('A');
        a.classList.add('btn', 'btn-primary');
        a.href = 'item.html?id-' + task.id;
        a.innerHTML = 'Voir les détails';
        div2.appendChild(a);

        let deleteButton = document.createElement('BUTTON');
        deleteButton.classList.add('btn', 'btn-danger', 'ms-2');
        deleteButton.textContent = 'Supprimer';
        div2.appendChild(deleteButton);

        app.appendChild(div);

        deleteButton.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                fetch(`${url}/${task.id}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                    }
                    alert('Tâche supprimée !');
                    location.reload();
                })
                .catch(error => {
                    console.error('Erreur:', error);
                });
            }
        });
    });
})
.catch(error => {
    console.error('Erreur lors de la récupération des tâches:', error);
});
