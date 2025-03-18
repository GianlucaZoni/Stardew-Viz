import "./App.css"
import { BarChart } from "./components/BarChart"
import { LegendaryFishPriceBarChart } from "./components/LegendaryFishPriceBarChart"
import { MultiLineChart } from "./components/MultiLineChart"
import { PriceAnalysisBarChart } from "./components/PriceAnalysisBarChart"
import { ScatterPlot } from "./components/ScatterPlot"

function App() {
  return (
    <>
      <div className="wrapper">
        <h1>Stardew Valley dataviz</h1>

        <ScatterPlot />
        <div className="spacer"></div>

        <LegendaryFishPriceBarChart />

        <div className="spacer"></div>

        <MultiLineChart />
        <div className="spacer"></div>
        <PriceAnalysisBarChart />
        <div className="spacer"></div>
        <BarChart />
        <div className="spacer"></div>

        {/* <TableView tableTitle="Fishes Wiki" filePath="src/data/fish_detail.csv" />
      <TableView tableTitle="Fishes Price" filePath="src/data/fish_price_breakdown.csv" /> */}
      </div>
    </>
  )
}

export default App
