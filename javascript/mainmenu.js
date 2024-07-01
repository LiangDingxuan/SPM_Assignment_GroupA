// Toggle popup for difficulty setting
function togglePopup(popupid) {
    document.getElementById(popupid).classList.toggle("active");
}

function loadSavedGame() {
    const saveName = prompt("Enter the name of your saved game:");
    if (saveName) {
        const savedGame = localStorage.getItem(`cityBuildingGame_${saveName}`);
        if (savedGame) {
            window.location.href = `arcade.html?load=${saveName}`;
        } else {
            alert(`No saved game found with the name "${saveName}".`);
        }
    }
}

function displayHighScores() {
    // Placeholder for high scores display logic
    alert("High scores display functionality not implemented yet.");
}

function exitGame() {
    // Placeholder for exit game logic
    alert("Exit game functionality not implemented yet.");
}
