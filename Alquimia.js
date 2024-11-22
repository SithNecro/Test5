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

// Renderizar inventario (original)
function renderInventoryTable() {
    const tbody = document.querySelector("#inventory-table tbody");
    if (!tbody) {
        console.error("El elemento #inventory-table tbody no existe.");
        return;
    }

    tbody.innerHTML = "";

    if (inventory.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No hay elementos en el inventario.</td></tr>";
        return;
    }

    inventory.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.units}</td>
            <td>${item.exquisite ? "S�" : "No"}</td>
            <td>
                <button class="remove-item" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);

        // A�adir evento al bot�n "Eliminar"
        const removeButton = row.querySelector(".remove-item");
        removeButton.addEventListener("click", () => {
            removeInventoryItem(index);
        });
    });
}
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

    recipes.forEach((recipe, index) => {
        const row = document.createElement("tr");

        // Incluir el atributo `title` para el tooltip
        row.innerHTML = `
            <td title="${recipe.title || ''}">${recipe.name}</td>
            <td>${recipe.type}</td>
            <td>${recipe.ingredients.join(", ")}</td>
            <td>${recipe.default ? "" : `
                <button class="forget-recipe" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Olvidar</button>
            `}</td>
        `;

        tbody.appendChild(row);

        // Asignar evento al bot�n "Olvidar" solo si no es receta por defecto
        if (!recipe.default) {
            const forgetButton = row.querySelector(".forget-recipe");
            forgetButton.addEventListener("click", () => {
                forgetRecipe(index);
            });
        }
    });
}


// Funci�n para olvidar una receta
function forgetRecipe(index) {
    const recipeToForget = recipes[index];
    if (recipeToForget.default) {
        alert(`La receta "${recipeToForget.name}" es predeterminada y no se puede olvidar.`);
        return;
    }

    const confirmation = confirm(`�Est�s seguro de que quieres olvidar la receta "${recipeToForget.name}"?`);
    if (!confirmation) {
        return; // Si el usuario cancela, no hacemos nada
    }

    recipes.splice(index, 1); // Eliminar receta
    saveRecipes(); // Guardar cambios en LocalStorage
    renderRecipeTable(); // Actualizar tabla
    alert(`Receta "${recipeToForget.name}" olvidada con �xito.`);
}



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
// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");
    let defaultRecipes = [
        { type: "basic", name: "Poci�n de Curaci�n", ingredients: ["Sangre humana", "Cola de rata", "Jengibre ceniciento"], default: true,title:"Sana Sanita" },
        { type: "basic", name: "Poci�n contra Enfermedades", ingredients: ["Piel de zombi", "Ala de murci�lago", "Laurel del monje"], default: true ,title:"Sana enferme"},
        { type: "basic", name: "Bomba Flam�gera", ingredients: ["Coraz�n de bestia", "Cola de rata", "Baya lunar"], default: true, title: "pum" },
        { type: "basic", name: "Ant�doto", ingredients: ["Colmillo de ara�a", "Barb�rea", "Agracejo"], default: true, title: "cura eneno" },
        { type: "basic", name: "Frasco de Experiencia", ingredients: ["Sangre de drag�n", "Hiedra dulce", "Belladona"], default: true, title: "Exp up" },
        { type: "basic", name: "Poci�n de Restauraci�n", ingredients: ["Sangre de vampiro", "Sangre de troll", "Corteza de arce rojo"], default: true, title: "restaura tripita" }
    ];
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
function populatePotionSelectors() {
    const selectors = document.querySelectorAll(".potion-selector");
    const usedValues = Array.from(selectors)
        .filter(select => select.value) // Filtrar solo los que ya tienen un valor seleccionado
        .map(select => select.value);

    selectors.forEach((select, index) => {
        const type = select.dataset.type; // "ingredient" o "monsterPart"
        const previousValue = select.value; // Guardar el valor seleccionado previamente
        select.innerHTML = ""; // Limpiar opciones previas

        // A�adir la opci�n por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select material";
        defaultOption.disabled = true;
        select.appendChild(defaultOption);

        // Filtrar opciones disponibles en el inventario seg�n el tipo
        const availableItems = inventory.filter(item =>
            (type === "ingredient" && ingredients.includes(item.name) && item.units > 0) ||
            (type === "monsterPart" && monsterParts.includes(item.name) && item.units > 0)
        );

        availableItems.forEach(item => {
            const option = document.createElement("option");
            option.value = item.name;
            option.textContent = `${item.name} (${item.exquisite ? "Exquisito" : "Normal"})`;

            // Deshabilitar si ya ha sido seleccionado en otro desplegable
            if (usedValues.includes(item.name) && item.name !== previousValue) {
                option.disabled = true;
            }

            select.appendChild(option);
        });

        // Restaurar el valor previamente seleccionado, si todav�a est� disponible
        if (previousValue && usedValues.includes(previousValue)) {
            select.value = previousValue;
        } else {
            select.value = ""; // Volver a la opci�n por defecto si el valor previo no est� disponible
        }
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

    const selectedItems = Array.from(selectors).map(s => s.value);

    if (selectedItems.includes("")) {
        alert("Selecciona todos los ingredientes a usar.");
        return;
    }

    const alchemySkill = parseInt(document.getElementById("alchemy-skill").value, 10);

    // Verificar inventario
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

    // Sumar 10 puntos por cada ingrediente o parte exquisito
    const exquisiteBonus = selectedItems.reduce((bonus, item) => {
        const inventoryItem = inventory.find(inv => inv.name === item);
        return bonus + (inventoryItem && inventoryItem.exquisite ? 10 : 0);
    }, 0);

    totalAlchemySkill += exquisiteBonus;

    // Verificar si la poci�n es conocida
    const knownRecipe = recipes.find(recipe =>
        JSON.stringify(recipe.ingredients.sort()) === JSON.stringify(selectedItems.sort())
    );
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
        alert("�Poci�n creada con �xito! Una botella ha sido utilizada.");

        // Crear poci�n
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            alert(`�La poci�n "${potionName}" ha sido creada exitosamente!`);
        } else {
            potionName = getPotionName(type);
            alert(`�Nueva poci�n creada: "${potionName}"!`);

            // Agregar la poci�n al recetario
            const newRecipe = {
                type,
                name: potionName,
                ingredients: [...selectedItems]
            };
            recipes.push(newRecipe);
            saveRecipes(); // Guardar en localStorage
            console.log("Receta nueva agregada:", newRecipe);
        }

        // Guardar cambios y actualizar vistas
        saveInventory();
        saveRecipes();
        renderInventoryTable();
        renderRecipeTable(); // Actualizar tabla
       
    } else {
        // Fallo en la creaci�n
        alert(`Fallaste en la creaci�n de la poci�n. Ingredientes usados: ${selectedItems.join(", ")}`);
        if (roll >= 95) {
            emptyBottles--;
            alert("�La botella tambi�n se rompi�!");
        }
        saveInventory();
        renderInventoryTable();
        renderRecipeTable(); // Actualizar tabla
    }

    updateBottleCount();
});

// Inicializaci�n al cargar la p�gina
document.addEventListener("DOMContentLoaded", () => {
    updateBottleCount();
});
