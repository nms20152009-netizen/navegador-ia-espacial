const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = 500;

let stars = [];
let planets = [];

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.brightness = Math.random();
        this.twinkleSpeed = Math.random() * 0.05;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;
        ctx.fill();
    }

    update() {
        this.brightness += this.twinkleSpeed;
        if (this.brightness > 1 || this.brightness < 0.3) {
            this.twinkleSpeed = -this.twinkleSpeed;
        }
    }
}

class Planet {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 30 + 10;
        this.color = this.getRandomColor();
        this.orbitRadius = Math.random() * 50 + 20;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.02 + 0.005;
    }

    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    update() {
        this.angle += this.speed;
        this.x += Math.cos(this.angle) * 0.5;
        this.y += Math.sin(this.angle) * 0.5;
    }
}

function generateGalaxy() {
    stars = [];
    planets = [];
    
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }
    
    for (let i = 0; i < 5; i++) {
        planets.push(new Planet());
    }
}

function animate() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    planets.forEach(planet => {
        planet.update();
        planet.draw();
    });
    
    requestAnimationFrame(animate);
}

document.getElementById('generateBtn').addEventListener('click', () => {
    generateGalaxy();
    animate();
});

document.getElementById('clearBtn').addEventListener('click', () => {
    stars = [];
    planets = [];
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});
