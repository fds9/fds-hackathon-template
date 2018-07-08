class baseballGame {
  answer = [];
  strike = 1;
  ball = 0;

  randomNumber(n) {
      let len = n;
      this.answer = new Array(len);
      this.answer.fill(0);

      for (let i = 0; i < len; i++) {
          this.answer[i] = Math.floor(Math.random() * 10);
          for (let j = 0; j < i; j++) {
              if (this.answer[i] === this.answer[j]) {
                  i--;
                  break;
              }
          }
      }
      return this.answer;
  }
}
const game = new baseballGame();

game.randomNumber(3);
