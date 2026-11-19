/**
 * SIGNIFY - Anatomically Accurate Rigged 3D Human Hand Model
 * Built using Three.js with natural human biometric proportions,
 * individually articulated finger joints, distinct knuckles, and realistic fingernails.
 */

class Hand3DModel {
  constructor(isLeft = false) {
    this.isLeft = isLeft;
    this.root = new THREE.Group();
    this.root.name = isLeft ? 'LeftHandRoot' : 'RightHandRoot';

    // Joint and Mesh References
    this.joints = {
      wrist: null,
      palm: null,
      thumb: { mcp: null, pip: null, dip: null, tip: null },
      index: { mcp: null, pip: null, dip: null, tip: null },
      middle: { mcp: null, pip: null, dip: null, tip: null },
      ring: { mcp: null, pip: null, dip: null, tip: null },
      pinky: { mcp: null, pip: null, dip: null, tip: null }
    };

    this.materials = this.createMaterials();
    this.buildRig();
  }

  /**
   * Generates realistic skin material with procedural bump texture,
   * natural human skin tones, and keratin fingernail material.
   */
  createMaterials() {
    // Generate high-resolution procedural micro-skin bump texture
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 128;
    bumpCanvas.height = 128;
    const bCtx = bumpCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 128, 128);

    // Fine epidermal micro-grain and dermatoglyphic lines
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 128;
      const y = Math.random() * 128;
      const gray = Math.floor(115 + Math.random() * 30);
      bCtx.fillStyle = `rgb(${gray},${gray},${gray})`;
      bCtx.fillRect(x, y, 1.5, 1.5);
    }
    // Joint crease rings
    bCtx.strokeStyle = 'rgba(70, 70, 70, 0.4)';
    bCtx.lineWidth = 2;
    for (let y = 30; y < 120; y += 32) {
      bCtx.beginPath();
      bCtx.moveTo(0, y);
      bCtx.bezierCurveTo(32, y + 4, 96, y - 4, 128, y);
      bCtx.stroke();
    }

    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.set(2, 4);

    // Human Skin Palette (Realistic Indian skin tone with healthy warm undertone)
    const skinColor = new THREE.Color(0xd09670);
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.52,
      metalness: 0.02,
      bumpMap: bumpTexture,
      bumpScale: 0.025,
      shadowSide: THREE.FrontSide
    });

    // Darker crease material for joints / knuckles
    const creaseMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb57855),
      roughness: 0.65,
      metalness: 0.0,
      bumpMap: bumpTexture,
      bumpScale: 0.04
    });

    // Fingernail Material (Translucent Keratin with soft shine)
    const nailMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xedd3c4),
      roughness: 0.22,
      metalness: 0.05,
      bumpScale: 0.01
    });

    // Forearm cuff / sleeve material
    const cuffMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0f172a),
      roughness: 0.8,
      metalness: 0.1
    });

    return { skin: skinMaterial, crease: creaseMaterial, nail: nailMaterial, cuff: cuffMaterial };
  }

  /**
   * Builds the anatomical bone hierarchy and smooth organic geometry.
   */
  buildRig() {
    const sideMultiplier = this.isLeft ? -1 : 1;

    // --- 1. Forearm Base & Wrist Joint ---
    const wristJoint = new THREE.Group();
    wristJoint.name = 'WristJoint';
    this.root.add(wristJoint);
    this.joints.wrist = wristJoint;

    // Realistic Forearm Geometry
    const armGeo = new THREE.CylinderGeometry(0.52, 0.64, 2.2, 18);
    armGeo.translate(0, -1.1, 0);
    const armMesh = new THREE.Mesh(armGeo, this.materials.skin);
    armMesh.castShadow = true;
    armMesh.receiveShadow = true;
    wristJoint.add(armMesh);

    // Lower forearm sleeve cuff
    const cuffGeo = new THREE.CylinderGeometry(0.66, 0.70, 0.5, 18);
    cuffGeo.translate(0, -1.95, 0);
    const cuffMesh = new THREE.Mesh(cuffGeo, this.materials.cuff);
    wristJoint.add(cuffMesh);

    // --- 2. Palm & Metacarpals ---
    const palm = new THREE.Group();
    palm.name = 'Palm';
    wristJoint.add(palm);
    this.joints.palm = palm;

    // Anatomical palm contour (thenar + hypothenar + palmar arch)
    const palmMainGeo = new THREE.BoxGeometry(1.48, 1.55, 0.46, 4, 4, 3);
    // Sculpt palm curvature
    const pos = palmMainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Palmar arch: hollow center of palm
      if (z > 0 && Math.abs(x) < 0.4 && y > -0.3 && y < 0.5) {
        pos.setZ(i, z - 0.08);
      }
      // Thenar eminence (fleshy thumb base cushion)
      if (x * sideMultiplier < -0.2 && y < 0.1 && z > 0) {
        pos.setZ(i, z + 0.08);
      }
      // Taper towards wrist
      if (y < -0.4) {
        pos.setX(i, x * 0.85);
        pos.setZ(i, z * 0.88);
      }
    }
    palmMainGeo.computeVertexNormals();
    palmMainGeo.translate(0, 0.75, 0);

    const palmMesh = new THREE.Mesh(palmMainGeo, this.materials.skin);
    palmMesh.castShadow = true;
    palmMesh.receiveShadow = true;
    palm.add(palmMesh);

    // Knuckle arch bar (defining dorsal metacarpophalangeal ridge)
    const knuckleArchGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.35, 12);
    knuckleArchGeo.rotateZ(Math.PI / 2);
    knuckleArchGeo.translate(0, 1.48, -0.05);
    const knuckleArch = new THREE.Mesh(knuckleArchGeo, this.materials.crease);
    knuckleArch.castShadow = true;
    palm.add(knuckleArch);

    // --- 3. Individual Digits Construction ---
    // Anatomical finger configuration (spacing, heights, length proportions)
    const fingerDefs = [
      { name: 'index',  x: -0.48 * sideMultiplier, y: 1.52, z: 0.0,  len: 1.05, rad: 0.145, spread: -0.06 * sideMultiplier },
      { name: 'middle', x: -0.16 * sideMultiplier, y: 1.58, z: 0.02, len: 1.18, rad: 0.150, spread: -0.01 * sideMultiplier },
      { name: 'ring',   x:  0.16 * sideMultiplier, y: 1.52, z: 0.0,  len: 1.08, rad: 0.142, spread:  0.03 * sideMultiplier },
      { name: 'pinky',  x:  0.46 * sideMultiplier, y: 1.42, z: -0.02, len: 0.88, rad: 0.125, spread:  0.08 * sideMultiplier }
    ];

    fingerDefs.forEach(def => {
      this.buildFinger(palm, def);
    });

    // --- 4. Anatomical Thumb Construction ---
    this.buildThumb(palm, sideMultiplier);
  }

  /**
   * Constructs an articulated 3-phalanx finger (MCP -> PIP -> DIP -> Tip)
   * with knuckle caps and realistic fingernail plate.
   */
  buildFinger(parent, def) {
    const { name, x, y, z, len, rad, spread } = def;
    const p1Len = len * 0.44; // Proximal phalanx
    const p2Len = len * 0.32; // Intermediate phalanx
    const p3Len = len * 0.24; // Distal phalanx

    // MCP (Knuckle) Joint
    const mcp = new THREE.Group();
    mcp.name = `${name}_mcp`;
    mcp.position.set(x, y, z);
    mcp.rotation.z = spread;
    parent.add(mcp);
    this.joints[name].mcp = mcp;

    // Prominent Knuckle Sphere Cap
    const knuckleCapGeo = new THREE.SphereGeometry(rad * 1.12, 12, 10);
    const knuckleCap = new THREE.Mesh(knuckleCapGeo, this.materials.crease);
    knuckleCap.castShadow = true;
    mcp.add(knuckleCap);

    // Proximal Phalanx Bone
    const p1Geo = this.createPhalanxGeometry(rad, rad * 0.94, p1Len);
    const p1Mesh = new THREE.Mesh(p1Geo, this.materials.skin);
    p1Mesh.castShadow = true;
    p1Mesh.receiveShadow = true;
    mcp.add(p1Mesh);

    // PIP (Middle) Joint
    const pip = new THREE.Group();
    pip.name = `${name}_pip`;
    pip.position.set(0, p1Len, 0);
    mcp.add(pip);
    this.joints[name].pip = pip;

    const pipCapGeo = new THREE.SphereGeometry(rad * 0.98, 12, 10);
    const pipCap = new THREE.Mesh(pipCapGeo, this.materials.crease);
    pipCap.castShadow = true;
    pip.add(pipCap);

    // Intermediate Phalanx Bone
    const p2Geo = this.createPhalanxGeometry(rad * 0.94, rad * 0.86, p2Len);
    const p2Mesh = new THREE.Mesh(p2Geo, this.materials.skin);
    p2Mesh.castShadow = true;
    p2Mesh.receiveShadow = true;
    pip.add(p2Mesh);

    // DIP (Distal) Joint
    const dip = new THREE.Group();
    dip.name = `${name}_dip`;
    dip.position.set(0, p2Len, 0);
    pip.add(dip);
    this.joints[name].dip = dip;

    const dipCapGeo = new THREE.SphereGeometry(rad * 0.90, 10, 8);
    const dipCap = new THREE.Mesh(dipCapGeo, this.materials.crease);
    dipCap.castShadow = true;
    dip.add(dipCap);

    // Distal Phalanx Bone & Fingertip Pad
    const p3Geo = this.createPhalanxGeometry(rad * 0.86, rad * 0.76, p3Len, true);
    const p3Mesh = new THREE.Mesh(p3Geo, this.materials.skin);
    p3Mesh.castShadow = true;
    p3Mesh.receiveShadow = true;
    dip.add(p3Mesh);

    // Fingernail Plate (Placed on dorsal side of distal phalanx)
    const nailGeo = new THREE.CylinderGeometry(rad * 0.72, rad * 0.74, p3Len * 0.60, 10, 1, false, Math.PI * 0.8, Math.PI * 1.4);
    nailGeo.rotateX(Math.PI / 2);
    nailGeo.translate(0, p3Len * 0.65, -rad * 0.72);
    const nailMesh = new THREE.Mesh(nailGeo, this.materials.nail);
    nailMesh.castShadow = true;
    dip.add(nailMesh);

    // Tip marker node
    const tip = new THREE.Group();
    tip.position.set(0, p3Len, 0);
    dip.add(tip);
    this.joints[name].tip = tip;
  }

  /**
   * Builds the anatomical thumb with its unique saddle carpometacarpal (CMC)
   * orientation and opposability.
   */
  buildThumb(parent, sideMultiplier) {
    const thumbLen = 0.95;
    const rad = 0.17;
    const p1Len = thumbLen * 0.52;
    const p2Len = thumbLen * 0.48;

    // Thumb CMC / Base Joint
    const cmc = new THREE.Group();
    cmc.name = 'thumb_cmc';
    cmc.position.set(-0.68 * sideMultiplier, 0.42, 0.15);
    // Natural anatomical thumb rest orientation (~40° forward, ~35° outward)
    cmc.rotation.set(0.45, 0.35 * sideMultiplier, 0.55 * sideMultiplier);
    parent.add(cmc);

    // Thumb MCP Joint
    const mcp = new THREE.Group();
    mcp.name = 'thumb_mcp';
    cmc.add(mcp);
    this.joints.thumb.mcp = mcp;

    // Saddle Joint Flesh
    const baseCapGeo = new THREE.SphereGeometry(rad * 1.18, 12, 10);
    const baseCap = new THREE.Mesh(baseCapGeo, this.materials.skin);
    baseCap.castShadow = true;
    mcp.add(baseCap);

    // Proximal Phalanx
    const p1Geo = this.createPhalanxGeometry(rad, rad * 0.92, p1Len);
    const p1Mesh = new THREE.Mesh(p1Geo, this.materials.skin);
    p1Mesh.castShadow = true;
    p1Mesh.receiveShadow = true;
    mcp.add(p1Mesh);

    // Thumb IP Joint
    const ip = new THREE.Group();
    ip.name = 'thumb_ip';
    ip.position.set(0, p1Len, 0);
    mcp.add(ip);
    this.joints.thumb.pip = ip; // Stored in pip/dip slots for unified animation indexing
    this.joints.thumb.dip = ip;

    const ipCapGeo = new THREE.SphereGeometry(rad * 0.96, 10, 8);
    const ipCap = new THREE.Mesh(ipCapGeo, this.materials.crease);
    ipCap.castShadow = true;
    ip.add(ipCap);

    // Distal Phalanx & Thumb Tip
    const p2Geo = this.createPhalanxGeometry(rad * 0.92, rad * 0.78, p2Len, true);
    const p2Mesh = new THREE.Mesh(p2Geo, this.materials.skin);
    p2Mesh.castShadow = true;
    p2Mesh.receiveShadow = true;
    ip.add(p2Mesh);

    // Thumb Fingernail
    const nailGeo = new THREE.CylinderGeometry(rad * 0.78, rad * 0.82, p2Len * 0.65, 10, 1, false, Math.PI * 0.8, Math.PI * 1.4);
    nailGeo.rotateX(Math.PI / 2);
    nailGeo.translate(0, p2Len * 0.62, -rad * 0.74);
    const nailMesh = new THREE.Mesh(nailGeo, this.materials.nail);
    nailMesh.castShadow = true;
    ip.add(nailMesh);

    // Tip marker node
    const tip = new THREE.Group();
    tip.position.set(0, p2Len, 0);
    ip.add(tip);
    this.joints.thumb.tip = tip;
  }

  /**
   * Creates an organic tapered capsule-like phalanx geometry
   * with natural palmar pad thickness.
   */
  createPhalanxGeometry(radTop, radBottom, length, isTip = false) {
    const geo = new THREE.CylinderGeometry(radBottom, radTop, length, 14, 4);
    geo.translate(0, length / 2, 0);

    // Sculpt natural anatomical curvature
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Palmar side flesh softness (+Z)
      if (z > 0) {
        pos.setZ(i, z * 1.15);
      }
      // Rounded fingertip if distal phalanx
      if (isTip && y > length * 0.75) {
        const factor = (length - y) / (length * 0.25);
        pos.setX(i, x * Math.sqrt(factor));
        pos.setZ(i, z * Math.sqrt(factor));
      }
    }
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Applies an anatomical pose vector to the hand rig.
   * Angles are in radians.
   */
  setPose(poseData) {
    if (!poseData) return;

    // 1. Wrist Translation & Rotation
    if (poseData.wrist) {
      if (poseData.wrist.pos) {
        const px = poseData.wrist.pos[0] * (this.isLeft ? -1 : 1);
        const py = poseData.wrist.pos[1];
        const pz = poseData.wrist.pos[2];
        this.joints.wrist.position.set(px, py, pz);
      }
      if (poseData.wrist.rot) {
        const rx = poseData.wrist.rot[0];
        const ry = poseData.wrist.rot[1] * (this.isLeft ? -1 : 1);
        const rz = poseData.wrist.rot[2] * (this.isLeft ? -1 : 1);
        this.joints.wrist.rotation.set(rx, ry, rz);
      }
    }

    // 2. Thumb Articulation
    if (poseData.thumb && this.joints.thumb.mcp) {
      const t = poseData.thumb;
      const s = this.isLeft ? -1 : 1;
      // CMC / MCP angles: [flexionX, abductionY, rotationZ]
      if (t.mcp) {
        this.joints.thumb.mcp.rotation.set(
          t.mcp[0],
          (t.mcp[1] || 0) * s,
          (t.mcp[2] || 0) * s
        );
      }
      // IP Flexion
      if (t.ip !== undefined && this.joints.thumb.pip) {
        this.joints.thumb.pip.rotation.x = t.ip;
      }
    }

    // 3. Four Fingers Articulation
    const fingers = ['index', 'middle', 'ring', 'pinky'];
    fingers.forEach(fName => {
      const fData = poseData[fName];
      const fJoint = this.joints[fName];
      if (!fData || !fJoint || !fJoint.mcp) return;

      const s = this.isLeft ? -1 : 1;

      // MCP knuckle: [curlX, spreadZ]
      const curl = fData.mcp !== undefined ? fData.mcp : 0;
      const spread = (fData.spread !== undefined ? fData.spread : 0) * s;
      fJoint.mcp.rotation.x = curl;
      fJoint.mcp.rotation.z = spread;

      // PIP joint curl
      if (fJoint.pip && fData.pip !== undefined) {
        fJoint.pip.rotation.x = fData.pip;
      }

      // DIP joint curl
      if (fJoint.dip && fData.dip !== undefined) {
        fJoint.dip.rotation.x = fData.dip;
      }
    });
  }

  setVisible(visible) {
    this.root.visible = visible;
  }
}

window.Hand3DModel = Hand3DModel;
