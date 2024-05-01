var btnPlay = document.getElementById("btnPlay");
var btnQuit = document.getElementById("btnQuit");
var btnLeaderboard = document.getElementById("btnLeaderboard");
btnPlay.onclick = function () {
    console.log("chon chon");
    window.location.href = "/game.html";
};

btnQuit.onclick = function () {
    if (confirm("Bạn có muốn đóng tab này không?")) {
        alert("Tự tắt đi =))");
    }
}

btnLeaderboard.onclick = function () {
    window.location.href = "/leaderboard.html";
}
