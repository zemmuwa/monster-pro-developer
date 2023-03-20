import { yupResolver } from '@hookform/resolvers/yup'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseIcon from '@mui/icons-material/Close'
import InfoIcon from '@mui/icons-material/Info'
import { LoadingButton } from '@mui/lab'
import { IconButton } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useApiCUD from '../../../../hooks/useApiCUD'
import useDisclose from '../../../../hooks/useDisclose'
import useFetch from '../../../../hooks/useFetch'
import { IDocumentTypeGet } from '../../../../interfaces/interfaceApiDocumentType'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import { ToastProviderContext } from '../../../../providers/ToastProvider'
import transactionDetailScheduleFormSchema, {
	TransactionDetailScheduleFormValues,
} from '../../../../schema/transactionDetailScheduleFormSchema'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import { formatIsoString } from '../../../../utils/date'
import helper from '../../../../utils/helper'
import ConfirmDialog from '../../../dialog/ConfirmDialog'
import AutoCompleteAsyncField from '../../../field/AutoCompleteAsyncField'
import ButtonUploadField from '../../../field/ButtonUploadField'
import DatePickerField from '../../../field/DatePickerField'
import ErrorLabel from '../../../label/ErrorLabel'
interface PropsScheduleContentTab {
	isSpr?: boolean
	transactionData?: ITransactionGet
	disableForm?: boolean
	onSave?: () => void
}
function ScheduleContentTab({
	isSpr,
	disableForm,
	onSave,
	transactionData,
}: PropsScheduleContentTab) {
	const { openToast } = useContext(ToastProviderContext)
	const [isFirstTime, setIsFirstTime] = useState(true)

	const {
		handleSubmit: submitSchedule,
		control: controlSchedule,
		formState: { errors: errorsSchedule },
		setValue: setSchedule,
		getValues: getSchedule,
		register: regSchedule,
		watch: watchSchedule,
	} = useForm<TransactionDetailScheduleFormValues>({
		resolver: yupResolver(transactionDetailScheduleFormSchema),
	})

	const {
		data: ScheduleTypeData,
		getAll: ScheduleTypeGetAll,
		loading: ScheduleTypeLoading,
	} = useFetch(
		ENDPOINTS.TRANSACTION_SCHEDULE_TYPE,
		process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
	)

	const ScheduleTypeGetAllWParams = async () => {
		await ScheduleTypeGetAll({ size: -1, sort: 'name' })
	}
	useEffect(() => {
		ScheduleTypeGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const addScheduleItem = () => {
		const oldVal = getSchedule('schedule') ?? []
		setSchedule('schedule', [
			...oldVal,
			{ name: undefined, date: '', file: undefined },
		])
	}
	const delScheduleItemByIndex = (index: number) => {
		const schValue = getSchedule('schedule')
		schValue.splice(index, 1)
		setSchedule('schedule', schValue)
	}

	const { edit: scheduleEdit, loading: scheduleLoading } = useApiCUD(
		ENDPOINTS.DEVELOPER_DETAIL_TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const doSaveSchedule = async (
		values: TransactionDetailScheduleFormValues
	) => {
		const body = values.schedule?.map((v) => ({
			document_date: formatIsoString(v.date),
			master_document_type_id: v.name?.id,
			master_document_id: v?.file?.id,
			master_document_url: helper?.filePath(v?.file?.url ?? ''),
			id:
				transactionData?.booking?.developer_detail_transaction?.document_schedule?.find(
					(v2) => v2.master_document_type_id == v.name?.id
				)?.id ?? null,
		}))
		const res = await scheduleEdit(
			{ document_schedule: body },
			transactionData?.booking?.developer_detail_transaction?.id ?? ''
		)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			onSave?.()
		}
	}

	useEffect(() => {
		if (transactionData) {
			setSchedule(
				'schedule',
				transactionData?.booking?.developer_detail_transaction?.document_schedule?.map(
					(v) => ({
						name: v.master_document_type_data,
						date: v.document_date,
						file: {
							id: v.master_document_id,
							url: v.master_document_url
								? helper.fileUrl(v.master_document_url ?? '')
								: '',
						},
					})
				) ?? []
			)
		}
		if (getSchedule('schedule').length > 0) setIsFirstTime(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])

	const {
		close: closeConfirmDialog,
		open: openConfirmDialog,
		isOpen: isOpenConfirmDialog,
	} = useDisclose()
	const confirmDialog = (
		<ConfirmDialog
			onClose={closeConfirmDialog}
			open={isOpenConfirmDialog}
			title="Anda yakin untuk upload penjadwalan?"
			maxWidth="sm"
			renderAction={
				<Stack
					py={1}
					px={2}
					width="100%"
					direction="row"
					alignItems="center"
					spacing={1.5}
				>
					<LoadingButton
						onClick={submitSchedule(doSaveSchedule)}
						loading={scheduleLoading}
						variant="contained"
					>
						<Typography variant="caption" color="white" fontWeight={700}>
							SIMPAN
						</Typography>
					</LoadingButton>
					<Button
						onClick={closeConfirmDialog}
						variant="contained"
						color="inherit"
					>
						<Typography variant="caption" fontWeight={700}>
							KEMBALI
						</Typography>
					</Button>
				</Stack>
			}
		>
			<Stack>
				<Typography variant="body2" fontWeight={400} mb="10px">
					Jika anda upload berkas ini, perkiraan tanggal yang sudah ditambahkan
					di depan{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						tidak dapat diubah
					</Typography>
					. Pastikan tanggal yang Anda kirim{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						sudah sesuai{' '}
					</Typography>
					dengan dokumen yang disematkan
				</Typography>
			</Stack>
		</ConfirmDialog>
	)

	return (
		<>
			{confirmDialog}
			<Grid container spacing={2} mb={2}>
				{!isSpr && (
					<Grid item xs={12}>
						<Stack
							borderRadius={3}
							p={1}
							bgcolor={'primary.200'}
							spacing={1.5}
							direction="row"
							alignItems="center"
							mt={2}
						>
							<InfoIcon color="primary" />
							<Typography variant="caption" fontWeight={700}>
								Anda harus menyelesaikan proses SPR untuk melanjutkan proses
								penjadwalan
							</Typography>
						</Stack>
					</Grid>
				)}
				{watchSchedule('schedule')?.map((scdItem, scdI) => {
					const isDocument = Boolean(
						transactionData?.booking?.developer_detail_transaction
							?.document_schedule?.[scdI]?.master_document_url
					)
					return (
						<>
							<Grid item xs={12} md={4}>
								<Stack direction="row" alignItems="center">
									{(!disableForm && !isDocument) && (
										<IconButton
											sx={{ mt: '16px' }}
											edge="start"
											color="inherit"
											onClick={() => delScheduleItemByIndex(scdI)}
										>
											<CloseIcon sx={{ fontSize: 24, color: 'error.main' }} />
										</IconButton>
									)}
									<Stack flex={1}>
										<Typography
											variant="caption"
											fontWeight={700}
											color="grey.400"
										>
											Nama Penjadwalan
										</Typography>
										<Controller
											control={controlSchedule}
											name={`schedule[${scdI}].name` as any}
											render={({ field: { value, onChange, name } }) => (
												<AutoCompleteAsyncField
													endpoint={ENDPOINTS.TRANSACTION_SCHEDULE_TYPE}
													servicePath={
														process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH
													}
													labelKey={'name' as keyof IDocumentTypeGet}
													valueKey={'id'}
													value={watchSchedule(name)}
													onChange={(v) => onChange(v)}
													disabled={disableForm || !isSpr || isDocument}
													error={
														errorsSchedule?.schedule?.[scdI]?.name?.id?.message
													}
													params={{ sort: 'name' }}
													searchKey="name"
												/>
											)}
										/>
									</Stack>
								</Stack>
							</Grid>
							<Grid item xs={12} md={4}>
								<Stack>
									<Typography
										variant="caption"
										fontWeight={700}
										color="grey.400"
									>
										Tanggal
									</Typography>
									<Controller
										control={controlSchedule}
										name={`schedule[${scdI}].date` as any}
										render={({ field: { value, onChange, name } }) => (
											<DatePickerField
												onChange={
													(v) => onChange(v)
													// setSchedule(`schedule[${scdI}].date` as any, v)
												}
												placeholder="Pilih Tanggal"
												value={watchSchedule(name)}
												error={
													!!errorsSchedule?.schedule?.[scdI]?.date?.message
												}
												helperText={
													errorsSchedule?.schedule?.[scdI]?.date?.message
												}
												disabled={disableForm || !isSpr || isDocument}
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
										color="grey.400"
									>
										Dokumen
									</Typography>
									<Controller
										control={controlSchedule}
										name={`schedule[${scdI}].file` as any}
										render={({ field: { value, onChange, name } }) => (
											<ButtonUploadField
												types={['PDF']}
												title={`Dokumen ${scdI + 1}`}
												text
												sx={{ width: '100%' }}
												variant="outlined"
												value={watchSchedule(name)?.url}
												onChange={(v) => setSchedule(name, v)}
												error={
													errorsSchedule?.schedule?.[scdI]?.file?.id?.message
												}
												disabled={disableForm || !isSpr || isDocument}
											/>
										)}
									/>
								</Stack>
							</Grid>
						</>
					)
				})}
			</Grid>
			<LoadingButton
				disabled={
					!isSpr ||
					disableForm ||
					(getSchedule('schedule')?.length ?? 0) >=
						(ScheduleTypeData?.length ?? 0)
				}
				loading={ScheduleTypeLoading}
				onClick={addScheduleItem}
				sx={{ alignSelf: 'start' }}
				startIcon={<AddOutlinedIcon />}
			>
				<Typography variant="body2" fontWeight={700}>
					Tambah Penjadwalan
				</Typography>
			</LoadingButton>
			<Stack alignItems="center">
				<ErrorLabel>{errorsSchedule?.schedule?.message}</ErrorLabel>
			</Stack>
			<Box height={'24px'} />
			{isSpr && !disableForm && (
				<LoadingButton
					onClick={openConfirmDialog}
					sx={{ alignSelf: 'start' }}
					variant="contained"
				>
					<Typography color="white" variant="body2" fontWeight={700}>
						Simpan
					</Typography>
				</LoadingButton>
			)}
		</>
	)
}

export default ScheduleContentTab
