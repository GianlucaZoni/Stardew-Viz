import * as d3 from "d3"
import { useEffect, useState } from "react"
import { fetchLegendaryFishGoldPrice, FishGoldPriceData } from "../utils/api"
import { useControls } from "leva"
import { DebugLayout } from "./DebugLayout"
import { makeLayout } from "yogurt-layout"
import {
  Bars,
  Cartesian,
  CartesianConsumer,
  Chart,
  Circles,
  computePos,
  Grid,
  Line,
  ScaleCategorical,
  Texts,
} from "react-composable-charts"
import styles from "./LegendaryFishPriceBarChart.module.css"

export function LegendaryFishPriceBarChart() {
  const [data, setData] = useState<FishGoldPriceData[]>([])
  const [selectedFish, setSelectedFish] = useState("Angler")

  useEffect(() => {
    fetchLegendaryFishGoldPrice().then((res) => {
      setData(res)
      //console.table(res)
    })
  }, [])

  const filteredData = data.filter((d) => d.fishName === selectedFish)

  const handleFishChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFish(e.target.value)
  }

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
      top: 32,
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

  const xDomain = filteredData.map((d) => d.name)

  const yDomain = [0, d3.max(data, (d) => d.goldPrice) || 0] as [number, number]

  /*  const xLabelScale = d3
    .scaleBand()
    .domain(xDomain)
    .range([layout.chart.left, layout.chart.right])
    .padding(0.2) */

  const xLabelAngleScale = d3.scaleLinear().domain([78, 232]).range([0, -90]).clamp(true)

  const xLabelsAngle = xLabelAngleScale(xLabelsHeight)

  return (
    <>
      <div className={styles.wrapper}>
        <h2>Legendary Fishes Price Breakdown</h2>
        <h3>{selectedFish} price analysis</h3>

        <label htmlFor="legendaryFishSelect">Select Legendary Fish:</label>
        <select
          name="fishes"
          id="legendaryFishSelect"
          value={selectedFish}
          onChange={handleFishChange}
        >
          {Array.from(new Set(data.map((item) => item.fishName))).map((fishName) => (
            <option key={fishName} value={fishName}>
              {fishName}
            </option>
          ))}
        </select>

        {data.length > 0 ? (
          <svg width={layout.root.width} height={layout.root.height}>
            <Chart
              width={layout.chart.width}
              height={layout.chart.height}
              top={layout.chart.top}
              left={layout.chart.left}
            >
              <Cartesian
                x={{ scale: "band", domain: xDomain, padding: 0.2 }}
                y={{ scale: "linear", domain: yDomain }}
                nice="y"
              >
                <Grid>
                  <Grid.YLines stroke="grey" />
                  <Grid.YLabels padding={5} />
                  <CartesianConsumer>
                    {({ xScale }) => (
                      <Texts
                        data={(xScale as ScaleCategorical).domain()}
                        x={(d) => computePos(d, xScale, "end")}
                        y={layout.xLabels.top + xLabelyOffSet / 2}
                        textAnchor="end"
                        dominantBaseline="auto"
                        text={(d) => d}
                        transform={(d) =>
                          `rotate(${xLabelsAngle}, ${computePos(d, xScale, "end")}, ${
                            layout.xLabels.top + xLabelyOffSet
                          })`
                        }
                      />
                    )}
                  </CartesianConsumer>
                </Grid>

                <Bars
                  data={filteredData}
                  x-data={(d) => d.name}
                  y-data={{ to: (d) => d.goldPrice, base: 0 }}
                  fill="#6bc2be"
                />
                <Line
                  data={filteredData}
                  x-data={(d) => d.name}
                  y-data={(d) => d.goldPrice}
                  stroke="#941acd"
                  strokeWidth={2}
                  curve="monotone-x"
                />
                <Circles
                  data={filteredData}
                  x-data={(d) => d.name}
                  y-data={(d) => d.goldPrice}
                  fill="#941acd"
                  stroke="white"
                  r={4}
                />

                <Grid>
                  <Grid.XAxes stroke="black" strokeWidth={2} />
                  <Grid.YAxes stroke="black" strokeWidth={2} />
                </Grid>
              </Cartesian>
            </Chart>
            {isDebug && <DebugLayout layout={layout} />}
          </svg>
        ) : (
          <h3>pondering the pond...</h3>
        )}
      </div>
    </>
  )
}
