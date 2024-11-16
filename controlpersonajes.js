const defaultCharacters = [
    { id: 'pj1', name: 'Personaje 1', vidaActual: 10, vidaMaxima: 20, mana: 10, cordura: 10, energia: 10, suerte: 10, corduraMensaje: '', estados: [] },
    { id: 'pj2', name: 'Personaje 2', vidaActual: 15, vidaMaxima: 30, mana: 15, cordura: 15, energia: 15, suerte: 15, corduraMensaje: '', estados: [] },
    { id: 'pj3', name: 'Personaje 3', vidaActual: 20, vidaMaxima: 40, mana: 20, cordura: 20, energia: 20, suerte: 20, corduraMensaje: '', estados: [] },
    { id: 'pj4', name: 'Personaje 4', vidaActual: 25, vidaMaxima: 50, mana: 25, cordura: 25, energia: 25, suerte: 25, corduraMensaje: '', estados: [] }
];


const disadvantages = [
    "Paranoia extrema: desconfías de todos.",
    "Miedo irracional a la oscuridad.",
    "Ataques de ira incontrolable.",
    "Alucinaciones constantes."
];

function loadCharacters() {
    const savedData = localStorage.getItem('characters');
    return savedData ? JSON.parse(savedData) : defaultCharacters;
}

function saveCharacters(characters) {
    localStorage.setItem('characters', JSON.stringify(characters));
}

function renderTable() {
    const characters = loadCharacters();
    const tableBody = document.getElementById('character-table');
    tableBody.innerHTML = '';

    characters.forEach((character, index) => {
        const row = document.createElement('tr');

        // Nombre y mensajes
        const nameCell = document.createElement('td');
        nameCell.style.width = '10%';
        nameCell.innerHTML = `
            <input type="text" class="input-field" value="${character.name}" onchange="updateName(${index}, this.value)">
        `;
        row.appendChild(nameCell);

        // Atributos
        ['vidaActual', 'vidaMaxima', 'mana', 'cordura', 'energia', 'suerte'].forEach(attr => {
            const cell = document.createElement('td');
            cell.style.width = '10%';
            cell.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center;">
                    <button class="action-btn btn-minus" onclick="modifyAttribute(${index}, '${attr}', -1)">-</button>
                    <span id="${character.id}-${attr}" style="margin: 0 10px;">${character[attr]}</span>
                    <button class="action-btn btn-plus" onclick="modifyAttribute(${index}, '${attr}', 1)">+</button>
                </div>
            `;
            row.appendChild(cell);
        });

        // Estados
        const estadoCell = document.createElement('td');
        estadoCell.style.width = '30%';
        estadoCell.innerHTML = character.estados.map(estado => `
            <a id="${estado.id}" href="#" onclick="removeState('${estado.id}', ${index})">${estado.text}</a>
        `).join(' ');
        row.appendChild(estadoCell);

        tableBody.appendChild(row);
    });

    saveCharacters(characters);
}




function updateName(index, newName) {
    const characters = loadCharacters();
    characters[index].name = newName;
    saveCharacters(characters);
}

function modifyAttribute(index, attr, value) {
    const characters = loadCharacters();
    const character = characters[index];

    character[attr] = Math.max(0, character[attr] + value);

    // Reglas adicionales para Vida y Cordura
    if (attr === 'vidaActual' || attr === 'vidaMaxima') {
        if (character.vidaActual < character.vidaMaxima / 2) {
            document.getElementById(`${character.id}-vidaActual`).parentElement.parentElement.style.backgroundColor = 'orange';
           // document.getElementById(`${character.id}-vidaMaxima`).parentElement.parentElement.style.backgroundColor = 'red';
        } else {
            document.getElementById(`${character.id}-vidaActual`).parentElement.parentElement.style.backgroundColor = '';
           // document.getElementById(`${character.id}-vidaMaxima`).parentElement.parentElement.style.backgroundColor = '';
        }
    }

    if (attr === 'cordura' && character.cordura === 0) {
        const randomDisadvantage = disadvantages[Math.floor(Math.random() * disadvantages.length)];
        character.corduraMensaje = randomDisadvantage;
    } else if (attr === 'cordura') {
        character.corduraMensaje = '';
    }

    saveCharacters(characters);
    renderTable();
}

function checkAlerts(character, index) {
    const vidaAlert = document.getElementById(`${character.id}-alert-vida`);
    const corduraAlert = document.getElementById(`${character.id}-alert-cordura`);

    // Verificar alerta de vida
    if (character.vidaActual < character.vidaMaxima / 2) {
        vidaAlert.innerText = "-1 Acción";
        vidaAlert.style.display = 'block';
    } else {
        vidaAlert.style.display = 'none';
    }

    // Verificar alerta de cordura
    if (character.corduraMensaje) {
        corduraAlert.innerText = character.corduraMensaje;
        corduraAlert.style.display = 'block';
    } else {
        corduraAlert.style.display = 'none';
    }
}
function toggleRoundsInput() {
    const estadoSelect = document.getElementById('estado-select');
    const roundsContainer = document.getElementById('rounds-container');
    if (estadoSelect.value === 'Veneno') {
        roundsContainer.style.display = 'inline';
    } else {
        roundsContainer.style.display = 'none';
    }
}

function updateHeroSelect() {
    const heroSelect = document.getElementById('hero-select');
    const characters = loadCharacters();
    heroSelect.innerHTML = '';
    characters.forEach((character, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = character.name;
        heroSelect.appendChild(option);
    });
}

function addState() {
    const estadoSelect = document.getElementById('estado-select').value;
    const heroSelect = document.getElementById('hero-select').value;
    const roundsInput = document.getElementById('rounds-input').value;

    const characters = loadCharacters();
    const character = characters[heroSelect];

    let stateText = estadoSelect;
    if (estadoSelect === 'Veneno') {
        const rounds = parseInt(roundsInput, 10) || 0;
        stateText += ` (${rounds} rondas)`;
    }

    const stateId = `${heroSelect}-${estadoSelect}`;
    character.estados.push({ id: stateId, text: stateText });

    saveCharacters(characters);
    renderTable();
}
function removeState(stateId, heroIndex) {
    const characters = loadCharacters();
    const character = characters[heroIndex];
    character.estados = character.estados.filter(estado => estado.id !== stateId);

    saveCharacters(characters);
    renderTable();
}

// Al cargar la página
window.onload = () => {
    renderTable();
    updateHeroSelect();
};
