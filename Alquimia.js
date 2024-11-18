// Ingredientes y partes de monstruos
const ingredients = [
    "Botella de cristal","Ra�z arqueada", "Jengibre ceniciento", "Ajenjo Espinado", "Ambros�a", "Equin�cea azul",
    "Callicarpa brillante", "Polen del Amaru", "Corteza de arce rojo", "Artemisa salada",
    "Asclepia picante", "Frambuesa gigante", "Baya lunar", "Laurel del monje", "Agracejo",
    "Belladona", "Dulcamara", "Hiedra dulce", "Perejil t�xico", "Barbarea", "Tr�bol llor�n"
];

const monsterParts = Array.from(new Set([
    "Ectoplasma", "Colmillo de ara�a", "Plumas", "Sangre humana", "Tejido cerebral",
    "Coraz�n bestial", "Quitina", "Sangre de drag�n", "Pelo de elfo", "Alas murci�lago",
    "Hojas enredador", "Polvo de huesos", "U�as", "Ojo de goblin", "Escamas",
    "Piel", "Ojo de medusa", "Lengua", "Polvo de momia", "Sangre de necro",
    "Diente de ogro", "Sangre de orco", "Cola de rata", "Viscosidad", "Piel anfibia",
    "Sangre de troll", "Sangre Vampiro", "Piel de zombi"
]));

// Nombres de pociones
const potionNames = {
    basic: {
        d3_1_2: [
            "Experiencia", "Constituci�n", "Valent�a", "Destreza", "Energ�a", "Vitalidad",
            "Mana", "Fuerza", "Sabidur�a", "�cido", "Nauseabunda", "Flam�gera",
            "Invisibilidad", "Corrosi�n", "Contra Enfermedades", "Ant�doto",
            "Veneno", "Fuego L�quido", "Frasco del Vac�o", "Aceite para Armas"
        ],
        d3_3: [
            "Velocidad", "Polvo Qu�mico", "Elixir de Arquero", "Poci�n de Furia",
            "Resistencia al Fuego", "Escama de Drag�n", "Restauraci�n",
            "Escupefuego", "Humo"
        ]
    },
    weak_and_supreme: [
        "Flam�gera", "Constituci�n", "Valent�a", "Destreza", "Energ�a", "Vitalidad",
        "Mana", "Fuerza", "Sabidur�a", "�cido", "Contra Enfermedades", "Ant�doto"
    ]
};

// LocalStorage Keys
const INVENTORY_KEY = "alchemy_inventory";
const RECIPES_KEY = "alchemy_recipes";

// Cargar datos iniciales
const inventory = JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];

// Guardar en LocalStorage
function saveInventory() {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
}

function saveRecipes() {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

// Renderizar inventario como tabla
function renderInventoryTable() {
    const tbody = document.querySelector("#inventory-table tbody");
    tbody.innerHTML = "";
    inventory.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.units}</td>
            <td>${item.exquisite ? "S�" : "No"}</td>
        `;
        tbody.appendChild(row);
    });
}

// Renderizar inventario (original)
function renderInventory() {
    const inventoryList = document.getElementById("inventory-list");
    inventoryList.innerHTML = "";
    inventory.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} (${item.units}) ${item.exquisite ? "[Exquisito]" : ""}`;
        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.onclick = () => {
            inventory.splice(index, 1);
            saveInventory();
            renderInventory();
            renderInventoryTable();
        };
        li.appendChild(removeButton);
        inventoryList.appendChild(li);
    });
}

