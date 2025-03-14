import "./App.css"
import { BarChart } from "./components/BarChart"
import { PriceAnalysisBarChart } from "./components/PriceAnalysisBarChart"

function App() {
  return (
    <>
      <h1>Stardew Valley dataviz</h1>

      <PriceAnalysisBarChart fishSelected="Lionfish" />
      <BarChart />

      {/* <TableView tableTitle="Fishes Wiki" filePath="src/data/fish_detail.csv" />
      <TableView tableTitle="Fishes Price" filePath="src/data/fish_price_breakdown.csv" /> */}
    </>
  )
}

export default App
