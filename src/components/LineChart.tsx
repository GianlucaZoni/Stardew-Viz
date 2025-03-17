import * as d3 from "d3"
import { useEffect, useState } from "react"
import { fetchFishGoldPrice, FishGoldPriceData } from "../utils/api"
import { useControls } from "leva"
import { DebugLayout } from "./DebugLayout"
import { makeLayout } from "yogurt-layout"

export function LineChart() {
  const [data, setData] = useState<FishGoldPriceData[]>([])
  useEffect(() => {
    fetchFishGoldPrice().then((res) => setData(res))
  }, [])

  console.log(data)

  const filteredData = data.filter((d) => d.fishName)
  const groupByFish = d3.group(filteredData, (d) => d.fishName)

  console.log(filteredData)
  console.log(groupByFish)

  const { isDebug } = useControls({ isDebug: true })

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
        children: [{ id: "chart" }, { id: "xLabels", height: 128 }],
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

  return (
    <>
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

        {Array.from(groupByFish).map(([fishName, fishData]) => {
          return (
            <>
              <path
                key={`path-${fishName}`}
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
                />
              ))}
            </>
          )
        })}

        {isDebug && <DebugLayout layout={layout} />}
      </svg>
    </>
  )
}
