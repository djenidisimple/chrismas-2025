const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
let snowflakes = [];
const snow = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

for (let i = 0; i < 50; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1
    });
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const id = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snowflakes.forEach(flake => {
        snow(flake.x, flake.y);
        flake.x += Math.sin(flake.y * 0.01) * 0.5;
        flake.y += flake.speed;
        
        if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
        }
    });
}, 50);

