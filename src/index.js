// 랜덤으로 숫자를 배열에 넣어준다.

class Game {
  puzzle = [];
  blank = 15;
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
  // 몇째 줄에 있는 수인지 찾아주는 함수
  checkRow(arr, num) {
    return arr.findIndex((item, idx) => arr[idx].includes(num));
  }
  
  // 몇번째 열에 있는 수인지 찾아주는 함수
  checkCol(arr, num) {
    return arr[this.checkRow(arr, num)].indexOf(num);
  }
  
  // 입력한 번호와 blank의 번호 0에 따라 재배열되는 배열출력
  move(num) {
    const arr = this.puzzle;
    // 클릭한 칸의 위치
    const pos = {
      r: this.checkRow(arr, num),
      c: this.checkCol(arr, num)
    }
    // 빈칸의 위치
    const blankPos = {
      r: this.checkRow(arr, this.blank),
      c: this.checkCol(arr, this.blank)
    }
    if (pos.r === blankPos.r) {
      // ROW가 같다면
      const row = [];
      if (pos.c < blankPos.c) {
        for(let i = 0; i < 4; i++) {
          if (i < pos.c || i > blankPos.c) {
            row.push(arr[pos.r][i]);
          } else if (i === pos.c) {
            row.push(this.blank)
          } else {
            row.push(arr[pos.r][i - 1]);
          }
        }
      } else {
        for(let i = 0; i < 4; i++) {
          if (i > pos.c || i < blankPos.c) {
            row.push(arr[pos.r][i]);
          } else if (i === pos.c) {
            row.push(this.blank)
          } else {
            row.push(arr[pos.r][i + 1]);
          }
        }
      }
      arr[pos.r] = row;
    } else if (pos.c === blankPos.c) {
      // COL이 같다면
      if (pos.r < blankPos.r) {
        this.puzzle = arr.map((item, row) => 
          item.map((it, col) => {
            if (col !== pos.c || row < pos.r || row > blankPos.r) {
              return it;
            } else if(row === pos.r) {
              return this.blank;
            } else {
              return arr[row - 1][col];
            }
          })
        );
      } else {
        this.puzzle = arr.map((item, row) => 
          item.map((it, col) => {
            if (col !== pos.c || row > pos.r || row < blankPos.r) {
              return it;
            } else if(row === pos.r) {
              return this.blank;
            } else {
              return arr[row + 1][col];
            }
          })
        );
      }
    } 
  }
  // 퍼즐이 다 정렬되었는지
  checkFinish() {
    const flattenArr = [];
    for(let i = 0; i < 4; i++) {
      flattenArr.push(...this.puzzle[i]);
    }
    return flattenArr.every((item, index, arr) => index === 0 ? true : item > arr[index - 1]); 
    // for (let i = 1; i < 16; i++) {
    //   if(flattenArr[i - 1] > flattenArr[i]) {
    //     return false;
    //   } 
    // }
    // return true;
  }
}

const game = new Game();
game.init();
console.log(game.puzzle);
game.init();
console.log(game.puzzle);
