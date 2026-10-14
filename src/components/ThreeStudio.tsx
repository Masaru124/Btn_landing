'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Ruler, RefreshCw, Sparkles, Check, Crosshair } from 'lucide-react';

export interface MaterialSpec {
  key: string;
  name: string;
  type: string;
  color: number;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  specCode: string;
  harvest: string;
  gradient: string;
  generator: (engraving: string, holesCount: number) => { diffuseMap: THREE.CanvasTexture; bumpMap: THREE.CanvasTexture };
}

// Procedural Canvas Texture Helpers
function drawHolesOnCanvas(ctx: CanvasRenderingContext2D, size: number, holesCount: number, isBump: boolean) {
  if (holesCount === 1) return; // Shank button has smooth unpierced front face

  const center = size / 2;
  const holeRadius = size * 0.045;
  let positions: { x: number; y: number }[] = [];

  if (holesCount === 4) {
    const spacing = size * 0.13;
    positions = [
      { x: center - spacing, y: center - spacing },
      { x: center + spacing, y: center - spacing },
      { x: center - spacing, y: center + spacing },
      { x: center + spacing, y: center + spacing },
    ];
  } else if (holesCount === 2) {
    const spacing = size * 0.165;
    positions = [
      { x: center - spacing, y: center },
      { x: center + spacing, y: center },
    ];
  }

  positions.forEach(pos => {
    ctx.save();
    if (isBump) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, holeRadius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = '#C0C0C0';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, holeRadius * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
      ctx.fill();

      const radGrad = ctx.createRadialGradient(
        pos.x - holeRadius * 0.25, pos.y - holeRadius * 0.25, holeRadius * 0.05,
        pos.x, pos.y, holeRadius
      );
      radGrad.addColorStop(0, '#030303');
      radGrad.addColorStop(0.8, '#0C0A09');
      radGrad.addColorStop(1, '#1C1917');

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, holeRadius, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, holeRadius * 1.15, Math.PI * 1.1, Math.PI * 1.9);
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)';
      ctx.stroke();
    }
    ctx.restore();
  });
}

