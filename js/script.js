var game = document.querySelector(".card-container");
var cards = Array.from(document.querySelectorAll(".card"));
var emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🐻", "🐶", "🐱", "🐭", "🐹", "🐰", "🐻"];
var btn = document.querySelector(".btn");


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
        getCardObject(event.target);
        var openedCards = [];
        cards.forEach(function(element) {
            if (element.isRotated && element.status != "equal") {
                openedCards.push(element);
            }
        });
        if (openedCards.length == 1) {
            openedCards[0].lock();
        }
        if (openedCards.length == 2) {
            if (openedCards[0].value == openedCards[1].value) {
                openedCards[0].status = "equal";
                openedCards[0].lock();
                openedCards[1].status = "equal";
                openedCards[1].lock();
            } else {
                openedCards[0].status = "non-equal";
                openedCards[0].lock();
                openedCards[1].status = "non-equal";
                openedCards[1].lock();
            }
        }
        if (openedCards.length == 3) {
            openedCards.forEach(function(element) {
                if (element != getCardObject(event.target)) {
                    element.unlock();
                    element.status = "normal";
                    element.rotate();
                } else {
                    element.lock();
                }
            })
        }
    }
})

for (i = 0; i < 12; i++) {
    cards[i].value = emojis[i];
}