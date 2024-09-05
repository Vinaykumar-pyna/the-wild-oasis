import styled from "styled-components";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import Heading from "../../ui/Heading.jsx";
import {useDarkMode} from "../../context/DarkModeContext.jsx";

const ChartBox = styled.div`
    background-color: var(--color-grey-0);
    border: 1px solid var(--color-grey-100);
    border-radius: var(--border-radius-md);

    padding: 2.4rem 3.2rem;
    grid-column: 3 / span 2;

    & > *:first-child {
        margin-bottom: 1.6rem;
    }

    & .recharts-pie-label-text {
        font-weight: 600;
    }
`;

const startDataLight = [
    {
        duration: "1 night",
        value: 0,
        color: "#ef4444",
    },
    {
        duration: "2 nights",
        value: 0,
        color: "#f97316",
    },
    {
        duration: "3 nights",
        value: 0,
        color: "#eab308",
    },
    {
        duration: "4-5 nights",
        value: 0,
        color: "#84cc16",
    },
    {
        duration: "6-7 nights",
        value: 0,
        color: "#22c55e",
    },
    {
        duration: "8-14 nights",
        value: 0,
        color: "#14b8a6",
    },
    {
        duration: "15-21 nights",
        value: 0,
        color: "#3b82f6",
    },
    {
        duration: "21+ nights",
        value: 0,
        color: "#a855f7",
    },
];

const startDataDark = [
    {
        duration: "1 night",
        value: 0,
        color: "#b91c1c",
    },
    {
        duration: "2 nights",
        value: 0,
        color: "#c2410c",
    },
    {
        duration: "3 nights",
        value: 0,
        color: "#a16207",
    },
    {
        duration: "4-5 nights",
        value: 0,
        color: "#4d7c0f",
    },
    {
        duration: "6-7 nights",
        value: 0,
        color: "#15803d",
    },
    {
        duration: "8-14 nights",
        value: 0,
        color: "#0f766e",
    },
    {
        duration: "15-21 nights",
        value: 0,
        color: "#1d4ed8",
    },
    {
        duration: "21+ nights",
        value: 0,
        color: "#7e22ce",
    },
];

function prepareData(startData, stays) {

    function incArrayValue(arr, field) {
        return arr.map((obj) =>
            obj.duration === field ? {...obj, value: obj.value + 1} : obj
        );
    }

    const data = stays
        .reduce((arr, cur) => {
            const num = cur.numNights;
            if (num === 1) return incArrayValue(arr, "1 night");
            if (num === 2) return incArrayValue(arr, "2 nights");
            if (num === 3) return incArrayValue(arr, "3 nights");
            if ([4, 5].includes(num)) return incArrayValue(arr, "4-5 nights");
            if ([6, 7].includes(num)) return incArrayValue(arr, "6-7 nights");
            if (num >= 8 && num <= 14) return incArrayValue(arr, "8-14 nights");
            if (num >= 15 && num <= 21) return incArrayValue(arr, "15-21 nights");
            if (num >= 21) return incArrayValue(arr, "21+ nights");
            return arr;
        }, startData)
        .filter((obj) => obj.value > 0);

    return data;
}

function DurationChart({confirmedStays}) {
    const {isDarkMode} = useDarkMode();
    const startData = isDarkMode ? startDataDark : startDataLight;
    const data = prepareData(startData, confirmedStays);
    return (
        <ChartBox>
            <Heading as="h2">Stay duration summary</Heading>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart> {/* This component from the `recharts` library renders a pie chart. It expects data in a specific format, which we create in the `prepareData` function. */}
                    <Pie data={data} // Array of objects representing data slices
                         nameKey="duration" // Name of the property used for slice labels
                         dataKey="value" // Name of the property used for slice values
                         innerRadius={85} // Radius of the inner circle (donut hole size)
                         outerRadius={110} // Radius of the outer circle
                         cx="40%" // X-coordinate of the center of the pie chart (relative to container) (40% from the left)
                         cy="50%" // Y-coordinate of the center of the pie chart (relative to container) (50% from the top)
                         paddingAngle={3} // Space between slices (3 degrees)
                    >
                        {data.map((entry) => <Cell fill={entry.color} stroke={entry.color}
                                                   key={entry.duration}/>)} {/* Iterate over the `data` array and render a `Cell` component for each entry. Each `Cell` component defines the color and stroke of a pie slice. The `key` prop is used for performance optimization by React. */}
                    </Pie>
                    <Tooltip/> {/* Tooltip component to display data on hover (from `recharts`) */}
                    <Legend verticalAlign="middle" // Vertical position of the legend (middle, top, bottom)
                            align="right" // Horizontal position of the legend (left, right)
                            width="30%" // Width of the legend relative to the chart
                            layout="vertical" // Orientation of the legend (vertical, horizontal)
                            iconSize={15} // Size of the legend icons
                            iconType="circle" // Shape of the legend icons (circle, square, etc.)
                    /> {/* Legend component to show slice labels (from `recharts`) */}
                </PieChart>
            </ResponsiveContainer>
        </ChartBox>
    )
}

export default DurationChart;