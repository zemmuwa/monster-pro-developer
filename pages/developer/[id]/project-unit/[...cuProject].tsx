import { yupResolver } from '@hookform/resolvers/yup'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseIcon from '@mui/icons-material/Close'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import LoadingButton from '@mui/lab/LoadingButton'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import DefaultBreadcrumb from '../../../../components/breadcrumb/DefaultBreadcrumb'
import RoundedChip from '../../../../components/chip/RoundedChip'
import AutoCompleteAsyncField from '../../../../components/field/AutoCompleteAsyncField'
import UploadFileField from '../../../../components/field/UploadFileField'
import UploadGalleryImageField from '../../../../components/field/UploadGalleryImageField'
import UploadImageField from '../../../../components/field/UploadImageField'
import useApiCUD from '../../../../hooks/useApiCUD'
import useFetch from '../../../../hooks/useFetch'
import useMenuAppbar from '../../../../hooks/useMenuAppbar'
import { IDetailCategoryGet } from '../../../../interfaces/interfaceApiDetailCategory'
import { IDeveloperGet } from '../../../../interfaces/interfaceApiDeveloper'
import { IDocumentGroupGet } from '../../../../interfaces/interfaceApiDocumentGroup'
import { ToastProviderContext } from '../../../../providers/ToastProvider'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import helper from '../../../../utils/helper'

import projectFormSchema, {
	ProjectFormValues,
} from '../../../../schema/projectFormSchema'
import {
	IProjectDocumentPostBody,
	IProjectGet,
	IProjectPostBody,
} from '../../../../interfaces/interfaceApiProject'
import CustomSkeleton from '../../../../components/skeleton/CustomSkeleton'

