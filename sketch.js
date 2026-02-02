let leftGrid = [], rightGrid = []; 
let rows = 4, cols = 4;       
let showResult = false; 
let btnL, btnR, btnC; // 왼쪽(Left), 오른쪽(Right), 확인(Check) 버튼
let colors;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  colors = [color(255, 75, 75), color(75, 255, 75), color(75, 75, 255), color(255)];

  // 1. 격자 초기 생성
  initGrid('left');
  initGrid('right');

  // 2. 버튼 생성
  btnL = createButton('왼쪽 리셋');
  btnC = createButton('정답 확인');
  btnR = createButton('오른쪽 리셋');

  // 버튼 스타일 및 이벤트 연결
  [btnL, btnC, btnR].forEach(btn => {
    btn.style('width', '120px');
    btn.style('padding', '10px 0');
    btn.style('cursor', 'pointer');
  });

  btnL.mousePressed(() => initGrid('left'));
  btnR.mousePressed(() => initGrid('right'));
  btnC.mousePressed(toggleResult);

  positionButtons();
}

// 격자 데이터 생성 함수
function initGrid(side) {
  let target = (side === 'left') ? leftGrid : rightGrid;
  target.length = 0;
  for (let i = 0; i < rows * cols; i++) {
    target.push(random(colors));
  }
  showResult = false; // 판이 바뀌면 정답 가림
  if (btnC) btnC.html('정답 확인');
  redraw();
}

function draw() {
  background(225);

  let gridSize = min(width * 0.35, height * 0.5); 
  let spacing = 100;
  let startX = (width - (gridSize * 2 + spacing)) / 2;
  let startY = (height - gridSize) / 2 - 50;

  // 3. 격자 그리기
  renderGrid(startX, startY, gridSize, leftGrid);
  renderGrid(startX + gridSize + spacing, startY, gridSize, rightGrid);

  // 4. 정답 표시
  if (showResult) {
    let diff = checkDiff();
    fill(0); noStroke(); textSize(40); textAlign(CENTER, CENTER);
    text("정답: " + diff, width / 2, height - 150);
  }
  noLoop();
}

// 화면에 격자를 그려주는 함수
function renderGrid(x, y, size, data) {
  let cellSize = size / cols;
  strokeWeight(3); stroke(0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      fill(data[i * cols + j]);
      rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);
    }
  }
}

// 두 격자를 비교하는 함수
function checkDiff() {
  let count = 0;
  for (let i = 0; i < leftGrid.length; i++) {
    if (leftGrid[i].toString() !== rightGrid[i].toString()) count++;
  }
  return count;
}

function toggleResult() {
  showResult = !showResult;
  btnC.html(showResult ? '정답 가리기' : '정답 확인');
  redraw(); 
}

function positionButtons() {
  let x = width / 2;
  let y = height - 80;
  btnL.position(x - 200, y);
  btnC.position(x - 60, y);
  btnR.position(x + 80, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  positionButtons();
}