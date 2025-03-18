import { useEffect, useState } from "react"
import {
  fetchFishDetails,
  fetchFishGoldPrice,
  FishDetailDatum,
  FishGoldPriceData,
} from "../utils/api"
import styles from "./ScatterPlot.module.css"
import { makeLayout } from "yogurt-layout"
import { useControls } from "leva"
import { Cartesian, Chart } from "react-composable-charts"
import { DebugLayout } from "./DebugLayout"

export function ScatterPlot() {
  const [data, setData] = useState<FishDetailDatum[]>([])

  useEffect(() => {
    fetchFishDetails().then((res) => {
      setData(res)
      console.table(res)
    })
  }, [])

  //const filteredData = data.filter((d) => d.fishName)

  const { isDebug, xLabelsHeight } = useControls({
    isDebug: true,
    xLabelsHeight: { value: 140, min: 0, max: 1000, step: 1 },
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

  /* const xDomain= 

const yDomain= */

  return (
    <>
      <div className={styles.wrappper}>
        <h2>Scatterplot Fishing Rewards</h2>
        <div>
          <h3>filter coming soon</h3>
          <h3>select coming soon</h3>
        </div>
        <svg width={layout.root.width} height={layout.root.height}>
          <Chart
            width={layout.chart.width}
            height={layout.chart.height}
            top={layout.chart.top}
            left={layout.chart.left}
          >
            <Cartesian></Cartesian>
          </Chart>
          {isDebug && <DebugLayout layout={layout} />}
        </svg>
      </div>
    </>
  )
}
