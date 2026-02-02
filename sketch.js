let leftGrid = [];  // 왼쪽 격자 색상 데이터
let rightGrid = []; // 오른쪽 격자 색상 데이터
let rows = 4, cols = 4;           // 격자 행/열 개수
let currentColorMode = 4;         // 현재 설정된 색상 수
let colors = [];                  // 현재 사용 중인 색상 팔레트
let showResult = false;           // 정답 표시 여부

// UI 요소
let btnL, btnR, btnC;             // 하단 컨트롤 버튼
let colorBtns = [], sizeBtns = []; // 상단 설정 버튼 배열

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 1. 초기 환경 설정 (Default: 4색, 4x4)
  updatePalette(4);
  initGrid('all');

  // 2. 상단 메뉴 버튼 생성 (색상 모드 및 격자 크기)
  createMenuButtons();

  // 3. 하단 컨트롤 버튼 생성 및 초기 위치 설정
  setupControlButtons();
  positionButtons();
}

/**
 * 1. 데이터 관리 함수
 */

// 색상 팔레트 업데이트 (Hex 코드로 안전하게 관리)
function updatePalette(num) {
  const fullPalette = ['#FF4B4B', '#4BFF4B', '#4B4BFF', '#FFFF4B', '#FF4BFF', '#FFFFFF'];
  colors = fullPalette.slice(0, num);
}

// 격자 데이터 무작위 생성
function initGrid(side) {
  if (side === 'all') {
    initGrid('left');
    initGrid('right');
    return;
  }
  let target = (side === 'left') ? leftGrid : rightGrid;
  target.length = 0;
  for (let i = 0; i < rows * cols; i++) {
    target.push(random(colors));
  }
  showResult = false; // 데이터가 바뀌면 정답은 항상 숨김
  if (btnC) btnC.html('정답 확인');
  redraw();
}

// 두 격자의 색상을 비교하여 다른 칸의 개수 반환
function checkDiff() {
  let count = 0;
  for (let i = 0; i < leftGrid.length; i++) {
    if (leftGrid[i] !== rightGrid[i]) count++;
  }
  return count;
}

/**
 * 2. 화면 렌더링 함수
 */

function draw() {
  background(225);

  // 상단 우측 정보창 표시
  renderInfoText();

  // 중앙 격자 영역 계산 (상단/하단 영역 침범 방지)
  let availableHeight = height - 350; // 상단 메뉴(150px) + 하단 공간(200px) 제외
  let gridSize = min(width * 0.35, availableHeight * 0.9); 
  let spacing = 100;
  let startX = (width - (gridSize * 2 + spacing)) / 2;
  let startY = 150 + (availableHeight - gridSize) / 2; 

  // 격자 그리기
  renderGrid(startX, startY, gridSize, leftGrid);
  renderGrid(startX + gridSize + spacing, startY, gridSize, rightGrid);

  // 정답 텍스트 표시
  if (showResult) {
    renderResultText();
  }
  noLoop();
}

// 격자 렌더링
function renderGrid(x, y, size, data) {
  let cellSize = size / cols;
  strokeWeight(5); stroke(0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let c = data[i * cols + j];
      if (c) { 
        fill(c); 
        rect(x + j * cellSize, y + i * cellSize, cellSize, cellSize);
      }
    }
  }
}

// 우측 상단 현재 모드 텍스트
function renderInfoText() {
  push();
  fill(80); noStroke(); textSize(18); textAlign(RIGHT, TOP);
  text(`색상: ${currentColorMode}색 모드`, width - 20, 25);
  text(`크기: ${rows}x${cols}`, width - 20, 50);
  pop();
}

// 하단 중앙 정답 텍스트
function renderResultText() {
  let diff = checkDiff();
  push();
  fill(255, 50, 50); noStroke(); textSize(32); textStyle(BOLD); textAlign(CENTER, CENTER);
  text("정답: " + diff, width / 2, height - 160); 
  pop();
}

/**
 * 3. 인터페이스 및 버튼 제어 함수
 */

function createMenuButtons() {
  for (let i = 4; i <= 6; i++) {
    // 색상 버튼
    let bColor = createButton(i + '색 모드');
    bColor.position(20 + (i - 4) * 130, 20);
    styleMenuButton(bColor);
    bColor.mousePressed(() => { currentColorMode = i; updatePalette(i); initGrid('all'); });
    
    // 크기 버튼
    let bSize = createButton(i + 'x' + i);
    bSize.position(20 + (i - 4) * 130, 75);
    styleMenuButton(bSize);
    bSize.mousePressed(() => { rows = i; cols = i; initGrid('all'); });
  }
}

function setupControlButtons() {
  btnL = createButton('왼쪽 리셋');
  btnC = createButton('정답 확인');
  btnR = createButton('오른쪽 리셋');
  
  [btnL, btnC, btnR].forEach(btn => {
    btn.style('width', '120px'); btn.style('padding', '10px 0'); btn.style('cursor', 'pointer');
  });

  btnL.mousePressed(() => initGrid('left'));
  btnR.mousePressed(() => initGrid('right'));
  btnC.mousePressed(toggleResult);
}

function styleMenuButton(b) {
  b.style('width', '120px'); b.style('padding', '10px 0'); b.style('font-size', '16px');
  b.style('cursor', 'pointer'); b.style('background-color', '#f9f9f9');
  b.style('border', '1px solid #ccc'); b.style('border-radius', '5px');
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
  redraw();
}