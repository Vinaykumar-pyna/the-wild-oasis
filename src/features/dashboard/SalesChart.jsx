import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../ui/Heading";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useDarkMode} from "../../context/DarkModeContext";
import {eachDayOfInterval, format, isSameDay, subDays} from "date-fns";

const StyledSalesChart = styled(DashboardBox)`
    grid-column: 1 / -1;

    & .recharts-cartesian-grid-horizontal line,
    & .recharts-cartesian-grid-vertical line {
        stroke: var(--color-grey-300);
    }
`;

/* const fakeData = [
    {label: "Jan 09", totalSales: 480, extrasSales: 20},
    {label: "Jan 10", totalSales: 580, extrasSales: 100},
    {label: "Jan 11", totalSales: 550, extrasSales: 150},
    {label: "Jan 12", totalSales: 600, extrasSales: 50},
    {label: "Jan 13", totalSales: 700, extrasSales: 150},
    {label: "Jan 14", totalSales: 800, extrasSales: 150},
    {label: "Jan 15", totalSales: 700, extrasSales: 200},
    {label: "Jan 16", totalSales: 650, extrasSales: 200},
    {label: "Jan 17", totalSales: 600, extrasSales: 300},
    {label: "Jan 18", totalSales: 550, extrasSales: 100},
    {label: "Jan 19", totalSales: 700, extrasSales: 100},
    {label: "Jan 20", totalSales: 800, extrasSales: 200},
    {label: "Jan 21", totalSales: 700, extrasSales: 100},
    {label: "Jan 22", totalSales: 810, extrasSales: 50},
    {label: "Jan 23", totalSales: 950, extrasSales: 250},
    {label: "Jan 24", totalSales: 970, extrasSales: 100},
    {label: "Jan 25", totalSales: 900, extrasSales: 200},
    {label: "Jan 26", totalSales: 950, extrasSales: 300},
    {label: "Jan 27", totalSales: 850, extrasSales: 200},
    {label: "Jan 28", totalSales: 900, extrasSales: 100},
    {label: "Jan 29", totalSales: 800, extrasSales: 300},
    {label: "Jan 30", totalSales: 950, extrasSales: 200},
    {label: "Jan 31", totalSales: 1100, extrasSales: 300},
    {label: "Feb 01", totalSales: 1200, extrasSales: 400},
    {label: "Feb 02", totalSales: 1250, extrasSales: 300},
    {label: "Feb 03", totalSales: 1400, extrasSales: 450},
    {label: "Feb 04", totalSales: 1500, extrasSales: 500},
    {label: "Feb 05", totalSales: 1400, extrasSales: 600},
    {label: "Feb 06", totalSales: 1450, extrasSales: 400},
]; */

