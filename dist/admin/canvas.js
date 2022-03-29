let cv = document.querySelector("canvas");
let rect = cv.getBoundingClientRect();

cv.width = rect.width;
cv.height = rect.height;

let ctx = cv.getContext("2d");
let cvWidth = cv.width;
let cvHeight = cv.height;
const TTL = 500;
const BASE_RADIUS = 30;

const mousePos = { x: cv.width / 2, y: cv.height / 2 };
const noise = new Noise(Math.random());
const speedNoise = new Noise(Math.random());
let mouseDriven = false;
const perlinTimeStart = Date.now();

let trail = [];

const BASE_COLOR = [128, 255, 128];
const TARGET_COLOR = [255, 255, 200];
const colorFn = (mix) =>
`rgb(${BASE_COLOR.map((color, i) => {
  return color + mix * (TARGET_COLOR[i] - color);
})})`;

const MAX_SPEED = 30; //pixel per frame

/*
 * This is based on stackoverflow thread found here:
 * @link https://stackoverflow.com/questions/37476437/how-to-render-html5-canvas-within-a-loop
 */
function bezierTrail() {
  let points = [null, null, null, null];

  for (var i = 0; i < trail.length; i++) {
    let trailPoint = trail[i];
    points[0] = points[1];
    points[1] = points[2];
    points[2] = trailPoint;

    if (points[0] == null) continue;

    let lifeLeft = 1 - (Date.now() - trailPoint.createdAt) / TTL;
    let radius = BASE_RADIUS * lifeLeft;

    var p0 = points[0];
    var p1 = points[1];
    var p2 = points[2];

    var x0 = (p0.x + p1.x) / 2;
    var y0 = (p0.y + p1.y) / 2;

    var x1 = (p1.x + p2.x) / 2;
    var y1 = (p1.y + p2.y) / 2;

    ctx.beginPath();
    ctx.lineWidth = radius * 2;
    ctx.lineCap = "round";

    let x = x1 - x0;
    let y = y1 - y0;

    let speed = Math.min(Math.sqrt(x * x + y * y), MAX_SPEED) / MAX_SPEED;

    ctx.strokeStyle = colorFn(speed);

    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(p1.x, p1.y, x1, y1);
    ctx.stroke();
  }
}

function currentPos() {
  let lastSpeed = 0;

  if (trail.length > 1) {
    let x = mousePos.x - trail[trail.length - 2].x;
    let y = mousePos.y - trail[trail.length - 2].y;
    lastSpeed = Math.min(Math.sqrt(x * x + y * y), MAX_SPEED) / MAX_SPEED;
  }

  let timeSinceMoved = Math.min(
  trail.length > 1 ?
  (Date.now() - trail[trail.length - 2].createdAt) / 1000 :
  1,
  1);


  ctx.beginPath();
  ctx.arc(mousePos.x, mousePos.y, BASE_RADIUS, 0, 2 * Math.PI, false);
  ctx.fillStyle = colorFn((1 - timeSinceMoved) * lastSpeed);
  ctx.fill();
}

function testPath() {
  ctx.save();

  ctx.strokeStyle = "#f00";
  ctx.lineWidth = BASE_RADIUS * 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.moveTo(15, 15);
  ctx.lineTo(90, 60);
  ctx.lineTo(210, 100);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Don't worry, I don't get that part either. It ended up being something totally
 * different, than originally planned, but hey, that how nice things are coming together.
 */
function simulateMovement() {
  let random = noise.perlin3(
  (Date.now() - perlinTimeStart) / 1000,
  mousePos.x / 10000,
  mousePos.y / 10000);

  let randomSpeed = speedNoise.perlin3(
  (Date.now() - perlinTimeStart) / 1000,
  mousePos.x / 10000,
  mousePos.y / 10000);


  let randomRadians = (random * 2 - 1) * Math.PI * 2;
  let toCenter = {
    x: cvWidth / 2 - mousePos.x,
    y: cvHeight / 2 - mousePos.y };

  let radiansToCenter = Math.atan2(toCenter.y, toCenter.x);
  let distanceToCenter = Math.sqrt(
  toCenter.x * toCenter.x + toCenter.y * toCenter.y);

  let areaRadius = 0.9 * Math.min(cvWidth, cvHeight) / 2;
  let pullForce =
  distanceToCenter < areaRadius / 2 ?
  0 :
  (distanceToCenter - areaRadius / 2) * 2 / areaRadius;

  pullForce = Math.min(1, Math.max(pullForce, 0));

  let actualAngle =
  randomRadians * (1 - pullForce) + pullForce * radiansToCenter;

  addPoint({
    x: Math.cos(actualAngle) * (3 + 12 * randomSpeed) + mousePos.x,
    y: Math.sin(actualAngle) * (3 + 12 * randomSpeed) + mousePos.y });

}

function animate() {
  // clear canvas
  ctx.clearRect(0, 0, cvWidth, cvHeight);
  if (!mouseDriven) {
    simulateMovement();
  }
  trail = trail.filter(tp => Date.now() - tp.createdAt < TTL);

  ctx.filter = "blur(3px) opacity(.75)";
  bezierTrail();
  currentPos();
  ctx.filter = "none";
  bezierTrail();

  //testPath();
  currentPos();
  // call again next time we can draw
  requestAnimationFrame(animate);
}

function addPoint(point) {
  trail.push({
    x: point.x,
    y: point.y,
    createdAt: Date.now() });


  mousePos.x = point.x;
  mousePos.y = point.y;
}

let timerToAuto = null;
function resetManualTimer() {
  if (timerToAuto) clearTimeout(timerToAuto);

  mouseDriven = true;
  timerToAuto = setTimeout(_ => mouseDriven = false, 3000);
}

cv.addEventListener("mousemove", function (e) {
  resetManualTimer();
  addPoint({
    x: e.clientX,
    y: e.clientY });

});

cv.addEventListener(
"touchmove",
function (e) {
  resetManualTimer();
  addPoint({
    x: e.touches[0].clientX,
    y: e.touches[0].clientY });

},
false);


requestAnimationFrame(animate);

let resizeBounce = null;
window.addEventListener("resize", function () {
  clearTimeout(resizeBounce);
  resizeBounce = setTimeout(() => {
    var rect = cv.getBoundingClientRect();

    cv.width = rect.width;
    cv.height = rect.height;
    cvWidth = cv.width;
    cvHeight = cv.height;
  }, 250);
});