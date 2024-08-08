const fig = [
  "assets/img/cross.png",
  "assets/img/round.png",
  "assets/img/triang.png",
  "assets/img/square.png",
];
const handImg = {
  1: "assets/img/cross_hand.png",
  2: "assets/img/round_hand.png",
  3: "assets/img/triang_hand.png",
  4: "assets/img/square_hand.png",
};

let size;
let playersAmount = 2;

let currIndexes = [];

let step;
let playerType;

let values;
let entities;

game.style.display = "none";
res.style.display = "none";
players.addEventListener("click", setPlayersAmount);
startButton.addEventListener("click", createGameField);
tryAgainButton.addEventListener("click", clearGameField);
newGameButton.addEventListener("click", function () {
  game.style.display = "none";
  res.style.display = "none";
  start.style.display = "flex";
  deleteGameField();
});

function setPlayersAmount(e) {
  e.preventDefault();
  const target = e.target.closest(".player-btn");
  playersAmount = +target.id.slice(7);
  for (let i = 2; i <= 4; i++) {
    elem = document.getElementById("players" + i);
    elem.className =
      i === playersAmount ? "player-btn active-btn" : "player-btn";
  }
}

function deleteGameField() {
  gameField.remove();
  hands.remove();
  game.insertAdjacentHTML(
    "beforeend",
    `<div class="game-field" id="gameField"></div>
  <div class="hands" id="hands"></div>`
  );
}
function clearGameField() {
  step = 0;
  let handElem = document.getElementById("hand" + playerType);
  handElem.className = "hand";
  hand1.className = "hand active";
  playerType = 1;
  stepText.innerHTML = "Ход " + step;
  start.style.display = "none";
  values = Array(size)
    .fill()
    .map(() => Array(size).fill());
  entities = Array(size)
    .fill()
    .map(() => Array(size).fill());
  entities.forEach((element1, index1) => {
    element1.forEach((element2, index2) => {
      element2 = document.getElementById(`cell_${index1}_${index2}`);
      element2.innerHTML = "";
      element2.addEventListener("click", setCell);
    });
  });
  res.style.display = "none";
}

function createGameField() {
  size = +fieldSize.value;
  step = 0;
  playerType = 1;
  stepText.innerHTML = "Ход " + step;
  start.style.display = "none";
  values = Array(size)
    .fill()
    .map(() => Array(size).fill());
  entities = Array(size)
    .fill()
    .map(() => Array(size).fill());
  entities.forEach((element1, index1) => {
    gameField.insertAdjacentHTML(
      "beforeend",
      `<div class="row" id="row${index1}">`
    );
    element1.forEach((element2, index2) => {
      elem = document.getElementById("row" + index1);
      if (index1 !== size - 1 && index2 !== size - 1)
        elem.insertAdjacentHTML(
          "beforeend",
          `<div class="cell" id="cell_${index1}_${index2}">`
        );
      else if (index1 === size - 1 && index2 === size - 1)
        elem.insertAdjacentHTML(
          "beforeend",
          `<div class="cell corner" id="cell_${index1}_${index2}">`
        );
      else if (index2 === size - 1)
        elem.insertAdjacentHTML(
          "beforeend",
          `<div class="cell border-right" id="cell_${index1}_${index2}">`
        );
      else
        elem.insertAdjacentHTML(
          "beforeend",
          `<div class="cell border-bottom" id="cell_${index1}_${index2}">`
        );
      element2 = document.getElementById(`cell_${index1}_${index2}`);
      element2.addEventListener("click", setCell);
    });
  });
  for (let i = 1; i <= playersAmount; i++) {
    hands.insertAdjacentHTML(
      "beforeend",
      `<div class="hand" id="hand${i}">
          <img src=${handImg[i]} class="hand-img" />
        </div>`
    );
  }
  hand1.className = "hand active";
  game.style.display = "flex";
}

function setCell() {
  step++;
  stepText.innerHTML = "Ход " + step;
  showPlayer();
  this.innerHTML = `<img class="sign" src=${fig[playerType - 1]}>`;
  currIndexes = this.id
    .split("_")
    .map((element) => +element)
    .splice(1, 2);
  values[currIndexes[0]][currIndexes[1]] = playerType;
  handleResult(check(...currIndexes, size));

  if (playerType == playersAmount) playerType = 0;
  playerType++;
  this.removeEventListener("click", setCell);
}

function check(row, column, size) {
  const str = `${playerType}`.repeat(3);
  const rowCheck = values[row].join("").includes(str);
  if (rowCheck) return true;

  const columnCheck = values
    .map((element) => element[column])
    .join("")
    .includes(str);
  if (columnCheck) return true;

  newR = row - Math.min(column, row);
  const leftDiagCheck = values
    .map((element, index) => {
      if (index < newR) return "";
      else return element[index + column - row];
    })
    .join("")
    .includes(str);
  if (leftDiagCheck) return true;

  newR = column + row - (size - 1);
  newC = size + newR < size ? size + newR : size;
  const rightDiagCheck = values
    .map((element, index) => {
      if (index < newR) return "";
      else {
        newC--;
        return element[newC];
      }
    })
    .join("")
    .includes(str);
  if (rightDiagCheck) return true;
  return false;
}

function checkRaw() {
  if (step === size * size) {
    res.style.display = "grid";
    result.innerHTML = "Ничья";
  }
}

function showPlayer() {
  let handElem = document.getElementById("hand" + playerType);
  handElem.className = "hand";
  handElem = document.getElementById(
    "hand" + (playerType === playersAmount ? 1 : playerType + 1)
  );
  handElem.className = "hand active";
}

function handleResult(isEnd) {
  if (isEnd === false) checkRaw();
  else {
    values.forEach((element1, index1) => {
      element1.forEach((element2, index2) => {
        if (element2 == undefined) {
          elem = document.getElementById("cell_" + index1 + "_" + index2);
          elem.removeEventListener("click", setCell);
        }
      });
    });
    res.style.display = "grid";
    result.innerHTML = "На ходу " + step + " победил игрок " + playerType;
    return;
  }
}
