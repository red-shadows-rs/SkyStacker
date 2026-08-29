// DEVELOPED BY RED SHADOWS

const Physics = {
    calculateCenterOfMass(blocks) {
        let totalMass = 0;
        let weightedSum = 0;
        
        blocks.forEach(block => {
            if (block.isSettled) {
                totalMass += block.mass;
                weightedSum += block.localX * block.mass;
            }
        });

        if (totalMass === 0) return 0;
        return weightedSum / totalMass;
    },

    updatePlatformAngle(platform, blocks, canvasWidth) {
        let centerOfMass = this.calculateCenterOfMass(blocks, canvasWidth);
        let targetAngle = centerOfMass * 0.0005;
        platform.angle += (targetAngle - platform.angle) * 0.08;
    },

    clampLocalX(localX, heightInV, vHalfWidth = 220) {
        let currentAllowedWidth = vHalfWidth * (Math.abs(heightInV) / 200);
        currentAllowedWidth = Math.max(30, Math.min(vHalfWidth, currentAllowedWidth));
        
        return Math.max(-currentAllowedWidth + 20, Math.min(currentAllowedWidth - 20, localX));
    }
};