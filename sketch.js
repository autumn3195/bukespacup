/**
 * 틀린 색 찾기 게임 - 단색 모드 구현 버전
 */

let leftGrid = [];  
let rightGrid = []; 
let rows = 4, cols = 4;           
let currentColorMode = "알록달록";   
let colors = [];                  
let showResult = false;           

let btnL, btnR, btnC;             
let modeBtn1, modeBtn2, sizeBtns = []; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 초기 실행: 알록달록 모드
  updatePalette('colorful');
  initGrid('all');

  createMenuButtons();
  setupControlButtons();
  positionButtons();
}

/**
 * 1. 데이터 관리 함수
 */

function updatePalette(mode) {
  const baseColors = [
    { name: '빨강', h: 0, s: 80 },
    { name: '초록', h: 120, s: 80 },
    { name: '파랑', h: 220, s: 80 },
    { name: '노랑', h: 60, s: 80 },
    { name: '보라', h: 280, s: 80 },
    { name: '하양', h: 0, s: 0 }
  ];

  if (mode === 'colorful') {
    // 알록달록 모드: 기존의 6가지 뚜렷한 색상
    colors = ['#FF4B4B', '#4BFF4B', '#4B4BFF', '#FFFF4B', '#FF4BFF', '#FFFFFF'];
    currentColorMode = "알록달록";
  } else if (mode === 'monochrome') {
    // 단색 모드: 6가지 기준 색상 중 하나를 랜덤 선택
    let picked = random(baseColors);
    currentColorMode = `단색 모드 (${picked.name})`;
    
    // 선택된 색상의 밝기(Brightness)만 6단계로 조절하여 팔레트 생성
    colors = [];
    colorMode(HSB, 360, 100, 100); // 색상 계산을 위해 HSB 모드 사용
    for (let i = 0; i < 6; i++) {
      // 밝기를 30%에서 100%까지 6단계로 나눔
      let b = map(i, 0, 5, 30, 100);
      let c = color(picked.h, picked.s, b);
      colors.push(c.toString('#rrggbb')); // 다시 Hex 문자열로 변환하여 저장
    }
    colorMode(RGB, 255); // 다시 기본 RGB 모드로 복구
  }
}

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
  showResult = false;
  if (btnC) btnC.html('정답 확인');
  redraw();
}

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

  renderInfoText();

  let availableHeight = height - 350; 
  let gridSize = min(width * 0.35, availableHeight * 0.9); 
  let spacing = 100;
  let startX = (width - (gridSize * 2 + spacing)) / 2;
  let startY = 150 + (availableHeight - gridSize) / 2; 

  renderGrid(startX, startY, gridSize, leftGrid);
  renderGrid(startX + gridSize + spacing, startY, gridSize, rightGrid);

  if (showResult) {
    renderResultText();
  }
  noLoop();
}

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

function renderInfoText() {
  push();
  fill(80); noStroke(); textSize(18); textAlign(RIGHT, TOP);
  text(`모드: ${currentColorMode}`, width - 20, 25);
  text(`크기: ${rows}x${cols}`, width - 20, 50);
  pop();
}

function renderResultText() {
  let diff = checkDiff();
  push();
  fill(255, 50, 50); noStroke(); textSize(36); textStyle(BOLD); textAlign(CENTER, CENTER);
  text("정답: " + diff, width / 2, height - 160); 
  pop();
}

/**
 * 3. 인터페이스 및 버튼 제어 함수
 */

function createMenuButtons() {
  modeBtn1 = createButton('알록달록');
  modeBtn1.position(20, 20);
  styleMenuButton(modeBtn1);
  modeBtn1.mousePressed(() => {
    updatePalette('colorful');
    initGrid('all');
  });

  modeBtn2 = createButton('단색 모드');
  modeBtn2.position(150, 20);
  styleMenuButton(modeBtn2);
  modeBtn2.mousePressed(() => {
    updatePalette('monochrome'); // 이제 실제로 작동합니다!
    initGrid('all');
  });

  for (let i = 4; i <= 6; i++) {
    let bSize = createButton(i + 'x' + i);
    bSize.position(20 + (i - 4) * 130, 75);
    styleMenuButton(bSize);
    bSize.mousePressed(() => { rows = i; cols = i; initGrid('all'); });
    sizeBtns.push(bSize);
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