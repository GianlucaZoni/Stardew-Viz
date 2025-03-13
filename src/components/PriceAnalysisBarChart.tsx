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

  useEffect(() => {
    fetchFishGoldPrice().then((res) => {
      setData(res.filter((d) => d.fishName === "Pufferfish"))
      console.table(res.filter((d) => d.fishName === "Pufferfish"))
    })
  }, [])

  const graphSetup: GraphSetup = {
    margin: { top: 64, right: 32, bottom: 64, left: 32 },
    width: window.innerWidth - 64,
    height: window.innerHeight - 128,
  }

  const xScale = d3
    .scaleBand()
    //.domain(data.map((d) => d.fishName))
    .domain(data.map((d) => d.name))
    .range([0, graphSetup.width])
    .padding(0.2)

  const yScale = d3.scaleLinear().domain([0, 1000]).range([0, graphSetup.height])

  return (
    <div>
      <h2>Fish Gold Prices</h2>
      <h3>specific fish</h3>
      <svg width={graphSetup.width} height={graphSetup.height}>
        {data
          //.filter((d) => d.fishName === "pufferfish")
          .map((d, i) => (
            <rect
              key={i}
              x={xScale(d.name)}
              y={yScale(d.goldPrice)}
              //width={xScale.bandwidth()}
              width={xScale.bandwidth()}
              height={graphSetup.height - yScale(d.goldPrice)}
              fill="#69b3a2"
              stroke="black"
            />
          ))}
      </svg>
    </div>
  )
}
