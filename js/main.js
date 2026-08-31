// DEVELOPED BY RED SHADOWS

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let platform = {
    x: canvas.width / 2,
    y: canvas.height * 0.75,
    angle: 0,
    maxAngle: 0.35
};

let blocks = [];
let score = 0;
let topScore = localStorage.getItem('skyStackerTopScore') ? parseInt(localStorage.getItem('skyStackerTopScore')) : 0;

let isGameOver = false;
let gameStarted = false;

let cameraY = 0;
let targetCameraY = 0;

let currentFallingBlock = null;
let dropSpeed = 6;

let swayTime = 0;
let globalTime = 0; 
const FIXED_WIDTH = 110;

let clouds = [
    { x: canvas.width * 0.1, y: 150, size: 85, speed: 0.08 },
    { x: canvas.width * 0.5, y: 90, size: 110, speed: 0.12 },
    { x: canvas.width * 0.9, y: 220, size: 75, speed: 0.05 },
    { x: canvas.width * 1.3, y: 120, size: 95, speed: 0.1 }
];

const blockKeys = Object.keys(BlockTypes);

function getHillY(x, groundTop) {
    let t = x / canvas.width;
    let baseOffset = -90 + (140 * Math.sin(t * Math.PI * 0.85)); 
    return groundTop + baseOffset;
}

let mountainHouses = [
    {
        x: canvas.width * 0.18,
        width: 26,
        isHotel: true,
        floors: [
            { typeKey: blockKeys[0], height: 14 },
            { typeKey: blockKeys[1] || blockKeys[0], height: 14 },
            { typeKey: blockKeys[2] || blockKeys[0], height: 14 }
        ]
    },
    {
        x: canvas.width * 0.35,
        width: 28,
        isHotel: true,
        floors: [
            { typeKey: blockKeys[1] || blockKeys[0], height: 14 },
            { typeKey: blockKeys[0], height: 14 },
            { typeKey: blockKeys[2] || blockKeys[0], height: 14 },
            { typeKey: blockKeys[1] || blockKeys[0], height: 14 }
        ]
    },
    {
        x: canvas.width * 0.65,
        width: 30,
        isHotel: true,
        floors: [
            { typeKey: blockKeys[0], height: 14 },
            { typeKey: blockKeys[2] || blockKeys[0], height: 14 },
            { typeKey: blockKeys[1] || blockKeys[0], height: 14 },
            { typeKey: blockKeys[0], height: 14 }
        ]
    },
    {
        x: canvas.width * 0.82,
        width: 26,
        isHotel: false,
        floors: [
            { typeKey: blockKeys[1] || blockKeys[0], height: 14 },
            { typeKey: blockKeys[0], height: 14 }
        ]
    }
];

let windingPaths = [
    {
        points: [
            { x: canvas.width * 0.12, y: 25 },
            { x: canvas.width * 0.28, y: 55 },
            { x: canvas.width * 0.45, y: 40 },
            { x: canvas.width * 0.60, y: 50 },
            { x: canvas.width * 0.78, y: 35 },
            { x: canvas.width * 0.88, y: 60 }
        ]
    },
    {
        points: [
            { x: canvas.width * 0.30, y: 70 },
            { x: canvas.width * 0.45, y: 85 },
            { x: canvas.width * 0.70, y: 75 }
        ]
    }
];

let lowerTrees = [
    { x: canvas.width * 0.10, type: 'pine' },
    { x: canvas.width * 0.22, type: 'round' },
    { x: canvas.width * 0.52, type: 'pine' },
    { x: canvas.width * 0.80, type: 'round' },
    { x: canvas.width * 0.92, type: 'pine' }
];

document.getElementById('play-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    gameStarted = true;
    swayTime = 0;
    globalTime = 0;
    
    document.getElementById('top-score').innerText = `Top Height: ${topScore}`;
    
    InputController.setControlsVisible(true);
    
    spawnNewFallingBlock();
});

