var element1 = document.getElementById("boder-selected1");
var element2 = document.getElementById("boder-selected2");
var element3 = document.getElementById("boder-selected3");
var play = document.getElementById("play");
var selected = -1;
element1.onclick = function () {
    selected = 0;
    this.style.border = "3px solid #008000";
    element2.style.border = "3px solid #000000";
    element3.style.border = "3px solid #000000";
};

element2.onclick = function () {
    selected = 1;
    this.style.border = "3px solid #008000";
    element1.style.border = "3px solid #000000";
    element3.style.border = "3px solid #000000";
};
element3.onclick = function () {
    selected = 2;
    this.style.border = "3px solid #008000";
    element1.style.border = "3px solid #000000";
    element2.style.border = "3px solid #000000";
};
play.onclick = function () {
    window.selected = selected == -1 ? 0 : selected;
    element1.style.display = "none";
    element2.style.display = "none";
    element3.style.display = "none";
    play.style.display = "none";
    document.getElementById("health").style.display = "block";
    document.getElementById("high-score").style.display = "block";
    document.getElementById("choose-skin").style.display = "none";
};
