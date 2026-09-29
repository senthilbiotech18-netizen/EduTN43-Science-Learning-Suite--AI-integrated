import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, Sparkles, X, Check, AlertCircle, Trash2, ShieldCheck, Loader2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentApiKey: string;
  onSaveApiKey: (newKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentApiKey,
  onSaveApiKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(currentApiKey);
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTestKey = async () => {
    const keyToTest = apiKeyInput.trim();
    if (!keyToTest) {
      setTestStatus('invalid');
      setTestMessage('Please enter an API key to test.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Contacting Google Gemini API...');

    try {
      const res = await fetch('/api/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': keyToTest,
        },
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setTestStatus('valid');
        setTestMessage(data.message || 'API key verified and connected successfully!');
      } else {
        setTestStatus('invalid');
        setTestMessage(data.message || 'Verification failed. Please check your API key.');
      }
    } catch (err: any) {
      setTestStatus('invalid');
      setTestMessage(err?.message || 'Network error testing API key.');
    }
  };

  const handleSave = () => {
    onSaveApiKey(apiKeyInput.trim());
    onClose();
  };

  const handleClear = () => {
    setApiKeyInput('');
    setTestStatus('idle');
    setTestMessage('');
    onSaveApiKey('');
  };

  const hasCustomKey = !!currentApiKey && currentApiKey.trim().length > 0;
  const maskedKey = currentApiKey
    ? `${currentApiKey.slice(0, 6)}••••••••${currentApiKey.slice(-4)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#112238] border border-blue-400/40 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#F4EFE2]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-blue-400/20 bg-[#0c1827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-mono-custom text-lg font-bold text-white flex items-center gap-2">
                Student Gemini API Key
              </h2>
              <p className="text-xs text-blue-200/80 font-serif-custom">
                Use your personal API key or stay on the built-in AI key
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900/50 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Status Callout */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
            hasCustomKey
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
              : 'bg-blue-950/40 border-blue-500/30 text-blue-100'
          }`}>
            <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${hasCustomKey ? 'text-emerald-400' : 'text-blue-400'}`} />
            <div className="space-y-0.5">
              <div className="font-mono-custom font-bold uppercase tracking-wider">
                {hasCustomKey ? 'Custom Student Key Active' : 'Default System Key Active'}
              </div>
              <p className="font-serif-custom text-[13px] opacity-90">
                {hasCustomKey
                  ? `Your personal key (${maskedKey}) is currently powering Socratic feedback and custom topic generation.`
                  : 'Currently utilizing the built-in AI Scribe service. You can provide your own Google Gemini key below anytime.'}
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label className="block font-mono-custom text-xs font-bold text-blue-200 uppercase tracking-wider">
              Google Gemini API Key:
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestStatus('idle');
                  setTestMessage('');
                }}
                placeholder="Paste AIzaSy..."
                className="w-full bg-[#08121E] border border-blue-400/30 rounded-xl px-4 py-3 text-sm font-mono-custom text-white placeholder-blue-300/30 focus:outline-hidden focus:border-amber-400 pr-24"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-900/50 transition-colors cursor-pointer"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      setTestStatus('idle');
                    }}
                    className="p-1.5 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 transition-colors cursor-pointer"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-blue-300/70 font-serif-custom italic">
              Your API key is stored securely in your browser session only. It is never logged or saved to any external database.
            </p>
          </div>

          {/* Test Status Feedback Banner */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-lg border text-xs font-mono-custom flex items-center gap-2 ${
              testStatus === 'testing'
                ? 'bg-blue-950/60 border-blue-400 text-blue-200'
                : testStatus === 'valid'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500 text-rose-200'
            }`}>
              {testStatus === 'testing' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
              {testStatus === 'valid' && <Check className="w-4 h-4 text-emerald-400" />}
              {testStatus === 'invalid' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              <span>{testMessage}</span>
            </div>
          )}

          {/* How to get a key helper */}
          <div className="text-[11px] text-blue-200/80 bg-blue-950/30 p-3 rounded-xl border border-blue-400/20 font-serif-custom flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              Don't have a Gemini API key? You can get a free key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 underline font-mono-custom hover:text-amber-200"
              >
                Google AI Studio (aistudio.google.com)
              </a>
              . Or leave this blank to use the built-in service!
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0c1827] border-t border-blue-400/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={!apiKeyInput.trim() || testStatus === 'testing'}
              className="px-3.5 py-2 rounded-xl text-xs font-mono-custom font-bold bg-blue-800 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-800 text-white transition-colors cursor-pointer border border-blue-400/30 flex items-center gap-1.5"
            >
              {testStatus === 'testing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Test Key
                </>
              )}
            </button>

            {hasCustomKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-mono-custom text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors cursor-pointer border border-rose-500/30 flex items-center gap-1"
                title="Reset to system default key"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset to Default
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-mono-custom text-blue-200 hover:text-white hover:bg-blue-900/50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-mono-custom font-bold bg-amber-500 hover:bg-amber-400 text-blue-950 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Key Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
