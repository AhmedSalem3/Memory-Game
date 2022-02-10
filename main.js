const cardsHolder = document.querySelector(".memory-game-blocks .container");
let cards = Array.from(document.querySelectorAll(".game-block"));

// shuffling cards randomly;
let orderRange = [...Array(cards.length).keys()];
function shuffleArr(arr) {
  let current = arr.length,
    random,
    temp;

  while (current > 0) {
    random = Math.floor(Math.random() * current);

    current--;

    temp = arr[current];

    arr[current] = arr[random];

    arr[random] = temp;
  }
  return arr;
}
orderRange = shuffleArr(orderRange);

cards.forEach((card, index) => {
  card.style.order = orderRange[index];
});

function actions(ended = false, status) {
  // let userName = prompt("What is your name");
  // document.querySelector(".name span").innerHTML = userName;
  let actionsHolder = document.querySelector(".control-buttons");
  let startBtn = document.querySelector(".control-buttons span.start");

  if (!ended) {
    startBtn.addEventListener("click", runGame);
  } else if (ended) {
    document.body.classList.add("not-started");
    createStartAgainBtns(actionsHolder, status);
  }
}
actions();

let stopTimer = false;
function runGame() {
  let gameDurationSec = 2 * 60;
  document.body.classList.remove("not-started");

  // flipping cards to let the user memorize them
  cards.forEach((card) => card.classList.add("flipped"));
  setTimeout(() => {
    cards.forEach((card) => card.classList.remove("flipped"));
    cards.forEach((card) => card.classList.remove("completed"));
  }, 3000);

  // setting game timer (countdown)
  let gameTimer = setInterval(() => {
    gameDurationSec--;
    let minutes = Math.floor(gameDurationSec / 60);
    let seconds = Math.floor(gameDurationSec % 60);
    document.querySelector(".timer span.minutes").innerHTML = minutes;
    document.querySelector(".timer span.seconds").innerHTML = seconds;

    if (gameDurationSec <= 0) {
      endGame("lost");
      clearInterval(gameTimer);
    } else if (stopTimer) {
      clearInterval(gameTimer);
      stopTimer = false;
    }
  }, 1000);
}

// main vars
let attemps = 0;
let clickedCards = []; // arr that have the last two clicked cards

cards.forEach((card) => card.addEventListener("click", flipCard));

function flipCard() {
  this.classList.add("flipped");

  let allFlipped = document.querySelectorAll(".flipped");

  if (allFlipped.length == 2) {
    checkCards(allFlipped);
  }
}

function checkCards(allFlipped) {
  let [first, second] = allFlipped;
  stopClicking();

  if (first.dataset.technology == second.dataset.technology) {
    allFlipped.forEach((flippedCard) => {
      flippedCard.classList.remove("flipped");
      flippedCard.classList.add("completed");
    });

    checkToEndGame();
    //
  } else {
    setTimeout(() => {
      wrong(allFlipped);
    }, 500);
  }
}

function stopClicking() {
  cardsHolder.style.pointerEvents = "none";

  setTimeout(() => {
    cardsHolder.style.pointerEvents = "initial";
  }, 1000);
}

function wrong(allFlipped) {
  allFlipped.forEach((card) => card.classList.remove("flipped"));
  updateAttemps();
}

function updateAttemps() {
  let attempsElement = document.querySelector(".tries span");
  attemps++;
  attempsElement.innerHTML = attemps;
}

function checkToEndGame() {
  let flipped = [...cards].filter((card) =>
    card.classList.contains("completed")
  );

  flipped.length == cards.length ? endGame("won") : "";
}

function endGame(status) {
  actions(true, status);
}

function createStartAgainBtns(appender, status) {
  let message;
  status == "won" ? (message = "You Won") : (message = "You Lost");

  appender.innerHTML = message;

  let startAgainBtn = document.createElement("span");
  startAgainBtn.className = "start-again";
  startAgainBtn.innerHTML = "Start Again";
  startAgainBtn.addEventListener("click", () => {
    stopTimer = true;

    runGame();
  });
  appender.append(startAgainBtn);
}
