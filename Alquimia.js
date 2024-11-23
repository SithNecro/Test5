// Ingredientes y partes de monstruos
const ingredients = [
    "Ra�z arqueada", "Jengibre ceniciento", "Ajenjo Espinado", "Ambros�a", "Equin�cea azul",
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
const defaultRecipes = [
    { type: "basic", name: "Poci�n de Curaci�n", ingredients: ["Sangre humana", "Cola de rata", "Jengibre ceniciento"], default: true, title: "Sana Sanita" },
    { type: "basic", name: "Poci�n contra Enfermedades", ingredients: ["Piel de zombi", "Ala de murci�lago", "Laurel del monje"], default: true, title: "Sana enferme" },
    { type: "basic", name: "Bomba Flam�gera", ingredients: ["Coraz�n de bestia", "Cola de rata", "Baya lunar"], default: true, title: "pum" },
    { type: "basic", name: "Ant�doto", ingredients: ["Colmillo de ara�a", "Barb�rea", "Agracejo"], default: true, title: "cura eneno" },
    { type: "basic", name: "Frasco de Experiencia", ingredients: ["Sangre de drag�n", "Hiedra dulce", "Belladona"], default: true, title: "Exp up" },
    { type: "basic", name: "Poci�n de Restauraci�n", ingredients: ["Sangre de vampiro", "Sangre de troll", "Corteza de arce rojo"], default: true, title: "restaura tripita" }
];
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
// Ordenar ingredientes y partes por tipo y nombre
const combinedItems = [
    ...ingredients.map(name => ({ name, type: "Ingrediente" })),
    ...monsterParts.map(name => ({ name, type: "Parte" }))
].sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    return a.name.localeCompare(b.name);
});

// Ordenar inventario
function sortInventory() {
    inventory.sort((a, b) => {
        const typeA = ingredients.includes(a.name) ? "Ingrediente" : "Parte";
        const typeB = ingredients.includes(b.name) ? "Ingrediente" : "Parte";

        if (typeA !== typeB) return typeA.localeCompare(typeB);
        return a.name.localeCompare(b.name);
    });
}
// Renderizar inventario (original)
// Renderizar inventario
function renderInventoryTable() {
    const tbody = document.querySelector("#inventory-table tbody");
    if (!tbody) {
        console.error("El elemento #inventory-table tbody no existe.");
        return;
    }

    tbody.innerHTML = "";

    if (inventory.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No hay elementos en el inventario.</td></tr>";
        return;
    }

    sortInventory(); // Ordenar el inventario antes de renderizar

    inventory.forEach((item, index) => {
        const itemType = ingredients.includes(item.name) ? "Ingrediente" : "Parte";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${itemType}</td>
            <td>${item.name}</td>
            <td>${item.units}</td>
            <td>${item.exquisite ? "S�" : "No"}</td>
            <td>
                <button class="remove-item" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);

        const removeButton = row.querySelector(".remove-item");
        removeButton.addEventListener("click", () => {
            removeInventoryItem(index);
        });
    });
}
// Eliminar elementos del inventario

