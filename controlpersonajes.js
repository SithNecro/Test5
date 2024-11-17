const defaultCharacters = [
    { id: 'pj1', name: 'Personaje 1', vidaActual: 20, vidaMaxima: 20, mana: 0, cordura: 8, energia: 1, suerte: 0, corduraMensaje: '', estados: [] },
    { id: 'pj2', name: 'Personaje 2', vidaActual: 20, vidaMaxima: 20, mana: 0, cordura: 8, energia: 1, suerte: 0, corduraMensaje: '', estados: [] },
    { id: 'pj3', name: 'Personaje 3', vidaActual: 20, vidaMaxima: 20, mana: 0, cordura: 8, energia: 1, suerte: 0, corduraMensaje: '', estados: [] },
    { id: 'pj4', name: 'Personaje 4', vidaActual: 20, vidaMaxima: 20, mana: 0, cordura: 8, energia: 1, suerte: 0, corduraMensaje: '', estados: [] }
];

const disadvantages = [
    "Odio",
    "Estr�s agudo",
    "Estr�s agudo",
    "Trauma persistente",
    "Temor a la oscuridad",
    "Aracnofobia",
    "Asustadizo",
    "Miedo irracional",
    "Claustrofobia",
    "Depresi�n"
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

    // Tooltip descriptions for each state
    const tooltips = {
        Herido: "-1 PA",
        Miedo: "-10 HC/HD y -10 AA",
        Terror: "-10 HC/HD, -10 AA y -1 PA",
        Enfermedad: "CON/2 y FUE/2",
        Aturdido: "-1 PA",
        Veneno: "P�rdida gradual de salud"
    };

    characters.forEach((character, index) => {
        const row = document.createElement('tr');

        // Nombre del personaje
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

        // Estados con tooltip
        const estadoCell = document.createElement('td');
        estadoCell.innerHTML = character.estados.map(estado => `
            <a id="${estado.id}" 
               href="#" 
               onclick="removeState('${estado.id}', ${index})" 
               style="color: ${estado.color || 'black'};"
               title="${tooltips[estado.text.split(' ')[0]] || 'Estado sin descripci�n'}">${estado.text}</a>
        `).join(' ');
        row.appendChild(estadoCell);

        tableBody.appendChild(row);
    });

    saveCharacters(characters);
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
       // alert(`El estado "${estadoSelect}" ya est� asignado a este personaje.`);
        return; // No a�adir duplicados
    }

    // Crear texto para el estado
    let stateText = estadoSelect;
    if (estadoSelect === 'Veneno') {
        let rounds = parseInt(roundsInput, 10);
        if (isNaN(rounds) || rounds < 1) {
            rounds = 1; // Forzar m�nimo de 1 turno
        }
        stateText += ` (${rounds} rondas)`;
    }

    // A�adir el nuevo estado
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

function updateName(index, newName) {
    const characters = loadCharacters();
    characters[index].name = newName;
    saveCharacters(characters);
}

function modifyAttribute(index, attr, value) {
    const characters = loadCharacters();
    const character = characters[index];

    character[attr] = Math.max(0, character[attr] + value);

    // Reglas para "Herido"
    if (attr === 'vidaActual') {
        const isWounded = character.vidaActual < character.vidaMaxima / 2;
        const stateId = `${index}-Herido`;

        if (isWounded) {
            const existingState = character.estados.find(estado => estado.id === stateId);
            if (!existingState) {
                character.estados.push({ id: stateId, text: 'Herido', color: 'red' });
            }
        } else {
            character.estados = character.estados.filter(estado => estado.id !== stateId);
        }
    }

    // Reglas para "Cordura"
    if (attr === 'cordura') {
        const isInsane = character.cordura === 0;
        const stateId = `${index}-Cordura`;

        if (isInsane) {
            const existingState = character.estados.find(estado => estado.id === stateId);
            if (!existingState) {
                const randomDisadvantage = disadvantages[Math.floor(Math.random() * disadvantages.length)];
                character.estados.push({ id: stateId, text: randomDisadvantage, color: 'darkviolet' });
            }
        } else {
            character.estados = character.estados.filter(estado => estado.id !== stateId);
        }
    }

    saveCharacters(characters);
    renderTable();
}
function pasarTurno() {
    const characters = loadCharacters();
    let venenoActualizado = false; // Bandera para verificar si se actualiz� alg�n estado "Veneno"
    const heroesConVeneno = []; // Lista de nombres de h�roes con "Veneno"

    characters.forEach((character, index) => {
        // Procesar el estado "Veneno" para cada personaje
        character.estados = character.estados.map(estado => {
            if (estado.text.startsWith('Veneno')) {
                // Extraer las rondas restantes
                const roundsMatch = estado.text.match(/\((\d+) rondas\)/);
                if (roundsMatch) {
                    let rounds = parseInt(roundsMatch[1], 10);

                    // Reducir las rondas en 1
                    rounds -= 1;

                    if (rounds > 0) {
                        // Actualizar el texto del estado con las rondas restantes
                        estado.text = `Veneno (${rounds} rondas)`;
                        venenoActualizado = true; // Marcar que hubo actualizaci�n
                        heroesConVeneno.push(character.name); // A�adir el nombre del h�roe a la lista
                        return estado;
                    }
                    // Si las rondas llegan a 0, eliminar el estado devolviendo null
                    venenoActualizado = true; // Marcar que hubo actualizaci�n
                    return null;
                }
            }
            return estado; // Devolver otros estados sin cambios
        }).filter(Boolean); // Eliminar los estados que son null
    });

    saveCharacters(characters);
    renderTable();

    if (venenoActualizado && heroesConVeneno.length > 0) {
        alert(`Atenci�n nuevo turno, recuerda aplicar el veneno a los h�roes: ${heroesConVeneno.join(', ')}`);
    }
}

// Al cargar la p�gina
window.onload = () => {
    renderTable();
    updateHeroSelect();
};
