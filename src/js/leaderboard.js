async function fetchPlayers() {
    try {
        const response = await fetch("https://buffalo-perfect-evidently.ngrok-free.app/allScores", {
            headers: {
                "ngrok-skip-browser-warning": "123456", // Skip
                "Content-Type": "application/json", // Set default headers for all requests
                // Add any authentication headers
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch player data");
        }
        const data = await response.json();
        console.log("Player data fetched:", data.scores);
        return data.scores;
    } catch (error) {
        console.error("Error fetching player data:", error);
        return [];
    }
}

async function createLeaderboard() {
    const players = await fetchPlayers();
    const leaderboard = document.createElement("div");

    for (const player of players) {
        const item = document.createElement("div");
        item.className = "item font-pixel";
        const playerName = document.createElement("div");
        playerName.className = "player";
        playerName.textContent = player.playerName;
        item.appendChild(playerName);
        const playerScore = document.createElement("div");
        playerScore.className = "score";
        playerScore.textContent = "Score:  " + player.score;
        item.appendChild(playerScore);

        leaderboard.appendChild(item);
    }

    return leaderboard;
}

// Add leaderboard to body
const myDiv = document.getElementById("list");

createLeaderboard()
    .then((leaderboard) => {
        myDiv.appendChild(leaderboard);
    })
    .catch((error) => {
        console.error("Error creating leaderboard:", error);
    });

const btnBack = document.getElementById("btnBack");
btnBack.onclick = function () {
    window.location.href = "index.html";
};
