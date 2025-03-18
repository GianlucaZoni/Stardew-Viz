import * as d3 from "d3"
import { useEffect, useState } from "react"
import { fetchFishGoldPrice, FishGoldPriceData } from "../utils/api"
import { useControls } from "leva"
import { DebugLayout } from "./DebugLayout"
import { makeLayout } from "yogurt-layout"
import styles from "./MultiLineChart.module.css"

export function MultiLineChart() {
  const [data, setData] = useState<FishGoldPriceData[]>([])

  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    fishName: string
    name: string
    goldPrice: number
  } | null>(null)

  useEffect(() => {
    fetchFishGoldPrice().then((res) => setData(res))
  }, [])

  const filteredData = data.filter((d) => d.fishName)
  const groupByFish = d3.group(filteredData, (d) => d.fishName)

  const { isDebug, xLabelsHeight, xLabelyOffSet } = useControls({
    isDebug: true,
    xLabelsHeight: { value: 140, min: 0, max: 1000, step: 1 },
    xLabelyOffSet: { value: 32, min: 0, max: 32, step: 1 },
  })

  const layout = makeLayout({
    id: "root",
    direction: "row",
    width: 800,
    height: 600,
    // padding: [16, 32, 128, 64],
    padding: {
      top: 64,
      right: 32,
    },
    children: [
      { id: "yLabels", width: 64 },
      {
        id: "chart-wrapper",

        direction: "column",
        children: [{ id: "chart" }, { id: "xLabels", height: xLabelsHeight }],
      },
    ],
  })

  const xScale = d3
    .scaleBand()
    .domain(filteredData.map((d) => d.name))
    .range([layout.chart.left, layout.chart.right])
    .padding(0.2)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.goldPrice) || 0])
    .range([layout.chart.bottom, layout.chart.top])
    .nice()

  const lineGenerator = d3
    .line<FishGoldPriceData>()
    .x((d) => xScale(d.name) ?? 0)
    .y((d) => yScale(d.goldPrice))
    .curve(d3.curveLinear)

  const colorScale = d3.scaleOrdinal(d3.schemeObservable10)

  const yTicks = yScale.ticks(20)

  const xLabelAngleScale = d3.scaleLinear().domain([78, 232]).range([0, -90]).clamp(true)
  const xLabelsAngle = xLabelAngleScale(xLabelsHeight)

  return (
    <>
      <div className={styles.wrapper}>
        <h2>MultiLine Fish Price Analysis</h2>
        <svg width={layout.root.width} height={layout.root.height}>
          {yTicks.map((d, i) => (
            <line
              key={`line-${i}`}
              x1={xScale.range()[0]}
              x2={xScale.range()[1]}
              y1={yScale(d)}
              y2={yScale(d)}
              stroke={d % 500 === 0 ? "grey" : "lightgrey"}
              strokeWidth={1}
            />
          ))}
          {yTicks.map((d, i) => (
            <text
              key={`yLabel-${i}`}
              x={xScale.range()[0] - 16}
              y={yScale(d)}
              textAnchor="end"
              dominantBaseline="middle"
              color="red"
            >
              {d}
            </text>
          ))}

          {xScale.domain().map((d, i) => (
            <g key={i}>
              <text
                x={(xScale(d) ?? 0) + xScale.bandwidth()}
                y={layout.xLabels.top + xLabelyOffSet / 2}
                textAnchor="end"
                transform={`rotate(${xLabelsAngle}, ${(xScale(d) || 0) + xScale.bandwidth()}, ${
                  layout.xLabels.top + xLabelyOffSet
                })`}
              >
                {d}
              </text>
            </g>
          ))}

          {Array.from(groupByFish).map(([fishName, fishData]) => {
            return (
              <g key={`fishGroup-${fishName}`} transform={`translate(${xScale.bandwidth() / 2})`}>
                <path
                  d={lineGenerator(fishData) ?? ""}
                  fill="none"
                  stroke={colorScale(fishName)}
                  strokeWidth={1.5}
                />
                {fishData.map((d, i) => (
                  <circle
                    key={`circle-${d}-${i}`}
                    cx={xScale(d.name) ?? 0}
                    cy={yScale(d.goldPrice)}
                    r={4}
                    fill={colorScale(fishName)}
                    stroke="white"
                    strokeWidth={1}
                    onMouseEnter={() => {
                      setTooltip({
                        visible: true,
                        x: (xScale(d.name) ?? 0) + xScale.bandwidth() / 2,
                        y: yScale(d.goldPrice),
                        fishName,
                        name: d.name,
                        goldPrice: d.goldPrice,
                      })
                    }}
                    onMouseLeave={() => {
                      setTooltip(null)
                    }}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </g>
            )
          })}

          {tooltip && tooltip.visible && (
            <g
              className={styles.tooltip}
              transform={`translate(${tooltip.x + 10}, ${tooltip.y - 10})`}
            >
              <rect
                x={0}
                y={0}
                width={210}
                height={75}
                rx={5}
                ry={5}
                fill="white"
                stroke="#ccc"
                strokeWidth={1}
                opacity={0.9}
              />
              <text x={10} y={20} fontWeight="bold">
                {tooltip.fishName}
              </text>
              <text x={10} y={40}>
                {tooltip.name}
              </text>
              <text x={10} y={60}>
                Price: {tooltip.goldPrice} gold
              </text>
            </g>
          )}

          {isDebug && <DebugLayout layout={layout} />}
        </svg>
      </div>
    </>
  )
}
