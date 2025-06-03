// src/components/ui/MoneyControl.tsx
import React, { useState } from 'react';
import { useMouseEffectContext } from '@/providers/MouseEffectProvider';

export const MoneyControl: React.FC = () => {
  const { toggleEffect, isEffectEnabled, setIntensity, intensity } =
    useMouseEffectContext();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Money Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            group flex h-16 w-16 items-center justify-center
            overflow-hidden rounded-full border-2 shadow-xl backdrop-blur-md transition-all
            duration-500 ease-out hover:scale-110 active:scale-95
            ${
              isEffectEnabled
                ? 'from-yellow-400/90 via-yellow-500/80 border-yellow-300/50 shadow-yellow-500/50 bg-gradient-to-br to-amber-600/90 text-amber-900'
                : 'border-gray-500/50 bg-gray-700/90 text-gray-300 shadow-gray-900/50'
            }
          `}
        >
          {/* Animated money background */}
          {isEffectEnabled && (
            <div className="absolute inset-0 opacity-30">
              <div
                className="absolute left-1 top-1 animate-bounce text-xs"
                style={{ animationDelay: '0s' }}
              >
                💰
              </div>
              <div
                className="absolute right-1 top-1 animate-bounce text-xs"
                style={{ animationDelay: '0.5s' }}
              >
                🪙
              </div>
              <div
                className="absolute bottom-1 left-1 animate-bounce text-xs"
                style={{ animationDelay: '1s' }}
              >
                💎
              </div>
              <div
                className="absolute bottom-1 right-1 animate-bounce text-xs"
                style={{ animationDelay: '1.5s' }}
              >
                ✨
              </div>
            </div>
          )}

          {/* Main Money Icon */}
          <div className="relative z-10">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`transition-all duration-500 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            >
              {/* Dollar coin */}
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H6" />
              <path d="M12 18V6" />

              {/* Sparkles when enabled */}
              {isEffectEnabled && !isExpanded && (
                <>
                  <circle cx="6" cy="6" r="1" opacity="0.8">
                    <animate
                      attributeName="opacity"
                      values="0.8;0.2;0.8"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="18" cy="6" r="0.5" opacity="0.6">
                    <animate
                      attributeName="opacity"
                      values="0.6;0.1;0.6"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="6" cy="18" r="0.5" opacity="0.7">
                    <animate
                      attributeName="opacity"
                      values="0.7;0.2;0.7"
                      dur="1.8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="18" cy="18" r="1" opacity="0.5">
                    <animate
                      attributeName="opacity"
                      values="0.5;0.1;0.5"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
            </svg>
          </div>

          {/* Golden pulse when active */}
          {isEffectEnabled && !isExpanded && (
            <div className="border-yellow-300/40 absolute inset-0 animate-ping rounded-full border-2" />
          )}
        </button>

        {/* Money Control Panel */}
        {isExpanded && (
          <div
            className={`
            from-yellow-50/95 to-orange-50/95 border-yellow-200/50 shadow-yellow-500/20 absolute bottom-20
            right-0 w-80 origin-bottom-right transform
            rounded-2xl border bg-gradient-to-br
            via-amber-50/90 p-6 shadow-2xl backdrop-blur-2xl transition-all
            duration-500 ease-out
          `}
          >
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-2 text-4xl">💰</div>
              <h3 className="mb-1 text-xl font-bold text-amber-800">
                Money Rain
              </h3>
              <p className="text-sm text-amber-600">Make it rain coins! 🪙</p>
            </div>

            {/* Main Toggle */}
            <div className="from-yellow-100 border-yellow-200 mb-6 flex items-center justify-between rounded-xl border bg-gradient-to-r to-amber-100 p-4">
              <div>
                <span className="font-semibold text-amber-800">
                  💸 Enable Money Rain
                </span>
                <p className="text-xs text-amber-600">Coins fall from cursor</p>
              </div>
              <button
                onClick={toggleEffect}
                className={`
                  relative h-8 w-16 rounded-full transition-all duration-300
                  ${
                    isEffectEnabled
                      ? 'from-yellow-400 via-yellow-500 shadow-yellow-500/30 bg-gradient-to-r to-amber-500 shadow-lg'
                      : 'bg-gray-400'
                  }
                `}
              >
                <div
                  className={`
                    absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition-all
                    duration-300 ${isEffectEnabled ? 'left-9' : 'left-1'}
                    flex items-center justify-center text-xs
                  `}
                >
                  {isEffectEnabled ? '💰' : '🚫'}
                </div>
              </button>
            </div>

            {/* Coin Types Preview */}
            <div className="border-yellow-200 mb-6 rounded-xl border bg-white/70 p-4">
              <div className="mb-3 font-semibold text-amber-800">
                🪙 Coin Types:
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Gold', icon: '🟡', desc: 'Classic gold coins' },
                  { name: 'Silver', icon: '⚪', desc: 'Shiny silver coins' },
                  { name: 'Dollar', icon: '💵', desc: 'Dollar symbols' },
                  { name: 'Bling', icon: '💎', desc: 'Diamond sparkles' }
                ].map((coin, index) => (
                  <div
                    key={coin.name}
                    className="from-yellow-100 hover:from-yellow-200 rounded-lg bg-gradient-to-b to-amber-100 p-2 text-center transition-colors hover:to-amber-200"
                    title={coin.desc}
                  >
                    <div className="mb-1 text-lg">{coin.icon}</div>
                    <div className="text-xs font-medium text-amber-700">
                      {coin.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Intensity Control */}
            {isEffectEnabled && (
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-amber-800">
                      💸 Money Intensity
                    </span>
                    <p className="text-xs text-amber-600">
                      How much money rains down
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-600 font-mono text-xl font-bold">
                      {Math.round(intensity * 100)}%
                    </span>
                    <p className="text-xs text-amber-600">
                      {intensity <= 1
                        ? 'Poor 🥺'
                        : intensity <= 2
                          ? 'Rich 💰'
                          : 'Millionaire 🤑'}
                    </p>
                  </div>
                </div>

                <div className="relative mb-4">
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    className="bg-yellow-200 money-slider h-4 w-full cursor-pointer appearance-none rounded-full"
                  />

                  <div
                    className="from-yellow-400 via-yellow-500 pointer-events-none absolute top-0 h-4 rounded-full bg-gradient-to-r to-amber-500 transition-all duration-300"
                    style={{ width: `${((intensity - 0.1) / 2.9) * 100}%` }}
                  />
                </div>

                {/* Wealth Presets */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      name: 'Poor',
                      value: 0.5,
                      emoji: '🥺',
                      color: 'from-gray-400 to-gray-500'
                    },
                    {
                      name: 'Rich',
                      value: 1.5,
                      emoji: '💰',
                      color: 'from-yellow-400 to-yellow-500'
                    },
                    {
                      name: 'Billionaire',
                      value: 3,
                      emoji: '🤑',
                      color: 'from-yellow-500 to-amber-600'
                    }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setIntensity(preset.value)}
                      className={`
                        relative overflow-hidden rounded-xl px-2 py-3 text-sm transition-all duration-200
                        ${
                          intensity === preset.value
                            ? `bg-gradient-to-r ${preset.color} scale-105 transform text-white shadow-lg`
                            : 'bg-yellow-100 hover:bg-yellow-200 text-amber-700'
                        }
                      `}
                    >
                      <div className="mb-1 text-lg">{preset.emoji}</div>
                      <div className="font-semibold">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {isEffectEnabled && (
              <div className="rounded-xl border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 p-4">
                <div className="mb-2 font-semibold text-green-800">
                  💡 How to get rich:
                </div>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>🖱️ Move mouse to drop coins</li>
                  <li>🖱️ Click for money explosion!</li>
                  <li>⚡ Move faster = more coins</li>
                  <li>🏀 Coins bounce realistically</li>
                </ul>
              </div>
            )}

            {/* Status */}
            <div className="border-yellow-200 mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <div
                  className={`
                    h-3 w-3 rounded-full transition-all duration-300
                    ${
                      isEffectEnabled
                        ? 'animate-pulse bg-green-500 shadow-lg shadow-green-500/50'
                        : 'bg-gray-400'
                    }
                  `}
                />
                <span
                  className={`font-semibold ${isEffectEnabled ? 'text-green-700' : 'text-gray-500'}`}
                >
                  {isEffectEnabled ? 'Money Raining! 💸' : 'Broke 😢'}
                </span>
              </div>

              <div className="text-sm text-amber-600">
                💰 Affiliate Cash Flow
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Slider Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .money-slider::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
            position: relative;
          }
          
          .money-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
          }
        `
        }}
      />
    </div>
  );
};