function removeInventoryItem(index) {
    if (index < 0 || index >= inventory.length) {
        console.error("�ndice de inventario inv�lido:", index);
        return;
    }

    const removedItem = inventory.splice(index, 1); // Eliminar del inventario
    saveInventory(); // Guardar cambios en LocalStorage
    renderInventoryTable(); // Actualizar la tabla
    alert(`Elemento "${removedItem[0].name}" eliminado con �xito.`);
}
// Renderizar recetario como tabla
// Renderizar la tabla de recetas
// Renderizar la tabla de recetas
function renderRecipeTable() {
    const tbody = document.querySelector("#recipe-table tbody");
    if (!tbody) {
        console.error("El elemento #recipe-table tbody no existe.");
        return;
    }

    tbody.innerHTML = "";

    if (recipes.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No hay recetas registradas.</td></tr>";
        return;
    }

    sortRecipes(); // Ordenar recetas antes de renderizar

    recipes.forEach((recipe, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${recipe.name}</td>
            <td>${recipe.type}</td>
            <td>${recipe.ingredients.join(", ")}</td>
            <td>${recipe.default ? "" : `
                <button class="forget-recipe" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Olvidar</button>
            `}</td>
        `;
        tbody.appendChild(row);

        if (!recipe.default) {
            const forgetButton = row.querySelector(".forget-recipe");
            forgetButton.addEventListener("click", () => {
                forgetRecipe(index);
            });
        }
    });
}
// Ordenar recetas
function sortRecipes() {
    recipes.sort((a, b) => a.name.localeCompare(b.name));
}

// Funci�n para olvidar una receta
function forgetRecipe(index) {
    const recipeToForget = recipes[index];
    if (recipeToForget.default) {
        alert(`La receta "${recipeToForget.name}" es predeterminada y no se puede olvidar.`);
        return;
    }

    const confirmation = confirm(`�Est�s seguro de que quieres olvidar la receta "${recipeToForget.name}"?`);
    if (!confirmation) return;

    recipes.splice(index, 1);
    saveRecipes();
    renderRecipeTable();
    alert(`Receta "${recipeToForget.name}" olvidada con �xito.`);
}




// Agregar material al inventario
// Evento para agregar material al inventario
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
    renderInventoryTable();
});

// Inicializar materiales en el desplegable
// Inicializar el desplegable de materiales
function initializeMaterialDropdown() {
    const materialSelect = document.getElementById("material-select");
    combinedItems.forEach(({ name, type }) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = `${type}: ${name}`;
        materialSelect.appendChild(option);
    });
}

// Inicializar
// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");
   
    let storedRecipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];

    const isDefaultLoaded = storedRecipes.some(recipe => recipe.default);
    if (!isDefaultLoaded) {
        storedRecipes = [...storedRecipes, ...defaultRecipes];
        localStorage.setItem(RECIPES_KEY, JSON.stringify(storedRecipes));
    }

    recipes.length = 0;
    recipes.push(...storedRecipes);

    initializeMaterialDropdown();
    renderInventoryTable();
    renderRecipeTable();
});


// Popular los desplegables con los materiales del inventario
// Popular los desplegables con los materiales del inventario
function populatePotionSelectors() {
    const selectors = document.querySelectorAll(".potion-selector");
    const usedNames = Array.from(selectors)
        .filter(select => select.value) // Filtrar solo los que ya tienen un valor seleccionado
        .map(select => select.value.split("#")[0]); // Extraer solo el nombre (ignorando exquisito)

    selectors.forEach(select => {
        const type = select.dataset.type; // "ingredient" o "monsterPart"
        const previousValue = select.value; // Guardar el valor seleccionado previamente
        select.innerHTML = ""; // Limpiar opciones previas

        // A�adir la opci�n por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccionar material";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // Filtrar opciones disponibles en el inventario seg�n el tipo
        const availableItems = inventory.filter(item =>
            (type === "ingredient" && ingredients.includes(item.name) && item.units > 0) ||
            (type === "monsterPart" && monsterParts.includes(item.name) && item.units > 0)
        );

        availableItems.forEach(item => {
            const optionValue = `${item.name}#${item.exquisite ? "Exquisito" : "Normal"}`;
            const optionText = `${item.name} (${item.exquisite ? "Exquisito" : "Normal"})`;

            // Verificar si el nombre del material ya est� en uso en otros selectores
            const isNameUsed = usedNames.includes(item.name);

            const option = document.createElement("option");
            option.value = optionValue;
            option.textContent = optionText;

            // Deshabilitar si el nombre ya est� en uso en otro selector
            if (isNameUsed && optionValue !== previousValue) {
                option.disabled = true;
            }

            select.appendChild(option);
        });

        // Restaurar el valor previamente seleccionado, si todav�a est� disponible
        select.value = previousValue || "";
    });
}
// Generar los desplegables para seleccionar materiales
function generatePotionSelectors(type) {
    const container = document.getElementById("potion-ingredients");
    container.innerHTML = ""; // Limpiar cualquier contenido previo

    if (!type) {
        return; // No hacer nada si no se ha seleccionado un tipo
    }

    if (type === "basic") {
        // Configuraci�n para las combinaciones posibles
        const combinations = [
            {
                label: "2 Ingredientes + 1 Parte",
                value: "ingredientsFirst",
                selectors: [
                    { type: "ingredient", count: 2 },
                    { type: "monsterPart", count: 1 }
                ]
            },
            {
                label: "1 Ingrediente + 2 Partes",
                value: "partsFirst",
                selectors: [
                    { type: "ingredient", count: 1 },
                    { type: "monsterPart", count: 2 }
                ]
            }
        ];

        // Crear botones de radio para elegir la combinaci�n
        const switcher = document.createElement("div");
        switcher.style.marginBottom = "10px"; // Separar botones de los selectores

        combinations.forEach((combination, index) => {
            const label = document.createElement("label");
            label.style.marginRight = "10px";

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "selectorCombination";
            radio.value = combination.value;
            if (index === 0) {
                radio.checked = true; // Selecci�n predeterminada
            }

            // Al cambiar el radio, generar los selectores correspondientes
            radio.addEventListener("change", () => {
                createSelectors(combination.selectors);
            });

            label.appendChild(radio);
            label.appendChild(document.createTextNode(" " + combination.label));
            switcher.appendChild(label);
        });

        container.appendChild(switcher);

        // Crear los selectores iniciales
        createSelectors(combinations[0].selectors);
    } else {
        let selectorsNeeded;

        if (type === "weak") {
            selectorsNeeded = [
                { type: "ingredient", count: 1 },
                { type: "monsterPart", count: 1 }
            ];
        } else if (type === "supreme") {
            selectorsNeeded = [
                { type: "ingredient", count: 2 },
                { type: "monsterPart", count: 2 }
            ];
        }

        createSelectors(selectorsNeeded);
    }
}

