"use strict";
class FingerPainter {
    constructor() {
        this.isDrawing = false;
        this.lastPoint = null;
        this.currentColor = '#ff0000';
        this.brushSize = 5;
        this.isShiftPressed = false;
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('paintCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.statusElement = document.getElementById('status');
        this.setupCanvas();
        this.setupControls();
        this.setupKeyboardControls();
        this.initializeHandTracking();
    }
    setupCanvas() {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
    }
    setupControls() {
        const colorPickers = document.querySelectorAll('.color-picker');
        colorPickers.forEach(picker => {
            picker.addEventListener('click', (e) => {
                const target = e.target;
                const color = target.getAttribute('data-color');
                if (color) {
                    this.currentColor = color;
                    this.ctx.strokeStyle = color;
                    colorPickers.forEach(p => p.classList.remove('active'));
                    target.classList.add('active');
                }
            });
        });
        const brushSizeSlider = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        brushSizeSlider.addEventListener('input', (e) => {
            const target = e.target;
            this.brushSize = parseInt(target.value);
            this.ctx.lineWidth = this.brushSize;
            brushSizeValue.textContent = target.value;
        });
        const clearButton = document.getElementById('clearCanvas');
        clearButton.addEventListener('click', () => {
            this.clearCanvas();
        });
        const saveButton = document.getElementById('saveCanvas');
        saveButton.addEventListener('click', () => {
            this.saveCanvas();
        });
    }
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift') {
                this.isShiftPressed = true;
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Shift') {
                this.isShiftPressed = false;
                this.stopDrawing();
            }
        });
    }
    async initializeHandTracking() {
        try {
            this.hands = new window.Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });
            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });
            this.hands.onResults((results) => {
                this.onHandResults(results);
            });
            await this.setupCamera();
            this.updateStatus('Ready! Hold SHIFT and point your index finger to start painting.', 'ready');
        }
        catch (error) {
            console.error('Error initializing hand tracking:', error);
            this.updateStatus('Error loading hand tracking. Please refresh the page.', 'error');
        }
    }
    async setupCamera() {
        this.camera = new window.Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({ image: this.video });
            },
            width: 640,
            height: 480
        });
        await this.camera.start();
    }
    onHandResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
                this.processHandLandmarks(landmarks);
            }
        }
        else {
            this.stopDrawing();
        }
    }
    processHandLandmarks(landmarks) {
        const indexTip = landmarks[8];
        const indexPip = landmarks[6];
        const middleTip = landmarks[12];
        if (!indexTip || !indexPip || !middleTip)
            return;
        const tipPoint = {
            x: indexTip.x * this.canvas.width,
            y: indexTip.y * this.canvas.height
        };
        const isIndexExtended = indexTip.y < indexPip.y;
        const middlePip = landmarks[10];
        const isMiddleFolded = middlePip && middleTip.y > middlePip.y;
        const shouldDraw = isIndexExtended && isMiddleFolded && this.isShiftPressed;
        if (shouldDraw) {
            if (!this.isDrawing) {
                this.startDrawing(tipPoint);
            }
            else {
                this.continueDrawing(tipPoint);
            }
        }
        else {
            this.stopDrawing();
        }
    }
    startDrawing(point) {
        this.isDrawing = true;
        this.lastPoint = point;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.currentColor;
        this.ctx.fill();
    }
    continueDrawing(point) {
        if (!this.lastPoint || !this.isDrawing)
            return;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.stroke();
        this.lastPoint = point;
    }
    stopDrawing() {
        this.isDrawing = false;
        this.lastPoint = null;
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stopDrawing();
    }
    saveCanvas() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(this.canvas, 0, 0);
        const link = document.createElement('a');
        link.download = `finger-painting-${Date.now()}.png`;
        link.href = tempCanvas.toDataURL();
        link.click();
    }
    updateStatus(message, type) {
        this.statusElement.textContent = message;
        this.statusElement.className = `status ${type}`;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new FingerPainter();
});
