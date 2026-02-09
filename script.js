document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const resetBtn = document.getElementById('resetBtn');

    // Confetti Logic
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let confetti = [];
    const colors = ['#ff3366', '#ff99cc', '#ffffff', '#ff0000', '#ff66b2'];

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Draw heart shape
            let x = 0;
            let y = 0;
            let width = this.size;
            let height = this.size;

            ctx.moveTo(x, y + height / 4);
            ctx.quadraticCurveTo(x, y, x + width / 4, y);
            ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + height / 4);
            ctx.quadraticCurveTo(x + width / 2, y, x + width * 3 / 4, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + height / 4);
            ctx.quadraticCurveTo(x + width, y + height / 2, x + width / 2, y + height * 7 / 8);
            ctx.quadraticCurveTo(x, y + height / 2, x, y + height / 4);

            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
    }

    let animationId;
    function startConfetti() {
        if (animationId) return; // Prevent multiple loops
        confetti = [];
        for (let i = 0; i < 100; i++) {
            confetti.push(new ConfettiPiece());
        }
        animateConfetti();
    }

    function stopConfetti() {
        cancelAnimationFrame(animationId);
        animationId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animateConfetti);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });


    // Heart Spawning Logic
    function createHeart() {
        if (document.hidden) return;

        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.innerHTML = '❤';

        // Random properties
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4-7s
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';

        document.body.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }

    function createRisingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('rising-heart');

        heart.innerHTML = '❤';

        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's'; // 5-10s
        heart.style.fontSize = Math.random() * 25 + 15 + 'px';
        heart.style.opacity = Math.random() * 0.6 + 0.4;

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 11000);
    }

    // Spawn falling hearts initially
    setInterval(createHeart, 1500);

    let heartInterval; // For rising hearts during play


    // Audio Player
    const audio = new Audio('Sincare - PURPEECH Official MV.mp3');
    audio.loop = true;
    let isPlaying = false;
    const musicBtn = document.getElementById('musicBtn');

    // Vinyl Elements
    const vinylContainer = document.querySelector('.vinyl-container');
    const mainContainer = document.querySelector('.container');
    const vinylRecord = document.getElementById('vinylRecord');
    const tonearm = document.getElementById('tonearm');
    const backBtn = document.getElementById('backBtn');

    // Progress Bar Elements
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Update duration when metadata loads
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
        progressBar.max = Math.floor(audio.duration);
    });

    // Update progress bar as song plays
    audio.addEventListener('timeupdate', () => {
        currentTimeEl.textContent = formatTime(audio.currentTime);
        progressBar.value = Math.floor(audio.currentTime);
    });

    // Seek when user slides
    progressBar.addEventListener('input', () => {
        audio.currentTime = progressBar.value;
    });


    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        //Switch screens
        mainContainer.classList.add('hidden');
        mainContainer.style.display = 'none';
        vinylContainer.classList.remove('hidden');

        // Stop other heavy animations
        stopConfetti();


        // Helper to prepare and play
        const prepareAndPlay = () => {
            if (mainContainer.style.display !== 'none') return;

            if (Math.abs(audio.currentTime - 93) > 1) {
                audio.currentTime = 93;
            }

            audio.play().then(() => {
                isPlaying = true;
                vinylRecord.classList.add('spinning');
                tonearm.classList.add('active');
                vinylContainer.classList.add('playing');
                musicBtn.innerHTML = 'เล่นอยู่...';
                musicBtn.classList.add('playing');

                // Start rising hearts
                heartInterval = setInterval(createRisingHeart, 1500);
            }).catch(error => {
                console.error("Playback failed:", error);
            });
        };

        // Check state
        if (audio.readyState >= 1) { // METADATA_LOADED
            prepareAndPlay();
        } else {
            audio.addEventListener('loadedmetadata', prepareAndPlay, { once: true });
            audio.load();
        }
    });

    // Toggle Play/Pause when clicking the record
    vinylRecord.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            vinylRecord.classList.remove('spinning');
            tonearm.classList.remove('active');
            vinylContainer.classList.remove('playing');
            clearInterval(heartInterval);
        } else {
            audio.play().then(() => {
                isPlaying = true;
                vinylRecord.classList.add('spinning');
                tonearm.classList.add('active');
                vinylContainer.classList.add('playing');
                heartInterval = setInterval(createRisingHeart, 1500);
            }).catch(error => {
                console.error("Playback failed or interrupted:", error);
            });
        }
    });

    backBtn.addEventListener('click', () => {
        vinylContainer.classList.add('hidden');
        mainContainer.style.display = 'flex';

        audio.pause();
        audio.currentTime = 0; // Reset
        isPlaying = false;
        vinylRecord.classList.remove('spinning');
        tonearm.classList.remove('active');
        vinylContainer.classList.remove('playing');
        musicBtn.innerHTML = 'เพลงนี้มอบให้เธอ 🎵';
        musicBtn.classList.remove('playing');

        clearInterval(heartInterval);
        document.querySelectorAll('.rising-heart').forEach(n => n.remove());
    });

    // Interaction
    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');

            // Music will only play when the "เพลงนี้มอบให้เธอ" button is clicked.
            // We can optionally "unlock" the audio context silently for better reliability later:
            audio.play().then(() => audio.pause()).catch(() => { });

            setTimeout(() => {
                startConfetti();
            }, 600); // Wait for flap animation
        }
    });

    resetBtn.addEventListener('click', () => {
        envelope.classList.remove('open');
        stopConfetti();
    });
});
