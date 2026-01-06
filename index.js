import React, { useState, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { QRCodeSVG } from 'qrcode.react';
import htm from 'htm';

const html = htm.bind(React.createElement);

const IconLink = () => html`
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
`;

const IconWifi = () => html`
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
`;

const IconDownload = () => html`
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
`;

const LOGO_PRESETS = {
  'google': 'https://www.gstatic.com/images/branding/product/2x/googleg_48dp.png',
  'gcloud': 'https://www.gstatic.com/images/branding/product/2x/cloud_48dp.png',
  'drive': 'https://www.gstatic.com/images/branding/product/2x/drive_48dp.png',
  'synology': 'https://www.synology.com/img/synology_logo_s.png',
  'search': 'https://www.gstatic.com/images/branding/product/2x/search_48dp.png'
};

const PRESETS = [
  { name: 'Dark', hex: '#020617' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Grape', hex: '#7c3aed' },
];

const App = () => {
  const [tab, setTab] = useState('URL');
  const [text, setText] = useState('https://');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [qrColor, setQrColor] = useState('#020617');
  const [showLogo, setShowLogo] = useState(false);
  const [logoSource, setLogoSource] = useState('google');
  
  const qrRef = useRef(null);

  const resolvedLogoUrl = useMemo(() => {
    return LOGO_PRESETS[logoSource.toLowerCase()] || logoSource;
  }, [logoSource]);

  const qrValue = useMemo(() => {
    if (tab === 'URL') return text.trim() || 'https://';
    const enc = encryption === 'nopass' ? 'nopass' : encryption;
    return `WIFI:S:${ssid.trim()};T:${enc};P:${password};;`;
  }, [tab, text, ssid, password, encryption]);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 2048;
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        const margin = size * 0.1;
        ctx.drawImage(img, margin, margin, size - margin * 2, size - margin * 2);
        const link = document.createElement('a');
        link.download = `QR_${tab}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const imageSettings = useMemo(() => {
    if (!showLogo || !resolvedLogoUrl) return undefined;
    return {
      src: resolvedLogoUrl,
      height: 48,
      width: 48,
      excavate: true,
    };
  }, [showLogo, resolvedLogoUrl]);

  return html`
    <div className="min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 glass-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white leading-none">QuickQR Studio</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1.5">Synology DS220+ Local Instance</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 mb-10">
            <button 
              onClick=${() => setTab('URL')}
              className=${`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black transition-all ${tab === 'URL' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <${IconLink} /> URL / TEXT
            </button>
            <button 
              onClick=${() => setTab('WIFI')}
              className=${`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-black transition-all ${tab === 'WIFI' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <${IconWifi} /> WIFI
            </button>
          </div>

          <div className="space-y-8">
            ${tab === 'URL' ? html`
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Content / Destination</label>
                <textarea 
                  value=${text}
                  onInput=${(e) => setText(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-lg min-h-[140px] resize-none"
                  placeholder="Paste URL or Text..."
                />
              </div>
            ` : html`
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SSID Name</label>
                    <input 
                      type="text" 
                      value=${ssid}
                      onInput=${(e) => setSsid(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-4 focus:ring-blue-500/10"
                      placeholder="Network Name"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Encryption</label>
                    <select 
                      value=${encryption}
                      onChange=${(e) => setEncryption(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none appearance-none cursor-pointer"
                    >
                      <option value="WPA">WPA/WPA2/WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Open (No Pass)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <input 
                    type="password" 
                    value=${password}
                    disabled=${encryption === 'nopass'}
                    onInput=${(e) => setPassword(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none disabled:opacity-20 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            `}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-white/5">
              <div className="space-y-5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">QR Color Preset</label>
                <div className="flex flex-wrap items-center gap-3">
                  ${PRESETS.map(p => html`
                    <button 
                      key=${p.hex}
                      onClick=${() => setQrColor(p.hex)}
                      style=${{ backgroundColor: p.hex }}
                      className=${`w-10 h-10 rounded-xl transition-all hover:scale-110 active:scale-90 ${qrColor === p.hex ? 'ring-2 ring-white ring-offset-4 ring-offset-[#020617]' : 'opacity-40 hover:opacity-100'}`}
                    />
                  `)}
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Center Logo</label>
                  <button 
                    onClick=${() => setShowLogo(!showLogo)}
                    className=${`text-[10px] font-black px-3 py-1 rounded-full transition-all ${showLogo ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'}`}
                  >
                    ${showLogo ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
                <div className=${`space-y-3 transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                  <input 
                    type="text"
                    value=${logoSource}
                    onInput=${(e) => setLogoSource(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="URL or Preset (e.g. google, drive, synology)"
                  />
                  <div className="flex gap-2">
                    ${Object.entries(LOGO_PRESETS).map(([id, url]) => html`
                      <button 
                        key=${id}
                        onClick=${() => setLogoSource(id)}
                        className=${`p-1.5 rounded-lg bg-white/5 border transition-all hover:bg-white/10 ${logoSource.toLowerCase() === id ? 'border-blue-600 ring-1 ring-blue-600/30' : 'border-white/5'}`}
                        title=${id}
                      >
                        <img src=${url} className="w-5 h-5 object-contain" />
                      </button>
                    `)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="glass-card rounded-[3rem] p-12 flex flex-col items-center justify-center gap-10 text-center shadow-2xl min-h-[540px]">
            <div 
              ref=${qrRef}
              className="p-8 bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-105"
            >
              <${QRCodeSVG} 
                value=${qrValue} 
                size=${220} 
                fgColor=${qrColor} 
                level="H"
                includeMargin=${false}
                imageSettings=${imageSettings}
              />
            </div>
            
            <div className="w-full space-y-4">
              <button 
                onClick=${handleDownload}
                className="w-full py-5 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black shadow-2xl shadow-blue-900/40 transition-all active:scale-95"
              >
                <${IconDownload} />
                <span>SAVE HI-RES PNG</span>
              </button>
              <div className="flex items-center justify-center gap-2 opacity-60">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client-Side Secure</span>
              </div>
            </div>
          </div>
          
          <footer className="text-center text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] py-4">
            STATIC DEPLOYMENT &bull; LOGO ENGINE &bull; v4.3
          </footer>
        </div>

      </div>
    </div>
  `;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(html`<${App} />`);
}