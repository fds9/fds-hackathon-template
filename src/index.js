// 랜덤으로 숫자를 배열에 넣어준다.
function randomNumber() {
  arr = [];
  for(let i = 0; i < 16; i++) {
    do {
      number = Math.floor(Math.random() * 16)
    } while (arr.indexOf(number) !== -1)
    arr.push(number)
  }
  return arr;
  }
  // 유효한 배열인지 확인한다.
  function makingArr() {
    randomNumber();
  let count = 0;
  for(let i = 0; i < 16; i++) {
      for(let j = 0; j < 16-i; j++){
        if(arr[i] > arr[j]){
          count++
        }
      }
  }
  if(((count % 2 === 1 && ( 0 <= arr.indexOf(0) <=3 || 8 <= arr.indexOf(0) <= 11))
    || (count % 2 === 0 && ( 4 <= arr.indexOf(0) <= 7 || 12 <= arr.indexOf(0) <= 15)))) {
    return arr;
  } else {
    makingArr();
  }  
  }
  makingArr();
  