function AddProject() {
	const router = useRouter()
	const isEdit = router.query?.cuProject?.[0] == 'edit-project'
	const projectId = router.query?.cuProject?.[1]
	const dataBreadcrumb = [
		{
			label: 'Daftar Proyek',
			path: `/developer/${router.query.id}/project-unit`,
		},
		{ label: isEdit ? 'Ubah Proyek' : 'Tambah Proyek', path: '' },
	]
	const { setCompanyApp } = useMenuAppbar()
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		getValues,
		register,
		watch,
	} = useForm<ProjectFormValues>({
		resolver: yupResolver(projectFormSchema),
	})
	const { dataSingle: developerData, getOne: developerGetOne } =
		useFetch<IDeveloperGet>(
			ENDPOINTS.DEVELOPER,
			process.env.NEXT_PUBLIC_DEVELOPER_PATH
		)

	const {
		dataSingle: projectData,
		getOne: projectGetOne,
		loading: projectLoading,
	} = useFetch<IProjectGet>(
		ENDPOINTS.PROJECT,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	const fillForm = () => {
		setValue('project_cover', {
			id: projectData?.project_cover_id,
			url: helper.fileUrl(projectData?.project_cover_url ?? ''),
		})
		setValue('project_name', projectData?.project_name ?? '')
		setValue('project_category', projectData?.project_type)
		setValue('optional_data_cluster', projectData?.optional_data_cluster ?? [])
		// setValue(
		// 	'project_legal_document',
		// 	projectData?.developer_legal_documents?.map((v) => ({
		// 		...v,
		// 		document_url: helper.fileUrl(v.document_url),
		// 	})) ?? []
		// )
		setValue('master_province', projectData?.master_province)
		setValue('master_city', projectData?.master_city)
		setValue('master_district', projectData?.master_district)
		setValue('project_address', projectData?.project_address ?? '')
		setValue(
			'bank_cooperation',
			projectData?.bank_cooperation?.map((v) => v.master_bank) ?? []
		)
		// setValue(
		// 	'project_support_document',
		// 	projectData?.developer_support_documents?.map((v) => ({
		// 		...v,
		// 		document_url: helper.fileUrl(v.document_url),
		// 	})) ?? []
		// )
		setValue(
			'project_gallery',
			projectData?.gallery_project_data?.map((v) => ({
				gallery_type: v.gallery_type,
				id: v.gallery_id,
				url: helper.fileUrl(v.gallery_url),
				id_gallery: v?.id ?? '',
			})) ?? []
		)
	}

	useEffect(() => {
		if (projectData) {
			fillForm()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectData])

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
	useEffect(() => {
		setValue(
			'project_legal_document',
			legalDocuments?.map((type) => {
				const findDoc = projectData?.developer_legal_documents?.find(
					(doc) => doc.master_document_type_id == type.id
				)

				return (
					({
						id: projectData ? findDoc?.id ?? null : null,
						document_id: projectData ? findDoc?.document_id ?? '' : '',
						// document_id: '',
						document_url: projectData
							? helper.fileUrl(findDoc?.document_url ?? '')
							: '',
						// document_url: '',
						master_document_type_id: type.id,
					} as IProjectDocumentPostBody) ?? []
				)
			})
		)
	}, [legalDocuments, projectData, setValue])
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
		setValue(
			'project_support_document',
			supportDocuments?.map((type) => {
				const findDoc = projectData?.developer_support_documents?.find(
					(doc) => doc.master_document_type_id == type.id
				)

				return (
					({
						id: projectData ? findDoc?.id ?? null : null,
						document_id: projectData ? findDoc?.document_id ?? '' : '',
						// document_id: '',
						document_url: projectData
							? helper.fileUrl(findDoc?.document_url ?? '')
							: '',
						// document_url: '',
						master_document_type_id: type.id,
					} as IProjectDocumentPostBody) ?? []
				)
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supportDocuments, projectData])

	const {
		create: projectCreate,
		loading: projectLoadingCud,
		edit: projectEdit,
	} = useApiCUD(ENDPOINTS.PROJECT, process.env.NEXT_PUBLIC_DEVELOPER_PATH)
	const doSave = async (values: ProjectFormValues) => {
		const body: IProjectPostBody = {
			bank_cooperation: getValues('bank_cooperation').map((v) => ({
				master_bank_id: v.id,
			})),
			project_cover_url: helper.filePath(getValues('project_cover')?.url ?? ''),
			project_cover_id: getValues('project_cover')?.id,
			project_name: getValues('project_name'),
			optional_data_cluster: getValues('optional_data_cluster'),
			developer_legal_documents: getValues('project_legal_document')?.map(
				(v) => ({ ...v, document_url: helper.filePath(v?.document_url ?? '') })
			),
			developer_support_documents: getValues('project_support_document')?.map(
				(v) => ({ ...v, document_url: helper.filePath(v?.document_url ?? '') })
			),
			master_province_id: getValues('master_province')?.id,
			master_city_id: getValues('master_city')?.id,
			master_district_id: getValues('master_district')?.id,
			project_address: getValues('project_address'),
			project_type_id: getValues('project_category')?.id,
			developer_id: router.query.id as string,
			gallery_project_data:
				getValues('project_gallery')?.map((v) => ({
					id: v.id_gallery,
					gallery_id: v?.id ?? '',
					gallery_type: v?.gallery_type ?? '',
					gallery_url: helper.filePath(v?.url ?? '') ?? '',
				})) ?? [],
		}
		if (isEdit) await doUpdate(body)
		else await doCreate(body)
	}

	const doCreate = async (body: IProjectPostBody) => {
		const res = await projectCreate<IProjectPostBody>(body)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			router.push(`/developer/${router.query.id}/project-unit`)
		}
	}
	const doUpdate = async (body: IProjectPostBody) => {
		const res = await projectEdit<IProjectPostBody>(body, projectId ?? '')
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			router.replace(
				`/developer/${router.query.id}/project-unit/project/${projectId}`
			)
		}
	}

	useEffect(() => {
		documentLegalGetAllWParams()
		documentSupportGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const addCluster = () => {
		const oldVal = getValues('optional_data_cluster') ?? []
		setValue('optional_data_cluster', [...oldVal, { cluster_name: '' }])
	}
	const delClusterByIndex = (index: number) => {
		const clsValue = getValues('optional_data_cluster')
		clsValue.splice(index, 1)
		setValue('optional_data_cluster', clsValue)
	}
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
			if (projectId) projectGetOne('/' + projectId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

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
						!router.query.id ||
						projectLoading ||
						documentSupportLoading ||
						documentLegalLoading
					}
				>
					<Stack width="100%">
						<Box minWidth={'100%'} height={'230px'} mb={4}>
							<Controller
								control={control}
								name="project_cover"
								render={({ field: { onBlur, onChange, value } }) => (
									<UploadImageField
										onChange={(v) =>
											setValue('project_cover', { id: v?.id, url: v?.url })
										}
										value={value?.url}
										label={'Upload Gambar dengan Format ( JPG/PNG/JPEG - Max 2mb )'}
										error={errors.project_cover?.id?.message}
										notSquare
									/>
								)}
							/>
						</Box>
						<Card>
							<Box p={2}>
								<Stack>
									<Typography color="grey.400" fontWeight={700} variant="body1">
										Informasi Proyek
									</Typography>
									<Grid container spacing={2} rowSpacing={1}>
										<Grid item xs={12} sm={6}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Nama Proyek
												</Typography>
												<TextField
													sx={{ mb: '16px' }}
													size="small"
													fullWidth
													variant="outlined"
													placeholder="Contoh: Citra Garden"
													{...register('project_name')}
													helperText={errors.project_name?.message ?? undefined}
													error={!!errors.project_name?.message}
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
													Tipe Proyek
												</Typography>
												<Controller
													control={control}
													name="project_category"
													render={({ field: { onBlur, onChange, value } }) => (
														<AutoCompleteAsyncField
															endpoint={ENDPOINTS.PROJECT_CATEGORY}
															servicePath={
																process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
															}
															labelKey="category_name"
															valueKey="id"
															placeholder="Pilih Kategori"
															value={value}
															onChange={onChange}
															error={errors?.project_category?.id?.message}
															params={{
																sort:'category_name'
															}}
															searchKey="category_name"
														/>
													)}
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
													Cluster (opsional)
												</Typography>
												{watch('optional_data_cluster')?.map(
													(clsItem, clsIndex) => (
														<Stack
															key={clsIndex}
															direction="row"
															alignItems="center"
															spacing={1}
															mb={2}
														>
															<RoundedChip label={`${clsIndex + 1}`} />
															<TextField
																size="small"
																fullWidth
																variant="outlined"
																placeholder="Ex:Perumahan"
																{...register(
																	`optional_data_cluster[${clsIndex}].cluster_name` as any
																)}
																helperText={
																	errors.optional_data_cluster?.[clsIndex]
																		?.cluster_name?.message ?? undefined
																}
																error={
																	!!errors.optional_data_cluster?.[clsIndex]
																		?.cluster_name?.message
																}
															/>
															<IconButton
																edge="start"
																color="inherit"
																onClick={() => delClusterByIndex(clsIndex)}
															>
																<CloseIcon
																	sx={{ fontSize: 24, color: 'text.primary' }}
																/>
															</IconButton>
														</Stack>
													)
												)}
												<Button
													onClick={addCluster}
													sx={{ alignSelf: 'start' }}
													startIcon={<AddOutlinedIcon />}
												>
													<Typography variant="body2" fontWeight={700}>
														Tambah Cluster
													</Typography>
												</Button>
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
										Dokumen Legalitas
									</Typography>
									<Grid container spacing={2} rowSpacing={1}>
										{watch('project_legal_document')?.map(
											(lglItem, lglIndex) => (
												<Grid key={lglIndex} item xs={12} sm={6}>
													<Controller
														control={control}
														name={`project_legal_document[${lglIndex}]` as any}
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<UploadFileField
															title={`${legalDocuments[lglIndex]?.name} (.pdf)`}
																onChange={(v) =>
																	setValue(
																		`project_legal_document[${lglIndex}]` as any,
																		{
																			document_id: v?.id,
																			document_url: v?.url,
																			master_document_type_id:
																				legalDocuments[lglIndex].id,
																			id: lglItem.id,
																		}
																	)
																}
																value={watch(`project_legal_document[${lglIndex}]` as any)?.document_url}
																label={`${legalDocuments[lglIndex]?.name} (.pdf)`}
																types={['PDF']}
																icon={
																	<PictureAsPdfIcon
																		sx={{ fontSize: 48, color: 'grey.400' }}
																	/>
																}
																error={
																	errors.project_legal_document?.[lglIndex]
																		?.document_id?.message
																}
															/>
														)}
													/>
												</Grid>
											)
										)}
									</Grid>
									<Typography
										mt={4}
										mb={3}
										color="grey.400"
										fontWeight={700}
										variant="body1"
									>
										Informasi Wilayah
									</Typography>
									<Grid container spacing={2}>
										<Grid item xs={12} md={4}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Provinsi
												</Typography>
												<Controller
													control={control}
													name="master_province"
													render={({ field: { onBlur, onChange, value } }) => (
														<AutoCompleteAsyncField
															endpoint={ENDPOINTS.MASTER_PROVINCE}
															servicePath={
																process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
															}
															labelKey="province_name"
															valueKey="id"
															placeholder="Pilih Provinsi"
															value={value}
															onChange={(v) => {
																onChange(v)
																setValue('master_city', undefined)
																setValue('master_district', undefined)
															}}
															error={errors.master_province?.id?.message}
															params={{
																filters: ['active', '=', true],
																sort:'province_name'
															}}
															searchKey="province_name"
														/>
													)}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12} md={4}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Kota / Kabupaten
												</Typography>
												<Controller
													control={control}
													name="master_city"
													render={({ field: { onBlur, onChange, value } }) => (
														<AutoCompleteAsyncField
															endpoint={ENDPOINTS.MASTER_CITY}
															servicePath={
																process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
															}
															labelKey="city_name"
															valueKey="id"
															placeholder="Pilih Kota/Kabupaten"
															value={value}
															onChange={(v) => {
																onChange(v)
																setValue('master_district', undefined)
															}}
															error={errors.master_city?.id?.message}
															disabled={!watch('master_province')?.id}
															params={{
																filters: [
																	['active', '=', true],
																	['and'],
																	[
																		'master_province_id',
																		'=',
																		watch('master_province')?.id,
																	],
																],
																sort:'city_name'
															}}
															searchKey="city_name"
														/>
													)}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12} md={4}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Kecamatan
												</Typography>
												<Controller
													control={control}
													name="master_district"
													render={({ field: { onBlur, onChange, value } }) => (
														<AutoCompleteAsyncField
															endpoint={ENDPOINTS.MASTER_DISTRICT}
															servicePath={
																process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
															}
															labelKey="district_name"
															valueKey="id"
															placeholder="Pilih Kecamatan"
															value={value}
															onChange={onChange}
															error={errors.master_district?.id?.message}
															disabled={!watch('master_city')?.id}
															params={{
																filters: [
																	['active', '=', true],
																	['and'],
																	[
																		'master_city_id',
																		'=',
																		watch('master_city')?.id,
																	],
																],
																sort:'district_name'
															}}
															searchKey="district_name"
														/>
													)}
												/>
											</Stack>
										</Grid>
										<Grid item xs={12}>
											<Stack>
												<Typography
													variant="caption"
													fontWeight={700}
													mb="10px"
												>
													Alamat Lengkap
												</Typography>
												<TextField
													size="small"
													fullWidth
													variant="outlined"
													placeholder="Tulis Alamat lengkap"
													rows={4}
													multiline
													{...register('project_address')}
													helperText={
														errors.project_address?.message ?? undefined
													}
													error={!!errors.project_address?.message}
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
										Informasi Pembayaran
									</Typography>
									<Typography variant="caption" fontWeight={700} mb="10px">
										Kerjasama Bank
									</Typography>
									<Controller
										control={control}
										name="bank_cooperation"
										render={({ field: { onBlur, onChange, value } }) => (
											<AutoCompleteAsyncField
												multiple
												endpoint={ENDPOINTS.MASTER_BANK}
												servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
												labelKey="name"
												valueKey="id"
												placeholder="Pilih Bank"
												value={value ?? []}
												onChange={onChange}
												error={errors.bank_cooperation?.message}
												params={{
													filters: ['active', '=', true],
													sort:"name"
												}}
												searchKey="name"
											/>
										)}
									/>
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
										{watch('project_support_document')?.map(
											(suppItem, suppIndex) => (
												<Grid key={suppIndex} item xs={12} sm={6}>
													<Controller
														control={control}
														name={
															`project_support_document[${suppIndex}]` as any
														}
														render={({
															field: { onBlur, onChange, value },
														}) => (
															<UploadFileField
																onChange={(v) =>
																	setValue(
																		`project_support_document[${suppIndex}]` as any,
																		{
																			document_id: v?.id,
																			document_url: v?.url,
																			master_document_type_id:
																				supportDocuments[suppIndex].id,
																			id: suppItem.id,
																		}
																	)
																}
																value={watch(`project_support_document[${suppIndex}]` as any)?.document_url}
																label={`${supportDocuments[suppIndex]?.name} (.pdf)`}
																types={['PDF']}
																icon={
																	<PictureAsPdfIcon
																		sx={{ fontSize: 48, color: 'grey.400' }}
																	/>
																}
																error={
																	errors.project_support_document?.[suppIndex]
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
										{watch('project_gallery')?.map((glrItem, glrIndex) => (
											<Grid key={glrIndex} item xs={12} sm={6} md={3}>
												<Controller
													control={control}
													name={`project_gallery[${glrIndex}]` as any}
													render={({ field: { onBlur, onChange, value } }) => (
														<Stack spacing={1}>
															<UploadGalleryImageField
																onChange={(v) =>
																	setValue(
																		`project_gallery[${glrIndex}]` as any,
																		{
																			...(getValues(
																				`project_gallery[${glrIndex}]` as any
																			) ?? []),
																			id: v?.id,
																			url: v?.url,
																		}
																	)
																}
																value={watch(`project_gallery[${glrIndex}]` as any)?.url}
																error={
																	errors.project_gallery?.[glrIndex]?.id
																		?.message
																}
																label={'Gallery'}
																onClear={() => {
																	const oldVal = [
																		...getValues('project_gallery'),
																	]
																	oldVal.splice(glrIndex, 1)
																	setValue('project_gallery', oldVal)
																}}
															/>
															<Autocomplete
																size="small"
																value={value?.gallery_type || null}
																onChange={(event: any, newValue: unknown) => {
																	setValue(
																		`project_gallery[${glrIndex}]` as any,
																		{
																			...(getValues(
																				`project_gallery[${glrIndex}]` as any
																			) ?? []),
																			gallery_type: newValue,
																		}
																	)
																}}
																options={['360 Image', 'Image']}
																renderInput={(params) => (
																	<TextField
																		error={
																			!!errors.project_gallery?.[glrIndex]
																				?.gallery_type?.message
																		}
																		helperText={
																			errors.project_gallery?.[glrIndex]
																				?.gallery_type?.message
																		}
																		placeholder="Pilih Jenis Gambar"
																		{...params}
																		InputProps={{
																			...params.InputProps,
																			endAdornment: (
																				<React.Fragment>
																					{params.InputProps.endAdornment}
																				</React.Fragment>
																			),
																		}}
																	/>
																)}
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
												setValue('project_gallery', [
													...(getValues(`project_gallery`) ?? []),
													{ id: v?.id, gallery_type: '', url: v?.url },
												])
											}
											label={'Unggah gambar Anda di sini ( JPG/PNG/JPEG - Max 2mb )'}
										/>
									</Box>
									<Stack direction="row" spacing={2} mt={3}>
										<LoadingButton
											loading={projectLoadingCud}
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

export default AddProject
