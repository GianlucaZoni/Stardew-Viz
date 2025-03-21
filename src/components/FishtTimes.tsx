import { useEffect, useState } from "react"
import { fetchFishDetails, FishDetailDatum } from "../utils/api"
import { DebugLayout } from "./DebugLayout"
import { useControls } from "leva"
import { makeLayout } from "yogurt-layout"
import styles from "./FishTimes.module.css"
import {
  Bars,
  Cartesian,
  CartesianConsumer,
  Chart,
  computePos,
  Elements,
  Grid,
  Line,
  ScaleCategorical,
  Texts,
} from "react-composable-charts"
import * as d3 from "d3"

export function FishTimes() {
  const [data, setData] = useState<FishDetailDatum[]>([])

  useEffect(() => {
    fetchFishDetails().then((res) => {
      setData(res)
      console.table(res)
    })
  }, [])

  const { isDebug, width } = useControls("Time Availability", {
    isDebug: true,
    width: { value: 1600, min: 0, max: 3000, step: 1 },
  })

  const flattenedData = data.flatMap((fish) =>
    fish.time.map((timeRange) => ({
      fishName: fish.fishName,
      start: timeRange.start,
      end: timeRange.end,
      xp: fish.xp,
      hasMultipleTimeranges: fish.time.length > 1,
    }))
  )

  const layout = makeLayout({
    id: "root",
    direction: "row",
    width: width,
    height: 600,
    padding: {
      top: 32,
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

  const xDomain = data.map((d) => d.fishName)
  const yDomain = [24, 0]

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.fishName))
    .range([layout.chart.left, layout.chart.right])

  const xpScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.xp) || 0])
    .range([xScale.bandwidth(), 0])

  return (
    <>
      <div className={styles.wrappper}>
        <h2>Fishes Time Availability</h2>
        {data.length > 0 ? (
          <svg width={layout.root.width} height={layout.root.height}>
            <Chart
              width={layout.chart.width}
              height={layout.chart.height}
              top={layout.chart.top}
              left={layout.chart.left}
            >
              <Cartesian
                x={{ scale: "band", domain: xDomain, paddingInner: 0.1 }}
                y={{ scale: "linear", domain: yDomain }}
                nice={true}
              >
                <Grid>
                  {/* <Grid.XLines stroke="grey" /> */}
                  <Grid.YLines stroke="grey" />
                  <Grid.XAxes stroke="black" strokeWidth={2} />
                  <Grid.YAxes stroke="black" strokeWidth={2} />
                  <Grid.YLabels padding={5} />
                  <CartesianConsumer>
                    {({ xScale }) => (
                      <Texts
                        data={(xScale as ScaleCategorical).domain()}
                        x={(d) => computePos(d, xScale, "start")}
                        y={layout.xLabels.top + 16}
                        width={(d) => computePos(d, xScale, "end")}
                        textAnchor="end"
                        dominantBaseline="auto"
                        text={(d) => d}
                        transform={(d) =>
                          `rotate(-35, ${computePos(d, xScale, "end")}, ${layout.xLabels.top + 32})`
                        }
                      />
                    )}
                  </CartesianConsumer>
                </Grid>

                {/* bars width = bandwidth della scale band 
                    no xp involved */}
                {/* <Bars
                  data={flattenedData}
                  x-data={(d) => d.fishName}
                  y-data={{ to: 16, base: 14 }}
                  fill="green"
                  stroke={"white"}
                /> */}

                {/* bars width = bandwidth xDomain + xP */}
                <Bars
                  data={flattenedData}
                  x-data={(d) => d.fishName}
                  y-data={{ to: (d) => d.end, base: (d) => d.start }}
                  width={(d) => -xpScale(d.xp)}
                  fill={(d) => (d.hasMultipleTimeranges ? "red" : "#5e9dd0")}
                  rx={10}
                />

                {/* {data.map((d, i) => {
                  console.log(d)
                  return (
                    <Bars
                      key={i}
                      data={flattenedData}
                      x-data={(f) => f.fishName}
                      y-data={{ to: 6, base: 4 }}
                      width={xpScale(d.xp)}
                      fill="#e0b247"
                      stroke="white"
                    />
                  )
                })} */}
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
