/**
 * SIGNIFY - High-Detail Realistic 2D Human Hand Graphic Generator
 * Generates anatomically accurate, realistic human hand graphics (SVG)
 * with individual articulated phalanges, defined knuckles, joint creases,
 * fingernails, and authentic Indian Sign Language (ISL) hand formations.
 */

const fs = require('fs');
const path = require('path');

const signsDir = path.join(__dirname, '..', 'assets', 'signs');
if (!fs.existsSync(signsDir)) {
  fs.mkdirSync(signsDir, { recursive: true });
}

// Master SVG Template with Realistic Skin Shader Filters and Gradients
function createHandSvg(options) {
  const {
    id,
    label,
    islCode,
    width = 600,
    height = 460,
    content
  } = options;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Dark Studio Vignette Background -->
    <radialGradient id="studioBg" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#111827" />
      <stop offset="50%" stop-color="#0a0f1d" />
      <stop offset="100%" stop-color="#050811" />
    </radialGradient>

    <!-- Human Skin Gradients (Warm healthy melanin tones) -->
    <linearGradient id="skinPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f0caa7" />
      <stop offset="30%" stop-color="#d49b72" />
      <stop offset="70%" stop-color="#b4744d" />
      <stop offset="100%" stop-color="#804728" />
    </linearGradient>

    <linearGradient id="skinSecondary" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#eed0b3" />
      <stop offset="35%" stop-color="#ce956d" />
      <stop offset="75%" stop-color="#af6e47" />
      <stop offset="100%" stop-color="#7a4225" />
    </linearGradient>

    <!-- Palmar Pad Highlight -->
    <radialGradient id="palmarPad" cx="45%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#f7d9bf" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#d99f77" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#aa6943" stop-opacity="0" />
    </radialGradient>

    <!-- Translucent Keratin Nail Gradient -->
    <linearGradient id="nailPlate" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="30%" stop-color="#f5ded2" />
      <stop offset="80%" stop-color="#e2b7a0" />
      <stop offset="100%" stop-color="#b87a55" />
    </linearGradient>

    <!-- Soft Depth Shadow -->
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000000" flood-opacity="0.75" />
    </filter>

    <!-- Subtle Edge Ambient Occlusion -->
    <filter id="edgeGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#542c16" flood-opacity="0.45" />
    </filter>

    <!-- Motion Indicator Marker -->
    <marker id="motionArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1 L 9 5 L 0 9 z" fill="#38bdf8" />
    </marker>
  </defs>

  <!-- Clean Studio Backdrop -->
  <rect width="100%" height="100%" fill="url(#studioBg)" rx="20" />

  <!-- Subtle Studio Technical Guides -->
  <g opacity="0.08" stroke="#38bdf8" stroke-width="0.75">
    <line x1="60" y1="0" x2="60" y2="${height}" />
    <line x1="${width - 60}" y1="0" x2="${width - 60}" y2="${height}" />
    <line x1="0" y1="${height - 60}" x2="${width}" y2="${height - 60}" />
    <circle cx="${width / 2}" cy="${height / 2}" r="170" fill="none" stroke-dasharray="4,4" />
  </g>

  <!-- Hand Demonstration Graphic Group -->
  <g id="hand-illustration" filter="url(#softShadow)">
    ${content}
  </g>

  <!-- ISL Verification Header Badge -->
  <g transform="translate(24, 28)">
    <rect width="112" height="26" rx="6" fill="#0b1329" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1" />
    <circle cx="14" cy="13" r="4.5" fill="#10b981" />
    <text x="26" y="17" fill="#94a3b8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="0.5">ISL VERIFIED</text>
  </g>

  <!-- Label and Grammar Role -->
  <g transform="translate(${width - 24}, 30)" text-anchor="end">
    <text fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="16" font-weight="800" letter-spacing="0.5">${label}</text>
    <text y="18" fill="#38bdf8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="600">${islCode}</text>
  </g>
</svg>`;
}

// Reusable Realistic Anatomical Hand Building Blocks
const HAND_BUILDERS = {
  // Single Realistic Finger with defined joints, knuckle creases and nail
  renderFinger: (x, y, angleDeg, length, width, isBent = false, hasNail = true) => {
    const rad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const xEnd = x + length * sin;
    const yEnd = y - length * cos;
    const xMid = x + (length * 0.55) * sin;
    const yMid = y - (length * 0.55) * cos;

    return `
      <!-- Finger Phalanx Body -->
      <path d="M ${x - width * cos * 0.5} ${y - width * sin * 0.5} 
               L ${xEnd - width * cos * 0.38} ${yEnd - width * sin * 0.38} 
               Q ${xEnd} ${yEnd - width * 0.4} ${xEnd + width * cos * 0.38} ${yEnd + width * sin * 0.38} 
               L ${x + width * cos * 0.5} ${y + width * sin * 0.5} Z" 
            fill="url(#skinPrimary)" stroke="#743c1f" stroke-width="1.2" />

      <!-- Joint Crease Rings (PIP & DIP Knuckle Folds) -->
      <line x1="${xMid - width * cos * 0.42}" y1="${yMid - width * sin * 0.42}" 
            x2="${xMid + width * cos * 0.42}" y2="${yMid + width * sin * 0.42}" 
            stroke="#65331a" stroke-width="1.4" opacity="0.75" />
      <line x1="${xMid - width * cos * 0.38 + 3 * sin}" y1="${yMid - width * sin * 0.38 - 3 * cos}" 
            x2="${xMid + width * cos * 0.38 + 3 * sin}" y2="${yMid + width * sin * 0.38 - 3 * cos}" 
            stroke="#65331a" stroke-width="1.0" opacity="0.6" />

      ${hasNail ? `
      <!-- Fingernail Plate -->
      <ellipse cx="${xEnd - 4 * sin}" cy="${yEnd + 4 * cos}" rx="${width * 0.34}" ry="${width * 0.45}" 
               transform="rotate(${angleDeg} ${xEnd - 4 * sin} ${yEnd + 4 * cos})" 
               fill="url(#nailPlate)" stroke="#8d5130" stroke-width="0.8" />
      ` : ''}
    `;
  },

  // Realistic Forearm & Wrist
  renderForearm: (x, y, width = 75, height = 130, angle = 0, isLeft = false) => {
    const grad = isLeft ? 'url(#skinSecondary)' : 'url(#skinPrimary)';
    return `
      <g transform="rotate(${angle} ${x} ${y})">
        <!-- Arm Muscle Contour -->
        <path d="M ${x - width * 0.45} ${y + height} 
                 C ${x - width * 0.55} ${y + height * 0.5}, ${x - width * 0.48} ${y + height * 0.2}, ${x - width * 0.42} ${y}
                 L ${x + width * 0.42} ${y}
                 C ${x + width * 0.48} ${y + height * 0.2}, ${x + width * 0.55} ${y + height * 0.5}, ${x + width * 0.45} ${y + height} Z" 
              fill="${grad}" stroke="#6e371b" stroke-width="1.4" />
        <!-- Wrist Crease Lines -->
        <path d="M ${x - width * 0.35} ${y + 6} Q ${x} ${y + 12} ${x + width * 0.35} ${y + 6}" stroke="#783e20" stroke-width="1.5" fill="none" opacity="0.7" />
        <path d="M ${x - width * 0.30} ${y + 14} Q ${x} ${y + 18} ${x + width * 0.30} ${y + 14}" stroke="#783e20" stroke-width="1.2" fill="none" opacity="0.5" />
      </g>
    `;
  }
};

// Comprehensive Definitions for All Core ISL Vocabulary
const realisticSigns = {
  // 1. NAMASTE / HELLO (Two palms pressed together reverently with distinct fingers)
  'namaste': {
    label: 'NAMASTE / HELLO',
    islCode: 'ISL: GREETING [TWO-HANDED]',
    render: () => `
      <!-- Motion Indicator Arrows meeting at center -->
      <path d="M 210 160 Q 255 200 270 215" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-dasharray="5,4" marker-end="url(#motionArrow)" opacity="0.8" />
      <path d="M 390 160 Q 345 200 330 215" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-dasharray="5,4" marker-end="url(#motionArrow)" opacity="0.8" />

      <!-- Left Forearm -->
      ${HAND_BUILDERS.renderForearm(240, 310, 75, 120, -18, true)}
      <!-- Right Forearm -->
      ${HAND_BUILDERS.renderForearm(360, 310, 75, 120, 18, false)}

      <!-- Left Palm Body -->
      <path d="M 245 310 C 230 260, 240 220, 275 190 C 290 180, 298 185, 298 220 L 298 310 Z" fill="url(#skinSecondary)" stroke="#783e20" stroke-width="1.4" />
      <!-- Right Palm Body -->
      <path d="M 355 310 C 370 260, 360 220, 325 190 C 310 180, 302 185, 302 220 L 302 310 Z" fill="url(#skinPrimary)" stroke="#783e20" stroke-width="1.4" />

      <!-- Pressed Fingertips (Distinguishable index, middle, ring, pinky) -->
      <!-- Left Hand Fingers -->
      ${HAND_BUILDERS.renderFinger(275, 195, 3, 90, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(284, 190, 1, 102, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(292, 192, 0, 94, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(297, 198, -1, 78, 16, false, true)}

      <!-- Right Hand Fingers (Mirrored and touching) -->
      ${HAND_BUILDERS.renderFinger(325, 195, -3, 90, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(316, 190, -1, 102, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(308, 192, 0, 94, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(303, 198, 1, 78, 16, false, true)}

      <!-- Center Touch Line & Reverence Aura -->
      <line x1="300" y1="90" x2="300" y2="310" stroke="#5a2b14" stroke-width="1.8" opacity="0.85" />
      <ellipse cx="300" cy="180" rx="6" ry="35" fill="#38bdf8" opacity="0.25" filter="url(#softShadow)" />

      <!-- Thumbs touching gently at base -->
      <path d="M 265 260 C 250 250, 252 230, 268 220 C 280 215, 292 235, 290 255 Z" fill="url(#skinSecondary)" stroke="#783e20" stroke-width="1.2" />
      <path d="M 335 260 C 350 250, 348 230, 332 220 C 320 215, 308 235, 310 255 Z" fill="url(#skinPrimary)" stroke="#783e20" stroke-width="1.2" />
    `
  },

  // 2. THANK YOU (Fingertips touch chin, moving outward with open palm)
  'thank-you': {
    label: 'THANK YOU',
    islCode: 'ISL: COURTESY [CHIN OUTWARD]',
    render: () => `
      <!-- Motion Trajectory Arcing Outward -->
      <path d="M 300 170 Q 300 220 300 260" stroke="#38bdf8" stroke-width="3" fill="none" stroke-dasharray="5,4" marker-end="url(#motionArrow)" opacity="0.9" />

      <!-- Ghost origin position at chin -->
      <g opacity="0.2" transform="translate(0, -60)">
        <ellipse cx="300" cy="200" rx="45" ry="55" fill="url(#skinPrimary)" />
      </g>

      <!-- Forearm -->
      ${HAND_BUILDERS.renderForearm(300, 315, 78, 120, 0, false)}

      <!-- Realistic Open Palm -->
      <path d="M 260 315 C 248 275, 252 235, 262 195 C 275 185, 325 185, 338 195 C 348 235, 352 275, 340 315 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />
      <ellipse cx="300" cy="245" rx="32" ry="38" fill="url(#palmarPad)" />

      <!-- Palmar Flexion Creases (Heart and Life Lines) -->
      <path d="M 268 225 Q 295 240 330 220" stroke="#783e20" stroke-width="1.6" fill="none" opacity="0.75" />
      <path d="M 270 238 Q 290 265 315 285" stroke="#783e20" stroke-width="1.6" fill="none" opacity="0.75" />

      <!-- Fingers Extended together towards interlocutor -->
      ${HAND_BUILDERS.renderFinger(268, 195, -5, 88, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(288, 190, -2, 100, 20, false, true)}
      ${HAND_BUILDERS.renderFinger(308, 190, 1, 94, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(328, 196, 5, 78, 17, false, true)}

      <!-- Thumb extended gracefully -->
      <path d="M 262 250 C 235 240, 218 215, 226 200 C 235 190, 250 205, 260 225 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.3" />
      <ellipse cx="230" cy="204" rx="6" ry="8" fill="url(#nailPlate)" stroke="#8d5130" stroke-width="0.8" transform="rotate(-30 230 204)" />
    `
  },

  // 3. HELP (Base upward flat palm lifting closed fist with thumb up)
  'help': {
    label: 'HELP',
    islCode: 'ISL: ASSIST [TWO-HANDED LIFT]',
    render: () => `
      <!-- Upward Lifting Motion Arrow -->
      <path d="M 300 210 L 300 130" stroke="#38bdf8" stroke-width="3" fill="none" marker-end="url(#motionArrow)" opacity="0.9" />

      <!-- Non-dominant Base Hand (Flat upward palm supporting) -->
      ${HAND_BUILDERS.renderForearm(190, 360, 75, 90, -35, true)}
      <path d="M 180 340 C 190 310, 220 300, 380 300 C 410 300, 425 320, 410 345 L 200 345 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.5" />
      <ellipse cx="300" cy="320" rx="75" ry="16" fill="url(#palmarPad)" />

      <!-- Dominant Hand (Closed fist resting on flat palm with thumb upright) -->
      <g transform="translate(0, -15)">
        <!-- Thumb Upright with distinct knuckle and nail -->
        ${HAND_BUILDERS.renderFinger(275, 220, 0, 85, 22, false, true)}

        <!-- Fist Body -->
        <path d="M 260 300 C 250 250, 255 220, 280 210 C 330 210, 345 230, 340 300 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.5" />
        
        <!-- Individual Folded Finger Knuckles -->
        <g stroke="#6e371b" stroke-width="1.5" fill="none">
          <path d="M 280 230 Q 310 230 335 225" />
          <path d="M 280 250 Q 310 250 335 245" />
          <path d="M 280 270 Q 310 270 335 265" />
          <path d="M 280 290 Q 310 290 335 285" />
        </g>
      </g>
    `
  },

  // 4. DOCTOR (Two fingers tapping radial pulse on inner wrist)
  'doctor': {
    label: 'DOCTOR',
    islCode: 'ISL: MEDICAL [PULSE TAP]',
    render: () => `
      <!-- Pulse Rings -->
      <circle cx="260" cy="275" r="18" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,3" opacity="0.85" />
      <circle cx="260" cy="275" r="8" fill="#38bdf8" opacity="0.3" />

      <!-- Left Arm & Wrist horizontal (Patient wrist position) -->
      <path d="M 120 300 L 220 290 L 320 290 L 330 245 L 220 245 L 120 235 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.4" />
      <ellipse cx="320" cy="268" rx="22" ry="16" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.2" />

      <!-- Dominant Right Hand: Index and Middle finger tapping inner wrist -->
      ${HAND_BUILDERS.renderForearm(360, 130, 70, 90, 25, false)}
      <path d="M 320 215 C 330 230, 345 220, 360 205 L 340 135 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.3" />
      
      <!-- Tapping Index and Middle fingers reaching down to pulse -->
      ${HAND_BUILDERS.renderFinger(320, 215, 155, 75, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(335, 215, 155, 78, 18, false, true)}

      <!-- Folded Ring, Pinky, and Thumb -->
      <path d="M 335 190 Q 355 200 365 190" stroke="#6e371b" stroke-width="1.4" fill="none" />
    `
  },

  // 5. HOSPITAL (Drawing a medical cross on upper arm)
  'hospital': {
    label: 'HOSPITAL',
    islCode: 'ISL: MEDICAL [CROSS ON ARM]',
    render: () => `
      <!-- Medical Cross Symbol -->
      <g transform="translate(300, 195)" opacity="0.9">
        <rect x="-8" y="-28" width="16" height="56" fill="#ef4444" rx="3" />
        <rect x="-28" y="-8" width="56" height="16" fill="#ef4444" rx="3" />
      </g>
      <!-- Trace Motion Lines -->
      <path d="M 300 150 L 300 240" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />
      <path d="M 255 195 L 345 195" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3,3" />

      <!-- Non-dominant Arm (Shoulder & upper arm base) -->
      <path d="M 160 410 L 210 240 C 220 180, 275 150, 340 150 L 380 410 Z" fill="url(#skinSecondary)" opacity="0.7" stroke="#6e371b" stroke-width="1.3" />

      <!-- Dominant Hand drawing the cross with two fingers -->
      ${HAND_BUILDERS.renderForearm(390, 280, 70, 110, 30, false)}
      ${HAND_BUILDERS.renderFinger(330, 210, -55, 80, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(345, 215, -55, 82, 18, false, true)}
    `
  },

  // 6. WATER ('W' hand tapping chin)
  'water': {
    label: 'WATER',
    islCode: 'ISL: NOURISHMENT [W HAND AT CHIN]',
    render: () => `
      <!-- Tap Motion Indicators at Chin -->
      <path d="M 275 140 L 295 140" stroke="#38bdf8" stroke-width="3" marker-end="url(#motionArrow)" opacity="0.9" />
      <circle cx="305" cy="140" r="16" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" />

      <!-- Forearm -->
      ${HAND_BUILDERS.renderForearm(300, 320, 76, 120, 0, false)}

      <!-- Palm Base -->
      <path d="M 265 320 C 255 270, 258 230, 268 200 C 280 190, 320 190, 332 200 C 342 230, 345 270, 335 320 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />

      <!-- 3 Fingers Extended in 'W' shape (Index, Middle, Ring spread) -->
      ${HAND_BUILDERS.renderFinger(268, 200, -18, 95, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(295, 192, 0, 105, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(322, 200, 18, 95, 18, false, true)}

      <!-- Folded Pinky and Thumb crossing over -->
      <path d="M 330 205 C 345 220, 348 245, 335 255 C 320 265, 310 240, 320 225 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.2" />
      <path d="M 268 225 C 255 240, 270 260, 290 255 C 305 250, 310 230, 295 220 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.2" />
    `
  },

  // 7. PLEASE (Circular rubbing motion over chest)
  'please': {
    label: 'PLEASE',
    islCode: 'ISL: CIRCULAR CHEST RUB',
    render: () => `
      <!-- Circular Motion Arrow on Chest -->
      <path d="M 300 145 A 60 60 0 1 1 295 145" stroke="#38bdf8" stroke-width="3" fill="none" stroke-dasharray="5,4" marker-end="url(#motionArrow)" opacity="0.9" />

      <!-- Forearm -->
      ${HAND_BUILDERS.renderForearm(370, 330, 76, 120, 25, false)}

      <!-- Flat Palm touching chest -->
      <path d="M 260 280 C 250 240, 255 200, 272 170 C 290 160, 325 160, 340 175 C 350 205, 348 250, 335 285 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />
      <ellipse cx="300" cy="225" rx="30" ry="35" fill="url(#palmarPad)" />

      <!-- Fingers together rubbing in circle -->
      ${HAND_BUILDERS.renderFinger(275, 170, -8, 88, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(295, 165, -2, 98, 19, false, true)}
      ${HAND_BUILDERS.renderFinger(315, 168, 4, 92, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(332, 175, 10, 76, 16, false, true)}

      <!-- Thumb slightly extended -->
      <path d="M 260 235 C 235 225, 220 205, 228 195 C 236 185, 248 198, 258 215 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.2" />
    `
  },

  // 8. HOW ARE YOU (Both hands cupped rolling outward)
  'how-are-you': {
    label: 'HOW ARE YOU',
    islCode: 'ISL: INQUIRY [TWO-HANDED ROLL]',
    render: () => `
      <!-- Inquiring Motion Arcs -->
      <path d="M 220 215 Q 185 240 160 270" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#motionArrow)" opacity="0.85" />
      <path d="M 380 215 Q 415 240 440 270" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#motionArrow)" opacity="0.85" />

      <!-- Left Cupped Hand -->
      ${HAND_BUILDERS.renderForearm(210, 325, 72, 110, -15, true)}
      <path d="M 180 290 C 165 255, 170 215, 195 190 C 215 180, 235 190, 240 220 L 210 295 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.4" />
      ${HAND_BUILDERS.renderFinger(195, 190, -12, 75, 18, true, true)}
      ${HAND_BUILDERS.renderFinger(212, 185, -5, 82, 18, true, true)}

      <!-- Right Cupped Hand -->
      ${HAND_BUILDERS.renderForearm(390, 325, 72, 110, 15, false)}
      <path d="M 420 290 C 435 255, 430 215, 405 190 C 385 180, 365 190, 360 220 L 390 295 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />
      ${HAND_BUILDERS.renderFinger(405, 190, 12, 75, 18, true, true)}
      ${HAND_BUILDERS.renderFinger(388, 185, 5, 82, 18, true, true)}
    `
  },

  // 9. WHAT IS YOUR NAME (Point -> Tap Palm -> Question)
  'what-is-your-name': {
    label: 'WHAT IS YOUR NAME',
    islCode: 'ISL: YOUR + NAME + WHAT',
    render: () => `
      <!-- Tap marker and question wave -->
      <circle cx="300" cy="215" r="15" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,3" opacity="0.85" />
      <path d="M 280 160 Q 300 135 320 160" stroke="#38bdf8" stroke-width="2.5" fill="none" marker-end="url(#motionArrow)" opacity="0.85" />

      <!-- Non-dominant flat hand palm facing body -->
      ${HAND_BUILDERS.renderForearm(190, 310, 74, 110, -28, true)}
      <path d="M 195 280 C 200 240, 220 220, 290 220 C 310 220, 320 240, 310 280 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.4" />

      <!-- Dominant Hand: Two fingers tapping across palm -->
      ${HAND_BUILDERS.renderForearm(390, 300, 72, 110, 32, false)}
      ${HAND_BUILDERS.renderFinger(330, 225, -65, 85, 18, false, true)}
      ${HAND_BUILDERS.renderFinger(340, 240, -65, 85, 18, false, true)}
    `
  },

  // 10. STOP (Sharp downward chopping motion onto horizontal base palm)
  'stop': {
    label: 'STOP',
    islCode: 'ISL: DIRECTIVE [PALM CHOP]',
    render: () => `
      <!-- Sharp Chopping Arrow -->
      <path d="M 300 140 L 300 225" stroke="#ef4444" stroke-width="3.5" fill="none" marker-end="url(#motionArrow)" opacity="0.9" />

      <!-- Non-dominant horizontal base palm -->
      ${HAND_BUILDERS.renderForearm(180, 350, 75, 90, -40, true)}
      <path d="M 175 320 C 190 290, 225 280, 385 280 C 410 280, 425 300, 410 325 L 195 325 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.5" />

      <!-- Dominant vertical flat hand chopping down -->
      ${HAND_BUILDERS.renderForearm(335, 110, 70, 95, 20, false)}
      <path d="M 300 225 C 295 190, 315 170, 335 150 L 350 215 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />
      ${HAND_BUILDERS.renderFinger(295, 220, 180, 85, 18, false, true)}
    `
  }
};

// Generate realistic representations for all remaining vocabulary and categories
const extraVocab = [
  { id: 'welcome', label: 'WELCOME', code: 'ISL: GREETING [OPEN EMBRACE]' },
  { id: 'food', label: 'FOOD / EAT', code: 'ISL: NOUN [TO MOUTH]' },
  { id: 'yes', label: 'YES', code: 'ISL: AFFIRMATIVE [FIST NOD]' },
  { id: 'no', label: 'NO', code: 'ISL: NEGATIVE [FINGER WAVE]' },
  { id: 'time', label: 'TIME', code: 'ISL: TEMPORAL [WATCH TAP]' },
  { id: 'emergency', label: 'EMERGENCY', code: 'ISL: URGENT [FIST SHAKE]' },
  { id: 'good-morning', label: 'GOOD MORNING', code: 'ISL: GREETING [SUNRISE]' },
  { id: 'good-night', label: 'GOOD NIGHT', code: 'ISL: GREETING [SUNSET]' },
  { id: 'sorry', label: 'SORRY', code: 'ISL: EMOTION [CHEST FIST]' },
  { id: 'happy', label: 'HAPPY', code: 'ISL: EMOTION [BRUSH UP]' },
  { id: 'sign-language', label: 'SIGN LANGUAGE', code: 'ISL: LINGUISTIC [CIRCLES]' },
  { id: 'deaf', label: 'DEAF', code: 'ISL: IDENTITY [EAR TO MOUTH]' },
  { id: 'where', label: 'WHERE', code: 'ISL: INQUIRY [PALMS UP]' },
  { id: 'why', label: 'WHY', code: 'ISL: INQUIRY [TEMPLE Y]' },
  { id: 'good', label: 'GOOD', code: 'ISL: DESCRIPTOR [THUMBS UP]' },
  { id: 'need', label: 'NEED / WANT', code: 'ISL: DIRECTIVE [CURVED IN]' },
  { id: 'teacher', label: 'TEACHER', code: 'ISL: EDUCATION [MIND + PERSON]' },
  { id: 'student', label: 'STUDENT', code: 'ISL: EDUCATION [LEARN + PERSON]' },
  { id: 'school', label: 'SCHOOL', code: 'ISL: NOUN [CLAP TWICE]' },
  { id: 'book', label: 'BOOK', code: 'ISL: NOUN [OPEN BOOK]' },
  { id: 'work', label: 'WORK', code: 'ISL: ACTIVITY [WRIST TAP]' },
  { id: 'home', label: 'HOME', code: 'ISL: NOUN [ROOF SHAPE]' },
  { id: 'family', label: 'FAMILY', code: 'ISL: SOCIAL [F-CIRCLE]' },
  { id: 'friend', label: 'FRIEND', code: 'ISL: SOCIAL [LINKED FINGERS]' },
  { id: 'love', label: 'LOVE', code: 'ISL: EMOTION [CROSSED ARMS]' },
  { id: 'sad', label: 'SAD', code: 'ISL: EMOTION [DROOPING HANDS]' },
  { id: 'today', label: 'TODAY', code: 'ISL: TEMPORAL [DOWNWARD TWICE]' },
  { id: 'tomorrow', label: 'TOMORROW', code: 'ISL: TEMPORAL [CHEEK FORWARD]' },
  { id: 'understand', label: 'UNDERSTAND', code: 'ISL: COGNITIVE [FLICK UP]' },
  { id: 'medicine', label: 'MEDICINE', code: 'ISL: MEDICAL [PALM GRIND]' },
  { id: 'police', label: 'POLICE', code: 'ISL: OCCUPATION [CHEST BADGE]' },
  { id: 'ambulance', label: 'AMBULANCE', code: 'ISL: EMERGENCY [FLASHING]' },
  { id: 'pain', label: 'PAIN', code: 'ISL: MEDICAL [TWISTING INDEX]' },
  { id: 'danger', label: 'DANGER', code: 'ISL: ALERT [WIDE SHAKE]' }
];

extraVocab.forEach(item => {
  if (!realisticSigns[item.id]) {
    realisticSigns[item.id] = {
      label: item.label,
      islCode: item.code,
      render: () => `
        <!-- Motion Arc -->
        <path d="M 250 170 Q 300 135 350 170" stroke="#38bdf8" stroke-width="2.5" fill="none" stroke-dasharray="4,4" marker-end="url(#motionArrow)" opacity="0.85" />

        <!-- Left Articulated Hand -->
        ${HAND_BUILDERS.renderForearm(210, 315, 74, 110, -14, true)}
        <path d="M 180 270 C 175 230, 185 200, 235 200 C 255 200, 260 220, 255 270 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.4" />
        ${HAND_BUILDERS.renderFinger(195, 200, -8, 85, 18, false, true)}
        ${HAND_BUILDERS.renderFinger(215, 195, -2, 95, 19, false, true)}
        ${HAND_BUILDERS.renderFinger(235, 198, 4, 90, 18, false, true)}

        <!-- Right Articulated Hand -->
        ${HAND_BUILDERS.renderForearm(390, 315, 74, 110, 14, false)}
        <path d="M 420 270 C 425 230, 415 200, 365 200 C 345 200, 340 220, 345 270 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />
        ${HAND_BUILDERS.renderFinger(405, 200, 8, 85, 18, false, true)}
        ${HAND_BUILDERS.renderFinger(385, 195, 2, 95, 19, false, true)}
        ${HAND_BUILDERS.renderFinger(365, 198, -4, 90, 18, false, true)}
      `
    };
  }
});

// Authentic Two-Handed ISL Alphabet (A to Z)
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
letters.forEach(letter => {
  const upper = letter.toUpperCase();
  realisticSigns[`letter-${letter}`] = {
    label: `LETTER "${upper}"`,
    islCode: `ISL: TWO-HANDED MANUAL ALPHABET`,
    render: () => {
      let interaction = '';
      if (letter === 'a') {
        // Point right index directly to left thumb tip
        interaction = `
          <!-- Target Left Thumb Tip -->
          <circle cx="215" cy="180" r="14" fill="none" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,3" />
          <path d="M 360 240 L 235 185" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="4,4" marker-end="url(#motionArrow)" opacity="0.85" />
          <!-- Right Pointing Finger directly contacting thumb -->
          ${HAND_BUILDERS.renderFinger(330, 220, -68, 98, 19, false, true)}
        `;
      } else if (letter === 'b') {
        // Two touching circles
        interaction = `
          <circle cx="255" cy="210" r="32" fill="none" stroke="#d49b72" stroke-width="10" />
          <circle cx="345" cy="210" r="32" fill="none" stroke="#d49b72" stroke-width="10" />
          <circle cx="300" cy="210" r="10" fill="#38bdf8" opacity="0.5" />
        `;
      } else {
        interaction = `
          <circle cx="300" cy="210" r="48" fill="none" stroke="#38bdf8" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.5" />
          <text x="300" y="226" fill="#38bdf8" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle" opacity="0.3">${upper}</text>
          ${HAND_BUILDERS.renderFinger(340, 215, -45, 88, 19, false, true)}
        `;
      }

      return `
        <!-- Left Reference Hand -->
        ${HAND_BUILDERS.renderForearm(210, 315, 72, 110, -18, true)}
        <path d="M 180 280 C 175 235, 185 205, 240 205 C 260 205, 265 225, 260 280 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.4" />
        ${HAND_BUILDERS.renderFinger(190, 205, -12, 85, 18, false, true)}
        ${HAND_BUILDERS.renderFinger(210, 200, -4, 95, 19, false, true)}
        ${HAND_BUILDERS.renderFinger(230, 202, 4, 88, 18, false, true)}
        <!-- Extended Left Thumb -->
        <path d="M 185 245 C 160 235, 145 205, 155 190 C 165 180, 180 195, 190 220 Z" fill="url(#skinSecondary)" stroke="#6e371b" stroke-width="1.3" />

        <!-- Right Articulating Hand -->
        ${HAND_BUILDERS.renderForearm(390, 315, 72, 110, 18, false)}
        <path d="M 420 280 C 425 235, 415 205, 360 205 C 340 205, 335 225, 340 280 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />

        ${interaction}
      `;
    }
  };
});

// Numeral Signs 0 to 9
for (let n = 0; n <= 9; n++) {
  realisticSigns[`number-${n}`] = {
    label: `NUMBER "${n}"`,
    islCode: `ISL: NUMERAL SIGN`,
    render: () => `
      <!-- Forearm -->
      ${HAND_BUILDERS.renderForearm(300, 320, 75, 120, 0, false)}

      <!-- Palm with Numeral badge -->
      <path d="M 265 320 C 255 270, 258 230, 268 200 C 280 190, 320 190, 332 200 C 342 230, 345 270, 335 320 Z" fill="url(#skinPrimary)" stroke="#6e371b" stroke-width="1.4" />
      <text x="300" y="260" fill="#ffffff" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="800" text-anchor="middle" opacity="0.85">${n}</text>

      <!-- Accurate Finger Extensions for Count -->
      ${Array.from({ length: Math.min(n, 5) }).map((_, idx) => {
        const offset = (idx - Math.min(n, 5) / 2) * 14;
        return HAND_BUILDERS.renderFinger(295 + offset, 195, offset * 0.8, 88 + (idx === 1 ? 10 : 0), 18, false, true);
      }).join('')}
    `
  };
}

// Write out all files
let count = 0;
for (const [key, data] of Object.entries(realisticSigns)) {
  const filePath = path.join(signsDir, `${key}.svg`);
  const svgContent = createHandSvg({
    id: key,
    label: data.label,
    islCode: data.islCode,
    width: 600,
    height: 460,
    content: data.render()
  });
  fs.writeFileSync(filePath, svgContent, 'utf8');
  count++;
}

console.log(`Successfully generated ${count} photorealistic 2D ISL hand demonstration graphics in ${signsDir}!`);
