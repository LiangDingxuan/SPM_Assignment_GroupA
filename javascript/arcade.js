const arcadeApiUrl = "https://spmassignment-26ad.restdb.io/rest/arcadescore";
const apiKey = "66a01ceabcd2edd04c50bed0";

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
    // Initialize city grid and game state
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(" "));
    this.coins = 16;
    this.turnNumber = 0;
    this.score = 0;
    this.selectedBuilding = null;
    this.availableBuildings = [];
    this.demolishMode = false;
    this.updateInfo();
    this.displayAvailableBuildings();
  }

  // Method to update the game information on the UI
  updateInfo() {
    document.getElementById("coins").textContent = `Coins: ${this.coins}`;
    document.getElementById("turn").textContent = `Turn: ${this.turnNumber}`;
    document.getElementById("score").textContent = `Score: ${this.score}`;
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
      this.coins -= 1;
      this.turnNumber += 1;
      this.updateScoreAndCoins();
      this.updateInfo();
      this.display();
      this.displayAvailableBuildings();
      this.selectedBuilding = null;
      if (this.isGameOver()) {
        this.displayFinalScore();
      }
    } else {
      alert(
        "Invalid placement. Buildings must be placed adjacent to existing buildings."
      );
    }
  }

  // Method to check if the placement of a building is valid
  isValidPlacement(x, y) {
    let validPlacement = false;

    if (
      x < 0 ||
      x >= this.size ||
      y < 0 ||
      y >= this.size ||
      this.grid[x][y] !== " "
    ) {
      return false;
    }

    // Check if the grid is empty
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
      // Check for adjacent cells
      if (this.turnNumber === 0) {
        validPlacement = true;
      } else {
        validPlacement =
          (x > 0 && this.grid[x - 1][y] !== " ") ||
          (x < this.size - 1 && this.grid[x + 1][y] !== " ") ||
          (y > 0 && this.grid[x][y - 1] !== " ") ||
          (y < this.size - 1 && this.grid[x][y + 1] !== " ");
      }
    }

    return validPlacement;
  }

  // Method to demolish a building on the grid
  demolishBuilding(x, y) {
    if (this.coins > 0 && this.grid[x][y] !== " ") {
      this.grid[x][y] = " ";
      this.coins -= 1;
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

  // Method to update the score and coins
  updateScoreAndCoins() {
    this.score = 0;
    let industryCount = 0;
    let roadSet = new Set(); // Initialize the set for tracking roads

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const building = this.grid[i][j];
        if (building !== " ") {
          if (building.buildingType === "Residential") {
            this.score += this.calculateResidentialScore(i, j);
          } else if (building.buildingType === "Industry") {
            this.score += 1;
            industryCount += 1;
          } else if (building.buildingType === "Commercial") {
            this.score += this.calculateCommercialScore(i, j);
          } else if (building.buildingType === "Park") {
            this.score += this.calculateParkScore(i, j);
          } else if (building.buildingType === "Road") {
            this.score += this.calculateRoadScore(i, j, roadSet);
          }
        }
      }
    }
    this.coins += this.calculateIndustryCoins(industryCount);
  }

  // Method to calculate the score for residential buildings
  calculateResidentialScore(x, y) {
    let score = 0;
    const adjacentPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [adjX, adjY] of adjacentPositions) {
      if (this.isInBounds(adjX, adjY)) {
        const adjBuilding = this.grid[adjX][adjY];
        if (adjBuilding.buildingType === "Industry") {
          return 1;
        } else if (
          adjBuilding.buildingType === "Residential" ||
          adjBuilding.buildingType === "Commercial"
        ) {
          score += 1;
        } else if (adjBuilding.buildingType === "Park") {
          score += 2;
        }
      }
    }
    return score;
  }

  // Method to calculate the score for commercial buildings
  calculateCommercialScore(x, y) {
    let score = 0;
    const adjacentPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [adjX, adjY] of adjacentPositions) {
      if (this.isInBounds(adjX, adjY)) {
        const adjBuilding = this.grid[adjX][adjY];
        if (adjBuilding.buildingType === "Commercial") {
          score += 1;
        } else if (adjBuilding.buildingType === "Residential") {
          this.coins += 1;
        }
      }
    }
    return score;
  }

  // Method to calculate the score for park buildings
  calculateParkScore(x, y) {
    let score = 0;
    const adjacentPositions = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
    for (const [adjX, adjY] of adjacentPositions) {
      if (this.isInBounds(adjX, adjY)) {
        const adjBuilding = this.grid[adjX][adjY];
        if (adjBuilding.buildingType === "Park") {
          score += 1;
        }
      }
    }
    return score;
  }

  // Method to calculate the score for road buildings
  calculateRoadScore(x, y, roadSet) {
    let score = 0;
    const adjacentPositions = [
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [adjX, adjY] of adjacentPositions) {
      if (
        this.isInBounds(adjX, adjY) &&
        this.grid[adjX][adjY].buildingType === "Road"
      ) {
        const road = `${adjX},${adjY}`;
        if (!roadSet.has(road)) {
          score += 1;
          roadSet.add(road);
        }
      }
    }

    return score;
  }

  // Method to calculate the coins generated by industry buildings
  calculateIndustryCoins(industryCount) {
    let coins = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const building = this.grid[i][j];
        if (building !== " " && building.buildingType === "Residential") {
          const adjacentPositions = [
            [i - 1, j],
            [i + 1, j],
            [i, j - 1],
            [i, j + 1],
          ];
          for (const [adjX, adjY] of adjacentPositions) {
            if (
              this.isInBounds(adjX, adjY) &&
              this.grid[adjX][adjY].buildingType === "Industry"
            ) {
              coins += 1;
            }
          }
        }
      }
    }
    return coins;
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

  // Method to display the final score and check for high score
  displayFinalScore() {
    alert(`Game Over! Your final score is: ${this.score}`);
    this.checkAndUpdateHighScore();
  }

  // Method to check and update high score
  async checkAndUpdateHighScore() {
    if (await isHighScore(this.score)) {
      const playerName = prompt(
        "Congratulations! You made it to the high score list. Enter your name:"
      );
      if (playerName) {
        await updateHighScores(playerName, this.score);
        alert("High score list updated!");
        window.location.href = "index.html"; // Navigate back to index.html after updating high scores
      } else {
        alert("Name entry cancelled. High score list not updated.");
      }
    } else {
      alert("You did not make it to the high score list.");
    }
  }

  // Method to display the available buildings
  displayAvailableBuildings() {
    const buildingTypes = [
      "Residential",
      "Industry",
      "Commercial",
      "Park",
      "Road",
    ];
    this.availableBuildings = [];
    while (this.availableBuildings.length < 2) {
      const randomBuilding =
        buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
      if (!this.availableBuildings.includes(randomBuilding)) {
        this.availableBuildings.push(randomBuilding);
      }
    }
    document.getElementById("building-btn-1").textContent =
      this.availableBuildings[0];
    document.getElementById("building-btn-2").textContent =
      this.availableBuildings[1];
  }
}
// Function to fetch high scores from the RestDB
async function fetchHighScores(url) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  });
  return response.json();
}

