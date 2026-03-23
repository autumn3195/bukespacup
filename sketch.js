/**
 * 틀린 색 찾기 게임 (Spot the Difference - Color Edition)
 * 최종 통합 버전: 알록달록 & 단색 모드 (밝기 최적화)
 */

let leftGrid = [];  // 왼쪽 격자 색상 데이터
let rightGrid = []; // 오른쪽 격자 색상 데이터
let rows = 4, cols = 4;           // 격자 행/열 개수 (기본 4x4)
let currentColorMode = "알록달록";   // 현재 모드 이름
let colors = [];                  // 현재 사용 중인 색상 팔레트
let showResult = false;           // 정답 표시 여부

// UI 요소
let btnL, btnR, btnC;             // 하단 컨트롤 버튼
let modeBtn1, modeBtn2, sizeBtns = []; // 상단 메뉴 버튼

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 1. 초기 환경 설정 (기본값: 알록달록 6색, 4x4)
  updatePalette('colorful');
  initGrid('all');

  // 2. 상단 메뉴 버튼 생성 (모드 선택 및 크기 조절)
  createMenuButtons();

  // 3. 하단 컨트롤 버튼 생성 및 초기 위치 설정
  setupControlButtons();
  positionButtons();
}

/**
 * 1. 데이터 및 로직 관리 함수
 */

// 색상 팔레트 업데이트 (모드에 따라 색상 생성)
function updatePalette(mode) {
  // 단색 모드를 위한 기준 색상 (HSB 값)
  const baseColors = [
    { name: '빨강', h: 0, s: 85 },
    { name: '초록', h: 120, s: 85 },
    { name: '파랑', h: 220, s: 85 },
    { name: '노랑', h: 60, s: 90 },
    { name: '보라', h: 280, s: 85 },
    { name: '하양', h: 0, s: 0 }
  ];

  if (mode === 'colorful') {
    // 알록달록 모드: 6가지 뚜렷한 색상
    colors = ['#FF4B4B', '#4BFF4B', '#4B4BFF', '#FFFF4B', '#FF4BFF', '#FFFFFF'];
    currentColorMode = "알록달록";
  } else if (mode === 'monochrome') {
    // 단색 모드: 기준 색 중 하나를 랜덤 선택하여 밝은 톤의 6단계 생성
    let picked = random(baseColors);
    currentColorMode = `단색 모드 (${picked.name})`;
    
    colors = [];
    colorMode(HSB, 360, 100, 100); // 색상 계산을 위해 HSB 모드로 전환

    for (let i = 0; i < 6; i++) {
      // 밝기 범위를 50% ~ 100%로 설정하여 어두운(검은) 색 방지
      let b = map(i, 0, 5, 50, 100); 
      let s = picked.s;
      if (s > 0) { // 하양 모드가 아닐 때만 채도 조절
        s = map(b, 50, 100, picked.s - 15, picked.s);
      }
      let c = color(picked.h, s, b);
      colors.push(c.toString('#rrggbb')); // 다시 Hex 문자열로 저장
    }
    colorMode(RGB, 255); // 기본 RGB 모드로 복구
  }
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
  showResult = false; // 판이 바뀌면 정답 숨김
  if (btnC) btnC.html('정답 확인');
  redraw();
}

// 두 격자를 비교하여 불일치 개수 반환
function checkDiff() {
  let count = 0;
  for (let i = 0; i < leftGrid.length; i++) {
    if (leftGrid[i] !== rightGrid[i]) count++;
  }
  return count;
}

/**
 * 2. 화면 렌더링 함수 (레이아웃 최적화)
 */

function draw() {
  background(225);

  // 우측 상단 현재 설정 정보
  renderInfoText();

  // 중앙 격자 영역 계산 (상단 메뉴와 하단 버튼 사이의 빈 공간 사용)
  let availableHeight = height - 350; 
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

// 격자 칸 렌더링
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

// 정보 텍스트 (우측 상단)
function renderInfoText() {
  push();
  fill(80); noStroke(); textSize(18); textAlign(RIGHT, TOP);
  text(`모드: ${currentColorMode}`, width - 20, 25);
  text(`크기: ${rows}x${cols}`, width - 20, 50);
  pop();
}

// 정답 숫자 (하단 중앙)
function renderResultText() {
  let diff = checkDiff();
  push();
  fill(255, 50, 50); noStroke(); textSize(40); textStyle(BOLD); textAlign(CENTER, CENTER);
  text("정답: " + diff, width / 2, height - 160); 
  pop();
}

/**
 * 3. 인터페이스 및 버튼 제어
 */

function createMenuButtons() {
  // 알록달록 모드 버튼
  modeBtn1 = createButton('알록달록');
  modeBtn1.position(20, 20);
  styleMenuButton(modeBtn1);
  modeBtn1.mousePressed(() => { updatePalette('colorful'); initGrid('all'); });

  // 단색 모드 버튼
  modeBtn2 = createButton('단색 모드');
  modeBtn2.position(150, 20);
  styleMenuButton(modeBtn2);
  modeBtn2.mousePressed(() => { updatePalette('monochrome'); initGrid('all'); });

  // 격자 크기 조절 버튼 (4x4 ~ 6x6)
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