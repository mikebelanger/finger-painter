interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

interface HandResults {
  multiHandLandmarks?: Array<Array<HandLandmark>>;
  multiHandedness?: Array<{ label: string; score: number }>;
}

interface MediaPipeHands {
  setOptions(options: {
    maxNumHands: number;
    modelComplexity: number;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
  }): void;
  onResults(callback: (results: HandResults) => void): void;
  send(data: { image: HTMLVideoElement }): Promise<void>;
}

interface MediaPipeCamera {
  start(): Promise<void>;
}

declare global {
  interface Window {
    Hands: new (options: { locateFile: (file: string) => string }) => MediaPipeHands;
    Camera: new (
      video: HTMLVideoElement,
      options: {
        onFrame: () => Promise<void>;
        width: number;
        height: number;
      }
    ) => MediaPipeCamera;
  }
}

export {};