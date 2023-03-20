import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import React, { ReactNode, useContext, useEffect, useMemo } from 'react'
import DefaultBreadcrumb from '../../../../../../../../components/breadcrumb/DefaultBreadcrumb'
import AutoCompleteAsyncField from '../../../../../../../../components/field/AutoCompleteAsyncField'
import UploadImageField from '../../../../../../../../components/field/UploadImageField'
import useMenuAppbar from '../../../../../../../../hooks/useMenuAppbar'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import RoundedChip from '../../../../../../../../components/chip/RoundedChip'
import UploadFileField from '../../../../../../../../components/field/UploadFileField'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import NumberFormatField from '../../../../../../../../components/field/NumberFormatField'
import { ToastProviderContext } from '../../../../../../../../providers/ToastProvider'
import { IDeveloperGet } from '../../../../../../../../interfaces/interfaceApiDeveloper'
import useFetch from '../../../../../../../../hooks/useFetch'
import ENDPOINTS from '../../../../../../../../utils/constants/endpoints'
import helper from '../../../../../../../../utils/helper'
import {
	ITypeUnitDocumentPostBody,
	ITypeUnitGet,
	ITypeUnitPostBody,
} from '../../../../../../../../interfaces/interfaceApiTypeUnit'
import typeUnitFormSchema, {
	TypeUnitFormValues,
} from '../../../../../../../../schema/typeUnitFormSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { IDocumentGroupGet } from '../../../../../../../../interfaces/interfaceApiDocumentGroup'
import UploadGalleryImageField from '../../../../../../../../components/field/UploadGalleryImageField'
import Autocomplete from '@mui/material/Autocomplete'
import useApiCUD from '../../../../../../../../hooks/useApiCUD'
import CustomSkeleton from '../../../../../../../../components/skeleton/CustomSkeleton'
import LoadingButton from '@mui/lab/LoadingButton'
import AutoCompleteField from '../../../../../../../../components/field/AutoCompleteField'

