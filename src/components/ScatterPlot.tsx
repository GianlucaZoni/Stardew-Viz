import * as d3 from "d3"
import { useEffect, useState } from "react"
import { fetchFishDetails, FishDetailDatum } from "../utils/api"
import styles from "./ScatterPlot.module.css"
import { makeLayout } from "yogurt-layout"
import { useControls } from "leva"
import { Cartesian, Chart, Grid, Rects } from "react-composable-charts"
import { DebugLayout } from "./DebugLayout"
import { Season } from "../utils/types"

type YAxis = "size" | "difficultyLevel" | "doubledSize"

const isDoubleSizeKey = (key: YAxis): key is "doubledSize" => key === "doubledSize"

export function ScatterPlot() {
  const [data, setData] = useState<FishDetailDatum[]>([])
  const [selectedYAxis, setSelectedYAxis] = useState<YAxis>("size")
  const [selectedSeason, setSelectedSeason] = useState<Season>("allSeasons")

  useEffect(() => {
    fetchFishDetails().then((res) => {
      setData(res)
      console.table(res)
    })
  }, [])

  const seasonedData = data.filter(
    (d) => d.season === selectedSeason
    /* {
    selectedSeason === "allSeasons" ? true : d.season?.includes(selectedSeason)
  } */
  )

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

  const getYValue = (d: FishDetailDatum) => {
    if (isDoubleSizeKey(selectedYAxis)) {
      return d.size * 2
    }

    return d[selectedYAxis]
  }

  const xDomain = d3.extent(data, (d) => d.xp) as [number, number]

  const yDomain = d3.extent(data, getYValue) as [number, number]

  //const colorScale = d3.scaleOrdinal().domain(data.filter((d)=>d.season)).range(["grey","green","orange","brown","blue"])
  const colorScale = d3.scaleOrdinal(d3.schemeObservable10)

  const handleYAxisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYAxis(e.target.value as YAxis)
  }

  /* const handleSeasonChange = (season: Season) => {
    setSelectedSeason(selectedSeason !== season ? season : "allSeasons")
    //setSelectedSeason(selectedSeason === season ? "allSeason" : season)
  } */

  return (
    <>
      <div className={styles.wrappper}>
        <h2>Scatterplot Fishing Rewards</h2>
        <div className={styles.filters}>
          <div className="selector">
            <label htmlFor="selectYaxis">Select Y Axis:</label>
            <select
              name="dataYaxis"
              id="selectYaxis"
              value={selectedYAxis}
              onChange={handleYAxisChange}
            >
              <option value="size">Size</option>
              <option value="doubledSize">DoubleSize</option>
              <option value="difficultyLevel">Difficulty</option>
            </select>
          </div>
          {/* <div className="filterSeason">
            <button
              onClick={() => handleSeasonChange("spring")}
              className={selectedSeason === "spring" ? styles.active : ""}
            >
              Spring
            </button>
            <button
              onClick={() => handleSeasonChange("summer")}
              className={selectedSeason === "summer" ? styles.active : ""}
            >
              Summer
            </button>
            <button
              onClick={() => handleSeasonChange("fall")}
              className={selectedSeason === "fall" ? styles.active : ""}
            >
              Fall
            </button>
            <button
              onClick={() => handleSeasonChange("winter")}
              className={selectedSeason === "winter" ? styles.active : ""}
            >
              Winter
            </button>
          </div> */}
        </div>
        {data.length > 0 ? (
          <svg width={layout.root.width} height={layout.root.height}>
            <Chart
              width={layout.chart.width}
              height={layout.chart.height}
              top={layout.chart.top}
              left={layout.chart.left}
            >
              <Cartesian
                x={{ scale: "linear", domain: xDomain }}
                y={{ scale: "linear", domain: yDomain }}
                nice
              >
                <Grid>
                  <Grid.XLines stroke="grey" />
                  <Grid.YLines stroke="grey" />
                  <Grid.XAxes stroke="black" strokeWidth={2} />
                  <Grid.YAxes stroke="black" strokeWidth={2} />
                  <Grid.XLabels padding={5} />
                  <Grid.YLabels padding={5} />
                </Grid>

                <Rects
                  data={data}
                  x-data={(d) => d.xp}
                  y-data={getYValue}
                  width={20}
                  height={20}
                  x={-10}
                  y={-10}
                  rx={5}
                  fill={(d) => colorScale(d.season)}
                />
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
