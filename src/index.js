import prettierShowArr from "./debugging";

class fifteenPuzzle {
  static flattenPuzzle(arr) {
    const flattenedPuzzle = [];
    for(let i = 0; i < 4; i++) {
      flattenedPuzzle.push(...arr[i]);
    }
    return flattenedPuzzle;
  }
  puzzle = [];
  blank = 15;
  count = 0;
  // 초기화 
  init() {
    this.puzzle = this.setPuzzle(this.getRandomNumbers());
    this.count = 0;
  }
  // 랜덤 수를 담은 배열 구하기
  getRandomNumbers() {
    const arr = [];
    let number;
    for (let i = 0; i < 16; i++) {
      do {
        number = Math.floor(Math.random() * 16);
      } while (arr.includes(number));
      arr.push(number);
    }
    return arr;
  }
  // 15퍼즐 규칙에 유효한 배열인지 확인후 다차원 배열을 반환한다.
  setPuzzle(arr) {
    console.log(`만들어진 배열이 아래에서 유효한지 확인합니다. ${arr}`);
    let count = 0;
    const blankIndex = arr.indexOf(this.blank);
    // 반전쌍의 개수 카운트
    for (let i = 0; i < 16 - 1; i++) {
      for (let j = i + 1; j < 16; j++) {
        console.log(`${i}번째의 ${arr[i]} 와 ${j}번째의 ${arr[j]}를 찾아서 비교합니다.`);
        if ((i !== blankIndex && j !== blankIndex) && arr[i] > arr[j]) {
          count++;
          console.log(count);
        }
      }
    }
    // 만약 반전쌍의 개수가 홀수일때 빈칸이 홀수 행에 있고 짝수일 때 짝수 행에 있는지
    if (
      (
        count % 2 === 1 && 
        (
          0 <= blankIndex && 4 > blankIndex || 
          8 <= blankIndex && 12 > blankIndex
        )
      ) ||
      (
        count % 2 === 0 && 
        (
          4 <= blankIndex && 8 > blankIndex || 
          12 <= blankIndex && 16 > blankIndex
        )
      )
    ) {
      console.log(`[유효]반전쌍의 개수: ${count} / 빈칸의 인덱스: ${blankIndex}`);
      const puzzle = [];
      for (let i = 0; i < 4; i++) {
        puzzle.push(arr.splice(0, 4));
      }
      prettierShowArr(puzzle, '완성된 퍼즐');
      return puzzle;
    } else {
      console.log(`[재배열!]반전쌍의 개수: ${count} / 빈칸의 인덱스: ${blankIndex}`);
      return this.setPuzzle(this.getRandomNumbers());
    }
  }
  // 위치 객체 구하기
  getCellsPosition(arr, item) {
    const position = {};
    for (let i = 0; i < 4; i++) {
      if (arr[i].includes(item)) {
        position.r = i;
        position.c = arr[i].indexOf(item);
      }
    }
    return position;
  }
  // 변경된 열을 반환하는 함수 
  getMovedRow(pos, blankPos, arr) {
    const row = [];
    if (pos.c < blankPos.c) {
      for(let i = 0; i < 4; i++) {
        if (i < pos.c || i > blankPos.c) {
          row.push(arr[pos.r][i]);
        } else if (i === pos.c) {
          row.push(this.blank)
        } else {
          this.count++
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
          this.count++
          row.push(arr[pos.r][i + 1]);
        }
      }
    }
    return row;
  }
  //행을 변경해주는 함수 
  moveCol(pos, blankPos, arr) {
    if (pos.r < blankPos.r) {
      this.puzzle = arr.map((item, row) => 
        item.map((it, col) => {
          if (col !== pos.c || row < pos.r || row > blankPos.r) {
            return it;
          } else if(row === pos.r) {
            return this.blank;
          } else {
            this.count++
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
            this.count++
            return arr[row + 1][col];
          }
        })
      );
    }
  }
  // 클릭한 번호를 입력받아 재배열하여 this.puzzle의 데이터를 업데이트
  updatePuzzle(num) {
    const arr = this.puzzle;
    // 클릭한 칸의 위치
    const pos = this.getCellsPosition(arr, num);
    // 빈칸의 위치
    const blankPos = this.getCellsPosition(arr, this.blank);
    if (pos.r === blankPos.r) {
      // ROW가 같다면
      arr[pos.r] = this.getMovedRow(pos, blankPos, arr)
    } else if (pos.c === blankPos.c) {
      // COL이 같다면
      this.moveCol(pos, blankPos, arr);
     } 
  }
  // 퍼즐이 다 정렬되었는지 확인하여 Boolean값 반환
  checkFinish() {
    return fifteenPuzzle.flattenPuzzle(this.puzzle).every((item, index, arr) => index === 0 ? true : item > arr[index - 1]); 
  }
}

const game = new fifteenPuzzle();
const cells = document.querySelectorAll('.puzzle__cell');
const startBtnEl = document.querySelector('.btn--start');
const restartBtnEl = document.querySelector('.btn--restart');
const moveCountEl = document.querySelector('.current-state__move__display');
// 타이머
const timeEl = document.querySelector('.current-state__time__display');
const modalEl = document.querySelector('.modal');
const modalCountEl = modalEl.querySelector('.final-score__move__display');
const modalTimeEl = modalEl.querySelector('.final-score__time__display');

let time = 0;
let setCountTime;

// 게임 시작
function gameInit() {
  game.init();
  const flattenedPuzzle = fifteenPuzzle.flattenPuzzle(game.puzzle);
  cells.forEach((item, index) => {
    item.dataset.idx = flattenedPuzzle.indexOf(index);
  });

  // 타이머 정의
  setCountTime = setInterval(() => {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timeEl.textContent = `${convert(minutes)}:${convert(seconds)}`; 
    function convert(n) {
      return n < 10 ? `0${n}`: n;
    }
  }, 1000);
}

// 게임 리셋
function gameReset() {
  clearInterval(setCountTime);
  time = 0;
  timeEl.textContent = `00:00`;
  gameInit();
  moveCountEl.textContent = 0;
}

// 칸 클릭 이벤트
cells.forEach((item, index) => {
  item.addEventListener('click', e => {
    game.updatePuzzle(index);
    prettierShowArr(game.puzzle, '클릭 후 변경된 퍼즐');
    const flattenedPuzzle = fifteenPuzzle.flattenPuzzle(game.puzzle);
    cells.forEach((item, index) => {
      item.dataset.idx = flattenedPuzzle.indexOf(index);
    });
    moveCountEl.textContent = game.count;
    if(game.checkFinish()) {
      modalEl.classList.add('modal--end');
      modalCountEl.textContent = game.count;
      modalTimeEl.textContent = time;
      // 타이머 해제
      clearInterval(setCountTime);
    } 
  });
})

// 재시작 버튼을 눌렀을 때
restartBtnEl.addEventListener('click', gameReset);

// 시작 버튼을 눌렀을 때
startBtnEl.addEventListener('click', e => {
  // console.log(game.puzzle);
  gameReset();
  modalEl.classList.remove('modal--start', 'modal--end');
});



