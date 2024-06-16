document.addEventListener("DOMContentLoaded", function() {
    const grid = document.querySelector('.grid');
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        grid.appendChild(cell);
    }

    // Özel hücrelerin numaraları
    const specialCells = [0,1,2,3,4,8,12];

    for (let i = 0; i < 16; i++) {
        if (specialCells.includes(i)) {
            grid.children[i].classList.add('special-cell');
        }
    }
    document.querySelector('.grid').children[0].innerHTML = "<img src='images/const/logo.png' alt='Logo'>";
    document.querySelector('.grid').children[1].innerHTML = "<img src='images/hmm/netherlands.png' alt='Nation1'>";
    document.querySelector('.grid').children[2].innerHTML = "<img src='images/hmm/france.png' alt='Nation2'>";
    document.querySelector('.grid').children[3].innerHTML = "<img src='images/hmm/portugal.png' alt='Nation3'>";
    document.querySelector('.grid').children[4].innerHTML = "<img src='images/hmm/fenerbahce.png' alt='Team1'>";
    document.querySelector('.grid').children[8].innerHTML = "<img src='images/hmm/galatasaray.png' alt='Team2'>";
    document.querySelector('.grid').children[12].innerHTML = "<img src='images/hmm/besiktas.png' alt='Team3'>";

    document.getElementById("predictionInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            submitPrediction();
        }
    });

    // Modal penceresi açılışı
    var modal = document.getElementById("tutorialModal");
    var closeButton = document.querySelector(".close-button");
    var startButton = document.getElementById("startButton");

    // Modal aç
    modal.style.display = "block";

    // Modal kapat butonuna tıklayınca kapat
    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Başla butonuna tıklayınca kapat
    startButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Modal dışında bir yere tıklanınca kapat
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
});

var cellLocked = new Array(16).fill(false);

function submitPrediction() {
    var kontrol = false;
    for (let index = 0; index < cellLocked.length; index++) {
        if(kontrol==false)
            check(index);
    }
    document.getElementById("predictionInput").value = "";
}

function check(index){
    if(cellLocked[index]){
        return;
    }

    var predictionInput = document.getElementById("predictionInput").value;
    console.log("Tahmin: " + predictionInput);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var xmlDoc = xhr.responseXML;
            var predictions = xmlDoc.getElementsByTagName("prediction"+index);
            for (var i = 0; i < predictions.length; i++) {
                var keywords = predictions[i].getElementsByTagName("keywords")[0].getElementsByTagName("keyword");
                var imageURL = predictions[i].getElementsByTagName("imageURL")[0].childNodes[0].nodeValue;
                for (var j = 0; j < keywords.length; j++) {
                    var keyword = keywords[j].childNodes[0].nodeValue;
                    if (predictionInput.toLowerCase() === keyword.toLowerCase()) {
                        document.querySelector('.grid').children[index].innerHTML = "<img src='" + imageURL + "' alt='" + predictionInput + " Görseli'>";
                        kontrol = true;
                        cellLocked[index] = true;
                        return;
                    }
                }
            }
        }
    };
    xhr.open("GET", "predictions.xml", true);
    xhr.send();
}
