const arcadeApiUrl = "https://spmassignment-26ad.restdb.io/rest/arcadescore";
const freeplayApiUrl =
  "https://spmassignment-26ad.restdb.io/rest/freeplayscore";
const apiKey = "66a01ceabcd2edd04c50bed0";

async function fetchHighScores(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
    },
  });
  const data = await response.json();
  return data;
}

function displayScores(scores, elementId) {
  const listElement = document.getElementById(elementId);
  listElement.innerHTML = "";
  scores.slice(0, 10).forEach((score, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${score.name}: ${score.score}`;
    listElement.appendChild(listItem);
  });
}

async function loadHighScores() {
  try {
    const [arcadeScores, freeplayScores] = await Promise.all([
      fetchHighScores(arcadeApiUrl),
      fetchHighScores(freeplayApiUrl),
    ]);

    arcadeScores.sort((a, b) => b.score - a.score);
    freeplayScores.sort((a, b) => b.score - a.score);

    displayScores(arcadeScores, "arcade-list");
    displayScores(freeplayScores, "freeplay-list");
  } catch (error) {
    console.error("Error fetching high scores:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadHighScores);

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

  loadHighScores(); // Reload the high scores to display the updated list
}

// Function to return to the main menu
function returnToMenu() {
  window.location.href = "index.html";
}
