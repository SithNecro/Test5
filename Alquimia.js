// Ingredientes y partes de monstruos
const ingredients = [
    "Raíz arqueada", "Jengibre ceniciento", "Ajenjo Espinado", "Ambrosía", "Equinácea azul",
    "Callicarpa brillante", "Polen del Amaru", "Corteza de arce rojo", "Artemisa salada",
    "Asclepia picante", "Frambuesa gigante", "Baya lunar", "Laurel del monje", "Agracejo",
    "Belladona", "Dulcamara", "Hiedra dulce", "Perejil tóxico", "Barbarea", "Trébol llorón"
];

const monsterParts = Array.from(new Set([
    "Ectoplasma", "Colmillo de araña", "Plumas", "Sangre humana", "Tejido cerebral",
    "Corazón bestial", "Quitina", "Sangre de dragón", "Pelo de elfo", "Alas murciélago",
    "Hojas enredador", "Polvo de huesos", "Uñas", "Ojo de goblin", "Escamas",
    "Piel", "Ojo de medusa", "Lengua", "Polvo de momia", "Sangre de necro",
    "Diente de ogro", "Sangre de orco", "Cola de rata", "Viscosidad", "Piel anfibia",
    "Sangre de troll", "Sangre Vampiro", "Piel de zombi"
]));

// Nombres de pociones
const potionNames = {
    basic: {
        d3_1_2: [
            "Experiencia", "Constitución", "Valentía", "Destreza", "Energía", "Vitalidad",
            "Mana", "Fuerza", "Sabiduría", "Ácido", "Nauseabunda", "Flamígera",
            "Invisibilidad", "Corrosión", "Contra Enfermedades", "Antídoto",
            "Veneno", "Fuego Líquido", "Frasco del Vacío", "Aceite para Armas"
        ],
        d3_3: [
            "Velocidad", "Polvo Químico", "Elixir de Arquero", "Poción de Furia",
            "Resistencia al Fuego", "Escama de Dragón", "Restauración",
            "Escupefuego", "Humo"
        ]
    },
    weak_and_supreme: [
        "Flamígera", "Constitución", "Valentía", "Destreza", "Energía", "Vitalidad",
        "Mana", "Fuerza", "Sabiduría", "Ácido", "Contra Enfermedades", "Antídoto"
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
            <td>${item.exquisite ? "Sí" : "No"}</td>
            <td>
                <button class="remove-item" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);

        // Añadir evento al botón "Eliminar"
        const removeButton = row.querySelector(".remove-item");
        removeButton.addEventListener("click", () => {
            removeInventoryItem(index);
        });
    });
}
function removeInventoryItem(index) {
    if (index < 0 || index >= inventory.length) {
        console.error("Índice de inventario inválido:", index);
        return;
    }

    const removedItem = inventory.splice(index, 1); // Eliminar del inventario
    saveInventory(); // Guardar cambios en LocalStorage
    renderInventoryTable(); // Actualizar la tabla
    alert(`Elemento "${removedItem[0].name}" eliminado con éxito.`);
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

        row.innerHTML = `
            <td>${recipe.name}</td>
            <td>${recipe.type}</td>
            <td>${recipe.ingredients.join(", ")}</td>
            <td>
                <button class="forget-recipe" data-index="${index}" style="background-color: red; color: white; border-radius: 5px;">Olvidar</button>
            </td>
        `;

        tbody.appendChild(row);

        // Asignar evento al botón "Olvidar"
        const forgetButton = row.querySelector(".forget-recipe");
        forgetButton.addEventListener("click", () => {
            forgetRecipe(index);
        });
    });
}

// Función para olvidar una receta
function forgetRecipe(index) {
    if (index < 0 || index >= recipes.length) {
        console.error("Índice de receta inválido:", index);
        return;
    }

    const recipeToForget = recipes[index];
    const confirmation = confirm(`¿Estás seguro de que quieres olvidar la receta "${recipeToForget.name}"?`);
    if (!confirmation) {
        return; // Si el usuario cancela, no hacemos nada
    }

    recipes.splice(index, 1); // Eliminar receta
    saveRecipes(); // Guardar cambios en LocalStorage
    renderRecipeTable(); // Actualizar tabla
    alert(`Receta "${recipeToForget.name}" olvidada con éxito.`);
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
document.addEventListener("DOMContentLoaded", () => {
    initializeMaterialDropdown();
    renderInventoryTable();
    renderRecipeTable(); // Actualiza la tabla de recetas
    
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

        // Añadir la opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select material";
        defaultOption.disabled = true;
        select.appendChild(defaultOption);

        // Filtrar opciones disponibles en el inventario según el tipo
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

        // Restaurar el valor previamente seleccionado, si todavía está disponible
        if (previousValue && usedValues.includes(previousValue)) {
            select.value = previousValue;
        } else {
            select.value = ""; // Volver a la opción por defecto si el valor previo no está disponible
        }
    });
}

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

        select.addEventListener("change", () => populatePotionSelectors());
        container.appendChild(select);
    }

    // Popular los desplegables con opciones iniciales
    populatePotionSelectors();
}

