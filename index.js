const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
c.font = "50px Arial";

canvas.width = 1024;
canvas.height = 576;

function collidePoint(rect, point) {
  if (
    point.x <= rect.position.x + rect.width &&
    point.x >= rect.position.x &&
    point.y <= rect.position.y + rect.height &&
    point.y >= rect.position.y
  )
    return true;
}

class Board {
  constructor() {
    this.position = {
      x: 20,
      y: 20,
    };
    this.height = 500;
    this.width = 500;
    this.color = "black";
    this.spotColors = "white";

    this.spots = [];
    this.sections = [[], [], [], [], [], [], [], [], []];
    this.rows = [[], [], [], [], [], [], [], [], []];
    this.columns = [[], [], [], [], [], [], [], [], []];

    this.numberChecks = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          for (let l = 0; l < 3; l++) {
            let spot = new Spot({
              x:
                j * Spot.width * 3 +
                l * Spot.width +
                Spot.spaceBetween * j * 6 +
                Spot.spaceBetween * l,
              y:
                i * Spot.height * 3 +
                k * Spot.height +
                Spot.spaceBetween * i * 6 +
                Spot.spaceBetween * k,
            });
            this.spots.push(spot);
            this.sections[i * 3 + j].push(spot);
            this.rows[j * 3 + l].push(spot);
            this.columns[i * 3 + k].push(spot);
          }
        }
      }
    }

    for (let i = 0; i < 11; i++) {
      let numcheck = new NumberChecks(
        {
          x: 550,
          y: (NumberChecks.height + 15) * i + 20,
        },
        i + 1
      );
      this.numberChecks.push(numcheck);
    }
    this.selectedSpot;
    this.checkingNumber = 0;
  }

  check() {
    let nums = [[], [], [], [], [], [], [], [], []];
    let checks = 0;
    for (let i = 0; i < this.sections.length; i++) {
      this.sections[i].forEach((spot) => {
        if (spot.number > 0) nums[spot.number - 1].push("x");
      });
      for (let i = 0; i < nums.length; i++) {
        if (nums[i].length <= 1) checks += 1;
        nums[i].length = 0;
      }
    }

    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].forEach((spot) => {
        if (spot.number > 0) nums[spot.number - 1].push("x");
      });
      for (let i = 0; i < nums.length; i++) {
        if (nums[i].length <= 1) checks += 1;
        nums[i].length = 0;
      }
    }

    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].forEach((spot) => {
        if (spot.number > 0) nums[spot.number - 1].push("x");
      });
      for (let i = 0; i < nums.length; i++) {
        if (nums[i].length <= 1) checks += 1;
        nums[i].length = 0;
      }
    }
    if (checks == 243) this.spotColors = "rgb(0,255,0)";
    else this.spotColors = "white";
  }

  update() {
    this.spots.forEach((spot) => (spot.color = this.spotColors));
    if (this.checkingNumber) {
      this.spots.forEach((spot) => {
        if (spot.number) spot.color = "red";
      });
    }
    this.spots.forEach((spot) => spot.update());
    this.numberChecks.forEach((spot) => spot.update());
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.spots.forEach((spot) => spot.draw());
    this.numberChecks.forEach((spot) => spot.draw());
  }
}

class Spot {
  static {
    this.width = 50;
    this.height = 50;
    this.spaceBetween = 2;
  }
  constructor(position) {
    this.position = position;
    this.width = Spot.width;
    this.height = Spot.height;
    this.color = "white";

    this.number;
  }

  update() {
    if (this.number == board.checkingNumber) {
      for (let i = 0; i < board.sections.length; i++) {
        if (board.sections[i].includes(this)) {
          board.sections[i].forEach((spot) => (spot.color = "red"));
        }
      }
      for (let i = 0; i < board.rows.length; i++) {
        if (board.rows[i].includes(this)) {
          board.rows[i].forEach((spot) => (spot.color = "red"));
        }
      }
      for (let i = 0; i < board.columns.length; i++) {
        if (board.columns[i].includes(this)) {
          board.columns[i].forEach((spot) => (spot.color = "red"));
        }
      }
    }
    if (board.selectedSpot == this) this.color = "yellow";
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(
      30 + this.position.x,
      30 + this.position.y,
      this.width,
      this.height
    );
    if (this.number) {
      c.fillStyle = "black";
      c.fillText(this.number, 60 + this.position.x, 60 + this.position.y);
    }
  }
}

class NumberChecks {
  static {
    this.width = 80;
    this.height = 30;
  }
  constructor(position, number) {
    this.position = position;
    if (number == 10) this.number = "clear";
    else if (number == 11) this.number = "check";
    else this.number = number;
    this.width = NumberChecks.width;
    this.height = NumberChecks.height;
    this.color = "gray";
  }

  update() {
    this.color = "gray";
    if (this.number == board.checkingNumber) this.color = "red";
    if (this.number == board.checkingNumber2) this.color = "red";
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.fillStyle = "black";
    c.fillText(this.number, this.position.x + 30, this.position.y + 20);
  }
}

class InputManager {
  constructor() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "1":
          board.selectedSpot.number = 1;
          break;
        case "2":
          board.selectedSpot.number = 2;
          break;
        case "3":
          board.selectedSpot.number = 3;
          break;
        case "4":
          board.selectedSpot.number = 4;
          break;
        case "5":
          board.selectedSpot.number = 5;
          break;
        case "6":
          board.selectedSpot.number = 6;
          break;
        case "7":
          board.selectedSpot.number = 7;
          break;
        case "8":
          board.selectedSpot.number = 8;
          break;
        case "9":
          board.selectedSpot.number = 9;
          break;
        case "0":
          board.selectedSpot.number = undefined;
          break;
      }
    });
    window.addEventListener("click", (e) => {
      let point;
      if (e.x < 500)
        point = {
          x: e.x - 33,
          y: e.y - 33,
        };
      else
        point = {
          x: e.x - 5,
          y: e.y - 5,
        };
      board.spots.forEach((spot) => {
        if (collidePoint(spot, point)) {
          if (board.selectedSpot == spot) board.selectedSpot = undefined;
          else board.selectedSpot = spot;
        }
      });
      board.numberChecks.forEach((spot) => {
        if (collidePoint(spot, point)) {
          if (spot.number == "clear") board.checkingNumber = 0;
          else if (spot.number == "check") board.check();
          else board.checkingNumber = spot.number;
        }
      });
    });
  }
}

function run() {
  window.requestAnimationFrame(run);
  board.update();
  board.draw();
}

let board = new Board();
new InputManager();
run();
