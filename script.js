/* ═══════════════════════════════════════════════════════
   💜 PURPLE PERSON — Birthday Surprise Script
   Best-friend energy · Playful · Mobile-first
   ═══════════════════════════════════════════════════════ */

// ── State ──
let noClickCount = 0;

// Custom playful messages — best-friend tone
const teaseMessages = [
  "Are you sure about that? 🤨",
  "Okay okay, you're funny. But I know you wanted to say YES… that's why I made this 💜",
  "Did you accidentally press NO or do you really want to say no? 🧐",
  "Don't make me mad… I will cut off your NO 😤",
  "Fine. I'm removing the wrong option for you 💜",
];


// ── Background Slideshow ──
// Slideshow only starts when YES is clicked
function activateSlideshow() {
  const slideshow = document.getElementById('slideshow');
  const slides = document.querySelectorAll('.slide');
  if (!slideshow || slides.length === 0) return;

  // Fade in the slideshow
  slideshow.classList.add('slideshow-active');

  let current = 0;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000); // change every 5 seconds
}


// ── Particles Background ──
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.speedY = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.35 + 0.08;
      this.hue = 270 + Math.random() * 30;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 60%, 70%, ${this.opacity})`;
      ctx.fill();
      // soft glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 60%, 70%, ${this.opacity * 0.12})`;
      ctx.fill();
    }
  }

  // fewer particles on mobile for performance
  const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

initParticles();


// ── Typing Effect ──
function typeText(element, text, speed = 42) {
  return new Promise(resolve => {
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    element.innerHTML = '';
    element.appendChild(cursor);

    function type() {
      if (i < text.length) {
        const charNode = document.createTextNode(text.charAt(i));
        element.insertBefore(charNode, cursor);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          if (cursor.parentElement) cursor.remove();
          resolve();
        }, 350);
      }
    }
    type();
  });
}


// ── Start Intro (no loading screen, starts immediately) ──
async function startIntro() {
  const introEl = document.getElementById('intro-text');
  const questionWrapper = document.getElementById('question-wrapper');
  const buttonsArea = document.getElementById('buttons-area');

  await sleep(500);
  await typeText(introEl, "Hey… before you continue…");
  await sleep(500);
  await typeText(introEl, "answer this one thing…");
  await sleep(700);

  // show question
  questionWrapper.classList.add('visible');
  const mainQ = document.getElementById('main-question');
  await typeText(mainQ, "Will you always be my purple person?", 50);

  // show buttons
  await sleep(400);
  buttonsArea.classList.add('visible');
}

// Start immediately when page loads
window.addEventListener('DOMContentLoaded', () => {
  startIntro();
});


// ── Floating reaction emojis per NO click ──
const reactionEmojis = ['😤', '🧐', '😭', '✂️', '💥'];

// ── Handle NO Button ──
function handleNo() {
  noClickCount++;
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const teaseMsg = document.getElementById('tease-msg');
  const card = document.querySelector('.glass-card');

  // ── 1. Card shakes with judgement ──
  card.classList.remove('shake');
  void card.offsetWidth; // force reflow to restart animation
  card.classList.add('shake');
  setTimeout(() => card.classList.remove('shake'), 600);

  // ── 2. Float a reaction emoji above the card ──
  const emoji = reactionEmojis[Math.min(noClickCount - 1, reactionEmojis.length - 1)];
  const reaction = document.createElement('span');
  reaction.className = 'reaction-pop';
  reaction.textContent = emoji;
  // randomise left position slightly
  reaction.style.left = `${40 + Math.random() * 20}%`;
  card.appendChild(reaction);
  setTimeout(() => reaction.remove(), 1800);

  // ── 3. Show tease message with bounce ──
  const msgIndex = Math.min(noClickCount - 1, teaseMessages.length - 1);
  teaseMsg.textContent = teaseMessages[msgIndex];
  teaseMsg.classList.remove('bounce-in', 'visible');
  void teaseMsg.offsetWidth; // reflow
  teaseMsg.classList.add('visible', 'bounce-in');

  // ── 4. YES button does a happy dance (it's winning!) ──
  btnYes.classList.remove('happy-dance', 'growing');
  void btnYes.offsetWidth;
  btnYes.classList.add('happy-dance');
  setTimeout(() => btnYes.classList.remove('happy-dance'), 750);

  // ── 5. NO button progressively dies ──
  if (noClickCount === 1) {
    // Panic flash — turns red briefly then calms down
    btnNo.classList.add('panic');
    setTimeout(() => {
      btnNo.classList.remove('panic');
      btnNo.classList.add('shrinking');
    }, 650);
    setTimeout(() => btnNo.classList.remove('shrinking'), 1200);

  } else if (noClickCount === 2) {
    btnNo.classList.remove('panic');
    btnNo.classList.add('tiny');

  } else if (noClickCount === 3) {
    btnNo.classList.remove('tiny');
    btnNo.classList.add('tinier');

  } else if (noClickCount === 4) {
    // "I will cut off your NO" — barely visible, spinning into oblivion
    btnNo.classList.remove('tinier');
    btnNo.style.fontSize = '0.35rem';
    btnNo.style.padding = '3px 8px';
    btnNo.style.opacity = '0.15';
    btnNo.style.animation = 'tinier-spin 1.5s linear infinite';
  }

  // ── 6. 5th click — GONE ──
  if (noClickCount >= 5) {
    btnNo.classList.add('explode');
    setTimeout(() => {
      btnNo.style.display = 'none';
    }, 700);
    btnYes.style.transform = 'scale(1.15)';
    btnYes.style.boxShadow = '0 8px 40px rgba(107, 63, 160, 0.65)';
  }
}


