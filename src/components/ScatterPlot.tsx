import * as d3 from "d3"
import { useEffect, useState } from "react"
import { fetchFishDetails, FishDetailDatum } from "../utils/api"
import styles from "./ScatterPlot.module.css"
import { makeLayout } from "yogurt-layout"
import { useControls } from "leva"
import { Cartesian, Chart, Grid, Rects } from "react-composable-charts"
import { DebugLayout } from "./DebugLayout"
import { STARDEW_COLORS, WEATHER_COLORS, StardewDefs, ChartFrame } from "../utils/stardewTheme"

type YAxis = "size" | "difficultyLevel" | "doubledSize"

const isDoubleSizeKey = (key: YAxis): key is "doubledSize" => key === "doubledSize"

export function ScatterPlot() {
  const [data, setData] = useState<FishDetailDatum[]>([])
  const [selectedYAxis, setSelectedYAxis] = useState<YAxis>("size")
  //const [selectedSeason, setSelectedSeason] = useState<Season>("allSeasons")

  useEffect(() => {
    fetchFishDetails().then((res) => {
      setData(res)
      //console.table(res)
    })
  }, [])

  /* const seasonedData = data.filter(
    (d) => d.season === selectedSeason
     {
    selectedSeason === "allSeasons" ? true : d.season?.includes(selectedSeason)
  }
  ) */

  //const filteredData = data.filter((d) => d.fishName)

  const { isDebug, xLabelsHeight } = useControls("Scatterplot Fishing Rewards", {
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

  const weatherDomain = Array.from(new Set(data.flatMap((d) => d.weather)))
  const colorScale = d3
    .scaleOrdinal<string>()
    .domain(weatherDomain)
    .range(weatherDomain.map((w) => WEATHER_COLORS[w] || STARDEW_COLORS.woodMedium))

  const handleYAxisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYAxis(e.target.value as YAxis)
  }

  /* const handleSeasonChange = (season: Season) => {
    setSelectedSeason(selectedSeason !== season ? season : "allSeasons")
    //setSelectedSeason(selectedSeason === season ? "allSeason" : season)
  } */

  return (
    <>
      <div className={styles.wrapper}>
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
            <StardewDefs />
            <g transform={`translate(${0}, ${0})`}>
              <ChartFrame width={layout.root.width} height={layout.root.height} borderWidth={10} />
            </g>
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
                  <Grid.XLines stroke={STARDEW_COLORS.gridLine} />
                  <Grid.YLines stroke={STARDEW_COLORS.gridLine} />
                  <Grid.XAxes stroke={STARDEW_COLORS.axisLine} strokeWidth={2} />
                  <Grid.YAxes stroke={STARDEW_COLORS.axisLine} strokeWidth={2} />
                  <Grid.XLabels padding={5} />
                  <Grid.YLabels padding={5} />
                </Grid>

                <Rects
                  data={data}
                  x-data={(d) => d.xp}
                  y-data={getYValue}
                  width={16}
                  height={16}
                  x={-8}
                  y={-8}
                  rx={2}
                  fill={(d) => {
                    return colorScale(d.weather[0]) as string
                  }}
                  stroke={STARDEW_COLORS.woodDark}
                  strokeWidth={1.5}
                  opacity={0.85}
                />
              </Cartesian>
            </Chart>
            {/* Weather legend */}
            <g transform={`translate(${layout.root.width - 160}, ${layout.root.height - 100})`}>
              <rect x={-8} y={-8} width={148} height={weatherDomain.length * 22 + 16} rx={4} fill={STARDEW_COLORS.parchment} stroke={STARDEW_COLORS.woodMedium} strokeWidth={1.5} opacity={0.95} />
              {weatherDomain.map((w, i) => (
                <g key={w} transform={`translate(0, ${i * 22})`}>
                  <rect x={0} y={0} width={12} height={12} rx={2} fill={WEATHER_COLORS[w] || STARDEW_COLORS.woodMedium} stroke={STARDEW_COLORS.woodDark} strokeWidth={1} />
                  <text x={18} y={10} fontSize={14} fill={STARDEW_COLORS.textDark} fontFamily="'VT323', monospace">{w}</text>
                </g>
              ))}
            </g>
            {isDebug && <DebugLayout layout={layout} />}
          </svg>
        ) : (
          <h3>pondering the pond...</h3>
        )}
      </div>
    </>
  )
}
