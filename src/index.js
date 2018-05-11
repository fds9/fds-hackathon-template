import prettierShowArr from "./debugging";
import fifteenPuzzle from "./fifteenPuzzle";

const game = new fifteenPuzzle();
const cells = document.querySelectorAll('.puzzle__cell');
const startBtnEl = document.querySelector('.btn--start');
const restartBtnEl = document.querySelector('.btn--restart');
const moveCountEl = document.querySelector('.current-state__move__display');
const modalEl = document.querySelector('.modal');
const modalCountEl = modalEl.querySelector('.final-score__move__display');
const modalTimeEl = modalEl.querySelector('.final-score__time__display');

// 타이머
const timeEl = document.querySelector('.current-state__time__display');
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
  item.addEventListener('click', () => {
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
  gameReset();
  modalEl.classList.remove('modal--start', 'modal--end');
});



