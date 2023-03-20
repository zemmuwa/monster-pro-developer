import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import { LoadingButton } from '@mui/lab'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import DefaultBreadcrumb from '../../../../../../../../../components/breadcrumb/DefaultBreadcrumb'
import AddUnitStepperCard from '../../../../../../../../../components/card/AddUnitStepperCard'
import AutoCompleteAsyncField from '../../../../../../../../../components/field/AutoCompleteAsyncField'
import NumberFormatField from '../../../../../../../../../components/field/NumberFormatField'
import NumberToogleField from '../../../../../../../../../components/field/NumberToogleField'
import ErrorLabel from '../../../../../../../../../components/label/ErrorLabel'
import CustomSkeleton from '../../../../../../../../../components/skeleton/CustomSkeleton'
import CustomTable, {
	ICustomTableHeader,
} from '../../../../../../../../../components/tables/CustomTable'
import UnitDetailTable from '../../../../../../../../../components/tables/UnitDetailTable'
import useApiCUD from '../../../../../../../../../hooks/useApiCUD'
import useFetch from '../../../../../../../../../hooks/useFetch'
import useMenuAppbar from '../../../../../../../../../hooks/useMenuAppbar'
import { IDetailCategoryGet } from '../../../../../../../../../interfaces/interfaceApiDetailCategory'
import { IDeveloperGet } from '../../../../../../../../../interfaces/interfaceApiDeveloper'
import { IGlobalStatusDetailGet } from '../../../../../../../../../interfaces/interfaceApiGlobalStatusDetail'
import { IProjectGet } from '../../../../../../../../../interfaces/interfaceApiProject'
import { ITypeUnitGet } from '../../../../../../../../../interfaces/interfaceApiTypeUnit'
import {
	IUnitBlockFacilityPostBody,
	IUnitBlockGet,
	IUnitBlockPostBody as IUnitBlockPost,
} from '../../../../../../../../../interfaces/interfaceApiUnitBlock'
import { ToastProviderContext } from '../../../../../../../../../providers/ToastProvider'
import unitFormSchemas from '../../../../../../../../../schema/unitFormSchema'
import ENDPOINTS from '../../../../../../../../../utils/constants/endpoints'
import helper from '../../../../../../../../../utils/helper'
import {
	UnitFormValues,
	UnitFormValues2,
	UnitFormValues3,
} from '../../../../../../../../../schema/unitFormSchema'
import {
	IUnitBlockPostBody,
	IUnitDataPricePostBody,
	IUnitFacilityPostBody,
	IUnitPostBody,
} from '../../../../../../../../../interfaces/interfaceApiUnit'
import VariantSection from '../../../../../../../../../components/component-pages/add-unit/VariantSection'
import { ITaxGet } from '../../../../../../../../../interfaces/interfaceApiTax'

