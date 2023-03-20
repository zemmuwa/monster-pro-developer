import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { AppBarProviderContext } from '../../../components/appbar/DefaultAppBar'
import CompanyLeftToolbar from '../../../components/appbar/left-toolbar/CompanyLeftToolbar'
import DashboardBlackCard from '../../../components/card/DashboardBlackCard'
import GradientLineChart from '../../../components/chart/GradientLineChart'
import ThinBarChart from '../../../components/chart/ThinBarChart'
import HouseIcon from '../../../components/icons/HouseIcon'
import CustomSkeleton from '../../../components/skeleton/CustomSkeleton'
import useMenuAppbar from '../../../hooks/useMenuAppbar'
import { ToastProviderContext } from '../../../providers/ToastProvider'
import useFetch from '../../../hooks/useFetch'
import ENDPOINTS from '../../../utils/constants/endpoints'
import { IDeveloperGet } from '../../../interfaces/interfaceApiDeveloper'
import helper from '../../../utils/helper'
import { formatNumber } from '../../../utils/number'
import { IProjectCountGet } from '../../../interfaces/interfaceApiProjectCount'
import RegisteredProjectIcon from '../../../components/icons/RegisteredProjectIcon'
import TypeUnitIcon from '../../../components/icons/TypeUnitIcon'
import StockUnitIcon from '../../../components/icons/StockUnitIcon'
import TrxActiveIcon from '../../../components/icons/TrxActiveIcon'
import SoldUnitIcon from '../../../components/icons/SoldUnitIcon'
import WalletIcon from '../../../components/icons/WalletIcon'
import ComingSoonCard from '../../../components/card/ComingSoonCard'
import { ITotalVisitor } from '../../../interfaces/interfaceApiTotalVisitor'
import ConsumeApi from '../../../utils/consume-api/ConsumeApi'
import { IApiResponseError } from '../../../interfaces/interfaceApiResponse'

