function rollDice(sides) {
    const diceImage = document.getElementById("dice-image");
    let currentSide = 1;
    let maxSide = sides;
    let rollDuration = 2000;  // Duración de la "animación"
    let interval = 100;  // Intervalo entre los cambios de imagen

    let rollInterval = setInterval(() => {
        // Mostrar caras al azar durante la animación
        currentSide = Math.floor(Math.random() * maxSide) + 1;

        // Formatear el nombre de la imagen correctamente según el número de lados
        let formattedSide = currentSide.toString().padStart(2, '0'); // para D10 y D20
        if (sides === 6) {
            diceImage.src = `img/dados/D6-${currentSide}.png`;
        } else if (sides === 10) {
            diceImage.src = `img/dados/D10-${formattedSide}.png`;
        } else if (sides === 20) {
            diceImage.src = `img/dados/D20-${formattedSide}.png`;
        }
    }, interval);

    // Detener la animación después de `rollDuration` ms y mostrar el resultado final
    setTimeout(() => {
        clearInterval(rollInterval);

        // Obtener un valor final aleatorio
        let finalSide = Math.floor(Math.random() * maxSide) + 1;
        let formattedFinalSide = finalSide.toString().padStart(2, '0');

        // Mostrar la cara final del dado
        if (sides === 6) {
            diceImage.src = `img/dados/D6-${finalSide}.png`;
        } else if (sides === 10) {
            diceImage.src = `img/dados/D10-${formattedFinalSide}.png`;
        } else if (sides === 20) {
            diceImage.src = `img/dados/D20-${formattedFinalSide}.png`;
        }
    }, rollDuration);
}