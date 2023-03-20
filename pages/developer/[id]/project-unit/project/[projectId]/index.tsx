import CheckIcon from '@mui/icons-material/Check'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import { Divider, Grid, IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import DefaultBreadcrumb from '../../../../../../components/breadcrumb/DefaultBreadcrumb'
import RoundedChip from '../../../../../../components/chip/RoundedChip'
import Image from 'next/image'
import AddButton from '../../../../../../components/button/AddButton'
import UnitCard from '../../../../../../components/card/UnitCard'
import useMenuAppbar from '../../../../../../hooks/useMenuAppbar'
import useFetch from '../../../../../../hooks/useFetch'
import { IDeveloperGet } from '../../../../../../interfaces/interfaceApiDeveloper'
import ENDPOINTS from '../../../../../../utils/constants/endpoints'
import helper from '../../../../../../utils/helper'
import {
	IProjectGet,
	IProjectPostBody,
} from '../../../../../../interfaces/interfaceApiProject'
import useApiCUD from '../../../../../../hooks/useApiCUD'
import { ToastProviderContext } from '../../../../../../providers/ToastProvider'
import { LoadingButton } from '@mui/lab'
import { formatNumber } from '../../../../../../utils/number'
import LinkLabel from '../../../../../../components/label/LinkLabel'
import { IDocumentGroupGet } from '../../../../../../interfaces/interfaceApiDocumentGroup'
import usePermission from '../../../../../../hooks/usePermission'

const Project: NextPage = () => {
	const router = useRouter()
	const { permission } = usePermission()
	const { openToast } = useContext(ToastProviderContext)
	const { setCompanyApp } = useMenuAppbar()
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

	const {
		dataSingle: projectData,
		loading: projectLoading,
		getOne: projectGetOne,
	} = useFetch<IProjectGet>(
		ENDPOINTS.PROJECT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	const { edit: projectEditPublish, loading: projectEditPublishLoading } =
		useApiCUD(ENDPOINTS.PROJECT, process.env.NEXT_PUBLIC_DEVELOPER_PATH)
	const tooglePublish = async (publish: boolean) => {
		const res = await projectEditPublish<IProjectPostBody>(
			{ is_publish: publish },
			projectData?.id ?? ''
		)
		if (helper.isErrorApi(res)) {
			openToast(true, 'error', res?.message ?? 'Server Error')
		} else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			projectGetOne(('/' + router.query.projectId) as string)
		}
	}

	const {
		data: documentLegalData,
		loading: documentLegalLoading,
		getAll: documnetLegalGetAll,
	} = useFetch<IDocumentGroupGet>(
		ENDPOINTS.MASTER_DOCUMENT_GROUP,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)
	const legalDocuments = useMemo(
		() => documentLegalData?.[0]?.master_document_type ?? [],
		[documentLegalData]
	)
	const documentLegalGetAllWParams = async (params?: { page?: number }) => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([
			'code',
			'=',
			process.env.NEXT_PUBLIC_PROJECT_LEGAL_DOCUMENT_CODE,
		])

		await documnetLegalGetAll(queryParams)
	}

	const {
		data: documentSupportData,
		loading: documentSupportLoading,
		getAll: documnetSupportGetAll,
	} = useFetch<IDocumentGroupGet>(
		ENDPOINTS.MASTER_DOCUMENT_GROUP,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)
	const supportDocuments = useMemo(
		() => documentSupportData?.[0]?.master_document_type ?? [],
		[documentSupportData]
	)
	const documentSupportGetAllWParams = async (params?: { page?: number }) => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([
			'code',
			'=',
			process.env.NEXT_PUBLIC_PROJECT_SUPPORT_DOCUMENT_CODE,
		])

		await documnetSupportGetAll(queryParams)
	}

	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
			projectGetOne(('/' + router.query.projectId) as string)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	useEffect(() => {
		documentSupportGetAllWParams()
		documentLegalGetAllWParams()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [tab, setTab] = useState(0)
	const dataBreadcrumb = [
		{
			label: 'Daftar Proyek',
			path: `/developer/${router.query.id}/project-unit`,
		},
		{ label: projectData?.project_name ?? '', path: '' },
	]
	const headerCard = (
		<Card sx={{ width: 'auto', borderRadius: 1.5, mx: 4 }}>
			<Box sx={{ position: 'relative' }}>
				{projectLoading ? (
					<Skeleton variant="rectangular" height="290px" animation="wave" />
				) : (
					<>
						<CardMedia
							component="img"
							height="290px"
							// image={helper.fileUrl(data?.thumbnail_image_url ?? '')}
							image={helper.fileUrl(projectData?.project_cover_url ?? '')}
							alt={projectData?.project_name}
							sx={{
								filter: 'brightness(75%)',
							}}
						></CardMedia>
						<Stack
							sx={{
								position: 'absolute',
								top: 0,
								pt: '12px',
								px: 2,
								justifyContent: 'end',
							}}
							direction={'row'}
							alignItems="center"
							width="100%"
						>
							<Stack direction="row" spacing={1}>
								<Typography fontWeight={700} color="white" variant="body2">
									{projectData?.is_publish
										? 'Sudah Tayang'
										: 'Menunggu Approval'}
								</Typography>
								<Box
									width="20px"
									height="20px"
									bgcolor={
										projectData?.is_publish ? 'success.main' : 'error.main'
									}
									borderRadius="6px"
									border="1px solid white"
								/>
							</Stack>
						</Stack>
						<Stack
							sx={{
								position: 'absolute',
								bottom: 0,
								pb: '12px',
								px: 2,
								// justifyContent: 'space-between',
							}}
							direction="row"
							spacing={2}
							width="100%"
						>
							<Stack justifyContent="space-between" mr="auto">
								<Stack direction="row" alignItems="center" spacing={0.5}>
									<Typography
										noWrap
										variant="h2"
										fontWeight={700}
										component="div"
										color="white"
									>
										{false ? <Skeleton /> : projectData?.project_name}
									</Typography>
									<IconButton
										onClick={() =>
											router.push(
												`/developer/${
													router.query.id
												}/project-unit/edit-project/${projectData?.id ?? ''}`
											)
										}
									>
										<EditIcon sx={{ fill: 'white' }} />
									</IconButton>
								</Stack>

								<Typography color="white" noWrap variant="h5" fontWeight={400}>
									{false ? (
										<Skeleton />
									) : (
										projectData?.project_type?.category_name
									)}
								</Typography>
							</Stack>
							{permission.canPublish &&
								(projectData?.is_publish ? (
									<LoadingButton
										onClick={() => tooglePublish(false)}
										size="small"
										color="inherit"
										variant="contained"
										loading={projectEditPublishLoading}
										sx={{
											fontWeight: 600,
											fontSize: '14px',
											alignSelf: 'end',
											bgcolor: 'white',
											color: (thm) => thm.palette.error.main,
											border: (thm) => `1px solid${thm.palette.error.main}`,
										}}
									>
										Batalkan Penayangan
									</LoadingButton>
								) : (
									<LoadingButton
										onClick={() => tooglePublish(true)}
										loading={projectEditPublishLoading}
										size="small"
										color="success"
										variant="contained"
										startIcon={<CheckCircleIcon />}
										sx={{
											fontWeight: 600,
											fontSize: '14px',
											alignSelf: 'end',
											color: 'white',
										}}
									>
										Tayangkan
									</LoadingButton>
								))}
						</Stack>
					</>
				)}
			</Box>
		</Card>
	)

	const infoProjectTab = (
		<Stack>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Wilayah
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{projectData?.master_district?.district_name},{' '}
						{projectData?.master_city?.city_name},{' '}
						{projectData?.master_province?.province_name}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Alamat Lengkap
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{projectData?.project_address}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Cluster
					</Typography>
					<Stack direction="row" spacing={1}>
						{projectData?.optional_data_cluster?.map((clsItem, clsIndex) => (
							<Chip
								key={clsIndex}
								sx={{
									borderRadius: '6px',
									color: 'white',
									height: '24px',
									background:
										'linear-gradient(81.62deg, #314A60 2.25%, #151928 79.87%)',
								}}
								label={clsItem?.cluster_name}

								// deleteIcon={<DeleteIcon sx={{ fontSize: '14px !important' }} />}
								// onDelete={() => onDelete(index)}
							/>
						))}
					</Stack>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Kerjasama Bank
					</Typography>
					<Stack direction="row" spacing={1}>
						{projectData?.bank_cooperation?.map((bankItem, bankIndex) => (
							<Chip
								key={bankIndex}
								sx={{
									borderRadius: '6px',
									color: 'white',
									height: '24px',
									background:
										'linear-gradient(81.62deg, #314A60 2.25%, #151928 79.87%)',
								}}
								label={bankItem?.master_bank?.name}

								// deleteIcon={<DeleteIcon sx={{ fontSize: '14px !important' }} />}
								// onDelete={() => onDelete(index)}
							/>
						))}
					</Stack>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Harga Unit Termurah
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						Rp {formatNumber(projectData?.minimum_price ?? 0)}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Harga Unit Termahal
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						Rp {formatNumber(projectData?.maximum_price ?? 0)}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Nominal Cicilan Termurah
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						Rp {formatNumber(projectData?.minimum_installment ?? 0)}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						color="grey.400"
						variant="caption"
						fontWeight={700}
					>
						Nominal Cicilan Termahal
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						Rp {formatNumber(projectData?.maximum_installment ?? 0)}
					</Typography>
				</Grid>
			</Grid>
			<Divider sx={{ my: 4 }} />
			<Typography mb={1} color="grey.400" variant="caption" fontWeight={700}>
				Dokumen Legalitas
			</Typography>
			<Grid container>
				{legalDocuments?.map((lglItem, lglIndex) => (
					<Grid key={lglIndex} item xs={6} sm={4} md={3} lg={2}>
						<Stack alignItems="center">
							<Image
								width={64}
								height={64}
								alt="pdf-icon"
								objectFit="contain"
								unoptimized
								src={'/assets/pdf-icon.png'}
							/>
							<LinkLabel
								fontWeight={700}
								variant="body2"
								newtab
								href={helper.fileUrl(
									projectData?.developer_legal_documents?.find(
										(lglDoc) => lglDoc?.master_document_type_id == lglItem.id
									)?.document_url ?? '#'
								)}
							>
								{lglItem?.name}
							</LinkLabel>
						</Stack>
					</Grid>
				))}
			</Grid>
			<Typography
				mb={1}
				mt={4}
				color="grey.400"
				variant="caption"
				fontWeight={700}
			>
				Dokumen Pendukung
			</Typography>
			<Grid container>
				{supportDocuments?.map((suppItem, suppIndex) => (
					<Grid key={suppIndex} item xs={6} sm={4} md={3} lg={2}>
						<Stack alignItems="center">
							<Image
								width={64}
								height={64}
								alt="pdf-icon"
								objectFit="contain"
								unoptimized
								src={'/assets/pdf-icon.png'}
							/>
							<LinkLabel
								fontWeight={700}
								variant="body2"
								newtab
								href={helper.fileUrl(
									projectData?.developer_support_documents?.find(
										(suppDoc) => suppDoc?.master_document_type_id == suppItem.id
									)?.document_url ?? '#'
								)}
							>
								{suppItem?.name}
							</LinkLabel>
						</Stack>
					</Grid>
				))}
			</Grid>
		</Stack>
	)

	const typeUnitTab = (
		<Stack spacing={1.5}>
			<Stack
				alignItems="center"
				spacing={2}
				flexWrap={'nowrap'}
				direction="row"
			>
				<Typography fontWeight={700} variant="body1">
					List Tipe Unit
				</Typography>
				<AddButton
					onClick={() =>
						router.push(
							`/developer/${router.query.id}/project-unit/project/${
								router.query.projectId ?? ''
							}/type-unit/cu/add-type-unit`
						)
					}
				/>
			</Stack>
			{!!projectData?.data_type_unit.length ? (
				projectData?.data_type_unit.map((typeUnitItem, typeUnitIndex) => (
					<UnitCard
						projectId={router.query.projectId as string}
						data={typeUnitItem}
						key={typeUnitIndex}
					/>
				))
			) : (
				<>
					<Typography fontWeight={700} color="grey.400" textAlign="center">
						Belum memiliki tipe unit
					</Typography>
				</>
			)}
		</Stack>
	)
	return (
		<Stack height={'100%'} pt={2} overflow="auto">
			<DefaultBreadcrumb data={dataBreadcrumb} />
			<Stack>
				{headerCard}
				<Card sx={{ mx: 4, mt: 3, mb: 2 }}>
					<Box p={2}>
						<Tabs value={tab} onChange={(ev, val) => setTab(val)}>
							<Tab label="Info Proyek" />
							<Tab label="Tipe unit" />
						</Tabs>
						<Box mt={4}>
							{tab == 0 && infoProjectTab}
							{tab == 1 && typeUnitTab}
						</Box>
					</Box>
				</Card>
			</Stack>
		</Stack>
	)
}

export default Project
