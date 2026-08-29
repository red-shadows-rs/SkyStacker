// DEVELOPED BY RED SHADOWS

const InputController = {
    init(canvas, onDropCallback) {
        this.currentX = canvas.width / 2;
        this.isDropping = false;

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.currentX = e.clientX - rect.left;
        });

        canvas.addEventListener('click', () => {
            if (!this.isDropping) {
                this.isDropping = true;
                if (onDropCallback) {
                    onDropCallback(this.currentX);
                }
                setTimeout(() => {
                    this.isDropping = false;
                }, 600);
            }
        });
    }
};