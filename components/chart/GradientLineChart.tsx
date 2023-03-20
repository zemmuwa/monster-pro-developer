import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import 'chart.js/auto'
import {
	ReactNode,
	RefObject,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { Line } from 'react-chartjs-2'
import rgba from '../../utils/theme/rgba'
import {
	ChartData,
	ChartOptions,
	ScatterDataPoint,
	ChartDataset,
} from 'chart.js'
import Stack from '@mui/material/Stack'

interface PropsGradientLineChart {
	title: string
	description: string
	height: string | number
	chart: {
		labels: string[]
		datasets: ChartDataset<'line', (number | ScatterDataPoint | null)[]>[]
	}
	loading?: boolean
	rightHeader?: ReactNode
}

function gradientChartLine(chart: any, color: string, opacity = 0.2) {
	const ctx = chart.getContext('2d')
	const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50)
	const primaryColor = rgba(color, opacity).toString()

	gradientStroke.addColorStop(1, primaryColor)
	gradientStroke.addColorStop(0.2, 'rgba(72, 72, 176, 0.0)')
	gradientStroke.addColorStop(0, 'rgba(203, 12, 159, 0)')

	return gradientStroke
}

const conf = {
	data: {
		labels: ['bla'],
		datasets: [],
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
			y: {
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
					color: '#b2b9bf',
					font: {
						size: 11,
						family: 'Open Sans',
						style: 'normal',
						lineHeight: 2,
					},
				},
			},
			x: {
				grid: {
					drawBorder: false,
					display: false,
					drawOnChartArea: false,
					drawTicks: false,
					borderDash: [5, 5],
				},
				ticks: {
					display: true,
					color: '#b2b9bf',
					padding: 20,
					font: {
						size: 11,
						family: 'Open Sans',
						style: 'normal',
						lineHeight: 2,
					},
				},
			},
		},
	},
}
const configs = (
	labels: string[],
	datasets: ChartDataset<'line', (number | ScatterDataPoint | null)[]>[]
) => {
	return { ...conf, data: { labels, datasets: [...datasets] } }
}
function GradientLineChart({
	title,
	description,
	height,
	chart,
	loading,
	rightHeader,
}: PropsGradientLineChart) {
	const chartRef = useRef<{ children: Array<any> }>(null)
	const [chartData, setChartData] = useState<{
		data?: ChartData<'line'>
		options?: ChartOptions<'line'>
	}>({})

	useEffect(() => {
		const chartDatasets = chart.datasets
			? chart.datasets.map((dataset) => ({
					...dataset,
					tension: 0.4,
					pointRadius: 0,
					borderWidth: 3,
					borderColor: dataset.borderColor,
					fill: true,
					maxBarThickness: 6,
					backgroundColor: gradientChartLine(
						chartRef.current?.children[0],
						dataset.backgroundColor as string
					),
			  }))
			: []
		configs(chart.labels || [], chartDatasets)
		// @ts-ignore: Unreachable code error
		setChartData(configs(chart.labels || [], chartDatasets))
	}, [chart])

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
						<Line
							data={chartData.data ?? { datasets: [], labels: [] }}
							options={chartData.options}
						/>
					</Box>
				),
				[chartData?.data, chartData?.options, height]
			)}
		</Box>
	)

	if (loading)
		return <Skeleton width="100%" height={height} variant="rounded" />
	else return title || description ? <Card>{renderChart}</Card> : renderChart
}

export default GradientLineChart
