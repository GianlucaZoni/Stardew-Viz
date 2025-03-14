import { LayoutBlock } from "yogurt-layout"

export type DebugLayoutProps = {
  layout: Record<string, LayoutBlock>
  color?: string
  strokeTextColor?: string
}

export const DebugLayout = ({
  layout,
  color = "red",
  strokeTextColor = "white",
}: DebugLayoutProps) => {
  return (
    <>
      {Object.entries(layout).map(([id, block]) => (
        <g key={id}>
          <rect
            x={block.left}
            y={block.top}
            width={block.width}
            height={block.height}
            fill="none"
            stroke={color}
            strokeWidth={1}
          />
          <text
            x={block.left}
            y={block.top + 8}
            fill={strokeTextColor}
            fontSize={10}
            strokeWidth={2}
            stroke={strokeTextColor}
            textAnchor="start"
          >
            {id}
          </text>
          <text x={block.left} y={block.top + 8} fill={color} fontSize={10} textAnchor="start">
            {id}
          </text>
        </g>
      ))}
    </>
  )
}
