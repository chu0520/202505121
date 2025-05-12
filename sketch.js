let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(400, 400);
  video = createCapture(VIDEO);
  video.size(400, 400); // 設定攝影機影像大小
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);

  stroke(0, 0, 255); // 藍色線條
  strokeWeight(4); // 線條粗度
  noFill();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 畫嘴唇
    const lips = [
      409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
      76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184,
    ];
    drawLines(keypoints, lips);
  }
}

function drawLines(keypoints, indices) {
  if (!keypoints || indices.length === 0) return; // 確保有數據
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    if (keypoints[index]) {
      const [x, y] = keypoints[index];
      // 映射座標到畫布大小
      vertex(x * (width / video.width), y * (height / video.height));
    }
  }
  endShape(CLOSE);
}