function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  
  let rows = 4; // 행 개수
  let cols = 4; // 열 개수
  let size = width / cols; // 칸 하나의 크기 (50px)
  
  let colors = [
    color(255, 75, 75),   // 빨강
    color(75, 255, 75),   // 초록
    color(75, 75, 255),    // 파랑
    color(255, 255, 255)    // 하양
  ];
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * size; // 가로 위치
      let y = i * size; // 세로 위치
      
      let randomColor = random(colors); 
      fill(randomColor);
      
      strokeWeight(5);
      stroke(0); // 테두리 색상 (검은색)
      rect(x, y, size, size); // 사각형 그리기
    }
  }
  
  noLoop(); // 정적 화면일 경우 한 번만 그리도록 설정
}