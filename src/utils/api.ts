import { csv } from "d3";
import { chunk } from "lodash"

export interface FishGoldPriceData {
    name: string,
    fishName: string,
    goldPrice: number
}

export interface FishDetailDatum {
    fishName: string,
    description: string,
    location: string,
    time: TimeRange[],
    season: string,
    weather: string[],
    size: number,
    difficultyLevel: number,
    difficultyType: string
    xp: number,
}

export interface TimeRange {
    start: number,
    end: number
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

        const time = parseTimeRange(row["Time"])

        return {
            fishName: row.Name,
            description: row.Description,
            location: row.Location,
            time,
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

function parseTimeRange(timeString: string): TimeRange[] {
    if (timeString === "Anytime") {
        return [{ start: 0, end: 2 }, { start: 6, end: 24 }]
    }

    const timesStrings = [...timeString.matchAll((/\d+(am|pm)/g))].map(match => match[0])
    const times = timesStrings.map((str) => str.endsWith('pm') ? parseInt(str) + 12 : parseInt(str))

    const rawTimeRanges = chunk(times, 2)

    const timeRanges = rawTimeRanges.flatMap<TimeRange>(([start, end]) => {
        if (start === 24 && end >= 6) return [{ start: 0, end: 2 }, { start: 6, end }]
        else if (start <= 2 && end >= 6) return [{ start, end: 2 }, { start: 6, end }]
        else if (start <= end) return [{ start, end }]
        return [{ start, end: 24 }, { start: 0, end }]
    })

    console.log(timesStrings)
    console.log(times)

    return timeRanges
}