// Function to check if the current score is a high score
async function isHighScore(score) {
  const arcadeScores = await fetchHighScores(arcadeApiUrl);
  arcadeScores.sort((a, b) => b.score - a.score);
  if (
    arcadeScores.length < 10 ||
    score > arcadeScores[arcadeScores.length - 1].score
  ) {
    return true;
  }
  return false;
}

// Function to update high scores in the RestDB
async function updateHighScores(name, score) {
  const arcadeScores = await fetchHighScores(arcadeApiUrl);
  arcadeScores.sort((a, b) => b.score - a.score);

  if (arcadeScores.length >= 10) {
    // Remove the lowest score if there are already 10 scores
    const lowestScore = arcadeScores.pop();
    await fetch(`${arcadeApiUrl}/${lowestScore._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
      },
    });
  }

  // Add the new score
  const newScore = { name, score };
  await fetch(arcadeApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
    body: JSON.stringify(newScore),
  });
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
  currentCity.selectedBuilding = currentCity.availableBuildings[index];
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
    size: currentCity.size,
    grid: currentCity.grid,
    coins: currentCity.coins,
    turnNumber: currentCity.turnNumber,
    score: currentCity.score,
    selectedBuilding: currentCity.selectedBuilding,
    availableBuildings: currentCity.availableBuildings,
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
  currentCity.coins = gameState.coins;
  currentCity.turnNumber = gameState.turnNumber;
  currentCity.score = gameState.score;
  currentCity.selectedBuilding = gameState.selectedBuilding;
  currentCity.availableBuildings = gameState.availableBuildings;

  currentCity.updateInfo();
  currentCity.display();
  currentCity.displayAvailableBuildings();
}

// Function to prompt and load a saved game
function loadSavedGame() {
  const saveName = prompt("Enter the name of your saved game:");
  if (saveName) {
    window.location.href = `arcade.html?load=${saveName}`;
  }
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
