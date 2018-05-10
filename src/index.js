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
    this.puzzle = this.makingArr(this.randomNumber());
  }
  // 랜덤 수 구하기
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
  // 위치 객체 구하기
  findPosition(arr, item) {
    const position = {};
    for (let i = 0; i < 4; i++) {
      if (arr[i].includes(item)) {
        position.r = i;
        position.c = arr[i].indexOf(item);
      }
    }
    return position;
  }
  // 클릭한 번호를 입력받아 재배열하여 this.puzzle의 데이터를 업데이트
  moveCells(num) {
    const arr = this.puzzle;
    // 클릭한 칸의 위치
    const pos = this.findPosition(arr, num);
    // 빈칸의 위치
    const blankPos = this.findPosition(arr, this.blank);
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
  }
  // 퍼즐이 다 정렬되었는지 확인하여 Boolean값 반환
  checkFinish() {
    return fifteenPuzzle.flattenPuzzle(this.puzzle).every((item, index, arr) => index === 0 ? true : item > arr[index - 1]); 
  }
}

const game = new fifteenPuzzle();
const cells = document.querySelectorAll('.puzzle__cell');
const startBtnEl = document.querySelector('.btn--start')
const restartBtnEl = document.querySelector('.btn--restart')
const moveCountEl = document.querySelector('.current-state__move__display');
// 타이머
const timeEl = document.querySelector('.current-state__time__display');
const modalEl = document.querySelector('.modal');
const madalCountEl = modalEl.querySelector('.final-score__move__display')
const madalTimeEl = modalEl.querySelector('.final-score__time__display')


let time = 0;
let timer;

// 게임 시작
function gameInit() {
  game.init();
  const flattenedPuzzle = fifteenPuzzle.flattenPuzzle(game.puzzle);
  cells.forEach((item, index) => {
    item.dataset.idx = flattenedPuzzle.indexOf(index);
  });

  // 타이머 정의
  timer = setInterval(() => {
    time++;
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    console.log(minutes, seconds);
    timeEl.textContent = `${convert(minutes)}:${convert(seconds)}`; 
    function convert(n) {
      return n < 10 ? `0${n}`: n
    }
  }, 1000);
}
// 임시 테스트
console.log(game.puzzle);
// 칸 클릭 이벤트
cells.forEach((item, index) => {
  item.addEventListener('click', e => {
    game.moveCells(index);
    const flattenedPuzzle = fifteenPuzzle.flattenPuzzle(game.puzzle);
    cells.forEach((item, index) => {
      item.dataset.idx = flattenedPuzzle.indexOf(index);
    });
    moveCountEl.textContent = game.count;
    if(game.checkFinish()) {
      modalEl.classList.add('modal--end')
      modalCountEl.textContent = game.count;
      modalTimeEl.textContent = time;
      console.log('성공!!');
      // 타이머 해제
      clearInterval(timer);
    } 
  });
})

// 재시작 버튼을 눌렀을 때
restartBtnEl.addEventListener('click', e => {
  // 타이머 초기화
  clearInterval(timer);
  time = 0;
  
  // 게임 시작
  gameInit();
});

// 시작 버튼을 눌렀을 때
startBtnEl.addEventListener('click', e => {
  clearInterval(timer);
  time = 0;
  gameInit();
  modalEl.classList.remove('modal--start','modal--end');
});