function createSelectors(selectorsNeeded) {
    const container = document.getElementById("potion-ingredients");

    // Eliminar selectores existentes
    const existingSelectors = container.querySelectorAll(".potion-selector");
    existingSelectors.forEach(selector => selector.remove());

    selectorsNeeded.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            const select = document.createElement("select");
            select.classList.add("potion-selector");
            select.dataset.type = type;

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Seleccionar material";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            select.appendChild(defaultOption);

            select.addEventListener("change", () => populatePotionSelectors());
            container.appendChild(select);
        }
    });

    populatePotionSelectors(); // Llenar selectores con opciones
}

// Detectar cambio en el tipo de poci�n y generar los desplegables
document.getElementById("potion-type").addEventListener("change", (e) => {
    generatePotionSelectors(e.target.value);
});


// Inicializar
// Inicializaci�n al cargar la p�gina
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");
    if (!localStorage.getItem(RECIPES_KEY)) {
        

        localStorage.setItem(RECIPES_KEY, JSON.stringify(defaultRecipes));
        console.log("Recetas predeterminadas guardadas:", defaultRecipes);
    }
    // Leer inventario y recetas de LocalStorage
    const storedRecipes = JSON.parse(localStorage.getItem(RECIPES_KEY)) || [];
    recipes.length = 0; // Vaciar el array actual (si ya existe en memoria)
    recipes.push(...storedRecipes); // Asegurarse de que contiene las recetas cargadas
    console.log("Recetas cargadas:", recipes);

    // Renderizar elementos de la interfaz
    initializeMaterialDropdown(); // Inicializar el desplegable de materiales
    renderInventoryTable(); // Renderizar el inventario
   
    generatePotionSelectors(""); // Limpiar y generar los selectores de ingredientes
});
// Funci�n para generar un nombre de poci�n basado en el tipo
function getPotionName(type) {
    if (type === "basic") {
        const roll = Math.floor(Math.random() * 3) + 1; // Tirada de 1d3
        if (roll === 1 || roll === 2) {
            const basicNames = [
                "Experiencia", "Constituci�n", "Valent�a", "Destreza", "Energ�a",
                "Vitalidad", "Mana", "Fuerza", "Sabidur�a", "�cido",
                "Nauseabunda", "Flam�gera", "Invisibilidad", "Corrosi�n",
                "Contra Enfermedades", "Ant�doto", "Veneno", "Fuego L�quido",
                "Frasco del Vac�o", "Aceite para Armas"
            ];
            return basicNames[Math.floor(Math.random() * basicNames.length)];
        } else {
            const rareNames = [
                "Velocidad", "Polvo Qu�mico", "Elixir de Arquero", "Poci�n de Furia",
                "Resistencia al Fuego", "Escama de Drag�n", "Restauraci�n",
                "Escupefuego", "Humo"
            ];
            return rareNames[Math.floor(Math.random() * rareNames.length)];
        }
    } else if (type === "weak" || type === "supreme") {
        const advancedNames = [
            "Flam�gera", "Constituci�n", "Valent�a", "Destreza", "Energ�a",
            "Vitalidad", "Mana", "Fuerza", "Sabidur�a", "�cido",
            "Contra Enfermedades", "Ant�doto"
        ];
        return advancedNames[Math.floor(Math.random() * advancedNames.length)];
    }
    return "Poci�n Desconocida";
}
// Gesti�n de botellas vac�as
let emptyBottles = parseInt(localStorage.getItem("empty_bottles")) || 0;

