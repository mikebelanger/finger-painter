interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandResults {
  multiHandLandmarks?: Array<Array<HandLandmark>>;
  multiHandedness?: Array<{ label: string; score: number }>;
}

interface Point {
  x: number;
  y: number;
}

class FingerPainter {
  private video: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private hands: any;
  private camera: any;
  private isDrawing: boolean = false;
  private lastPoint: Point | null = null;
  private currentColor: string = '#ff0000';
  private brushSize: number = 5;
  private statusElement: HTMLElement;
  private isShiftPressed: boolean = false;

  constructor() {
    this.video = document.getElementById('videoElement') as HTMLVideoElement;
    this.canvas = document.getElementById('paintCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.statusElement = document.getElementById('status')!;

    this.setupCanvas();
    this.setupControls();
    this.setupKeyboardControls();
    this.initializeHandTracking();
  }

  private setupCanvas(): void {
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.brushSize;
  }

  private setupControls(): void {
    // Color picker controls
    const colorPickers = document.querySelectorAll('.color-picker');
    colorPickers.forEach(picker => {
      picker.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const color = target.getAttribute('data-color');
        if (color) {
          this.currentColor = color;
          this.ctx.strokeStyle = color;

          // Update active state
          colorPickers.forEach(p => p.classList.remove('active'));
          target.classList.add('active');
        }
      });
    });

    // Brush size control
    const brushSizeSlider = document.getElementById('brushSize') as HTMLInputElement;
    const brushSizeValue = document.getElementById('brushSizeValue') as HTMLElement;

    brushSizeSlider.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.brushSize = parseInt(target.value);
      this.ctx.lineWidth = this.brushSize;
      brushSizeValue.textContent = target.value;
    });

    // Clear canvas button
    const clearButton = document.getElementById('clearCanvas') as HTMLButtonElement;
    clearButton.addEventListener('click', () => {
      this.clearCanvas();
    });

    // Save canvas button
    const saveButton = document.getElementById('saveCanvas') as HTMLButtonElement;
    saveButton.addEventListener('click', () => {
      this.saveCanvas();
    });
  }

  private setupKeyboardControls(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') {
        this.isShiftPressed = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') {
        this.isShiftPressed = false;
        this.stopDrawing(); // Stop drawing when shift is released
      }
    });
  }

  private async initializeHandTracking(): Promise<void> {
    try {
      this.hands = new window.Hands({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      this.hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.hands.onResults((results: HandResults) => {
        this.onHandResults(results);
      });

      await this.setupCamera();
      this.updateStatus('Ready! Hold SHIFT and point your index finger to start painting.', 'ready');
    } catch (error) {
      console.error('Error initializing hand tracking:', error);
      this.updateStatus('Error loading hand tracking. Please refresh the page.', 'error');
    }
  }

  private async setupCamera(): Promise<void> {
    this.camera = new window.Camera(this.video, {
      onFrame: async () => {
        await this.hands.send({ image: this.video });
      },
      width: 640,
      height: 480
    });

    await this.camera.start();
  }

  private onHandResults(results: HandResults): void {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        this.processHandLandmarks(landmarks);
      }
    } else {
      this.stopDrawing();
    }
  }

  private processHandLandmarks(landmarks: Array<HandLandmark>): void {
    // Get index finger tip (landmark 8) and index finger PIP (landmark 6)
    const indexTip = landmarks[8];
    const indexPip = landmarks[6];
    const middleTip = landmarks[12];

    if (!indexTip || !indexPip || !middleTip) return;

    // Convert normalized coordinates to canvas coordinates
    const tipPoint: Point = {
      x: indexTip.x * this.canvas.width, // Normal x mapping for mirrored drawing
      y: indexTip.y * this.canvas.height
    };

    // Check if index finger is extended (tip is higher than PIP joint)
    const isIndexExtended = indexTip.y < indexPip.y;

    // Check if middle finger is folded (tip is lower than PIP joint)
    const middlePip = landmarks[10];
    const isMiddleFolded = middlePip && middleTip.y > middlePip.y;

    // Drawing condition: index finger extended, middle finger folded, AND shift key pressed
    const shouldDraw = isIndexExtended && isMiddleFolded && this.isShiftPressed;

    if (shouldDraw) {
      if (!this.isDrawing) {
        this.startDrawing(tipPoint);
      } else {
        this.continueDrawing(tipPoint);
      }
    } else {
      this.stopDrawing();
    }
  }

  private startDrawing(point: Point): void {
    this.isDrawing = true;
    this.lastPoint = point;

    // Draw a small dot to start
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.currentColor;
    this.ctx.fill();
  }

  private continueDrawing(point: Point): void {
    if (!this.lastPoint || !this.isDrawing) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.stroke();

    this.lastPoint = point;
  }

  private stopDrawing(): void {
    this.isDrawing = false;
    this.lastPoint = null;
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stopDrawing();
  }

  private saveCanvas(): void {
    // Create a temporary canvas with white background
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;

    // Fill with white background
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the painting on top
    tempCtx.drawImage(this.canvas, 0, 0);

    // Download the image
    const link = document.createElement('a');
    link.download = `finger-painting-${Date.now()}.png`;
    link.href = tempCanvas.toDataURL();
    link.click();
  }

  private updateStatus(message: string, type: 'loading' | 'ready' | 'error'): void {
    this.statusElement.textContent = message;
    this.statusElement.className = `status ${type}`;
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FingerPainter();
});
