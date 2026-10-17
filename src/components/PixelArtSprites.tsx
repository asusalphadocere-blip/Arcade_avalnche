import React from 'react';

/**
 * PixelArtSprites: Crisp, scalable 8-bit SVG pixel art components
 * Using shape-rendering="crispEdges" for authentic retro arcade aesthetic.
 */

// 1. Pixel Art Avalanche Boss Gólem (32x32 grid)
export const PixelArtBoss: React.FC<{ isHit?: boolean; isDefeated?: boolean; className?: string }> = ({
  isHit = false,
  isDefeated = false,
  className = 'w-32 h-32 sm:w-40 sm:h-40',
}) => {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${className} transition-transform duration-150 ${
        isHit ? 'scale-95 filter brightness-150' : 'hover:scale-105'
      } ${isDefeated ? 'grayscale opacity-60' : ''}`}
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Background shadow */}
      <rect x="8" y="28" width="16" height="3" fill="#000000" opacity="0.4" />

      {/* Main Stone Body & Horns */}
      {/* Horns */}
      <rect x="5" y="3" width="3" height="4" fill="#E84142" />
      <rect x="4" y="4" width="2" height="6" fill="#B91C1C" />
      <rect x="24" y="3" width="3" height="4" fill="#E84142" />
      <rect x="26" y="4" width="2" height="6" fill="#B91C1C" />

      {/* Skull / Crown */}
      <rect x="8" y="5" width="16" height="4" fill="#334155" />
      <rect x="10" y="3" width="12" height="2" fill="#E84142" />
      <rect x="13" y="1" width="6" height="2" fill="#FCA5A5" />

      {/* Face Base */}
      <rect x="7" y="9" width="18" height="12" fill="#1E293B" />
      <rect x="6" y="11" width="20" height="8" fill="#1E293B" />

      {/* Molten Lava Cracks / Veins */}
      <rect x="9" y="11" width="2" height="5" fill="#EF4444" />
      <rect x="11" y="15" width="3" height="2" fill="#F87171" />
      <rect x="18" y="15" width="3" height="2" fill="#F87171" />
      <rect x="21" y="11" width="2" height="5" fill="#EF4444" />

      {/* Glowing Ruby Pixel Eyes */}
      <rect x="9" y="12" width="4" height="3" fill={isDefeated ? '#475569' : '#FFFFFF'} />
      <rect x="10" y="13" width="2" height="2" fill={isDefeated ? '#1E293B' : '#EF4444'} />
      <rect x="19" y="12" width="4" height="3" fill={isDefeated ? '#475569' : '#FFFFFF'} />
      <rect x="20" y="13" width="2" height="2" fill={isDefeated ? '#1E293B' : '#EF4444'} />

      {/* Menacing Jaw */}
      <rect x="10" y="19" width="12" height="4" fill="#0F172A" />
      {/* Teeth / Fangs */}
      <rect x="11" y="19" width="2" height="2" fill="#F8FAFC" />
      <rect x="15" y="19" width="2" height="2" fill="#F8FAFC" />
      <rect x="19" y="19" width="2" height="2" fill="#F8FAFC" />
      <rect x="13" y="21" width="2" height="2" fill="#F8FAFC" />
      <rect x="17" y="21" width="2" height="2" fill="#F8FAFC" />

      {/* Massive Shoulders & Spikes */}
      <rect x="2" y="13" width="4" height="8" fill="#334155" />
      <rect x="1" y="14" width="2" height="5" fill="#E84142" />
      <rect x="26" y="13" width="4" height="8" fill="#334155" />
      <rect x="29" y="14" width="2" height="5" fill="#E84142" />

      {/* Central Avalanche Crystal Core (Pulsing) */}
      <rect x="13" y="24" width="6" height="4" fill="#991B1B" />
      <rect x="14" y="23" width="4" height="6" fill="#E84142" />
      <rect x="15" y="24" width="2" height="4" fill="#FEF2F2" />

      {/* Floating Pixel Embers */}
      {!isDefeated && (
        <>
          <rect x="4" y="1" width="2" height="2" fill="#F59E0B" className="animate-pulse" />
          <rect x="27" y="2" width="2" height="2" fill="#EF4444" className="animate-pulse" />
          <rect x="1" y="8" width="1" height="2" fill="#F87171" />
          <rect x="30" y="9" width="2" height="1" fill="#F59E0B" />
        </>
      )}
    </svg>
  );
};

// 2. Pixel Art Warrior (Knight with Red Cloak & Sword)
export const PixelArtWarrior: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 16 16" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Helmet & Plume */}
    <rect x="6" y="1" width="4" height="2" fill="#EF4444" />
    <rect x="5" y="3" width="6" height="5" fill="#94A3B8" />
    <rect x="6" y="5" width="4" height="1" fill="#0F172A" />
    {/* Body Armor */}
    <rect x="5" y="8" width="6" height="5" fill="#64748B" />
    <rect x="4" y="8" width="1" height="5" fill="#DC2626" /> {/* Cloak */}
    <rect x="3" y="9" width="1" height="5" fill="#B91C1C" />
    {/* Sword */}
    <rect x="12" y="3" width="1" height="8" fill="#F8FAFC" />
    <rect x="11" y="4" width="1" height="6" fill="#CBD5E1" />
    <rect x="10" y="10" width="4" height="1" fill="#F59E0B" />
    <rect x="12" y="11" width="1" height="2" fill="#78350F" />
    {/* Legs */}
    <rect x="5" y="13" width="2" height="3" fill="#334155" />
    <rect x="9" y="13" width="2" height="3" fill="#334155" />
  </svg>
);

// 3. Pixel Art Mage (Teleporter / Combo Wizard)
export const PixelArtMage: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 16 16" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Wizard Hat */}
    <rect x="7" y="1" width="2" height="2" fill="#7C3AED" />
    <rect x="6" y="3" width="4" height="2" fill="#7C3AED" />
    <rect x="4" y="5" width="8" height="1" fill="#A855F7" />
    {/* Face & Beard */}
    <rect x="6" y="6" width="4" height="3" fill="#FED7AA" />
    <rect x="7" y="7" width="1" height="1" fill="#0F172A" />
    <rect x="9" y="7" width="1" height="1" fill="#0F172A" />
    <rect x="6" y="9" width="4" height="2" fill="#F1F5F9" />
    {/* Robe */}
    <rect x="5" y="9" width="6" height="6" fill="#6D28D9" />
    <rect x="7" y="10" width="2" height="5" fill="#C084FC" />
    {/* Staff & Crystal */}
    <rect x="2" y="3" width="2" height="2" fill="#06B6D4" />
    <rect x="3" y="5" width="1" height="10" fill="#78350F" />
  </svg>
);

// 4. Pixel Art Guardian (Shield Bearer)
export const PixelArtGuardian: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 16 16" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Helmet */}
    <rect x="6" y="2" width="5" height="5" fill="#0284C7" />
    <rect x="7" y="4" width="3" height="1" fill="#F8FAFC" />
    {/* Shield */}
    <rect x="2" y="6" width="4" height="8" fill="#E84142" />
    <rect x="3" y="7" width="2" height="6" fill="#F8FAFC" />
    <rect x="1" y="8" width="6" height="4" fill="#B91C1C" />
    {/* Body */}
    <rect x="7" y="7" width="5" height="6" fill="#38BDF8" />
    <rect x="8" y="13" width="2" height="3" fill="#0C4A6E" />
    <rect x="11" y="13" width="2" height="3" fill="#0C4A6E" />
  </svg>
);

// 5. Pixel Art Avalanche Gem / Token
export const PixelArtAvaxGem: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 16 16" className={className} style={{ shapeRendering: 'crispEdges' }}>
    <rect x="7" y="1" width="2" height="2" fill="#FCA5A5" />
    <rect x="5" y="3" width="6" height="2" fill="#EF4444" />
    <rect x="3" y="5" width="10" height="3" fill="#DC2626" />
    <rect x="5" y="8" width="6" height="3" fill="#B91C1C" />
    <rect x="6" y="11" width="4" height="2" fill="#991B1B" />
    <rect x="7" y="13" width="2" height="2" fill="#7F1D1D" />
    {/* Avalanche Triangle Core */}
    <rect x="7" y="4" width="2" height="1" fill="#FFFFFF" />
    <rect x="6" y="5" width="4" height="1" fill="#FFFFFF" />
    <rect x="5" y="6" width="6" height="1" fill="#FFFFFF" />
  </svg>
);

// 6. Pixel Art Soulbound Badge / Medal
export const PixelArtPoapMedal: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => (
  <svg viewBox="0 0 24 24" className={className} style={{ shapeRendering: 'crispEdges' }}>
    {/* Ribbon */}
    <rect x="7" y="1" width="4" height="6" fill="#E84142" />
    <rect x="13" y="1" width="4" height="6" fill="#B91C1C" />
    <rect x="9" y="4" width="6" height="3" fill="#F87171" />

    {/* Golden Outer Ring */}
    <rect x="5" y="7" width="14" height="14" fill="#F59E0B" />
    <rect x="4" y="9" width="16" height="10" fill="#F59E0B" />
    <rect x="6" y="8" width="12" height="12" fill="#D97706" />

    {/* Inner Red Core */}
    <rect x="7" y="9" width="10" height="10" fill="#0F172A" />
    <rect x="8" y="10" width="8" height="8" fill="#E84142" />

    {/* Center Avalanche Crest */}
    <rect x="11" y="12" width="2" height="1" fill="#FFFFFF" />
    <rect x="10" y="13" width="4" height="1" fill="#FFFFFF" />
    <rect x="9" y="14" width="6" height="1" fill="#FFFFFF" />
    <rect x="8" y="15" width="2" height="1" fill="#FFFFFF" />
    <rect x="14" y="15" width="2" height="1" fill="#FFFFFF" />
  </svg>
);
