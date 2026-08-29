// DEVELOPED BY RED SHADOWS

const BlockTypes = {
    HOUSE_RED: {
        width: 110, height: 38, mass: 1, color: '#ff4757', roofColor: '#2f3542', 
        draw(ctx, x, y, customWidth) {
            ctx.save();
            let w = customWidth || this.width;
            let h = this.height;
            
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(x, y + 10, w, h - 10);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(x + w - Math.min(12, w), y + 10, Math.min(12, w), h - 10);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y + 10, w, h - 10);

            ctx.fillStyle = '#2f3542';
            ctx.fillRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(x - 3, y + 6, w + 6, 5);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x - 3, y, w + 6, 2);

            ctx.strokeRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x, y + 11, w, 4);

            let winCount = Math.max(1, Math.floor(w / 32));
            let spacing = w / (winCount + 1);
            for (let i = 1; i <= winCount; i++) {
                let winX = x + (spacing * i) - 6;
                let winY = y + 16;
                
                if (winX + 12 < x + w - 4) {
                    ctx.fillStyle = '#70a1ff';
                    ctx.fillRect(winX, winY, 12, 14);
                    ctx.strokeStyle = '#dfe4ea';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(winX, winY, 12, 14);

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(winX + 2, winY + 2);
                    ctx.lineTo(winX + 10, winY + 12);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
    },
    HOUSE_YELLOW: {
        width: 110, height: 38, mass: 1.2, color: '#ffa502', roofColor: '#3742fa', 
        draw(ctx, x, y, customWidth) {
            ctx.save();
            let w = customWidth || this.width;
            let h = this.height;

            ctx.fillStyle = '#ffa502';
            ctx.fillRect(x, y + 10, w, h - 10);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(x + w - Math.min(12, w), y + 10, Math.min(12, w), h - 10);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y + 10, w, h - 10);

            ctx.fillStyle = '#3742fa';
            ctx.fillRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(x - 3, y + 6, w + 6, 5);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x - 3, y, w + 6, 2);

            ctx.strokeRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x, y + 11, w, 4);

            let winCount = Math.max(1, Math.floor(w / 40));
            let spacing = w / (winCount + 1);
            for (let i = 1; i <= winCount; i++) {
                let winX = x + (spacing * i) - 8;
                let winY = y + 16;
                if (winX + 16 < x + w - 4) {
                    ctx.fillStyle = '#70a1ff';
                    ctx.fillRect(winX, winY, 16, 14);
                    ctx.strokeStyle = '#dfe4ea';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(winX, winY, 16, 14);

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(winX + 3, winY + 2);
                    ctx.lineTo(winX + 13, winY + 12);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
    },
    HOUSE_PURPLE: {
        width: 110, height: 38, mass: 1.4, color: '#9b59b6', roofColor: '#2c3e50', 
        draw(ctx, x, y, customWidth) {
            ctx.save();
            let w = customWidth || this.width;
            let h = this.height;

            ctx.fillStyle = '#9b59b6';
            ctx.fillRect(x, y + 10, w, h - 10);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(x + w - Math.min(10, w), y + 10, Math.min(10, w), h - 10);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y + 10, w, h - 10);

            ctx.fillStyle = '#2c3e50';
            ctx.fillRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(x - 3, y + 6, w + 6, 5);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x - 3, y, w + 6, 2);

            ctx.strokeRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x, y + 11, w, 4);

            let winX = x + w / 2;
            let winY = y + 16;
            if (w > 25) {
                ctx.fillStyle = '#70a1ff';
                ctx.beginPath();
                ctx.arc(winX, winY + 7, Math.min(6, w / 4), 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#dfe4ea';
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }

            ctx.restore();
        }
    },
    HOUSE_GREEN: {
        width: 110, height: 38, mass: 1.5, color: '#2ed573', roofColor: '#ff6b81', 
        draw(ctx, x, y, customWidth) {
            ctx.save();
            let w = customWidth || this.width;
            let h = this.height;

            ctx.fillStyle = '#2ed573';
            ctx.fillRect(x, y + 10, w, h - 10);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(x + w - Math.min(12, w), y + 10, Math.min(12, w), h - 10);

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y + 10, w, h - 10);

            ctx.fillStyle = '#ff6b81';
            ctx.fillRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
            ctx.fillRect(x - 3, y + 6, w + 6, 5);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(x - 3, y, w + 6, 2);

            ctx.strokeRect(x - 3, y, w + 6, 11);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x, y + 11, w, 4);

            let winCount = Math.max(1, Math.floor(w / 32));
            let spacing = w / (winCount + 1);
            for (let i = 1; i <= winCount; i++) {
                let winX = x + (spacing * i) - 6;
                let winY = y + 16;
                if (winX + 12 < x + w - 4) {
                    ctx.fillStyle = '#70a1ff';
                    ctx.fillRect(winX, winY, 12, 14);
                    ctx.strokeStyle = '#dfe4ea';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(winX, winY, 12, 14);

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(winX + 2, winY + 2);
                    ctx.lineTo(winX + 10, winY + 12);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
    }
};

function spawnRandomBlock(startX, startY) {
    const keys = Object.keys(BlockTypes);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const template = BlockTypes[randomKey];

    return {
        x: startX,
        y: startY,
        width: template.width,
        originalWidth: template.width,
        height: template.height,
        mass: template.mass,
        type: randomKey,
        isFalling: false,
        draw: template.draw
    };
}
