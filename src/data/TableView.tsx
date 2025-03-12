import { csv } from "d3"
import { useEffect, useState } from "react"

interface TableViewProps {
  tableTitle: string
  filePath: string
}

export function TableView({ tableTitle, filePath }: TableViewProps) {
  /* const filePath = "src/data/fish_detail.csv" */
  const [data, setData] = useState<d3.DSVRowArray | null>()

  useEffect(() => {
    async function getData(filePath: string) {
      const data = await csv(filePath)
      setData(data)
    }

    getData(filePath)
  }, [])

  return (
    <>
      <h3>
        {tableTitle} entries: {data?.length ?? " counting fishes in the pond..."}
      </h3>
      <table>
        <thead>
          <tr>
            {data?.columns.map((d, i) => {
              return <th key={i}>{d}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {data?.map((d, i) => {
            return (
              <tr key={i}>
                {data?.columns.map((c, i) => {
                  return <td key={i}>{d[c]}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
