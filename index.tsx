import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { QRCodeSVG } from 'qrcode.react';

enum QRType {
  URL = 'URL',
  WIFI = 'WIFI'
}

type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

interface WifiData {
  ssid: string;
  password?: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

const COLORS = [
  { name: 'Dark Slate', hex: '#0f172a' },
  { name: 'Indigo', hex: '#1e1b4b' },
  { name: 'Emerald', hex: '#064e3b' },
  { name: 'Rose', hex: '#881337' },
  { name: 'Violet', hex: '#4c1d95' },
];

const QRCodePreview: React.FC<{ value: string; color: string }> = ({ value, color }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadPNG = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const size = 2048;
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        const padding = size * 0.05;
        ctx.drawImage(img, padding, padding, size - padding * 2, size - padding * 2);
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div 
        ref={qrRef}
        className="p-8 bg-white rounded-[2rem] shadow-2xl transition-all hover:scale-[1.03] group relative"
      >
        <QRCodeSVG 
          value={value} 
          size={280} 
          fgColor={color} 
          level="H" 
          includeMargin={false}
          className="transition-opacity group-hover:opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/10 backdrop-blur-sm rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
        </div>
      </div>
      <button
        onClick={downloadPNG}
        className="w-full flex items-center justify-center space-x-3 py-4 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl transition-all active:scale-95"
      >
        <span>Save High-Quality Image</span>
      </button>
    </div>
  );
};

const QuickQR: React.FC = () => {
  const [type, setType] = useState<QRType>(QRType.URL);
  const [url, setUrl] = useState('https://');
  const [wifi, setWifi] = useState<WifiData>({ ssid: '', password: '', encryption: 'WPA', hidden: false });
  const [color, setColor] = useState('#0f172a');

  const qrValue = type === QRType.URL 
    ? (url || 'https://')
    : `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};H:${wifi.hidden ? 'true' : 'false'};;`;

  return (
    <div className="min-h-screen py-8 px-4 md:py-16 md:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase">
            <span>Local Generation</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
            Quick<span className="text-blue-500">QR</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Generate private QR codes without external data processing.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <section className="lg:col-span-7 glass rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
            <nav className="flex bg-slate-900/50 p-1 rounded-2xl mb-8 border border-white/5">
              <button
                onClick={() => setType(QRType.URL)}
                className={`flex-1 py-4 rounded-xl font-bold transition-all ${type === QRType.URL ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
              >URL</button>
              <button
                onClick={() => setType(QRType.WIFI)}
                className={`flex-1 py-4 rounded-xl font-bold transition-all ${type === QRType.WIFI ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
              >WiFi</button>
            </nav>

            <div className="space-y-6">
              {type === QRType.URL ? (
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Destination URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">SSID</label>
                    <input
                      type="text"
                      value={wifi.ssid}
                      onChange={(e) => setWifi({...wifi, ssid: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
                    <input
                      type="password"
                      value={wifi.password}
                      onChange={(e) => setWifi({...wifi, password: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={wifi.encryption}
                      onChange={(e) => setWifi({...wifi, encryption: e.target.value as WifiEncryption})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="WPA">WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open</option>
                    </select>
                    <label className="flex items-center cursor-pointer bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4">
                      <input
                        type="checkbox"
                        checked={wifi.hidden}
                        onChange={(e) => setWifi({...wifi, hidden: e.target.checked})}
                        className="w-5 h-5 rounded bg-slate-900 text-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-400 font-bold">Hidden</span>
                    </label>
                  </div>
                </div>
              )}
              <div className="pt-8 border-t border-white/5">
                <label className="block text-sm font-bold text-slate-400 mb-4">Color Palette</label>
                <div className="flex flex-wrap gap-4">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setColor(c.hex)}
                      className={`w-12 h-12 rounded-2xl border-2 transition-all ${color === c.hex ? 'border-blue-500 shadow-lg' : 'border-transparent'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 rounded-2xl bg-transparent border-2 border-white/10 p-0" />
                </div>
              </div>
            </div>
          </section>
          <section className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="glass rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
              <QRCodePreview value={qrValue} color={color} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) createRoot(root).render(<QuickQR />);
