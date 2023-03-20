import CircleIcon from '@mui/icons-material/Circle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import Avatar from '@mui/material/Avatar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import DefaultBreadcrumb from '../../../../../../../../components/breadcrumb/DefaultBreadcrumb'
import AddButton from '../../../../../../../../components/button/AddButton'
import DropdownButton from '../../../../../../../../components/button/DropdownButton'
import DefaultDialog from '../../../../../../../../components/dialog/DefaultDialog'
import SearchField from '../../../../../../../../components/field/SearchField'
import UnitDetailHeader from '../../../../../../../../components/header/UnitDetailHeader'
import DefaultPagination from '../../../../../../../../components/pagination/DefaultPagination'
import UnitDetailTable from '../../../../../../../../components/tables/UnitDetailTable'
import useDisclose from '../../../../../../../../hooks/useDisclose'
import Chip from '@mui/material/Chip'
import BlackChip from '../../../../../../../../components/chip/BlackChip'
import NumberFormatField from '../../../../../../../../components/field/NumberFormatField'
import CustomTable, {
	ICustomTableHeader,
} from '../../../../../../../../components/tables/CustomTable'
import useMenuAppbar from '../../../../../../../../hooks/useMenuAppbar'
import useFetch from '../../../../../../../../hooks/useFetch'
import { IDeveloperGet } from '../../../../../../../../interfaces/interfaceApiDeveloper'
import helper from '../../../../../../../../utils/helper'
import ENDPOINTS from '../../../../../../../../utils/constants/endpoints'
import { IProjectGet } from '../../../../../../../../interfaces/interfaceApiProject'
import { ITypeUnitGet } from '../../../../../../../../interfaces/interfaceApiTypeUnit'
import {
	IUnitBlockGet,
	IUnitBlockPostBody,
	IUnitBlockPrice,
} from '../../../../../../../../interfaces/interfaceApiUnitBlock'
import { IGlobalStatusDetailGet } from '../../../../../../../../interfaces/interfaceApiGlobalStatusDetail'
import { formatNumber } from '../../../../../../../../utils/number'
import { LoadingButton } from '@mui/lab'
import useApiCUD from '../../../../../../../../hooks/useApiCUD'
import { ToastProviderContext } from '../../../../../../../../providers/ToastProvider'
import AutoCompleteAsyncField from '../../../../../../../../components/field/AutoCompleteAsyncField'
import Checkbox from '@mui/material/Checkbox'
import { IUnitDataPricePostBody } from '../../../../../../../../interfaces/interfaceApiUnit'

