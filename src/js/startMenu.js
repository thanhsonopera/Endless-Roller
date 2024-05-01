var btnPlay = document.getElementById("btnPlay");
var btnQuit = document.getElementById("btnQuit");
var btnLeaderboard = document.getElementById("btnLeaderboard");
btnPlay.onclick = function () {
    const playerName = document.getElementById("player-name").value;
    const encodePlayerName = btoa(playerName);
    const url = `game.html?playerName=${encodePlayerName}`;
    window.location.href = url;
    // console.log("chon chon");
    // window.location.href = "/game.html";
};

btnQuit.onclick = function () {
    if (confirm("Bạn có muốn đóng tab này không?")) {
        alert("Tự tắt đi =))");
    }
};

btnLeaderboard.onclick = function () {
    window.location.href = "/leaderboard.html";
};
