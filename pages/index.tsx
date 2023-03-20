import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useContext, useEffect, useState } from 'react'
import AddButton from '../components/button/AddButton'
import DashboardCard from '../components/card/DashboardCard'
import SearchField from '../components/field/SearchField'
import BuildingIcon from '../components/icons/BuildingIcon'
import HouseIcon from '../components/icons/HouseIcon'
import type { NextPage } from 'next'
import InfiniteScrollList from '../components/list/InfiniteScrollList'
import DeveloperCard from '../components/card/DeveloperCard'
import { AppBarProviderContext } from '../components/appbar/DefaultAppBar'
import { useRouter } from 'next/router'
import useFetch from '../hooks/useFetch'
import ENDPOINTS from '../utils/constants/endpoints'
import { IDeveloperGet } from '../interfaces/interfaceApiDeveloper'
import { IProjectCountGet } from '../interfaces/interfaceApiProjectCount'
import { formatNumber } from '../utils/number'
interface IFilter {
	search: string | undefined
}
const Home: NextPage = () => {
	const router = useRouter()
	const { setTitle, setMenu, setLeftHeader } = useContext(AppBarProviderContext)
	const [filter, setFilter] = useState<IFilter | undefined>({ search: '' })

	const {
		data: developerData,
		getAll: developerGetAll,
		isNextPage: developerIsNext,
		loading: developerLoading,
	} = useFetch<IDeveloperGet>(
		ENDPOINTS.DEVELOPER,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH,
		{ limit: 20, mode: 'next' }
	)
	const {
		dataSingle: projectCount,
		getOne: projectCountGetOne,
		loading: projectCountLoading,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.PROJECT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const {
		dataSingle: unitCount,
		getOne: unitCountGetOne,
		loading: unitCountLoading,
	} = useFetch<IProjectCountGet>(
		ENDPOINTS.UNIT_COUNT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	const developerGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		queryParams.count = true
		if (filter?.search) {
			queryParams.filters = JSON.stringify([
				'developer_name',
				'like',
				filter?.search,
			])
		}
		await developerGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	useEffect(() => {
		setTitle('Developer')
		setMenu([])
		setLeftHeader(undefined)
	}, [setLeftHeader, setMenu, setTitle])
	useEffect(() => {
		developerGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter?.search])
	useEffect(() => {
		projectCountGetOne()
		unitCountGetOne()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<Grid height="100%" container justifyContent="center">
			<Grid height="100%" item xs={12} md={10} lg={8}>
				<Stack height="100%" pt={2}>
					<Stack sx={{ px: 4 }} spacing={2} direction="row" mb={2}>
						<DashboardCard
							loading={projectCountLoading}
							data={{
								title: formatNumber(projectCount?.total ?? 0) ?? '0',
								sub: 'Total Proyek Terdaftar',
							}}
							icon={
								<BuildingIcon
									sx={{
										fill: 'transparent',
										stroke: 'white',
										width: '36px',
										height: '36px',
									}}
								/>
							}
						/>
						<DashboardCard
							loading={unitCountLoading}
							data={{
								title: formatNumber(unitCount?.total ?? 0) ?? '0',
								sub: 'Total Unit Terdaftar',
							}}
							icon={
								<HouseIcon
									sx={{ fill: 'white', width: '36px', height: '36px' }}
								/>
							}
						/>
					</Stack>
					<Grid mb={2} container spacing={2} sx={{ px: 4 }}>
						<Grid item xs={12} sm={6} md={8} lg={9}>
							<Stack spacing={2} flexWrap={'nowrap'} direction="row">
								<Typography variant="h4">Daftar Developer</Typography>
								<AddButton onClick={() => router.push('/cu/add-developer')} />
							</Stack>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={3}>
							<SearchField
								onChange={(v) => setFilter((f) => ({ ...f, search: v }))}
							/>
						</Grid>
					</Grid>
					<Stack px={4} overflow="auto">
						<InfiniteScrollList
							data={developerData}
							render={(props) => (
								<DeveloperCard
									{...props}
									onClick={() => router.push('/developer/' + props.data?.id)}
								/>
							)}
							loading={developerLoading}
							isNext={developerIsNext}
							getData={() => developerGetAllWParams({ isNext: true })}
							noPadding
						/>
					</Stack>
				</Stack>
			</Grid>
		</Grid>
	)
}

export default Home
