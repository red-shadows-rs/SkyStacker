// DEVELOPED BY RED SHADOWS

const InputController = {
    init(canvas, onDropCallback) {
        this.currentX = canvas.width / 2;
        this.isDropping = false;
        this.moveSpeed = 6;

        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                               (navigator.maxTouchPoints > 0 && window.innerWidth <= 1024);

        const mobileControls = document.getElementById('mobile-controls');
        
        if (mobileControls) {
            if (isMobileDevice) {
                mobileControls.style.display = 'flex';
            } else {
                mobileControls.style.display = 'none';
            }
        }

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            this.currentX = (e.clientX - rect.left) * scaleX;
        });

        canvas.addEventListener('click', () => {
            this.triggerDrop(onDropCallback);
        });

        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnDrop = document.getElementById('btn-drop');

        let movingLeft = false;
        let movingRight = false;

        if (btnLeft && btnRight && btnDrop && isMobileDevice) {
            
            btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); movingLeft = true; });
            btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); movingLeft = false; });
            
            btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); movingRight = true; });
            btnRight.addEventListener('touchend', (e) => { e.preventDefault(); movingRight = false; });

            btnDrop.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.triggerDrop(onDropCallback);
            });
        }

        const updateLoop = () => {
            if (movingLeft) {
                this.currentX = Math.max(20, this.currentX - this.moveSpeed);
            }
            if (movingRight) {
                this.currentX = Math.min(canvas.width - 20, this.currentX + this.moveSpeed);
            }
            requestAnimationFrame(updateLoop);
        };
        updateLoop();
    },

    triggerDrop(onDropCallback) {
        if (!this.isDropping) {
            this.isDropping = true;
            if (onDropCallback) {
                onDropCallback(this.currentX);
            }
            setTimeout(() => {
                this.isDropping = false;
            }, 600);
        }
    }
};
