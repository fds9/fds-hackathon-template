// 랜덤으로 숫자를 배열에 넣어준다.

class Game {
  puzzle = [];
  init() {
    this.puzzle = this.makingArr(this.randomNumber());
  }
  randomNumber() {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      do {
        number = Math.floor(Math.random() * 16);
      } while (arr.includes(number));
      arr.push(number);
    }
    return arr;
  }
  // 유효한 배열인지 확인한다.
  makingArr(arr) {
    let count = 0;
    for (let i = 0; i < 16; i++) {
      for (let j = 0; j < 16 - i; j++) {
        if (arr[i] > arr[j]) {
          count++;
        }
      }
    }
    if (
      (count % 2 === 1 &&
        (0 <= arr.indexOf(0) <= 3 || 8 <= arr.indexOf(0) <= 11)) ||
      (count % 2 === 0 &&
        (4 <= arr.indexOf(0) <= 7 || 12 <= arr.indexOf(0) <= 15))
    ) {
      const puzzle = [];
      for (let i = 0; i < 4; i++) {
        puzzle.push(arr.splice(0, 4));
      }
      return puzzle;
    } else {
      this.makingArr();
    }
  }
}

const game = new Game();
game.init();
console.log(game.puzzle);
game.init();
console.log(game.puzzle);