const AddUnit: NextPage = () => {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
		getValues,
	} = useForm<UnitFormValues>({
		resolver: yupResolver(unitFormSchemas.unitFormSchema),
	})
	const {
		handleSubmit: handleSubmit2,
		control: control2,
		formState: { errors: errors2 },
		register: register2,
		setValue: setValue2,
		watch: watch2,
		getValues: getValues2,
	} = useForm<UnitFormValues2>({
		resolver: yupResolver(unitFormSchemas.unitFormSchema2),
	})
	const {
		handleSubmit: handleSubmit3,
		control: control3,
		formState: { errors: errors3 },
		register: register3,
		setValue: setValue3,
		watch: watch3,
		getValues: getValues3,
	} = useForm<UnitFormValues3>({
		resolver: yupResolver(unitFormSchemas.unitFormSchema3),
	})
	const router = useRouter()
	const option = useMemo(
		() => ({
			isEdit: router.query?.addUnit?.[0] == 'edit-unit',
			isCopied:
				router.query?.addUnit?.[0] == 'add-unit' && router.query?.addUnit?.[1],
			idUnit: router.query?.addUnit?.[1],
		}),
		[router.query]
	)
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

	const {
		getOne: detailUnitBlockGetOne,
		dataSingle: detailUnitBlockData,
		loading: detailUnitBlockLoading,
	} = useFetch<IUnitBlockGet>(
		ENDPOINTS.UNIT_BLOK_DATA,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const [step, setStep] = useState(0)
	const dataBreadcrumb = [
		{
			label: 'Daftar Proyek',
			path: `/developer/${router.query.id}/project-unit`,
		},
		{
			label: projectData ? projectData.project_name : '',
			path: `/developer/${router.query.id}/project-unit/project/${router.query.projectId}`,
		},
		{
			label: typeUnitData ? typeUnitData.type_unit_name : '',
			path: `/developer/${router.query.id}/project-unit/project/${router.query.projectId}/type-unit/${router.query.typeUnitId}`,
		},
		{
			label:
				router.query?.addUnit?.[0] == 'add-unit' ? 'Tambah Unit' : 'Ubah Unit',
			path: '',
		},
	]
	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
			projectGetOne(('/' + router.query.projectId) as string)
			typeUnitGetOne(('/' + router.query.typeUnitId) as string)
			if (option.idUnit) detailUnitBlockGetOne('/' + option.idUnit)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	const fillForm = () => {
		setValue('master_category_unit', detailUnitBlockData?.master_category)
		setValue('master_certificate_unit', detailUnitBlockData?.master_certificate)
		setValue('map', detailUnitBlockData?.map ?? '')
		setValue(
			'handover_year',
			detailUnitBlockData?.handover_year?.toString() ?? ''
		)
		setValue(
			'unit_facility_previlege',
			detailUnitBlockData?.unit_block_facility
				?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_PREVILEGE_CODE)
				?.map((v) => v.master_detail_category as IDetailCategoryGet) ?? []
		)
		setValue(
			'unit_facility_facilities',
			detailUnitBlockData?.unit_block_facility
				?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_FACILITY_CODE)
				?.map((v) => v.master_detail_category as IDetailCategoryGet) ?? []
		)
		setValue(
			'unit_facility_extra',
			detailUnitBlockData?.unit_block_facility
				?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_EXTRA_CODE)
				?.map((v) => v.master_detail_category as IDetailCategoryGet) ?? []
		)
		setValue(
			'unit_facility_fee',
			detailUnitBlockData?.unit_block_facility
				?.filter((v) => v.type == process.env.NEXT_PUBLIC_UNIT_FREE_CODE)
				?.map((v) => v.master_detail_category as IDetailCategoryGet) ?? []
		)
		setValue('selling_point', detailUnitBlockData?.selling_point ?? '')
		setValue2(
			'utj_price',
			detailUnitBlockData?.unit_block_price
				?.find((v) => v.utj_price)
				?.utj_price?.toString() ?? ''
		)
		const cashData = detailUnitBlockData?.unit_block_price?.find(
			(v) => v.type_payment == 'CASH'
		)
		const isCash = cashData?.unit_nominal?.toString()
		setValue2('unit_data_price_cash_nominal', isCash ?? '')
		setValue2('bphtb_cash', cashData?.bphtb?.toString() ?? '')
		setValue2('other_cash', cashData?.other?.toString() ?? '')
		setValue2('ppn_cash', cashData?.ppn?.toString() ?? '')
		setValue2('discount_cash', cashData?.discount?.toString() ?? '')
		setValue2('include_utj_cash', cashData?.include_utj?.toString() ?? '')
		setValue2(
			'unit_data_price_cash',
			detailUnitBlockData?.unit_block_price?.filter(
				(v) => v.type_payment == 'CASH'
			) ?? []
		)
		setChecBoxPricing((cP) => ({ ...cP, cash: !!isCash }))
		const inHouseData = detailUnitBlockData?.unit_block_price?.find(
			(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
		)
		const isInhouse = inHouseData?.unit_nominal?.toString()
		setValue2('bphtb_inhouse', inHouseData?.bphtb?.toString() ?? '')
		setValue2('other_inhouse', inHouseData?.other?.toString() ?? '')
		setValue2('ppn_inhouse', inHouseData?.ppn?.toString() ?? '')
		setValue2('discount_inhouse', inHouseData?.discount?.toString() ?? '')
		setValue2('include_utj_inhouse', inHouseData?.include_utj?.toString() ?? '')
		setChecBoxPricing((cP) => ({ ...cP, inHouse: !!isInhouse }))
		setValue2(
			'unit_data_price_inhouse',
			detailUnitBlockData?.unit_block_price?.filter(
				(v) => v.type_payment == 'INHOUSE' && !v.dp_percentage
			) ?? []
		)
		const inHouseDpData = detailUnitBlockData?.unit_block_price?.find(
			(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
		)
		const isInhouseDp = inHouseDpData?.unit_nominal?.toString()
		setValue2('bphtb_inhouse_dp', inHouseDpData?.bphtb?.toString() ?? '')
		setValue2('other_inhouse_dp', inHouseDpData?.other?.toString() ?? '')
		setValue2('ppn_inhouse_dp', inHouseDpData?.ppn?.toString() ?? '')
		setValue2('discount_inhouse_dp', inHouseDpData?.discount?.toString() ?? '')
		setValue2(
			'include_utj_inhouse_dp',
			inHouseDpData?.include_utj?.toString() ?? ''
		)
		setChecBoxPricing((cP) => ({ ...cP, inHouseDp: !!isInhouseDp }))
		setValue2(
			'unit_data_price_inhouse_dp',
			detailUnitBlockData?.unit_block_price?.filter(
				(v) => v.type_payment == 'INHOUSE' && v.dp_percentage
			) ?? []
		)
		const kprData = detailUnitBlockData?.unit_block_price?.find(
			(v) => v.type_payment == 'KPR'
		)
		const isKpr = kprData?.unit_nominal?.toString()
		setChecBoxPricing((cP) => ({ ...cP, kpr: !!isKpr }))
		setValue2('unit_data_price_kpr_nominal', isKpr ?? '')
		setValue2('bphtb_kpr', kprData?.bphtb?.toString() ?? '')
		setValue2('other_kpr', kprData?.other?.toString() ?? '')
		setValue2('ppn_kpr', kprData?.ppn?.toString() ?? '')
		setValue2('discount_kpr', kprData?.discount?.toString() ?? '')
		setValue2('include_utj_kpr', kprData?.include_utj?.toString() ?? '')
		setValue2(
			'unit_data_price_kpr',
			detailUnitBlockData?.unit_block_price?.filter(
				(v) => v.type_payment == 'KPR'
			) ?? []
		)
		setValue3('unit_block_data', [
			{
				block_name: detailUnitBlockData?.block_name ?? '',
				block_number: detailUnitBlockData?.block_number?.toString() ?? '',
				development_status: detailUnitBlockData?.development_status,
			},
		])
	}

	useEffect(() => {
		if (detailUnitBlockData) fillForm()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailUnitBlockData])

	const { create: unitCreate, loading: unitLoadingCud } = useApiCUD(
		ENDPOINTS.UNIT_DATA,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	const unitPriceBody: IUnitDataPricePostBody[] = [
		...(getValues2('unit_data_price_cash')?.map((v) => ({
			dp_installment_termin: Number(v?.dp_installment_termin ?? '0'),
			dp_percentage: Number(v?.dp_percentage ?? '0'),
			dp_total: Number(v?.dp_total ?? '0'),
			monthly_installment: Number(v?.monthly_installment ?? '0'),
			payment_termin: Number(v?.payment_termin ?? '0'),
			price_after_dp: Number(v?.price_after_dp ?? '0'),
			type_payment: 'CASH',
			unit_nominal: Number(getValues2('unit_data_price_cash_nominal') ?? '0'),
			utj_price: Number(getValues2('utj_price') ?? '0'),
			ppn: Number(getValues2('ppn_cash') ?? '0'),
			bphtb: Number(getValues2('bphtb_cash') ?? '0'),
			other: Number(getValues2('other_cash') ?? '0'),
			include_utj: Number(getValues2('include_utj_cash') ?? '0'),
			discount: Number(getValues2('discount_cash') ?? '0'),
			unit_nominal_nett: Number(v?.unit_nominal_nett ?? '0'),
			dp_nett: Number(v?.dp_nett ?? '0'),
		})) ?? []),
		...(getValues2('unit_data_price_inhouse')?.map((v) => ({
			dp_installment_termin: Number(v?.dp_installment_termin ?? '0'),
			dp_percentage: Number(v?.dp_percentage ?? '0'),
			dp_total: Number(v?.dp_total ?? '0'),
			monthly_installment: Number(v?.monthly_installment ?? '0'),
			payment_termin: Number(v?.payment_termin ?? '0'),
			price_after_dp: Number(v?.price_after_dp ?? '0'),
			type_payment: 'INHOUSE',
			unit_nominal: Number(v?.unit_nominal ?? '0'),
			utj_price: Number(getValues2('utj_price') ?? '0'),
			ppn: Number(getValues2('ppn_inhouse') ?? '0'),
			bphtb: Number(getValues2('bphtb_inhouse') ?? '0'),
			other: Number(getValues2('other_inhouse') ?? '0'),
			include_utj: Number(getValues2('include_utj_inhouse') ?? '0'),
			discount: Number(getValues2('discount_inhouse') ?? '0'),
			unit_nominal_nett: Number(v?.unit_nominal_nett ?? '0'),
			dp_nett: Number(v?.dp_nett ?? '0'),
		})) ?? []),
		...(getValues2('unit_data_price_inhouse_dp')?.map((v) => ({
			dp_installment_termin: Number(v?.dp_installment_termin ?? '0'),
			dp_percentage: Number(v?.dp_percentage ?? '0'),
			dp_total: Number(v?.dp_total ?? '0'),
			monthly_installment: Number(v?.monthly_installment ?? '0'),
			payment_termin: Number(v?.payment_termin ?? '0'),
			price_after_dp: Number(v?.price_after_dp ?? '0'),
			type_payment: 'INHOUSE',
			unit_nominal: Number(v?.unit_nominal ?? '0'),
			utj_price: Number(getValues2('utj_price') ?? '0'),
			ppn: Number(getValues2('ppn_inhouse_dp') ?? '0'),
			bphtb: Number(getValues2('bphtb_inhouse_dp') ?? '0'),
			other: Number(getValues2('other_inhouse_dp') ?? '0'),
			include_utj: Number(getValues2('include_utj_inhouse_dp') ?? '0'),
			discount: Number(getValues2('discount_inhouse_dp') ?? '0'),
			unit_nominal_nett: Number(v?.unit_nominal_nett ?? '0'),
			dp_nett: Number(v?.dp_nett ?? '0'),
		})) ?? []),
		...(getValues2('unit_data_price_kpr')?.map((v) => ({
			dp_installment_termin: Number(v?.dp_installment_termin ?? '0'),
			dp_percentage: Number(v?.dp_percentage ?? '0'),
			dp_total: Number(v?.dp_total ?? '0'),
			monthly_installment: Number(v?.monthly_installment ?? '0'),
			payment_termin: Number(v?.payment_termin ?? '0'),
			price_after_dp: Number(v?.price_after_dp ?? '0'),
			type_payment: 'KPR',
			unit_nominal: Number(getValues2('unit_data_price_kpr_nominal') ?? '0'),
			utj_price: Number(getValues2('utj_price') ?? '0'),
			ppn: Number(getValues2('ppn_kpr') ?? '0'),
			bphtb: Number(getValues2('bphtb_kpr') ?? '0'),
			other: Number(getValues2('other_kpr') ?? '0'),
			include_utj: Number(getValues2('include_utj_kpr') ?? '0'),
			discount: Number(getValues2('discount_kpr') ?? '0'),
			unit_nominal_nett: Number(v?.unit_nominal_nett ?? '0'),
			dp_nett: Number(v?.dp_total ?? '0'),
		})) ?? []),
	]

	const doSave = async () => {
		const unitFacility: IUnitFacilityPostBody[] = [
			...getValues('unit_facility_previlege').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_PREVILEGE_CODE,
			})),
			...getValues('unit_facility_facilities').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_FACILITY_CODE,
			})),
			...getValues('unit_facility_extra').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_EXTRA_CODE,
			})),
			...getValues('unit_facility_fee').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_FREE_CODE,
			})),
		]

		const unitBlokData: IUnitBlockPostBody[] = [
			...getValues3('unit_block_data').map((v) => ({
				block_name: v.block_name,
				block_number: Number(v?.block_number ?? '0'),
				development_status_id: v.development_status?.id,
			})),
		]

		const body: IUnitPostBody = {
			handover_year: Number(getValues('handover_year')),
			map: getValues('map'),
			selling_point: getValues('selling_point'),
			master_category_unit_id: getValues('master_category_unit')?.id ?? '',
			master_certificate_unit_id:
				getValues('master_certificate_unit')?.id ?? '',
			data_type_unit_id: router.query.typeUnitId as string,
			unit_facility: unitFacility,
			unit_data_price: unitPriceBody,
			unit_block_data: unitBlokData,
		}
		if (!option.isEdit) await doCreate(body)
	}
	const doCreate = async (body: IUnitPostBody) => {
		const res = await unitCreate<IUnitPostBody>(body)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			router.push(
				`/developer/${router.query.id}/project-unit/project/${router.query.projectId}/type-unit/${router.query.typeUnitId}`
			)
		}
	}

	const {
		create: unitBlockCreate,
		edit: unitBlockEdit,
		loading: unitBlockLoadingCud,
	} = useApiCUD(
		ENDPOINTS.UNIT_BLOK_DATA,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const doSaveBlok = async () => {
		const unitFacility: IUnitBlockFacilityPostBody[] = [
			...getValues('unit_facility_previlege').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_PREVILEGE_CODE,
			})),
			...getValues('unit_facility_facilities').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_FACILITY_CODE,
			})),
			...getValues('unit_facility_extra').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_EXTRA_CODE,
			})),
			...getValues('unit_facility_fee').map((v) => ({
				master_detail_category_id: v.id,
				type: process.env.NEXT_PUBLIC_UNIT_FREE_CODE,
			})),
		]

		const body: IUnitBlockPost = {
			master_category_unit_id: getValues('master_category_unit')?.id,
			master_certificate_unit_id: getValues('master_certificate_unit')?.id,
			map: getValues('map'),
			handover_year: Number(getValues('handover_year')),
			selling_point: getValues('selling_point'),
			unit_block_facility: unitFacility,
			unit_block_price: unitPriceBody,
			block_name: getValues3('unit_block_data')?.[0]?.block_name ?? '',
			block_number: Number(
				getValues3('unit_block_data')?.[0]?.block_number ?? '0'
			),
			development_status_id:
				getValues3('unit_block_data')?.[0]?.development_status?.id ?? '',
			unit_data_id: detailUnitBlockData?.unit_data_id,
		}
		if (!option.isEdit) await doCreateBlock(body)
		else await doEditBlock(body)
	}

	const doCreateBlock = async (body: IUnitBlockPost) => {
		const res = await unitBlockCreate<IUnitBlockPost>(body)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			router.push(
				`/developer/${router.query.id}/project-unit/project/${router.query.projectId}/type-unit/${router.query.typeUnitId}`
			)
		}
	}
	const doEditBlock = async (body: IUnitBlockPost) => {
		const res = await unitBlockEdit<IUnitBlockPost>(body, option?.idUnit ?? '')
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			router.push(
				`/developer/${router.query.id}/project-unit/project/${router.query.projectId}/type-unit/${router.query.typeUnitId}`
			)
		}
	}

	const nextForm = () => {
		if (step < 2) setStep((v) => v + 1)
		else if (option.idUnit) doSaveBlok()
		else doSave()
	}

	const renderFirstForm = (
		<Stack>
			<Typography variant="body1" fontWeight={700} color="grey.400" mb={2}>
				Informasi Unit
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Kategori
					</Typography>
					<Box height="10px" />
					<Controller
						control={control}
						name="master_category_unit"
						render={({ field: { onBlur, onChange, value } }) => (
							<AutoCompleteAsyncField
								endpoint={ENDPOINTS.UNIT_CATEGORY}
								servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
								labelKey={'category_name'}
								valueKey={'id'}
								value={value}
								onChange={onChange}
								placeholder="Pilih Kategori"
								error={
									errors.master_category_unit?.message ||
									errors.master_category_unit?.id?.message
								}
								params={{ sort: 'category_name' }}
								searchKey="category_name"
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Jenis Sertifikat
					</Typography>
					<Box height="10px" />
					<Controller
						control={control}
						name="master_certificate_unit"
						render={({ field: { onBlur, onChange, value } }) => (
							<AutoCompleteAsyncField
								endpoint={ENDPOINTS.UNIT_CERTIFICATE}
								servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
								labelKey={'category_name'}
								valueKey={'id'}
								value={value}
								onChange={onChange}
								placeholder="Pilih Sertifikat"
								error={
									errors.master_certificate_unit?.message ||
									errors.master_certificate_unit?.id?.message
								}
								params={{ sort: 'category_name' }}
								searchKey="category_name"
							/>
						)}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Link Google Map
					</Typography>
					<Box height="10px" />
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						placeholder="Tambahkan Link Google Maps"
						{...register('map')}
						helperText={errors.map?.message ?? undefined}
						error={!!errors.map?.message}
					/>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Tahun Serah Terima
					</Typography>
					<Box height="10px" />
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						placeholder="Contoh: 2022"
						{...register('handover_year')}
						helperText={errors.handover_year?.message ?? undefined}
						error={!!errors.handover_year?.message}
					/>
				</Grid>
			</Grid>
			<Typography
				mt={4}
				mb={3}
				variant="body1"
				fontWeight={700}
				color="grey.400"
			>
				Fasilitas dan Keunggulan
			</Typography>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Previlege / Keunggulan Unit
			</Typography>
			<Controller
				control={control}
				name="unit_facility_previlege"
				render={({ field: { onBlur, onChange, value } }) => (
					<AutoCompleteAsyncField
						multiple
						endpoint={ENDPOINTS.UNIT_PREVILEGE}
						servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
						labelKey={'category_name'}
						valueKey={'id'}
						value={value ?? []}
						onChange={onChange}
						placeholder="Pilih Previlege"
						error={errors.unit_facility_previlege?.message}
						params={{ sort: 'category_name' }}
						searchKey="category_name"
					/>
				)}
			/>
			<Typography variant="caption" fontWeight={700} mb="10px" mt={3}>
				Fasilitas
			</Typography>
			<Controller
				control={control}
				name="unit_facility_facilities"
				render={({ field: { onBlur, onChange, value } }) => (
					<AutoCompleteAsyncField
						multiple
						endpoint={ENDPOINTS.UNIT_FACILITY}
						servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
						labelKey={'category_name'}
						valueKey={'id'}
						value={value ?? []}
						onChange={onChange}
						placeholder="Pilih Fasilitas"
						error={errors.unit_facility_facilities?.message}
						params={{ sort: 'category_name' }}
						searchKey="category_name"
					/>
				)}
			/>
			<Typography variant="caption" fontWeight={700} mb="10px" mt={3}>
				Free Extra
			</Typography>
			<Controller
				control={control}
				name="unit_facility_extra"
				render={({ field: { onBlur, onChange, value } }) => (
					<AutoCompleteAsyncField
						multiple
						endpoint={ENDPOINTS.UNIT_EXTRA}
						servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
						labelKey={'category_name'}
						valueKey={'id'}
						value={value ?? []}
						onChange={onChange}
						placeholder="Pilih Free Extra"
						error={errors.unit_facility_extra?.message}
						params={{ sort: 'category_name' }}
						searchKey="category_name"
					/>
				)}
			/>
			<Typography variant="caption" fontWeight={700} mb="10px" mt={3}>
				Free Biaya
			</Typography>
			<Controller
				control={control}
				name="unit_facility_fee"
				render={({ field: { onBlur, onChange, value } }) => (
					<AutoCompleteAsyncField
						multiple
						endpoint={ENDPOINTS.UNIT_FREE}
						servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
						labelKey={'category_name'}
						valueKey={'id'}
						value={value ?? []}
						onChange={onChange}
						placeholder="Pilih Free Biaya"
						error={errors.unit_facility_fee?.message}
						params={{ sort: 'category_name' }}
						searchKey="category_name"
					/>
				)}
			/>
			<Typography variant="caption" fontWeight={700} mb="10px" mt={3}>
				Selling Point
			</Typography>
			<TextField
				sx={{ mb: '16px' }}
				size="small"
				fullWidth
				variant="outlined"
				placeholder="Deskripsikan selling point"
				multiline
				rows={4}
				{...register('selling_point')}
				helperText={errors.selling_point?.message ?? undefined}
				error={!!errors.selling_point?.message}
			/>
			<Button
				sx={{ alignSelf: 'start', mt: 3 }}
				onClick={handleSubmit(nextForm)}
				variant="contained"
			>
				<Typography color="white" fontWeight={700} variant="body2">
					SELANJUTNYA
				</Typography>{' '}
			</Button>
		</Stack>
	)

	const {
		data: ppnData,
		getAll: ppnGetAll,
		loading: ppnLoading,
	} = useFetch<ITaxGet>(
		ENDPOINTS.MASTER_TAX,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)
	useEffect(() => {
		ppnGetAll({ filters: JSON.stringify(['tax_type', 'PPN']) })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const [checkBoxPricing, setChecBoxPricing] = useState({
		cash: false,
		inHouse: false,
		inHouseDp: false,
		kpr: false,
	})

	const addCashData = () => {
		const oldData = [...(getValues2('unit_data_price_cash') ?? [])]
		setValue2('unit_data_price_cash', [
			...oldData,
			{
				dp_percentage: '',
				dp_total: '',
				dp_installment_termin: '',
				monthly_installment: '',
			},
		])
	}
	const delCashData = (index: number) => {
		const oldData = [...(getValues2('unit_data_price_cash') ?? [])]
		setValue2(
			'unit_data_price_cash',
			oldData.filter((filter, filterI) => filterI != index)
		)
	}
	const addInhouseData = () => {
		const oldData = [...(getValues2('unit_data_price_inhouse') ?? [])]
		setValue2('unit_data_price_inhouse', [
			...oldData,
			{
				unit_nominal: '',
				dp_installment_termin: '',
			},
		])
	}
	const delInhouseData = (index: number) => {
		const oldData = [...(getValues2('unit_data_price_inhouse') ?? [])]
		setValue2(
			'unit_data_price_inhouse',
			oldData.filter((filter, filterI) => filterI != index)
		)
	}

	const addInhouseDataDp = () => {
		const oldData = [...(getValues2('unit_data_price_inhouse_dp') ?? [])]
		setValue2('unit_data_price_inhouse_dp', [
			...oldData,
			{
				unit_nominal: '',
				dp_percentage: '',
				dp_total: '',
				price_after_dp: '',
				dp_installment_termin: '1',
				monthly_installment: '',
			},
		])
	}
	const delInhouseDataDp = (index: number) => {
		const oldData = [...(getValues2('unit_data_price_inhouse_dp') ?? [])]
		setValue2(
			'unit_data_price_inhouse_dp',
			oldData.filter((filter, filterI) => filterI != index)
		)
	}

	const addKprData = () => {
		const oldData = [...(getValues2('unit_data_price_kpr') ?? [])]
		setValue2('unit_data_price_kpr', [
			...oldData,
			{
				dp_percentage: '',
				dp_total: '',
				dp_installment_termin: '',
				monthly_installment: '',
			},
		])
	}
	const delKprData = (index: number) => {
		const oldData = [...(getValues2('unit_data_price_kpr') ?? [])]
		setValue2(
			'unit_data_price_kpr',
			oldData.filter((filter, filterI) => filterI != index)
		)
	}

	const calculateCash = () => {
		setValue2('unit_data_price_cash', [
			...(getValues2('unit_data_price_cash')?.map((mapV) => {
				const bruto = Number(getValues2('unit_data_price_cash_nominal'))
				// const bphtbAmount =
				// 	(Number(getValues2('unit_data_price_cash_nominal') ?? '0') *
				// 		Number(getValues2('bphtb_cash') ?? '0')) /
				// 	100
				const otherAmount = Number(getValues2('other_cash') ?? '0')
				const ppnAmount =
					(Number(getValues2('unit_data_price_cash_nominal') ?? '0') *
						Number(getValues2('ppn_cash') ?? '0')) /
					100
				const nominal_net =
					bruto +
					otherAmount +
					ppnAmount -
					((Number(getValues2('discount_cash') ?? '0') ?? 0) +
						(Number(getValues2('include_utj_cash') ?? '0') ?? 0))
				return {
					...mapV,
					include_utj: getValues2('include_utj_cash')
						? Number(getValues2('utj_price'))
						: 0,
					unit_nominal_nett: nominal_net,
					monthly_installment:
						nominal_net / Number(mapV.dp_installment_termin) || 0,
				}
			}) ?? []),
		])
	}

	const calculateInhouseDp = () => {
		setValue2('unit_data_price_inhouse_dp', [
			...(getValues2('unit_data_price_inhouse_dp')?.map((mapV) => {
				const bruto = Number(mapV.unit_nominal ?? '0')
				// const bphtbAmount =
				// 	(bruto * Number(getValues2('bphtb_inhouse_dp') ?? '0')) / 100
				const otherAmount = Number(getValues2('other_inhouse_dp') ?? '0')
				const ppnAmount =
					(bruto * Number(getValues2('ppn_inhouse_dp') ?? '0')) / 100
				const nominalNet = bruto + otherAmount + ppnAmount

				const dpTotal =
					(nominalNet * Number(mapV.dp_percentage ?? '0')) / 100 || 0
				const dpNet =
					dpTotal -
					((Number(getValues2('discount_inhouse_dp') ?? '0') ?? 0) +
						(Number(getValues2('include_utj_inhouse_dp') ?? '0') ?? 0))
				return {
					...mapV,
					unit_nominal_nett: nominalNet,
					dp_total: dpTotal,
					dp_nett: dpNet,
					monthly_installment:
						nominalNet / Number(mapV.dp_installment_termin) || 0,
					include_utj: getValues2('include_utj_inhouse_dp')
						? Number(getValues2('utj_price'))
						: 0,
				}
			}) ?? []),
		])
	}

	const calculateInhouse = () => {
		setValue2('unit_data_price_inhouse', [
			...(getValues2('unit_data_price_inhouse')?.map((mapV) => {
				const bruto = Number(mapV.unit_nominal ?? '0')
				// const bphtbAmount =
				// 	(bruto * Number(getValues2('bphtb_inhouse') ?? '0')) / 100
				const otherAmount = Number(getValues2('other_inhouse') ?? '0')
				const ppnAmount =
					(bruto * Number(getValues2('ppn_inhouse') ?? '0')) / 100

				const sub =
					(Number(getValues2('discount_inhouse') ?? '0') ?? 0) +
					(Number(getValues2('include_utj_inhouse') ?? '0') ?? 0)
				const nominalNet = bruto + otherAmount + ppnAmount - sub
				return {
					...mapV,
					unit_nominal_nett: nominalNet,
					include_utj: getValues2('include_utj_inhouse')
						? Number(getValues2('utj_price'))
						: 0,
					monthly_installment:
						nominalNet / Number(mapV.dp_installment_termin) || 0,
				}
			}) ?? []),
		])
	}

	const calculateKpr = () => {
		setValue2('unit_data_price_kpr', [
			...(getValues2('unit_data_price_kpr')?.map((mapV) => {
				// const bphtbAmount =
				// 	(Number(getValues2('unit_data_price_kpr_nominal') ?? '0') *
				// 		Number(getValues2('bphtb_kpr') ?? '0')) /
				// 	100
				const otherAmount = Number(getValues2('other_kpr') ?? '0')
				const ppnAmount =
					(Number(getValues2('unit_data_price_kpr_nominal') ?? '0') *
						Number(getValues2('ppn_kpr') ?? '0')) /
					100
				const nominalNet =
					Number(getValues2('unit_data_price_kpr_nominal')) +
					otherAmount +
					ppnAmount

				const dpTotal =
					(nominalNet * Number(mapV.dp_percentage ?? '0')) / 100 || 0
				const dpNet =
					dpTotal -
					((Number(getValues2('discount_kpr') ?? '0') ?? 0) +
						(Number(getValues2('include_utj_kpr') ?? '0') ?? 0))
				return {
					...mapV,
					unit_nominal_nett: nominalNet,
					dp_total: dpTotal,
					dp_nett: dpNet,
					include_utj: getValues2('include_utj_kpr')
						? Number(getValues2('utj_price'))
						: 0,
					monthly_installment: dpNet / Number(mapV.dp_installment_termin) || 0,
				}
			}) ?? []),
		])
	}

	const calculateUtj = () => {
		if (getValues2('include_utj_cash')) {
			setValue2('include_utj_cash', getValues2('utj_price'))
			calculateCash()
		}
		if (getValues2('include_utj_inhouse')) {
			setValue2('include_utj_inhouse', getValues2('utj_price'))
			calculateInhouse()
		}
		if (getValues2('include_utj_inhouse_dp')) {
			setValue2('include_utj_inhouse_dp', getValues2('utj_price'))
			calculateInhouseDp()
		}
		if (getValues2('include_utj_kpr')) {
			setValue2('include_utj_kpr', getValues2('utj_price'))
			calculateKpr()
		}
	}

	const cashTableHeader = () => {
		const headers: ICustomTableHeader<IUnitDataPricePostBody>[] = [
			{
				key: 'dp_installment_termin',
				label: 'PEMBAYARAN (KALI)',
				align: 'center',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_cash[${vI}].dp_installment_termin` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								value={value}
								suffix="x"
								onChange={(newVal) => {
									onChange(newVal)
									calculateCash()
								}}
								error={
									errors2.unit_data_price_cash?.[vI]?.dp_installment_termin
										?.message
								}
							/>
						)}
					/>
				),
			},
		]
		if (getValues2('other_cash') || getValues2('ppn_cash')) {
			const add: string[] = []
			// if (getValues2('bphtb_cash'))
			// 	add.push('BPHTB ' + getValues2('bphtb_cash') + '%')
			if (getValues2('other_cash')) add.push('PENAMBAH')
			if (Number(getValues2('ppn_cash') ?? '0') > 0)
				add.push('PPN ' + getValues2('ppn_cash') + '%')
			headers.push({
				key: 'bphtb',
				label: 'PENAMBAH HARGA',
				align: 'center',
				weight: 700,
				render: () => add.join(', '),
			})
		}
		const sub: string[] = []
		if (getValues2('discount_cash')) sub.push('POTONGAN')
		if (getValues2('include_utj_cash')) sub.push('UTJ')
		if (getValues2('discount_cash') || getValues2('include_utj_cash'))
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
					render: (v, vI) => (
						<Controller
							control={control2}
							name={`unit_data_price_cash[${vI}].unit_nominal_nett` as any}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									readonly
									value={watch2(name)}
									onChange={onChange}
									prefix="Rp "
								/>
							)}
						/>
					),
				},
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					render: (v, vI) => (
						<Controller
							control={control2}
							name={`unit_data_price_cash[${vI}].monthly_installment` as any}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									prefix="Rp "
									readonly
									value={watch2(name)}
									onChange={onChange}
									error={
										errors2.unit_data_price_cash?.[vI]?.monthly_installment
											?.message
									}
								/>
							)}
						/>
					),
				},
				{
					key: 'id',
					w: '10%',
					label: 'HAPUS',
					align: 'center',
					noPadding: true,
					render: (v, vI) => (
						<IconButton
							onClick={() => delCashData(vI)}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					),
				},
			] as ICustomTableHeader<IUnitDataPricePostBody>[]),
		]
	}
	const inHouseDpTableHeader = () => {
		let headers: ICustomTableHeader<IUnitDataPricePostBody>[] = [
			{
				sticky: true,
				key: 'unit_nominal',
				label: 'HARGA BRUTO UNIT',
				align: 'center',
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse_dp[${vI}].unit_nominal` as any}
						render={({ field: { onChange, value } }) => (
							<NumberToogleField
								prefix="Rp "
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateInhouseDp()
								}}
								error={
									errors2.unit_data_price_inhouse_dp?.[vI]?.unit_nominal
										?.message
								}
							/>
						)}
					/>
				),
			},
			{
				key: 'dp_percentage',
				label: '% DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse_dp[${vI}].dp_percentage` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								suffix="%"
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateInhouseDp()
								}}
								error={
									errors2.unit_data_price_inhouse_dp?.[vI]?.dp_percentage
										?.message
								}
							/>
						)}
					/>
				),
			},
			{
				key: 'dp_installment_termin',
				label: 'TERMIN',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={
							`unit_data_price_inhouse_dp[${vI}].dp_installment_termin` as any
						}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								suffix="x"
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateInhouseDp()
								}}
								error={
									errors2.unit_data_price_inhouse_dp?.[vI]
										?.dp_installment_termin?.message
								}
							/>
						)}
					/>
				),
			},
		]
		if (getValues2('other_inhouse_dp') || getValues2('ppn_inhouse_dp')) {
			const add: string[] = []
			// if (getValues2('bphtb_inhouse_dp'))
			// 	add.push('BPHTB ' + getValues2('bphtb_inhouse_dp') + '%')
			if (getValues2('other_inhouse_dp')) add.push('PENAMBAH')
			if (Number(getValues2('ppn_inhouse_dp') ?? '0') > 0)
				add.push('PPN ' + getValues2('ppn_inhouse_dp') + '%')
			headers.push({
				w: '200px',
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
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse_dp[${vI}].unit_nominal_nett` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								prefix="Rp "
								readonly
								value={watch2(name)}
								onChange={onChange}
								error={
									errors2.unit_data_price_inhouse_dp?.[vI]?.dp_total?.message
								}
							/>
						)}
					/>
				),
			},
			{
				key: 'dp_total',
				label: 'DP BRUTO',
				align: 'center',
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse_dp[${vI}].dp_total` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								prefix="Rp "
								readonly
								value={watch2(name)}
								onChange={onChange}
								error={
									errors2.unit_data_price_inhouse_dp?.[vI]?.dp_total?.message
								}
							/>
						)}
					/>
				),
			},
		])
		const sub: string[] = []
		if (getValues2('discount_inhouse_dp')) sub.push('POTONGAN')
		if (getValues2('include_utj_inhouse_dp')) sub.push('UTJ')
		if (
			getValues2('discount_inhouse_dp') ||
			getValues2('include_utj_inhouse_dp')
		)
			headers.push({
				w: '200px',
				key: 'discount',
				label: 'PENGURANG DP',
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
					render: (v, vI) => (
						<Controller
							control={control2}
							name={`unit_data_price_inhouse_dp[${vI}].dp_nett` as any}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									prefix="Rp "
									readonly
									value={watch2(name)}
									onChange={onChange}
								/>
							)}
						/>
					),
				},
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					w: '200px',
					render: (v, vI) => (
						<Controller
							control={control2}
							name={
								`unit_data_price_inhouse_dp[${vI}].monthly_installment` as any
							}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									prefix="Rp "
									readonly
									value={watch2(name)}
									onChange={onChange}
									error={
										errors2.unit_data_price_inhouse_dp?.[vI]
											?.monthly_installment?.message
									}
								/>
							)}
						/>
					),
				},
				{
					key: 'id',
					w: '200px',
					label: 'HAPUS',
					align: 'center',
					noPadding: true,
					render: (v, vI) => (
						<IconButton
							onClick={() => delInhouseDataDp(vI)}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					),
				},
			] as ICustomTableHeader<IUnitDataPricePostBody>[]),
		]
	}
	const inHouseTableHeader = () => {
		let headers: ICustomTableHeader<IUnitDataPricePostBody>[] = [
			{
				sticky: true,
				key: 'unit_nominal',
				label: 'HARGA BRUTO UNIT',
				align: 'center',
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse[${vI}].unit_nominal` as any}
						render={({ field: { onChange, value } }) => (
							<NumberToogleField
								prefix="Rp "
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateInhouse()
								}}
								error={
									errors2.unit_data_price_inhouse?.[vI]?.unit_nominal?.message
								}
							/>
						)}
					/>
				),
			},
			{
				key: 'dp_installment_termin',
				label: 'TERMIN INHOUSE',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse[${vI}].dp_installment_termin` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								suffix="x"
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateInhouse()
								}}
								error={
									errors2.unit_data_price_inhouse?.[vI]?.dp_installment_termin
										?.message
								}
							/>
						)}
					/>
				),
			},
		]
		if (getValues2('other_inhouse') || getValues2('ppn_inhouse')) {
			const add: string[] = []
			// if (getValues2('bphtb_inhouse'))
			// 	add.push('BPHTB ' + getValues2('bphtb_inhouse') + '%')
			if (getValues2('other_inhouse')) add.push('PENAMBAH')
			if (Number(getValues2('ppn_inhouse') ?? '0') > 0)
				add.push('PPN ' + getValues2('ppn_inhouse') + '%')
			headers.push({
				w: '200px',
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
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_inhouse[${vI}].unit_nominal_nett` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								prefix="Rp "
								readonly
								value={watch2(name)}
								onChange={onChange}
								error={errors2.unit_data_price_inhouse?.[vI]?.dp_total?.message}
							/>
						)}
					/>
				),
			},
		])
		const sub: string[] = []
		if (getValues2('discount_inhouse')) sub.push('POTONGAN')
		if (getValues2('include_utj_inhouse')) sub.push('UTJ')
		if (getValues2('discount_inhouse') || getValues2('include_utj_inhouse'))
			headers.push({
				w: '200px',
				key: 'discount',
				label: 'PENGURANG DP',
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
					render: (v, vI) => (
						<Controller
							control={control2}
							name={`unit_data_price_inhouse[${vI}].monthly_installment` as any}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									prefix="Rp "
									readonly
									value={watch2(name)}
									onChange={onChange}
									error={
										errors2.unit_data_price_inhouse?.[vI]?.monthly_installment
											?.message
									}
								/>
							)}
						/>
					),
				},
				{
					key: 'id',
					w: '200px',
					label: 'HAPUS',
					align: 'center',
					noPadding: true,
					render: (v, vI) => (
						<IconButton
							onClick={() => delInhouseData(vI)}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					),
				},
			] as ICustomTableHeader<IUnitDataPricePostBody>[]),
		]
	}
	const kprTableHeader = () => {
		let headers: ICustomTableHeader<IUnitDataPricePostBody>[] = [
			{
				key: 'dp_percentage',
				label: '% DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_kpr[${vI}].dp_percentage` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								suffix="%"
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateKpr()
								}}
								error={
									errors2.unit_data_price_kpr?.[vI]?.dp_percentage?.message
								}
							/>
						)}
					/>
				),
			},
			{
				key: 'dp_installment_termin',
				label: 'CICILAN DP',
				align: 'center',
				sticky: true,
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_kpr[${vI}].dp_installment_termin` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								suffix="x"
								value={value}
								onChange={(newVal) => {
									onChange(newVal)
									calculateKpr()
								}}
								error={
									errors2.unit_data_price_kpr?.[vI]?.dp_installment_termin
										?.message
								}
							/>
						)}
					/>
				),
			},
		]
		if (getValues2('other_kpr') || getValues2('ppn_kpr')) {
			const add: string[] = []
			// if (getValues2('bphtb_kpr'))
			// 	add.push('BPHTB ' + getValues2('bphtb_kpr') + '%')
			if (getValues2('other_kpr')) add.push('PENAMBAH')
			if (Number(getValues2('ppn_kpr') ?? '0') > 0)
				add.push('PPN ' + getValues2('ppn_kpr') + '%')
			headers.push({
				w: '200px',
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
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_kpr[${vI}].unit_nominal_nett` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								prefix="Rp "
								readonly
								value={watch2(name)}
								onChange={onChange}
								error={errors2.unit_data_price_kpr?.[vI]?.dp_total?.message}
							/>
						)}
					/>
				),
			},
			{
				key: 'dp_total',
				label: 'DP BRUTO',
				align: 'center',
				w: '200px',
				render: (v, vI) => (
					<Controller
						control={control2}
						name={`unit_data_price_kpr[${vI}].dp_total` as any}
						render={({ field: { onChange, value, name } }) => (
							<NumberToogleField
								prefix="Rp "
								readonly
								value={watch2(name)}
								onChange={onChange}
								error={errors2.unit_data_price_kpr?.[vI]?.dp_total?.message}
							/>
						)}
					/>
				),
			},
		])
		const sub: string[] = []
		if (getValues2('discount_kpr')) sub.push('POTONGAN')
		if (getValues2('include_utj_kpr')) sub.push('UTJ')
		if (getValues2('discount_kpr') || getValues2('include_utj_kpr'))
			headers.push({
				w: '200px',
				key: 'discount',
				label: 'PENGURANG DP',
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
					render: (v, vI) => (
						<Controller
							control={control2}
							name={`unit_data_price_kpr[${vI}].dp_nett` as any}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									prefix="Rp "
									readonly
									value={watch2(name)}
									onChange={onChange}
								/>
							)}
						/>
					),
				},
				{
					key: 'monthly_installment',
					label: 'CICILAN PER-BULAN',
					align: 'center',
					w: '200px',
					render: (v, vI) => (
						<Controller
							control={control2}
							name={`unit_data_price_kpr[${vI}].monthly_installment` as any}
							render={({ field: { onChange, value, name } }) => (
								<NumberToogleField
									prefix="Rp "
									readonly
									value={watch2(name)}
									onChange={onChange}
									error={
										errors2.unit_data_price_kpr?.[vI]?.monthly_installment
											?.message
									}
								/>
							)}
						/>
					),
				},
				{
					key: 'id',
					w: '200px',
					label: 'HAPUS',
					align: 'center',
					noPadding: true,
					render: (v, vI) => (
						<IconButton
							onClick={() => delKprData(vI)}
							color="error"
							size="small"
						>
							<DeleteIcon />
						</IconButton>
					),
				},
			] as ICustomTableHeader<IUnitDataPricePostBody>[]),
		]
	}

	const renderSecondForm = (
		<Stack>
			<Typography variant="body1" fontWeight={700} color="grey.400" mb={1}>
				Harga & Pembayaran
			</Typography>
			<Typography variant="caption" fontWeight={600} color="grey.400" mb={2}>
				Masukkan harga dan pembayaran Unit Anda. Harga disini yang akan
				ditampilkan di aplikasi
			</Typography>
			<Typography variant="caption" fontWeight={700} mb="10px">
				Harga UTJ
			</Typography>
			<Controller
				control={control2}
				name="utj_price"
				render={({ field: { onChange, value, onBlur } }) => (
					<NumberFormatField
						value={value}
						startAdornment={<Typography>Rp</Typography>}
						onChange={(v) => {
							onChange(v)
							calculateUtj()
						}}
						error={errors2.utj_price?.message}
					/>
				)}
			/>

			<Stack direction="row" alignItems="center" mt={3} mb={1} spacing={1}>
				<Checkbox
					checked={checkBoxPricing.cash}
					onChange={(ev, val) => {
						if (!val) {
							setValue2('unit_data_price_cash', [])
							setValue2('ppn_cash', '')
							setValue2('bphtb_cash', '')
							setValue2('discount_cash', '')
							setValue2('include_utj_cash', '')
							setValue2('other_cash', '')
						}
						setChecBoxPricing((cP) => ({ ...cP, cash: val }))
					}}
					size="small"
					sx={{ p: 0 }}
				/>
				<Typography variant="body2" fontWeight={700}>
					Cash
				</Typography>
			</Stack>
			{checkBoxPricing.cash && (
				<Stack border="0.5px solid #E2E8F0" p={2} mt={3} borderRadius="15px">
					<Typography variant="body2" fontWeight={700} mb="10px">
						Harga Bruto Unit
					</Typography>
					<Controller
						control={control2}
						name="unit_data_price_cash_nominal"
						render={({ field: { onChange, value, onBlur } }) => (
							<NumberFormatField
								value={value}
								startAdornment={<Typography>Rp</Typography>}
								onChange={(v) => {
									onChange(v)
									calculateCash()
								}}
								error={errors2.unit_data_price_cash_nominal?.message}
							/>
						)}
					/>
					<Box height={20} />
					<VariantSection
						valuePpnMaster={Number(ppnData?.[0]?.value ?? '0')}
						valuePpn={Number(getValues2('ppn_cash') ?? '0')}
						valueDiscount={getValues2('discount_cash')}
						valueUtjMaster={Number(getValues2('utj_price') ?? '0')}
						valueUtj={Number(getValues2('include_utj_cash') ?? '0')}
						valueOther={getValues2('other_cash')}
						onChangeUtj={(v) => {
							setValue2('include_utj_cash', v)
							calculateCash()
						}}
						onChangeDiscount={(v) => {
							setValue2('discount_cash', v)
							calculateCash()
						}}
						onChangePpn={(v) => {
							setValue2('ppn_cash', v)
							calculateCash()
						}}
						valueBphtbPercent={getValues2('bphtb_cash') ?? ''}
						valueBphtbAmount={
							(Number(getValues2('unit_data_price_cash_nominal') ?? '0') *
								Number(getValues2('bphtb_cash') ?? '0')) /
							100
						}
						onChangeBphtbPercent={(v) => {
							setValue2('bphtb_cash', v)
							calculateCash()
						}}
						onChangeOther={(v) => {
							setValue2('other_cash', v)
							calculateCash()
						}}
						errorOther={errors2.other_cash?.message}
						errorDiscount={errors2.discount_cash?.message}
					/>
					<Typography variant="body2" fontWeight={700} mb={2}>
						Tabel Harga
					</Typography>
					<CustomTable
						headers={cashTableHeader()}
						data={watch2('unit_data_price_cash') ?? []}
						stickyLastCol
					/>
					<Button
						onClick={addCashData}
						startIcon={<AddIcon />}
						size="small"
						variant="text"
						sx={{ fontWeight: 600, alignSelf: 'start', mt: 2 }}
					>
						Tambah Harga
					</Button>
				</Stack>
			)}
			<Stack direction="row" alignItems="center" mt={3} mb={1} spacing={1}>
				<Checkbox
					checked={checkBoxPricing.inHouse}
					onChange={(ev, val) => {
						if (!val) {
							setValue2('unit_data_price_inhouse', [])
							setValue2('ppn_inhouse', '')
							setValue2('bphtb_inhouse', '')
							setValue2('discount_inhouse', '')
							setValue2('include_utj_inhouse', '')
							setValue2('other_inhouse', '')
						}
						setChecBoxPricing((cP) => ({ ...cP, inHouse: val }))
					}}
					size="small"
					sx={{ p: 0 }}
				/>
				<Typography variant="body2" fontWeight={700}>
					In-House - Tanpa DP
				</Typography>
			</Stack>
			{checkBoxPricing.inHouse && (
				<Stack border="0.5px solid #E2E8F0" p={2} mt={3} borderRadius="15px">
					<VariantSection
						hideBphtpAmount
						valuePpnMaster={Number(ppnData?.[0]?.value ?? '0')}
						valuePpn={Number(getValues2('ppn_inhouse') ?? '0')}
						valueDiscount={getValues2('discount_inhouse')}
						valueUtjMaster={Number(getValues2('utj_price') ?? '0')}
						valueUtj={Number(getValues2('include_utj_inhouse') ?? '0')}
						valueOther={getValues2('other_inhouse')}
						onChangeUtj={(v) => {
							setValue2('include_utj_inhouse', v)
							calculateInhouse()
						}}
						onChangeDiscount={(v) => {
							setValue2('discount_inhouse', v)
							calculateInhouse()
						}}
						onChangePpn={(v) => {
							setValue2('ppn_inhouse', v)
							calculateInhouse()
						}}
						valueBphtbPercent={getValues2('bphtb_inhouse') ?? ''}
						valueBphtbAmount={0}
						onChangeBphtbPercent={(v) => {
							setValue2('bphtb_inhouse', v)
							calculateInhouse()
						}}
						onChangeOther={(v) => {
							setValue2('other_inhouse', v)
							calculateInhouse()
						}}
						errorOther={errors2.other_inhouse?.message}
						errorDiscount={errors2.discount_inhouse?.message}
					/>
					<Typography variant="body2" fontWeight={700} mb={2}>
						Tabel Harga
					</Typography>

					<CustomTable
						headers={inHouseTableHeader()}
						data={watch2('unit_data_price_inhouse') ?? []}
						stickyLastCol
					/>
					<Button
						onClick={addInhouseData}
						startIcon={<AddIcon />}
						size="small"
						variant="text"
						sx={{ fontWeight: 600, alignSelf: 'start', mt: 2 }}
					>
						Tambah Harga
					</Button>
				</Stack>
			)}
			<Stack direction="row" alignItems="center" mt={3} mb={1} spacing={1}>
				<Checkbox
					checked={checkBoxPricing.inHouseDp}
					onChange={(ev, val) => {
						if (!val) {
							setValue2('unit_data_price_inhouse_dp', [])
							setValue2('ppn_inhouse_dp', '')
							setValue2('bphtb_inhouse_dp', '')
							setValue2('discount_inhouse_dp', '')
							setValue2('include_utj_inhouse_dp', '')
							setValue2('other_inhouse_dp', '')
						}
						setChecBoxPricing((cP) => ({ ...cP, inHouseDp: val }))
					}}
					size="small"
					sx={{ p: 0 }}
				/>
				<Typography variant="body2" fontWeight={700}>
					In-House - Dengan DP
				</Typography>
			</Stack>
			{checkBoxPricing.inHouseDp && (
				<Stack border="0.5px solid #E2E8F0" p={2} mt={3} borderRadius="15px">
					<VariantSection
						hideBphtpAmount
						valuePpnMaster={Number(ppnData?.[0]?.value ?? '0')}
						valuePpn={Number(getValues2('ppn_inhouse_dp') ?? '0')}
						valueDiscount={getValues2('discount_inhouse_dp')}
						valueUtjMaster={Number(getValues2('utj_price') ?? '0')}
						valueUtj={Number(getValues2('include_utj_inhouse_dp') ?? '0')}
						valueOther={getValues2('other_inhouse_dp')}
						onChangeUtj={(v) => {
							setValue2('include_utj_inhouse_dp', v)
							calculateInhouseDp()
						}}
						onChangeDiscount={(v) => {
							setValue2('discount_inhouse_dp', v)
							calculateInhouseDp()
						}}
						onChangePpn={(v) => {
							setValue2('ppn_inhouse_dp', v)
							calculateInhouseDp()
						}}
						valueBphtbPercent={getValues2('bphtb_inhouse_dp') ?? ''}
						valueBphtbAmount={0}
						onChangeBphtbPercent={(v) => {
							setValue2('bphtb_inhouse_dp', v)
							calculateInhouseDp()
						}}
						onChangeOther={(v) => {
							setValue2('other_inhouse_dp', v)
							calculateInhouseDp()
						}}
						errorOther={errors2.other_inhouse_dp?.message}
						errorDiscount={errors2.discount_inhouse_dp?.message}
					/>
					<Typography variant="body2" fontWeight={700} mb={2}>
						Tabel Harga
					</Typography>
					<CustomTable
						headers={inHouseDpTableHeader()}
						data={watch2('unit_data_price_inhouse_dp') ?? []}
						stickyLastCol
					/>
					<Button
						onClick={addInhouseDataDp}
						startIcon={<AddIcon />}
						size="small"
						variant="text"
						sx={{ fontWeight: 600, alignSelf: 'start', mt: 2 }}
					>
						Tambah Harga
					</Button>
				</Stack>
			)}
			<Stack direction="row" alignItems="center" mt={3} mb={1} spacing={1}>
				<Checkbox
					checked={checkBoxPricing.kpr}
					onChange={(ev, val) => {
						if (!val) {
							setValue2('unit_data_price_kpr', [])
							setValue2('ppn_kpr', '')
							setValue2('bphtb_kpr', '')
							setValue2('discount_kpr', '')
							setValue2('include_utj_kpr', '')
							setValue2('other_kpr', '')
						}
						setChecBoxPricing((cP) => ({ ...cP, kpr: val }))
					}}
					size="small"
					sx={{ p: 0 }}
				/>
				<Typography variant="body2" fontWeight={700}>
					KPR
				</Typography>
			</Stack>
			{checkBoxPricing.kpr && (
				<Stack border="0.5px solid #E2E8F0" p={2} mt={3} borderRadius="15px">
					<Typography variant="body2" fontWeight={700} mb="10px">
						Harga Unit
					</Typography>
					<Controller
						control={control2}
						name="unit_data_price_kpr_nominal"
						render={({ field: { onChange, value, onBlur } }) => (
							<NumberFormatField
								value={value}
								startAdornment={<Typography>Rp</Typography>}
								onChange={(v) => {
									onChange(v)
									calculateKpr()
								}}
								error={errors2.unit_data_price_kpr_nominal?.message}
							/>
						)}
					/>
					<Box height={20} />
					<VariantSection
						valuePpnMaster={Number(ppnData?.[0]?.value ?? '0')}
						valuePpn={Number(getValues2('ppn_kpr') ?? '0')}
						valueDiscount={getValues2('discount_kpr')}
						valueUtjMaster={Number(getValues2('utj_price') ?? '0')}
						valueUtj={Number(getValues2('include_utj_kpr') ?? '0')}
						valueOther={getValues2('other_kpr')}
						onChangeUtj={(v) => {
							setValue2('include_utj_kpr', v)
							calculateKpr()
						}}
						onChangeDiscount={(v) => {
							setValue2('discount_kpr', v)
							calculateKpr()
						}}
						onChangePpn={(v) => {
							setValue2('ppn_kpr', v)
							calculateKpr()
						}}
						valueBphtbPercent={getValues2('bphtb_kpr') ?? ''}
						valueBphtbAmount={
							(Number(getValues2('unit_data_price_kpr_nominal') ?? '0') *
								Number(getValues2('bphtb_kpr') ?? '0')) /
							100
						}
						onChangeBphtbPercent={(v) => {
							setValue2('bphtb_kpr', v)
							calculateKpr()
						}}
						onChangeOther={(v) => {
							setValue2('other_kpr', v)
							calculateKpr()
						}}
						errorOther={errors2.other_kpr?.message}
						errorDiscount={errors2.discount_kpr?.message}
					/>

					<Typography variant="body2" fontWeight={700} mb={2}>
						Tabel Harga
					</Typography>
					<CustomTable
						headers={kprTableHeader()}
						data={watch2('unit_data_price_kpr') ?? []}
						stickyLastCol
					/>
					<Button
						onClick={addKprData}
						startIcon={<AddIcon />}
						size="small"
						variant="text"
						sx={{ fontWeight: 600, alignSelf: 'start', mt: 2 }}
					>
						Tambah Harga
					</Button>
				</Stack>
			)}
			{!!errors2.unit_data_price_cash?.message && (
				<ErrorLabel>
					Isi Data Minimal Salah Satu dari Cash, In-House, atau KPR
				</ErrorLabel>
			)}
			<Stack direction="row" spacing={2} mt={3}>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={handleSubmit2(nextForm, (v) => console.log(v))}
					variant="contained"
				>
					<Typography color="white" fontWeight={700} variant="body2">
						SELANJUTNYA
					</Typography>{' '}
				</Button>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={() => setStep(step - 1)}
					variant="contained"
					color="inherit"
				>
					<Typography color="grey.400" fontWeight={700} variant="body2">
						KEMBALI
					</Typography>{' '}
				</Button>
			</Stack>
		</Stack>
	)

	const [blokChecked, setBlokChecked] = useState<number[]>([])
	const handleBlokChecked = (item: any, value: boolean, index: number) => {
		if (value) setBlokChecked((v) => [...v, index])
		else setBlokChecked((v) => v.filter((filterItem) => filterItem != index))
	}

	const addBlokData = () => {
		setBlokChecked([])
		const oldData = [...(getValues3('unit_block_data') ?? [])]
		setValue3('unit_block_data', [
			...oldData,
			{
				block_name: '',
				block_number: '',
			},
		])
	}
	const delBlokData = (index: number) => {
		setBlokChecked([])
		const oldData = [...(getValues3('unit_block_data') ?? [])]
		setValue3(
			'unit_block_data',
			oldData.filter((filter, filterI) => filterI != index)
		)
	}

	const blokTable = (
		<>
			<Box px={4} mt={2}>
				<UnitDetailTable
					data={watch3('unit_block_data') ?? []}
					loading={false}
					headers={[
						{
							key: 'block_name',
							label: 'Blok',
							weight: 700,
							align: 'center',
							render: (v, vI) => (
								<TextField
									size="small"
									{...register3(`unit_block_data[${vI}].block_name` as any)}
									error={!!errors3.unit_block_data?.[vI]?.block_name?.message}
									helperText={
										errors3.unit_block_data?.[vI]?.block_name?.message
									}
								/>
							),
						},
						{
							key: 'block_number',
							label: 'Nomor',
							weight: 700,
							align: 'center',
							render: (v, vI) => (
								<TextField
									size="small"
									{...register3(`unit_block_data[${vI}].block_number` as any)}
									error={!!errors3.unit_block_data?.[vI]?.block_number?.message}
									helperText={
										errors3.unit_block_data?.[vI]?.block_number?.message
									}
								/>
							),
						},
						{
							key: 'development_status',
							label: 'Status Pembangunan',
							weight: 700,
							align: 'center',
							noPadding: true,
							render: (v, vI) => (
								<Controller
									control={control3}
									name={`unit_block_data[${vI}].development_status` as any}
									render={({ field: { onChange, value } }) => (
										<AutoCompleteAsyncField
											endpoint={ENDPOINTS.UNIT_BLOK_STATUS}
											servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
											labelKey={'status_name'}
											valueKey={'id'}
											value={watch3(
												`unit_block_data[${vI}].development_status` as any
											)}
											onChange={onChange}
											error={
												errors3.unit_block_data?.[vI]?.development_status
													?.message ||
												errors3.unit_block_data?.[vI]?.development_status?.id
													?.message
											}
											params={{ sort: 'status_name' }}
											searchKey="status_name"
										/>
									)}
								/>
							),
						},
						{
							key: 'id',
							label: 'Hapus',
							align: 'center',
							noPadding: true,
							w: '10%',
							render: (v, vI) => (
								<IconButton
									disabled={!!option.idUnit}
									onClick={() => delBlokData(vI)}
									color="error"
									size="small"
								>
									<DeleteIcon />
								</IconButton>
							),
						},
					]}
					dataChecked={blokChecked}
					onCheck={handleBlokChecked}
					highlightKey={'id'}
					highlightValue={'no'}
				/>
			</Box>
			{!option.idUnit && (
				<Button
					onClick={addBlokData}
					sx={{ alignSelf: 'start', mx: 4, mt: 1 }}
					startIcon={<AddIcon />}
				>
					<Typography fontWeight={700} variant="body2">
						Tambah blok/nomor
					</Typography>
				</Button>
			)}
		</>
	)

	const [statusBlok, setStatusBlok] = useState<
		IGlobalStatusDetailGet | undefined
	>(undefined)

	const onChangeStatusCheck = (val?: IGlobalStatusDetailGet) => {
		const oldValBlok = [...(getValues3('unit_block_data') ?? [])]
		blokChecked.forEach((valFe) => {
			oldValBlok[valFe].development_status = val
		})
		setValue3('unit_block_data', oldValBlok)
		setStatusBlok(undefined)
		setBlokChecked([])
	}
	const statusDeveloperControl = (
		<Stack direction="row" px={4} alignItems="center" spacing={2}>
			<Typography variant="caption">Status Pembangunan: </Typography>
			<Box width="200px">
				<AutoCompleteAsyncField
					endpoint={ENDPOINTS.UNIT_BLOK_STATUS}
					servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
					labelKey={'status_name'}
					valueKey={'id'}
					value={statusBlok}
					onChange={onChangeStatusCheck}
					error={undefined}
					params={{ sort: 'status_name' }}
					searchKey="status_name"
				/>
			</Box>
		</Stack>
	)

	const renderThirdForm = (
		<Stack>
			<Typography variant="body1" fontWeight={700} color="grey.400" mb={2}>
				Blok dan Nomor Unit yang akan ditambahkan
			</Typography>
			{blokChecked.length > 0 && statusDeveloperControl}
			{blokTable}
			<Stack direction="row" spacing={2} mt={3}>
				<LoadingButton
					loading={unitLoadingCud || unitBlockLoadingCud}
					sx={{ alignSelf: 'start' }}
					onClick={handleSubmit3(nextForm, (v) => console.log(v))}
					variant="contained"
				>
					<Typography color="white" fontWeight={700} variant="body2">
						SIMPAN
					</Typography>{' '}
				</LoadingButton>
				<Button
					sx={{ alignSelf: 'start' }}
					onClick={() => setStep(step - 1)}
					variant="contained"
					color="inherit"
				>
					<Typography color="grey.400" fontWeight={700} variant="body2">
						KEMBALI
					</Typography>{' '}
				</Button>
			</Stack>
		</Stack>
	)

	const renderFormByStep = () => {
		if (step == 0) return renderFirstForm
		if (step == 1) return renderSecondForm
		if (step == 2) return renderThirdForm
	}
	return (
		<Stack height={'100%'}>
			<DefaultBreadcrumb data={dataBreadcrumb} />
			<Grid spacing={1} container sx={{ px: 4 }} flexGrow={1} overflow="auto">
				<Grid container item md={4} xs={12} lg={3}>
					<AddUnitStepperCard value={step} onChange={setStep} />
				</Grid>
				<Grid
					item
					md={8}
					xs={12}
					lg={9}
					flexDirection="column"
					display={'flex'}
				>
					<CustomSkeleton
						width="100%"
						loading={detailUnitBlockLoading || !router.query.id}
					>
						<Stack spacing={2}>
							{option.isCopied && (
								<Stack
									borderRadius={3}
									p={2}
									bgcolor={'primary.200'}
									spacing={1.5}
									direction="row"
								>
									<ContentCopyIcon color="primary" />
									<Typography variant="body1" fontWeight={700}>
										Copied from Unit {detailUnitBlockData?.block_name}
										{detailUnitBlockData?.block_number}
									</Typography>
								</Stack>
							)}
							<Box
								borderRadius="12px"
								p={3}
								boxShadow={1}
								bgcolor="background.paper"
								mb={1}
							>
								{renderFormByStep()}
							</Box>
						</Stack>
					</CustomSkeleton>
				</Grid>
			</Grid>
		</Stack>
	)
}

export default AddUnit
