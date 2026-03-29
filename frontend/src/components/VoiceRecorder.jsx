import { useState, useRef } from "react";

export default function VoiceRecorder({ setAnswer, setConfidence }) {

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {

      let finalTranscript = "";
      let confidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {

        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          confidence = event.results[i][0].confidence;
        }

      }

     if (
    finalTranscript &&
    finalTranscript !== lastTranscriptRef.current
  ) {
    setAnswer(prev => (prev + " " + finalTranscript).trim());
    setConfidence(confidence);
    lastTranscriptRef.current = finalTranscript;
  }
};
    recognition.onerror = (event) => {
      console.log("Speech error:", event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {!listening ? (
        <button onClick={startListening}>
          🎤 Start Speaking
        </button>
      ) : (
        <button onClick={stopListening}>
          ⛔ Stop
        </button>
      )}
    </div>
  );
}
