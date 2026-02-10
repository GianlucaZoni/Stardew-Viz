/**
 * Stardew Valley-inspired theme constants for chart styling.
 * Warm, earthy tones paired with vibrant accents reminiscent of
 * the game's pixel-art aesthetic.
 */

// -- Core palette --
export const STARDEW_COLORS = {
  // Background tones
  parchment: "#FDF6E3",        // warm cream/parchment
  woodDark: "#5C3A1E",         // dark wood frame
  woodMedium: "#8B5E3C",       // medium wood
  woodLight: "#C4946A",        // lighter wood accent
  soilDark: "#3E2723",         // rich dark soil

  // Chart backgrounds
  fieldGreen: "#2D5A27",       // lush field green
  skyBlue: "#87CEEB",          // clear sky
  nightSky: "#1A1A2E",        // night background

  // Vibrant data colors (Stardew crop/item inspired)
  parsnipGold: "#FFD700",      // gold/parsnip yellow
  blueberryBlue: "#4169E1",    // blueberry
  cranberryRed: "#DC143C",     // cranberry red
  melonGreen: "#32CD32",       // melon green
  pumpkinOrange: "#FF8C00",    // pumpkin orange
  starfruitPurple: "#9B59B6",  // starfruit purple
  cauliflowerPink: "#FF69B4",  // fairy rose pink
  ancientFruitIndigo: "#4B0082", // ancient fruit

  // UI accents
  goldCoin: "#F5C542",         // gold coin yellow
  silverStar: "#C0C0C0",      // silver quality
  goldStar: "#FFD700",        // gold quality
  iridiumStar: "#B455D6",     // iridium quality

  // Text
  textDark: "#3E2723",        // dark brown text
  textLight: "#FDF6E3",       // cream text on dark bg
  textMuted: "#8B7355",       // muted brown

  // Grid/axis
  gridLine: "#C4946A55",      // semi-transparent wood
  axisLine: "#5C3A1E",        // dark wood axes
} as const

// -- Chart color scales (ordered for D3 ordinal scales) --
export const STARDEW_DATA_COLORS = [
  STARDEW_COLORS.parsnipGold,
  STARDEW_COLORS.blueberryBlue,
  STARDEW_COLORS.cranberryRed,
  STARDEW_COLORS.melonGreen,
  STARDEW_COLORS.pumpkinOrange,
  STARDEW_COLORS.starfruitPurple,
  STARDEW_COLORS.cauliflowerPink,
  STARDEW_COLORS.ancientFruitIndigo,
]

// -- Weather-mapped colors --
export const WEATHER_COLORS: Record<string, string> = {
  Any: STARDEW_COLORS.parsnipGold,
  Sun: STARDEW_COLORS.pumpkinOrange,
  Rain: STARDEW_COLORS.blueberryBlue,
  Wind: STARDEW_COLORS.silverStar,
}

// -- Season colors --
export const SEASON_COLORS: Record<string, string> = {
  spring: "#78C850",
  summer: "#F0C040",
  fall: "#C85028",
  winter: "#6890F0",
}

// -- SVG filter definitions for pixel / retro effects --
export function StardewDefs() {
  return (
    <defs>
      {/* Parchment texture noise */}
      <filter id="stardew-noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          type="saturate"
          values="0"
          in="noise"
          result="desaturatedNoise"
        />
        <feBlend
          in="SourceGraphic"
          in2="desaturatedNoise"
          mode="multiply"
          result="blended"
        />
        <feComponentTransfer in="blended">
          <feFuncA type="linear" slope="0.08" />
        </feComponentTransfer>
      </filter>

      {/* Drop shadow for cards/panels */}
      <filter id="stardew-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#3E2723" floodOpacity="0.35" />
      </filter>

      {/* Inner glow for chart area */}
      <filter id="stardew-inner-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feFlood floodColor="#FFD700" floodOpacity="0.08" result="glow" />
        <feComposite in="glow" in2="SourceGraphic" operator="in" result="innerGlow" />
        <feBlend in="SourceGraphic" in2="innerGlow" mode="screen" />
      </filter>

      {/* Wood grain pattern */}
      <pattern id="wood-grain" patternUnits="userSpaceOnUse" width="200" height="200">
        <rect width="200" height="200" fill={STARDEW_COLORS.woodMedium} />
        <line x1="0" y1="15" x2="200" y2="18" stroke={STARDEW_COLORS.woodDark} strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="40" x2="200" y2="38" stroke={STARDEW_COLORS.woodDark} strokeWidth="0.5" opacity="0.2" />
        <line x1="0" y1="65" x2="200" y2="67" stroke={STARDEW_COLORS.woodDark} strokeWidth="1" opacity="0.25" />
        <line x1="0" y1="90" x2="200" y2="88" stroke={STARDEW_COLORS.woodLight} strokeWidth="0.5" opacity="0.15" />
        <line x1="0" y1="115" x2="200" y2="117" stroke={STARDEW_COLORS.woodDark} strokeWidth="0.7" opacity="0.2" />
        <line x1="0" y1="140" x2="200" y2="138" stroke={STARDEW_COLORS.woodDark} strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="165" x2="200" y2="167" stroke={STARDEW_COLORS.woodLight} strokeWidth="0.5" opacity="0.15" />
        <line x1="0" y1="190" x2="200" y2="188" stroke={STARDEW_COLORS.woodDark} strokeWidth="0.7" opacity="0.2" />
      </pattern>

      {/* Pixel grid overlay */}
      <pattern id="pixel-grid" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="transparent" />
        <rect width="3" height="3" fill="transparent" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
      </pattern>
    </defs>
  )
}