function spawnNewFallingBlock() {
    let spawnScreenY = -cameraY - 200;
    
    const keys = Object.keys(BlockTypes);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    let template = BlockTypes[randomKey];

    let lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
    let targetWidth = lastBlock ? lastBlock.width : FIXED_WIDTH;

    currentFallingBlock = {
        x: canvas.width / 2,
        y: spawnScreenY,
        width: targetWidth,
        originalWidth: targetWidth,
        height: template.height,
        mass: template.mass,
        type: randomKey,
        isFalling: false,
        draw: template.draw
    };
}

InputController.init(canvas, (dropX) => {
    if (!gameStarted || isGameOver || (currentFallingBlock && currentFallingBlock.isFalling)) return;
    currentFallingBlock.x = dropX;
    currentFallingBlock.isFalling = true;
});

function triggerGameOver(reason) {
    isGameOver = true;
    
    InputController.setControlsVisible(false);
    
    if (score > topScore) {
        topScore = score;
        localStorage.setItem('skyStackerTopScore', topScore);
    }
    
    document.getElementById('top-score').innerText = `Top Height: ${topScore}`;
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('winner-text').innerText = reason;
}

function update() {
    globalTime += 0.00007; 
    clouds.forEach(cloud => {
        cloud.x -= cloud.speed;
        if (cloud.x < -200) {
            cloud.x = canvas.width + 200;
            cloud.y = Math.random() * 200 + 50;
            cloud.size = Math.random() * 50 + 70;
            cloud.speed = Math.random() * 0.08 + 0.04;
        }
    });

    if (!gameStarted || isGameOver) return;

    cameraY += (targetCameraY - cameraY) * 0.12;

    swayTime += 0.03;
    let idleSway = Math.sin(swayTime) * 0.003; 

    if (currentFallingBlock && currentFallingBlock.isFalling) {
        currentFallingBlock.y += dropSpeed;

        let lastBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
        let targetY;

        if (lastBlock) {
            targetY = lastBlock.y - currentFallingBlock.height;
        } else {
            targetY = platform.y - currentFallingBlock.height;
        }

        if (currentFallingBlock.y >= targetY) {
            currentFallingBlock.isFalling = false;
            currentFallingBlock.y = targetY;

            let baseCheckX = lastBlock ? lastBlock.x : platform.x;
            let baseWidth = lastBlock ? lastBlock.width : FIXED_WIDTH;

            let currentHalf = currentFallingBlock.width / 2;
            let baseHalf = baseWidth / 2;

            let leftEdge = Math.max(currentFallingBlock.x - currentHalf, baseCheckX - baseHalf);
            let rightEdge = Math.min(currentFallingBlock.x + currentHalf, baseCheckX + baseHalf);
            let overlapWidth = rightEdge - leftEdge;

            if (overlapWidth <= 15) {
                triggerGameOver('The building fell into the void and the tower collapsed!');
                return;
            }

            currentFallingBlock.width = overlapWidth;
            currentFallingBlock.x = (leftEdge + rightEdge) / 2;

            blocks.push(currentFallingBlock);

            score += 1;
            document.getElementById('score').innerText = `Height: ${score}`;
            
            if (score > topScore) {
                topScore = score;
                localStorage.setItem('skyStackerTopScore', topScore);
            }
            document.getElementById('top-score').innerText = `Top Height: ${topScore}`;

            targetCameraY += currentFallingBlock.height;

            let offsetFromCenter = currentFallingBlock.x - baseCheckX;
            platform.angle += (offsetFromCenter / baseWidth) * 0.09;
            platform.angle += (Math.random() - 0.5) * 0.015;
            platform.angle = Math.max(-platform.maxAngle, Math.min(platform.maxAngle, platform.angle));

            if (Math.abs(platform.angle) >= platform.maxAngle) {
                triggerGameOver('انقلب البرج بسبب الميلان الشديد!');
                return;
            }

            spawnNewFallingBlock();
        }
    } else if (gameStarted && currentFallingBlock) {
        let clampedX = Math.max(canvas.width / 2 - 120, Math.min(canvas.width / 2 + 120, InputController.currentX));
        currentFallingBlock.x = clampedX;
    }

    platform.totalDisplayAngle = platform.angle + idleSway;
}

