import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import CircularProgress from "@mui/material/CircularProgress";

export default function App() {
	const [data, setData] = useState();
	const [choosenStatistic, setChoosenStatistic] = useState("checked_anomalies");
	const [yValues, setYValues] = useState([])
	const [xValues, setXValues] = useState([])
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()
	const [isDifference, setIsDifference] = useState(false)
	
	function generatePlot() {
		let tempY = []
		let tempX = []
		let tempYDifference = []

		for (var i = 1; i < data.length ; i++) {
			tempYDifference[i] = data[i][choosenStatistic] - data[i-1][choosenStatistic];
		}

		data.map((item) => 
		{		
			if(item.date >= startDate && item.date <= endDate){	
				tempY.push(item[choosenStatistic])
			}
			tempX.push(item.date)
		})

		tempX = tempX.filter((item) => item >= startDate && item <= endDate)

		tempYDifference[0] = 0;

		if(isDifference) {
			setYValues(tempYDifference)
		}
		else{
			setYValues(tempY)
		}

		setXValues(tempX)
		console.log(tempX)
		console.log(tempY)
	}

	useEffect(() => {
		axios
			.get(
				"https://api.lukaszkusyk.pl/scp_strategy-analytics/GetHistoricalData.php"
			)
			.then((res) => {
				setData(res.data);
				setStartDate('2022-05-04')
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
						<div style={{display:'flex'}}>
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
						<FormGroup sx={{margin: '0 auto', marginTop:1}}>
							<FormControlLabel control={<Checkbox value={isDifference} onChange={(e) => setIsDifference(!isDifference)} />} label="Check if you want to see difference between days" />
						</FormGroup>
						</div>
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