// -- Shared chart frame component --
export interface ChartFrameProps {
  width: number
  height: number
  borderWidth?: number
  children?: React.ReactNode
}

export function ChartFrame({ width, height, borderWidth = 8, children }: ChartFrameProps) {
  return (
    <g>
      {/* Outer wood frame */}
      <rect
        x={-borderWidth}
        y={-borderWidth}
        width={width + borderWidth * 2}
        height={height + borderWidth * 2}
        fill="url(#wood-grain)"
        rx={4}
        ry={4}
      />
      {/* Inner border highlight */}
      <rect
        x={-borderWidth + 2}
        y={-borderWidth + 2}
        width={width + (borderWidth - 2) * 2}
        height={height + (borderWidth - 2) * 2}
        fill="none"
        stroke={STARDEW_COLORS.woodLight}
        strokeWidth={1}
        rx={3}
        ry={3}
        opacity={0.5}
      />
      {/* Inner parchment background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={STARDEW_COLORS.parchment}
        rx={2}
        ry={2}
      />
      {/* Subtle texture overlay */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="url(#pixel-grid)"
        rx={2}
        ry={2}
        opacity={0.4}
      />
      {/* Corner decorations */}
      <circle cx={-borderWidth + 4} cy={-borderWidth + 4} r={2.5} fill={STARDEW_COLORS.goldCoin} opacity={0.8} />
      <circle cx={width + borderWidth - 4} cy={-borderWidth + 4} r={2.5} fill={STARDEW_COLORS.goldCoin} opacity={0.8} />
      <circle cx={-borderWidth + 4} cy={height + borderWidth - 4} r={2.5} fill={STARDEW_COLORS.goldCoin} opacity={0.8} />
      <circle cx={width + borderWidth - 4} cy={height + borderWidth - 4} r={2.5} fill={STARDEW_COLORS.goldCoin} opacity={0.8} />
      {children}
    </g>
  )
}

// -- Stardew-style tooltip component --
export interface StardewTooltipProps {
  x: number
  y: number
  lines: string[]
  visible: boolean
}

export function StardewTooltip({ x, y, lines, visible }: StardewTooltipProps) {
  if (!visible) return null

  const lineHeight = 20
  const padding = 10
  const maxWidth = Math.max(...lines.map((l) => l.length * 8)) + padding * 2
  const height = lines.length * lineHeight + padding * 2

  return (
    <g transform={`translate(${x + 12}, ${y - 12})`} style={{ pointerEvents: "none" }}>
      {/* Shadow */}
      <rect
        x={2}
        y={2}
        width={maxWidth}
        height={height}
        rx={4}
        fill={STARDEW_COLORS.soilDark}
        opacity={0.4}
      />
      {/* Background */}
      <rect
        width={maxWidth}
        height={height}
        rx={4}
        fill={STARDEW_COLORS.woodDark}
        stroke={STARDEW_COLORS.goldCoin}
        strokeWidth={2}
      />
      {/* Inner highlight */}
      <rect
        x={2}
        y={2}
        width={maxWidth - 4}
        height={height - 4}
        rx={3}
        fill="none"
        stroke={STARDEW_COLORS.woodLight}
        strokeWidth={0.5}
        opacity={0.4}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={padding}
          y={padding + lineHeight * (i + 0.7)}
          fill={i === 0 ? STARDEW_COLORS.goldCoin : STARDEW_COLORS.textLight}
          fontSize={i === 0 ? 13 : 12}
          fontWeight={i === 0 ? "bold" : "normal"}
          fontFamily="'Press Start 2P', monospace"
          style={{ fontSize: i === 0 ? 11 : 10 }}
        >
          {line}
        </text>
      ))}
    </g>
  )
}
