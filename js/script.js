var game = document.querySelector(".card-container");
var cards = Array.from(document.querySelectorAll(".card"));
var emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🐻", "🐶", "🐱", "🐭", "🐹", "🐰", "🐻"];
var btn = document.querySelector(".btn");
var openedCards = [];

emojis.sort(function(a, b) {
    return Math.random() - 0.5;
})

cards = cards.map(function(value) {
    return new Card(value);
})

function getCardObject(element) {
    if (element.classList.contains("emoji") || element.classList.contains("back")) {
        return cards[element.parentNode.className.match(/\d+/)[0]]
    }
    return cards[element.className.match(/\d+/)[0]];
}

function Card(element) {
    var thisObj = this;
    this.isLocked = false;
    this.element = element;
    Object.defineProperty(this, "value", {
        get: function() {
            return this.element.querySelector(".emoji").innerHTML;
        },
        set: function(value) {
            this.element.querySelector(".emoji").innerHTML = value;
        }
    })
    Object.defineProperty(this, "status", {
        get: function() {
            if (this.element.classList.contains("equal")) {
                return "equal";
            } else if (this.element.classList.contains("non-equal")) {
                return "non-equal";
            } else {
                return "normal";
            }
        },
        set: function(value) {
            switch (value) {
                case "equal":
                    this.element.classList.remove("non-equal");
                    this.element.classList.add("equal");
                    break;
                case "non-equal":
                    this.element.classList.remove("equal");
                    this.element.classList.add("non-equal");
                    break;
                case "normal":
                    this.element.classList.remove("equal");
                    this.element.classList.remove("non-equal");
                    break;

            }
        }
    })
    Object.defineProperty(this, "isRotated", {
        get: function() {
            return this.element.classList.contains("rotated");
        },
    })
    this.element.addEventListener("click", function(event) {
        if (thisObj.isLocked) {
            return;
        }
        if (this.classList.contains("rotated")) {
            this.classList.remove("rotated");
        } else {
            this.classList.add("rotated");
        }
    })

}

Card.prototype.rotate = function() {
    if (this.element.classList.contains("rotated")) {
        this.element.classList.remove("rotated");
    } else {
        this.element.classList.add("rotated");
    }
}

Card.prototype.lock = function() {
    this.isLocked = true;
}

Card.prototype.unlock = function() {
    this.isLocked = false;
}

game.addEventListener("click", function(event) {
    if (!event.target.classList.contains("card-container")) {
        var card = getCardObject(event.target);
        console.log(card);
        if (card.isRotated && openedCards.indexOf(card) == -1 && card.status == "normal") {
            openedCards.push(card);
            card.lock();
        }
        console.log(openedCards);
        if (openedCards.length == 2) {
            if (openedCards[0].value == openedCards[1].value) {
                openedCards.forEach(function(element) {
                    element.lock();
                    element.status = "equal";
                })
                openedCards.splice(0, openedCards.length);
            } else {
                openedCards.forEach(function(element) {
                    element.lock();
                    element.status = "non-equal";
                })
            }
        }
        if (openedCards.length == 3) {
            openedCards.forEach(function(element) {
                if (openedCards.indexOf(element) != 2) {
                    element.unlock();
                    element.status = "normal";
                    element.rotate();
                } else {
                    element.lock();
                }
            })
            openedCards.splice(0, 2);
        }
    }
})

for (i = 0; i < 12; i++) {
    cards[i].value = emojis[i];
}