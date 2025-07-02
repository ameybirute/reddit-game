const character = document.getElementById('character');
const mobileControls = document.getElementById('mobile-controls');
const status = document.getElementById('status');
const tryAgainContainer = document.getElementById('tryAgainContainer');

let x = 100;
let y = 0;
let speed = 5;
let isJumping = false;
let jumpCount = 0;
let gameOver = false;
let directionFacing = 1;
let currentUsername = "";

const jumpSound = new Audio("sounds/jump.mp3");

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
if (!isMobile) {
  mobileControls.style.display = 'none';
}

function updatePosition() {
  character.style.left = x + 'px';
  character.style.transform = `scaleX(${directionFacing}) translateY(${-y}px)`;
}

function move(direction) {
  if (isJumping || gameOver) return;

  if (direction === 'left') {
    x = Math.max(0, x - speed);
    directionFacing = -1;
  } else if (direction === 'right') {
    const maxX = window.innerWidth - character.width;
    x = Math.min(maxX, x + speed);
    directionFacing = 1;
  }
  updatePosition();
}

function jump() {
  if (isJumping || gameOver || jumpCount >= 10) return;

  isJumping = true;
  jumpCount++;

  if (jumpCount < 9) {
    status.textContent = `Jump ${10 - jumpCount} times to win`;
  } else {
    const name = currentUsername || "You";
    status.textContent = `${name} lost because of excessive farting`;
    gameOverSound.play();
    gameOver = true;
    tryAgainContainer.style.display = 'block';
  }

  jumpSound.currentTime = 0;
  jumpSound.play();

  let jumpHeight = 100;
  let jumpUp = setInterval(() => {
    if (jumpHeight <= 0) {
      clearInterval(jumpUp);
      fall();
    } else {
      y += 5;
      jumpHeight -= 5;
      updatePosition();
    }
  }, 20);
}

function fall() {
  let ground = 0;
  let fallDown = setInterval(() => {
    if (y <= ground) {
      y = ground;
      updatePosition();
      clearInterval(fallDown);
      isJumping = false;
    } else {
      y -= 5;
      updatePosition();
    }
  }, 20);
}

function loadRedditAvatar() {
  const username = document.getElementById('redditInput').value.trim();
  if (!username) return alert("Please enter a Reddit username.");
  currentUsername = username;
  fetch(`https://www.reddit.com/user/${username}/about.json`)
    .then(res => {
      if (!res.ok) throw new Error("User not found");
      return res.json();
    })
    .then(data => {
      const avatar = data.data.snoovatar_img || data.data.icon_img;
      if (avatar) {
        character.src = avatar;
      } else {
        alert("This user has no custom avatar.");
      }
    })
    .catch(() => alert("Could not fetch avatar. Make sure the username is valid."));
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'arrowleft' || key === 'a') move('left');
  else if (key === 'arrowright' || key === 'd') move('right');
  else if (key === ' ') jump();
});

updatePosition();
