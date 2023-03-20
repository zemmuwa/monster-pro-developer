import { yupResolver } from '@hookform/resolvers/yup'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { LoadingButton } from '@mui/lab'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useApiCUD from '../../../hooks/useApiCUD'
import { ToastProviderContext } from '../../../providers/ToastProvider'
import ENDPOINTS from '../../../utils/constants/endpoints'
import helper from '../../../utils/helper'
import ButtonUploadField from '../../field/ButtonUploadField'
import CustomForm from '../../form/CustomForm'
import CustomSwitch from '../../switch/CustomSwitch'
import PlainTableCell from '../../tables/PlainTableCell'
import { TemporaryDrawerContext } from '../TemporaryDrawer'

import {
	IGlobalCategoryGet,
	IGlobalCategoryPostBody,
	IGlobalCategoryPutBody,
} from '../../../interfaces/interfaceApiGlobalCategory'
import globalCategoryFormSchema, {
	GlobalCategoryFormValues,
} from '../../../schema/globalCategoryFormSchema'
import ErrorLabel from '../../label/ErrorLabel'

interface PropsGlobalCategoryDrawer {
	data?: IGlobalCategoryGet
}
function GlobalCategoryDrawer({ data }: PropsGlobalCategoryDrawer) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
		getValues,
		watch,
	} = useForm<GlobalCategoryFormValues>({
		resolver: yupResolver(globalCategoryFormSchema),
	})
	const { onClose, onSuccess } = useContext(TemporaryDrawerContext)
	const [isActive, setIsActive] = useState(false)
	const {
		create: globalcategoryCreate,
		edit: globalcategoryEdit,
		loading: globalcategoryLoading,
	} = useApiCUD(
		ENDPOINTS.MASTER_CATEGORY,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)

	const doSave = async (values: GlobalCategoryFormValues) => {
		const res = await globalcategoryCreate<IGlobalCategoryPostBody>({
			category_type: values.category_type,
			code: values.code,
			description: values.description,
			master_detail_category:
				values.master_detail_category?.map((v) => ({
					...v,
					icon_url: helper.filePath(v.icon_url),
				})) ?? [],
			active: isActive,
		})
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			onSuccess()
		}
	}

	const doEdit = async (values: GlobalCategoryFormValues) => {
		const res = await globalcategoryEdit<IGlobalCategoryPutBody>(
			{
				category_type: values.category_type,
				code: values.code,
				description: values.description,
				master_detail_category:
					values.master_detail_category?.map((v) => ({
						...v,
						icon_url: helper.filePath(v.icon_url),
					})) ?? [],
				active: isActive,
			},
			data?.id ?? '0'
		)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			onSuccess()
		}
	}

	const fillForm = () => {
		setValue('category_type', data?.category_type ?? '')
		setValue('code', data?.code ?? '')
		setValue('description', data?.description ?? '')
		setValue(
			'master_detail_category',
			data?.master_detail_category?.map((v) => ({
				category_name: v.category_name ?? '',
				code: v.code ?? '',
				description: v.description ?? '',
				id: v.id ?? '',
				icon_id: v.icon_id ?? '',
				icon_url: helper.fileUrl(v.icon_url ?? ''),
			})) ?? []
		)
		setIsActive(data?.active ?? false)
	}

	const addDetail = () => {
		const detailValue = getValues('master_detail_category')
		setValue('master_detail_category', [
			...detailValue,
			{
				code: '',
				description: '',
				category_name: '',
				icon_id: '',
				icon_url: '',
			},
		])
	}

	const delDetailByIndex = (index: number) => {
		const detailValue = getValues('master_detail_category')
		detailValue.splice(index, 1)
		setValue('master_detail_category', detailValue)
	}

	useEffect(() => {
		if (data) fillForm()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])
	return (
		<>
			<CustomForm onSubmit={handleSubmit(data ? doEdit : doSave)}>
				<Stack
					pb={'12px'}
					width={'850px'}
					pl="40px"
					pr="24px"
					flexGrow={1}
					overflow="auto"
				>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Kode Jenis Kategori
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('code')}
						helperText={errors.code?.message ?? undefined}
						error={!!errors.code?.message}
					/>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Jenis Kategori
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('category_type')}
						helperText={errors.category_type?.message ?? undefined}
						error={!!errors.category_type?.message}
						placeholder="Ex: Cash"
					/>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Deskripsi
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('description')}
						helperText={errors.description?.message ?? undefined}
						error={!!errors.description?.message}
						placeholder="Ex: Cash"
					/>
					<Divider sx={{ my: 2 }} />
					{watch('master_detail_category')?.map((detailItem, detailI) => (
						<Table size="small" key={detailI} sx={{ tableLayout: 'fixed' }}>
							<TableHead>
								<TableRow>
									<PlainTableCell sx={{ pb: 0 }}></PlainTableCell>
									<PlainTableCell sx={{ pb: 0, width: '30%' }}>
										<Typography fontWeight={700} variant="caption">
											Icon
										</Typography>
									</PlainTableCell>
									<PlainTableCell sx={{ pb: 0, width: '30%' }}>
										<Typography fontWeight={700} variant="caption">
											Detail Kategori
										</Typography>
									</PlainTableCell>
									<PlainTableCell sx={{ pb: 0, width: '30%' }}>
										<Typography fontWeight={700} variant="caption">
											Deskripsi Kategori
										</Typography>
									</PlainTableCell>
									<PlainTableCell sx={{ pb: 0 }}></PlainTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<PlainTableCell
										sx={{ verticalAlign: 'top', pt: '20px !important' }}
									>
										<Box
											bgcolor={'primary.main'}
											width="20px"
											height="20px"
											borderRadius="100%"
											display="flex"
											justifyContent="center"
										>
											<Typography
												fontWeight={700}
												variant="caption"
												color="white"
											>
												{detailI + 1}
											</Typography>
										</Box>
									</PlainTableCell>
									<PlainTableCell sx={{ verticalAlign: 'top', pt: '12px' }}>
										<Controller
											control={control}
											name={
												`master_detail_category[${detailI}].icon_url` as any
											}
											render={({ field: { onBlur, onChange, value } }) => (
												<ButtonUploadField
													types={['jpg', 'png', 'jpeg']}
													text
													onChange={(v) => {
														setValue(
															`master_detail_category[${detailI}].icon_url` as any,
															v?.url
														)
														setValue(
															`master_detail_category[${detailI}].icon_id` as any,
															v?.id
														)
													}}
													value={value}
													error={
														errors.master_detail_category?.[detailI]?.icon_id
															?.message ||
														errors.master_detail_category?.[detailI]?.icon_url
															?.message
													}
												/>
											)}
										/>
									</PlainTableCell>
									<PlainTableCell>
										<TextField
											sx={{ mb: '16px' }}
											size="small"
											fullWidth
											variant="outlined"
											{...register(
												`master_detail_category[${detailI}].category_name` as any
											)}
											helperText={
												errors.master_detail_category?.[detailI]?.category_name
													?.message ?? undefined
											}
											error={
												!!errors.master_detail_category?.[detailI]
													?.category_name?.message
											}
										/>
									</PlainTableCell>
									<PlainTableCell>
										<TextField
											sx={{ mb: '16px' }}
											size="small"
											fullWidth
											variant="outlined"
											{...register(
												`master_detail_category[${detailI}].description` as any
											)}
											helperText={
												errors.master_detail_category?.[detailI]?.description
													?.message ?? undefined
											}
											error={
												!!errors.master_detail_category?.[detailI]?.description
													?.message
											}
										/>
									</PlainTableCell>
									<PlainTableCell sx={{ verticalAlign: 'top' }}>
										<IconButton
											edge="start"
											color="inherit"
											onClick={() => delDetailByIndex(detailI)}
											// sx={{ mr: 2 }}
										>
											<CloseIcon sx={{ fontSize: 24, color: 'text.primary' }} />
										</IconButton>
									</PlainTableCell>
								</TableRow>
							</TableBody>
						</Table>
					))}
					<Button
						onClick={addDetail}
						variant="text"
						startIcon={<AddOutlinedIcon />}
                        sx={{ alignSelf: 'start' }}
					>
						<Typography variant="body2" fontWeight={700}>
							Detail kategori
						</Typography>
					</Button>
                    {errors.master_detail_category?.message && (
						<ErrorLabel>{errors.master_detail_category?.message}</ErrorLabel>
					)}
				</Stack>
				{/* <ButtonUploadField/> */}
				<Divider />
				<Stack
					justifyContent={'space-between'}
					spacing={2}
					direction={'row'}
					pl="40px"
					pr="24px"
					pt="20px"
					pb="10px"
				>
					<Stack spacing={2} direction={'row'}>
						<LoadingButton
							type="submit"
							loading={globalcategoryLoading}
							size="small"
							sx={{ color: 'white' }}
							variant="contained"
						>
							SAVE
						</LoadingButton>
						<Button
							size="small"
							color="inherit"
							sx={{ backgroundColor: 'grey.300' }}
							variant="contained"
							onClick={onClose}
						>
							CANCEL
						</Button>
					</Stack>
					<Stack spacing={2} alignItems="center" direction={'row'}>
						<Typography color={'grey.400'} fontWeight={600} variant="body2">
							Aktifkan
						</Typography>
						<CustomSwitch
							checked={isActive}
							onChange={(v, c) => setIsActive(c)}
							color="success"
						/>
					</Stack>
				</Stack>
			</CustomForm>
		</>
	)
}

export default GlobalCategoryDrawer
