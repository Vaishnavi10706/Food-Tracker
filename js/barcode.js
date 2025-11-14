/* ============================================
   BARCODE SCANNER - Quagga2 Integration
   ============================================ */

let quaggaInitialized = false;
let scanningActive = false;
let currentOnDetect = null;

/**
 * Initialize barcode scanner
 */
async function initBarcodeScanner(videoElementId, onDetect) {
  // Cleanup if already initialized
  if (quaggaInitialized) {
    cleanupScanner();
  }
  
  currentOnDetect = onDetect;

  // Check if Quagga2 is loaded
  if (typeof Quagga === 'undefined') {
    console.error('Quagga2 library not loaded');
    showToast('Barcode scanner library not loaded', 'error');
    return;
  }

  try {
    await Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.getElementById(videoElementId),
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment' // Use back camera
        }
      },
      locator: {
        patchSize: 'medium',
        halfSample: true
      },
      numOfWorkers: 2,
      decoder: {
        readers: [
          'ean_reader',
          'ean_8_reader',
          'code_128_reader',
          'code_39_reader',
          'upc_reader',
          'upc_e_reader'
        ]
      },
      locate: true
    }, (err) => {
      if (err) {
        console.error('Quagga initialization error:', err);
        showToast('Failed to initialize camera', 'error');
        return;
      }
      quaggaInitialized = true;
      startScanning(onDetect);
    });

    // Handle detection
    Quagga.onDetected((result) => {
      if (scanningActive && result && result.codeResult && currentOnDetect) {
        const code = result.codeResult.code;
        stopScanning();
        currentOnDetect(code);
      }
    });

  } catch (error) {
    console.error('Scanner setup error:', error);
    showToast('Camera access denied or not available', 'error');
  }
}

/**
 * Start scanning
 */
function startScanning(onDetect) {
  if (!quaggaInitialized) {
    return;
  }
  
  scanningActive = true;
  Quagga.start();
  
  // Draw bounding box
  Quagga.onProcessed((result) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
        result.boxes.filter((box) => {
          return box !== result.box;
        }).forEach((box) => {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#EF4444', lineWidth: 3 });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
      }
    }
  });
}

/**
 * Stop scanning
 */
function stopScanning() {
  if (quaggaInitialized && scanningActive) {
    scanningActive = false;
    Quagga.stop();
  }
}

/**
 * Cleanup scanner
 */
function cleanupScanner() {
  if (quaggaInitialized) {
    stopScanning();
    Quagga.offDetected();
    Quagga.offProcessed();
    quaggaInitialized = false;
  }
}