// npm i recharts
function SalesChart({bookings, numDays}) {
    const {isDarkMode} = useDarkMode();
    const allDates = eachDayOfInterval({ // This function calculates an array of dates for a specified date range.
        start: subDays(new Date(), numDays - 1), // Here, we calculate the starting date for the interval. We use `subDays` to subtract the specified number of days (`numDays`) from today's date (`new Date()`). Note that we subtract `1` from `numDays` because the interval is inclusive of both the start and end dates.
        end: new Date(), // The ending date of the interval is simply today's date.
    });
    // console.log(allDates);
    const data = allDates.map((date) => {
        return {
            label: format(date, "MMM dd"), // This function formats the date object (`date`) according to the provided format string "MMM dd". This format displays the month in abbreviated format (e.g., "May") followed by the day of the month with two digits (e.g., "17").
            totalSales: bookings.filter((booking) => isSameDay(date, new Date(booking.created_at)))  // Filter bookings to include only those that occurred on the current date (`date`). We use `isSameDay` to compare the booking's `createdAt` property (which should be a date object) with the current date.
                .reduce((acc, cur) => acc + cur.totalPrice, 0), // Calculate the total sales for the current date. The `reduce` function iterates through the filtered bookings, adding each booking's `totalPrice` to the `accumulator`. The initial value of the `accumulator` is set to 0.
            extrasSales: bookings.filter((booking) => isSameDay(date, new Date(booking.created_at))) // Similar to `totalSales`, filter bookings for the current date.
                .reduce((acc, cur) => acc + cur.extrasPrice, 0) // Calculate the total sales from extras for the current date. Similar to `totalSales`, `reduce` iterates through filtered bookings, summing their `extrasPrice`.
        }
    });
    // console.log(data);
    const colors = isDarkMode
        ? {
            totalSales: {stroke: "#4f46e5", fill: "#4f46e5"},
            extrasSales: {stroke: "#22c55e", fill: "#22c55e"},
            text: "#e5e7eb",
            background: "#18212f",
        }
        : {
            totalSales: {stroke: "#4f46e5", fill: "#c7d2fe"},
            extrasSales: {stroke: "#16a34a", fill: "#dcfce7"},
            text: "#374151",
            background: "#fff",
        };
    return (
        <StyledSalesChart>
            <Heading as="h2">
                Sales from {format(allDates.at(0), 'MMM dd yyyy')} &mdash; {format(allDates.at(-1), 'MMM dd yyyy')}
            </Heading>
            <ResponsiveContainer height={300}
                                 width="100%"> {/* This `ResponsiveContainer` component from Recharts ensures the chart adapts to its container's width. It will take up the full width available (100%) and adjust its height to 300px. This prevents horizontal scrollbars when the chart is embedded in a smaller space. */}
                {/* <AreaChart data={fakeData}> */} {/* This is the main chart component, `AreaChart`, from Recharts. It renders an area chart to visualize our sales data. We provide the data using the `data` prop, which should be an array of objects (like `fakeData`). */}
                <AreaChart data={data}>
                    <XAxis dataKey="label" tick={{fill: colors.text}} tickLine={{stroke: colors.text}}/> {/* This configures the X-axis of the chart. The `dataKey` prop specifies which property from each data object should be used for the X-axis labels. In this case, it's the "label" property.
                    tick: This configures the appearance of individual X-axis labels (ticks).
                    fill: This property controls the color of the text within the tick labels. Here, it's set to `colors.text`, likely a color defined in our theme for consistent text rendering.
                    tickLine: This configures the appearance of the lines extending from the tick labels towards the chart area.
                    stroke: This property controls the color of the tick lines. Here, it's also set to `colors.text` for a unified look. */}
                    <YAxis unit="$" tick={{fill: colors.text}}
                           tickLine={{stroke: colors.text}}/> {/* This configures the Y-axis of the chart. The `unit` prop adds a dollar sign ($) next to the Y-axis labels, indicating the currency of the values. */}
                    <CartesianGrid
                        strokeDasharray="4"/> {/* This CartesianGrid adds a grid behind the chart for better readability. The `strokeDasharray` prop defines the style of the grid lines. Here, "4" creates a dashed line pattern. */}
                    <Tooltip contentStyle={{backgroundColor: colors.background}}/> {/* This Tooltip enables tooltips that appear when hovering over data points on the chart, displaying additional information.
                      contentStyle: This object allows us to style the tooltip container itself.
                      backgroundColor: This property sets the background color of the tooltip. Here, it's set to `colors.background`, likely a color defined in our theme for a visually appealing background. */}
                    {/* <Area dataKey="totalSales" type="monotone" stroke="red" fill="orange"/> */} {/* This Area defines the area we want to visualize in the chart. The `dataKey` prop specifies which property from each data object should be used for the Y-axis values (likely "totalSales" in our data). The `type` is set to "monotone" which creates a smoother area with a single color gradient. Finally, `stroke` and `fill` define the outline and fill color of the area, set to red and orange respectively. */}
                    <Area dataKey="totalSales" type="monotone" stroke={colors.totalSales.stroke}
                          fill={colors.totalSales.fill} strokeWidth={2} name="Total sales" unit="$"/> {/* strokeWidth: This property sets the thickness of the outline (stroke) for the area. Here, it's increased to 2 pixels for better visibility.
                          name: This property sets the name that appears in the tooltip when hovering over the area. Here, it's set to "Total Sales" for clarity.
                          unit: This property adds a unit label next to the data points in the tooltip, indicating the currency. Here, it's set to "$" for dollars. */}
                    <Area dataKey="extrasSales" type="monotone" stroke={colors.extrasSales.stroke}
                          fill={colors.extrasSales.fill} strokeWidth={2} name="Extras sales" unit="$"/>
                </AreaChart>
            </ResponsiveContainer>
        </StyledSalesChart>
    )
}

export default SalesChart;
