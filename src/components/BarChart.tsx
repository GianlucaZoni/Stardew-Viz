import { useEffect, useRef, useState } from "react"
import { fetchFishGoldPrice, FishGoldPriceData } from "../utils/api"
import * as d3 from "d3"

export function BarChart() {
  const [data, setData] = useState<FishGoldPriceData[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    fetchFishGoldPrice().then((res) => {
      console.table(res)
      setData(res)
    })
  }, [])

  // Rendering D3 Chart with useEffect
  useEffect(() => {
    if (!data.length || !svgRef.current) return

    // Clear any existing chart(?)
    d3.select(svgRef.current).selectAll("*").remove()

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 60, left: 60 }
    const width = 800 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    // Create SVG container: Wrapper + Bounds
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

    // Scale X and Y
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.2)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.goldPrice) || 0])
      .nice()
      .range([height, 0])

    // Create and append axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")

    svg.append("g").call(d3.axisLeft(y))

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .style("text-anchor", "middle")
      .text("Name")

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 15)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text("Gold Price")

    // Add rect bars + interaction
    svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name) || 0)
      .attr("y", (d) => y(d.goldPrice))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.goldPrice))
      .attr("fill", "#69b3a2")
      .on("mouseover", function () {
        d3.select(this).attr("fill", "#3e6b60")
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "#69b3a2")
      })
  }, [data])

  return (
    <div>
      <h2>Fish Gold Prices</h2>
      <svg ref={svgRef}></svg>
    </div>
  )
}
