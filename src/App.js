import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
	const [data, setData] = useState();
	const [choosenStatistic, setChoosenStatistic] = useState("checked_anomalies");

	useEffect(() => {
		axios
			.get(
				"http://api.lukaszkusyk.pl/scp_strategy-analytics/GetHistoricalData.php"
			)
			.then((res) => {
				setData(res.data);
			});
	}, []);

	return (
		<div
			style={{
				textAlign: "center",
				margin: -8,
				padding: 5,
				height: "100vh",
				background:
					"linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(131,196,221,1) 70%, rgba(67,160,179,1) 100%)",
			}}
		>
			<header
				style={{
					textAlign: "center",
					color: "rgba(2,0,36,1)",
					fontSize: 25,
					"-webkit-text-stroke": ".6px white",
					textShadow: "0 0 20px #000",
				}}
			>
				<h1>SCP STRATEGY STATISTICS</h1>
			</header>
			{data ? (
				<div>
					<h2 style={{ color: "rgba(2,0,36,1)" }}>Pick stat you want to see</h2>
					<Select
						value={choosenStatistic}
						onChange={(event) => setChoosenStatistic(event.target.value)}
					>
						{data
							? Object.keys(data[0]).map((item, index) => {
									return item !== "date" ? (
										<MenuItem key={index} value={item}>
											{item}
										</MenuItem>
									) : null;
							  })
							: null}
					</Select>
				</div>
			) : (
				<CircularProgress />
			)}
			<div style={{ marginTop: 25 }}>
				<Plot
					data={[
						{
							x: ["15-03-2012", "22-03-2012", "30-03-2012"],
							y: [155, 123, 250],
							type: "scatter",
							mode: "lines+markers",
							marker: { color: "darkblue" },
							name: "scatterplot",
						},
					]}
					layout={{
						paper_bgcolor: "lightblue",
						plot_bgcolor: "lightblue",
						width: 500,
						height: 500,
						title: "A Dynamic Fancy Plot",
						xaxis: { title: "Date" },
						yaxis: { title: "Count" },
					}}
				/>
			</div>
		</div>
	);
}
