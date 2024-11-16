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
    const characters = savedData ? JSON.parse(savedData) : defaultCharacters;
    console.log('Characters Loaded:', characters); // Depuración
    return characters;
}

function saveCharacters(characters) {
    localStorage.setItem('characters', JSON.stringify(characters));
}

function renderTable() {
    const characters = loadCharacters();
    console.log('Rendering Table with Characters:', characters); // Depuración
    const tableBody = document.getElementById('character-table');
    tableBody.innerHTML = '';

    characters.forEach((character, index) => {
        console.log('Processing Character:', character); // Depuración
        const row = document.createElement('tr');

        // Nombre
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `
            <input type="text" class="input-field" value="${character.name}" onchange="updateName(${index}, this.value)">
        `;
        row.appendChild(nameCell);

        // Atributos
        ['vidaActual', 'vidaMaxima', 'mana', 'cordura', 'energia', 'suerte'].forEach(attr => {
            const cell = document.createElement('td');
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
        } else {
            document.getElementById(`${character.id}-vidaActual`).parentElement.parentElement.style.backgroundColor = '';
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

function toggleRoundsInput() {
    const estadoSelect = document.getElementById('estado-select');
    const roundsContainer = document.getElementById('rounds-container');
    roundsContainer.style.display = estadoSelect.value === 'Veneno' ? 'inline' : 'none';
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
    const heroSelect = parseInt(document.getElementById('hero-select').value, 10);
    const roundsInput = document.getElementById('rounds-input').value;

    const characters = loadCharacters();
    const character = characters[heroSelect];

    // Verificar si el estado ya existe
    const stateId = `${heroSelect}-${estadoSelect}`;
    const existingState = character.estados.find(estado => estado.id === stateId);
    if (existingState) {
     //   alert(`El estado "${estadoSelect}" ya está asignado a este personaje.`);
        return; // No añadir duplicados
    }

    // Crear texto para el estado
    let stateText = estadoSelect;
    if (estadoSelect === 'Veneno') {
        let rounds = parseInt(roundsInput, 10);
        if (isNaN(rounds) || rounds < 1) {
            rounds = 1; // Forzar mínimo de 1 turno
        }
        stateText += ` (${rounds} rondas)`;
    }

    // Añadir el nuevo estado
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
    saveCharacters(defaultCharacters); // Reiniciar con valores predeterminados para pruebas
    renderTable();
    updateHeroSelect();
};
