let leftGrid = [], rightGrid = []; 
let rows = 4, cols = 4;       
let showResult = false; 
let btnL, btnR, btnC; 
let colorBtns = [], sizeBtns = []; 
let colors = [];      
let currentColorMode = 4; // 현재 색상 모드 저장용 변수

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  updatePalette(4);
  initGrid('all');

  // 상단 색상 선택 버튼 (4~6색)
  for (let i = 4; i <= 6; i++) {
    let b = createButton(i + '색 모드');
    b.position(20 + (i - 4) * 130, 20); 
    styleMenuButton(b);
    b.mousePressed(() => {
      currentColorMode = i; // 색상 모드 상태 업데이트
      updatePalette(i);
      initGrid('all');
    });
    colorBtns.push(b);
  }

  // 상단 격자 크기 선택 버튼 (4x4~6x6)
  for (let i = 4; i <= 6; i++) {
    let b = createButton(i + 'x' + i);
    b.position(20 + (i - 4) * 130, 75); 
    styleMenuButton(b);
    b.mousePressed(() => {
      rows = i;
      cols = i;
      initGrid('all');
    });
    sizeBtns.push(b);
  }

  // 하단 컨트롤 버튼
  btnL = createButton('왼쪽 리셋');
  btnC = createButton('정답 확인');
  btnR = createButton('오른쪽 리셋');
  
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

function styleMenuButton(b) {
  b.style('width', '120px');
  b.style('padding', '10px 0');
  b.style('font-size', '16px');
  b.style('cursor', 'pointer');
  b.style('background-color', '#f9f9f9');
  b.style('border', '1px solid #ccc');
  b.style('border-radius', '5px');
}

function updatePalette(num) {
  const fullPalette = ['#FF4B4B', '#4BFF4B', '#4B4BFF', '#FFFF4B', '#FF4BFF', '#FFFFFF'];
  colors = fullPalette.slice(0, num);
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

function draw() {
  background(225);

  // --- 현재 모드 정보 표시 (우측 상단) ---
  push();
  fill(50);
  noStroke();
  textSize(20);
  textAlign(RIGHT, TOP);
  // 텍스트 위치: 오른쪽 끝에서 20px, 위에서 20px 여백
  text(`색상: ${currentColorMode}색`, width - 20, 25);
  text(`크기: ${rows}x${cols}`, width - 20, 55);
  pop();

  let gridSize = min(width * 0.35, height * 0.5); 
  let spacing = 100;
  let startX = (width - (gridSize * 2 + spacing)) / 2;
  let startY = (height - gridSize) / 2;

  renderGrid(startX, startY, gridSize, leftGrid);
  renderGrid(startX + gridSize + spacing, startY, gridSize, rightGrid);

  if (showResult) {
    let diff = checkDiff();
    fill(0); noStroke(); textSize(40); textAlign(CENTER, CENTER);
    text("정답: " + diff, width / 2, height - 150);
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

function checkDiff() {
  let count = 0;
  for (let i = 0; i < leftGrid.length; i++) {
    if (leftGrid[i] !== rightGrid[i]) count++;
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
  redraw(); // 창 크기 조절 시 텍스트도 다시 그려야 하므로 추가
}