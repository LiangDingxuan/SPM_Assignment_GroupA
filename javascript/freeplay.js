// Toggle popup for difficulty setting
function togglePopup(popupid) {
  document.getElementById(popupid).classList.toggle("active");
}

// Class representing a building
class Building {
  constructor(buildingType) {
    this.buildingType = buildingType;
    this.image = this.getImage();
  }

  // Method to get the image based on the building type
  getImage() {
    const images = {
      Residential: "images/residential.jpg",
      Industry: "images/industry.png",
      Commercial: "images/commercial.jpeg",
      Park: "images/park.jpg",
      Road: "images/road.jpg",
    };
    return images[this.buildingType] || "";
  }
}

// Class representing the city grid
class City {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(" "));
    this.coins = Infinity;
    this.turnNumber = 0;
    this.selectedBuilding = null;
    this.demolishMode = false;
    this.updateInfo();
  }

  // Method to update the game information on the UI
  updateInfo() {
    document.getElementById("coins").textContent = `Coins: ${this.coins}`;
    document.getElementById("turn").textContent = `Turn: ${this.turnNumber}`;
  }

  // Method to display the city grid
  display() {
    const gridContainer = document.getElementById("city-grid");
    gridContainer.style.gridTemplateColumns = `repeat(${this.size}, 30px)`;
    gridContainer.innerHTML = "";
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        if (this.grid[i][j] !== " ") {
          const img = document.createElement("img");
          img.src = this.grid[i][j].image;
          img.alt = this.grid[i][j].buildingType;
          cell.appendChild(img);
        }
        cell.dataset.x = i;
        cell.dataset.y = j;
        cell.addEventListener("click", () => this.handleCellClick(i, j));
        gridContainer.appendChild(cell);
      }
    }
  }

  // Method to handle cell click events
  handleCellClick(x, y) {
    if (this.demolishMode) {
      this.demolishBuilding(x, y);
      this.demolishMode = false;
      this.updateInfo();
      this.display();
    } else if (this.selectedBuilding) {
      const building = new Building(this.selectedBuilding);
      this.placeBuilding(building, x, y);
    } else if (!this.demolishMode) {
      alert("Please select a building type first.");
    }
  }

  // Method to place a building on the grid
  placeBuilding(building, x, y) {
    if (this.isValidPlacement(x, y)) {
      this.grid[x][y] = building;
      this.turnNumber += 1;
      this.updateInfo();
      this.display();
      this.selectedBuilding = null;
      if (this.isEdge(x, y)) {
        this.expandGrid();
      }
    } else {
      alert(
        "Invalid placement. Buildings must be placed adjacent to existing buildings."
      );
    }
  }

  // Method to check if the placement of a building is valid
  isValidPlacement(x, y) {
    if (
      x < 0 ||
      x >= this.size ||
      y < 0 ||
      y >= this.size ||
      this.grid[x][y] !== " "
    ) {
      return false;
    }
    return true; // Allow placement anywhere if the cell is empty
  }

  // Method to check if a cell is at the edge of the grid
  isEdge(x, y) {
    return x === 0 || y === 0 || x === this.size - 1 || y === this.size - 1;
  }

  // Method to expand the grid size
  expandGrid() {
    if (this.size < 25) {
      const oldSize = this.size;
      this.size = Math.min(this.size + 10, 25);
      const newGrid = Array.from({ length: this.size }, () =>
        Array(this.size).fill(" ")
      );

      const offset = Math.floor((this.size - oldSize) / 2);

      for (let i = 0; i < oldSize; i++) {
        for (let j = 0; j < oldSize; j++) {
          newGrid[i + offset][j + offset] = this.grid[i][j];
        }
      }
      this.grid = newGrid;
      this.display();
    }
  }

  // Method to demolish a building on the grid
  demolishBuilding(x, y) {
    if (this.coins > 0 && this.grid[x][y] !== " ") {
      this.grid[x][y] = " ";
      this.updateInfo();
      this.display();
    } else {
      if (this.coins <= 0) {
        alert("Cannot demolish. You have no coins left.");
      } else {
        alert("Cannot demolish. No building is present.");
      }
    }
  }

  // Method to check if the coordinates are within the bounds of the grid
  isInBounds(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  // Method to check if the game is over
  isGameOver() {
    return this.coins <= 0 || this.isBoardFull();
  }

  // Method to check if the board is full
  isBoardFull() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] === " ") {
          return false;
        }
      }
    }
    return true;
  }

  // Method to display the final score
  displayFinalScore() {
    alert(`Game Over! Your final score is: ${this.turnNumber}`);
  }
}

// Function to enable demolish mode
function demolish() {
  currentCity.demolishMode = true;
}

let currentCity;

// Function to start a new game
function startNewGame(size) {
  currentCity = new City(size);
  currentCity.display();
}

// Function to select a building type
function selectBuildingType(index) {
  currentCity.selectedBuilding = index;
}

// Function to return to the main menu
function returnToMenu() {
  window.location.href = "index.html";
}

// Function to save the current game state
function saveGame() {
  const saveName = prompt("Enter a name for your save file:");
  if (!saveName) return; // If the user cancels the prompt

  const gameState = {
    mode: "freeplay",
    size: currentCity.size,
    grid: currentCity.grid,
    coins: currentCity.coins,
    turnNumber: currentCity.turnNumber,
    selectedBuilding: currentCity.selectedBuilding,
  };

  localStorage.setItem(
    `cityBuildingGame_${saveName}`,
    JSON.stringify(gameState)
  );
  alert(`Game saved as "${saveName}"`);
}

// Function to load a saved game
function loadGame(saveName) {
  const savedGame = localStorage.getItem(`cityBuildingGame_${saveName}`);
  if (!savedGame) {
    alert(`No saved game found with the name "${saveName}"`);
    return;
  }

  const gameState = JSON.parse(savedGame);

  currentCity = new City(gameState.size);
  currentCity.grid = gameState.grid;
  currentCity.coins = Infinity;
  currentCity.turnNumber = gameState.turnNumber;
  currentCity.selectedBuilding = gameState.selectedBuilding;
  currentCity.updateInfo();
  currentCity.display();
}

// Function to display high scores
function displayHighScores() {
  // Placeholder for high scores display logic
  alert("High scores display functionality not implemented yet.");
}

// Function to exit the game
function exitGame() {
  // Placeholder for exit game logic
  alert("Exit game functionality not implemented yet.");
}

// Check if there's a load parameter in the URL and load the game
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const loadSaveName = urlParams.get("load");
  if (loadSaveName) {
    const savedGame = localStorage.getItem(`cityBuildingGame_${loadSaveName}`);
    if (savedGame) {
      loadGame(loadSaveName);
    } else {
      alert(
        `No saved game found with the name "${loadSaveName}". Returning to the main menu.`
      );
      window.location.href = "index.html"; // Redirect to main menu if save file doesn't exist
    }
  }
};
