class Building {
  constructor(buildingType) {
    this.buildingType = buildingType;
    this.image = this.getImage();
  }

  // Retrieves the image based on the building type
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

class City {
  constructor(size) {
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(" "));
    this.coins = Infinity; // Unlimited coins for Free Play mode
    this.turnNumber = 0;
    this.score = 0;
    this.profit = 0;
    this.upkeep = 0;
    this.lossStreak = 0;
    this.selectedBuilding = null;
    this.demolishMode = false;
    this.updateInfo();
  }

  // Updates the displayed information about the city
  updateInfo() {
    document.getElementById("coins").textContent = `Coins: ∞`;
    document.getElementById("turn").textContent = `Turn: ${this.turnNumber}`;
    document.getElementById("score").textContent = `Score: ${this.score}`;
    document.getElementById("profit").textContent = `Profit: ${this.profit}`;
    document.getElementById("upkeep").textContent = `Upkeep: ${this.upkeep}`;
  }

  // Displays the city grid
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

  // Handles cell click events
  handleCellClick(x, y) {
    if (this.demolishMode) {
      this.demolishBuilding(x, y);
      this.demolishMode = false;
      this.updateInfo();
      this.display();
    } else if (this.selectedBuilding) {
      const building = new Building(this.selectedBuilding);
      this.placeBuilding(building, x, y);
    } else {
      alert("Please select a building type first.");
    }
  }

  // Places a building on the grid
  placeBuilding(building, x, y) {
    if (this.isValidPlacement(x, y)) {
      this.grid[x][y] = building;
      this.turnNumber += 1;
      this.expandGridIfNeeded(x, y);
      this.display();
      this.selectedBuilding = null;
    } else {
      alert("Invalid placement. Buildings must be placed adjacent to existing buildings.");
    }
  }

  // Expands the grid if a building is placed on the border
  expandGridIfNeeded(x, y) {
    if (x === 0 || y === 0 || x === this.size - 1 || y === this.size - 1) {
      this.size += 10;
      const newGrid = Array.from({ length: this.size }, () => Array(this.size).fill(" "));
      for (let i = 0; i < this.grid.length; i++) {
        for (let j = 0; j < this.grid[i].length; j++) {
          newGrid[i + 5][j + 5] = this.grid[i][j];
        }
      }
      this.grid = newGrid;
    }
  }

  // Checks if the placement of a building is valid
  isValidPlacement(x, y) {
    let validPlacement = false;

    if (x < 0 || x >= this.size || y < 0 || y >= this.size || this.grid[x][y] !== " ") {
      return false;
    }

    let gridIsEmpty = true;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j] !== " ") {
          gridIsEmpty = false;
          break;
        }
      }
    }

    if (gridIsEmpty) {
      validPlacement = true;
    } else {
      validPlacement = (x > 0 && this.grid[x - 1][y] !== " ") ||
                       (x < this.size - 1 && this.grid[x + 1][y] !== " ") ||
                       (y > 0 && this.grid[x][y - 1] !== " ") ||
                       (y < this.size - 1 && this.grid[x][y + 1] !== " ");
    }

    return validPlacement;
  }


}

let city = null;

// Starts a new game with the specified grid size (default is 5x5)
function startNewGame(size = 5) {
  city = new City(size);
  city.display();
}

// Sets the selected building type for placement
function selectBuildingType(type) {
  city.selectedBuilding = type;
}

// Activates demolish mode
function demolish() {
  city.demolishMode = true;
}

// Returns to the main menu
function returnToMenu() {
  window.location.href = "./index.html";
}

// Saves the current game
function saveGame() {
  city.saveGame();
}

// Loads a saved game by name
function loadGame(saveName) {
  city.loadGame(saveName);
}
//bob