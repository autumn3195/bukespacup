let leftGrid = [];  // 왼쪽 격자 색상 저장
let rightGrid = []; // 오른쪽 격자 색상 저장
let rows = 4;
let cols = 4;

function setup() {
  createCanvas(900, 900);
  
    let colors = [
    color(255, 75, 75), // 빨강
    color(75, 255, 75), // 파랑
    color(75, 75, 255), // 초록
    color(255)            // 하양
  ];
  
  // 1. 격자 색상 데이터 생성 및 저장
  for (let i = 0; i < rows * cols; i++) {
    leftGrid.push(random(colors));
    rightGrid.push(random(colors));
  }
}

function draw() {
  background(225);
  
  let gridSize = 400;
  let spacing = 100;
  let startX = (width - (gridSize * 2 + spacing)) / 2;
  let startY = (height - gridSize) / 2;
  
  // 2. 저장된 데이터를 바탕으로 격자 그리기
  displayGrid(startX, startY, gridSize, leftGrid);
  displayGrid(startX + gridSize + spacing, startY, gridSize, rightGrid);
  
  // 3. 비교 함수 실행 (결과를 콘솔에 출력)
  let resultCount = compareGrids(); // 결과를 변수에 담습니다.
  
  // 비교 결과 가져오기
  let diff = compareGrids();
  
  // 3. 화면 하단에 결과 텍스트 출력
  push(); // 텍스트 설정이 다른 도형에 영향을 주지 않도록 격리
  fill(0); 
  noStroke(); 
  textSize(40); // 글자를 더 크게
  textAlign(CENTER, CENTER); 
  // y좌표를 height - 60 정도로 여유 있게 조정
  text("정답: " + diff, width / 2, height - 60); 
  pop();

}

// 격자를 화면에 그려주는 함수
function displayGrid(x, y, size, data) {
  let cellSize = size / cols;
  strokeWeight(5); // 테두리 두께를 5px로 설정
  stroke(0);       // 테두리 색상을 검정으로 설정
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let idx = i * cols + j; // 2차원 위치를 1차원 인덱스로 변환
      fill(data[idx]);
      rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);
    }
  }
}

// 핵심: 두 격자의 색상을 비교하는 함수
function compareGrids() {
  let mismatchCount = 0; // 색이 다른 칸의 개수를 저장할 변수
  
  for (let i = 0; i < leftGrid.length; i++) {
    // 두 격자의 색상이 다를 경우에만 count를 증가시킵니다.
    if (leftGrid[i].toString() !== rightGrid[i].toString()) {
      mismatchCount++;
    }
  }
  
  console.log("정답: " + mismatchCount);
  return mismatchCount; // 결과값을 반환합니다.
}