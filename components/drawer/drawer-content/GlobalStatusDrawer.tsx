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
import { useForm } from 'react-hook-form'
import useApiCUD from '../../../hooks/useApiCUD'
import { ToastProviderContext } from '../../../providers/ToastProvider'
import ENDPOINTS from '../../../utils/constants/endpoints'
import helper from '../../../utils/helper'
import CustomForm from '../../form/CustomForm'
import CustomSwitch from '../../switch/CustomSwitch'
import PlainTableCell from '../../tables/PlainTableCell'
import { TemporaryDrawerContext } from '../TemporaryDrawer'
import {
	IGlobalStatusGet,
	IGlobalStatusPostBody,
	IGlobalStatusPutBody,
} from '../../../interfaces/interfaceApiGlobalStatus'
import globalStatusFormSchema, {
	GlobalStatusFormValues,
} from '../../../schema/globalStatusFormSchema'
import ErrorLabel from '../../label/ErrorLabel'
interface PropsGlobalStatusDrawer {
	data?: IGlobalStatusGet
}
function GlobalStatusDrawer({ data }: PropsGlobalStatusDrawer) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
		getValues,
		watch,
	} = useForm<GlobalStatusFormValues>({
		resolver: yupResolver(globalStatusFormSchema),
	})
	const { onClose, onSuccess } = useContext(TemporaryDrawerContext)
	const [isActive, setIsActive] = useState(false)
	const {
		create: globalstatusCreate,
		edit: globalstatusEdit,
		loading: globalstatusLoading,
	} = useApiCUD(
		ENDPOINTS.MASTER_STATUS,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)

	const doSave = async (values: GlobalStatusFormValues) => {
		const res = await globalstatusCreate<IGlobalStatusPostBody>({
			status_type: values.status_type,
			code: values.code,
			description: values.description,
			active: isActive,
			master_detail_status: values.master_detail_status.map(
				(detailItem, detailIndex) => ({
					...detailItem,
					code: (detailIndex + 1).toString(),
				})
			),
		})
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Ditambahkan.')
			onSuccess()
		}
	}

	const doEdit = async (values: GlobalStatusFormValues) => {
		const res = await globalstatusEdit<IGlobalStatusPutBody>(
			{
				status_type: values.status_type,
				code: values.code,
				description: values.description,
				active: isActive,
				master_detail_status: values.master_detail_status.map(
					(detailItem, detailIndex) => ({
						...detailItem,
						code: (detailIndex + 1).toString(),
					})
				),
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
		setValue('status_type', data?.status_type ?? '')
		setValue('code', data?.code ?? '')
		setValue('description', data?.description ?? '')
		setIsActive(data?.active ?? false)
		setValue(
			'master_detail_status',
			data?.master_detail_status?.map((detailItem) => ({
				status_name: detailItem.status_name,
				id: detailItem.id,
				description: detailItem.description,
				code: '0',
			})) ?? []
		)
	}

	const addDetail = () => {
		const detailValue = getValues('master_detail_status')
		setValue('master_detail_status', [
			...detailValue,
			{ code: '', description: '', status_name: '' },
		])
	}

	const delDetailByIndex = (index: number) => {
		const detailValue = getValues('master_detail_status')
		detailValue.splice(index, 1)
		setValue('master_detail_status', detailValue)
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
					width={'569px'}
					pl="40px"
					pr="24px"
					flexGrow={1}
					overflow="auto"
				>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Kode Jenis Status
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
						Jenis Status
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						variant="outlined"
						{...register('status_type')}
						helperText={errors.status_type?.message ?? undefined}
						error={!!errors.status_type?.message}
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
					/>
					<Divider sx={{ my: 2 }} />
					{watch('master_detail_status')?.map((detailItem, detailI) => (
						<Table size="small" key={detailI}>
							<TableHead>
								<TableRow>
									<PlainTableCell sx={{ pb: 0 }}></PlainTableCell>
									<PlainTableCell sx={{ pb: 0 }}>
										<Typography fontWeight={700} variant="caption">
											Detail Status
										</Typography>
									</PlainTableCell>
									<PlainTableCell sx={{ pb: 0 }}>
										<Typography fontWeight={700} variant="caption">
											Deskripsi Detail
										</Typography>
									</PlainTableCell>
									<PlainTableCell sx={{ pb: 0 }}></PlainTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<PlainTableCell sx={{ verticalAlign: 'top', pt: '18px' }}>
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
									<PlainTableCell>
										<TextField
											sx={{ mb: '16px' }}
											size="small"
											fullWidth
											variant="outlined"
											{...register(
												`master_detail_status[${detailI}].status_name` as any
											)}
											helperText={
												errors.master_detail_status?.[detailI]?.status_name
													?.message ?? undefined
											}
											error={
												!!errors.master_detail_status?.[detailI]?.status_name
													?.message
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
												`master_detail_status[${detailI}].description` as any
											)}
											helperText={
												errors.master_detail_status?.[detailI]?.description
													?.message ?? undefined
											}
											error={
												!!errors.master_detail_status?.[detailI]?.description
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
						sx={{ alignSelf: 'start' }}
						variant="text"
						startIcon={<AddOutlinedIcon />}
					>
						<Typography variant="body2" fontWeight={700}>
							Detail Status
						</Typography>
					</Button>
					{errors.master_detail_status?.message && (
						<ErrorLabel>{errors.master_detail_status?.message}</ErrorLabel>
					)}
				</Stack>
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
							loading={globalstatusLoading}
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

export default GlobalStatusDrawer
