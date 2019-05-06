var ingCount = 0;

// adds a new ing div, sets its value to the value of the
// ing-add input box, and clears the ing-add input box
function addIng(event) {
    var add = document.getElementById("ing-add");
    if (add.value != "") {
        ingCount++;
        var form = document.getElementById("ing-form");
        form.insertAdjacentHTML('beforeend', "<div class=\"ing\"><input type=\"text\" name=\"ings[]\" class=\"ing-box\" onsubmit=\"return false;\"><i class=\"fas fa-times delete\"></i></div>");
    
        var currIng = form.lastChild;
        currIng.firstChild.value = add.value;
        // event listener for the ingredient clear button
        currIng.lastChild.addEventListener('click', function(event) {
            var toRemove = this.parentNode;
            this.parentNode.parentNode.removeChild(toRemove);
        }, false);
        // event listener for removing an empty ingredient box
        currIng.firstChild.addEventListener('blur', function(event) {
            if (this.value == "") {
                var toRemove = this.parentNode;
                this.parentNode.parentNode.removeChild(toRemove);
            }
        }, false);
        // event listener for removing an empty ingredient box
        currIng.firstChild.addEventListener('submit', function(event) {
            event.preventDefault();
        }, false);

        add.value = "";

        // iterating thought input object values of the form
    }
}

function submitIng() {
    var ings = "";
    var request = new XMLHttpRequest();
    request.open("GET", "https://hungrindr.herokuapp.com/results", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    
    var form = document.getElementById("ing-form").childNodes;

    for (let i = 1; i < form.length; i++) {
        ings += form[i].childNodes[0].value;
        if (i != (form.length - 1)) {
            ings += ',';
        }
    }

    // var URL = 'https://hungrindr.herokuapp.com/results?ings=' + ings
    
    // send a get request to /recipes instead
    //window.location.href = (URL)
    // window.open(URL)
    request.send("ings="+ings);
}

// clears the default behaviour of the ing-form-add form
function init() {
    document.getElementById("ing-form-add").addEventListener('submit', function(event) {
        event.preventDefault();
    })
}

function genShop() {
    document.getElementById("shop-list").style.display = "block";
}