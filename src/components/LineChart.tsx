import { useEffect } from "react"
import { fetchFishGoldPrice } from "../utils/api"

export function LineChart() {
  useEffect(() => {
    fetchFishGoldPrice().then((res) => console.table(res))
    }
}

