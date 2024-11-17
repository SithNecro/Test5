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

// Renderizar inventario
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
        };
        li.appendChild(removeButton);
        inventoryList.appendChild(li);
    });
}

// Inicializar materiales
function initializeMaterialDropdown() {
    const materialSelect = document.getElementById("material-select");
    [...ingredients, ...monsterParts].forEach(material => {
        const option = document.createElement("option");
        option.value = material;
        option.textContent = material;
        materialSelect.appendChild(option);
    });
}

// Renderizar recetario
function renderRecipeBook() {
    const recipeBook = document.getElementById("recipe-book");
    const forgetRecipeSelect = document.getElementById("forget-recipe-select");

    recipeBook.innerHTML = "";
    forgetRecipeSelect.innerHTML = "<option value=''>Seleccione una receta</option>";

    recipes.forEach((recipe, index) => {
        const li = document.createElement("li");
        li.textContent = `${recipe.name} (${recipe.type}): ${recipe.ingredients.join(", ")}`;
        recipeBook.appendChild(li);

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
    alert("Receta olvidada con �xito.");
});

// Crear poci�n (Aqu� ya est� la l�gica previamente implementada)

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
    initializeMaterialDropdown();
    renderInventory();
    renderRecipeBook();
    generatePotionSelectors("basic");
});