const thinBarChartData = {
	labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
	datasets: {
		label: 'Watts',
		data: [150, 230, 380, 220, 420, 200, 70, 500],
	},
}
const gradientLineChartData = {
	labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	datasets: [
		{
			label: 'Mobile apps',
			backgroundColor: '#252f40',
			borderColor: '#252f40',
			data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
		},
	],
}
const Developer: NextPage = () => {
	const { setCompanyApp, setLoading } = useMenuAppbar()
	const router = useRouter()
	const { openToast } = useContext(ToastProviderContext)
	const copyToClipboard = (value: string) => {
		navigator.clipboard.writeText(value)
		openToast(true, 'success', 'Kode Referal Tersalin')
	}

	const [totalVisitor, setTotalVisitor] = useState<ITotalVisitor[]>([])
	const [totalVisitorCount, setTotalVisitorCount] = useState(0)
	const [loadingVisitor, setLoadingVisitor] = useState(true)
	const [typeVisitor, setTypeVisitor] = useState<'MONTH' | 'WEEK'>('MONTH')
	const getTotalVisitor = async () => {
		setLoadingVisitor(true)
		try {
			const res = await ConsumeApi<ITotalVisitor[] | IApiResponseError>(
				ENDPOINTS.DEVELOPER_VISITOR +
					(`/${router.query.id}?date=${typeVisitor}` ?? ''),
				'GET',
				undefined,
				process.env.NEXT_PUBLIC_DEVELOPER_PATH
			)
			if (Array.isArray(res)) {
				setTotalVisitor(res)
				setTotalVisitorCount(
					res.reduce((accumulator, object) => accumulator + object.total, 0)
				)
			}
		} catch (error) {
			setTotalVisitor([])
			setTotalVisitorCount(0)
		}
		setLoadingVisitor(false)
	}

	const generateDataVisitor = () => {
		return {
			labels: [...totalVisitor.map((v) => v.date)],
			datasets: {
				label: 'Pengunjung',
				data: [...totalVisitor.map((v) => v.total)],
			},
		}
	}
	useEffect(() => {
		if (router.query.id) {
			getTotalVisitor()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id, typeVisitor])

	const {
		dataSingle: developerData,
		loading: developerLoading,
		getOne: developerGetOne,
	} = useFetch<IDeveloperGet>(
		ENDPOINTS.DEVELOPER,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	const {
		dataSingle: projectCountData,
		loading: projectCountLoading,
		getOne: projectCountGetOne,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.PROJECT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const {
		dataSingle: unitCountData,
		loading: unitCountLoading,
		getOne: unitCountGetOne,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.DEVELOPER_UNIT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const {
		dataSingle: unitStockCountData,
		loading: unitStockCountLoading,
		getOne: unitStockCountGetOne,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.UNIT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const {
		dataSingle: unitTotalCountData,
		loading: unitTotalCountLoading,
		getOne: unitTotalCountGetOne,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.UNIT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const {
		dataSingle: unitSoldCountData,
		loading: unitSoldCountLoading,
		getOne: unitSoldCountGetOne,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.UNIT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const {
		dataSingle: activeTransactionCountData,
		loading: activeTransactionCountLoading,
		getOne: activeTransactionCountGetOne,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.UNIT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	const dataDashboard = useMemo(
		() => [
			{
				title: 'Proyek Terdaftar',
				value: formatNumber(projectCountData?.total ?? '0') ?? '0',
				loading: projectCountLoading,
				icon: <RegisteredProjectIcon />,
			},
			{
				title: 'Tipe Unit',
				value: formatNumber(unitCountData?.total ?? '0') ?? '0',
				loading: unitCountLoading,
				icon: <TypeUnitIcon />,
			},
			{
				title: 'Stok Unit',
				value: (
					<>
						<Typography variant="h3" component="span">
							{formatNumber(unitStockCountData?.total ?? 0) ?? '0'}
						</Typography>
						<Typography variant="h5" component="span" fontWeight={400}>
							{' '}
							/{formatNumber(unitTotalCountData?.total ?? 0) ?? '0'}
						</Typography>
					</>
				),
				loading: unitStockCountLoading || unitTotalCountLoading,
				icon: <StockUnitIcon />,
			},
			{
				title: 'Transaksi Aktif',
				value: formatNumber(activeTransactionCountData?.total ?? '0') ?? '0',
				loading: activeTransactionCountLoading,
				icon: <TrxActiveIcon sx={{ width: '32px', height: '32px' }} />,
			},
			{
				title: 'Unit Terjual',
				value: formatNumber(unitSoldCountData?.total ?? '0') ?? '0',
				loading: unitSoldCountLoading,
				icon: <SoldUnitIcon sx={{ width: '32px', height: '32px' }} />,
			},
			{
				title: 'E-Wallet',
				value: (
					<>
						<Typography component="span" fontWeight={700}>
							IDR.
						</Typography>
						<Typography component="span" variant="h2">
							{formatNumber(
								developerData?.master_user?.ewallet?.balance ?? '0'
							) ?? '0'}
						</Typography>
					</>
				),
				loading: developerLoading,
				href: `${router.asPath}/e-wallet`,
				icon: <WalletIcon sx={{ width: '32px', height: '32px' }} />,
			},
		],
		[
			activeTransactionCountData?.total,
			activeTransactionCountLoading,
			developerData?.master_user?.ewallet?.balance,
			developerLoading,
			projectCountData?.total,
			projectCountLoading,
			router.asPath,
			unitCountData?.total,
			unitCountLoading,
			unitSoldCountData?.total,
			unitSoldCountLoading,
			unitStockCountData?.total,
			unitStockCountLoading,
			unitTotalCountData?.total,
			unitTotalCountLoading,
		]
	)
	useEffect(() => {
		if (developerData) {
			setCompanyApp(
				developerData.developer_name,
				helper.fileUrl(developerData.logo_url)
			)
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [developerData])
	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
			projectCountGetOne(
				'?' +
					new URLSearchParams({
						filters: JSON.stringify(['developer_id', '=', router.query.id]),
					}).toString()
			)
			unitCountGetOne(
				'?' +
					new URLSearchParams({
						filters: JSON.stringify([
							'developer_project_data.developer_id',
							'=',
							router.query.id,
						]),
					}).toString()
			)
			unitStockCountGetOne(
				'?' +
					new URLSearchParams({
						filters: JSON.stringify([
							'developer_project_data.developer_id',
							'=',
							router.query.id,
						]),
						status: 'READY',
					}).toString()
			)
			unitTotalCountGetOne(
				'?' +
					new URLSearchParams({
						filters: JSON.stringify([
							'developer_project_data.developer_id',
							'=',
							router.query.id,
						]),
					}).toString()
			)
			unitSoldCountGetOne(
				'?' +
					new URLSearchParams({
						filters: JSON.stringify([
							'developer_project_data.developer_id',
							'=',
							router.query.id,
						]),
						status: 'TERJUAL',
					}).toString()
			)
			activeTransactionCountGetOne(
				'?' +
					new URLSearchParams({
						filters: JSON.stringify([
							'developer_project_data.developer_id',
							'=',
							router.query.id,
						]),
						status: 'AKTIF',
					}).toString()
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])
	return (
		<>
			<Stack overflow="auto" height="100%" pb={2}>
				<Box mx={4} my={2}>
					<CustomSkeleton loading={developerLoading || !router.query.id}>
						<Stack
							borderRadius="12px"
							width="fit-content"
							boxShadow={2}
							direction="row"
							alignItems="center"
							py="6px"
							px="12px"
							bgcolor="white"
						>
							<Typography color="grey.400" variant="body2">
								Kode Referral:{' '}
								<Typography
									color="grey.400"
									variant="body2"
									fontWeight={700}
									component="span"
								>
									{developerData?.reff ?? '-'}
								</Typography>
							</Typography>
							<IconButton
								onClick={(ev) => {
									ev.stopPropagation()
									copyToClipboard(developerData?.reff ?? '')
								}}
								size="small"
							>
								<ContentCopyIcon color="primary" width="16px" height="16px" />
							</IconButton>
						</Stack>
					</CustomSkeleton>
				</Box>
				<Grid container spacing={1} px={4}>
					<Grid container item xs={12} md={9} spacing={1}>
						{dataDashboard.map(
							(dashboardItem, dashboardI) =>
								dashboardI != dataDashboard.length - 1 && (
									<Grid key={dashboardI} item xs={12} md>
										<DashboardBlackCard
											loading={
												dashboardItem?.loading ||
												(!router.query?.id as unknown as boolean)
											}
											data={{
												sub: dashboardItem.title,
												title: dashboardItem.value,
											}}
											href={dashboardItem?.href}
											icon={
												dashboardItem?.icon ?? (
													<HouseIcon
														sx={{
															fill: 'white',
															width: '36px',
															height: '36px',
														}}
													/>
												)
											}
										/>
									</Grid>
								)
						)}
					</Grid>
					<Grid item xs={12} md={3}>
						<DashboardBlackCard
							loading={
								dataDashboard?.[dataDashboard.length - 1]?.loading ||
								(!router.query?.id as unknown as boolean)
							}
							data={{
								sub: dataDashboard?.[dataDashboard.length - 1].title,
								title: dataDashboard?.[dataDashboard.length - 1].value,
							}}
							href={dataDashboard?.[dataDashboard.length - 1]?.href}
							icon={
								dataDashboard?.[dataDashboard.length - 1]?.icon ?? (
									<HouseIcon
										sx={{
											fill: 'white',
											width: '36px',
											height: '36px',
										}}
									/>
								)
							}
						/>
					</Grid>
				</Grid>
				<Grid container px={4} mt={1} spacing={4}>
					<Grid item md={6} xs={12}>
						{/* <GradientLineChart
							title="Total Pendapatan"
							description={'Rp 500'}
							height={'400px'}
							chart={gradientLineChartData}
							rightHeader={
								<Select
									sx={{ minWidth: '100px' }}
									size="small"
									value={''}
									// onChange={handleChange}
									displayEmpty
									inputProps={{ 'aria-label': 'Without label' }}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={30}>Tahun Ini</MenuItem>
								</Select>
							}
						/> */}
						<ComingSoonCard title="Total Pendapatan" height="100%" />
					</Grid>
					<Grid item md={6} xs={12}>
						<ThinBarChart
							title="Total Pengunjung"
							description={formatNumber(totalVisitorCount) ?? '0'}
							height={'400px'}
							loading={loadingVisitor}
							chart={generateDataVisitor()}
							rightHeader={
								<Select
									onChange={(v) =>
										setTypeVisitor(v.target.value as 'MONTH' | 'WEEK')
									}
									sx={{ minWidth: '100px' }}
									size="small"
									value={typeVisitor}
									// onChange={handleChange}
									displayEmpty
									inputProps={{ 'aria-label': 'Without label' }}
								>
									<MenuItem value="MONTH">Bulan ini</MenuItem>
									<MenuItem value="WEEK">Minggu ini</MenuItem>
								</Select>
							}
						/>
						{/* <ComingSoonCard title="Total Pengunjung" height="326px" /> */}
					</Grid>
				</Grid>
			</Stack>
		</>
	)
}

export default Developer
