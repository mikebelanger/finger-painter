interface HandLandmark {
    x: number;
    y: number;
    z: number;
}
interface HandResults {
    multiHandLandmarks?: Array<Array<HandLandmark>>;
    multiHandedness?: Array<{
        label: string;
        score: number;
    }>;
}
interface Point {
    x: number;
    y: number;
}
declare class FingerPainter {
    private video;
    private canvas;
    private ctx;
    private hands;
    private camera;
    private isDrawing;
    private lastPoint;
    private currentColor;
    private brushSize;
    private statusElement;
    private isShiftPressed;
    constructor();
    private setupCanvas;
    private setupControls;
    private setupKeyboardControls;
    private initializeHandTracking;
    private setupCamera;
    private onHandResults;
    private processHandLandmarks;
    private startDrawing;
    private continueDrawing;
    private stopDrawing;
    private clearCanvas;
    private saveCanvas;
    private updateStatus;
}
