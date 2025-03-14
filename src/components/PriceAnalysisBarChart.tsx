import { useEffect, useState } from "react"
import { fetchFishGoldPrice, FishGoldPriceData } from "../utils/api"
import * as d3 from "d3"

interface GraphSetup {
  width: number
  height: number
  margin: { top: number; right: number; bottom: number; left: number }
}

export function PriceAnalysisBarChart() {
  const [data, setData] = useState<FishGoldPriceData[]>([])
  const [selectedFish, setSelectedFish] = useState("Anchovy")

  useEffect(() => {
    fetchFishGoldPrice().then((res) => {
      setData(res)
      //console.table(res.filter((d) => d.fishName === fishSelected))
    })
  }, [])

  const filteredData = data.filter((d) => d.fishName === selectedFish)
  //console.table(filteredData)

  const handleFishChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFish(e.target.value)
  }

  const graphSetup: GraphSetup = {
    margin: { top: 16, right: 32, bottom: 128, left: 64 },
    width: 800,
    height: 600,
  }

  const xScale = d3
    .scaleBand()
    .domain(filteredData.map((d) => d.name))
    .range([graphSetup.margin.left, graphSetup.width - graphSetup.margin.right])
    .padding(0.2)

  const yScale = d3
    .scaleLinear()
    //.domain([0, 1000])
    .domain([0, d3.max(data, (d) => d.goldPrice) || 0])
    .range([graphSetup.height - graphSetup.margin.bottom, graphSetup.margin.top])
    .nice()

  console.log(yScale.domain())

  //const xTicks = xScale.ticks()
  const yTicks50 = yScale.ticks(20)
  const yTicks100 = yScale.ticks(10)

  return (
    <div>
      <h2>Fish Gold Prices</h2>
      <h3>{selectedFish} price analysis</h3>
      <label htmlFor="fishSelect">Select Fish:</label>
      <select name="fishes" id="fishSelect" value={selectedFish} onChange={handleFishChange}>
        {data
          .map((d) => d.fishName)
          .map((fish, index) => (
            <option key={index} value={fish}>
              {fish}
            </option>
          ))}
      </select>
      <svg width={graphSetup.width} height={graphSetup.height} style={{ border: "1px solid red" }}>
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
            <text
              x={(xScale(d.name) ?? 0) + xScale.bandwidth()}
              y={yScale.range()[0] + 40}
              textAnchor="end"
              transform={`rotate(-30, ${(xScale(d.name) || 0) + xScale.bandwidth() / 2}, ${
                yScale.range()[0] + 32
              })`}
            >
              {d.name}
            </text>
          </g>
        ))}
        {yTicks100.map((d, i) => (
          <line
            key={i}
            x1={xScale.range()[0]}
            x2={xScale.range()[1]}
            y1={yScale(d)}
            y2={yScale(d)}
            stroke="grey"
            strokeWidth={1}
          />
        ))}
        {yTicks100.map((d) => (
          <text x={xScale.range()[0] - 16} y={yScale(d)} textAnchor="end" dominantBaseline="middle">
            {d}
          </text>
        ))}
        {yTicks50.map((d, i) => (
          <line
            key={i}
            x1={xScale.range()[0]}
            x2={xScale.range()[1]}
            y1={yScale(d)}
            y2={yScale(d)}
            stroke="lightgrey"
            strokeWidth={1}
          />
        ))}
        {yTicks50.map((d) => (
          <text
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
      </svg>
    </div>
  )
}
