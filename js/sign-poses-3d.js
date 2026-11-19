/**
 * SIGNIFY - Verified Indian Sign Language (ISL) 3D Poses & Animation Library
 * Mathematically defined joint rotations (radians) and 3D spatial coordinates
 * for anatomically accurate 3D hand demonstration.
 */

// Helper canonical hand postures
const POSE_PRESETS = {
  // Flat open hand (all fingers straight together, thumb relaxed)
  flatOpen: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.1, 0.05, 0.05], ip: 0.1 },
    index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
    middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
    ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
    pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 }
  },

  // Tight closed fist (all fingers folded into palm, thumb folded over)
  closedFist: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
    index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
  },

  // Thumbs up (fist with thumb extended straight up)
  thumbsUp: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [-0.3, 0.1, 0.1], ip: 0.0 },
    index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
  },

  // Pointing index finger (1-hand)
  pointingIndex: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
    index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
    middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
  },

  // V-hand (index and middle extended with spread)
  vHand: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
    index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: -0.18 },
    middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.18 },
    ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
    pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
  },

  // W-hand (index, middle, ring extended; thumb and pinky touching)
  wHand: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.6, 0.5, 0.7], ip: 1.0 },
    index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: -0.16 },
    middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
    ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.16 },
    pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
  },

  // Curved C-hand (fingers and thumb arching like letter C)
  cHand: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.4, 0.3, 0.4], ip: 0.5 },
    index: { mcp: 0.6, pip: 0.75, dip: 0.4, spread: 0.0 },
    middle: { mcp: 0.6, pip: 0.75, dip: 0.4, spread: 0.0 },
    ring: { mcp: 0.6, pip: 0.75, dip: 0.4, spread: 0.0 },
    pinky: { mcp: 0.6, pip: 0.75, dip: 0.4, spread: 0.0 }
  },

  // Bunched / O-Hand (all fingertips meeting thumb tip)
  oHand: {
    wrist: { pos: [0, 0, 0], rot: [0, 0, 0] },
    thumb: { mcp: [0.65, 0.45, 0.6], ip: 0.7 },
    index: { mcp: 0.95, pip: 1.1, dip: 0.65, spread: 0.0 },
    middle: { mcp: 0.95, pip: 1.1, dip: 0.65, spread: 0.0 },
    ring: { mcp: 0.95, pip: 1.1, dip: 0.65, spread: 0.0 },
    pinky: { mcp: 0.95, pip: 1.1, dip: 0.65, spread: 0.0 }
  },

  // Rest / relaxed hand (subtle natural finger curve)
  relaxed: {
    wrist: { pos: [0, -0.6, 0], rot: [0.1, 0, 0] },
    thumb: { mcp: [0.2, 0.1, 0.1], ip: 0.2 },
    index: { mcp: 0.25, pip: 0.35, dip: 0.2, spread: 0.02 },
    middle: { mcp: 0.30, pip: 0.40, dip: 0.2, spread: 0.0 },
    ring: { mcp: 0.35, pip: 0.45, dip: 0.2, spread: -0.02 },
    pinky: { mcp: 0.40, pip: 0.50, dip: 0.2, spread: -0.04 }
  }
};

/**
 * Deep clones a pose preset for custom tweaking.
 */
function clonePose(preset) {
  return JSON.parse(JSON.stringify(preset));
}

/**
 * Master ISL 3D Sign Poses and Keyframe Animations.
 */