interface IFilter {
	search: string | undefined
	priceMin?: string
	priceMax?: string
	statusDevelopment?: IGlobalStatusDetailGet
	statusTransaction?: IGlobalStatusDetailGet
}
function Unit() {
	const router = useRouter()
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

	const {
		dataSingle: typeUnitData,
		getOne: typeUnitGetOne,
		loading: typeUnitLoading,
	} = useFetch<ITypeUnitGet>(
		ENDPOINTS.TYPE_UNIT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const dataBreadcrumb = [
		{
			label: 'Daftar Proyek',
			path: `/developer/${router.query.id}/project-unit`,
		},
		{
			label: projectData?.project_name ?? '',
			path: `/developer/${router.query.id}/project-unit/project/${router.query.projectId}`,
		},
		{ label: typeUnitData?.type_unit_name ?? '', path: '' },
	]

	const [filter, setFilter] = useState<IFilter>({ search: '' })
	const [checked, setChecked] = useState<string[]>([])
	const [tab, setTab] = useState(0)
	const {
		isOpen: isOpenDetail,
		close: closeDetail,
		selectedData: selectedDataDetail,
		openWithData: openDetail,
	} = useDisclose<IUnitBlockGet | undefined>()
	const onHandleChecked = (item: any, value: boolean, index: number) => {
		if (value) setChecked((v) => [...v, item.id])
		else setChecked((v) => v.filter((filterItem) => filterItem != item.id))
	}

	const {
		data: unitsData,
		setData: setUnitsData,
		getAll: unitsGetAll,
		loading: unitLoading,
		meta: unitsMeta,
	} = useFetch<IUnitBlockGet>(
		ENDPOINTS.UNIT_BLOK_DATA,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH,{limit:10,mode:'next-prev'}
	)

	const unitsGetAllWParams = async (params?: { page: number }) => {
		let queryParams: Record<string, any> = {}
		const filters = []
		filters.push(['data_type_unit_id', '=', router.query.typeUnitId])
		if (filter?.search) {
			filters.push(['AND'])
			filters.push(['block_name_number', 'like', filter.search])
		}
		if (filter?.statusDevelopment) {
			filters.push(['AND'])
			filters.push(['development_status_id', '=', filter.statusDevelopment.id])
		}
		if (filter?.statusTransaction) {
			filters.push(['AND'])
			filters.push(['transaction_status_id', '=', filter.statusTransaction.id])
		}
		queryParams.filters = JSON.stringify(filters)
		queryParams.price = true
		await unitsGetAll(queryParams, { toPage: params?.page })
	}

	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
			projectGetOne(('/' + router.query.projectId) as string)
			typeUnitGetOne(('/' + router.query.typeUnitId) as string)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	useEffect(() => {
		if (router.query.id) {
			unitsGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		router.query.id,
		filter.search,
		filter.statusDevelopment,
		filter.statusTransaction,
		filter.priceMax,
		filter.priceMin,
	])

	const titleAndFilter = (
		<Grid container spacing={2} sx={{ px: 4 }}>
			<Grid item xs={12} sm={12} md={5} lg={7}>
				<Stack spacing={2} flexWrap={'nowrap'} direction="row">
					<Typography variant="h4">Stok Unit</Typography>
					<AddButton
						onClick={() => router.push(router.asPath + '/unit/add-unit')}
					/>
				</Stack>
			</Grid>
			<Grid
				item
				xs={12}
				sm={6}
				md={3}
				lg={2}
				sx={{
					justifyContent: { xs: 'left', md: 'right' },
					display: 'flex',
				}}
			>
				<DropdownButton
					startIcon={<FilterAltOutlinedIcon />}
					endIcon={<KeyboardArrowDownOutlinedIcon sx={{ color: 'grey.700' }} />}
					content={
						<Stack px={2} py={1}>
							<Typography variant="h4" color="grey.400">
								Filter
							</Typography>
							<Divider sx={{ my: 1 }} />
							{/* <Stack direction={'row'} spacing={1} alignItems="center" mb={1}>
								<Typography
									flex={1}
									overflow="inherit"
									noWrap
									variant="caption"
									color="grey.400"
								>
									Harga (min)
								</Typography>
								<Box flex={1}>
									<NumberFormatField
										value={filter.priceMin}
										onChange={(v) => setFilter((f) => ({ ...f, priceMin: v }))}
									/>
								</Box>
							</Stack>
							<Stack direction={'row'} spacing={1} alignItems="center" mb={1}>
								<Typography
									flex={1}
									overflow="inherit"
									noWrap
									variant="caption"
									color="grey.400"
								>
									Harga (max)
								</Typography>
								<Box flex={1}>
									<NumberFormatField
										value={filter.priceMax}
										onChange={(v) => setFilter((f) => ({ ...f, priceMax: v }))}
									/>
								</Box>
							</Stack> */}
							<Stack direction={'row'} spacing={1} alignItems="center" mb={1}>
								<Typography
									flex={1}
									overflow="inherit"
									noWrap
									variant="caption"
									color="grey.400"
								>
									Status Pengembangan
								</Typography>
								<Box flex={1}>
									<AutoCompleteAsyncField
										endpoint={ENDPOINTS.UNIT_BLOK_STATUS}
										servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
										labelKey={'status_name'}
										valueKey="id"
										value={filter.statusDevelopment}
										onChange={(v) =>
											setFilter((f) => ({ ...f, statusDevelopment: v }))
										}
										error={undefined}
										params={{ sort: 'status_name' }}
										searchKey="status_name"
									/>
								</Box>
							</Stack>
							<Stack direction={'row'} spacing={1} alignItems="center" mb={1}>
								<Typography
									flex={1}
									overflow="inherit"
									noWrap
									variant="caption"
									color="grey.400"
								>
									Status Transaksi
								</Typography>
								<Box flex={1}>
									<AutoCompleteAsyncField
										endpoint={ENDPOINTS.UNIT_BLOK_STATUS_TRANSACTION}
										servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
										labelKey={'status_name'}
										valueKey="id"
										value={filter.statusTransaction}
										onChange={(v) =>
											setFilter((f) => ({ ...f, statusTransaction: v }))
										}
										error={undefined}
										params={{ sort: 'status_name' }}
										searchKey="status_name"
									/>
								</Box>
							</Stack>
						</Stack>
					}
				>
					Filter
				</DropdownButton>
			</Grid>
			<Grid item xs={12} sm={6} md={4} lg={3}>
				<SearchField
					onChange={(v) => setFilter((f) => ({ ...f, search: v }))}
				/>
			</Grid>
		</Grid>
	)

	const { getAll: developmentStatusGetAll, data: developmentStatusData } =
		useFetch<IGlobalStatusDetailGet>(
			ENDPOINTS.UNIT_BLOK_STATUS,
			process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
		)
	const {
		getOne: detailUnitBlockGetOne,
		dataSingle: detailUnitBlockData,
		loading: detailUnitBlockLoading,
	} = useFetch<IUnitBlockGet>(
		ENDPOINTS.UNIT_BLOK_DATA,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	const { edit: blockEdit } = useApiCUD(
		ENDPOINTS.UNIT_BLOK_DATA,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const [detailBlockId, setDetailBlockId] = useState('')
	useEffect(() => {
		developmentStatusGetAll()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const changeStatusDevelopment = async (
		id: string,
		status: IGlobalStatusDetailGet
	) => {
		const dataFromId = unitsData.find((v) => v.id == id)
		if (dataFromId?.development_status.id != status.id) {
			const res = await blockEdit<IUnitBlockPostBody>(
				{ development_status_id: status.id },
				dataFromId?.id ?? 0
			)
			if (helper.isErrorApi(res))
				openToast(true, 'error', res?.message ?? 'Server Error')
			else {
				openToast(true, 'success', 'Data Berhasil Diubah.')
				setUnitsData((state) => {
					return state.map((item) => {
						return item.id == id
							? {
									...item,
									development_status: status,
							  }
							: item
					})
				})
			}
		}
	}
	const { edit: blockEditBatch } = useApiCUD(
		ENDPOINTS.UNIT_BLOCK_BATCH_UPDATE,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const changeStatusDevelopmentBatch = async (
		status: IGlobalStatusDetailGet
	) => {
		const res = await blockEditBatch<IUnitBlockPostBody>(
			{ development_status_id: status.id },
			checked.join(',') ?? 0
		)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			unitsGetAllWParams()
			// setUnitsData((state) => {
			// 	return state.map((item) => {
			// 		return item.id == id
			// 			? {
			// 					...item,
			// 					development_status: status,
			// 			  }
			// 			: item
			// 	})
			// })
		}
	}

	const table = (
		<Box px={4} mt={2}>
			<UnitDetailTable
				data={unitsData}
				loading={unitLoading || !router.query.id}
				headers={[
					{
						key: 'block_number',
						label: 'NOMOR UNIT',
						weight: 700,
						align: 'center',
						render: (item) => (
							<Typography variant="caption" fontWeight={700}>
								{item.block_name} {item.block_number}
							</Typography>
						),
					},
					{
						key: 'block_name',
						label: 'HARGA MINIMUM',
						weight: 700,
						align: 'center',
						render: (item) => (
							<Typography variant="caption" fontWeight={700}>
								{formatNumber(item?.price_minimum ?? '0')}
							</Typography>
						),
					},
					{
						key: 'development_status',
						label: 'STATUS PENGEMBANGAN',
						weight: 700,
						align: 'center',
						noPadding: true,
						render: (item) => (
							<DropdownButton
								disabled={checked.length > 0}
								sx={{ border: '0px', bgcolor: 'transparent' }}
								endIcon={
									<KeyboardArrowDownOutlinedIcon sx={{ color: 'grey.700' }} />
								}
								startIcon={
									<CircleIcon
										color="warning"
										sx={{ fill: item?.development_status?.description }}
									/>
								}
								menu={developmentStatusData.map((v) => ({
									onClick: () => changeStatusDevelopment(item.id, v),
									content: (
										<Stack direction="row" spacing={1}>
											<CircleIcon
												color="warning"
												sx={{ fill: v.description }}
											/>
											<Typography
												fontWeight={700}
												variant="body2"
												color={v.description}
											>
												{v.status_name}
											</Typography>
										</Stack>
									),
								}))}
							>
								<Typography
									fontWeight={700}
									variant="body2"
									color={item?.development_status?.description}
								>
									{item?.development_status?.status_name}
								</Typography>
							</DropdownButton>
						),
					},
					{
						key: 'transaction_status',
						label: 'STATUS TRANSAKSI',
						weight: 700,
						align: 'center',
						noPadding: true,
						render: (item) => (
							<Stack direction="row" justifyContent="center" spacing={1}>
								<CircleIcon
									color="success"
									sx={{
										fontSize: 20,
										fill: item?.transaction_status?.description,
									}}
								/>
								<Typography
									fontWeight={700}
									variant="body2"
									color={item?.transaction_status?.description}
								>
									{item?.transaction_status?.status_name}
								</Typography>
							</Stack>
						),
					},
					{
						key: 'id',
						label: 'AKSI',
						align: 'center',
						noPadding: true,
						w: '246px',
						render: (item) => (
							<Stack direction="row" justifyContent="center" spacing={1}>
								<LoadingButton
									disabled={checked.length > 0}
									loading={detailUnitBlockLoading && detailBlockId == item.id}
									sx={{
										bgcolor: 'white',
										border: (thm) => `1px solid ${thm.palette.grey[300]}`,
									}}
									color="inherit"
									onClick={async () => {
										setDetailBlockId(item.id)
										const res = await detailUnitBlockGetOne('/' + item.id)
										setDetailBlockId('')
										openDetail(res as IUnitBlockGet)
									}}
								>
									<Typography fontWeight={700} variant="caption">
										Detail
									</Typography>
								</LoadingButton>
								<Button
									disabled={checked.length > 0}
									sx={{
										bgcolor: 'white',
										border: (thm) => `1px solid ${thm.palette.grey[300]}`,
									}}
									color="inherit"
									onClick={() =>
										router.push(router.asPath + '/unit/edit-unit/' + item.id)
									}
								>
									<Typography fontWeight={700} variant="caption">
										Ubah
									</Typography>
								</Button>
								<Button
									disabled={checked.length > 0}
									sx={{
										bgcolor: 'white',
										border: (thm) => `1px solid ${thm.palette.grey[300]}`,
									}}
									startIcon={<ContentCopyIcon />}
									color="inherit"
									onClick={() =>
										router.push(router.asPath + '/unit/add-unit/' + item.id)
									}
								>
									<Typography fontWeight={700} variant="caption">
										Salin
									</Typography>
								</Button>
							</Stack>
						),
					},
				]}
				dataChecked={checked}
				checkedKey="id"
				onCheck={onHandleChecked}
				highlightKey={'transaction_status.status_name'}
				highlightValue={'Lunas'}
			/>
		</Box>
	)
	const statusDeveloperControl = (
		<Stack direction="row" px={4} alignItems="center">
			<Typography variant="caption">Status Pengembangan: </Typography>
			<DropdownButton
				sx={{ border: '0px', bgcolor: 'transparent' }}
				endIcon={<KeyboardArrowDownOutlinedIcon sx={{ color: 'grey.700' }} />}
				startIcon={<CircleIcon color="warning" />}
				menu={developmentStatusData.map((v) => ({
					onClick: () => changeStatusDevelopmentBatch(v),
					content: (
						<Stack direction="row" spacing={1}>
							<CircleIcon color="warning" sx={{ fill: v.description }} />
							<Typography
								fontWeight={700}
								variant="body2"
								color={v.description}
							>
								{v.status_name}
							</Typography>
						</Stack>
					),
				}))}
			>
				<Typography fontWeight={700} variant="body2" color="warning.main">
					Inden
				</Typography>
			</DropdownButton>
		</Stack>
	)
	const infoUnitTab = (
		<Stack mt={3}>
			<Grid container spacing={2} rowSpacing={3}>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						variant="caption"
						color="grey.400"
						fontWeight={700}
					>
						Kategori
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{selectedDataDetail?.master_category?.category_name}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						variant="caption"
						color="grey.400"
						fontWeight={700}
					>
						Jenis Sertifikat
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{selectedDataDetail?.master_certificate?.category_name}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						variant="caption"
						color="grey.400"
						fontWeight={700}
					>
						Link Google Map
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{selectedDataDetail?.map}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6} display="flex" flexDirection="column">
					<Typography
						mb={1}
						variant="caption"
						color="grey.400"
						fontWeight={700}
					>
						Tahun Serah Terima
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{selectedDataDetail?.handover_year}
					</Typography>
				</Grid>
			</Grid>
			<Divider sx={{ my: 4 }} />
			<Typography mb={1} variant="caption" color="grey.400" fontWeight={700}>
				Previllege / Keunggulan Unit
			</Typography>
			<Stack direction="row" spacing={1}>
				{selectedDataDetail?.unit_block_facility
					?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_PREVILEGE_CODE)
					?.map((v, vI) => (
						<BlackChip
							key={vI}
							label={v.master_detail_category?.category_name ?? ''}
						/>
					))}
			</Stack>
			<Typography
				mb={1}
				mt={3}
				variant="caption"
				color="grey.400"
				fontWeight={700}
			>
				Fasilitas
			</Typography>
			<Stack direction="row" spacing={1}>
				{selectedDataDetail?.unit_block_facility
					?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_FACILITY_CODE)
					?.map((v, vI) => (
						<BlackChip
							key={vI}
							label={v.master_detail_category?.category_name ?? ''}
						/>
					))}
			</Stack>
			<Typography
				mb={1}
				mt={3}
				variant="caption"
				color="grey.400"
				fontWeight={700}
			>
				Free Extra
			</Typography>
			<Stack direction="row" spacing={1}>
				{selectedDataDetail?.unit_block_facility
					?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_EXTRA_CODE)
					?.map((v, vI) => (
						<BlackChip
							key={vI}
							label={v.master_detail_category?.category_name ?? ''}
						/>
					))}
			</Stack>
			<Typography
				mb={1}
				mt={3}
				variant="caption"
				color="grey.400"
				fontWeight={700}
			>
				Free Biaya
			</Typography>
			<Stack direction="row" spacing={1}>
				{selectedDataDetail?.unit_block_facility
					?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_FREE_CODE)
					?.map((v, vI) => (
						<BlackChip
							key={vI}
							label={v.master_detail_category?.category_name ?? ''}
						/>
					))}
			</Stack>
		</Stack>
	)

	const cashTableHeader = () => {
		const headers: ICustomTableHeader<IUnitBlockPrice>[] = [
			{
				key: 'dp_installment_termin',
				label: 'PEMBAYARAN (KALI)',
				align: 'center',
				render: (item) =>
					formatNumber(item?.dp_installment_termin ?? '0') + 'X',
			},
		]
		const bphtp =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'CASH'
			)?.bphtb ?? 0
		const ppn =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'CASH'
			)?.ppn ?? 0
		if (bphtp || ppn) {
			const add: string[] = []
			if (bphtp) add.push('BPHTB ' + bphtp + '%')
			if (ppn) add.push('PPN ' + ppn + '%')
			headers.push({
				key: 'bphtb',
				label: 'PENAMBAH HARGA',
				align: 'center',
				weight: 700,
				render: () => add.join(', '),
			})
		}
		const sub: string[] = []
		const discount =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'CASH'
			)?.discount ?? 0
		const includeUtj =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'CASH'
			)?.include_utj ?? false
		if (discount) sub.push('POTONGAN')
		if (includeUtj) sub.push('UTJ')
		if (includeUtj || discount)
			headers.push({
				key: 'discount',
				label: 'PENGURANG HARGA',
				align: 'center',
				weight: 700,
				render: () => sub.join(', '),
			})

		return [
			...headers,
			...([
				{
					key: 'unit_nominal_nett',
					label: 'HARGA NETT',
					align: 'center',
					render: (item) => formatNumber(item?.unit_nominal_nett ?? '0'),
				},
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					render: (item) => formatNumber(item?.monthly_installment ?? '0'),
				},
			] as ICustomTableHeader<IUnitBlockPrice>[]),
		]
	}

	const inHouseDpTableHeader = () => {
		let headers: ICustomTableHeader<IUnitBlockPrice>[] = [
			{
				sticky: true,
				key: 'unit_nominal',
				label: 'HARGA BRUTO UNIT',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.unit_nominal ?? '0'),
			},
			{
				key: 'dp_percentage',
				label: '% DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (item) => formatNumber(item?.dp_percentage ?? '0') + '%',
			},
			{
				key: 'dp_installment_termin',
				label: 'CICILAN DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (item) =>
					formatNumber(item?.dp_installment_termin ?? '0') + 'X',
			},
		]
		const bphtp =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
			)?.bphtb ?? 0
		const ppn =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
			)?.ppn ?? 0
		if (bphtp || ppn) {
			const add: string[] = []
			if (bphtp) add.push('BPHTB ' + bphtp + '%')
			if (ppn) add.push('PPN ' + ppn + '%')
			headers.push({
				key: 'bphtb',
				label: 'PENAMBAH HARGA',
				align: 'center',
				weight: 700,
				render: () => add.join(', '),
			})
		}
		headers = headers.concat([
			{
				key: 'unit_nominal_nett',
				label: 'HARGA NETT',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.unit_nominal_nett ?? '0'),
			},
			{
				key: 'dp_total',
				label: 'DP BRUTO',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.dp_total ?? '0'),
			},
		])
		const sub: string[] = []
		const discount =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
			)?.discount ?? 0
		const includeUtj =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
			)?.include_utj ?? false
		if (discount) sub.push('POTONGAN')
		if (includeUtj) sub.push('UTJ')
		if (includeUtj || discount)
			headers.push({
				key: 'discount',
				label: 'PENGURANG HARGA',
				align: 'center',
				weight: 700,
				render: () => sub.join(', '),
			})

		return [
			...headers,
			...([
				{
					key: 'dp_nett',
					label: 'DP NET',
					align: 'center',
					w: '200px',
					render: (item) => formatNumber(item?.dp_nett ?? '0'),
				},
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					w: '200px',
					render: (item) => formatNumber(item?.monthly_installment ?? '0'),
				},
			] as ICustomTableHeader<IUnitBlockPrice>[]),
		]
	}

	const inHouseTableHeader = () => {
		let headers: ICustomTableHeader<IUnitBlockPrice>[] = [
			{
				sticky: true,
				key: 'unit_nominal',
				label: 'HARGA BRUTO UNIT',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.unit_nominal ?? '0'),
			},
			{
				key: 'dp_installment_termin',
				label: 'TERMIN INHOUSE',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (item) =>
					formatNumber(item?.dp_installment_termin ?? '0') + '%',
			},
		]
		const bphtp =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
			)?.bphtb ?? 0
		const ppn =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
			)?.ppn ?? 0
		if (bphtp || ppn) {
			const add: string[] = []
			if (bphtp) add.push('BPHTB ' + bphtp + '%')
			if (ppn) add.push('PPN ' + ppn + '%')
			headers.push({
				key: 'bphtb',
				label: 'PENAMBAH HARGA',
				align: 'center',
				weight: 700,
				render: () => add.join(', '),
			})
		}
		headers = headers.concat([
			{
				key: 'unit_nominal_nett',
				label: 'HARGA NETT',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.unit_nominal_nett ?? '0'),
			},
		])
		const sub: string[] = []
		const discount =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
			)?.discount ?? 0
		const includeUtj =
			selectedDataDetail?.unit_block_price?.find(
				(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
			)?.include_utj ?? false
		if (discount) sub.push('POTONGAN')
		if (includeUtj) sub.push('UTJ')
		if (includeUtj || discount)
			headers.push({
				key: 'discount',
				label: 'PENGURANG HARGA',
				align: 'center',
				weight: 700,
				render: () => sub.join(', '),
			})

		return [
			...headers,
			...([
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					w: '200px',
					render: (item) => formatNumber(item?.monthly_installment ?? '0'),
				},
			] as ICustomTableHeader<IUnitBlockPrice>[]),
		]
	}

	const kprTableHeader = () => {
		let headers: ICustomTableHeader<IUnitBlockPrice>[] = [
			{
				key: 'dp_percentage',
				label: '% DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (item) => formatNumber(item?.dp_percentage ?? '0') + '%',
			},
			{
				key: 'dp_installment_termin',
				label: 'CICILAN DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (item) =>
					formatNumber(item?.dp_installment_termin ?? '0') + 'X',
			},
		]
		const bphtp =
			selectedDataDetail?.unit_block_price?.find((v) => v.type_payment == 'KPR')
				?.bphtb ?? 0
		const ppn =
			selectedDataDetail?.unit_block_price?.find((v) => v.type_payment == 'KPR')
				?.ppn ?? 0
		if (bphtp || ppn) {
			const add: string[] = []
			if (bphtp) add.push('BPHTB ' + bphtp + '%')
			if (ppn) add.push('PPN ' + ppn + '%')
			headers.push({
				key: 'bphtb',
				label: 'PENAMBAH HARGA',
				align: 'center',
				weight: 700,
				render: () => add.join(', '),
			})
		}
		headers = headers.concat([
			{
				key: 'unit_nominal_nett',
				label: 'HARGA NETT',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.unit_nominal_nett ?? '0'),
			},
			{
				key: 'dp_total',
				label: 'DP BRUTO',
				align: 'center',
				w: '200px',
				render: (item) => formatNumber(item?.dp_total ?? '0'),
			},
		])
		const sub: string[] = []
		const discount =
			selectedDataDetail?.unit_block_price?.find((v) => v.type_payment == 'KPR')
				?.discount ?? 0
		const includeUtj =
			selectedDataDetail?.unit_block_price?.find((v) => v.type_payment == 'KPR')
				?.include_utj ?? false
		if (discount) sub.push('POTONGAN')
		if (includeUtj) sub.push('UTJ')
		if (includeUtj || discount)
			headers.push({
				key: 'discount',
				label: 'PENGURANG HARGA',
				align: 'center',
				weight: 700,
				render: () => sub.join(', '),
			})

		return [
			...headers,
			...([
				{
					key: 'dp_nett',
					label: 'DP NET',
					align: 'center',
					w: '200px',
					render: (item) => formatNumber(item?.dp_nett ?? '0'),
				},
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					w: '200px',
					render: (item) => formatNumber(item?.monthly_installment ?? '0'),
				},
			] as ICustomTableHeader<IUnitBlockPrice>[]),
		]
	}

	const unitPriceTab = (
		<Stack mt={3}>
			<Typography mb={1} variant="body2" fontWeight={700}>
				Harga UTJ
			</Typography>
			<NumberFormatField
				readOnly
				value={(
					selectedDataDetail?.unit_block_price?.find((v) => v.utj_price)
						?.utj_price ?? 0
				).toString()}
				startAdornment={<Typography fontWeight={700}>Rp</Typography>}
				onChange={function (value: string): void {
					throw new Error('Function not implemented.')
				}}
			/>
			<Divider sx={{ my: 4 }} />
			<Typography variant="body2" fontWeight={700}>
				Cash
			</Typography>
			<Stack
				borderRadius={2}
				p={2}
				border={(thm) => `1px solid ${thm.palette.grey[300]}`}
			>
				<Typography mb={1} variant="body2" fontWeight={700}>
					Harga Bruto Unit
				</Typography>
				<NumberFormatField
					readOnly
					value={(
						selectedDataDetail?.unit_block_price?.find(
							(v) => v.type_payment == 'CASH'
						)?.unit_nominal ?? 0
					).toString()}
					startAdornment={<Typography fontWeight={700}>Rp</Typography>}
					onChange={function (value: string): void {
						throw new Error('Function not implemented.')
					}}
				/>
				<Box height={'20px'} />
				<Typography variant="caption" fontWeight={600}>
					Penambah Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan ditambahkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">Penambah lainnya : </Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'CASH'
										)?.other ?? 0
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption">
							PPN{' '}
							{selectedDataDetail?.unit_block_price?.find(
								(v) => v.type_payment == 'CASH'
							)?.ppn ?? 0}
							%
						</Typography>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<Typography variant="caption" fontWeight={600}>
					Pengurang Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan dikurangkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">
								Diskon/Cashback/Potongan lainnya :{' '}
							</Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'CASH'
										)?.discount ?? 0
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Checkbox
								readOnly
								sx={{ p: 0 }}
								disableRipple
								checked={Boolean(
									selectedDataDetail?.unit_block_price?.find(
										(v) => v.type_payment == 'CASH'
									)?.include_utj ?? 0
								)}
							/>
							<Typography variant="caption">UTJ </Typography>
						</Stack>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<CustomTable
					data={
						selectedDataDetail?.unit_block_price?.filter(
							(v) => v.type_payment == 'CASH'
						) ?? []
					}
					headers={cashTableHeader()}
				/>
			</Stack>
			<Divider sx={{ my: 4 }} />
			<Typography variant="body2" fontWeight={700}>
				In-House - Dengan DP
			</Typography>
			<Stack
				borderRadius={2}
				p={2}
				border={(thm) => `1px solid ${thm.palette.grey[300]}`}
			>
				<Typography variant="caption" fontWeight={600}>
					Penambah Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan ditambahkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">Penambah lainnya : </Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
										)?.other ?? 0
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption">
							PPN{' '}
							{selectedDataDetail?.unit_block_price?.find(
								(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
							)?.ppn ?? 0}
							%
						</Typography>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<Typography variant="caption" fontWeight={600}>
					Pengurang Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan dikurangkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">
								Diskon/Cashback/Potongan lainnya :{' '}
							</Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
										)?.discount ?? 0
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Checkbox
								readOnly
								sx={{ p: 0 }}
								disableRipple
								checked={Boolean(
									selectedDataDetail?.unit_block_price?.find(
										(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
									)?.include_utj ?? 0
								)}
							/>
							<Typography variant="caption">UTJ </Typography>
						</Stack>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<CustomTable
					data={
						selectedDataDetail?.unit_block_price?.filter(
							(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
						) ?? []
					}
					headers={inHouseDpTableHeader()}
				/>
			</Stack>
			<Divider sx={{ my: 4 }} />
			<Typography variant="body2" fontWeight={700}>
				In-House - Tanpa DP
			</Typography>
			<Stack
				borderRadius={2}
				p={2}
				border={(thm) => `1px solid ${thm.palette.grey[300]}`}
			>
				<Typography variant="caption" fontWeight={600}>
					Penambah Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan ditambahkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">Penambah lainnya : </Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={
										((selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
										)?.other ?? 0) 
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption">
							PPN{' '}
							{selectedDataDetail?.unit_block_price?.find(
								(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
							)?.ppn ?? 0}
							%
						</Typography>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<Typography variant="caption" fontWeight={600}>
					Pengurang Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan dikurangkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">
								Diskon/Cashback/Potongan lainnya :{' '}
							</Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
										)?.discount ?? 0
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Checkbox
								readOnly
								sx={{ p: 0 }}
								disableRipple
								checked={Boolean(
									selectedDataDetail?.unit_block_price?.find(
										(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
									)?.include_utj ?? 0
								)}
							/>
							<Typography variant="caption">UTJ </Typography>
						</Stack>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<CustomTable
					data={
						selectedDataDetail?.unit_block_price?.filter(
							(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
						) ?? []
					}
					headers={inHouseTableHeader()}
				/>
			</Stack>
			<Divider sx={{ my: 4 }} />
			<Typography variant="body2" fontWeight={700}>
				KPR
			</Typography>
			<Stack
				borderRadius={2}
				p={2}
				border={(thm) => `1px solid ${thm.palette.grey[300]}`}
			>
				<Typography mb={1} variant="body2" fontWeight={700}>
					Harga Bruto Unit
				</Typography>
				<NumberFormatField
					readOnly
					value={(
						selectedDataDetail?.unit_block_price?.find(
							(v) => v.type_payment == 'KPR'
						)?.unit_nominal ?? 0
					).toString()}
					startAdornment={<Typography fontWeight={700}>Rp</Typography>}
					onChange={function (value: string): void {
						throw new Error('Function not implemented.')
					}}
				/>
				<Box height={'20px'} />

				<Typography variant="caption" fontWeight={600}>
					Penambah Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan ditambahkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">Penambah lainnya : </Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={
										((selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'KPR'
										)?.other ?? 0)
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption">
							PPN{' '}
							{selectedDataDetail?.unit_block_price?.find(
								(v) => v.type_payment == 'KPR'
							)?.ppn ?? 0}
							%
						</Typography>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<Typography variant="caption" fontWeight={600}>
					Pengurang Harga{' '}
					<Typography color="grey.400" component="span" fontSize="10px">
						(Akan dikurangkan ke harga bruto)
					</Typography>
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Stack>
							<Typography variant="caption">
								Diskon/Cashback/Potongan lainnya :{' '}
							</Typography>
							<Stack direction="row" spacing={2}>
								<NumberFormatField
									readOnly
									value={(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.type_payment == 'KPR'
										)?.discount ?? 0
									).toString()}
									startAdornment={<Typography fontWeight={700}>Rp </Typography>}
									onChange={function (value: string): void {
										throw new Error('Function not implemented.')
									}}
								/>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Stack direction="row" spacing={1} alignItems="center">
							<Checkbox
								readOnly
								sx={{ p: 0 }}
								disableRipple
								checked={Boolean(
									selectedDataDetail?.unit_block_price?.find(
										(v) => v.type_payment == 'KPR'
									)?.include_utj ?? 0
								)}
							/>
							<Typography variant="caption">UTJ </Typography>
						</Stack>
					</Grid>
				</Grid>
				<Box height={'20px'} />
				<CustomTable
					data={
						selectedDataDetail?.unit_block_price?.filter(
							(v) => v.type_payment == 'KPR'
						) ?? []
					}
					headers={kprTableHeader()}
				/>
			</Stack>
		</Stack>
	)
	const DetailDialog = (
		<DefaultDialog
			onClose={closeDetail}
			open={isOpenDetail}
			title="Detail Unit"
			maxWidth="lg"
		>
			<Stack>
				<Stack spacing={3} direction="row">
					<Avatar
						variant="rounded"
						sx={{ width: '104px', height: '104px' }}
						src={helper.fileUrl(typeUnitData?.image_thumbnail_url ?? '')}
					/>
					<Stack justifyContent="space-between">
						<Typography variant="h4">
							{selectedDataDetail?.block_name}
							{selectedDataDetail?.block_number}
						</Typography>
						<Stack direction="row" spacing={3}>
							<Stack spacing={1}>
								<Typography color="grey.400" fontWeight={700} variant="caption">
									Start From
								</Typography>
								<Typography fontWeight={700} variant="body1">
									Rp {formatNumber(selectedDataDetail?.price_minimum ?? '0')}
								</Typography>
							</Stack>
							<Stack spacing={1}>
								<Typography color="grey.400" fontWeight={700} variant="caption">
									UTJ
								</Typography>
								<Typography fontWeight={700} variant="body1">
									Rp{' '}
									{formatNumber(
										selectedDataDetail?.unit_block_price?.find(
											(v) => v.utj_price
										)?.utj_price ?? '0'
									)}
								</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
				<Stack
					borderRadius={2}
					mt={3}
					p={2}
					border={(thm) => `1px solid ${thm.palette.grey[300]}`}
				>
					<Tabs
						sx={{ '& .Mui-selected': { color: 'black', fontWeight: 700 } }}
						value={tab}
						onChange={(ev, val) => setTab(val)}
					>
						<Tab label="Informasi Unit" />
						<Tab label="Harga Unit" />
					</Tabs>
					{tab == 0 && infoUnitTab}
					{tab == 1 && unitPriceTab}
				</Stack>
			</Stack>
		</DefaultDialog>
	)
	return (
		<Stack height={'100%'} overflow="auto">
			<DefaultBreadcrumb data={dataBreadcrumb} />
			<Box px={4} mb={3}>
				<UnitDetailHeader loading={typeUnitLoading} data={typeUnitData} />
			</Box>
			<Stack mx={3}>
				{titleAndFilter}
				{checked.length > 0 && statusDeveloperControl}
				{table}
				<Box mx={4}>
					<DefaultPagination
						count={unitsMeta.total_pages}
						onChange={(page) => unitsGetAllWParams({ page })}
						page={unitsMeta.page + 1}
						limit={10}
						totalData={unitsMeta.total}
						visibleCount={unitsMeta.visible}
						// loading={globalcategoryLoading}
					/>
				</Box>
			</Stack>
			{DetailDialog}
		</Stack>
	)
}

export default Unit
