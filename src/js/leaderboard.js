function createLeaderboard(players) {
    const leaderboard = document.createElement('div');

    for (const player of players) {
      const item = document.createElement('div');
      item.className = 'item font-pixel';
      const playerName = document.createElement('div');
      playerName.className = 'player';
      playerName.textContent = player.name;
      item.appendChild(playerName);
      // const textScore = document.createElement('div');
      // textScore.textContent = 'Score:';
      // item.appendChild(textScore);
      const playerScore = document.createElement('div');
      playerScore.className = 'score';
      playerScore.textContent = 'Score:  '+ player.score;
      item.appendChild(playerScore);
  
      leaderboard.appendChild(item);
    }
  
    return leaderboard;
  }
  // Create leaderboard items 
  const players = [
      { name: 'Player 1', score: 100 },
      { name: 'Player 2', score: 90 },
      { name: 'Player 3', score: 80 },
      { name: 'Player 3', score: 80 },
      { name: 'Player 3', score: 80 },
      // Add more players as needed
    ];
  // Add leaderboard to body
const myDiv = document.getElementById('list');
myDiv.appendChild(createLeaderboard(players));

const btnBack = document.getElementById('btnBack');
btnBack.onclick = function() {
  window.location.href = 'index.html';
}
