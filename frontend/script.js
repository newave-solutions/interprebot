navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    // ... (Create WebSocket connection) ...

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        socket.emit('audio_data', event.data); // Send audio data to backend
      }
    };
    // ... (Start recording and handle WebSocket events) ...
  });