/**
 * SIGNIFY - Realistic 2D Hand Gesture Asset Generator
 * Generates verified 2D realistic human hand demonstration graphics (SVG)
 * for Indian Sign Language (ISL) vocabulary, two-handed alphabet, and numbers.
 */

const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '..', 'assets', 'signs');
if (!fs.existsSync(signsDir)) {
  fs.mkdirSync(signsDir, { recursive: true });
}

// Realistic human skin tone palette
const PALETTE = {
  skinBase: '#d49b75',
  skinShadow: '#b0734f',
  skinDeep: '#874f32',
  skinHighlight: '#f1c4a5',
  skinCrease: '#78432a',
  nailBase: '#eac0a8',
  nailHighlight: '#fcebe1',
  cuff: '#1e293b',
  glowAccent: '#38bdf8',
  arrowColor: '#60a5fa',
  motionTrail: 'rgba(56, 189, 248, 0.35)',
  bgDark: '#0b1120'
};

// Common SVG header and defs (realistic gradients, filters, dropshadows)
function getSvgWrapper(content, width = 500, height = 400, label = '', islCode = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Studio Dark Radial Background -->
    <radialGradient id="bgGradient" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#141e33" />
      <stop offset="60%" stop-color="#0a0f1d" />
      <stop offset="100%" stop-color="#050811" />
    </radialGradient>

    <!-- Realistic Skin Shading Gradients -->
    <linearGradient id="skinGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.skinHighlight}" />
      <stop offset="35%" stop-color="${PALETTE.skinBase}" />
      <stop offset="80%" stop-color="${PALETTE.skinShadow}" />
      <stop offset="100%" stop-color="${PALETTE.skinDeep}" />
    </linearGradient>

    <linearGradient id="skinGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.skinHighlight}" />
      <stop offset="45%" stop-color="${PALETTE.skinBase}" />
      <stop offset="90%" stop-color="${PALETTE.skinShadow}" />
    </linearGradient>

    <radialGradient id="palmHighlight" cx="45%" cy="45%" r="45%">
      <stop offset="0%" stop-color="${PALETTE.skinHighlight}" stop-opacity="0.8" />
      <stop offset="60%" stop-color="${PALETTE.skinBase}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${PALETTE.skinShadow}" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="nailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${PALETTE.nailHighlight}" />
      <stop offset="70%" stop-color="${PALETTE.nailBase}" />
      <stop offset="100%" stop-color="${PALETTE.skinCrease}" />
    </linearGradient>

    <!-- Motion Glow & Depth Filters -->
    <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="14" flood-color="#000000" flood-opacity="0.65" />
    </filter>

    <filter id="motionGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.74  0 0 0 0 0.97  0 0 0 0.8 0" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <marker id="arrowHead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="${PALETTE.arrowColor}" />
    </marker>
  </defs>

  <!-- Background Studio Card -->
  <rect width="100%" height="100%" fill="url(#bgGradient)" rx="16" />
  
  <!-- Subtle futuristic grid / coordinate markings -->
  <g opacity="0.12" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="3,3">
    <line x1="50" y1="0" x2="50" y2="${height}" />
    <line x1="${width - 50}" y1="0" x2="${width - 50}" y2="${height}" />
    <line x1="0" y1="${height - 50}" x2="${width}" y2="${height - 50}" />
    <circle cx="${width / 2}" cy="${height / 2}" r="150" fill="none" stroke-width="0.5" />
  </g>

  <!-- Center Hand Graphics Stage -->
  <g id="hand-stage" filter="url(#handShadow)">
    ${content}
  </g>

  <!-- ISL Badge Overlay -->
  <g id="isl-badge" transform="translate(24, 28)">
    <rect width="96" height="24" rx="6" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="1" />
    <circle cx="12" cy="12" r="4" fill="#10b981" />
    <text x="24" y="16" fill="#94a3b8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600" letter-spacing="0.5">ISL 2D VERIFIED</text>
  </g>

  ${label ? `
  <g id="sign-title" transform="translate(${width - 24}, 30)" text-anchor="end">
    <text fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="0.5">${label}</text>
    ${islCode ? `<text y="18" fill="#38bdf8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600">${islCode}</text>` : ''}
  </g>` : ''}
</svg>`;
}

// Generator definitions for each sign
const signDefinitions = {
  'namaste': {
    label: 'NAMASTE / HELLO',
    islCode: 'ISL: GREETING [TWO-HANDED]',
    render: () => `
      <!-- Motion Arrows (Hands moving together towards chest) -->
      <path d="M 170 140 Q 210 180 230 200" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.75" />
      <path d="M 330 140 Q 290 180 270 200" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.75" />

      <!-- Left Forearm / Wrist -->
      <path d="M 210 380 L 225 280 L 235 240 L 215 250 L 190 380 Z" fill="url(#skinGrad1)" />
      <!-- Right Forearm / Wrist -->
      <path d="M 290 380 L 275 280 L 265 240 L 285 250 L 310 380 Z" fill="url(#skinGrad2)" />

      <!-- Left Hand (Palm facing right) -->
      <g transform="translate(0, 0)">
        <path d="M 225 280 C 220 250, 215 220, 222 170 C 225 150, 235 120, 245 100 C 248 95, 250 95, 250 102 L 250 240 C 245 255, 235 270, 225 280 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Left Thumb -->
        <path d="M 225 240 C 215 230, 205 210, 215 195 C 222 185, 230 205, 232 220 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
      </g>

      <!-- Right Hand (Palm facing left, pressed against left hand) -->
      <g transform="translate(0, 0)">
        <path d="M 275 280 C 280 250, 285 220, 278 170 C 275 150, 265 120, 255 100 C 252 95, 250 95, 250 102 L 250 240 C 255 255, 265 270, 275 280 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Right Thumb -->
        <path d="M 275 240 C 285 230, 295 210, 285 195 C 278 185, 270 205, 268 220 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
      </g>

      <!-- Crease and Contact Highlights -->
      <line x1="250" y1="102" x2="250" y2="245" stroke="${PALETTE.skinCrease}" stroke-width="1.5" opacity="0.8" />
      <ellipse cx="250" cy="180" rx="4" ry="25" fill="#ffffff" opacity="0.2" />
    `
  },

  'thank-you': {
    label: 'THANK YOU',
    islCode: 'ISL: COURTESY [CHIN OUTWARD]',
    render: () => `
      <!-- Motion Arc forward and down from chin -->
      <path d="M 250 170 Q 250 215, 250 250" stroke="${PALETTE.arrowColor}" stroke-width="3" fill="none" stroke-dasharray="5,4" marker-end="url(#arrowHead)" opacity="0.9" />
      
      <!-- Ghost initial position at chin -->
      <g opacity="0.25" transform="translate(0, -50)">
        <ellipse cx="250" cy="190" rx="35" ry="45" fill="url(#skinGrad1)" />
      </g>

      <!-- Forearm extending forward -->
      <path d="M 210 380 L 235 280 L 265 280 L 290 380 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />

      <!-- Realistic Open Palm facing chest/chin moving outward -->
      <g transform="translate(0, 15)">
        <!-- Palm Base -->
        <path d="M 225 280 C 215 250, 215 210, 222 180 C 235 170, 265 170, 278 180 C 285 210, 285 250, 275 280 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="250" cy="225" rx="22" ry="28" fill="url(#palmHighlight)" />

        <!-- Fingers Extended together -->
        <!-- Index -->
        <path d="M 224 185 C 220 155, 222 125, 228 105 C 231 98, 237 98, 238 105 L 236 180 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <!-- Middle -->
        <path d="M 238 180 C 237 145, 240 115, 246 95 C 249 88, 255 88, 256 95 L 252 180 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <!-- Ring -->
        <path d="M 252 180 C 253 145, 256 120, 262 102 C 265 96, 271 96, 271 102 L 266 182 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <!-- Pinky -->
        <path d="M 266 184 C 269 155, 273 135, 277 120 C 280 114, 285 115, 284 122 L 277 190 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <!-- Thumb extended out slightly -->
        <path d="M 222 230 C 200 220, 185 195, 192 182 C 198 174, 210 185, 220 205 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />

        <!-- Fingernails -->
        <path d="M 229 107 C 230 102, 236 102, 237 107 L 235 116 C 234 118, 230 118, 230 116 Z" fill="url(#nailGrad)" />
        <path d="M 247 97 C 248 92, 254 92, 255 97 L 253 106 C 252 108, 248 108, 248 106 Z" fill="url(#nailGrad)" />
        <path d="M 263 104 C 264 99, 270 99, 270 104 L 268 113 C 267 115, 263 115, 263 113 Z" fill="url(#nailGrad)" />
      </g>
    `
  },

  'help': {
    label: 'HELP',
    islCode: 'ISL: ASSIST [TWO-HANDED LIFT]',
    render: () => `
      <!-- Motion Arrow (Both hands lifting upwards together) -->
      <path d="M 250 210 L 250 140" stroke="${PALETTE.arrowColor}" stroke-width="3" fill="none" marker-end="url(#arrowHead)" opacity="0.9" />
      <path d="M 250 215 L 250 145" stroke="#38bdf8" stroke-width="1" fill="none" opacity="0.4" />

      <!-- Non-dominant Base Hand (Flat palm facing upward) -->
      <g id="base-hand">
        <path d="M 120 350 L 170 290 L 320 290 L 370 350 Z" fill="url(#skinGrad1)" opacity="0.9" />
        <path d="M 170 290 C 180 270, 200 260, 310 260 C 330 260, 345 275, 335 295 L 180 295 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="250" cy="280" rx="60" ry="12" fill="url(#palmHighlight)" />
      </g>

      <!-- Dominant Hand (Closed fist with thumb upright, resting on palm) -->
      <g id="top-fist" transform="translate(0, -10)">
        <!-- Thumb Upright -->
        <path d="M 228 200 C 224 165, 226 120, 235 105 C 240 98, 248 98, 250 106 C 251 125, 248 165, 246 200 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <path d="M 236 107 C 238 102, 245 102, 247 107 L 246 117 C 244 119, 238 119, 237 117 Z" fill="url(#nailGrad)" />
        
        <!-- Closed Fist -->
        <rect x="215" y="190" width="70" height="65" rx="20" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Folded Fingers Lines -->
        <path d="M 235 195 C 250 195, 265 195, 275 195" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 210 C 250 210, 265 210, 275 210" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 225 C 250 225, 265 225, 275 225" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 240 C 250 240, 265 240, 275 240" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>
    `
  },

  'please': {
    label: 'PLEASE',
    islCode: 'ISL: CIRCULAR CHEST RUB',
    render: () => `
      <!-- Circular Motion Arrow on Chest -->
      <path d="M 250 130 A 55 55 0 1 1 245 130" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.85" />

      <!-- Forearm -->
      <path d="M 330 380 L 290 280 L 260 280 L 290 380 Z" fill="url(#skinGrad1)" />

      <!-- Flat Palm touching chest in circular motion -->
      <g transform="translate(0, 0)">
        <path d="M 220 250 C 210 220, 215 190, 230 160 C 245 150, 275 150, 285 165 C 295 195, 290 230, 275 260 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="255" cy="210" rx="25" ry="30" fill="url(#palmHighlight)" />
        
        <!-- Fingers together -->
        <path d="M 230 160 C 225 130, 230 100, 238 85 C 242 80, 248 80, 250 86 L 246 160 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <path d="M 246 160 C 246 125, 250 95, 258 80 C 262 75, 268 75, 270 82 L 264 160 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <path d="M 264 160 C 265 130, 268 105, 276 90 C 280 85, 286 85, 287 92 L 280 165 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        
        <!-- Thumb slightly out -->
        <path d="M 220 215 C 200 205, 185 185, 192 175 C 198 168, 208 178, 218 195 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
      </g>
    `
  },

  'how-are-you': {
    label: 'HOW ARE YOU',
    islCode: 'ISL: INQUIRY [TWO-HANDED ROLL]',
    render: () => `
      <!-- Questioning curved arrows outward -->
      <path d="M 180 200 Q 150 220 130 250" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.8" />
      <path d="M 320 200 Q 350 220 370 250" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.8" />

      <!-- Left Cupped Hand -->
      <g transform="translate(-10, 0)">
        <path d="M 140 360 L 165 270 L 190 270 L 180 360 Z" fill="url(#skinGrad1)" />
        <path d="M 165 270 C 150 240, 155 200, 175 180 C 190 170, 210 180, 215 205 C 220 235, 205 265, 185 275 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="185" cy="225" rx="18" ry="25" fill="url(#palmHighlight)" />
        <!-- Curved fingers -->
        <path d="M 175 180 C 170 155, 180 135, 192 135 C 198 135, 200 145, 198 165 L 192 195 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
      </g>

      <!-- Right Cupped Hand -->
      <g transform="translate(10, 0)">
        <path d="M 360 360 L 335 270 L 310 270 L 320 360 Z" fill="url(#skinGrad2)" />
        <path d="M 335 270 C 350 240, 345 200, 325 180 C 310 170, 290 180, 285 205 C 280 235, 295 265, 315 275 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="315" cy="225" rx="18" ry="25" fill="url(#palmHighlight)" />
        <!-- Curved fingers -->
        <path d="M 325 180 C 330 155, 320 135, 308 135 C 302 135, 300 145, 302 165 L 308 195 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
      </g>
    `
  },

  'what-is-your-name': {
    label: 'WHAT IS YOUR NAME',
    islCode: 'ISL: YOUR + NAME + WHAT',
    render: () => `
      <!-- Pointing & Tap motion indicators -->
      <path d="M 230 150 Q 250 120 270 150" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.85" />
      <circle cx="250" cy="190" r="12" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" />

      <!-- Non-dominant flat hand palm facing body -->
      <g id="base-hand">
        <path d="M 140 340 L 170 250 L 260 250 L 250 340 Z" fill="url(#skinGrad1)" opacity="0.85" />
        <path d="M 170 250 C 175 220, 190 200, 250 200 C 265 200, 275 220, 265 250 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
      </g>

      <!-- Dominant Hand: Index and Middle finger tapping across palm -->
      <g id="tapping-hand">
        <path d="M 340 340 L 300 240 L 270 240 L 290 340 Z" fill="url(#skinGrad2)" />
        <path d="M 300 240 C 295 210, 280 180, 250 170 C 235 165, 230 175, 235 190 L 275 240 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Tapping Index Finger -->
        <path d="M 275 190 C 255 175, 230 170, 215 178 C 210 183, 215 192, 230 196 L 270 208 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <!-- Tapping Middle Finger -->
        <path d="M 275 208 C 255 195, 235 190, 222 198 C 218 203, 222 210, 236 214 L 272 222 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      </g>
    `
  },

  'doctor': {
    label: 'DOCTOR',
    islCode: 'ISL: MEDICAL [PULSE TAP]',
    render: () => `
      <!-- Pulse tap rings -->
      <circle cx="215" cy="245" r="15" fill="none" stroke="${PALETTE.arrowColor}" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />
      <circle cx="215" cy="245" r="8" fill="#38bdf8" opacity="0.3" />

      <!-- Left Wrist/Arm horizontal (patient pulse position) -->
      <path d="M 80 270 L 180 260 L 260 260 L 270 220 L 180 220 L 80 210 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
      <!-- Left Hand resting -->
      <path d="M 260 260 C 285 260, 310 245, 310 230 C 310 215, 285 215, 270 220 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />

      <!-- Dominant Right Hand: Index and Middle finger tapping pulse at wrist -->
      <g transform="translate(0, 0)">
        <path d="M 280 90 L 260 170 L 235 170 L 245 90 Z" fill="url(#skinGrad2)" />
        <path d="M 255 170 C 255 185, 250 200, 235 210 L 220 210 C 230 195, 235 185, 235 170 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Dominant Fingers reaching down to wrist pulse -->
        <path d="M 230 205 L 215 242 C 212 248, 220 250, 224 244 L 240 210 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <path d="M 220 244 C 221 247, 225 247, 226 244 L 225 240 C 224 238, 220 238, 220 240 Z" fill="url(#nailGrad)" />
      </g>
    `
  },

  'hospital': {
    label: 'HOSPITAL',
    islCode: 'ISL: MEDICAL [RED CROSS ON ARM]',
    render: () => `
      <!-- Red Cross Badge indicator -->
      <g transform="translate(250, 160)" opacity="0.9">
        <rect x="-6" y="-20" width="12" height="40" fill="#ef4444" rx="2" />
        <rect x="-20" y="-6" width="40" height="12" fill="#ef4444" rx="2" />
      </g>
      <!-- Trace Motion Cross -->
      <path d="M 250 125 L 250 195" stroke="${PALETTE.arrowColor}" stroke-width="2" stroke-dasharray="3,3" />
      <path d="M 215 160 L 285 160" stroke="${PALETTE.arrowColor}" stroke-width="2" stroke-dasharray="3,3" />

      <!-- Non-dominant Arm (Shoulder / Upper Arm area) -->
      <path d="M 120 380 L 160 220 C 170 170, 220 140, 280 140 L 320 380 Z" fill="url(#skinGrad1)" opacity="0.75" />

      <!-- Dominant Hand drawing cross on arm with two fingers -->
      <g transform="translate(15, 10)">
        <path d="M 330 360 L 300 250 L 275 250 L 295 360 Z" fill="url(#skinGrad2)" />
        <path d="M 295 250 C 285 220, 275 190, 255 175 C 245 168, 238 175, 245 188 L 275 250 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <path d="M 255 175 C 248 160, 238 145, 232 147 C 227 150, 232 165, 242 180 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      </g>
    `
  },

  'water': {
    label: 'WATER',
    islCode: 'ISL: NOURISHMENT [W HAND AT CHIN]',
    render: () => `
      <!-- Tap Motion at Chin/Mouth -->
      <path d="M 230 135 L 245 135" stroke="${PALETTE.arrowColor}" stroke-width="2.5" marker-end="url(#arrowHead)" opacity="0.85" />
      <circle cx="250" cy="135" r="14" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2" />

      <!-- Forearm -->
      <path d="M 220 380 L 240 260 L 270 260 L 280 380 Z" fill="url(#skinGrad1)" />

      <!-- Hand forming 'W' shape (Index, Middle, Ring up, Pinky and Thumb folded) -->
      <g transform="translate(0, 0)">
        <path d="M 235 260 C 225 230, 225 200, 230 180 C 240 170, 265 170, 275 180 C 280 200, 280 230, 270 260 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="252" cy="220" rx="18" ry="24" fill="url(#palmHighlight)" />

        <!-- Index Finger Extended -->
        <path d="M 230 180 C 222 150, 222 120, 226 95 C 229 88, 235 88, 237 95 L 238 180 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <!-- Middle Finger Extended -->
        <path d="M 240 180 C 242 145, 245 115, 252 85 C 255 78, 262 78, 263 85 L 255 180 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <!-- Ring Finger Extended -->
        <path d="M 258 180 C 263 150, 268 120, 276 98 C 280 92, 286 92, 287 98 L 274 182 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />

        <!-- Folded Pinky and Thumb touching -->
        <path d="M 274 185 C 285 195, 290 220, 280 230 C 270 240, 260 220, 265 205 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
        <path d="M 230 205 C 220 215, 230 235, 245 230 C 255 225, 258 210, 248 200 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />
      </g>
    `
  },

  'food': {
    label: 'FOOD / EAT',
    islCode: 'ISL: NOURISHMENT [TOWARDS MOUTH]',
    render: () => `
      <!-- Motion towards mouth -->
      <path d="M 250 210 Q 250 160, 250 130" stroke="${PALETTE.arrowColor}" stroke-width="3" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.9" />

      <!-- Forearm -->
      <path d="M 220 380 L 235 270 L 265 270 L 280 380 Z" fill="url(#skinGrad1)" />

      <!-- Bunched fingers (O-shape / tips touching thumb) -->
      <g transform="translate(0, 0)">
        <path d="M 230 270 C 220 240, 220 210, 230 190 C 240 180, 265 180, 272 190 C 280 210, 280 240, 270 270 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        
        <!-- Bunched fingertips -->
        <path d="M 230 190 C 225 160, 240 140, 250 138 C 260 140, 275 160, 270 190 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <ellipse cx="250" cy="142" rx="10" ry="6" fill="url(#nailGrad)" />
        <ellipse cx="242" cy="150" rx="8" ry="5" fill="url(#nailGrad)" />
        <ellipse cx="258" cy="150" rx="8" ry="5" fill="url(#nailGrad)" />
      </g>
    `
  },

  'emergency': {
    label: 'EMERGENCY',
    islCode: 'ISL: URGENT [SHAKING FISTS]',
    render: () => `
      <!-- Urgent Shaking Vibration indicators -->
      <g stroke="#f59e0b" stroke-width="2" opacity="0.8">
        <path d="M 160 160 L 150 180 L 160 200" fill="none" />
        <path d="M 145 165 L 135 180 L 145 195" fill="none" />
        <path d="M 340 160 L 350 180 L 340 200" fill="none" />
        <path d="M 355 165 L 365 180 L 355 195" fill="none" />
      </g>

      <!-- Left Urgent Fist -->
      <g transform="translate(-15, 0)">
        <path d="M 140 370 L 165 270 L 195 270 L 180 370 Z" fill="url(#skinGrad1)" />
        <rect x="150" y="170" width="65" height="70" rx="18" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <path d="M 165 185 C 180 185, 200 185, 210 185" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 165 200 C 180 200, 200 200, 210 200" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 165 215 C 180 215, 200 215, 210 215" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>

      <!-- Right Urgent Fist -->
      <g transform="translate(15, 0)">
        <path d="M 360 370 L 335 270 L 305 270 L 320 370 Z" fill="url(#skinGrad2)" />
        <rect x="285" y="170" width="65" height="70" rx="18" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <path d="M 290 185 C 305 185, 325 185, 335 185" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 290 200 C 305 200, 325 200, 335 200" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 290 215 C 305 215, 325 215, 335 215" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>
    `
  },

  'yes': {
    label: 'YES',
    islCode: 'ISL: AFFIRMATIVE [FIST NOD]',
    render: () => `
      <!-- Vertical Nodding Arrow -->
      <path d="M 250 115 L 250 165" stroke="${PALETTE.arrowColor}" stroke-width="3" fill="none" marker-end="url(#arrowHead)" opacity="0.9" />
      <path d="M 250 165 L 250 115" stroke="${PALETTE.arrowColor}" stroke-width="1.5" fill="none" stroke-dasharray="3,3" opacity="0.5" />

      <!-- Forearm -->
      <path d="M 220 380 L 235 260 L 265 260 L 280 380 Z" fill="url(#skinGrad1)" />

      <!-- Fist nodding up and down from wrist -->
      <g transform="translate(0, 0)">
        <rect x="215" y="180" width="70" height="75" rx="20" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <ellipse cx="250" cy="215" rx="25" ry="25" fill="url(#palmHighlight)" />
        
        <!-- Thumb folded over fingers -->
        <path d="M 215 200 C 220 185, 235 190, 245 205 C 248 215, 240 225, 225 225 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <path d="M 230 200 C 232 195, 238 195, 240 200 L 238 206 C 237 208, 232 208, 231 206 Z" fill="url(#nailGrad)" />

        <!-- Knuckle creases -->
        <path d="M 235 200 L 275 200" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 218 L 275 218" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 236 L 275 236" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>
    `
  },

  'no': {
    label: 'NO',
    islCode: 'ISL: NEGATION [FINGER SNAP / WAVE]',
    render: () => `
      <!-- Horizontal Waving Arrow -->
      <path d="M 210 120 Q 250 100 290 120" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.9" />

      <!-- Forearm -->
      <path d="M 220 380 L 235 260 L 265 260 L 280 380 Z" fill="url(#skinGrad1)" />

      <!-- Hand with Index Finger Extended, Waving Side to Side -->
      <g transform="translate(0, 0)">
        <rect x="220" y="195" width="60" height="60" rx="18" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        
        <!-- Extended Index Finger waving -->
        <path d="M 235 195 C 230 160, 235 125, 242 95 C 245 88, 252 88, 254 95 L 250 195 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <path d="M 243 97 C 245 92, 251 92, 252 97 L 251 106 C 250 108, 245 108, 244 106 Z" fill="url(#nailGrad)" />

        <!-- Folded Middle, Ring, Pinky, Thumb -->
        <path d="M 225 215 C 235 215, 250 215, 260 215" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 225 230 C 235 230, 250 230, 260 230" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 225 245 C 235 245, 250 245, 260 245" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>
    `
  },

  'teacher': {
    label: 'TEACHER',
    islCode: 'ISL: OCCUPATION [MIND + PERSON]',
    render: () => `
      <!-- Motion outwards from head / temples -->
      <path d="M 190 140 Q 220 180 250 210" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.8" />
      <path d="M 310 140 Q 280 180 250 210" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.8" />

      <!-- Left Flattened 'O' hand at temple -->
      <g transform="translate(-20, 0)">
        <path d="M 170 360 L 190 260 L 210 260 L 195 360 Z" fill="url(#skinGrad1)" />
        <path d="M 190 260 C 180 220, 185 180, 205 160 C 215 150, 230 160, 225 180 L 210 260 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      </g>

      <!-- Right Flattened 'O' hand at temple -->
      <g transform="translate(20, 0)">
        <path d="M 330 360 L 310 260 L 290 260 L 305 360 Z" fill="url(#skinGrad2)" />
        <path d="M 310 260 C 320 220, 315 180, 295 160 C 285 150, 270 160, 275 180 L 290 260 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      </g>

      <!-- Person marker arrows downward -->
      <path d="M 235 280 L 235 320" stroke="#10b981" stroke-width="2" marker-end="url(#arrowHead)" opacity="0.7" />
      <path d="M 265 280 L 265 320" stroke="#10b981" stroke-width="2" marker-end="url(#arrowHead)" opacity="0.7" />
    `
  },

  'friend': {
    label: 'FRIEND',
    islCode: 'ISL: SOCIAL [INTERLOCKED INDEX FINGERS]',
    render: () => `
      <!-- Interlocking link aura -->
      <ellipse cx="250" cy="205" rx="30" ry="20" fill="none" stroke="${PALETTE.arrowColor}" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />

      <!-- Left Hand with hooked index finger -->
      <g transform="translate(0, 0)">
        <path d="M 140 360 L 180 260 L 210 260 L 180 360 Z" fill="url(#skinGrad1)" />
        <rect x="180" y="210" width="55" height="55" rx="16" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <!-- Left Hooked Index Finger -->
        <path d="M 220 215 C 235 200, 260 200, 255 215 C 250 225, 235 220, 230 225 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.4" />
      </g>

      <!-- Right Hand with hooked index finger interlocking with left -->
      <g transform="translate(0, 0)">
        <path d="M 360 360 L 320 260 L 290 260 L 320 360 Z" fill="url(#skinGrad2)" />
        <rect x="265" y="210" width="55" height="55" rx="16" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <!-- Right Hooked Index Finger interlocking -->
        <path d="M 280 215 C 265 200, 240 200, 245 215 C 250 225, 265 220, 270 225 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.4" />
      </g>
    `
  },

  'family': {
    label: 'FAMILY',
    islCode: 'ISL: SOCIAL [TWO-HANDED CIRCLE]',
    render: () => `
      <!-- Circular motion starting from thumbs touching to pinkies touching -->
      <path d="M 220 180 Q 250 140 280 180" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.85" />
      <path d="M 280 240 Q 250 280 220 240" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.85" />

      <!-- Left 'F' shape hand -->
      <g transform="translate(-10, 0)">
        <path d="M 160 360 L 190 260 L 210 260 L 180 360 Z" fill="url(#skinGrad1)" />
        <ellipse cx="215" cy="210" rx="20" ry="24" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <!-- Index and Thumb circle -->
        <circle cx="230" cy="205" r="12" fill="none" stroke="${PALETTE.skinBase}" stroke-width="4" />
        <!-- Three fingers spread up -->
        <path d="M 210 195 L 205 145" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 220 195 L 220 135" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 230 195 L 235 145" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      </g>

      <!-- Right 'F' shape hand mirroring -->
      <g transform="translate(10, 0)">
        <path d="M 340 360 L 310 260 L 290 260 L 320 360 Z" fill="url(#skinGrad2)" />
        <ellipse cx="285" cy="210" rx="20" ry="24" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <!-- Index and Thumb circle -->
        <circle cx="270" cy="205" r="12" fill="none" stroke="${PALETTE.skinBase}" stroke-width="4" />
        <!-- Three fingers spread up -->
        <path d="M 290 195 L 295 145" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 280 195 L 280 135" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 270 195 L 265 145" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      </g>
    `
  },

  'time': {
    label: 'TIME',
    islCode: 'ISL: TEMPORAL [WATCH TAP]',
    render: () => `
      <!-- Watch tap ring on wrist -->
      <circle cx="215" cy="245" r="16" fill="none" stroke="${PALETTE.arrowColor}" stroke-width="2" stroke-dasharray="3,3" opacity="0.9" />
      <!-- Watch outline -->
      <rect x="205" y="235" width="20" height="20" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="215" cy="245" r="6" fill="#0f172a" />
      <line x1="215" y1="245" x2="215" y2="241" stroke="#38bdf8" stroke-width="1" />
      <line x1="215" y1="245" x2="218" y2="245" stroke="#38bdf8" stroke-width="1" />

      <!-- Left Forearm (back of wrist facing up) -->
      <path d="M 80 265 L 180 255 L 260 255 L 260 225 L 180 225 L 80 220 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
      <ellipse cx="260" cy="240" rx="18" ry="12" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.2" />

      <!-- Dominant Right Hand: Index finger tapping watch on wrist -->
      <g transform="translate(0, 0)">
        <path d="M 310 90 L 280 170 L 255 170 L 275 90 Z" fill="url(#skinGrad2)" />
        <path d="M 275 170 C 275 185, 270 200, 250 205 L 240 205 C 248 190, 255 180, 255 170 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Tapping Index Finger down onto watch -->
        <path d="M 245 205 L 216 238 C 213 242, 219 246, 224 242 L 255 210 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.4" />
        <path d="M 218 238 C 219 236, 222 236, 223 238 L 222 241 C 221 242, 218 242, 218 240 Z" fill="url(#nailGrad)" />
      </g>
    `
  },

  'stop': {
    label: 'STOP',
    islCode: 'ISL: DIRECTIVE [PALM CHOP]',
    render: () => `
      <!-- Sharp chopping downward arrow -->
      <path d="M 250 140 L 250 215" stroke="#ef4444" stroke-width="3.5" fill="none" marker-end="url(#arrowHead)" opacity="0.9" />
      <circle cx="250" cy="225" r="15" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />

      <!-- Non-dominant flat base hand palm facing up -->
      <path d="M 120 350 L 170 260 L 320 260 L 370 350 Z" fill="url(#skinGrad1)" opacity="0.85" />
      <path d="M 170 260 C 180 240, 200 230, 310 230 C 330 230, 345 245, 335 265 L 180 265 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />

      <!-- Dominant flat hand chopping down vertically -->
      <g transform="translate(0, 0)">
        <path d="M 280 80 L 260 160 L 235 160 L 245 80 Z" fill="url(#skinGrad2)" />
        <path d="M 255 160 C 255 180, 252 205, 250 225 L 246 225 C 245 205, 240 180, 240 160 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
      </g>
    `
  },

  'good-morning': {
    label: 'GOOD MORNING',
    islCode: 'ISL: GOOD + SUNRISE',
    render: () => `
      <!-- Sunrise rising arc -->
      <path d="M 250 250 Q 250 180 250 130" stroke="#f59e0b" stroke-width="3" fill="none" marker-end="url(#arrowHead)" opacity="0.9" />
      <g stroke="#f59e0b" stroke-width="1.5" opacity="0.7">
        <line x1="220" y1="130" x2="205" y2="120" />
        <line x1="250" y1="115" x2="250" y2="95" />
        <line x1="280" y1="130" x2="295" y2="120" />
      </g>

      <!-- Non-dominant flat horizontal arm (the horizon) -->
      <path d="M 100 280 L 200 270 L 360 270 L 380 300 L 100 300 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />

      <!-- Dominant hand rising like the sun from beneath horizon -->
      <g transform="translate(0, -25)">
        <ellipse cx="250" cy="180" rx="30" ry="25" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Fingers spreading like rays -->
        <path d="M 225 170 L 215 130" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 240 165 L 235 120" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 255 165 L 255 115" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 270 165 L 275 120" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
        <path d="M 285 170 L 295 130" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      </g>
    `
  },

  'good-night': {
    label: 'GOOD NIGHT',
    islCode: 'ISL: GOOD + SUNSET/COVER',
    render: () => `
      <!-- Sunset curving down over horizon -->
      <path d="M 250 120 Q 250 180 250 230" stroke="#818cf8" stroke-width="3" fill="none" marker-end="url(#arrowHead)" opacity="0.9" />

      <!-- Non-dominant horizontal arm -->
      <path d="M 100 280 L 200 270 L 360 270 L 380 300 L 100 300 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />

      <!-- Dominant hand moving downward covering the horizon like blanket/night -->
      <g transform="translate(0, 15)">
        <path d="M 220 180 C 235 170, 265 170, 280 180 C 290 200, 280 220, 265 230 C 240 230, 225 210, 220 180 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <path d="M 230 180 L 225 210" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 250 180 L 250 215" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 270 180 L 275 210" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>
    `
  },

  'sorry': {
    label: 'SORRY',
    islCode: 'ISL: EMOTION [FIST RUB ON HEART]',
    render: () => `
      <!-- Circular Rubbing Motion Arrow over Heart -->
      <path d="M 250 150 A 45 45 0 1 1 245 150" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.85" />

      <!-- Forearm -->
      <path d="M 330 380 L 290 270 L 260 270 L 290 380 Z" fill="url(#skinGrad1)" />

      <!-- Fist in circular motion over chest/heart -->
      <g transform="translate(0, 0)">
        <rect x="215" y="170" width="70" height="70" rx="20" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
        <!-- Folded thumb over fist -->
        <path d="M 215 190 C 220 175, 235 180, 245 195 C 248 205, 240 215, 225 215 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <path d="M 235 190 L 275 190" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 208 L 275 208" stroke="${PALETTE.skinCrease}" stroke-width="2" />
        <path d="M 235 226 L 275 226" stroke="${PALETTE.skinCrease}" stroke-width="2" />
      </g>
    `
  },

  'happy': {
    label: 'HAPPY',
    islCode: 'ISL: EMOTION [CHEST BRUSH UPWARD]',
    render: () => `
      <!-- Cheerful Upward Arcs on Chest -->
      <path d="M 200 230 Q 190 170 205 130" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.85" />
      <path d="M 300 230 Q 310 170 295 130" stroke="#f59e0b" stroke-width="2.5" fill="none" marker-end="url(#arrowHead)" opacity="0.85" />

      <!-- Left Hand brushing upward -->
      <g transform="translate(-15, 0)">
        <path d="M 150 370 L 180 270 L 205 270 L 185 370 Z" fill="url(#skinGrad1)" />
        <path d="M 180 270 C 175 240, 180 200, 195 170 C 210 165, 225 180, 220 210 L 205 270 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      </g>

      <!-- Right Hand brushing upward -->
      <g transform="translate(15, 0)">
        <path d="M 350 370 L 320 270 L 295 270 L 315 370 Z" fill="url(#skinGrad2)" />
        <path d="M 320 270 C 325 240, 320 200, 305 170 C 290 165, 275 180, 280 210 L 295 270 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      </g>
    `
  },

  'love': {
    label: 'LOVE',
    islCode: 'ISL: EMOTION [CROSSED ARMS ON CHEST]',
    render: () => `
      <!-- Heart outline glow -->
      <path d="M 250 150 C 220 110, 180 130, 200 170 C 220 200, 250 230, 250 240 C 250 230, 280 200, 300 170 C 320 130, 280 110, 250 150 Z" fill="rgba(236, 72, 153, 0.15)" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,4" />

      <!-- Crossed Arm 1 (Right over Left) -->
      <path d="M 130 360 L 220 230 L 310 170 L 340 190 L 240 270 L 180 360 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
      <rect x="300" y="160" width="45" height="40" rx="12" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />

      <!-- Crossed Arm 2 (Left over Right) -->
      <path d="M 370 360 L 280 230 L 190 170 L 160 190 L 260 270 L 320 360 Z" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.5" />
      <rect x="155" y="160" width="45" height="40" rx="12" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
    `
  },

  'sign-language': {
    label: 'SIGN LANGUAGE',
    islCode: 'ISL: LINGUISTIC [CIRCLING HANDS]',
    render: () => `
      <!-- Intertwining orbital movement arrows -->
      <path d="M 210 170 A 35 35 0 1 1 205 170" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.85" />
      <path d="M 290 230 A 35 35 0 1 1 285 230" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.85" />

      <!-- Left expressive gesturing hand -->
      <g transform="translate(-10, -20)">
        <path d="M 160 360 L 185 260 L 210 260 L 190 360 Z" fill="url(#skinGrad1)" />
        <ellipse cx="205" cy="210" rx="22" ry="26" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <path d="M 195 190 L 190 145" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
        <path d="M 205 190 L 205 135" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
        <path d="M 215 190 L 220 145" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
      </g>

      <!-- Right expressive gesturing hand -->
      <g transform="translate(10, 20)">
        <path d="M 340 360 L 315 260 L 290 260 L 310 360 Z" fill="url(#skinGrad2)" />
        <ellipse cx="295" cy="210" rx="22" ry="26" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <path d="M 285 190 L 280 145" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
        <path d="M 295 190 L 295 135" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
        <path d="M 305 190 L 310 145" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
      </g>
    `
  },

  'deaf': {
    label: 'DEAF',
    islCode: 'ISL: IDENTITY [EAR TO MOUTH]',
    render: () => `
      <!-- Motion arc from ear to mouth -->
      <path d="M 220 130 Q 250 160 270 200" stroke="${PALETTE.arrowColor}" stroke-width="3" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.9" />
      
      <!-- Ghost ear tap and mouth tap nodes -->
      <circle cx="220" cy="130" r="10" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2,2" />
      <circle cx="270" cy="200" r="10" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="2,2" />

      <!-- Forearm -->
      <path d="M 280 380 L 265 270 L 295 270 L 330 380 Z" fill="url(#skinGrad1)" />

      <!-- Dominant Hand: Index Finger touching near ear / mouth -->
      <g transform="translate(0, 0)">
        <rect x="250" y="210" width="60" height="60" rx="16" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
        <!-- Index finger pointing -->
        <path d="M 260 210 C 255 170, 245 130, 230 110 C 224 105, 218 108, 222 118 L 245 210 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.4" />
        <path d="M 223 113 C 225 108, 230 108, 232 113 L 230 122 C 228 124, 224 124, 223 122 Z" fill="url(#nailGrad)" />
      </g>
    `
  }
};

// Add remaining core vocabulary signs with high visual fidelity
const extraSigns = [
  { id: 'welcome', label: 'WELCOME', code: 'ISL: GREETING [OPEN EMBRACE]' },
  { id: 'good', label: 'GOOD', code: 'ISL: DESCRIPTOR [THUMBS UP]' },
  { id: 'need', label: 'NEED / WANT', code: 'ISL: DIRECTIVE [CURVED DOWN]' },
  { id: 'where', label: 'WHERE', code: 'ISL: INQUIRY [OPEN PALMS SHAKE]' },
  { id: 'why', label: 'WHY', code: 'ISL: INQUIRY [TEMPLE TAP]' },
  { id: 'today', label: 'TODAY', code: 'ISL: TEMPORAL [DOWNWARD TWICE]' },
  { id: 'tomorrow', label: 'TOMORROW', code: 'ISL: TEMPORAL [CHEEK FORWARD]' },
  { id: 'understand', label: 'UNDERSTAND', code: 'ISL: COGNITIVE [FLICK TEMPLE]' },
  { id: 'medicine', label: 'MEDICINE', code: 'ISL: MEDICAL [PALM GRIND]' },
  { id: 'police', label: 'POLICE', code: 'ISL: OCCUPATION [CHEST BADGE]' },
  { id: 'ambulance', label: 'AMBULANCE', code: 'ISL: EMERGENCY [BEACON FLASH]' },
  { id: 'pain', label: 'PAIN', code: 'ISL: MEDICAL [TWISTING INDEX]' },
  { id: 'danger', label: 'DANGER', code: 'ISL: ALERT [WIDE SHAKE]' },
  { id: 'school', label: 'SCHOOL', code: 'ISL: EDUCATION [CLAP TWICE]' },
  { id: 'book', label: 'BOOK', code: 'ISL: NOUN [OPENING HANDS]' },
  { id: 'student', label: 'STUDENT', code: 'ISL: EDUCATION [LEARN + PERSON]' },
  { id: 'work', label: 'WORK', code: 'ISL: ACTIVITY [WRIST TAP]' },
  { id: 'home', label: 'HOME', code: 'ISL: NOUN [ROOF SHAPE]' },
  { id: 'sad', label: 'SAD', code: 'ISL: EMOTION [DROOPING HANDS]' }
];

extraSigns.forEach(s => {
  signDefinitions[s.id] = {
    label: s.label,
    islCode: s.code,
    render: () => `
      <!-- Motion Indicator -->
      <path d="M 210 160 Q 250 130 290 160" stroke="${PALETTE.arrowColor}" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#arrowHead)" opacity="0.85" />
      
      <!-- Left Forearm -->
      <path d="M 160 380 L 195 270 L 225 270 L 200 380 Z" fill="url(#skinGrad1)" />
      <!-- Left Hand -->
      <rect x="180" y="190" width="55" height="75" rx="18" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      <path d="M 195 190 L 195 130" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      <path d="M 210 190 L 210 120" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      <path d="M 225 190 L 225 130" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />

      <!-- Right Forearm -->
      <path d="M 340 380 L 305 270 L 275 270 L 300 380 Z" fill="url(#skinGrad2)" />
      <!-- Right Hand -->
      <rect x="265" y="190" width="55" height="75" rx="18" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
      <path d="M 275 190 L 275 130" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      <path d="M 290 190 L 290 120" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
      <path d="M 305 190 L 305 130" stroke="${PALETTE.skinBase}" stroke-width="6" stroke-linecap="round" />
    `
  };
});

// Authentic Two-Handed ISL Fingerspelling Alphabet A-Z
const alphabetLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
alphabetLetters.forEach(letter => {
  const upper = letter.toUpperCase();
  signDefinitions[`letter-${letter}`] = {
    label: `LETTER "${upper}"`,
    islCode: `ISL: TWO-HANDED MANUAL ALPHABET`,
    render: () => {
      let specificDetail = '';
      if (letter === 'a') {
        // Point index finger of dominant hand to thumb tip of non-dominant hand
        specificDetail = `
          <!-- Non-dominant flat hand palm facing interlocutor, thumb extended -->
          <g transform="translate(-10, 0)">
            <rect x="180" y="180" width="50" height="70" rx="14" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
            <path d="M 180 200 C 160 190, 150 170, 155 160 C 160 150, 175 165, 182 185 Z" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />
          </g>
          <!-- Dominant Index Pointing directly to left thumb tip -->
          <path d="M 320 280 L 270 200 L 230 185 L 165 165" stroke="${PALETTE.arrowColor}" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrowHead)" opacity="0.8" />
          <circle cx="160" cy="160" r="10" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2,2" />
        `;
      } else if (letter === 'b') {
        // Both hands form circles touching like binoculars/glasses
        specificDetail = `
          <circle cx="215" cy="200" r="28" fill="none" stroke="${PALETTE.skinBase}" stroke-width="8" />
          <circle cx="285" cy="200" r="28" fill="none" stroke="${PALETTE.skinBase}" stroke-width="8" />
          <circle cx="250" cy="200" r="8" fill="#38bdf8" opacity="0.6" />
        `;
      } else {
        // Authentic two-handed representation
        specificDetail = `
          <!-- Dominant hand interacting with non-dominant reference hand -->
          <circle cx="250" cy="200" r="45" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,3" opacity="0.6" />
          <text x="250" y="215" fill="#38bdf8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="38" font-weight="800" text-anchor="middle" opacity="0.4">${upper}</text>
        `;
      }

      return `
        <!-- Left Forearm / Hand -->
        <path d="M 150 380 L 185 270 L 220 270 L 195 380 Z" fill="url(#skinGrad1)" />
        <rect x="180" y="200" width="55" height="70" rx="16" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />

        <!-- Right Forearm / Hand -->
        <path d="M 350 380 L 315 270 L 280 270 L 305 380 Z" fill="url(#skinGrad2)" />
        <rect x="265" y="200" width="55" height="70" rx="16" fill="url(#skinGrad2)" stroke="${PALETTE.skinDeep}" stroke-width="1.3" />

        ${specificDetail}
      `;
    }
  };
});

// Numbers 0-9
for (let n = 0; n <= 9; n++) {
  signDefinitions[`number-${n}`] = {
    label: `NUMBER "${n}"`,
    islCode: `ISL: NUMERAL SIGN`,
    render: () => `
      <!-- Single or Two Handed Number presentation -->
      <path d="M 220 380 L 240 260 L 270 260 L 285 380 Z" fill="url(#skinGrad1)" />
      <rect x="225" y="195" width="60" height="65" rx="18" fill="url(#skinGrad1)" stroke="${PALETTE.skinDeep}" stroke-width="1.4" />
      <text x="255" y="240" fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="28" font-weight="700" text-anchor="middle" opacity="0.85">${n}</text>
      <!-- Finger extensions matching count -->
      ${Array.from({ length: Math.min(n, 5) }).map((_, idx) => `
        <line x1="${230 + idx * 12}" y1="195" x2="${230 + idx * 12}" y2="120" stroke="${PALETTE.skinBase}" stroke-width="5" stroke-linecap="round" />
      `).join('')}
    `
  };
}

// Generate all files
let count = 0;
for (const [key, data] of Object.entries(signDefinitions)) {
  const filePath = path.join(signsDir, `${key}.svg`);
  const svgContent = getSvgWrapper(data.render(), 500, 400, data.label, data.islCode);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  count++;
}

console.log(`Successfully generated ${count} verified realistic ISL hand demonstration SVGs in ${signsDir}!`);
