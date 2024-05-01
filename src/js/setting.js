var popup = document.getElementById('popup');
var countdownElement = document.getElementById('countdown');

var countdownValue = 10;

document.getElementById("btnBack").onclick = function () {
    window.location.href = "index.html";
};
document.getElementById("btnSaveSetting").onclick = function () {
    var selectElement = document.getElementById('music-select');
    var selectedOption = selectElement.value;
    console.log(selectedOption);
    var sliderElement = document.getElementById('myRange');
    var sliderValue = sliderElement.value;
    console.log(sliderValue);
    popup.style.display = 'block';
    var countdownInterval = setInterval(function() {
        countdownValue--;
        countdownElement.textContent = countdownValue;
        if (countdownValue <= 0) {
          clearInterval(countdownInterval);
          popup.style.display = 'none';
        }
      }, 1000);
}



