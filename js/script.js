var emojis = ["🐶", "🐱", "🐮", "🐵", "🐰", "🐻"];
var openedCards = [];
var correctCards = [];
var resetBtn = document.querySelector(".reset");
var modal = document.querySelector(".cover");
var cards = Array.from(document.querySelectorAll(".card")).map(function(value) {
    return new Card(value);
});

resetBtn.addEventListener("click", function() {
    game.reset();
})
emojis = emojis.concat(emojis);

function shuffle() {
    emojis.sort(function(a, b) {
        return Math.random() - 0.5;
    })
    cards.forEach(function(element, index) {
        element.value = emojis[index];
    })
}

shuffle();

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
        cards.forEach(function(element) {
            element.reset();
        });
        timer.reset();
        shuffle();
        openedCards.splice(0, openedCards.length);
        correctCards.splice(0, correctCards.length);
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
            if (seconds > 10) {
                this.element.innerHTML = minutes + ":" + (seconds - 1);
            } else {
                this.element.innerHTML = minutes + ":" + "0" + (seconds - 1);
            }

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
            console.log(this.intervalIdentifier);
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
        timer.start();
        if (!thisObj.isLocked) {
            thisObj.rotate();
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

Card.prototype.reset = function() {
    this.unlock();
    this.status = "normal";
    if (this.isRotated) {
        this.rotate();
    }
}

function gameClickHandler(event) {
    if (!event.target.classList.contains("card-container")) {
        var card = getCardObject(event.target);
        if (card.isRotated && openedCards.indexOf(card) == -1 && card.status == "normal") {
            openedCards.push(card);
            card.lock();
        }
        if (openedCards.length == 2) {
            if (openedCards[0].value == openedCards[1].value) {
                openedCards.forEach(function(element) {
                    element.lock();
                    element.status = "equal";
                    correctCards.push(element);
                })
                openedCards.splice(0, openedCards.length);
                if (correctCards.length == 12) {
                    game.win();
                }
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
                    element.reset();
                } else {
                    element.lock();
                }
            })
            openedCards.splice(0, 2);
        }
    }
};

game.element.addEventListener("click", gameClickHandler);