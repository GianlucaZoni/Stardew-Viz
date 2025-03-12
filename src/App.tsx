/* import { useEffect, useState } from "react" */
import "./App.css"
/* import { csv } from "d3" */
import { TableView } from "./data/TableView"

function App() {
  /* const filePath = "src/data/fish_detail.csv"
  const [data, setData] = useState<d3.DSVRowArray | null>()

  useEffect(() => {
    async function getData(filePath: string) {
      const data = await csv(filePath)
      setData(data)
    }

    getData(filePath)
  }, []) */

  return (
    <>
      <h1>Stardew Valley dataviz</h1>
      <TableView tableTitle="Fishes Wiki" filePath="src/data/fish_detail.csv" />
      <TableView tableTitle="Fishes Price" filePath="src/data/fish_price_breakdown.csv" />
    </>
  )
}

export default App
