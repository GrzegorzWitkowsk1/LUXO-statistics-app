import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
	const [data, setData] = useState();
	const [choosenStatistic, setChoosenStatistic] = useState("checked_anomalies");
	const [yValues, setYValues] = useState([])
	const [xValues, setXValues] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	
	function generatePlot() {
		let tempY = []
		let tempX = []

		data.map((item) => 
		{			
			tempY.push(item[choosenStatistic])
			tempX.push(item.date)
		})
		tempX = tempX.filter((item) => item >= startDate && item <= endDate)
		console.log(tempX)
		setYValues(tempY)
		setXValues(tempX)
	}

	useEffect(() => {
		axios
			.get(
				"http://api.lukaszkusyk.pl/scp_strategy-analytics/GetHistoricalData.php"
			)
			.then((res) => {
				setData(res.data);
				setStartDate(res.data[0].date)
				setEndDate(res.data[res.data.length - 1].date)
			});
	}, []);

	return (
		<div 
		style={{
		display:'flex',				
		justifyContent:'center',
		margin: -8,
		minHeight:'100vh',
		padding: 5,
		background:
			"linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(131,196,221,1) 70%, rgba(67,160,179,1) 100%)",}}>
			<div style={{position:'relative', textAlign:'center'}}>
				<header
					style={{
						textAlign: "center",
						color: "rgba(2,0,36,1)",
						fontSize: 25,
						WebkitTextStroke: ".6px white",
						textShadow: "0 0 20px #000",
					}}
				>
					<h1>SCP STRATEGY STATISTICS</h1>
				</header>
				{data ? (
					<div>
						<h2 style={{ color: "rgba(2,0,36,1)" }}>Pick statistic, which you want to see</h2>
						<Select
							value={choosenStatistic}
							onChange={(e) => setChoosenStatistic(e.target.value)}
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
						<div style={{marginTop:10}}>
						<h2 style={{ color: "rgba(2,0,36,1)" }}>Pick the date range</h2>

							<TextField type='date' 
								InputProps={{
									inputProps: { 
										min: data[0].date ,
										max: data[data.length - 1].date
									} 
								}} 
									sx={{marginRight:5}} 
									value={startDate} 
									onChange={(e) => setStartDate(e.target.value)}
							/>
							<TextField 
								type='date'
								InputProps={{
									inputProps: {
										min: startDate,
										max: data[data.length - 1].date
									}
								}} 
								sx={{marginLeft:5}} 
								value={endDate} 
								onChange={(e) => setEndDate(e.target.value)}
							/>
							</div>
							<Button variant='contained' style={{marginTop:20}} onClick={() => generatePlot()}>Generate your plot</Button>
					</div>

				) : (
					<CircularProgress />
				)}
				<div style={{ marginBottom:50, marginTop:20 }}>
					{xValues.length > 0 && yValues.length > 0 ? <Plot
						data={[
							{
								x: xValues,
								y: yValues,
								type: "scatter",
								mode: "lines+markers",
								marker: { color: "darkblue" },
								name: "scatterplot",
							},
						]}
						layout={{
							paper_bgcolor: "transparent",
							plot_bgcolor: "lightblue",
							font: {
								color:'white'
							},
							width: 700,
							height: 700,
							title: `Statistics for ${choosenStatistic}`,
							xaxis: { title: "Date" },
							yaxis: { title: "Amount" },
						}}
					/> : null}
				</div>
			<div style={{position:'absolute', bottom:0, width:'100%'}}>
				<h5 style={{color:'white'}}>® 2022  LUXO Interactive. All rights reserved</h5>
			</div>
		</div>
	</div>
	);
}
