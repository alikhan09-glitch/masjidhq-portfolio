"use client";

import { useState, useRef, useEffect } from "react";
import { SURAH_FATIHA } from "@/lib/surah";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

/* ================= TYPE FIX ================= */

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function SurahDemo() {
  const [recognizedText, setRecognizedText] = useState("");
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const recognitionRef = useRef<any>(null);
  const lastSpokenIndexRef = useRef<number | null>(null);

  /* ================= NORMALIZE ================= */

  const normalizeArabic = (text: string) => {
    return text
      .replace(/[ًٌٍَُِّْٰ]/g, "")
      .replace(/[ۙۚۗۖۛۜ۞۠ﭤﴰ]/g, "")
      .replace(/آ|أ|إ/g, "ا")
      .replace(/ى|ی/g, "ي")
      .replace(/ة/g, "ه")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ي")
      .replace(/ک/g, "ك")
      .replace(/\s+/g, " ")
      .trim();
  };

  /* ================= SPEAK WORD FUNCTION ================= */

  const speakWord = (word: string) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ar-SA";
    utterance.rate = 0.9;

    // try to load arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith("ar"));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  /* ================= INIT RECOGNITION ================= */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-SA";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setRecognizedText(transcript);
      checkAccuracy(transcript);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);

      if (
        event.error === "not-allowed" ||
        event.error === "permission-denied"
      ) {
        setPermissionDenied(true);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    // Safari voice load fix
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  /* ================= START / STOP ================= */

  const startListening = () => {
    if (permissionDenied) {
      alert(
        "Microphone permission denied.\nSafari → Settings → Websites → Microphone → Allow."
      );
      return;
    }

    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
  };

  /* ================= CHECK ACCURACY ================= */

  const checkAccuracy = (spoken: string) => {
    const originalFull = normalizeArabic(SURAH_FATIHA.join(" "));
    const spokenNormalized = normalizeArabic(spoken);

    const originalWords = originalFull.split(" ");
    const spokenWords = spokenNormalized.split(" ");

    for (let i = 0; i < spokenWords.length; i++) {
      if (!originalWords[i]) break;

      if (!originalWords[i].includes(spokenWords[i])) {
        setErrorIndex(i);

        // 🔥 speak only once per mistake index
        if (lastSpokenIndexRef.current !== i) {
          speakWord(originalWords[i]);
          lastSpokenIndexRef.current = i;
        }

        return;
      }
    }

    setErrorIndex(null);
    lastSpokenIndexRef.current = null;
  };

  const displayWords = SURAH_FATIHA.join(" ").split(" ");

  /* ================= UI ================= */

  return (
    <section className="mx-4 my-20 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 mx-auto">

        <h2 className="text-3xl font-bold text-center mb-8">
          Surah Recitation Practice
        </h2>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl text-center text-2xl leading-loose border shadow-inner">
          {displayWords.map((word, index) => (
            <span
              key={index}
              className={`mx-1 transition-all duration-200  ${
                errorIndex === index
                  ? "text-red-600 font-bold underline"
                  : "text-gray-800"
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300
              ${
                isListening
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            `}
          >
            {isListening ? (
              <>
                <FaMicrophoneSlash className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <FaMicrophone className="w-5 h-5" />
                Start Recitation
              </>
            )}

            {isListening && (
              <span className="absolute -inset-1 rounded-full border-2 border-red-400 animate-ping opacity-50"></span>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Live Recognized Text</p>
          <p className="mt-3 text-lg text-gray-700 min-h-[40px]">
            {recognizedText || "Waiting for recitation..."}
          </p>
        </div>

        {permissionDenied && (
          <p className="text-red-600 text-sm mt-6 text-center">
            Microphone permission denied. Please allow microphone from browser settings.
          </p>
        )}
      </div>
    </section>
  );
}