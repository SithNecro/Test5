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
// Renderizar recetario como lista y tabla
function renderRecipeBook() {
    const recipeList = document.getElementById("recipe-list");
    const recipeTableBody = document.querySelector("#recipe-table tbody");
    const forgetRecipeSelect = document.getElementById("forget-recipe-select");

    recipeList.innerHTML = ""; // Limpiar la lista
    recipeTableBody.innerHTML = ""; // Limpiar la tabla
    forgetRecipeSelect.innerHTML = "<option value=''>Seleccione una receta</option>";

    recipes.forEach((recipe, index) => {
        // Agregar a la lista
        const li = document.createElement("li");
        li.textContent = `${recipe.name} (${recipe.type}): ${recipe.ingredients.join(", ")}`;
        recipeList.appendChild(li);

        // Agregar a la tabla
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${recipe.name}</td>
            <td>${recipe.type}</td>
            <td>${recipe.ingredients.join(", ")}</td>
        `;
        recipeTableBody.appendChild(row);

        // Agregar al desplegable para olvidar recetas
        const option = document.createElement("option");
        option.value = index;
        option.textContent = recipe.name;
        forgetRecipeSelect.appendChild(option);
    });
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
    alert("Receta olvidada con éxito.");
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
// Generar los desplegables para seleccionar materiales
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
    renderInventory(); // Renderizar el inventario
    renderInventoryTable(); // Renderizar la tabla de inventario
    renderRecipeBook(); // Renderizar el recetario completo
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
        renderInventory();
        renderInventoryTable();
        renderRecipeBook(); // Asegurar que se renderiza correctamente
    } else {
        // Fallo en la creación
        alert(`Fallaste en la creación de la poción. Ingredientes usados: ${selectedItems.join(", ")}`);
        if (roll >= 95) {
            emptyBottles--;
            alert("¡La botella también se rompió!");
        }
        saveInventory();
        renderInventory();
        renderInventoryTable();
    }

    updateBottleCount();
});

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    updateBottleCount();
});