function lerpColor(a, b, amount) {
    let ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);
    return 'rgb(' + Math.round(rr) + ',' + Math.round(rg) + ',' + Math.round(rb) + ')';
}

function drawBackground() {
    let cycleProgress = (globalTime % 1); 

    let topColor, midColor, bottomColor;
    let sunX = canvas.width * 0.75;
    let sunMinY = 80;
    let sunMaxY = canvas.height * 0.65;
    let maxMoonHeight = canvas.height * 0.55;

    let celestialY, isSun = true;

    if (cycleProgress <= 0.5) {
        let sunProgress = cycleProgress * 2; 
        celestialY = sunMinY + (sunMaxY - sunMinY) * sunProgress;
        isSun = true;
    } else {
        let moonProgress = (cycleProgress - 0.5) * 2; 
        if (moonProgress <= 0.5) {
            let upProgress = moonProgress * 2; 
            celestialY = sunMaxY - (upProgress * maxMoonHeight);
        } else {
            let downProgress = (moonProgress - 0.5) * 2; 
            celestialY = (sunMaxY - maxMoonHeight) + (downProgress * maxMoonHeight);
        }
        isSun = false;
    }

    let positionRatio = Math.max(0, Math.min(1, (celestialY - sunMinY) / (sunMaxY - sunMinY)));

    if (isSun) {
        if (positionRatio < 0.5) {
            let factor = positionRatio * 2;
            topColor = lerpColor('#1e90ff', '#3b82f6', factor);
            midColor = lerpColor('#70a1ff', '#60a5fa', factor);
            bottomColor = lerpColor('#eccc68', '#fbbf24', factor);
        } else {
            let factor = (positionRatio - 0.5) * 2;
            topColor = lerpColor('#3b82f6', '#ff4757', factor);
            midColor = lerpColor('#60a5fa', '#ff6b81', factor);
            bottomColor = lerpColor('#fbbf24', '#2f3542', factor);
        }
    } else {
        let nightFactor = Math.abs(celestialY - sunMaxY) / maxMoonHeight;
        topColor = lerpColor('#ff4757', '#0f172a', nightFactor);
        midColor = lerpColor('#2f3542', '#1e1b4b', nightFactor);
        bottomColor = lerpColor('#1e1b4b', '#09090b', nightFactor);
    }

    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(0.5, midColor);
    gradient.addColorStop(1, bottomColor);
    
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isSun) {
        ctx.fillStyle = 'rgba(255, 220, 80, 0.95)';
        ctx.beginPath();
        ctx.arc(sunX, celestialY, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.beginPath();
        ctx.arc(sunX, celestialY, 75, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillStyle = '#f1f2f6';
        ctx.beginPath();
        ctx.arc(sunX, celestialY, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(sunX, celestialY, 65, 0, Math.PI * 2);
        ctx.fill();

        let starAlpha = cycleProgress > 0.6 ? 1 : (cycleProgress - 0.5) * 10;
        ctx.fillStyle = `rgba(255, 255, 255, ${starAlpha})`;
        for (let i = 0; i < 40; i++) {
            let starX = (i * 61) % canvas.width;
            let starY = (i * 53) % (canvas.height * 0.7);
            let starSize = (i % 3) + 1;
            ctx.fillRect(starX, starY, starSize, starSize);
        }
    }

    ctx.fillStyle = isSun ? 'rgba(255, 255, 255, 0.3)' : 'rgba(160, 175, 200, 0.15)';
    clouds.forEach(cloud => {
        drawCloud(cloud.x, cloud.y, cloud.size);
    });

    let groundTop = canvas.height * 0.75 + 60;
    let hillColor = (cycleProgress < 0.5) ? '#2ecc71' : '#1b5e3b';

    ctx.fillStyle = hillColor;
    ctx.beginPath();
    ctx.moveTo(0, groundTop);
    ctx.lineTo(0, groundTop - 90);
    ctx.quadraticCurveTo(canvas.width * 0.25, groundTop - 140, canvas.width * 0.55, groundTop - 80);
    ctx.quadraticCurveTo(canvas.width * 0.85, groundTop - 30, canvas.width, groundTop - 100);
    ctx.lineTo(canvas.width, canvas.height); 
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = (cycleProgress < 0.5) ? 'rgba(180, 130, 80, 0.6)' : 'rgba(90, 65, 40, 0.7)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    windingPaths.forEach(path => {
        ctx.beginPath();
        path.points.forEach((pt, idx) => {
            let actualX = pt.x;
            let actualY = groundTop - 30 + pt.y;
            if (idx === 0) ctx.moveTo(actualX, actualY);
            else ctx.lineTo(actualX, actualY);
        });
        ctx.stroke();
    });

    mountainHouses.forEach(house => {
        let totalHouseHeight = 0;
        house.floors.forEach(f => totalHouseHeight += f.height);

        let exactHillY = getHillY(house.x, groundTop);
        let startY = exactHillY - totalHouseHeight;
        let drawX = house.x - house.width / 2;

        ctx.save();
        ctx.globalAlpha = 0.88;

        house.floors.forEach((floor, index) => {
            let template = BlockTypes[floor.typeKey];
            if (template && template.draw) {
                ctx.save();
                ctx.beginPath();
                let clipTop = startY;
                let clipHeight = floor.height;
                if (index > 0) {
                    clipTop += 2; 
                    clipHeight -= 2;
                }
                ctx.rect(drawX, clipTop, house.width, clipHeight);
                ctx.clip();

                template.draw(ctx, drawX, startY, house.width);
                ctx.restore();

                if (house.isHotel) {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                    let winW = 5;
                    let winH = 7;
                    ctx.fillRect(drawX + house.width * 0.25 - winW/2, startY + floor.height/2 - winH/2, winW, winH);
                    ctx.fillRect(drawX + house.width * 0.75 - winW/2, startY + floor.height/2 - winH/2, winW, winH);
                }

                startY += floor.height;
            }
        });

        ctx.restore();
    });

    lowerTrees.forEach(tree => {
        let treeBaseY = getHillY(tree.x, groundTop) + 15;
        if (tree.type === 'pine') {
            drawPineTree(tree.x, treeBaseY);
        } else {
            drawRoundTree(tree.x, treeBaseY);
        }
    });

    ctx.restore();
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x + size * 0.3, y - size * 0.15, size * 0.3, 0, Math.PI * 2);
    ctx.arc(x + size * 0.6, y, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();

    if (!gameStarted) return;

    ctx.save();
    ctx.translate(0, cameraY);

    let displayAngle = platform.totalDisplayAngle !== undefined ? platform.totalDisplayAngle : platform.angle;

    ctx.save();
    ctx.translate(platform.x, platform.y);
    ctx.rotate(displayAngle);
    
    ctx.beginPath();
    ctx.moveTo(-90, 0);
    ctx.lineTo(90, 0);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.restore();

    blocks.forEach((block, index) => {
        ctx.save();
        let tierFactor = (index + 1) / blocks.length;
        ctx.translate(block.x, block.y + block.height / 2);
        ctx.rotate(displayAngle * tierFactor);
        ctx.translate(-block.x, -(block.y + block.height / 2));

        ctx.save();
        ctx.beginPath();
        ctx.rect(block.x - (block.width / 2), block.y - 4, block.width, block.height + 12);
        ctx.clip();

        block.draw(ctx, block.x - (block.width / 2), block.y, block.width);
        ctx.restore();

        ctx.restore();
    });

    let activeBlock = blocks.length > 0 ? blocks[blocks.length - 1] : null;
    let baseRefX = activeBlock ? activeBlock.x : platform.x;
    let baseRefY = activeBlock ? activeBlock.y : platform.y;
    let baseRefWidth = activeBlock ? activeBlock.width : FIXED_WIDTH;
    let activeAngle = activeBlock ? (displayAngle * (blocks.length / blocks.length)) : displayAngle;

    ctx.save();
    ctx.translate(baseRefX, baseRefY + (activeBlock ? activeBlock.height / 2 : 0));
    ctx.rotate(activeAngle);
    ctx.translate(-baseRefX, -(baseRefY + (activeBlock ? activeBlock.height / 2 : 0)));

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(baseRefX - (baseRefWidth / 2), baseRefY);
    ctx.lineTo(baseRefX - (baseRefWidth / 2), baseRefY - 800);
    ctx.moveTo(baseRefX + (baseRefWidth / 2), baseRefY);
    ctx.lineTo(baseRefX + (baseRefWidth / 2), baseRefY - 800);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    if (currentFallingBlock) {
        if (!currentFallingBlock.isFalling) {
            currentFallingBlock.y = -cameraY + 80;
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(currentFallingBlock.x - (currentFallingBlock.width / 2), currentFallingBlock.y - 4, currentFallingBlock.width, currentFallingBlock.height + 12);
        ctx.clip();

        currentFallingBlock.draw(ctx, currentFallingBlock.x - (currentFallingBlock.width / 2), currentFallingBlock.y, currentFallingBlock.width);
        ctx.restore();
    }

    ctx.restore();
}

function drawRoundTree(x, y) {
    ctx.fillStyle = '#4a154b';
    ctx.fillRect(x - 4, y - 25, 8, 25);
    ctx.fillStyle = '#00b894';
    ctx.beginPath();
    ctx.arc(x, y - 30, 18, 0, Math.PI * 2);
    ctx.fill();
}

function drawPineTree(x, y) {
    ctx.fillStyle = '#3d2817';
    ctx.fillRect(x - 3, y - 20, 6, 20);
    ctx.fillStyle = '#0984e3';
    ctx.beginPath();
    ctx.moveTo(x, y - 45);
    ctx.lineTo(x - 15, y - 20);
    ctx.lineTo(x + 15, y - 20);
    ctx.closePath();
    ctx.fill();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.getElementById('restart-btn').addEventListener('click', () => {
    blocks = [];
    score = 0;
    cameraY = 0;
    targetCameraY = 0;
    platform.angle = 0;
    swayTime = 0;
    globalTime = 0;
    isGameOver = false;
    
    document.getElementById('score').innerText = `Height: ${score}`;
    document.getElementById('top-score').innerText = `Top Height: ${topScore}`;
    
    document.getElementById('game-over-screen').classList.add('hidden');
    
    InputController.setControlsVisible(true);
    
    spawnNewFallingBlock();
});

const howToBtn = document.getElementById('how-to-btn');
const howToScreen = document.getElementById('how-to-screen');
const closeHowToBtn = document.getElementById('close-how-to-btn');
const startScreen = document.getElementById('start-screen');

if (howToBtn) {
    howToBtn.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        howToScreen.classList.remove('hidden');

        const pcInstructions = document.getElementById('instructions-pc');
        const mobileInstructions = document.getElementById('instructions-mobile');

        if (InputController.isMobile) {
            pcInstructions.style.display = 'none';
            mobileInstructions.style.display = 'block';
        } else {
            pcInstructions.style.display = 'block';
            mobileInstructions.style.display = 'none';
        }
    });
}

if (closeHowToBtn) {
    closeHowToBtn.addEventListener('click', () => {
        howToScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });
}

gameLoop();