function AddTypeUnit() {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		getValues,
		register,
		watch,
	} = useForm<TypeUnitFormValues>({
		resolver: yupResolver(typeUnitFormSchema),
	})
	const router = useRouter()
	const isEdit = router.query?.cuTypeUnit?.[0] == 'edit-type-unit'
	const typeUnitId = router.query?.cuTypeUnit?.[1]
	const { setCompanyApp } = useMenuAppbar()
	const dataBreadcrumb = [
		{
			label: 'Daftar Proyek',
			path: `/developer/${router.query.id}/project-unit`,
		},
		{ label: isEdit ? 'Ubah Type Unit' : 'Tambah Type Unit', path: '' },
	]

	const { dataSingle: developerData, getOne: developerGetOne } =
		useFetch<IDeveloperGet>(
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
		dataSingle: typeUnitData,
		getOne: typeUnitGetOne,
		loading: typeUnitLoading,
	} = useFetch<ITypeUnitGet>(
		ENDPOINTS.TYPE_UNIT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)

	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
			if (typeUnitId) typeUnitGetOne('/' + typeUnitId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	const fillForm = () => {
		setValue('image_thumbnail', {
			id: typeUnitData?.image_thumbnail_id,
			url: helper.fileUrl(typeUnitData?.image_thumbnail_url ?? ''),
		})
		setValue('plot_plan', {
			id: typeUnitData?.plot_plan_id,
			url: typeUnitData?.plot_plan_url?helper.fileUrl(typeUnitData?.plot_plan_url ?? ''):'',
		})
		setValue('type_unit_name', typeUnitData?.type_unit_name ?? '')
		setValue('location', typeUnitData?.location ?? '')
		setValue('blt', typeUnitData?.cash_bonus?.toString() ?? '0')
		setValue('fee_agent', typeUnitData?.fee_agent?.toString() ?? '0')
		setValue('optional_data_cluster', typeUnitData?.optional_data_cluster)
		setValue(
			'land_area',
			typeUnitData?.unit_spec_data?.land_area?.toString() ?? '0'
		)
		setValue(
			'building_area',
			typeUnitData?.unit_spec_data?.building_area?.toString() ?? '0'
		)
		setValue(
			'number_of_bedroom',
			typeUnitData?.unit_spec_data?.number_of_bedroom?.toString() ?? '0'
		)
		setValue(
			'number_of_bathroom',
			typeUnitData?.unit_spec_data?.number_of_bathroom?.toString() ?? '0'
		)
		setValue(
			'floor_level',
			typeUnitData?.unit_spec_data?.floor_level?.toString() ?? '0'
		)
		setValue('id_spec', typeUnitData?.unit_spec_data?.id ?? ''),
			setValue(
				'type_unit_gallery',
				typeUnitData?.unit_type_gallery_data?.map((v) => ({
					gallery_type: v.gallery_type,
					id: v.gallery_id,
					url: helper.fileUrl(v.gallery_url),
					id_gallery: v?.id ?? '',
				})) ?? []
			)
	}

	useEffect(() => {
		if (typeUnitData) {
			fillForm()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typeUnitData])
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
			process.env.NEXT_PUBLIC_TYPE_UNIT_SUPPORT_DOCUMENT_CODE,
		])

		await documnetSupportGetAll(queryParams)
	}
	useEffect(() => {
		documentSupportGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setValue(
			'type_unit_support_document',
			supportDocuments?.map((type) => {
				const findDoc = typeUnitData?.data_type_unit_support_documents?.find(
					(doc) => doc.master_document_type_id == type.id
				)

				return (
					({
						id: typeUnitData ? findDoc?.id ?? null : null,
						document_id: typeUnitData ? findDoc?.document_id ?? '' : '',
						// document_id: '',
						document_url: typeUnitData
							? helper.fileUrl(findDoc?.document_url ?? '')
							: '',
						// document_url: '',
						master_document_type_id: type.id,
					} as ITypeUnitDocumentPostBody) ?? []
				)
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supportDocuments, typeUnitData])

	const {
		create: typeUnitCreate,
		loading: typeUnitLoadingCud,
		edit: typeUnitEdit,
	} = useApiCUD(ENDPOINTS.TYPE_UNIT, process.env.NEXT_PUBLIC_DEVELOPER_PATH)

	const doSave = async (values: TypeUnitFormValues) => {
		const body: ITypeUnitPostBody = {
			image_thumbnail_id: getValues('image_thumbnail')?.id,
			image_thumbnail_url: helper.filePath(
				getValues('image_thumbnail')?.url ?? ''
			),
			plot_plan_id: getValues('plot_plan')?.id,
			plot_plan_url: helper.filePath(getValues('plot_plan')?.url ?? ''),
			type_unit_name: getValues('type_unit_name'),
			location: getValues('location'),
			optional_data_cluster_id: getValues('optional_data_cluster')?.id,
			unit_spec_data: {
				id: getValues('id_spec') ?? null,
				building_area: Number(getValues('building_area') ?? '0'),
				floor_level: Number(getValues('floor_level') ?? '0'),
				land_area: Number(getValues('land_area') ?? '0'),
				number_of_bathroom: Number(getValues('number_of_bathroom') ?? '0'),
				number_of_bedroom: Number(getValues('number_of_bedroom') ?? '0'),
			},
			data_type_unit_support_documents: getValues(
				'type_unit_support_document'
			)?.map((v) => ({
				...v,
				document_url: helper.filePath(v?.document_url ?? ''),
			})),
			cash_bonus: Number(getValues('blt') ?? '0'),
			fee_agent: Number(getValues('fee_agent') ?? '0'),
			developer_project_data_id: router.query.projectId as string,
			unit_type_gallery_data:
				getValues('type_unit_gallery')?.map((v) => ({
					id: v.id_gallery,
					gallery_id: v?.id ?? '',
					gallery_type: v?.gallery_type ?? '',
					gallery_url: helper.filePath(v?.url ?? '') ?? '',
				})) ?? [],
		}
		if (isEdit) await doUpdate(body)
		else await doCreate(body)
	}
	const doCreate = async (body: ITypeUnitPostBody) => {
		const res = await typeUnitCreate<ITypeUnitPostBody>(body)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			router.push(
				`/developer/${router.query.id}/project-unit/project/${router.query.projectId}`
			)
		}
	}

	const doUpdate = async (body: ITypeUnitPostBody) => {
		const res = await typeUnitEdit<ITypeUnitPostBody>(body, typeUnitId ?? '')
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			router.replace(
				`/developer/${router.query.id}/project-unit/project/${router.query.projectId}/type-unit/${typeUnitId}`
			)
		}
	}

	const formWrapper = (props: {
		label: string
		withInfo?: boolean
		content: ReactNode
	}) => {
		return (
			<Stack>
				<Stack direction="row" spacing={1}>
					<Typography variant="caption" fontWeight={700} mb="10px">
						{props.label}
					</Typography>
					{props.withInfo && <RoundedChip size={'16px'} label="i" />}
				</Stack>
				{props.content}
			</Stack>
		)
	}
	return (
		<Stack height={'100%'} pt={2}>
			<DefaultBreadcrumb data={dataBreadcrumb} />
			<Container
				sx={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					overflow: 'auto',
					pb: 2,
				}}
			>
				<CustomSkeleton
					width="100%"
					loading={
						!router.query.id || typeUnitLoading || documentSupportLoading
					}
				>
					<Stack width="100%">
						<Box minWidth={'100%'} height={'230px'} mb={4}>
							<Controller
								control={control}
								name="image_thumbnail"
								render={({ field: { onBlur, onChange, value } }) => (
									<UploadImageField
										onChange={(v) =>
											setValue('image_thumbnail', { id: v?.id, url: v?.url })
										}
										value={value?.url}
										label={'Upload Gambar dengan Format .jpg / .png'}
										error={errors.image_thumbnail?.id?.message}
										notSquare
									/>
								)}
							/>
						</Box>
						<Card>
							<Box p={2}>
								<Stack>
									<Typography color="grey.400" fontWeight={700} variant="body1">
										Informasi Tipe Unit
									</Typography>
									<Grid container spacing={2} rowSpacing={1}>
										<Grid item xs={12} sm={6}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Nama Tipe Unit
												</Typography>
												<TextField
													sx={{ mb: '16px' }}
													size="small"
													fullWidth
													variant="outlined"
													placeholder="Contoh: Citra Garden"
													{...register('type_unit_name')}
													helperText={
														errors.type_unit_name?.message ?? undefined
													}
													error={!!errors.type_unit_name?.message}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Lokasi Tipe Unit
												</Typography>
												<TextField
													sx={{ mb: '16px' }}
													size="small"
													fullWidth
													variant="outlined"
													placeholder="Contoh: Google.com/maps/124i234nasdnal/u1231n4"
													{...register('location')}
													helperText={errors.location?.message ?? undefined}
													error={!!errors.location?.message}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12} sm={6}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Pilih Cluster (Optional)
												</Typography>
												<Controller
													control={control}
													name="optional_data_cluster"
													render={({ field: { onBlur, onChange, value } }) => (
														<AutoCompleteAsyncField
															endpoint={ENDPOINTS.CLUSTER}
															servicePath={
																process.env.NEXT_PUBLIC_DEVELOPER_PATH
															}
															labelKey="cluster_name"
															valueKey="id"
															placeholder="Pilih Cluster"
															value={value}
															onChange={onChange}
															error={errors?.optional_data_cluster?.id?.message}
															params={{
																filters: [
																	'developer_project_data_id',
																	'=',
																	router.query.projectId,
																],
																sort: 'cluster_name',
															}}
															searchKey="cluster_name"
														/>
													)}
												/>
											</Stack>
										</Grid>
									</Grid>
									<Typography
										mt={4}
										mb={3}
										color="grey.400"
										fontWeight={700}
										variant="body1"
									>
										Spesifikasi Bangunan
									</Typography>
									<Grid container spacing={2} rowSpacing={1}>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: 'Luas Tanah',
												withInfo: true,
												content: (
													<Controller
														control={control}
														name="land_area"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.land_area?.message}
																endAdornment={
																	<Typography variant="body2" fontWeight={700}>
																		m
																		<Typography
																			fontWeight={700}
																			variant="caption"
																			component={'sup'}
																		>
																			2
																		</Typography>
																	</Typography>
																}
															/>
														)}
													/>
												),
											})}
										</Grid>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: 'Luas Bangunan',
												withInfo: true,
												content: (
													<Controller
														control={control}
														name="building_area"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.building_area?.message}
																endAdornment={
																	<Typography variant="body2" fontWeight={700}>
																		m
																		<Typography
																			fontWeight={700}
																			variant="caption"
																			component={'sup'}
																		>
																			2
																		</Typography>
																	</Typography>
																}
															/>
														)}
													/>
												),
											})}
										</Grid>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: 'Jumlah Kamar Tidur',
												withInfo: true,
												content: (
													<Controller
														control={control}
														name="number_of_bedroom"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.number_of_bedroom?.message}
																endAdornment={
																	<Typography variant="body2" fontWeight={700}>
																		Kamar
																	</Typography>
																}
															/>
														)}
													/>
												),
											})}
										</Grid>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: 'Jumlah Kamar Mandi',
												withInfo: true,
												content: (
													<Controller
														control={control}
														name="number_of_bathroom"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.number_of_bathroom?.message}
																endAdornment={
																	<Typography variant="body2" fontWeight={700}>
																		Kamar
																	</Typography>
																}
															/>
														)}
													/>
												),
											})}
										</Grid>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: 'Tingkat Lantai',
												withInfo: true,
												content: (
													<Controller
														control={control}
														name="floor_level"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.floor_level?.message}
																endAdornment={
																	<Typography variant="body2" fontWeight={700}>
																		Lantai
																	</Typography>
																}
															/>
														)}
													/>
												),
											})}
										</Grid>
									</Grid>
									<Typography
										mt={4}
										mb={3}
										color="grey.400"
										fontWeight={700}
										variant="body1"
									>
										Denah Kavling
									</Typography>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={4}>
											<Controller
												control={control}
												name="plot_plan"
												render={({ field: { onBlur, onChange, value } }) => (
													<UploadImageField
														onChange={(v) =>
															setValue('plot_plan', {
																id: v?.id,
																url: v?.url,
															})
														}
														value={value?.url}
														label={'Upload Gambar dengan Format .jpg / .png'}
														error={errors.plot_plan?.id?.message}
													/>
												)}
											/>
										</Grid>
									</Grid>
									<Typography
										mt={4}
										mb={3}
										color="grey.400"
										fontWeight={700}
										variant="body1"
									>
										Dokumen Pendukung
									</Typography>

									<Grid container spacing={2}>
										{watch('type_unit_support_document')?.map(
											(suppItem, suppIndex) => (
												<Grid key={suppIndex} item xs={12} sm={6}>
													<Controller
														control={control}
														name={
															`type_unit_support_document[${suppIndex}]` as any
														}
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<UploadFileField
																onChange={(v) =>
																	setValue(
																		`type_unit_support_document[${suppIndex}]` as any,
																		{
																			document_id: v?.id,
																			document_url: v?.url,
																			master_document_type_id:
																				supportDocuments[suppIndex].id,
																			id: suppItem.id,
																		}
																	)
																}
																value={
																	watch(
																		`type_unit_support_document[${suppIndex}]` as any
																	)?.document_url
																}
																label={`${supportDocuments[suppIndex]?.name} (.pdf)`}
																types={['PDF']}
																icon={
																	<PictureAsPdfIcon
																		sx={{ fontSize: 48, color: 'grey.400' }}
																	/>
																}
																error={
																	errors.type_unit_support_document?.[suppIndex]
																		?.document_id?.message
																}
																title={`${supportDocuments[suppIndex]?.name} (.pdf)`}
															/>
														)}
													/>
												</Grid>
											)
										)}
									</Grid>
									{/* <Typography
										mt={4}
										color="grey.400"
										fontWeight={700}
										variant="body1"
									>
										Komisi Agen
									</Typography>
									<Typography
										mt={1}
										mb={3}
										color="grey.400"
										fontWeight={600}
										variant="caption"
									>
										Komisi yang diterima belum termasuk pemotongan pajak, service fee,
										dan biaya lainnya
									</Typography>
									<Grid spacing={2} container>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: 'Bonus Langsung Tunai (BLT)',
												content: (
													<Controller
														control={control}
														name="blt"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.blt?.message}
																startAdornment={
																	<Typography variant="body2" fontWeight={700}>
																		Rp
																	</Typography>
																}
															/>
														)}
													/>
												),
											})}
										</Grid>
										<Grid item xs={12} sm={6}>
											{formWrapper({
												label: '% Fee Agen',
												content: (
													<Controller
														control={control}
														name="fee_agent"
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<NumberFormatField
																onChange={onChange}
																value={value}
																error={errors.fee_agent?.message}
																suffix=" %"
																// startAdornment={
																// 	<Typography variant="body2" fontWeight={700}>
																// 		Rp
																// 	</Typography>
																// }
															/>
														)}
													/>
												),
											})}
										</Grid>
									</Grid> */}
									<Typography
										mt={4}
										mb={3}
										color="grey.400"
										fontWeight={700}
										variant="body1"
									>
										Galeri
									</Typography>
									<Grid container spacing={2} mb={2}>
										{watch('type_unit_gallery')?.map((glrItem, glrIndex) => (
											<Grid key={glrIndex} item xs={12} sm={6} md={3}>
												<Controller
													control={control}
													name={`type_unit_gallery[${glrIndex}]` as any}
													render={({ field: { onBlur, onChange, value } }) => (
														<Stack spacing={1}>
															<UploadGalleryImageField
																onChange={(v) =>
																	setValue(
																		`type_unit_gallery[${glrIndex}]` as any,
																		{
																			...(getValues(
																				`type_unit_gallery[${glrIndex}]` as any
																			) ?? []),
																			id: v?.id,
																			url: v?.url,
																		}
																	)
																}
																value={
																	watch(`type_unit_gallery[${glrIndex}]` as any)
																		?.url
																}
																error={
																	errors.type_unit_gallery?.[glrIndex]?.id
																		?.message
																}
																label={'Gallery'}
																onClear={() => {
																	const oldVal = [
																		...getValues('type_unit_gallery'),
																	]
																	oldVal.splice(glrIndex, 1)
																	setValue('type_unit_gallery', oldVal)
																}}
															/>
															<AutoCompleteField
																labelKey={'value'}
																valueKey={'value'}
																value={
																	watch(`type_unit_gallery[${glrIndex}]` as any)
																		?.gallery_type
																		? {
																				value: watch(
																					`type_unit_gallery[${glrIndex}]` as any
																				)?.gallery_type,
																		  }
																		: undefined
																}
																onChange={(v) =>
																	setValue(
																		`type_unit_gallery[${glrIndex}]` as any,
																		{
																			...(getValues(
																				`type_unit_gallery[${glrIndex}]` as any
																			) ?? []),
																			gallery_type: v?.value,
																		}
																	)
																}
																error={
																	errors.type_unit_gallery?.[glrIndex]
																		?.gallery_type?.message
																}
																data={[
																	{ value: '360 Image' },
																	{ value: 'Image' },
																]}
															/>
														</Stack>
													)}
												/>
											</Grid>
										))}
									</Grid>
									<Box minWidth={'100%'} mb={4}>
										<UploadImageField
											onChange={(v) =>
												setValue('type_unit_gallery', [
													...(getValues(`type_unit_gallery`) ?? []),
													{ id: v?.id, gallery_type: '', url: v?.url },
												])
											}
											label={'Unggah gambar Anda di sini'}
										/>
									</Box>
									<Stack direction="row" spacing={2} mt={3}>
										<LoadingButton
											loading={typeUnitLoadingCud}
											sx={{ alignSelf: 'start' }}
											onClick={handleSubmit(doSave, (v) => console.log(v))}
											variant="contained"
										>
											<Typography
												color="white"
												fontWeight={700}
												variant="body2"
											>
												SIMPAN
											</Typography>{' '}
										</LoadingButton>
									</Stack>
								</Stack>
							</Box>
						</Card>
					</Stack>
				</CustomSkeleton>
			</Container>
		</Stack>
	)
}

export default AddTypeUnit
