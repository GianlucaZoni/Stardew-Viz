import { useEffect, useState } from "react"
import { fetchFishGoldPrice, FishGoldPriceData } from "../utils/api"
import * as d3 from "d3"
import { makeLayout } from "yogurt-layout"
import { DebugLayout } from "./DebugLayout"
import { useControls } from "leva"

export function PriceAnalysisBarChart() {
  const [data, setData] = useState<FishGoldPriceData[]>([])
  const [selectedFish, setSelectedFish] = useState("Anchovy")

  useEffect(() => {
    fetchFishGoldPrice().then((res) => {
      setData(res)
    })
  }, [])

  const filteredData = data.filter((d) => d.fishName === selectedFish)
  //console.table(filteredData)

  const handleFishChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFish(e.target.value)
  }
  /* const { isDebug, paddingTop, xLabelsHeight, xLabelsAngle } = useControls({
    isDebug: true,
    paddingTop: { value: 16, min: 0, max: 128, step: 1 },
    xLabelsHeight: { value: 128, min: 0, max: 1000, step: 1 },
    xLabelsAngle: { value: -30, min: -90, max: 90, step: 1 },
  }) */

  const { isDebug, paddingTop, xLabelsHeight } = useControls({
    isDebug: true,
    paddingTop: { value: 16, min: 0, max: 128, step: 1 },
    xLabelsHeight: { value: 128, min: 0, max: 1000, step: 1 },
  })

  const layout = makeLayout({
    id: "root",
    direction: "row",
    width: 800,
    height: 600,
    // padding: [16, 32, 128, 64],
    padding: {
      top: paddingTop,
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
    //.domain([0, 1000])
    .domain([0, d3.max(data, (d) => d.goldPrice) || 0])
    .range([layout.chart.bottom, layout.chart.top])
    .nice()

  //console.log(yScale.domain())

  const yTicks = yScale.ticks(20)

  const calculateXLabelsAngle = () => {
    if (xLabelsHeight > 232) return -90
    else if (xLabelsHeight < 78) return 0
    else {
      const ratio = (xLabelsHeight - (46 + 32)) / (232 - (46 + 32))
      return -(ratio * 90)
    }
  }

  const xLabelsAngle = calculateXLabelsAngle()

  return (
    <div>
      <h2>Fish Gold Prices</h2>
      <h3>{selectedFish} price analysis</h3>
      <label htmlFor="fishSelect">Select Fish:</label>
      <select name="fishes" id="fishSelect" value={selectedFish} onChange={handleFishChange}>
        {data.map(({ fishName }, index) => (
          <option key={index} value={fishName}>
            {fishName}
          </option>
        ))}
      </select>
      <svg width={layout.root.width} height={layout.root.height}>
        {filteredData.map((d, i) => (
          <g key={i}>
            <line
              x1={(xScale(d.name) ?? 0) + xScale.bandwidth() * 0.5}
              x2={(xScale(d.name) ?? 0) + xScale.bandwidth() * 0.5}
              y1={yScale.range()[0]}
              y2={yScale.range()[0] + 8}
              stroke="grey"
              strokeWidth={1}
            />
          </g>
        ))}

        {xScale.domain().map((d, i) => (
          <g key={i}>
            <text
              x={(xScale(d) ?? 0) + xScale.bandwidth()}
              y={layout.xLabels.top + 40}
              textAnchor="end"
              transform={`rotate(${xLabelsAngle}, ${(xScale(d) || 0) + xScale.bandwidth() / 2}, ${
                layout.xLabels.top + 32
              })`}
            >
              {d}
            </text>
          </g>
        ))}

        {yTicks.map((d, i) => (
          <line
            key={i}
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
            key={i}
            x={xScale.range()[0] - 16}
            y={yScale(d)}
            textAnchor="end"
            dominantBaseline="middle"
            color="red"
          >
            {d}
          </text>
        ))}

        {filteredData.map((d, i) => (
          <rect
            key={i}
            x={xScale(d.name)}
            y={yScale(d.goldPrice)}
            //width={xScale.bandwidth()}
            width={xScale.bandwidth()}
            height={yScale.range()[0] - yScale(d.goldPrice)}
            fill="#69b3a2"
            stroke="black"
          />
        ))}
        {isDebug && <DebugLayout layout={layout} />}
      </svg>
    </div>
  )
}
