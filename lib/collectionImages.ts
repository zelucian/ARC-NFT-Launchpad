/**
 * Guaranteed 100% Base64 Encoded SVG Data URIs for Web3 NFT Collections.
 * Base64 encoding avoids URL hash fragment (#) syntax errors in Chrome/Edge/Firefox.
 */

function svgToBase64(svgString: string): string {
  if (typeof window !== "undefined" && window.btoa) {
    return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgString)))}`;
  }
  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString("base64")}`;
}

function createCollectionSvg(
  bgGradientStart: string,
  bgGradientEnd: string,
  title: string,
  symbol: string,
  accentColor: string,
  shapeType: "monolith" | "sphere" | "cube" | "ring"
): string {
  const monolithShape = `
    <!-- Quantum Monolith Central Monument -->
    <rect x="220" y="100" width="160" height="280" rx="16" fill="url(#monolithGrad)" stroke="#ffffff" stroke-width="2" filter="url(#glow)" />
    <line x1="220" y1="180" x2="380" y2="180" stroke="${accentColor}" stroke-width="3" opacity="0.8" />
    <polygon points="300,120 350,220 250,220" fill="${accentColor}" opacity="0.6" />
  `;

  const shapeContent = shapeType === "monolith" ? monolithShape : `
    <circle cx="300" cy="240" r="120" fill="${accentColor}" opacity="0.3" filter="url(#glow)" />
    <polygon points="300,100 400,320 200,320" fill="url(#glass)" stroke="#ffffff" stroke-width="2" />
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGradientStart}" />
        <stop offset="100%" stop-color="${bgGradientEnd}" />
      </linearGradient>
      <linearGradient id="monolithGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#1d4ed8" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="600" height="600" fill="url(#bgGrad)" />

    <!-- Grid lines -->
    <path d="M0,150 L600,150 M0,300 L600,300 M0,450 L600,450 M150,0 L150,600 M300,0 L300,600 M450,0 L450,600" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />

    <!-- Ambient Glow Orbs -->
    <circle cx="300" cy="240" r="160" fill="${accentColor}" opacity="0.25" filter="url(#glow)" />
    
    ${shapeContent}

    <!-- Glassmorphic Info Banner -->
    <rect x="40" y="430" width="520" height="130" rx="20" fill="url(#glass)" stroke="#ffffff" stroke-opacity="0.4" stroke-width="1.5" />
    <text x="70" y="485" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="900" letter-spacing="-0.5">${title}</text>
    <text x="70" y="520" fill="${accentColor}" font-family="monospace" font-size="16" font-weight="700">ARC NETWORK • ${symbol} • NFT</text>
  </svg>`;

  return svgToBase64(svg);
}

export const COLLECTION_IMAGES = {
  col1: {
    banner: createCollectionSvg("#0f172a", "#1e3a8a", "Aether Sentinels Genesis", "ASG", "#38bdf8", "cube"),
    featured: createCollectionSvg("#1e3a8a", "#2563eb", "Aether Sentinels Genesis", "ASG", "#60a5fa", "cube"),
  },
  col2: {
    banner: createCollectionSvg("#1e1b4b", "#312e81", "Chronos Nexus 2099", "CNEX", "#a855f7", "sphere"),
    featured: createCollectionSvg("#312e81", "#4c1d95", "Chronos Nexus 2099", "CNEX", "#c084fc", "sphere"),
  },
  col3: {
    banner: createCollectionSvg("#022c22", "#065f46", "ARC Neon Racers", "RACE", "#34d399", "ring"),
    featured: createCollectionSvg("#065f46", "#047857", "ARC Neon Racers", "RACE", "#6ee7b7", "ring"),
  },
  col4: {
    banner: createCollectionSvg("#4c0519", "#881337", "Spectral Soundwaves", "WAVE", "#fb7185", "ring"),
    featured: createCollectionSvg("#881337", "#9f1239", "Spectral Soundwaves", "WAVE", "#fda4af", "ring"),
  },
  col5: {
    banner: createCollectionSvg("#78350f", "#b45309", "Hyperion Real Estate", "HRE", "#fbbf24", "cube"),
    featured: createCollectionSvg("#b45309", "#d97706", "Hyperion Real Estate", "HRE", "#fde047", "cube"),
  },
  col6: {
    banner: createCollectionSvg("#090d16", "#1e293b", "Quantum Void Monoliths", "VOID", "#38bdf8", "monolith"),
    featured: createCollectionSvg("#0f172a", "#1e3a8a", "Quantum Void Monoliths", "VOID", "#0ea5e9", "monolith"),
  },
  col7: {
    banner: createCollectionSvg("#1e293b", "#0f172a", "Cybernetic Cyberpunks", "CYBER", "#ec4899", "sphere"),
    featured: createCollectionSvg("#334155", "#1e293b", "Cybernetic Cyberpunks", "CYBER", "#f472b6", "sphere"),
  },
  col8: {
    banner: createCollectionSvg("#14532d", "#052e16", "Solaria Energy Grids", "GRID", "#10b981", "ring"),
    featured: createCollectionSvg("#166534", "#14532d", "Solaria Energy Grids", "GRID", "#34d399", "ring"),
  },
  col9: {
    banner: createCollectionSvg("#581c87", "#3b0764", "Nebula Synth Beats", "SYNTH", "#c084fc", "monolith"),
    featured: createCollectionSvg("#6b21a8", "#581c87", "Nebula Synth Beats", "SYNTH", "#e879f9", "monolith"),
  },
  col10: {
    banner: createCollectionSvg("#701a75", "#4a044e", "Galactic Starships Pass", "SHIP", "#f43f5e", "cube"),
    featured: createCollectionSvg("#86198f", "#701a75", "Galactic Starships Pass", "SHIP", "#fb7185", "cube"),
  },
  col11: {
    banner: createCollectionSvg("#0c4a6e", "#082f49", "Aetheria Land Parcels", "LAND", "#0284c7", "sphere"),
    featured: createCollectionSvg("#0369a1", "#0c4a6e", "Aetheria Land Parcels", "LAND", "#38bdf8", "sphere"),
  },
  col12: {
    banner: createCollectionSvg("#365314", "#1a2e05", "BioGene Alpha Pass", "GENE", "#84cc16", "ring"),
    featured: createCollectionSvg("#3f6212", "#365314", "BioGene Alpha Pass", "GENE", "#a3e635", "ring"),
  },
};
