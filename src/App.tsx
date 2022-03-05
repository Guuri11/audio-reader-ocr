import React, { useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {

  const video = document.querySelector('video');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setUp = async () => {
    if (video) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      video.srcObject = stream;
      video.addEventListener('playing', async () => {
        const worker = Tesseract.createWorker();
        await worker.load();
        await worker.loadLanguage('es');
        await worker.initialize('es');

        const canvas = document.createElement('canvas');
        canvas.width = video.width;
        canvas.height = video.height;
        
        document.addEventListener('keypress', async (e) => {
          if (e.code === 'Space') {
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.width, video.height);
            const recognizeObj = await worker.recognize(canvas);
            speechSynthesis.speak(new SpeechSynthesisUtterance(recognizeObj.data.text.replace(/\s/g, ' ')))
            
          }
        })

      })
    }
  }

  useEffect(() => {
    setUp();
  }, [setUp])

  return (
    <div>
      <h1>Audio Reader with OCR</h1>
      <video width="720" height="560" autoPlay muted />
      <p>Show a text to the cam and press Start. Then wait for the Speech Synthesis API for speak</p>
    </div>
  );
}

export default App;
