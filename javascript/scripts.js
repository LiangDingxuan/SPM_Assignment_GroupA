// Toggle popup for difficulty setting
function togglePopup(popupid) {
    document.getElementById(popupid).classList.toggle("active");
}

class Building {
    constructor(buildingType) {
        this.buildingType = buildingType;
        this.symbol = this.getSymbol();
        this.image = this.getImage();
    }

    getSymbol() {
        const symbols = {
            'Residential': 'R',
            'Industry': 'I',
            'Commercial': 'C',
            'Park': 'P',
            'Road': '*'
        };
        return symbols[this.buildingType] || '?';
    }

    getImage() {
        const images = {
            'Residential': 'images/residential.jpg',
            'Industry': 'images/industry.png',
            'Commercial': 'images/commercial.jpeg',
            'Park': 'images/park.jpg',
            'Road': 'images/road.jpg'
        };
        return images[this.buildingType] || '';
    }
}

class City {
    constructor(size) {
        this.size = size;
        this.grid = Array.from({ length: size }, () => Array(size).fill(' '));
        this.coins = (size === 20) ? 20 :
        (size === 10) ? 16 :
        (size === 7) ? 12 :
        (size === 5) ? 8 : 
        Infinity;
        this.turnNumber = 0;
        this.score = 0;
        this.selectedBuilding = null;
        this.availableBuildings = [];
        this.updateInfo();
        this.displayAvailableBuildings();
    }

    updateInfo() {
        document.getElementById('coins').textContent = `Coins: ${this.coins}`;
        document.getElementById('turn').textContent = `Turn: ${this.turnNumber}`;
        document.getElementById('score').textContent = `Score: ${this.score}`;
    }

    display() {
        const gridContainer = document.getElementById('city-grid');
        gridContainer.style.gridTemplateColumns = `repeat(${this.size}, 30px)`;
        gridContainer.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if (this.grid[i][j] !== ' ') {
                    const img = document.createElement('img');
                    img.src = this.grid[i][j].image;
                    img.alt = this.grid[i][j].buildingType;
                    cell.appendChild(img);
                }
                cell.dataset.x = i;
                cell.dataset.y = j;
                cell.addEventListener('click', () => this.handleCellClick(i, j));
                gridContainer.appendChild(cell);
            }
        }
    }

    handleCellClick(x, y) {
        if (this.selectedBuilding) {
            const building = new Building(this.selectedBuilding);
            this.placeBuilding(building, x, y);
        } else {
            alert("Please select a building type first.");
        }
    }

    placeBuilding(building, x, y) {
        if (this.isValidPlacement(x, y)) {
            this.grid[x][y] = building;
            this.coins -= 1;
            this.turnNumber += 1;
            this.updateScore();
            this.updateInfo();
            this.display();
            this.displayAvailableBuildings();
            this.selectedBuilding = null;
        } else {
            alert("Invalid placement. Buildings must be placed adjacent to existing buildings.");
        }
    }

    isValidPlacement(x, y) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.size || this.grid[x][y] !== ' ') {
            return false;
        }
        if (this.turnNumber === 0) {
            return true;
        }
        return (
            (x > 0 && this.grid[x - 1][y] !== ' ') ||
            (x < this.size - 1 && this.grid[x + 1][y] !== ' ') ||
            (y > 0 && this.grid[x][y - 1] !== ' ') ||
            (y < this.size - 1 && this.grid[x][y + 1] !== ' ')
        );
    }

    updateScore() {
        // Placeholder for score calculation logic
        this.score += 1;
    }

    displayAvailableBuildings() {
        const buildingTypes = ['Residential', 'Industry', 'Commercial', 'Park', 'Road'];
        this.availableBuildings = [];
        while (this.availableBuildings.length < 2) {
            const randomBuilding = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
            if (!this.availableBuildings.includes(randomBuilding)) {
                this.availableBuildings.push(randomBuilding);
            }
        }
        document.getElementById('building-btn-1').textContent = this.availableBuildings[0];
        document.getElementById('building-btn-2').textContent = this.availableBuildings[1];
    }
}

let currentCity;

function startNewGame(size) {
    currentCity = new City(size);
    currentCity.display();
}

function selectBuildingType(index) {
    currentCity.selectedBuilding = currentCity.availableBuildings[index];
}

function returnToMenu() {
    window.location.href = 'index.html';
}

function saveGame() {
    // Placeholder for save game logic
    alert("Save game functionality not implemented yet.");
}

function loadSavedGame() {
    // Placeholder for load game logic
    alert("Load game functionality not implemented yet.");
}

function displayHighScores() {
    // Placeholder for high scores display logic
    alert("High scores display functionality not implemented yet.");
}

function exitGame() {
    // Placeholder for exit game logic
    alert("Exit game functionality not implemented yet.");
}
