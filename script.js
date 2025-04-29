const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin');
const setNamesButton = document.getElementById('setNames');
const namesInput = document.getElementById('namesInput');
const resultModal = document.getElementById('resultModal');
const resultText = document.getElementById('resultText');

let items = [];
let colors = [];
let numItems = 0;
let arcSize = 0;
let angle = 0;
let spinning = false;

// 色をランダムに作る関数
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 名前をセットする
setNamesButton.addEventListener('click', () => {
  const names = namesInput.value.trim().split('\n').filter(name => name !== '');
  if (names.length === 0) {
    alert('名前を1つ以上入力してください。');
    return;
  }
  if (names.length > 300) {
    alert('名前は最大300人までです。');
    return;
  }

  items = names;
  colors = Array.from({ length: items.length }, getRandomColor);
  numItems = items.length;
  arcSize = (2 * Math.PI) / numItems;
  angle = 0;

  drawWheel();
  spinButton.disabled = false;
  resultModal.classList.add('hidden');
});

// ルーレットを描画
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numItems; i++) {
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, i * arcSize, (i + 1) * arcSize);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();
    ctx.save();

    ctx.translate(200, 200);
    ctx.rotate(i * arcSize + arcSize / 2);
    ctx.fillStyle = '#000';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(items[i].substring(0, 5), 180, 0); // 5文字以内
    ctx.restore();
  }
}

// 回転処理
function spinWheel() {
  if (spinning) return;
  spinning = true;
  resultModal.classList.add('hidden');

  let spinAngle = Math.random() * 360 + 1080; // 3回転以上
  let spinTime = 4000; // 回転時間 4秒
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const progress = Math.min(elapsed / spinTime, 1);
    const easing = 1 - Math.pow(1 - progress, 3); // Ease-out
    angle = (spinAngle * easing) * Math.PI / 180;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle);
    ctx.translate(-200, -200);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      showResult();
    }
  }

  requestAnimationFrame(animate);
}

// 結果判定
function showResult() {
  const degrees = angle * 180 / Math.PI;
  const normalized = (degrees + 90) % 360;
  const index = Math.floor(numItems - (normalized / 360) * numItems) % numItems;
  resultText.textContent = `🎯 ${items[index]} 🎯`;
  resultModal.classList.remove('hidden');
}

// スタートボタン
spinButton.addEventListener('click', spinWheel);