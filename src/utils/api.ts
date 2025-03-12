import { csv } from "d3";

export interface FishGoldPriceData {
    name: string,
    fishName: string,
    goldPrice: number
}

export async function fetchFishGoldPrice(): Promise<FishGoldPriceData[]> {
    const rawData = await csv("/fish_price_breakdown.csv")

    const initial = rawData.flatMap((row) => {
        const { Name, ...rest } = row
        const entries = Object.entries(rest)
        //const newArray = entries.map((entry) => ({ fishName: entry[0], goldPrice: entry[1] }))

        const newNewArray = entries.map(([fishName, goldPrice]) => ({ name: Name, fishName, goldPrice: parseInt(goldPrice) }))

        return newNewArray
    })

    return initial
}
