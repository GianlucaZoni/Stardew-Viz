import "./App.css"
import { BarChart } from "./components/BarChart"
import { LegendaryFishPriceBarChart } from "./components/LegendaryFishPriceBarChart"
import { LineChart } from "./components/LineChart"
import { PriceAnalysisBarChart } from "./components/PriceAnalysisBarChart"

function App() {
  return (
    <>
      <h1>Stardew Valley dataviz</h1>

      <LegendaryFishPriceBarChart />

      <LineChart />
      <PriceAnalysisBarChart />
      <BarChart />

      {/* <TableView tableTitle="Fishes Wiki" filePath="src/data/fish_detail.csv" />
      <TableView tableTitle="Fishes Price" filePath="src/data/fish_price_breakdown.csv" /> */}
    </>
  )
}

export default App
