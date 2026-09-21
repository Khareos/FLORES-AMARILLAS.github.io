// --- MOTOR DE CANVAS 2D PARA LLUVIA Y EXPLOSIONES DE FLORES Y CORAZONES ---
const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

let width, height;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Arreglo de partículas
const particles = [];
const symbols = ['🌻', '🌼', '💛', '❤️', '🌸', '💖', '✨', '⭐', '💕'];

class Particle {
    constructor(x, y, isBurst = false) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : -30;
        this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
        this.size = Math.random() * 18 + 16;

        if (isBurst) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.gravity = 0.15;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
        } else {
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = Math.random() * 2 + 1.5;
            this.gravity = 0;
            this.alpha = Math.random() * 0.7 + 0.3;
            this.decay = 0;
        }

        this.rotation = Math.random() * Math.PI * 2;
        this.vRot = (Math.random() - 0.5) * 0.05;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.vRot;

        if (this.decay > 0) {
            this.alpha -= this.decay;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = `${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);
        ctx.restore();
    }
}

// Bucle continuo de renderizado a 60 FPS
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Generación periódica de lluvia continua
    if (Math.random() < 0.4) {
        particles.push(new Particle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        // Elimina partículas fuera de la pantalla
        if (p.y > height + 40 || p.alpha <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Explosión de partículas en coordenadas específicas
function createBurstAt(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, true));
    }
}

// --- LÓGICA INTERACTIVA DE LAS FLORES Y MENSAJES PARA GUADALUPE ---
const loveMessages = [
    "✨ Eres mi luz de cada día, Guadalupe.",
    "🌻 Contigo mi mundo siempre es primavera, Guadalupe.",
    "💛 Mi lugar favorito en todo el universo es a tu lado, Guadalupe.",
    "🌟 Tu sonrisa ilumina mi vida mucho más que mil soles.",
    "💫 Cada segundo junto a ti es mi regalo más preciado, Guadalupe.",
    "🌸 Eres el sueño más hermoso hecho realidad en mi vida."
];

let activeToastTimer = null;

function spinAndShowMessage(cardElem, msgIndex, event) {
    const planetElem = cardElem.querySelector('.flower-planet');

    // Disparar giro 3D
    planetElem.classList.remove('spin-orbit');
    void planetElem.offsetWidth;
    planetElem.classList.add('spin-orbit');

    // Explosión de flores y corazones en el punto del toque/clic
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;
    createBurstAt(x, y, 40);

    // Mostrar mensaje flotante
    const toast = document.getElementById('loveToast');
    const toastMsg = document.getElementById('loveToastMessage');

    toastMsg.innerText = loveMessages[msgIndex % loveMessages.length];

    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');

    if (activeToastTimer) clearTimeout(activeToastTimer);

    activeToastTimer = setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        toast.classList.remove('opacity-100', 'translate-y-0');
    }, 3800);
}

function triggerLoveShower(event) {
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;
    createBurstAt(x, y, 70);
}