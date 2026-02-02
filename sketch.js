let leftGrid = [];  // 왼쪽 격자의 색상 데이터 저장 배열
let rightGrid = []; // 오른쪽 격자의 색상 데이터 저장 배열
let rows = 4;       // 격자의 행 개수
let cols = 4;       // 격자의 열 개수
let showResult = false; // 정답 텍스트 표시 여부 상태 변수
let btn;            // 정답 확인/가리기 버튼 객체

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 사용할 색상 팔레트 정의
  let colors = [
    color(255, 75, 75), // 빨강
    color(75, 255, 75), // 초록
    color(75, 75, 255), // 파랑
    color(255)          // 하양
  ];

  // 1. 초기 데이터 생성: 각 칸에 무작위 색상 할당
  for (let i = 0; i < rows * cols; i++) {
    leftGrid.push(random(colors));
    rightGrid.push(random(colors));
  }

  // 2. 컨트롤 UI(버튼) 설정
  btn = createButton('정답 확인');
  btn.style('width', '150px');       // 버튼 너비 고정 (텍스트 변경 시 크기 유지)
  btn.style('padding', '12px 0px');
  btn.style('font-size', '16px');
  btn.style('cursor', 'pointer');
  btn.position(width / 2 - 75, height - 80); // 하단 중앙 배치
  btn.mousePressed(toggleResult);    // 클릭 시 토글 함수 실행
}

function draw() {
  background(225);

  // 격자 배치 설정
  let gridSize = 400;
  let spacing = 100;
  let startX = (width - (gridSize * 2 + spacing)) / 2;
  let startY = (height - gridSize) / 2;

  // 3. 화면 렌더링: 두 개의 격자 그리기
  displayGrid(startX, startY, gridSize, leftGrid);
  displayGrid(startX + gridSize + spacing, startY, gridSize, rightGrid);

  // 4. 결과 출력 로직
  if (showResult) {
    let diff = compareGrids(); // 두 격자 비교 후 불일치 개수 반환
    
    push();
    fill(0);
    noStroke();
    textSize(36);
    textAlign(CENTER, CENTER);
    // 버튼과 겹치지 않도록 버튼 위에 텍스트 배치
    text("정답: " + diff, width / 2, height - 140);
    pop();
  }
}

/**
 * 버튼 클릭 시 호출: 정답 표시 상태를 토글하고 버튼 텍스트를 변경함
 */
function toggleResult() {
  showResult = !showResult;
  btn.html(showResult ? '정답 가리기' : '정답 확인');
  redraw(); 
}

/**
 * 격자 렌더링 함수: 주어진 위치와 데이터를 바탕으로 사각형들을 그림
 */
function displayGrid(x, y, size, data) {
  let cellSize = size / cols;
  strokeWeight(5); // 칸 테두리 두께
  stroke(0);       // 칸 테두리 색상 (검정)
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let idx = i * cols + j; // 2차원 위치를 1차원 배열 인덱스로 변환
      fill(data[idx]);
      rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);
    }
  }
}

/**
 * 비교 로직 함수: 두 격자 배열을 순회하며 서로 다른 색상의 칸 개수를 카운트함
 */
function compareGrids() {
  let mismatchCount = 0;
  for (let i = 0; i < leftGrid.length; i++) {
    // p5.js 컬러 객체를 문자열로 변환하여 정확하게 비교
    if (leftGrid[i].toString() !== rightGrid[i].toString()) {
      mismatchCount++;
    }
  }
  return mismatchCount;
}