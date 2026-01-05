import { useState } from 'react';
import { HapticFeedback } from '../utils/haptics';

interface PairingScreenProps {
  onPair: (code: string) => void;
  isConnecting: boolean;
  error?: string;
}

export function PairingScreen({ onPair, isConnecting, error }: PairingScreenProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      // Haptic feedback when connecting
      HapticFeedback.medium();
      onPair(code);
    }
  };

  const handleInputChange = (value: string) => {
    // Only allow numbers and max 6 digits
    const cleaned = value.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">📱 ↔️ 📺</div>
          <h1 className="text-4xl font-bold text-white mb-4">Mobile Lab Controller</h1>
          <p className="text-gray-400 text-lg">Enter the pairing code from your TV screen</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-white text-sm font-semibold mb-3">
              Pairing Code
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={code}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="000000"
              disabled={isConnecting}
              className="
                w-full px-6 py-5 text-4xl text-center font-bold
                bg-gray-800 text-white border-4 border-gray-700
                rounded-2xl tracking-widest
                focus:outline-none focus:border-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
              "
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border-2 border-red-500 rounded-xl px-4 py-3">
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={code.length !== 6 || isConnecting}
            className="
              w-full py-5 bg-blue-600 text-white text-xl font-bold
              rounded-2xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95
              shadow-lg hover:shadow-xl
            "
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            The pairing code is displayed on your TV screen
          </p>
        </div>
      </div>
    </div>
  );
}
