# Shamelessly done with Claude 4.0 - Please do not star this
I really can't take credit for this, all I did was the prompts, and a few minor corrections.  I'm just pushing this here because it's the easiest way of self-hosting this application, so users at [thespace](https://www.thespaceottawa.ca/) can try it out.

# Paint with Fingers

A web application that uses webcam hand tracking to paint on a canvas with finger movements. Built with TypeScript and MediaPipe for real-time hand detection.

## Features

- **Real-time hand tracking** using MediaPipe
- **Finger painting** by extending your index finger while keeping middle finger folded
- **Color selection** with multiple color options
- **Adjustable brush size**
- **Clear canvas** functionality
- **Save artwork** as PNG image
- **Responsive design** with intuitive controls

## How It Works

The application uses your webcam to detect hand landmarks and tracks your index finger tip position. To paint:

1. **Point with your index finger** - Extend your index finger
2. **Keep middle finger folded** - This acts as the "pen down" signal
3. **Move your hand** to draw on the canvas
4. **Fold your index finger** or extend middle finger to stop drawing

## Setup Instructions

### Prerequisites

- Modern web browser with webcam support
- Node.js (for TypeScript compilation)
- Python 3 (for local development server)

### Installation

1. **Clone or download** the project files

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the TypeScript**:
   ```bash
   npm run build
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

   Or manually:
   ```bash
   # Build TypeScript
   npm run build

   # Start local server
   python3 -m http.server 8000
   ```

5. **Open your browser** and navigate to `http://localhost:8000`

### Alternative Setup (No Build Required)

If you prefer to skip the TypeScript compilation, you can:

1. Copy the contents of `src/app.ts`
2. Convert it to JavaScript (remove type annotations)
3. Save as `dist/app.js`
4. Serve the files using any local web server

## Usage

### Getting Started

1. **Allow camera access** when prompted by your browser
2. **Wait for initialization** - You'll see "Ready!" when the hand tracking model loads
3. **Position yourself** in front of the camera with good lighting
4. **Start painting** using the finger gestures described above

### Controls

- **Color Palette**: Click any colored circle to change paint color
- **Brush Size**: Use the slider to adjust brush thickness (1-20 pixels)
- **Clear Canvas**: Remove all drawings from the canvas
- **Save Image**: Download your artwork as a PNG file

### Tips for Best Results

- **Good lighting** improves hand detection accuracy
- **Keep hands visible** within the camera frame
- **Avoid busy backgrounds** for better tracking
- **Maintain steady movements** for smoother lines
- **Practice the gesture** - index finger extended, middle finger folded

## Technical Details

### Technologies Used

- **TypeScript** - Type-safe JavaScript development
- **MediaPipe Hands** - Google's hand tracking solution
- **HTML5 Canvas** - Drawing surface
- **WebRTC** - Camera access

### Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari (with WebRTC support)
- Edge

### File Structure

```
PaintWithFingers/
├── index.html          # Main HTML file
├── src/
│   └── app.ts          # TypeScript source code
├── dist/
│   └── app.js          # Compiled JavaScript
├── package.json        # Node.js dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for changes and auto-compile
- `npm run serve` - Start local development server
- `npm start` - Build and serve (full development setup)
- `npm run clean` - Remove compiled files

### Customization

You can modify the application by editing `src/app.ts`:

- **Gesture recognition**: Modify the `processHandLandmarks` method
- **Drawing behavior**: Adjust the painting logic in drawing methods
- **UI elements**: Update the HTML and CSS
- **Hand tracking settings**: Change MediaPipe configuration options

## Troubleshooting

### Common Issues

**Camera not working:**
- Ensure browser has camera permissions
- Check if another application is using the camera
- Try refreshing the page

**Hand tracking not accurate:**
- Improve lighting conditions
- Remove background clutter
- Ensure hands are fully visible
- Try different camera angles

**Painting not responsive:**
- Check browser console for errors
- Verify gesture technique (index up, middle down)
- Ensure MediaPipe scripts loaded properly

**Performance issues:**
- Close other browser tabs
- Check system resources
- Try lowering video resolution
- Disable browser extensions

### Browser Console Errors

If you see errors in the browser console:

1. Ensure all MediaPipe scripts loaded correctly
2. Check network connectivity for CDN resources
3. Verify TypeScript compiled without errors
4. Clear browser cache and reload

## Contributing

Feel free to submit issues and enhancement requests. Some ideas for improvements:

- Multiple hand support for multi-color painting
- Different brush shapes and textures
- Gesture recognition for additional tools
- Recording and playback functionality
- Collaborative painting features

## License

This project is open source and available under the MIT License.
