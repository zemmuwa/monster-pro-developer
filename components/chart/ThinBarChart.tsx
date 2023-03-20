import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import 'chart.js/auto'
import { ReactNode, useMemo, useRef } from 'react'
import { Bar } from 'react-chartjs-2'
import Stack from '@mui/material/Stack'
import { DatasetChartOptions } from 'chart.js/auto'

interface PropsThinBarChart {
	title: string
	description: string
	height: string | number
	chart: {
		labels: string[]
		datasets: { label: string; data: number[] }
	}
	loading?: boolean
	rightHeader?: ReactNode
}

const conf = {
	data: {
		labels: [],
		datasets: [
			{
				label: '',
				tension: 0.4,
				borderWidth: 0,
				borderRadius: 4,
				borderSkipped: false,
				backgroundColor: 'white',
				data: [],
				maxBarThickness: 6,
			},
		],
	},

	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
		},
		interaction: {
			intersect: false,
			mode: 'index',
		},
		scales: {
			// y: {
			// 	grid: {
			// 		drawBorder: false,
			// 		display: false,
			// 		drawOnChartArea: false,
			// 		drawTicks: false,
			// 	},
			// 	ticks: {
			// 		display: false,
			// 	},
			// },
			// x: {
			// 	grid: {
			// 		drawBorder: false,
			// 		display: false,
			// 		drawOnChartArea: false,
			// 		drawTicks: false,
			// 	},
			// 	ticks: {
			// 		beginAtZero: true,
			// 		font: {
			// 			size: 12,
			// 			family: 'Open Sans',
			// 			style: 'normal',
			// 		},
			// 		color: '#9ca2b7',
			// 	},
			// },
			y: {
				grid: {
					drawBorder: false,
					display: false,
					drawOnChartArea: true,
					drawTicks: false,
					borderDash: [5, 5],
				},
				ticks: {
					display: true,
					padding: 10,
					color: '#9ca2b7',
				},
			},
			x: {
				grid: {
					drawBorder: false,
					display: true,
					drawOnChartArea: true,
					drawTicks: false,
					borderDash: [5, 5],
				},
				ticks: {
					display: true,
					padding: 10,
					color: '#9ca2b7',
				},
			},
		},
	},
}
// const configs = (
// 	datasets: { labels: string[]; datasets: { label: string; data: number[] } }
// ):typeof conf => {
// 	return { ...conf, data: { labels:datasets.labels as never[], datasets: [{ ...datasets,label:datasets.datasets.label,data:datasets.datasets.data }] } }
// }
function ThinBarChart({
	title,
	description,
	height,
	chart,
	loading,
	rightHeader,
}: PropsThinBarChart) {
	const { data, options } = configs(chart.labels || [], chart.datasets || {})
	const chartRef = useRef<{ children: Array<any> }>(null)

	const renderChart = (
		<Box p={2} borderRadius={'12px'}>
			{title || description ? (
				<Stack direction="row" alignItems="start">
					<Box mr="auto" px={description ? 1 : 0} pt={description ? 1 : 0}>
						{title && (
							<Box mb={1}>
								<Typography fontWeight={700} variant="body2">
									{title}
								</Typography>
							</Box>
						)}
						<Box mb={2}>
							<Typography
								component="div"
								variant="h4"
								fontWeight={400}
								color="grey.400"
							>
								{description}
							</Typography>
						</Box>
					</Box>
					{rightHeader}
				</Stack>
			) : null}
			{useMemo(
				() => (
					<Box ref={chartRef} sx={{ height }}>
						<Bar
							data={data}
							options={options as unknown as DatasetChartOptions<'bar'>}
						/>
					</Box>
				),
				[data, height, options]
			)}
		</Box>
	)

	if (loading)
		return <Skeleton width="100%" height={height} variant="rounded" />
	else return title || description ? <Card>{renderChart}</Card> : renderChart
}

export default ThinBarChart

function configs(
	labels: string[],
	datasets: { label: string; data: number[] }
) {
	return {
		data: {
			labels,
			datasets: [
				{
					label: datasets.label,
					tension: 0.4,
					borderWidth: 0,
					borderRadius: 4,
					borderSkipped: false,
					backgroundColor: '#E2E8F0',
					data: datasets.data,
					maxBarThickness: 6,
				},
			],
		},

		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			interaction: {
				intersect: false,
				mode: 'index',
			},
			scales: {
				// y: {
				// 	grid: {
				// 		drawBorder: false,
				// 		display: false,
				// 		drawOnChartArea: false,
				// 		drawTicks: false,
				// 	},
				// 	ticks: {
				// 		display: false,
				// 	},
				// },
				// x: {
				// 	grid: {
				// 		drawBorder: false,
				// 		display: false,
				// 		drawOnChartArea: false,
				// 		drawTicks: false,
				// 	},
				// 	ticks: {
				// 		beginAtZero: true,
				// 		font: {
				// 			size: 12,
				// 			family: 'Open Sans',
				// 			style: 'normal',
				// 		},
				// 		color: '#9ca2b7',
				// 	},
				// },
				y: {
					grid: {
						drawBorder: false,
						display: false,
						drawOnChartArea: true,
						drawTicks: false,
						borderDash: [5, 5],
					},
					ticks: {
						display: true,
						padding: 10,
						color: '#9ca2b7',
					},
				},
				x: {
					grid: {
						drawBorder: false,
						display: true,
						drawOnChartArea: true,
						drawTicks: false,
						borderDash: [5, 5],
					},
					ticks: {
						display: true,
						padding: 10,
						color: '#9ca2b7',
					},
				},
			},
		},
	}
}