// ── Dynamic Response Messages ──
const dynamicResponses = [
  { emoji: "😳", text: "Hmm… I didn't expect you to say yes that fast 😳💜" },
  { emoji: "😏", text: "Wait… was that first 'no' just an accident? 😏" },
  { emoji: "😌", text: "Ahh… took you two tries to decide, huh? 😌💜" },
  { emoji: "😏", text: "Three times saying no… just to finally say yes? Interesting 😏💜" },
];

function getDynamicResponse(noClicks) {
  if (noClicks <= 3) {
    return dynamicResponses[noClicks];
  }
  return {
    emoji: "💜",
    text: `It took you ${noClicks} times to say no… but you still chose yes in the end 💜`,
  };
}


// ── Handle YES Button ──
async function handleYes() {
  const btnNo = document.getElementById('btn-no');
  const btnYes = document.getElementById('btn-yes');
  const sceneQuestion = document.getElementById('scene-question');
  const sceneResponse = document.getElementById('scene-response');
  const sceneReveal = document.getElementById('scene-reveal');

  // NO button explodes if still visible
  if (btnNo.style.display !== 'none') {
    btnNo.classList.add('explode');
  }

  // YES button pulse
  btnYes.style.transform = 'scale(1.3)';
  btnYes.style.boxShadow = '0 0 60px rgba(192, 132, 252, 0.8)';
  btnYes.style.pointerEvents = 'none';

  // Launch confetti
  launchConfetti();

  await sleep(1200);

  // Fade out question scene
  sceneQuestion.style.transition = 'opacity 1s ease, transform 1s ease';
  sceneQuestion.style.opacity = '0';
  sceneQuestion.style.transform = 'scale(0.92)';

  await sleep(1000);
  sceneQuestion.style.display = 'none';

  // ── Show dynamic response (NO images yet — clean background) ──
  const response = getDynamicResponse(noClickCount);
  document.getElementById('response-emoji').textContent = response.emoji;
  document.getElementById('response-text').textContent = response.text;

  sceneResponse.classList.remove('scene-hidden');
  sceneResponse.classList.add('scene-visible');

  // Hold the response message
  await sleep(3500);

  // Fade out the response scene
  sceneResponse.classList.add('scene-fade-out');

  await sleep(1000);
  sceneResponse.style.display = 'none';

  // ── NOW activate the slideshow (images appear here) ──
  activateSlideshow();

  // Show reveal scene
  sceneReveal.classList.remove('scene-hidden');
  sceneReveal.classList.add('scene-visible');

  await sleep(600);
  startRevealSequence();
}


// ── Reveal Sequence (Cinematic Typing) ──
async function startRevealSequence() {
  const block = document.getElementById('cinematic-block');
  const finalMsg = document.getElementById('final-message');
  block.classList.add('visible');

  await sleep(400);

  const lines = [
    "You know what's crazy?",
    "Out of literally billions of people on this planet…",
    "somehow, I found you. And I started messaging you.",
    "Now we became best friends.",
    "And this… is for you 💜",
  ];

  for (let i = 0; i < lines.length; i++) {
    const lineEl = document.getElementById(`typing-line-${i + 1}`);
    await typeText(lineEl, lines[i], 38);
    await sleep(600);
  }

  await sleep(1200);

  // Fade OUT the cinematic text
  block.style.transition = 'opacity 1s ease, transform 1s ease';
  block.style.opacity = '0';
  block.style.transform = 'translateY(-20px)';

  await sleep(1000);
  block.style.display = 'none';

  // Fade IN the final birthday message (same viewport, no scroll)
  finalMsg.classList.add('visible');

  // Spawn floating hearts
  spawnHearts();

  // Another confetti burst for the grand finale
  await sleep(800);
  launchConfetti();
}


// ── Confetti System ──
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  const colors = [
    '#c084fc', '#e2b8f5', '#f0abfc', '#9b6dd7',
    '#fb7185', '#f3e8ff', '#a78bfa', '#d946ef',
  ];

  const count = window.innerWidth < 500 ? 80 : 150; // fewer on mobile

  for (let i = 0; i < count; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * canvas.height * 0.5,
      w: Math.random() * 7 + 3,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 1.5,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 180;

  function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = false;
    confetti.forEach(c => {
      if (c.y < canvas.height + 20 && c.opacity > 0) {
        alive = true;
        c.y += c.speedY;
        c.x += c.speedX;
        c.rotation += c.rotSpeed;
        if (frame > maxFrames * 0.6) {
          c.opacity -= 0.012;
        }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, c.opacity);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    });

    if (alive && frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}


// ── Hearts Burst ──
function spawnHearts() {
  const container = document.getElementById('heart-burst');
  const emojis = ['💜', '💟', '🤍', '✨', '💜'];

  for (let i = 0; i < 12; i++) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDelay = `${Math.random() * 2}s`;
    heart.style.fontSize = `${Math.random() * 1 + 0.8}rem`;
    container.appendChild(heart);
  }
}


// ── Easter Egg (tap 7 times on background) ──
let clickCount = 0;
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;

  clickCount++;
  if (clickCount === 7) {
    const egg = document.getElementById('easter-egg');
    egg.classList.add('show');
    setTimeout(() => egg.classList.remove('show'), 4000);
  }
});


// ── Utility ──
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
