import { csv } from "d3";

export interface FishGoldPriceData {
    name: string,
    fishName: string,
    goldPrice: number
}

export async function fetchFishGoldPrice(): Promise<FishGoldPriceData[]> {
    const rawData = await csv("/fish_price_breakdown.csv")

    const cleanData = rawData.flatMap((row) => {
        const { Name, ...rest } = row
        const entries = Object.entries(rest)
        const cleanEntries = entries.map(([fishName, goldPrice]) => ({ name: Name, fishName, goldPrice: parseInt(goldPrice.replace(/,/, '')) }))

        return cleanEntries
    })

    return cleanData
}