// Renderizar recetario como tabla
function renderRecipeTable() {
    const tbody = document.querySelector("#recipe-table tbody");
    tbody.innerHTML = "";
    recipes.forEach(recipe => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${recipe.name}</td>
            <td>${recipe.type}</td>
            <td>${recipe.ingredients.join(", ")}</td>
        `;
        tbody.appendChild(row);
    });
}

// Renderizar recetario y el desplegable para olvidar recetas
function renderRecipeBook() {
    const forgetRecipeSelect = document.getElementById("forget-recipe-select");
    forgetRecipeSelect.innerHTML = "<option value=''>Seleccione una receta</option>";

    recipes.forEach((recipe, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = recipe.name;
        forgetRecipeSelect.appendChild(option);
    });

    renderRecipeTable();
}

// Olvidar receta
document.getElementById("forget-recipe").addEventListener("click", () => {
    const forgetRecipeSelect = document.getElementById("forget-recipe-select");
    const selectedIndex = forgetRecipeSelect.value;

    if (selectedIndex === "") {
        alert("Seleccione una receta para olvidar.");
        return;
    }

    recipes.splice(selectedIndex, 1);
    saveRecipes();
    renderRecipeBook();
    alert("Receta olvidada con �xito.");
});

// Agregar material al inventario
document.getElementById("add-material").addEventListener("click", () => {
    const material = document.getElementById("material-select").value;
    const units = parseInt(document.getElementById("material-units").value, 10);
    const exquisite = document.getElementById("material-exquisite").checked;

    const existing = inventory.find(item => item.name === material && item.exquisite === exquisite);
    if (existing) {
        existing.units += units;
    } else {
        inventory.push({ name: material, units, exquisite });
    }
    saveInventory();
    renderInventory();
    renderInventoryTable();
});

// Inicializar materiales en el desplegable
function initializeMaterialDropdown() {
    const materialSelect = document.getElementById("material-select");
    [...ingredients, ...monsterParts].forEach(material => {
        const option = document.createElement("option");
        option.value = material;
        option.textContent = material;
        materialSelect.appendChild(option);
    });
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    initializeMaterialDropdown();
    renderInventory();
    renderInventoryTable();
    renderRecipeBook();
});

// Generar los desplegables para seleccionar materiales
// Popular los desplegables con los materiales del inventario
// Generar los desplegables para seleccionar materiales
function generatePotionSelectors(type) {
    const container = document.getElementById("potion-ingredients");
    container.innerHTML = ""; // Limpiar los desplegables previos

    if (!type) {
        return; // No hacer nada si no se ha seleccionado un tipo
    }

    let selectorsNeeded;
    if (type === "basic") {
        selectorsNeeded = 2; // 1 Ingrediente + 1 Parte de monstruo
    } else if (type === "weak") {
        selectorsNeeded = 3; // 2 Ingredientes o Partes, 1 del otro tipo
    } else if (type === "supreme") {
        selectorsNeeded = 4; // 2 Ingredientes + 2 Partes
    }

    // Crear los desplegables
    for (let i = 0; i < selectorsNeeded; i++) {
        const select = document.createElement("select");
        select.classList.add("potion-selector");
        select.dataset.type = i % 2 === 0 ? "ingredient" : "monsterPart";
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select material";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);
        container.appendChild(select);
    }

    // Popular los desplegables con opciones iniciales
    populatePotionSelectors();
}

// Popular los desplegables con los materiales del inventario
function populatePotionSelectors() {
    const selectors = document.querySelectorAll(".potion-selector");
    selectors.forEach((select, index) => {
        const type = select.dataset.type; // "ingredient" o "monsterPart"
        const usedValues = Array.from(selectors)
            .filter((s, i) => i < index) // Obtener las selecciones previas
            .map(s => s.value);

        select.innerHTML = ""; // Limpiar opciones previas

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select material";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // Filtrar opciones disponibles en el inventario seg�n el tipo
        const availableItems = inventory.filter(item =>
            (type === "ingredient" && ingredients.includes(item.name) && item.units > 0) ||
            (type === "monsterPart" && monsterParts.includes(item.name) && item.units > 0)
        );

        availableItems
            .filter(item => !usedValues.includes(item.name)) // Evitar elementos ya seleccionados
            .forEach(item => {
                const option = document.createElement("option");
                option.value = item.name;
                option.textContent = `${item.name} (${item.exquisite ? "Exquisito" : "Normal"})`;
                select.appendChild(option);
            });
    });
}

// Detectar cambio en el tipo de poci�n y generar los desplegables
document.getElementById("potion-type").addEventListener("change", (e) => {
    generatePotionSelectors(e.target.value);
});

// Crear poci�n
document.getElementById("create-potion").addEventListener("click", () => {
    const type = document.getElementById("potion-type").value;
    const selectors = document.querySelectorAll(".potion-selector");

    if (!type) {
        alert("Selecciona un tipo de poci�n.");
        return;
    }

    const selectedItems = Array.from(selectors).map(s => s.value);

    if (selectedItems.includes("")) {
        alert("Selecciona todos los ingredientes a usar.");
        return;
    }

    // Resto de la l�gica para crear pociones
    const alchemySkill = parseInt(document.getElementById("alchemy-skill").value, 10);

    const missingItems = selectedItems.filter(item => {
        const inventoryItem = inventory.find(inv => inv.name === item);
        return !inventoryItem || inventoryItem.units < 1;
    });

    if (missingItems.length > 0) {
        alert(`Faltan los siguientes ingredientes o partes en el inventario: ${missingItems.join(", ")}`);
        return;
    }

    // Calcular habilidad total
    let totalAlchemySkill = alchemySkill;
    let exquisiteBonus = 0;
    selectedItems.forEach(item => {
        const inventoryItem = inventory.find(inv => inv.name === item);
        if (inventoryItem && inventoryItem.exquisite) exquisiteBonus += 10;
    });
    totalAlchemySkill += exquisiteBonus;

    // Verificar si la poci�n es conocida
    const knownRecipe = recipes.find(recipe => recipe.ingredients.sort().join(",") === selectedItems.sort().join(","));
    if (knownRecipe) totalAlchemySkill += 10;

    // Realizar tirada
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= totalAlchemySkill || roll <= 5) {
        // �xito cr�tico o normal
        const isCritical = roll <= 5;

        if (isCritical) {
            alert("��xito cr�tico! Mejora Hab. ALQ. en 1 o recupera energ�a.");
        }

        // Restar ingredientes y partes
        selectedItems.forEach(item => {
            const inventoryItem = inventory.find(inv => inv.name === item);
            if (inventoryItem) inventoryItem.units -= 1;
        });

        // Restar botella
        const bottle = inventory.find(inv => inv.name === "Botella de cristal");
        if (!bottle || bottle.units < 1) {
            alert("No hay botellas vac�as en el inventario.");
            return;
        }
        bottle.units -= 1;

        // Crear poci�n
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            alert(`�La poci�n "${potionName}" ha sido creada exitosamente!`);
        } else {
            potionName = getPotionName(type);
            alert(`�Nueva poci�n creada: "${potionName}"!`);
            recipes.push({
                type,
                name: potionName,
                ingredients: selectedItems
            });
            saveRecipes();
        }
        saveInventory();
        renderInventory();
    } else {
        // Fallo en la creaci�n
        alert(`Fallaste en la creaci�n de la poci�n. Ingredientes usados: ${selectedItems.join(", ")}`);
        const bottle = inventory.find(inv => inv.name === "Botella de cristal");
        if (roll >= 95 && bottle) {
            bottle.units -= 1;
            alert("�La botella tambi�n se rompi�!");
        }
        saveInventory();
        renderInventory();
    }
});

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    initializeMaterialDropdown();
    renderInventory();
    renderInventoryTable();
    renderRecipeBook();
    generatePotionSelectors(""); // Por defecto, limpiar desplegables
});