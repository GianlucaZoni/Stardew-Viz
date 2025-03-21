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
        return [{ start: 0, end: 24 }]
    }

    const ranges: TimeRange[] = []

    // Normalize dashes and spaces
    const normalizedString = timeString.replace(/–/g, '-').replace(/\s+/g, ' ').trim()
    console.log(timeString)
    console.log(normalizedString)
    // Split the string by spaces that are not within a time range
    // This handles cases like "6am - 11am 7pm - 2am"
    const timeRangeStrings = normalizedString.split(/\s+(?=\d+(?:am|pm))/i)
    console.log(timeRangeStrings)
    //console.log(normalizedString)
    //console.log(timeRangeStrings)


    console.log("NEW REGEX", ([...timeString.matchAll((/\d+(am|pm)/g))].map(match => match[0])))
    const timesStrings = [...timeString.matchAll((/\d+(am|pm)/g))].map(match => match[0])
    const times = timesStrings.map((str) => str.endsWith('pm') ? parseInt(str) + 12 : parseInt(str))

    const rawTimeRanges = chunk(times, 2)

    const timeRanges = rawTimeRanges.flatMap<TimeRange>(([start, end]) => {
        if (start <= end) return [{ start, end }]
        return [{ start, end: 24 }, { start: 0, end }]
    })

    console.log(timesStrings)
    console.log(times)

    return timeRanges
    // for (const rangeStr of timeRangeStrings) {
    //     // Extract the start and end times using a simpler approach
    //     const parts = rangeStr.split('-').map(s => s.trim());

    //     if (parts.length === 2) {
    //         const startTime = convertTo24Hour(parts[0]);
    //         let endTime = convertTo24Hour(parts[1]);

    //         // Handle time ranges that span across midnight
    //         if (endTime < startTime) {
    //             endTime += 24;
    //         }

    //         ranges.push({ start: startTime, end: endTime });
    //     }
    // }

    // return ranges
}

function convertTo24Hour(timeString: string): number {
    const match = timeString.match(/(\d+)(am|pm)/i)
    if (!match) return 0

    let hours = parseInt(match[1])
    const isPM = timeString.includes('pm')
    const isAM = timeString.includes('am')

    if (isPM && hours < 12) {
        hours += 12;
    } else if (isAM && hours === 12) {
        hours = 0;
    }

    return hours
}