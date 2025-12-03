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

const drawSky = () => {
    // Assurez-vous que le contexte et le canvas sont disponibles
    if (!ctx || !canvas) {
        console.error("Context ou canvas non défini");
        return;
    }

    // Création d'un dégradé plus réaliste pour le ciel
    const skyGradient = ctx.createLinearGradient(
        0, 0, 
        0, canvas.height * 0.8 // Le dégradé s'arrête à 80% de la hauteur
    );
    
    // Dégradé du bleu nuit au bleu clair
    skyGradient.addColorStop(0, "#00111e");     // Bleu nuit très foncé
    skyGradient.addColorStop(0.3, "#003366");   // Bleu nuit
    skyGradient.addColorStop(0.6, "#1a5f9c");   // Bleu moyen
    skyGradient.addColorStop(0.9, "#4a90e2");   // Bleu ciel clair
    skyGradient.addColorStop(1, "#87ceeb");     // Bleu ciel très clair (proche de l'horizon)

    // Optionnel: Ajouter un léger dégradé pour le bas du ciel (horizon)
    const horizonGradient = ctx.createLinearGradient(
        0, canvas.height * 0.7,
        0, canvas.height
    );
    horizonGradient.addColorStop(0, "rgba(135, 206, 235, 0.8)"); // Bleu ciel transparent
    horizonGradient.addColorStop(1, "rgba(255, 255, 255, 0.3)"); // Blanc très transparent

    // Remplir le ciel principal
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ajouter le dégradé d'horizon (optionnel)
    ctx.fillStyle = horizonGradient;
    ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

    // Optionnel: Ajouter un soleil/une lune
    const addCelestialBody = (type = "moon") => {
        const x = canvas.width * 0.8;
        const y = canvas.height * 0.2;
        const radius = 50;
        
        if (type === "sun") {
            // Soleil
            const sunGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            sunGradient.addColorStop(0, "#ffff00");
            sunGradient.addColorStop(0.7, "#ffcc00");
            sunGradient.addColorStop(1, "rgba(255, 204, 0, 0)");
            
            ctx.fillStyle = sunGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Lune
            ctx.fillStyle = "#f0f0f0";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Ajouter des cratères
            ctx.fillStyle = "#d0d0d0";
            ctx.beginPath();
            ctx.arc(x - 10, y - 5, 8, 0, Math.PI * 2);
            ctx.arc(x + 15, y + 10, 6, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    // addCelestialBody("sun"); // Pour un ciel diurne avec soleil
    addCelestialBody("moon"); // Pour un ciel nocturne avec lune
};

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
}, 3000);

const drawGround = () => {
    const sortedSnow = [...groundSnow].sort((a, b) => a.depth - b.depth);

    sortedSnow.forEach(pile => {
        const scale = pile.depth;
        const opacity = 0.5 + (pile.depth * 0.5);
        const perspectiveY = canvas.height - (pile.height * scale) - ((1 - pile.depth) * 350);
        
        ctx.globalAlpha = opacity * 0.3;
        ctx.fillStyle = "#a0c8ff";
        ctx.beginPath();
        ctx.ellipse(pile.x, perspectiveY + 2, 12 * scale, 3 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = opacity;
        const snowGradient = ctx.createLinearGradient(
            pile.x - 6 * scale, perspectiveY,
            pile.x + 6 * scale, perspectiveY + pile.height * scale
        );
        snowGradient.addColorStop(0, "white");
        snowGradient.addColorStop(1, "#e6f2ff");
        
        ctx.fillStyle = snowGradient;
        ctx.beginPath();
        ctx.ellipse(pile.x, perspectiveY, 6 * scale, pile.height * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
    })
}

const animate = () => {
    ctx.fillStyle = "rgba(10, 10, 42, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawSky();
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
    drawGround();
    requestAnimationFrame(animate)
};

animate();

