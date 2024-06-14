document.addEventListener("DOMContentLoaded", function() {
    const grid = document.querySelector('.grid');
    for(let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        grid.appendChild(cell);
    }
    document.querySelector('.grid').children[0].innerHTML = "<img src='images/const/logo.png' alt='Logo'>";
    document.querySelector('.grid').children[1].innerHTML = "<img src='images/hmm/netherlands.png' alt='Nation1'>";
    document.querySelector('.grid').children[2].innerHTML = "<img src='images/hmm/france.png' alt='Nation2'>";
    document.querySelector('.grid').children[3].innerHTML = "<img src='images/hmm/portugal.png' alt='Nation3'>";
    document.querySelector('.grid').children[4].innerHTML = "<img src='images/hmm/fenerbahce.png' alt='Team1'>";
    document.querySelector('.grid').children[8].innerHTML = "<img src='images/hmm/galatasaray.png' alt='Team2'>";
    document.querySelector('.grid').children[12].innerHTML = "<img src='images/hmm/besiktas.png' alt='Team3'>";
    // Enter tuşuna basıldığında submit işlemi gerçekleştirilsin
    document.getElementById("predictionInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            submitPrediction();
        }
    });
});
var cellLocked = new Array(16).fill(false);

function submitPrediction() {
    for (let index = 0; index < cellLocked.length; index++) {
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
            
    // XML dosyasından veri çekme
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
                    if (predictionInput.toLowerCase() === keyword) {
                        // Tahmin doğruysa, XML'den alınan görsel URL'ini kullanarak görseli grid'e ekle
                        document.querySelector('.grid').children[index].innerHTML = "<img src='" + imageURL + "' alt='" + predictionInput + " Görseli'>";
                        cellLocked[index] = true;
                        return; // Tahmin doğruysa, döngüden çık
                    }
                }
            }
            // Tahmin doğru değilse uyarı ver
            //alert("Tahmin yanlış veya geçersiz!");
        }
    };
    xhr.open("GET", "predictions.xml", true); // XML dosyasının adını buraya yazın
    xhr.send();
}
