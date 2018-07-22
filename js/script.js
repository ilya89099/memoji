var emojis = Array.from(document.querySelectorAll(".card")).map(function(element) {
    return element.querySelector(".emoji").innerHTML;
});
var openedCards = [];
var firstClick = true;
var correctPairs = 0;
var resetBtn = document.querySelector(".reset");
var modal = document.querySelector(".cover");
var cards = Array.from(document.querySelectorAll(".card")).map(function(value, index) {
    value.dataset.index = index;
    return new Card(value);
});

resetBtn.addEventListener("click", function() {
    reset();
})

function shuffle() {
    emojis.sort(function(a, b) {
        return Math.random() - 0.5;
    })
    cards.forEach(function(element, index) {
        element.value = emojis[index];
    })
}

function reset() {
    game.reset();
    cards.forEach(function(element) {
        element.reset();
    });
    timer.reset();
    firstClick = true;
    openedCards.splice(0, openedCards.length);
    correctPairs = 0;
}

var game = {
    element: document.querySelector(".card-container"),
    win: function() {
        modal.classList.add("win");
        timer.stop();
    },
    lose: function() {
        modal.classList.add("lose");
    },
    reset: function() {
        modal.classList.remove("win");
        modal.classList.remove("lose");
    }
}

var timer = {
    element: document.querySelector(".timer"),
    initialTimeValue: document.querySelector(".timer").innerHTML,
    intervalIdentifier: null,
    isStarted: false,
    reduce: function(interval) {
        var time = this.element.innerHTML;
        var minutes = time.slice(0, time.search(/:/));
        var seconds = time.slice(time.search(/:/) + 1);

        if (seconds > 0) {
            this.element.innerHTML = minutes + ":" + (seconds > 10 ? "" : "0") + (seconds - 1);
        } else {
            this.element.innerHTML = (minutes - 1) + ":59";
        }
        if (minutes == 0 && seconds - 1 == 0) {
            game.lose();
            this.stop();
        };

    },
    start: function() {
        if (!this.isStarted) {
            this.isStarted = true;
            this.intervalIdentifier = setInterval(function() {
                timer.reduce();
            }, 1000)

        }
    },
    stop: function() {
        clearInterval(this.intervalIdentifier);
        this.isStarted = false;
    },
    reset: function() {
        this.element.innerHTML = this.initialTimeValue;
    },
}

function getCardObject(element) {
    while (element != document) {
        if (element.classList.contains("card")) {
            return cards[element.dataset.index];
        }
        element = element.parentNode;
    }
    return null;
}

function Card(element) {
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


}

Card.prototype.rotate = function() {
    this.element.classList.toggle("rotated");
}

Card.prototype.reset = function() {
    this.status = "normal";
    if (this.isRotated) {
        this.rotate();
    }
}

function gameClickHandler(event) {
    var card = getCardObject(event.target);
    if (card != null) {
        firstClick ? (shuffle(), firstClick = false) : null;
        if (!card.isRotated && openedCards.indexOf(card) == -1 && card.status == "normal") {
            timer.start();
            openedCards.push(card);
            card.rotate();
        }
        if (openedCards.length == 2) {
            if (openedCards[0].value == openedCards[1].value) {
                openedCards.forEach(function(element) {
                    element.status = "equal";
                });
                ++correctPairs;
                openedCards.splice(0, openedCards.length);
                if (correctPairs == (cards.length / 2)) {
                    game.win();
                }
            } else {
                openedCards.forEach(function(element) {
                    element.status = "non-equal";
                })
            }
        }
        if (openedCards.length == 3) {
            openedCards.forEach(function(element) {
                if (openedCards.indexOf(element) != 2) {
                    element.reset();
                }
            })
            openedCards.splice(0, 2);
        }
    }
};

game.element.addEventListener("click", gameClickHandler);