function drawEngravedText(ctx: CanvasRenderingContext2D, text: string, size: number, isBump: boolean) {
  if (!text || text.trim() === '') return;
  const center = size / 2;
  const radius = size * 0.355;

  ctx.save();
  ctx.translate(center, center);
  ctx.font = '700 30px "Bodoni Moda", "Jost", serif';
  ctx.fillStyle = isBump ? '#222222' : 'rgba(0, 0, 0, 0.52)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const chars = text.split('');
  const totalAngle = Math.PI * 0.76;
  const startAngle = -Math.PI / 2 - totalAngle / 2;
  const angleStep = totalAngle / Math.max(chars.length - 1, 1);

  chars.forEach((char, i) => {
    const angle = startAngle + i * angleStep;
    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  ctx.restore();
}

function createNacreTexture(engraving: string, holesCount = 4) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size * 0.4, size * 0.4, 40, size * 0.5, size * 0.5, size * 0.5);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.3, '#F7F4EB');
  grad.addColorStop(0.6, '#EDE6D8');
  grad.addColorStop(0.85, '#E5DDD0');
  grad.addColorStop(1, '#D9D0C1');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.05;
  for (let r = 50; r < size * 0.5; r += 12) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.lineWidth = 4 + Math.sin(r) * 2;
    ctx.strokeStyle = '#9BB0A8';
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  drawEngravedText(ctx, engraving, size, false);
  drawHolesOnCanvas(ctx, size, holesCount, false);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  drawEngravedText(bCtx, engraving, size, true);
  drawHolesOnCanvas(bCtx, size, holesCount, true);

  return {
    diffuseMap: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createHornTexture(engraving: string, holesCount = 4) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1C1815';
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.28;
  for (let i = 0; i < 45; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#4A3B2C' : '#2A221B';
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.ellipse(x, y, 120 + Math.random() * 200, 30 + Math.random() * 40, Math.PI * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  drawEngravedText(ctx, engraving, size, false);
  drawHolesOnCanvas(ctx, size, holesCount, false);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  drawEngravedText(bCtx, engraving, size, true);
  drawHolesOnCanvas(bCtx, size, holesCount, true);

  return {
    diffuseMap: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createCorozoTexture(engraving: string, holesCount = 4) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#D6C0A0';
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.08;
  for (let r = 20; r < size * 0.5; r += 6) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#7D5F3A';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  drawEngravedText(ctx, engraving, size, false);
  drawHolesOnCanvas(ctx, size, holesCount, false);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  drawEngravedText(bCtx, engraving, size, true);
  drawHolesOnCanvas(bCtx, size, holesCount, true);

  return {
    diffuseMap: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createBrassTexture(engraving: string, holesCount = 4) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 20, size / 2, size / 2, size * 0.5);
  grad.addColorStop(0, '#E8CA7A');
  grad.addColorStop(0.5, '#C89D42');
  grad.addColorStop(1, '#8B6520');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.15;
  for (let r = 10; r < size * 0.5; r += 3) {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  drawEngravedText(ctx, engraving, size, false);
  drawHolesOnCanvas(ctx, size, holesCount, false);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  drawEngravedText(bCtx, engraving, size, true);
  drawHolesOnCanvas(bCtx, size, holesCount, true);

  return {
    diffuseMap: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createResinTexture(engraving: string, holesCount = 4) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size * 0.4, size * 0.35, 10, size / 2, size / 2, size * 0.5);
  grad.addColorStop(0, '#246B5A');
  grad.addColorStop(0.7, '#134639');
  grad.addColorStop(1, '#0A2720');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  drawEngravedText(ctx, engraving, size, false);
  drawHolesOnCanvas(ctx, size, holesCount, false);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  drawEngravedText(bCtx, engraving, size, true);
  drawHolesOnCanvas(bCtx, size, holesCount, true);

  return {
    diffuseMap: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

function createTerrazzoTexture(engraving: string, holesCount = 4) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E5E0D8';
  ctx.fillRect(0, 0, size, size);

  const speckColors = ['#205D67', '#B68D40', '#9E4B38', '#383838'];
  for (let i = 0; i < 320; i++) {
    ctx.fillStyle = speckColors[Math.floor(Math.random() * speckColors.length)];
    ctx.beginPath();
    const x = Math.random() * size;
    const y = Math.random() * size;
    const s = 1.5 + Math.random() * 4.5;
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }

  drawEngravedText(ctx, engraving, size, false);
  drawHolesOnCanvas(ctx, size, holesCount, false);

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);
  drawEngravedText(bCtx, engraving, size, true);
  drawHolesOnCanvas(bCtx, size, holesCount, true);

  return {
    diffuseMap: new THREE.CanvasTexture(canvas),
    bumpMap: new THREE.CanvasTexture(bumpCanvas)
  };
}

export const MATERIAL_CONFIGS: Record<string, MaterialSpec> = {
  nacre: {
    key: 'nacre',
    name: 'Australian Mother-of-Pearl',
    type: 'Nacre Pinctada Maxima',
    color: 0xEAE7E1,
    roughness: 0.18,
    metalness: 0.15,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
    specCode: 'MP-042',
    harvest: 'Sustainable Pearl Oyster Marine Cultivation',
    gradient: 'radial-gradient(#FFF, #D8D2C6)',
    generator: createNacreTexture,
  },
  corozo: {
    key: 'corozo',
    name: 'Ecuadorian Corozo',
    type: 'Vegetable Ivory (Phytelephas)',
    color: 0xD7C2A3,
    roughness: 0.58,
    metalness: 0.02,
    clearcoat: 0.1,
    clearcoatRoughness: 0.4,
    specCode: 'CZ-284',
    harvest: 'Rainforest Nut Fallen Harvest (Zero Deforestation)',
    gradient: 'radial-gradient(#E8D5B8, #9A774D)',
    generator: createCorozoTexture,
  },
  horn: {
    key: 'horn',
    name: 'Smoked Water Buffalo Horn',
    type: 'Marbled Keratin Specimen',
    color: 0x241E1A,
    roughness: 0.28,
    metalness: 0.08,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    specCode: 'HN-891',
    harvest: 'Ethical Agricultural Byproduct (CITES Certified)',
    gradient: 'radial-gradient(#3A2F28, #110E0C)',
    generator: createHornTexture,
  },
  brass: {
    key: 'brass',
    name: 'Burnished Vintage Brass',
    type: 'Solid Lathe-Turned CuZn Alloy',
    color: 0xC59E4E,
    roughness: 0.32,
    metalness: 0.92,
    clearcoat: 0.2,
    clearcoatRoughness: 0.3,
    specCode: 'BR-703',
    harvest: '100% Recycled European Industrial Brass',
    gradient: 'radial-gradient(#F3CF7A, #8A641B)',
    generator: createBrassTexture,
  },
  resin: {
    key: 'resin',
    name: 'Bio-Cast Emerald Resin',
    type: '78% Plant-Derived Poly-Cast',
    color: 0x14453A,
    roughness: 0.22,
    metalness: 0.05,
    clearcoat: 0.85,
    clearcoatRoughness: 0.15,
    specCode: 'BC-519',
    harvest: 'Non-GMO Castor Oil & Flaxseed Monomer',
    gradient: 'radial-gradient(#246B5A, #0A2720)',
    generator: createResinTexture,
  },
  terrazzo: {
    key: 'terrazzo',
    name: 'Ocean Recycled Terrazzo',
    type: 'GRS Certified Upcycled Micro-Grain',
    color: 0xE2DDD5,
    roughness: 0.62,
    metalness: 0.02,
    clearcoat: 0.05,
    clearcoatRoughness: 0.5,
    specCode: 'TZ-116',
    harvest: 'Recovered Marine Fishing Nets & Coastal Debris',
    gradient: 'radial-gradient(#F0EBE3, #B8B0A2)',
    generator: createTerrazzoTexture,
  },
};

export interface ThreeStudioProps {
  selectedMaterial?: string;
  onMaterialChange?: (mat: string) => void;
}

export default function ThreeStudio({ selectedMaterial, onMaterialChange }: ThreeStudioProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMaterial, setCurrentMaterial] = useState<string>('nacre');
  const [currentHoles, setCurrentHoles] = useState<number>(4);
  const [currentLigne, setCurrentLigne] = useState<number>(32);
  const [currentEngraving, setCurrentEngraving] = useState<string>('BOTTONIFICIO 1928');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [caliperMode, setCaliperMode] = useState<boolean>(false);
  const [laserActive, setLaserActive] = useState<boolean>(false);

  // Sync external material prop
  useEffect(() => {
    if (selectedMaterial && MATERIAL_CONFIGS[selectedMaterial]) {
      setCurrentMaterial(selectedMaterial);
    }
  }, [selectedMaterial]);

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buttonGroupRef = useRef<THREE.Group | null>(null);
  const overheadSpotRef = useRef<THREE.PointLight | null>(null);
  const isIntersectingRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(true);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0.35, y: 0.45 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0.35, y: 0.45 });
  const animFrameId = useRef<number | null>(null);

  autoRotateRef.current = autoRotate;

  const mmDiameter = (currentLigne * 0.635).toFixed(1);
  const activeCfg = MATERIAL_CONFIGS[currentMaterial] || MATERIAL_CONFIGS.nacre;

  const handleSelectMaterial = (key: string) => {
    setCurrentMaterial(key);
    onMaterialChange?.(key);
  };

  // Button geometry & PBR mesh rebuild
  const rebuildButton = useCallback(() => {
    if (!buttonGroupRef.current) return;
    const group = buttonGroupRef.current;

    while (group.children.length > 0) {
      const obj = group.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      group.remove(obj);
    }

    const radiusScale = (currentLigne / 32) * 1.8;
    const thickness = 0.32 * (currentLigne / 32);
    const dishDepth = 0.08 * radiusScale;
    const rimHeight = thickness * 0.6;
    const innerRadius = radiusScale * 0.72;

    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.001, -thickness * 0.95));
    points.push(new THREE.Vector2(radiusScale * 0.5, -thickness * 0.95));
    points.push(new THREE.Vector2(radiusScale * 0.92, -thickness * 0.8));
    points.push(new THREE.Vector2(radiusScale, -thickness * 0.4));
    points.push(new THREE.Vector2(radiusScale, 0));
    points.push(new THREE.Vector2(radiusScale * 0.95, rimHeight * 0.4));
    points.push(new THREE.Vector2(radiusScale * 0.88, rimHeight * 0.5));
    points.push(new THREE.Vector2(innerRadius, rimHeight * 0.2));
    points.push(new THREE.Vector2(radiusScale * 0.45, -dishDepth * 0.6));
    points.push(new THREE.Vector2(0.001, -dishDepth));

    const buttonGeo = new THREE.LatheGeometry(points, 64);

    // Planar UV projection from top face
    const posAttr = buttonGeo.attributes.position;
    const uvAttr = buttonGeo.attributes.uv;
    const uvScale = radiusScale * 2.15;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const u = (x / uvScale) + 0.5;
      const v = (z / uvScale) + 0.5;
      uvAttr.setXY(i, u, v);
    }
    uvAttr.needsUpdate = true;
    buttonGeo.computeVertexNormals();

    const cfg = MATERIAL_CONFIGS[currentMaterial] || MATERIAL_CONFIGS.nacre;
    const { diffuseMap, bumpMap } = cfg.generator(currentEngraving, currentHoles);

    const buttonMat = new THREE.MeshPhysicalMaterial({
      color: cfg.color,
      roughness: cfg.roughness,
      metalness: cfg.metalness,
      clearcoat: cfg.clearcoat,
      clearcoatRoughness: cfg.clearcoatRoughness,
      map: diffuseMap,
      bumpMap: bumpMap,
      bumpScale: 0.06,
      reflectivity: 0.85,
      side: THREE.DoubleSide,
    });

    const buttonMesh = new THREE.Mesh(buttonGeo, buttonMat);
    buttonMesh.castShadow = true;
    buttonMesh.receiveShadow = true;
    group.add(buttonMesh);

    // Rear metal loop for shank
    if (currentHoles === 1) {
      const shankGeo = new THREE.TorusGeometry(radiusScale * 0.26, radiusScale * 0.07, 16, 24, Math.PI);
      const shankMat = new THREE.MeshStandardMaterial({
        color: 0x997E4A,
        metalness: 0.88,
        roughness: 0.32,
      });
      const shankMesh = new THREE.Mesh(shankGeo, shankMat);
      shankMesh.position.set(0, -thickness * 0.95, 0);
      shankMesh.rotation.x = -Math.PI / 2;
      group.add(shankMesh);
    }
  }, [currentMaterial, currentHoles, currentLigne, currentEngraving]);

  // Initial Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting rig
    const ambient = new THREE.AmbientLight(0xFFFAF2, 0.85);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xFFF6EA, 1.6);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xD8EEF8, 1.2);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const overheadSpot = new THREE.PointLight(0xFFFFFF, 0.9, 12);
    overheadSpot.position.set(0, 4, 3);
    scene.add(overheadSpot);
    overheadSpotRef.current = overheadSpot;

    const buttonGroup = new THREE.Group();
    scene.add(buttonGroup);
    buttonGroupRef.current = buttonGroup;

    // Intersection Observer to pause rendering when off-screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isIntersectingRef.current = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(container);

    // Render loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      if (!isIntersectingRef.current) return;

      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotation.current.y += 0.004;
      }

      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      if (buttonGroupRef.current) {
        buttonGroupRef.current.rotation.x = currentRotation.current.x;
        buttonGroupRef.current.rotation.y = currentRotation.current.y;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Event listeners
    const dom = renderer.domElement;
    const handlePointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true;
      setAutoRotate(false);
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) {
        const rect = dom.getBoundingClientRect();
        if (
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom
        ) {
          const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
          const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
          targetRotation.current.x = 0.35 + normY;
          targetRotation.current.y = 0.45 + normX;
          if (overheadSpotRef.current) {
            overheadSpotRef.current.position.x = normX * 16;
            overheadSpotRef.current.position.y = -normY * 16 + 4;
          }
        }
        return;
      }

      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;

      targetRotation.current.y += deltaX * 0.008;
      targetRotation.current.x += deltaY * 0.008;
      targetRotation.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.current.x));

      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.005;
      cameraRef.current.position.z = Math.max(4.5, Math.min(11, cameraRef.current.position.z));
    };

    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 440;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      observer.disconnect();
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
    };
  }, []);

  // Trigger button geometry rebuild whenever state changes
  useEffect(() => {
    rebuildButton();
  }, [rebuildButton]);

  const handleResetView = () => {
    targetRotation.current = { x: 0.35, y: 0.45 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 7.5);
    }
  };

  return (
    <div className="studio-container" id="studio-section" aria-label="Interactive 3D Button Configurator">
      <div className="studio-header">
        <div className="studio-label">
          <span className="studio-indicator"></span>
          <span className="studio-title">3D Atelier Studio</span>
        </div>
        <span className="studio-meta" id="hud-spec-code">{activeCfg.specCode} · Live Render</span>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        className="studio-canvas-wrap"
        tabIndex={0}
        role="region"
        aria-label="3D Button Viewer. Drag to rotate button."
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div id="button-3d-canvas" ref={containerRef} style={{ width: '100%', height: '440px', minHeight: '440px' }} />

        {/* Dynamic Canvas HUD Badge */}
        <div className="canvas-hud">
          <div id="hud-mat-name">{activeCfg.name}</div>
          <div id="hud-ligne-val" style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>
            {currentLigne}L ({mmDiameter}mm)
          </div>
        </div>

        {/* Caliper Micrometer Technical Overlay */}
        <AnimatePresence>
          {caliperMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="caliper-hud-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px 24px',
                zIndex: 4,
                background: 'radial-gradient(ellipse at center, rgba(0, 127, 110, 0.04) 0%, transparent 70%)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge-tag" style={{ background: 'var(--accent-teal)', color: '#fff', fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                  VERNIER MICROMETER ACTIVE · DIN 862
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-teal)', fontWeight: 700 }}>
                  RUNOUT: ±0.003mm
                </span>
              </div>

              {/* Technical Reticle & Measurement Lines */}
              <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="340" height="220" viewBox="0 0 340 220" fill="none" style={{ overflow: 'visible' }}>
                  {/* Caliper Top Jaw */}
                  <line x1="80" y1="25" x2="260" y2="25" stroke="#007F6E" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="170" y1="12" x2="170" y2="38" stroke="#007F6E" strokeWidth="2" />
                  
                  {/* Caliper Bottom Jaw */}
                  <line x1="80" y1="195" x2="260" y2="195" stroke="#007F6E" strokeWidth="1.5" strokeDasharray="4 4" />
                  <line x1="170" y1="182" x2="170" y2="208" stroke="#007F6E" strokeWidth="2" />

                  {/* Dimension Span with Arrowheads */}
                  <line x1="275" y1="28" x2="275" y2="192" stroke="#007F6E" strokeWidth="1.5" />
                  <polygon points="275,25 271,34 279,34" fill="#007F6E" />
                  <polygon points="275,195 271,186 279,186" fill="#007F6E" />

                  {/* Digital Measurement Readout Box */}
                  <rect x="235" y="98" width="92" height="26" rx="4" fill="rgba(18, 18, 16, 0.92)" stroke="#007F6E" strokeWidth="1" />
                  <text x="281" y="115" fill="#52D1C0" fontSize="11" fontFamily="var(--font-mono)" textAnchor="middle" fontWeight="bold">
                    Ø {mmDiameter} mm
                  </text>

                  {/* Concentric Alignment Grid */}
                  <circle cx="170" cy="110" r="78" stroke="#007F6E" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
                  <circle cx="170" cy="110" r="4" fill="#007F6E" />
                  <line x1="150" y1="110" x2="190" y2="110" stroke="#007F6E" strokeWidth="1" />
                  <line x1="170" y1="90" x2="170" y2="130" stroke="#007F6E" strokeWidth="1" />
                </svg>
              </div>

              {/* Bottom Precision Telemetry Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--ink)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(6px)',
                padding: '6px 14px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 127, 110, 0.25)'
              }}>
                <span>CALIBER: {currentLigne} LIGNES</span>
                <span>CHAMFER: 45° CNC</span>
                <span>APERTURE: {currentHoles === 1 ? 'SHANK' : `${currentHoles}-HOLE`}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Laser Etch Diode Crosshair Animation */}
        <AnimatePresence>
          {laserActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '180px',
                height: '180px',
                marginTop: '-90px',
                marginLeft: '-90px',
                borderRadius: '50%',
                border: '1.5px dashed #FF3344',
                pointerEvents: 'none',
                animation: 'spin 3s linear infinite',
                boxShadow: '0 0 15px rgba(255,51,68,0.5)',
                zIndex: 3
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-5px',
                left: '50%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#FF3344',
                boxShadow: '0 0 12px #FF3344, 0 0 24px #FF8800'
              }} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="canvas-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
          <span>Drag pointer to rotate · Scroll to zoom</span>
        </div>

        <div className="canvas-controls-overlay">
          <button
            type="button"
            className="hud-tool-btn"
            id="btn-reset-view"
            title="Reset Viewport Position"
            onClick={handleResetView}
          >
            Reset View
          </button>
          <button
            type="button"
            className={`hud-tool-btn ${caliperMode ? 'active' : ''}`}
            id="btn-toggle-caliper"
            title="Toggle Vernier Caliper Inspection Overlay"
            onClick={() => setCaliperMode(!caliperMode)}
            style={caliperMode ? { background: 'var(--accent-teal)', color: '#fff', borderColor: 'var(--accent-teal)' } : {}}
          >
            <Ruler size={13} style={{ display: 'inline', marginRight: 4 }} />
            {caliperMode ? 'Close Caliper' : 'Caliper Mode'}
          </button>
          <button
            type="button"
            className="hud-tool-btn"
            id="btn-toggle-rotate"
            title="Toggle Auto-Rotation"
            onClick={() => setAutoRotate(!autoRotate)}
          >
            <RotateCw size={12} style={{ display: 'inline', marginRight: 4 }} />
            {autoRotate ? 'Pause' : 'Spin'}
          </button>
        </div>
      </div>

      {/* Studio Control Panel */}
      <div className="studio-control-panel">
        {/* Material Selector */}
        <div>
          <div className="control-section-header">
            <span className="control-title">Select Material Specimen</span>
            <span className="control-value" id="control-mat-val">{activeCfg.type}</span>
          </div>
          <div className="swatch-grid" role="radiogroup" aria-label="Material Options" id="swatch-container">
            {Object.values(MATERIAL_CONFIGS).map((spec) => (
              <motion.button
                type="button"
                key={spec.key}
                data-material={spec.key}
                className={`swatch-btn ${currentMaterial === spec.key ? 'active' : ''}`}
                title={spec.name}
                whileHover={{ y: -2, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectMaterial(spec.key)}
              >
                <span className="swatch-disc" style={{ background: spec.gradient }}></span>
                <span className="swatch-name">{spec.name.split(' ')[0]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Dual Geometry Options: Holes & Diameter */}
        <div className="options-dual-grid">
          {/* Hole Configuration */}
          <div>
            <div className="control-section-header">
              <span className="control-title">Aperture Style</span>
              <span className="control-value" id="control-holes-val">
                {currentHoles === 1 ? 'Solid Loop Shank' : `${currentHoles}-Hole Tailor`}
              </span>
            </div>
            <div className="button-toggle-group" id="holes-segmented">
              {[
                { val: 4, label: '4-Hole' },
                { val: 2, label: '2-Hole' },
                { val: 1, label: 'Shank' }
              ].map(({ val, label }) => (
                <motion.button
                  key={val}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  className={`toggle-opt hole-toggle-btn ${currentHoles === val ? 'active' : ''}`}
                  data-holes={String(val)}
                  onClick={() => setCurrentHoles(val)}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Diameter Slider (Lignes) */}
          <div>
            <div className="control-section-header">
              <span className="control-title">Diameter</span>
              <span className="control-value" id="control-ligne-val">
                {currentLigne} Lignes ({mmDiameter}mm)
              </span>
            </div>
            <div className="slider-wrap">
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>18L</span>
              <input
                type="range"
                className="ligne-slider"
                id="ligne-range"
                min="18"
                max="44"
                value={currentLigne}
                step="2"
                aria-label="Button Diameter in Lignes"
                onChange={(e) => setCurrentLigne(parseInt(e.target.value, 10))}
              />
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>44L</span>
            </div>
          </div>
        </div>

        {/* Real-Time Laser Engraving Simulator */}
        <div>
          <div className="control-section-header">
            <span className="control-title">Real-Time Laser Engraving</span>
            <span className="control-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {laserActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3344', display: 'inline-block', animation: 'pulse 1s infinite' }} />}
              CO₂ Laser Diode
            </span>
          </div>
          <div className="engrave-input-wrap">
            <input
              type="text"
              className="engrave-input"
              id="engrave-text-input"
              value={currentEngraving}
              maxLength={28}
              placeholder="Type Brand or Monogram to Engrave..."
              aria-label="Laser Engraving Text"
              onFocus={() => setLaserActive(true)}
              onBlur={() => setLaserActive(false)}
              onChange={(e) => {
                setLaserActive(true);
                setCurrentEngraving(e.target.value.toUpperCase());
                setTimeout(() => setLaserActive(false), 2000);
              }}
            />
          </div>
        </div>
      </div>

      {/* Telemetry Specs Footer */}
      <div className="studio-specs-footer">
        <div className="spec-cell">
          <span className="spec-key">Diameter</span>
          <span className="spec-val" id="spec-val-diameter">{currentLigne} L / {mmDiameter}mm</span>
        </div>
        <div className="spec-cell">
          <span className="spec-key">Structure</span>
          <span className="spec-val" id="spec-val-holes">
            {currentHoles === 1 ? 'Solid Loop Shank' : `${currentHoles}-Hole Tailor Stitch`}
          </span>
        </div>
        <div className="spec-cell">
          <span className="spec-key">Material</span>
          <span className="spec-val" id="spec-val-material">{activeCfg.type}</span>
        </div>
        <div className="spec-cell">
          <span className="spec-key">Ethical Origin</span>
          <span className="spec-val" id="spec-val-harvest">{activeCfg.harvest}</span>
        </div>
      </div>
    </div>
  );
}
