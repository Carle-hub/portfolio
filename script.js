// Animation de particules en arrière-plan
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

// Adapter la taille du canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particules
const particles = [];
const numParticles = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 3 + 1;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const particleColor = isDarkMode ? '#bb86fc' : '#a259f7';
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
        // Connexions entre particules proches
        particles.forEach(other => {
            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = particleColor;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    }
}

// Initialiser les particules
for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
}

// Boucle d'animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

animate();

// Smooth scroll pour les liens de navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation du header au scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.15)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.1)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Animation d'apparition des éléments au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer tous les éléments animables
document.querySelectorAll('.project-card, .skill, .about-text').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(.4,2,.3,1)';
    el.style.boxShadow = '0 8px 32px rgba(162, 89, 247, 0.15)'; // violet shadow
    observer.observe(el);
});

// Gestion du mode sombre/clair
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Vérifier si le mode sombre est déjà activé
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Ajouter un gestionnaire d'événements pour le bouton de basculement
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkModeNow = body.classList.contains('dark-mode');
        themeToggle.textContent = isDarkModeNow ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkModeNow);
    });
});
