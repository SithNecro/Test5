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

// Renderizar inventario como tabla
function renderInventoryTable() {
    const tbody = document.querySelector("#inventory-table tbody");
    tbody.innerHTML = "";
    inventory.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.units}</td>
            <td>${item.exquisite ? "Sí" : "No"}</td>
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