const ISL_3D_POSES = {

  // --- 1. CORE VOCABULARY & PHRASES ---

  // NAMASTE / HELLO (Universal Indian Greeting)
  'namaste': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.85, 0.1, 0.4], rot: [0.1, -0.7, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.85, 0.1, 0.4], rot: [0.1, 0.7, -0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Palms meeting reverently at chest center with gentle forward bow
        right: {
          wrist: { pos: [0.24, 0.25, 0.1], rot: [0.22, -1.54, 0.05] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.24, 0.25, 0.1], rot: [0.22, 1.54, -0.05] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Hold reverent position
        right: {
          wrist: { pos: [0.24, 0.25, 0.1], rot: [0.15, -1.54, 0.05] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.24, 0.25, 0.1], rot: [0.15, 1.54, -0.05] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // THANK YOU (Fingertips at chin moving forward & downward with open palm)
  'thank-you': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.1, 0.8, 0.3], rot: [-0.55, -0.2, 0.15] },
          thumb: { mcp: [0.15, 0.1, 0.1], ip: 0.1 },
          index: { mcp: 0.05, pip: 0.05, dip: 0.05, spread: 0.0 },
          middle: { mcp: 0.05, pip: 0.05, dip: 0.05, spread: 0.0 },
          ring: { mcp: 0.05, pip: 0.05, dip: 0.05, spread: 0.0 },
          pinky: { mcp: 0.05, pip: 0.05, dip: 0.05, spread: 0.0 }
        }
      },
      {
        t: 1.0, // Extending gracefully towards interlocutor with palm tilting up
        right: {
          wrist: { pos: [0.15, -0.15, 1.05], rot: [-0.15, 0.1, -0.1] },
          thumb: { mcp: [0.05, -0.15, 0.1], ip: 0.05 },
          index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.05 },
          middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: -0.05 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: -0.1 }
        }
      }
    ]
  },

  // PLEASE (Gentle circular rubbing motion on chest)
  'please': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.2, 0.2, 0.3], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.33,
        right: {
          wrist: { pos: [-0.15, 0.35, 0.28], rot: [-0.25, -0.1, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.66,
        right: {
          wrist: { pos: [-0.2, 0.05, 0.32], rot: [-0.35, -0.3, 0.05] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.2, 0.2, 0.3], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // WELCOME (Both hands palms up moving inward towards body)
  'welcome': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Open hands forward
        right: {
          wrist: { pos: [0.85, -0.2, 0.95], rot: [-0.4, -0.3, 0.3] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.85, -0.2, 0.95], rot: [-0.4, 0.3, -0.3] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Sweeping inward towards body in welcoming embrace
        right: {
          wrist: { pos: [0.45, 0.15, 0.35], rot: [-0.25, -0.4, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, 0.15, 0.35], rot: [-0.25, 0.4, -0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // HOW ARE YOU (Both hands cupped rolling outward and turning palms up)
  'how-are-you': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Cupped hands facing chest
        right: {
          wrist: { pos: [0.35, 0.25, 0.45], rot: [0.8, -0.3, 0.2] },
          thumb: { mcp: [0.3, 0.2, 0.3], ip: 0.3 },
          index: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 },
          middle: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 },
          ring: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 },
          pinky: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.35, 0.25, 0.45], rot: [0.8, 0.3, -0.2] },
          thumb: { mcp: [0.3, -0.2, -0.3], ip: 0.3 },
          index: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 },
          middle: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 },
          ring: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 },
          pinky: { mcp: 0.5, pip: 0.6, dip: 0.3, spread: 0.0 }
        }
      },
      {
        t: 1.0, // Rolling outward and turning palms up in inquiry
        right: {
          wrist: { pos: [0.75, -0.1, 0.75], rot: [-0.3, -0.5, 0.3] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.75, -0.1, 0.75], rot: [-0.3, 0.5, -0.3] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // WHAT IS YOUR NAME (YOUR + NAME [tap palm] + WHAT)
  'what-is-your-name': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Phase 1: Left palm horizontal, right two fingers above
        right: {
          wrist: { pos: [0.35, 0.55, 0.45], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.3], rot: [-1.45, 0.0, -1.45] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.45, // Phase 2: Right two fingers tap across left flat palm (NAME)
        right: {
          wrist: { pos: [-0.15, 0.12, 0.32], rot: [-0.4, 0.1, 0.2] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.3], rot: [-1.45, 0.0, -1.45] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Phase 3: Both hands open shaking side to side (WHAT)
        right: {
          wrist: { pos: [0.65, 0.15, 0.55], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.65, 0.15, 0.55], rot: [-0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // HELP (Left flat palm lifts right fist with thumb up)
  'help': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Right fist resting on left upward palm
        right: {
          wrist: { pos: [0.0, 0.0, 0.35], rot: [0.0, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.thumbsUp)
        },
        left: {
          wrist: { pos: [0.0, -0.55, 0.35], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Both lifting upward together
        right: {
          wrist: { pos: [0.0, 0.65, 0.35], rot: [0.0, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.thumbsUp)
        },
        left: {
          wrist: { pos: [0.0, 0.1, 0.35], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // DOCTOR (Tapping wrist pulse)
  'doctor': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Left wrist forward, right two fingers poised above
        right: {
          wrist: { pos: [0.15, 0.55, 0.45], rot: [0.4, -0.3, 0.2] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.4], rot: [-1.45, 0.2, -1.35] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Tap pulse on inner wrist
        right: {
          wrist: { pos: [-0.15, 0.12, 0.42], rot: [0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.4], rot: [-1.45, 0.2, -1.35] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Second gentle pulse tap
        right: {
          wrist: { pos: [-0.15, 0.12, 0.42], rot: [0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.4], rot: [-1.45, 0.2, -1.35] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // HOSPITAL (Drawing a cross '+' on upper arm)
  'hospital': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Left arm positioned, right two fingers at upper shoulder
        right: {
          wrist: { pos: [-0.4, 0.6, 0.3], rot: [0.1, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.55, 0.0, 0.2], rot: [0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Vertical stroke of cross
        right: {
          wrist: { pos: [-0.4, 0.15, 0.3], rot: [0.1, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.55, 0.0, 0.2], rot: [0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Horizontal cross stroke
        right: {
          wrist: { pos: [-0.25, 0.35, 0.3], rot: [0.1, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.vHand)
        },
        left: {
          wrist: { pos: [-0.55, 0.0, 0.2], rot: [0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // WATER (W-hand tapping chin)
  'water': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.15, 0.65, 0.4], rot: [-0.4, -0.1, 0.1] },
          ...clonePose(POSE_PRESETS.wHand)
        }
      },
      {
        t: 0.4, // Tap at chin
        right: {
          wrist: { pos: [0.05, 0.55, 0.25], rot: [-0.3, -0.05, 0.05] },
          ...clonePose(POSE_PRESETS.wHand)
        }
      },
      {
        t: 0.7, // Pull back
        right: {
          wrist: { pos: [0.12, 0.65, 0.38], rot: [-0.35, -0.1, 0.1] },
          ...clonePose(POSE_PRESETS.wHand)
        }
      },
      {
        t: 1.0, // Second tap at chin
        right: {
          wrist: { pos: [0.05, 0.55, 0.25], rot: [-0.3, -0.05, 0.05] },
          ...clonePose(POSE_PRESETS.wHand)
        }
      }
    ]
  },

  // FOOD / EAT (Bunched fingers to mouth)
  'food': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.2, 0.2, 0.5], rot: [-0.2, -0.1, 0.1] },
          ...clonePose(POSE_PRESETS.oHand)
        }
      },
      {
        t: 0.5, // Towards mouth
        right: {
          wrist: { pos: [0.05, 0.65, 0.28], rot: [-0.45, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.oHand)
        }
      },
      {
        t: 1.0, // Second repetition
        right: {
          wrist: { pos: [0.05, 0.65, 0.28], rot: [-0.45, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.oHand)
        }
      }
    ]
  },

  // YES (Fist nodding up and down from wrist)
  'yes': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.15, 0.3, 0.4], rot: [-0.3, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 0.5, // Nod down
        right: {
          wrist: { pos: [0.15, 0.05, 0.5], rot: [0.45, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 1.0, // Nod up
        right: {
          wrist: { pos: [0.15, 0.3, 0.4], rot: [-0.3, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      }
    ]
  },

  // NO (Index finger waving side-to-side)
  'no': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.05, 0.25, 0.4], rot: [0.0, 0.0, -0.3] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      },
      {
        t: 0.5,
        right: {
          wrist: { pos: [0.25, 0.25, 0.4], rot: [0.0, 0.0, 0.3] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.05, 0.25, 0.4], rot: [0.0, 0.0, -0.3] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      }
    ]
  },

  // STOP (Dominant hand chopping down vertically onto flat base palm)
  'stop': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Right hand high, left hand horizontal base
        right: {
          wrist: { pos: [0.25, 0.85, 0.3], rot: [-0.2, 0.0, 0.3] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [0.0, -0.15, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Sharp vertical chop onto left palm
        right: {
          wrist: { pos: [0.0, 0.02, 0.38], rot: [0.0, -1.57, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [0.0, -0.15, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // TIME (Tapping back of left wrist where watch is worn)
  'time': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.15, 0.45, 0.4], rot: [0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [0.8, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Tap back of wrist
        right: {
          wrist: { pos: [-0.15, 0.12, 0.4], rot: [0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [0.8, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Second tap
        right: {
          wrist: { pos: [-0.15, 0.12, 0.4], rot: [0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [0.8, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // EMERGENCY (Both fists shaking urgently)
  'emergency': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.45, 0.25, 0.4], rot: [0.0, 0.0, 0.15] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.45, 0.25, 0.4], rot: [0.0, 0.0, -0.15] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 0.5,
        right: {
          wrist: { pos: [0.5, 0.3, 0.42], rot: [0.1, 0.0, 0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.5, 0.2, 0.38], rot: [-0.1, 0.0, -0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.45, 0.25, 0.4], rot: [0.0, 0.0, 0.15] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.45, 0.25, 0.4], rot: [0.0, 0.0, -0.15] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      }
    ]
  },

  // GOOD MORNING (Left horizon, right rising sun)
  'good-morning': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Left forearm horizontal, right hand below horizon
        right: {
          wrist: { pos: [0.0, -0.4, 0.35], rot: [-0.2, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.35], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Rising above like the sun spreading fingers
        right: {
          wrist: { pos: [0.0, 0.65, 0.35], rot: [-0.2, 0.0, 0.0] },
          thumb: { mcp: [-0.2, 0.1, 0.1], ip: 0.0 },
          index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: -0.15 },
          middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: -0.05 },
          ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.05 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.15 }
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.35], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // GOOD NIGHT (Right hand arches over left horizon like sunset)
  'good-night': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // High above horizon
        right: {
          wrist: { pos: [0.0, 0.65, 0.4], rot: [-0.3, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.35], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Descending downward covering horizon
        right: {
          wrist: { pos: [0.0, 0.05, 0.45], rot: [0.5, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.35], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // SORRY (Fist circular rub over heart)
  'sorry': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [-0.1, 0.25, 0.3], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 0.33,
        right: {
          wrist: { pos: [0.15, 0.35, 0.28], rot: [-0.25, -0.1, 0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 0.66,
        right: {
          wrist: { pos: [0.2, 0.05, 0.32], rot: [-0.35, -0.3, 0.05] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [-0.1, 0.25, 0.3], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      }
    ]
  },

  // HAPPY (Both hands brushing upward on chest)
  'happy': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.35, -0.1, 0.3], rot: [-0.4, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.35, -0.1, 0.3], rot: [-0.4, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Brushing upward
        right: {
          wrist: { pos: [0.35, 0.45, 0.35], rot: [-0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.35, 0.45, 0.35], rot: [-0.2, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.35, -0.1, 0.3], rot: [-0.4, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.35, -0.1, 0.3], rot: [-0.4, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // SIGN LANGUAGE (Both hands revolving in alternating circles)
  'sign-language': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.4, 0.35, 0.45], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.4, -0.05, 0.4], rot: [-0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5,
        right: {
          wrist: { pos: [0.25, -0.05, 0.4], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.25, 0.35, 0.45], rot: [-0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.4, 0.35, 0.45], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.4, -0.05, 0.4], rot: [-0.2, 0.3, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // WHERE (Both open hands with palms up swaying side to side)
  'where': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.65, 0.1, 0.55], rot: [-0.45, -0.3, 0.25] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.65, 0.1, 0.55], rot: [-0.45, 0.3, -0.25] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Sway inward
        right: {
          wrist: { pos: [0.45, 0.1, 0.55], rot: [-0.45, -0.1, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, 0.1, 0.55], rot: [-0.45, 0.1, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.65, 0.1, 0.55], rot: [-0.45, -0.3, 0.25] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.65, 0.1, 0.55], rot: [-0.45, 0.3, -0.25] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // GOOD (Thumbs Up)
  'good': {
    twoHanded: false,
    animated: false,
    right: {
      wrist: { pos: [0.1, 0.2, 0.4], rot: [0.0, -0.1, 0.0] },
      ...clonePose(POSE_PRESETS.thumbsUp)
    }
  },

  // NEED (Curved index finger pulling towards chest)
  'need': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.15, 0.25, 0.65], rot: [0.2, 0.0, 0.0] },
          thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
          index: { mcp: 0.7, pip: 0.9, dip: 0.5, spread: 0.0 },
          middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
        }
      },
      {
        t: 1.0, // Pulling in towards chest
        right: {
          wrist: { pos: [0.15, 0.15, 0.35], rot: [0.45, 0.0, 0.0] },
          thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
          index: { mcp: 0.9, pip: 1.1, dip: 0.6, spread: 0.0 },
          middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
        }
      }
    ]
  },

  // TEACHER (Both hands near temples moving forward + person marker)
  'teacher': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.55, 0.75, 0.35], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.cHand)
        },
        left: {
          wrist: { pos: [-0.55, 0.75, 0.35], rot: [-0.3, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.cHand)
        }
      },
      {
        t: 0.5, // Moving forward from temples
        right: {
          wrist: { pos: [0.55, 0.55, 0.65], rot: [-0.1, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.55, 0.55, 0.65], rot: [-0.1, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Downward person marker
        right: {
          wrist: { pos: [0.45, -0.15, 0.45], rot: [-0.2, -0.3, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, -0.15, 0.45], rot: [-0.2, 0.3, -0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // FRIEND (Linked index fingers)
  'friend': {
    twoHanded: true,
    animated: false,
    right: {
      wrist: { pos: [0.18, 0.2, 0.4], rot: [0.2, -0.4, 0.3] },
      thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
      index: { mcp: 0.8, pip: 1.0, dip: 0.6, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.18, 0.2, 0.4], rot: [0.2, 0.4, -0.3] },
      thumb: { mcp: [0.5, -0.4, -0.6], ip: 1.1 },
      index: { mcp: 0.8, pip: 1.0, dip: 0.6, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    }
  },

  // FAMILY (Two 'F' hands circling outward)
  'family': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Thumbs/indexes touching in front
        right: {
          wrist: { pos: [0.15, 0.25, 0.55], rot: [-0.2, -0.2, 0.1] },
          thumb: { mcp: [0.65, 0.3, 0.5], ip: 0.6 },
          index: { mcp: 0.8, pip: 1.0, dip: 0.5, spread: 0.0 },
          middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.15, 0.25, 0.55], rot: [-0.2, 0.2, -0.1] },
          thumb: { mcp: [0.65, -0.3, -0.5], ip: 0.6 },
          index: { mcp: 0.8, pip: 1.0, dip: 0.5, spread: 0.0 },
          middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 }
        }
      },
      {
        t: 1.0, // Circling horizontally outward until pinkies meet
        right: {
          wrist: { pos: [0.15, 0.1, 0.3], rot: [-0.2, -1.2, 0.1] },
          thumb: { mcp: [0.65, 0.3, 0.5], ip: 0.6 },
          index: { mcp: 0.8, pip: 1.0, dip: 0.5, spread: 0.0 },
          middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.15, 0.1, 0.3], rot: [-0.2, 1.2, -0.1] },
          thumb: { mcp: [0.65, -0.3, -0.5], ip: 0.6 },
          index: { mcp: 0.8, pip: 1.0, dip: 0.5, spread: 0.0 },
          middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 }
        }
      }
    ]
  },

  // DEAF (Index finger ear to mouth)
  'deaf': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0, // At ear
        right: {
          wrist: { pos: [0.55, 0.8, 0.1], rot: [0.2, -0.8, 0.4] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      },
      {
        t: 1.0, // To mouth
        right: {
          wrist: { pos: [0.15, 0.65, 0.35], rot: [-0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      }
    ]
  },

  // BOOK (Hands joined opening up like a book)
  'book': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Palms together
        right: {
          wrist: { pos: [0.15, 0.15, 0.45], rot: [0.3, -1.57, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.15, 0.15, 0.45], rot: [0.3, 1.57, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Opening up like book pages
        right: {
          wrist: { pos: [0.45, 0.0, 0.45], rot: [-1.2, -0.3, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, 0.0, 0.45], rot: [-1.2, 0.3, -0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // SCHOOL (Clapping hands horizontally twice)
  'school': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.1, 0.45, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [0.0, -0.15, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Clap down
        right: {
          wrist: { pos: [0.0, -0.1, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [0.0, -0.15, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Second clap
        right: {
          wrist: { pos: [0.0, -0.1, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [0.0, -0.15, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // HOME (Roof shape with fingertips touching)
  'home': {
    twoHanded: true,
    animated: false,
    right: {
      wrist: { pos: [0.55, 0.5, 0.35], rot: [-0.3, 0.0, 0.78] },
      ...clonePose(POSE_PRESETS.flatOpen)
    },
    left: {
      wrist: { pos: [-0.55, 0.5, 0.35], rot: [-0.3, 0.0, -0.78] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // UNDERSTAND (Index finger flicking up at temple)
  'understand': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Fist near temple
        right: {
          wrist: { pos: [0.45, 0.75, 0.25], rot: [0.2, -0.4, 0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 1.0, // Index flicking straight up
        right: {
          wrist: { pos: [0.45, 0.85, 0.25], rot: [0.1, -0.3, 0.15] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      }
    ]
  },

  // WHY (Near temple curling into Y-shape)
  'why': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.45, 0.75, 0.3], rot: [0.1, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Thumb and pinky extended, middle 3 curled (Y-shape)
        right: {
          wrist: { pos: [0.45, 0.65, 0.35], rot: [0.1, -0.3, 0.1] },
          thumb: { mcp: [-0.4, 0.2, 0.0], ip: 0.0 },
          index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.1 }
        }
      }
    ]
  },

  // TODAY / NOW (Both open hands moving downward simultaneously twice)
  'today': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.45, 0.35, 0.45], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, 0.35, 0.45], rot: [-0.3, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Move downward
        right: {
          wrist: { pos: [0.45, -0.05, 0.5], rot: [-0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, -0.05, 0.5], rot: [-0.2, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Second downward pulse
        right: {
          wrist: { pos: [0.45, -0.05, 0.5], rot: [-0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, -0.05, 0.5], rot: [-0.2, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // TOMORROW (Thumb moving forward off cheek in arc)
  'tomorrow': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Thumb at cheek
        right: {
          wrist: { pos: [0.35, 0.55, 0.25], rot: [0.0, -0.4, 0.1] },
          ...clonePose(POSE_PRESETS.thumbsUp)
        }
      },
      {
        t: 1.0, // Arcing forward into future
        right: {
          wrist: { pos: [0.35, 0.45, 0.85], rot: [-0.3, -0.2, 0.0] },
          ...clonePose(POSE_PRESETS.thumbsUp)
        }
      }
    ]
  },

  // MEDICINE (Right middle finger grinding in left palm)
  'medicine': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.05, 0.35, 0.4], rot: [0.4, -0.1, 0.2] },
          thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
          index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          middle: { mcp: 0.2, pip: 0.4, dip: 0.2, spread: 0.0 }, // Middle bent grinding
          ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Grinding twist
        right: {
          wrist: { pos: [-0.05, 0.1, 0.4], rot: [0.6, 0.2, -0.1] },
          thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
          index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          middle: { mcp: 0.2, pip: 0.4, dip: 0.2, spread: 0.0 },
          ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Return twist
        right: {
          wrist: { pos: [0.05, 0.12, 0.4], rot: [0.4, -0.1, 0.2] },
          thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
          index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          middle: { mcp: 0.2, pip: 0.4, dip: 0.2, spread: 0.0 },
          ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
          pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // POLICE ('C' shape tapping chest badge)
  'police': {
    twoHanded: false,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.0, 0.35, 0.45], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.cHand)
        }
      },
      {
        t: 0.5, // Tap badge on left chest
        right: {
          wrist: { pos: [-0.2, 0.35, 0.28], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.cHand)
        }
      },
      {
        t: 1.0, // Second tap
        right: {
          wrist: { pos: [-0.2, 0.35, 0.28], rot: [-0.2, -0.3, 0.1] },
          ...clonePose(POSE_PRESETS.cHand)
        }
      }
    ]
  },

  // AMBULANCE (Both hands flashing open and closed above head)
  'ambulance': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.45, 0.85, 0.3], rot: [0.2, 0.0, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, 0.85, 0.3], rot: [0.2, 0.0, -0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 0.5, // Flash alternating
        right: {
          wrist: { pos: [0.45, 0.85, 0.3], rot: [0.2, 0.0, 0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.45, 0.85, 0.3], rot: [0.2, 0.0, -0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.45, 0.85, 0.3], rot: [0.2, 0.0, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.45, 0.85, 0.3], rot: [0.2, 0.0, -0.2] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      }
    ]
  },

  // PAIN (Both index fingers pointing towards each other twisting sharply)
  'pain': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.25, 0.25, 0.4], rot: [0.0, -0.4, 0.4] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        },
        left: {
          wrist: { pos: [-0.25, 0.25, 0.4], rot: [0.0, 0.4, -0.4] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      },
      {
        t: 0.5, // Sharp inward twist
        right: {
          wrist: { pos: [0.12, 0.25, 0.4], rot: [0.4, -0.6, 0.2] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        },
        left: {
          wrist: { pos: [-0.12, 0.25, 0.4], rot: [-0.4, 0.6, -0.2] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.12, 0.25, 0.4], rot: [0.4, -0.6, 0.2] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        },
        left: {
          wrist: { pos: [-0.12, 0.25, 0.4], rot: [-0.4, 0.6, -0.2] },
          ...clonePose(POSE_PRESETS.pointingIndex)
        }
      }
    ]
  },

  // DANGER (Both hands open shaking widely)
  'danger': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.55, 0.35, 0.45], rot: [-0.2, -0.3, 0.15] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.55, 0.35, 0.45], rot: [-0.2, 0.3, -0.15] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5,
        right: {
          wrist: { pos: [0.65, 0.4, 0.48], rot: [-0.1, -0.2, 0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.65, 0.3, 0.42], rot: [-0.3, 0.2, -0.2] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0,
        right: {
          wrist: { pos: [0.55, 0.35, 0.45], rot: [-0.2, -0.3, 0.15] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.55, 0.35, 0.45], rot: [-0.2, 0.3, -0.15] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // STUDENT (Left book palm, right draws from palm to forehead + person marker)
  'student': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // Right hand at left palm (taking knowledge)
        right: {
          wrist: { pos: [-0.15, 0.15, 0.4], rot: [-0.5, -0.1, 0.2] },
          ...clonePose(POSE_PRESETS.cHand)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 0.5, // Drawing knowledge up to forehead
        right: {
          wrist: { pos: [0.2, 0.8, 0.35], rot: [0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Downward person marker
        right: {
          wrist: { pos: [0.35, -0.15, 0.45], rot: [-0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.35, -0.15, 0.45], rot: [-0.2, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      }
    ]
  },

  // WORK (Right fist taps left wrist twice)
  'work': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0,
        right: {
          wrist: { pos: [0.15, 0.45, 0.4], rot: [0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 0.5, // Tap wrist
        right: {
          wrist: { pos: [-0.15, 0.12, 0.4], rot: [0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      },
      {
        t: 1.0, // Second tap
        right: {
          wrist: { pos: [-0.15, 0.12, 0.4], rot: [0.2, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.closedFist)
        },
        left: {
          wrist: { pos: [-0.15, 0.0, 0.4], rot: [0.0, 0.0, -1.57] },
          ...clonePose(POSE_PRESETS.closedFist)
        }
      }
    ]
  },

  // SAD (Hands slowly dropping down with slack curling fingers)
  'sad': {
    twoHanded: true,
    animated: true,
    keyframes: [
      {
        t: 0.0, // In front of face
        right: {
          wrist: { pos: [0.35, 0.75, 0.35], rot: [-0.3, -0.2, 0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        },
        left: {
          wrist: { pos: [-0.35, 0.75, 0.35], rot: [-0.3, 0.2, -0.1] },
          ...clonePose(POSE_PRESETS.flatOpen)
        }
      },
      {
        t: 1.0, // Dropping downward sadly with fingers drooping
        right: {
          wrist: { pos: [0.35, 0.0, 0.45], rot: [0.3, -0.2, 0.1] },
          thumb: { mcp: [0.2, 0.1, 0.1], ip: 0.2 },
          index: { mcp: 0.4, pip: 0.6, dip: 0.3, spread: 0.0 },
          middle: { mcp: 0.45, pip: 0.65, dip: 0.35, spread: 0.0 },
          ring: { mcp: 0.45, pip: 0.65, dip: 0.35, spread: 0.0 },
          pinky: { mcp: 0.4, pip: 0.6, dip: 0.3, spread: 0.0 }
        },
        left: {
          wrist: { pos: [-0.35, 0.0, 0.45], rot: [0.3, 0.2, -0.1] },
          thumb: { mcp: [0.2, -0.1, -0.1], ip: 0.2 },
          index: { mcp: 0.4, pip: 0.6, dip: 0.3, spread: 0.0 },
          middle: { mcp: 0.45, pip: 0.65, dip: 0.35, spread: 0.0 },
          ring: { mcp: 0.45, pip: 0.65, dip: 0.35, spread: 0.0 },
          pinky: { mcp: 0.4, pip: 0.6, dip: 0.3, spread: 0.0 }
        }
      }
    ]
  },

  // LOVE (Crossed arms over chest with fists hugging oneself)
  'love': {
    twoHanded: true,
    animated: false,
    right: {
      wrist: { pos: [-0.25, 0.35, 0.32], rot: [-0.2, -0.4, 0.95] },
      ...clonePose(POSE_PRESETS.closedFist)
    },
    left: {
      wrist: { pos: [0.25, 0.35, 0.38], rot: [-0.2, 0.4, -0.95] },
      ...clonePose(POSE_PRESETS.closedFist)
    }
  }
};

// --- 2. AUTHENTIC TWO-HANDED ISL MANUAL ALPHABET (A to Z) ---
// Authentic Indian Sign Language Alphabet requires precise dual-hand interaction!
const alphabetDefs = {
  // A: Left hand flat palm forward with thumb extended; Right index points to left thumb tip
  'a': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.05, 0.22, 0.4], rot: [0.1, -0.5, 0.3] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.35, 0.1, 0.35], rot: [-0.2, 0.2, -0.1] },
      thumb: { mcp: [-0.4, 0.2, -0.2], ip: 0.0 }, // Extended thumb
      index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
      middle: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
      ring: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
      pinky: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 }
    }
  },

  // B: Both hands form circles touching like glasses/binoculars
  'b': {
    twoHanded: true,
    right: {
      wrist: { pos: [0.22, 0.3, 0.35], rot: [0.0, -0.5, 0.0] },
      thumb: { mcp: [0.65, 0.4, 0.5], ip: 0.6 },
      index: { mcp: 0.85, pip: 1.1, dip: 0.6, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.22, 0.3, 0.35], rot: [0.0, 0.5, 0.0] },
      thumb: { mcp: [0.65, -0.4, -0.5], ip: 0.6 },
      index: { mcp: 0.85, pip: 1.1, dip: 0.6, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    }
  },

  // C: Right hand curved into 'C'
  'c': {
    twoHanded: false,
    right: {
      wrist: { pos: [0.1, 0.25, 0.4], rot: [0.0, -1.2, 0.0] },
      ...clonePose(POSE_PRESETS.cHand)
    }
  },

  // D: Left hand forms 'C'; Right index points up to complete the 'D'
  'd': {
    twoHanded: true,
    right: {
      wrist: { pos: [0.05, 0.25, 0.4], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.25, 0.25, 0.4], rot: [0.0, -1.5, 0.0] },
      ...clonePose(POSE_PRESETS.cHand)
    }
  },

  // E: Left hand flat; Right index touches left index fingertip
  'e': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.15, 0.48, 0.4], rot: [0.2, -0.4, 0.2] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.35, 0.1, 0.35], rot: [-0.2, 0.2, -0.1] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // F: Left index and middle extended; Right index and middle cross across them
  'f': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.25, 0.45], rot: [0.0, 0.0, -1.57] },
      ...clonePose(POSE_PRESETS.vHand)
    },
    left: {
      wrist: { pos: [-0.25, 0.2, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.vHand)
    }
  },

  // G: Two fists stacked with right fist on top of left
  'g': {
    twoHanded: true,
    right: {
      wrist: { pos: [0.0, 0.42, 0.38], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.closedFist)
    },
    left: {
      wrist: { pos: [0.0, -0.05, 0.38], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.closedFist)
    }
  },

  // H: Left flat palm facing forward; Right flat hand sweeps across it
  'h': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.25, 0.42], rot: [0.0, -0.3, -1.4] },
      ...clonePose(POSE_PRESETS.flatOpen)
    },
    left: {
      wrist: { pos: [-0.25, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // I: Left hand flat; Right index touches left middle fingertip
  'i': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.18, 0.52, 0.4], rot: [0.2, -0.4, 0.2] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.35, 0.1, 0.35], rot: [-0.2, 0.2, -0.1] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // J: Right index finger traces a 'J' hook
  'j': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.15, 0.35, 0.45], rot: [0.3, -0.3, 0.5] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.35, 0.1, 0.35], rot: [-0.2, 0.2, -0.1] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // K: Left index pointing up; Right index bent touching it
  'k': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.08, 0.35, 0.4], rot: [0.2, 0.0, 0.6] },
      thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
      index: { mcp: 0.6, pip: 0.8, dip: 0.4, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.3, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    }
  },

  // L: Right hand forms 'L' placed on left palm
  'l': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.25, 0.45], rot: [-0.3, 0.0, 0.0] },
      thumb: { mcp: [-0.4, 0.1, 0.0], ip: 0.0 },
      index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // M: Three fingers resting across left palm
  'm': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.22, 0.45], rot: [0.3, -0.2, -1.2] },
      ...clonePose(POSE_PRESETS.wHand)
    },
    left: {
      wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // N: Two fingers resting across left palm
  'n': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.22, 0.45], rot: [0.3, -0.2, -1.2] },
      ...clonePose(POSE_PRESETS.vHand)
    },
    left: {
      wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // O: Left hand flat; Right index touches left ring fingertip
  'o': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.22, 0.48, 0.4], rot: [0.2, -0.4, 0.2] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.35, 0.1, 0.35], rot: [-0.2, 0.2, -0.1] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // P: Left index pointing up; Right index and thumb circle touching top
  'p': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.42, 0.4], rot: [0.0, -0.4, 0.0] },
      thumb: { mcp: [0.65, 0.4, 0.5], ip: 0.6 },
      index: { mcp: 0.85, pip: 1.1, dip: 0.6, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.3, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    }
  },

  // Q: Left index pointing up; Right circle loops over it
  'q': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.15, 0.35, 0.42], rot: [0.4, -0.2, 0.2] },
      ...clonePose(POSE_PRESETS.cHand)
    },
    left: {
      wrist: { pos: [-0.3, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    }
  },

  // R: Right hooked index finger on left palm
  'r': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.2, 0.45], rot: [0.2, 0.0, 0.2] },
      thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
      index: { mcp: 0.8, pip: 1.0, dip: 0.5, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // S: Left and right pinky fingers hooked together
  's': {
    twoHanded: true,
    right: {
      wrist: { pos: [0.18, 0.25, 0.4], rot: [0.2, -0.3, 0.3] },
      thumb: { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
      index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 0.7, pip: 0.9, dip: 0.5, spread: 0.0 }
    },
    left: {
      wrist: { pos: [-0.18, 0.25, 0.4], rot: [0.2, 0.3, -0.3] },
      thumb: { mcp: [0.5, -0.4, -0.6], ip: 1.1 },
      index: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 0.7, pip: 0.9, dip: 0.5, spread: 0.0 }
    }
  },

  // T: Right index touches edge of left hand
  't': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.05, 0.25, 0.45], rot: [0.2, -0.4, 0.1] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.3, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // U: Left hand flat; Right index touches left pinky tip
  'u': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.28, 0.38, 0.4], rot: [0.2, -0.4, 0.2] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.35, 0.1, 0.35], rot: [-0.2, 0.2, -0.1] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // V: Right 'V' resting on left palm
  'v': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.28, 0.45], rot: [-0.2, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.vHand)
    },
    left: {
      wrist: { pos: [-0.25, 0.0, 0.35], rot: [-1.55, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // W: Both hands interlock fingers
  'w': {
    twoHanded: true,
    right: {
      wrist: { pos: [0.15, 0.2, 0.4], rot: [-0.2, -0.4, 0.3] },
      ...clonePose(POSE_PRESETS.flatOpen)
    },
    left: {
      wrist: { pos: [-0.15, 0.2, 0.4], rot: [-0.2, 0.4, -0.3] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  },

  // X: Both index fingers crossed forming an 'X'
  'x': {
    twoHanded: true,
    right: {
      wrist: { pos: [0.15, 0.28, 0.42], rot: [0.0, 0.0, -0.65] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.15, 0.28, 0.42], rot: [0.0, 0.0, 0.65] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    }
  },

  // Y: Right index placed in web between left thumb and index
  'y': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.15, 0.28, 0.45], rot: [0.3, -0.3, 0.2] },
      ...clonePose(POSE_PRESETS.pointingIndex)
    },
    left: {
      wrist: { pos: [-0.3, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      thumb: { mcp: [-0.5, 0.2, 0.0], ip: 0.0 },
      index: { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 },
      middle: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    }
  },

  // Z: Right flat hand perpendicular against left fingertips
  'z': {
    twoHanded: true,
    right: {
      wrist: { pos: [-0.1, 0.38, 0.45], rot: [0.0, 0.0, -1.57] },
      ...clonePose(POSE_PRESETS.flatOpen)
    },
    left: {
      wrist: { pos: [-0.3, 0.15, 0.35], rot: [0.0, 0.0, 0.0] },
      ...clonePose(POSE_PRESETS.flatOpen)
    }
  }
};

// Register alphabet letters into main 3D pose table
Object.entries(alphabetDefs).forEach(([letter, def]) => {
  ISL_3D_POSES[`letter-${letter}`] = {
    twoHanded: def.twoHanded,
    animated: false,
    right: def.right,
    left: def.left || null
  };
});

// Register numbers 0-9
for (let n = 0; n <= 9; n++) {
  let count = n === 0 ? 0 : Math.min(n, 5);
  ISL_3D_POSES[`number-${n}`] = {
    twoHanded: n > 5,
    animated: false,
    right: {
      wrist: { pos: [0.1, 0.25, 0.4], rot: [0.0, -0.2, 0.0] },
      thumb: count >= 5 ? { mcp: [-0.3, 0.1, 0.0], ip: 0.0 } : { mcp: [0.5, 0.4, 0.6], ip: 1.1 },
      index: count >= 1 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      middle: count >= 2 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: count >= 3 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: count >= 4 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    },
    left: n > 5 ? {
      wrist: { pos: [-0.35, 0.25, 0.4], rot: [0.0, 0.2, 0.0] },
      thumb: (n - 5) >= 5 ? { mcp: [-0.3, -0.1, 0.0], ip: 0.0 } : { mcp: [0.5, -0.4, -0.6], ip: 1.1 },
      index: (n - 5) >= 1 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      middle: (n - 5) >= 2 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      ring: (n - 5) >= 3 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 },
      pinky: (n - 5) >= 4 ? { mcp: 0.0, pip: 0.0, dip: 0.0, spread: 0.0 } : { mcp: 1.55, pip: 1.7, dip: 1.2, spread: 0.0 }
    } : null
  };
}

// Export for browser
window.ISL_3D_POSES = ISL_3D_POSES;
window.POSE_PRESETS = POSE_PRESETS;