function updateBottleCount() {
    document.getElementById("empty-bottles").value = emptyBottles;
    localStorage.setItem("empty_bottles", emptyBottles);
}

document.getElementById("add-bottle").addEventListener("click", () => {
    emptyBottles++;
    updateBottleCount();
});
document.querySelectorAll(".potion-selector").forEach(select => {
    select.addEventListener("change", () => populatePotionSelectors());
});
document.getElementById("remove-bottle").addEventListener("click", () => {
    if (emptyBottles > 0) {
        emptyBottles--;
        updateBottleCount();
    }
});

document.getElementById("create-potion").addEventListener("click", () => {
    if (emptyBottles <= 0) {
        alert("No se puede crear la poci�n sin botellas vac�as.");
        return;
    }

    const type = document.getElementById("potion-type").value;
    const selectors = document.querySelectorAll(".potion-selector");

    if (!type) {
        alert("Selecciona un tipo de poci�n.");
        return;
    }

    const selectedItems = Array.from(selectors).map(select => {
        const [name, quality] = select.value.split("#");
        return { name, exquisite: quality === "Exquisito" };
    });

    if (selectedItems.some(item => !item.name)) {
        alert("Selecciona todos los ingredientes a usar.");
        return;
    }

    // Verificar inventario
    const missingItems = selectedItems.filter(({ name, exquisite }) => {
        const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
        return !inventoryItem || inventoryItem.units < 1;
    });

    if (missingItems.length > 0) {
        alert(`Faltan los siguientes ingredientes o partes en el inventario: ${missingItems.map(item => item.name).join(", ")}`);
        return;
    }

    const alchemySkill = parseInt(document.getElementById("alchemy-skill").value, 10);

    // Calcular habilidad total
    let totalAlchemySkill = alchemySkill;

    // Sumar 10 puntos por cada ingrediente o parte exquisito
    const exquisiteBonus = selectedItems.reduce((bonus, { name, exquisite }) => {
        const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
        return bonus + (inventoryItem && inventoryItem.exquisite ? 10 : 0);
    }, 0);

    totalAlchemySkill += exquisiteBonus;

    // Verificar si la poci�n es conocida
    const knownRecipe = recipes.find(recipe =>
        JSON.stringify(recipe.ingredients.sort()) === JSON.stringify(selectedItems.map(item => item.name).sort())
    );
    if (knownRecipe) totalAlchemySkill += 10;

    // Realizar tirada
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= totalAlchemySkill || roll <= 5) {
        // �xito cr�tico o normal
        const isCritical = roll <= 5;

        if (isCritical) {
            alert("Has sacado:"+roll+"  ��xito cr�tico! Mejora Hab. ALQ. en 1 o recupera energ�a.");
        }

        // Restar ingredientes y partes
        selectedItems.forEach(({ name, exquisite }) => {
            const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
            if (inventoryItem) {
                inventoryItem.units -= 1;
                if (inventoryItem.units === 0) {
                    // Eliminar del inventario si se queda en 0
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });

        // Restar botella
        emptyBottles--;
        alert("Has sacado:" + roll +"  �Poci�n creada con �xito! Una botella ha sido utilizada.");

        // Crear poci�n
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            alert("Has sacado:" + roll +`    �La poci�n "${potionName}" ha sido creada exitosamente!`);
        } else {
            potionName = getPotionName(type);
            alert("Has sacado:" + roll +`    �Nueva poci�n creada: "${potionName}"!`);

            // Agregar la poci�n al recetario
            const newRecipe = {
                type,
                name: potionName,
                ingredients: selectedItems.map(item => item.name)
            };
            recipes.push(newRecipe);
            saveRecipes(); // Guardar en localStorage
            console.log("Receta nueva agregada:", newRecipe);
        }

        // Guardar cambios y actualizar vistas
        saveInventory();
        saveRecipes();
        renderInventoryTable();
        renderRecipeTable();
    } else {
        // Fallo en la creaci�n
        alert("Has sacado:" + roll +`    Fallaste en la creaci�n de la poci�n. Ingredientes usados: ${selectedItems.map(item => item.name).join(", ")}`);
        selectedItems.forEach(({ name, exquisite }) => {
            const inventoryItem = inventory.find(item => item.name === name && item.exquisite === exquisite);
            if (inventoryItem) {
                inventoryItem.units -= 1;
                if (inventoryItem.units === 0) {
                    // Eliminar del inventario si se queda en 0
                    const index = inventory.indexOf(inventoryItem);
                    inventory.splice(index, 1);
                }
            }
        });
        if (roll >= 95) {
            emptyBottles--;
            alert("Has sacado:" + roll +"  �La botella tambi�n se rompi�!");
        }
        saveInventory();
        renderInventoryTable();
        renderRecipeTable();
    }

    updateBottleCount();
});

