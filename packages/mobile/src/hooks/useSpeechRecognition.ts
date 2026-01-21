import { useEffect, useRef, useState, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  enabled?: boolean;
  continuous?: boolean; // Keep listening continuously
  language?: string;
}

interface UseSpeechRecognitionReturn {
  transcript: string; // Latest recognized text (final)
  interimTranscript: string; // Interim recognized text (while speaking)
  isListening: boolean;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export function useSpeechRecognition(
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn {
  const { enabled = false, continuous = true, language = 'en-US' } = options;

  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStartingRef = useRef(false);
  const shouldRestartRef = useRef(true);

  // Check browser support
  const SpeechRecognitionAPI =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = !!SpeechRecognitionAPI;

  const startListening = useCallback(() => {
    try {
      console.log('[SpeechRecognition] startListening called');

      // Prevent race condition - don't start if already starting
      if (isStartingRef.current) {
        console.log('[SpeechRecognition] Already starting, ignoring...');
        return;
      }

      isStartingRef.current = true;
      shouldRestartRef.current = true;
      setError(null);

      // Check if SpeechRecognition is available
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      console.log('[SpeechRecognition] SpeechRecognition available:', !!SpeechRecognition);
      console.log('[SpeechRecognition] Browser:', navigator.userAgent);

      if (!SpeechRecognition) {
        isStartingRef.current = false;
        throw new Error('Speech recognition not supported in this browser');
      }

      // Check microphone permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('[SpeechRecognition] Checking microphone permission...');
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            console.log('[SpeechRecognition] Microphone permission granted');
          })
          .catch((err) => {
            console.error('[SpeechRecognition] Microphone permission denied:', err);
            setError(`Microphone permission denied: ${err.message}`);
          });
      }

      // Create recognition instance if not exists
      if (!recognitionRef.current) {
        console.log('[SpeechRecognition] Creating new recognition instance');
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = true; // Get results while speaking
        recognition.lang = language;
        recognition.maxAlternatives = 1;

        console.log('[SpeechRecognition] Configuration:', {
          continuous,
          interimResults: true,
          lang: language,
          maxAlternatives: 1,
        });

        // Handle results
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          console.log('[SpeechRecognition] onresult fired, results length:', event.results.length);

          const result = event.results[event.results.length - 1];
          const transcriptText = result[0].transcript;

          console.log('[SpeechRecognition] Result:', transcriptText, 'Final:', result.isFinal, 'Confidence:', result[0].confidence);

          if (result.isFinal) {
            // Final result - update main transcript
            console.log('[SpeechRecognition] Setting final transcript:', transcriptText);
            setTranscript(transcriptText.trim().toLowerCase());
            setInterimTranscript(''); // Clear interim
          } else {
            // Interim result - update interim transcript
            console.log('[SpeechRecognition] Setting interim transcript:', transcriptText);
            setInterimTranscript(transcriptText.trim());
          }
        };

        // Handle start
        recognition.onstart = () => {
          console.log('[SpeechRecognition] Started - recognition active');
          setIsListening(true);
          setError(null);
          isStartingRef.current = false; // Clear starting flag
        };

        // Handle audio start (microphone is capturing audio)
        recognition.onaudiostart = () => {
          console.log('[SpeechRecognition] Audio start - microphone is capturing audio');
        };

        // Handle sound start (sound has been detected)
        recognition.onsoundstart = () => {
          console.log('[SpeechRecognition] Sound start - sound detected');
        };

        // Handle speech start (speech has been detected)
        recognition.onspeechstart = () => {
          console.log('[SpeechRecognition] Speech start - speech detected');
        };

        // Handle speech end
        recognition.onspeechend = () => {
          console.log('[SpeechRecognition] Speech end');
        };

        // Handle sound end
        recognition.onsoundend = () => {
          console.log('[SpeechRecognition] Sound end');
        };

        // Handle audio end
        recognition.onaudioend = () => {
          console.log('[SpeechRecognition] Audio end');
        };

        // Handle end
        recognition.onend = () => {
          console.log('[SpeechRecognition] Ended');
          setIsListening(false);
          isStartingRef.current = false; // Clear starting flag

          // Restart if still enabled (works for both continuous and non-continuous modes)
          if (enabled && shouldRestartRef.current) {
            const restartDelay = continuous ? 500 : 300; // Faster restart in non-continuous mode
            console.log(`[SpeechRecognition] Scheduling restart in ${restartDelay}ms...`);
            setTimeout(() => {
              if (shouldRestartRef.current && !isStartingRef.current) {
                try {
                  console.log('[SpeechRecognition] Attempting restart...');
                  recognition.start();
                } catch (err) {
                  console.warn('[SpeechRecognition] Restart failed:', err);
                  isStartingRef.current = false;
                }
              } else {
                console.log('[SpeechRecognition] Restart cancelled');
              }
            }, restartDelay);
          }
        };

        // Handle errors
        recognition.onerror = (event: any) => {
          console.error('[SpeechRecognition] Error:', event.error);

          // Ignore "no-speech" errors in continuous mode
          if (event.error === 'no-speech' && continuous) {
            return;
          }

          // Ignore "aborted" errors (happens when stopping)
          if (event.error === 'aborted') {
            return;
          }

          setError(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }

      // Start recognition
      if (recognitionRef.current) {
        console.log('[SpeechRecognition] Calling recognition.start()...');
        recognitionRef.current.start();
        console.log('[SpeechRecognition] recognition.start() called successfully');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start speech recognition';
      setError(errorMessage);
      console.error('[SpeechRecognition] Start error:', err);
      isStartingRef.current = false; // Clear starting flag on error
    }
  }, [continuous, language, enabled]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      console.log('[SpeechRecognition] Stopping...');
      shouldRestartRef.current = false; // Prevent restart
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // Auto-start/stop based on enabled prop
  useEffect(() => {
    if (enabled && !isListening) {
      startListening();
    } else if (!enabled && isListening) {
      stopListening();
    }
  }, [enabled, isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
