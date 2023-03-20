import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import AddButton from '../../../../components/button/AddButton'
import ProjectCard from '../../../../components/card/ProjectCard'
import ChipGroup from '../../../../components/chip/ChipGroup'
import SearchField from '../../../../components/field/SearchField'
import BuildingIcon from '../../../../components/icons/BuildingIcon'
import HouseIcon from '../../../../components/icons/HouseIcon'
import InfiniteScrollList from '../../../../components/list/InfiniteScrollList'
import UnitList from '../../../../components/list/UnitList'
import useFetch from '../../../../hooks/useFetch'
import useMenuAppbar from '../../../../hooks/useMenuAppbar'
import { IDeveloperGet } from '../../../../interfaces/interfaceApiDeveloper'
import { IProjectGet } from '../../../../interfaces/interfaceApiProject'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import helper from '../../../../utils/helper'

const chipGroupData = [
	{ name: 'Proyek', icon: BuildingIcon },
	{ name: 'Tipe Unit', icon: HouseIcon },
]

type TypeView = 'Proyek' | 'Tipe Unit'
interface IFilter {
	search?: string
	type?: TypeView
}

const ProjectUnit: NextPage = () => {
	const router = useRouter()
	const { setCompanyApp } = useMenuAppbar()
	const [filter, setFilter] = useState<IFilter | undefined>({
		search: '',
		type: 'Proyek',
	})
	const {
		dataSingle: developerData,
		loading: developerLoading,
		getOne: developerGetOne,
	} = useFetch<IDeveloperGet>(
		ENDPOINTS.DEVELOPER,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	useEffect(() => {
		if (developerData) {
			setCompanyApp(
				developerData.developer_name,
				helper.fileUrl(developerData.logo_url)
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [developerData])

	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	const {
		getAll: projectGetAll,
		data: projectData,
		loading: projectLoading,
		isNextPage: projectIsNext,
	} = useFetch<IProjectGet>(
		ENDPOINTS.PROJECT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH,
		{ limit: 20, mode: 'next' }
	)
	const projectGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		queryParams.count = true
		// if (filter?.search) {
		queryParams.filters = JSON.stringify([
			['project_name', 'like', filter?.search],
			['and'],
			['developer_id', 'like', router.query.id],
		])
		// }
		await projectGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	useEffect(() => {
		if (router.query.id) {
			projectGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter?.search, router.query.id])
	return (
		<Stack height={'100%'} pt={2}>
			<Grid mb={2} container spacing={2} sx={{ px: 4 }}>
				<Grid item xs={12} sm={6} md={8} lg={9}>
					<Stack spacing={2} flexWrap={'nowrap'} direction="row">
						<Typography variant="h4">Daftar Proyek</Typography>
						<AddButton
							onClick={() => router.push(`${router.asPath}/add-project`)}
						/>
					</Stack>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					<SearchField
						onChange={(v) => setFilter((f) => ({ ...f, search: v }))}
					/>
				</Grid>
				<Grid item xs={12}>
					<ChipGroup
						data={chipGroupData}
						labelKey="name"
						value={filter?.type ?? ''}
						iconKey="icon"
						valueKey="name"
						onChange={(v) => setFilter((f) => ({ ...f, type: v as TypeView }))}
						persistent
					/>
				</Grid>
			</Grid>
			{filter?.type == 'Proyek' ? (
				<InfiniteScrollList
					data={projectData}
					render={(props) => (
						<ProjectCard
							{...props}
							// onSwitch={onSwitch}
							// onEdit={openEditDrawer}
							// onDelete={openDelete}
						/>
					)}
					loading={projectLoading || !router.query.id}
					isNext={projectIsNext}
					getData={() => projectGetAllWParams({ isNext: true })}
					md={3}
				/>
			) : (
				<InfiniteScrollList
					data={projectData}
					render={(props) => (
						<UnitList
							{...props}
							// onSwitch={onSwitch}
							// onEdit={openEditDrawer}
							// onDelete={openDelete}
						/>
					)}
					loading={projectLoading || !router.query.id}
					isNext={projectIsNext}
					getData={() => projectGetAllWParams({ isNext: true })}
				/>
			)}
		</Stack>
	)
}

export default ProjectUnit