// Detectar cambio en el tipo de poción y generar los desplegables
document.getElementById("potion-type").addEventListener("change", (e) => {
    generatePotionSelectors(e.target.value);
});


// Inicializar
// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    console.log("Cargando datos de LocalStorage...");
    if (!localStorage.getItem(RECIPES_KEY)) {
        const defaultRecipes = [
            { type: "basic", name: "Poción de Energía", ingredients: ["Jengibre ceniciento", "Ectoplasma"] },
            { type: "basic", name: "Poción de Fuerza", ingredients: ["Raíz arqueada", "Sangre de orco"] }
        ];
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
// Función para generar un nombre de poción basado en el tipo
function getPotionName(type) {
    if (type === "basic") {
        const roll = Math.floor(Math.random() * 3) + 1; // Tirada de 1d3
        if (roll === 1 || roll === 2) {
            const basicNames = [
                "Experiencia", "Constitución", "Valentía", "Destreza", "Energía",
                "Vitalidad", "Mana", "Fuerza", "Sabiduría", "Ácido",
                "Nauseabunda", "Flamígera", "Invisibilidad", "Corrosión",
                "Contra Enfermedades", "Antídoto", "Veneno", "Fuego Líquido",
                "Frasco del Vacío", "Aceite para Armas"
            ];
            return basicNames[Math.floor(Math.random() * basicNames.length)];
        } else {
            const rareNames = [
                "Velocidad", "Polvo Químico", "Elixir de Arquero", "Poción de Furia",
                "Resistencia al Fuego", "Escama de Dragón", "Restauración",
                "Escupefuego", "Humo"
            ];
            return rareNames[Math.floor(Math.random() * rareNames.length)];
        }
    } else if (type === "weak" || type === "supreme") {
        const advancedNames = [
            "Flamígera", "Constitución", "Valentía", "Destreza", "Energía",
            "Vitalidad", "Mana", "Fuerza", "Sabiduría", "Ácido",
            "Contra Enfermedades", "Antídoto"
        ];
        return advancedNames[Math.floor(Math.random() * advancedNames.length)];
    }
    return "Poción Desconocida";
}
// Gestión de botellas vacías
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
        alert("No se puede crear la poción sin botellas vacías.");
        return;
    }

    const type = document.getElementById("potion-type").value;
    const selectors = document.querySelectorAll(".potion-selector");

    if (!type) {
        alert("Selecciona un tipo de poción.");
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

    // Verificar si la poción es conocida
    const knownRecipe = recipes.find(recipe =>
        JSON.stringify(recipe.ingredients.sort()) === JSON.stringify(selectedItems.sort())
    );
    if (knownRecipe) totalAlchemySkill += 10;

    // Realizar tirada
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= totalAlchemySkill || roll <= 5) {
        // Éxito crítico o normal
        const isCritical = roll <= 5;

        if (isCritical) {
            alert("¡Éxito crítico! Mejora Hab. ALQ. en 1 o recupera energía.");
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
        alert("¡Poción creada con éxito! Una botella ha sido utilizada.");

        // Crear poción
        let potionName;
        if (knownRecipe) {
            potionName = knownRecipe.name;
            alert(`¡La poción "${potionName}" ha sido creada exitosamente!`);
        } else {
            potionName = getPotionName(type);
            alert(`¡Nueva poción creada: "${potionName}"!`);

            // Agregar la poción al recetario
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
        // Fallo en la creación
        alert(`Fallaste en la creación de la poción. Ingredientes usados: ${selectedItems.join(", ")}`);
        if (roll >= 95) {
            emptyBottles--;
            alert("¡La botella también se rompió!");
        }
        saveInventory();
        renderInventoryTable();
        renderRecipeTable(); // Actualizar tabla
    }

    updateBottleCount();
});

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateBottleCount();
});
