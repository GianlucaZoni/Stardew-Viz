import { csv } from "d3";

export interface FishGoldPriceData {
    name: string,
    fishName: string,
    goldPrice: number
}

export interface FishDetailDatum {
    fishName: string,
    description: string,
    location: string,
    time: string,
    season: string,
    weather: string[],
    size: number,
    difficultyLevel: number,
    difficultyType: string
    xp: number,
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

export async function fetchLegendaryFishGoldPrice(): Promise<FishGoldPriceData[]> {
    const rawData = await csv("/legendary_fish_price_breakdown.csv")

    const cleanData = rawData.flatMap((row) => {
        const { Name, ...rest } = row
        const entries = Object.entries(rest)
        const cleanEntries = entries.map(([fishName, goldPrice]) => ({
            name: Name,
            fishName,
            goldPrice: parseInt(goldPrice.replace(/,/, ''))
        }))

        return cleanEntries
    })

    return cleanData
}

export async function fetchFishDetails(): Promise<FishDetailDatum[]> {
    const rawData = await csv("/fish_detail.csv")
    const cleanData = rawData.map(row => {

        const sizeString = row["Size (inches)"] || ""
        const sizeRange = row["Size (inches)"].split('-').map(num => parseInt(num.trim()))
        const size = sizeRange.length === 2 ? (sizeRange[0] + sizeRange[1]) / 2 : (parseInt(sizeString) ?? 0)

        // const difficulty = row["Difficulty & Behavior"].split(' ')
        // const difficultyLevel = difficulty ? parseInt(difficulty[0]) : 0
        // const difficultyType = difficulty ? difficulty[1].trim() : ""

        const [rawDifficultyLevel, rawDifficultyType = ""] = row["Difficulty & Behavior"].split(' ')
        const difficultyLevel = parseInt(rawDifficultyLevel || "0")
        const difficultyType = rawDifficultyType.trim()

        const weather = row["Weather"].split(' ')

        return {
            fishName: row.Name,
            description: row.Description,
            location: row.Location,
            time: row.Time,
            season: row.Season,
            weather,
            size,
            difficultyLevel,
            difficultyType,
            xp: parseInt(row["Base XP"] || "0")
        }
    })
    return cleanData
}
