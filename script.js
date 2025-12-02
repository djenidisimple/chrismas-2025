const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
let x = 0;
const snow = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

for (let i = 10; i <= 1000; i += 45) {
    snow(i, 10)
}


