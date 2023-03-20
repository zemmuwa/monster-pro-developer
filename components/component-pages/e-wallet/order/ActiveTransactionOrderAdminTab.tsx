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
} from 'react'
import useFetch from '../../../../hooks/useFetch'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import InfiniteScrollList from '../../../list/InfiniteScrollList'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import { formatNumber } from '../../../../utils/number'
import Checkbox from '@mui/material/Checkbox'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
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
import redeemApprovalFormSchema, {
	RedeemApprovalFormValues,
} from '../../../../schema/redeemApprovalFormSchema'
import TransactionBookingCard from '../TransactionBookingCard'
import RedeemFailedDialog from './RedeemFailedDialog'

export interface RefActiveTransactionOrderAdminTab {
	accept: () => void
	reject: () => void
}

export interface PropsActiveTransactionOrderAdminTab {
	onCheckChange: (amount: string | number, count: string | number) => void
	bookingId?: string
}

function ActiveTransactionOrderAdminTab(
	{ onCheckChange, bookingId }: PropsActiveTransactionOrderAdminTab,
	ref: ForwardedRef<RefActiveTransactionOrderAdminTab>
) {
	const { openToast } = useContext(ToastProviderContext)
	const {
		close: closeRedeemDialog,
		open: openRedeemDialog,
		isOpen: isOpenRedeemDialog,
	} = useDisclose()
	const {
		close: closeRejectDialog,
		open: openRejectDialog,
		isOpen: isOpenRejectDialog,
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
	} = useForm<RedeemApprovalFormValues>({
		resolver: yupResolver(redeemApprovalFormSchema),
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

	const doSubmit = async (val: boolean) => {
		const values = getValues('transaction')
		const body: IDeveloperRedeemMultiplePostBody[] = values
			.filter((v) => v.checked)
			.map((v) => ({
				transaction_id: v.id,
				id: v.redeemId,
				is_upload: true,
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
			openToast(true, 'success', 'Status Pencairan Berhasil Diubah.')
			trxGetAllWParams()
			closeRedeemDialog()
			onCheckChange(0, 0)
		}
	}

	useImperativeHandle(ref, () => ({
		accept: handleSubmit(() => openRedeemDialog()),
		reject: handleSubmit(() => openRejectDialog()),
	}))

	const trxGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([
			['developer_id', router.query.id],
			['AND'],
			['redeem_status', 1],
			['AND'],
			['booking_id', bookingId],
			['AND'],
			[['transaction_type', 'UTJ'], ['OR'], ['transaction_type', 'UNT']],
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
		const trxDataForm = watch('transaction')?.find(
			(v) => v.id == props?.data?.id
		)

		return (
			<TransactionBookingCard
				data={props?.data}
				loading={props?.loading}
				renderLeftSection={(id) => (
					<Checkbox
						checked={trxDataForm?.checked ?? false}
						onChange={(ev, val) => onClickSelect(id ?? '', val)}
						size="small"
						sx={{ p: 0, my: 1 }}
					/>
				)}
			/>
		)
	}

	const redeemDialog = (type: 'ACCEPT' | 'REJECT') => {
		const isAccept = type == 'ACCEPT'
		return (
			<ConfirmDialog
				open={isAccept ? isOpenRedeemDialog : isOpenRejectDialog}
				onClose={isAccept ? closeRedeemDialog : closeRejectDialog}
				maxWidth="md"
				title={'Setujui Pencairan Dana Developer?'}
				renderAction={
					<Stack direction="row" spacing={2} width="100%" px={2}>
						<Stack flex={1}>
							<Typography variant="caption" color="grey.400">
								Total yang akan dicairkan
							</Typography>
							<Typography variant="h4">
								Rp {formatNumber(calculateAmount().amount)}
							</Typography>
						</Stack>
						<LoadingButton
							sx={{ flex: 1 }}
							onClick={() => doSubmit(isAccept)}
							variant="contained"
							loading={redeemCudLoading}
							color={isAccept ? undefined : 'error'}
						>
							<Typography variant="body2" fontWeight={700} color="white">
								{isAccept ? 'Setujui Pencairan' : 'Tolak Pencairan'}
							</Typography>
						</LoadingButton>
					</Stack>
				}
			>
				<Stack>
					<Typography mb={1}>
						Apakah anda yakin akan menyetujui pencairan dana developer dengan
						rincian :
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
										{mI + 1 <
											watch('transaction')?.filter((ft) => ft.checked)
												.length && (
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
						Setelah Anda menyetujui pencairan dana dari Developer, Anda harus
						menyelesaikan pembayaran dalam waktu maksimal{' '}
						<Typography component="span" fontWeight={700}>
							3 x 24 Jam
						</Typography>
						.
					</Typography>
				</Stack>
			</ConfirmDialog>
		)
	}
	return (
		<>
			{redeemDialog('ACCEPT')}
			{redeemDialog('REJECT')}
			<RedeemFailedDialog
				open={isOpenFailedRedeemDialog}
				onClose={closeFailedRedeemDialog}
				title={'Konfirmasi Pencairan saldo e-Wallet gagal'}
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

export default forwardRef(ActiveTransactionOrderAdminTab)