// Inicializaci�n al cargar la p�gina
document.addEventListener("DOMContentLoaded", () => {
    updateBottleCount();
});
function createManualPotionAdder() {
    const container = document.getElementById("manual-potion-adder");
    const toggleButton = document.getElementById("add-manual-potion-button");

    if (!toggleButton || !container) {
        console.error("No se encontr� el bot�n o el contenedor en el HTML.");
        return;
    }

    toggleButton.addEventListener("click", () => {
        container.style.display = container.style.display === "none" ? "block" : "none";
        toggleButton.textContent = container.style.display === "block"
            ? "Ocultar a�adir poci�n a mano"
            : "A�adir poci�n a mano";

        // Resetear contenido del contenedor
        container.innerHTML = "";
        if (container.style.display === "block") {
            generatePotionTypeSelector(container);
        }
    });
}

function generatePotionTypeSelector(container) {
    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Tipo de poci�n: ";
    const typeSelect = document.createElement("select");
    typeSelect.id = "manual-potion-type";

    ["", "D�bil", "B�sica", "Suprema"].forEach(type => {
        const option = document.createElement("option");
        option.value = type.toLowerCase();
        option.textContent = type || "Seleccionar tipo";
        typeSelect.appendChild(option);
    });

    container.appendChild(typeLabel);
    container.appendChild(typeSelect);
    container.appendChild(document.createElement("br"));

    typeSelect.addEventListener("change", () => {
        generatePotionMaterialsForm(container, typeSelect.value);
    });
}

