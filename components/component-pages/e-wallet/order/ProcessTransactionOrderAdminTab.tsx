import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, {
	ForwardedRef,
	forwardRef,
	useContext,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react'
import useFetch from '../../../../hooks/useFetch'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import CustomChip from '../../../chip/CustomChip'
import InfiniteScrollList from '../../../list/InfiniteScrollList'
import CustomSkeleton from '../../../skeleton/CustomSkeleton'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import ClipboardChecked from '../../../icons/ClipboardChecked'
import { formatNumber } from '../../../../utils/number'
import Checkbox from '@mui/material/Checkbox'
import ButtonUploadField from '../../../field/ButtonUploadField'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import redeemFormValues, {
	RedeemFormValues,
} from '../../../../schema/redeemFormSchema'
import ErrorLabel from '../../../label/ErrorLabel'
import useApiCUD from '../../../../hooks/useApiCUD'
import { IDeveloperRedeemMultiplePostBody } from '../../../../interfaces/interfaceApiDeveloperRedeemMultiple'
import helper from '../../../../utils/helper'
import { ToastProviderContext } from '../../../../providers/ToastProvider'
import ConfirmDialog from '../../../dialog/ConfirmDialog'
import useDisclose from '../../../../hooks/useDisclose'
import LoadingButton from '@mui/lab/LoadingButton'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import DownloadIcon from '@mui/icons-material/Download'
import uploadRedeemReceiptFormSchema, {
	UploadRedeemReceiptFormValues,
} from '../../../../schema/uploadRedeemReceiptFormSchema'
import TransactionBookingCard from '../TransactionBookingCard'
import RedeemFailedDialog from './RedeemFailedDialog'

export interface RefProcessTransactionOrderAdminTab {
	submit: () => void
}

export interface PropsProcessTransactionOrderAdminTab {
	onCheckChange: (amount: string | number, count: string | number) => void
	bookingId?: string
}

function ProcessTransactionOrderAdminTab(
	{ onCheckChange, bookingId }: PropsProcessTransactionOrderAdminTab,
	ref: ForwardedRef<RefProcessTransactionOrderAdminTab>
) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		close: closeRedeemDialog,
		open: openRedeemDialog,
		isOpen: isOpenRedeemDialog,
	} = useDisclose()

	const {
		close: closeFailedRedeemDialog,
		isOpen: isOpenFailedRedeemDialog,
		openWithData: openFailedRedeemDialog,
		selectedData: selectedFailedRedeemDialog,
	} = useDisclose<ITransactionGet[]>()
	const router = useRouter()
	const {
		handleSubmit: handleSubmit,
		formState: { errors: errors },
		register: register,
		getValues,
		setValue,
		watch,
		control,
		clearErrors,
	} = useForm<UploadRedeemReceiptFormValues>({
		resolver: yupResolver(uploadRedeemReceiptFormSchema),
	})
	const {
		data: trxData,
		getAll: trxGetAll,
		loading: trxLoading,
		isNextPage: trxIsNext,
	} = useFetch<ITransactionGet>(
		ENDPOINTS.TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH,
		{
			limit: 10,
			mode: 'next',
		}
	)

	useEffect(() => {
		setValue(
			'transaction',
			trxData.map((v) => ({
				id: v.id,
				checked: false,
				receipt: { id: undefined, url: undefined },
				redeemId: v.current_redeem?.id,
			}))
		)
		onCheckChange(0, 0)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trxData])

	const { edit: redeemEdit, loading: redeemCudLoading } = useApiCUD(
		ENDPOINTS.DEVELOPER_REDEEM_MULTIPLE,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const doRedeem = async () => {
		const values = getValues('transaction')
		const body: IDeveloperRedeemMultiplePostBody[] = values.filter((v) => v.checked).map((v) => ({
			transaction_id: v.id,
			id: v.redeemId,
			file_redeem: [
				{
					description: 'RECEIPT',
					master_document_id: v.receipt.id,
					master_document_url: helper.filePath(v?.receipt?.url ?? ''),
				},
			],
			is_paid: true,
		}))
		const res = await redeemEdit(body, '')
		if (helper.isErrorApi(res)) {
			if (res && 'data' in res) {
				trxGetAllWParams()
				closeRedeemDialog()
				onCheckChange(0, 0)
				openFailedRedeemDialog(res.data as ITransactionGet[])
			} else {
				openToast(true, 'error', res?.message ?? 'Terjadi Kesalahan')
			}
		} else {
			openToast(true, 'success', 'Pengajuan Pencairan Berhasil. ')
			trxGetAllWParams()
			closeRedeemDialog()
			onCheckChange(0, 0)
		}
	}

	useImperativeHandle(ref, () => ({
		submit: handleSubmit(() => openRedeemDialog()),
	}))

	const trxGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([
			['developer_id', router.query.id],
			['AND'],
			['redeem_status', 2],
			['AND'],
			['booking_id', bookingId],
		])
		// }
		await trxGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	useEffect(() => {
		if (router.query.id && bookingId) {
			trxGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id, bookingId])

	const calculateAmount = () => {
		const values = getValues('transaction')
		let amount = 0
		let count = 0
		values?.forEach((v, vI) => {
			amount += v.checked ? trxData?.[vI]?.total : 0
			count += v.checked ? 1 : 0
		})
		return { amount, count: count }
	}

	const onClickSelectAll = (val?: boolean) => {
		const oldVal = getValues('transaction')
		setValue(
			'transaction',
			oldVal.map((v) => ({
				...v,
				checked: val,
				receipt: !val ? { id: undefined, url: undefined } : v.receipt,
			}))
		)
		clearErrors('transaction')
		const calculate = calculateAmount()
		onCheckChange(calculate.amount, calculate.count)
	}

	const onClickSelect = (id: string, val: boolean) => {
		const oldVal = getValues('transaction')
		const newVal = oldVal.map((v) => {
			if (v.id == id)
				return {
					...v,
					checked: val,
					receipt: !val ? { id: undefined, url: undefined } : v.receipt,
				}
			else return v
		})
		setValue('transaction', newVal)
		clearErrors('transaction')
		const calculate = calculateAmount()
		onCheckChange(calculate.amount, calculate.count)
	}

	const getStatusProgress = (status: number) => {
		let statusProgress = { color: 'grey.400', label: 'Belum Cair' }
		switch (status) {
			case 1:
				statusProgress = { color: 'primary.main', label: 'Pencairan Diajukan' }
				break
			case 2:
				statusProgress = { color: 'warning.main', label: 'Pencairan Diproses' }
				break
			case 3:
				statusProgress = { color: 'error.main', label: 'Pencairan Ditolak' }
				break
			case 4:
				statusProgress = { color: 'success.main', label: 'Pencairan Selesai' }
				break

			default:
				break
		}
		return statusProgress
	}
	const renderSaldoItemCard = (
		props:
			| {
					data?: ITransactionGet
					loading?: boolean
			  }
			| undefined
	) => {
		const trxIndexForm = watch('transaction')?.findIndex(
			(v) => v.id == props?.data?.id
		)
		const trxDataForm = watch('transaction')?.find(
			(v) => v.id == props?.data?.id
		)
		return (
			<TransactionBookingCard
				data={props?.data}
				loading={props?.loading}
				showFile
				renderLeftSection={(id) => (
					<Checkbox
						checked={trxDataForm?.checked ?? false}
						onChange={(ev, val) => onClickSelect(id ?? '', val)}
						size="small"
						sx={{ p: 0, my: 1 }}
					/>
				)}
				renderBottomSection={(id) =>
					watch('transaction')?.find((wf) => wf.id == props?.data?.id)
						?.checked && (
						<Stack direction="row" spacing={2}>
							<Stack>
								<Controller
									control={control}
									name={`transaction[${trxIndexForm}].receipt` as any}
									render={({ field: { name, onChange } }) => (
										<ButtonUploadField
											text
											label="Upload bukti pembayaran"
											onChange={(v) => onChange(v)}
											value={watch(name)?.url}
											title="Bukti Pembayaran"
										/>
									)}
								/>
								{(Boolean(
									errors?.transaction?.[trxIndexForm]?.receipt?.id?.message
								) ||
									Boolean(
										errors?.transaction?.[trxIndexForm]?.receipt?.message
									)) && (
									<ErrorLabel>
										{errors?.transaction?.[trxIndexForm]?.receipt?.id
											?.message ??
											errors?.transaction?.[trxIndexForm]?.receipt?.message}
									</ErrorLabel>
								)}
							</Stack>
						</Stack>
					)
				}
			/>
		)
	}

	const redeemDialog = (
		<ConfirmDialog
			open={isOpenRedeemDialog}
			onClose={closeRedeemDialog}
			maxWidth="md"
			title={'Konfirmasi Pencairan Dana'}
			renderAction={
				<Stack direction="row" spacing={2} width="100%">
					<LoadingButton
						onClick={doRedeem}
						variant="contained"
						loading={redeemCudLoading}
					>
						<Typography variant="body2" fontWeight={700} color="white">
							Konfirmasi
						</Typography>
					</LoadingButton>
					<Button
						onClick={closeRedeemDialog}
						variant="contained"
						color="inherit"
					>
						<Typography variant="body2" fontWeight={700}>
							Kembali
						</Typography>
					</Button>
				</Stack>
			}
		>
			<Stack>
				<Typography mb={1}>
					Apakah anda yakin akan mencairkan saldoe-Wallet dengan rincian :
				</Typography>
				<Typography fontWeight={700}>Detail Pencairan :</Typography>
				<Stack
					bgcolor="grey.300"
					py={2}
					px={3}
					maxHeight="398px"
					overflow="auto"
				>
					{watch('transaction')
						?.filter((ft) => ft.checked)
						?.map((mt, mI) => {
							const trxFromId = trxData?.find((fiT) => fiT.id == mt.id)
							return (
								<Grid key={mI} container spacing={1.5}>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Nama Pembeli
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Typography variant="body2" fontWeight={600}>
											{trxFromId?.buyer?.name ?? '-'}
										</Typography>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Kode Booking
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Typography variant="body2" fontWeight={600}>
											{trxFromId?.booking?.booking_code ?? '-'}
										</Typography>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Detail Unit
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Typography variant="body2" fontWeight={600}>
											{trxFromId?.developer?.developer_name} -{' '}
											{
												trxFromId?.unit_block_data?.developer_project_data
													.project_name
											}{' '}
											- Tipe{' '}
											{
												trxFromId?.unit_block_data?.data_type_unit
													.type_unit_name
											}{' '}
											- Blok {trxFromId?.unit_block_data?.block_name} Nomor{' '}
											{trxFromId?.unit_block_data?.block_number}
										</Typography>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Jenis Penarikan
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Typography variant="body2" fontWeight={600}>
											{trxFromId?.transaction_type}
											{trxFromId?.developer_payment_schedule
												? ' DP ke ' +
												  trxFromId?.developer_payment_schedule.termin
												: ''}
										</Typography>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											No. Transaksi
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Typography variant="body2" fontWeight={600}>
											{trxFromId?.transaction_code}
										</Typography>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Jumlah Penarikan
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Typography variant="body2" fontWeight={600}>
											{formatNumber(trxFromId?.total ?? '0')}
										</Typography>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Invoice
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Button
											onClick={() =>
												window.open(
													helper.fileUrl(
														trxFromId?.current_redeem?.file_redeem?.find(
															(cr) => cr.description == 'INVOICE'
														)?.master_document_url ?? ''
													),
													'_blank'
												)
											}
											size="small"
											color="inherit"
											variant="text"
											startIcon={<DownloadIcon />}
											sx={{ color: '#317DFF', fontWeight: 700 }}
										>
											Invoice
										</Button>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Kwitansi
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Button
											onClick={() =>
												window.open(
													helper.fileUrl(
														trxFromId?.current_redeem?.file_redeem?.find(
															(cr) => cr.description == 'KWITANSI'
														)?.master_document_url ?? ''
													),
													'_blank'
												)
											}
											size="small"
											color="inherit"
											variant="text"
											startIcon={<DownloadIcon />}
											sx={{ color: '#317DFF', fontWeight: 700 }}
										>
											Kwitansi
										</Button>
									</Grid>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Bukti Transfer
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Button
											onClick={() =>
												window.open(mt?.receipt?.url ?? '', '_blank')
											}
											size="small"
											color="inherit"
											variant="text"
											startIcon={<DownloadIcon />}
											sx={{ color: '#317DFF', fontWeight: 700 }}
										>
											Kwitansi
										</Button>
									</Grid>
									{mI + 1 <
										watch('transaction')?.filter((ft) => ft.checked).length && (
										<Grid item xs={12}>
											<Divider
												sx={{
													mb: 2,
													borderBottomWidth: 'medium',
													borderStyle: 'dashed',
												}}
											/>
										</Grid>
									)}
								</Grid>
							)
						})}
				</Stack>
				<Typography>
					Pastikan bukti pembayaran yang anda unggah sudah sesuai dengan nominal
					yang anda transfer{' '}
					<Typography component="span" fontWeight={700}>
						sudah sesuai
					</Typography>
					.
				</Typography>
			</Stack>
		</ConfirmDialog>
	)
	return (
		<>
			{redeemDialog}
			<RedeemFailedDialog
				open={isOpenFailedRedeemDialog}
				onClose={closeFailedRedeemDialog}
				title={'Perubahan Status Pencairan saldo e-Wallet gagal'}
				data={selectedFailedRedeemDialog ?? []}
			/>
			<Divider sx={{ mx: -3 }} />
			{Boolean(trxData.length) && (
				<Stack direction="row" alignItems="center" spacing={1}>
					<Checkbox
						checked={!watch('transaction')?.find((v) => !v.checked) ?? false}
						onChange={(ev, val) => onClickSelectAll(val)}
						size="small"
						sx={{ p: 0, my: 1 }}
					/>
					<Typography variant="body2">Pilih Semua</Typography>
				</Stack>
			)}
			<Divider sx={{ mx: -3, mb: 1 }} />
			<Stack height="100%" overflow="auto">
				<InfiniteScrollList
					data={trxData}
					render={(props) => renderSaldoItemCard(props)}
					loading={trxLoading || !router.query.id}
					isNext={trxIsNext}
					getData={() => trxGetAllWParams({ isNext: true })}
					noPadding
				/>
			</Stack>
		</>
	)
}

export default forwardRef(ProcessTransactionOrderAdminTab)
