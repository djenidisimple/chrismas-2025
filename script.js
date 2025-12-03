const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
let snowflakes = [];
let wind = 0;
let groundSnow = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const snow = (x, y, size, depth) => {
    const scale = depth;
    const opacity = 0.3 + (depth * 0.7)

    ctx.globalAlpha = opacity; 
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
}

for (let i = 0; i < 50; i++) {
    snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 3 + 1,
        depth: Math.random() * 0.5 + 0.5
    });
}

setInterval(() => {
    wind = (Math.random() - 0.5) * 2;
}, 3000)

const drawFog = () => {
    const fogGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.height / 2, canvas.height /2, canvas.width / 1.5 
    );
    fogGradient.addColorStop(0, "rgba(240, 248, 255, 0)");
    fogGradient.addColorStop(1, "rgba(240, 248, 255, 0.3)");
    
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const drawGround = () => {
    const sortedSnow = [...groundSnow].sort((a, b) => a.depth - b.depth);

    sortedSnow.forEach(pile => {
        const scale = pile.depth;
        const opacity = 0.5 + (pile.depth * 0.5);

        const perspectiveY = canvas.height - (pile.height * scale) - ((1 - pile.depth) * 100);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "white";

        const width = 8 * scale;
        const height = pile.height * scale;
        ctx.fillRect(pile.x - width / 2, perspectiveY, width, height);
        ctx.globalAlpha = 1;
    })
}

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sortedSnow = [...snowflakes].sort((a, b) => a.depth - b.depth);
    
    sortedSnow.forEach(flake => {
        const adjustedSpeed = flake.speed * flake.depth; 
        snow(flake.x, flake.y, flake.size, flake.depth);
        flake.x += Math.sin(flake.y * 0.01) * 0.5 * flake.depth + wind;
        flake.y += adjustedSpeed;
        if (flake.y >= canvas.height - 15) {
            groundSnow.push({ 
                x: flake.x, 
                height: 3,
                depth: flake.depth 
            });
            flake.y = -10;
            flake.x = Math.random() * canvas.width;
        }


        if (flake.x < 0) flake.x = canvas.width;
        if (flake.x > canvas.width) flake.x = 0;
    });
    drawFog();
    drawGround();
    requestAnimationFrame(animate)
};

animate();