function generatePotionMaterialsForm(container, type) {
    // Limpiar cualquier formulario existente
    const existingForm = container.querySelector("#manual-potion-materials-form");
    if (existingForm) {
        existingForm.remove();
    }

    if (!type) return;

    const form = document.createElement("div");
    form.id = "manual-potion-materials-form";

    // Generar el desplegable de nombre de la poci�n seg�n el tipo
    const potionNameLabel = document.createElement("label");
    potionNameLabel.textContent = "Nombre de la poci�n: ";
    const potionNameSelect = document.createElement("select");
    const defaultPotionOption = document.createElement("option");
    defaultPotionOption.value = "";
    defaultPotionOption.textContent = "Seleccionar poci�n";
    defaultPotionOption.disabled = true;
    defaultPotionOption.selected = true;
    potionNameSelect.appendChild(defaultPotionOption);

    // Rellenar el desplegable con pociones disponibles seg�n el tipo
    const availablePotions = defaultRecipes.filter(recipe => recipe.type === type);
    availablePotions.forEach(recipe => {
        const option = document.createElement("option");
        option.value = recipe.name;
        option.textContent = recipe.name;
        potionNameSelect.appendChild(option);
    });

    form.appendChild(potionNameLabel);
    form.appendChild(potionNameSelect);
    form.appendChild(document.createElement("br"));

    // Determinar el n�mero de materiales necesarios seg�n el tipo de poci�n
    let selectorsNeeded;
    if (type === "d�bil") {
        selectorsNeeded = [
            { type: "ingredient", count: 1 },
            { type: "monsterPart", count: 1 }
        ];
    } else if (type === "b�sica") {
        selectorsNeeded = [
            { type: "ingredient", count: 2 },
            { type: "monsterPart", count: 1 }
        ];
    } else if (type === "suprema") {
        selectorsNeeded = [
            { type: "ingredient", count: 2 },
            { type: "monsterPart", count: 2 }
        ];
    }

    const allMaterials = [...ingredients, ...monsterParts].sort();

    // Generar los desplegables para seleccionar materiales
    selectorsNeeded.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            const materialLabel = document.createElement("label");
            materialLabel.textContent = `Material (${type}): `;
            const materialSelect = document.createElement("select");

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Seleccionar material";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            materialSelect.appendChild(defaultOption);

            allMaterials.forEach(material => {
                const option = document.createElement("option");
                option.value = material;
                option.textContent = material;
                materialSelect.appendChild(option);
            });

            form.appendChild(materialLabel);
            form.appendChild(materialSelect);
            form.appendChild(document.createElement("br"));
        }
    });

    // Bot�n para a�adir al recetario
    const addButton = document.createElement("button");
    addButton.textContent = "A�adir al recetario";
    addButton.addEventListener("click", () => {
        const selectedPotionName = potionNameSelect.value;
        const selectedMaterials = Array.from(form.querySelectorAll("select"))
            .map(select => select.value)
            .filter(value => value); // Filtrar los no seleccionados

        if (!selectedPotionName) {
            alert("Debes seleccionar un nombre de poci�n.");
            return;
        }

        if (selectedMaterials.length === 0) {
            alert("Debes seleccionar al menos un material.");
            return;
        }

        // Crear una nueva receta
        const newRecipe = {
            name: selectedPotionName,
            type,
            ingredients: selectedMaterials
        };

        recipes.push(newRecipe);
        saveRecipes();
        renderRecipeTable();
        alert(`Poci�n "${selectedPotionName}" a�adida al recetario.`);
    });

    form.appendChild(addButton);
    container.appendChild(form);
}

// Inicializaci�n
document.addEventListener("DOMContentLoaded", () => {
    createManualPotionAdder();
});