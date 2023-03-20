import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import React, { useContext, useEffect, useState } from 'react'
import { formatDateDash, formatDateSpace, formatIsoString } from '../../../../utils/date'
import { formatNumber } from '../../../../utils/number'
import ButtonUploadField from '../../../field/ButtonUploadField'
import NumberFormatField from '../../../field/NumberFormatField'
import CustomTable from '../../../tables/CustomTable'
import InfoIcon from '@mui/icons-material/Info'
import CircleIcon from '@mui/icons-material/Circle'
import DatePickerField from '../../../field/DatePickerField'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import transactionPaymentFormSchema, {
	TransactionPaymentFormValues,
} from '../../../../schema/transactionPaymentFormSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import useFetch from '../../../../hooks/useFetch'
import { IDeveloperDetailTransaction } from '../../../../interfaces/interfaceApiDeveloperDetailTransaction'
import Button from '@mui/material/Button'
import useApiCUD from '../../../../hooks/useApiCUD'
import { LoadingButton } from '@mui/lab'
import helper from '../../../../utils/helper'
import { ToastProviderContext } from '../../../../providers/ToastProvider'
import { IDeveloperPaymentSchedule } from '../../../../interfaces/interfaceApiDeveloperPaymentSchedule'
import DefaultPagination from '../../../pagination/DefaultPagination'
import Box from '@mui/material/Box'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ConfirmDialog from '../../../dialog/ConfirmDialog'
import useDisclose from '../../../../hooks/useDisclose'
import CustomSkeleton from '../../../skeleton/CustomSkeleton'
import DefaultPopover from '../../../popover/DefaultPopover'
import HelpIcon from '@mui/icons-material/Help'

interface PropsPaymentContentTab {
	isSpr?: boolean
	transactionData?: ITransactionGet
	disableForm?: boolean
	onSave?: () => void
}

function PaymentContentTab({
	isSpr,
	transactionData,
	disableForm,
	onSave,
}: PropsPaymentContentTab) {
	const { openToast } = useContext(ToastProviderContext)
	const [showAdd, setShowAdd] = useState(false)
	const [showAddDp, setShowAddDp] = useState(false)

	const {
		handleSubmit,
		control,
		formState: { errors },
		register,
		setValue,
		watch,
		getValues,
	} = useForm<TransactionPaymentFormValues>({
		resolver: yupResolver(transactionPaymentFormSchema),
	})

	const {
		getOne: devTrxGetOne,
		dataSingle: devTrxData,
		loading: devTrxLoading,
	} = useFetch<IDeveloperDetailTransaction>(
		ENDPOINTS.DEVELOPER_DETAIL_TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)
	const { edit: devTrxEdit, loading: devTrxCudLoading } = useApiCUD(
		ENDPOINTS.DEVELOPER_DETAIL_TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const devTrxGetOneWParams = async () => {
		await devTrxGetOne(
			`/${transactionData?.booking.developer_detail_transaction?.id}`
		)
	}

	const doEdit = async (values: TransactionPaymentFormValues) => {
		const res = await devTrxEdit(
			{
				first_installment_date: formatDateDash(values.date),
				additional_price: Number(values?.add ?? '0'),
				additional_price_dp: Number(values?.addDp ?? '0'),
				reduction_price: Number(values?.sub ?? '0'),
				reduction_price_dp: Number(values?.subDp ?? '0'),
				additional_price_description: values.addDesc,
				additional_price_dp_description: values.addDpDesc,
				reduction_price_description: values.subDesc,
				reduction_price_dp_description: values.subDpDesc,
				netto_price: Number(values?.priceNet ?? '0'),
				dp_nominal_nett: Number(values?.dpNet ?? '0'),
				installment_amount: Number(values?.monthlyInstallment ?? '0'),
			},
			transactionData?.booking.developer_detail_transaction?.id ?? '0'
		)
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			onSave?.()
		}
	}

	const fillForm = () => {
		setValue('date', devTrxData?.first_installment_date)
		setValue('add', devTrxData?.additional_price?.toString() ?? '')
		setValue('addDesc', devTrxData?.additional_price_description ?? '')
		setValue('addDp', devTrxData?.additional_price_dp?.toString() ?? '')
		setValue('addDpDesc', devTrxData?.additional_price_dp_description ?? '')
		setValue('sub', devTrxData?.reduction_price?.toString() ?? '')
		setValue('subDesc', devTrxData?.reduction_price_description ?? '')
		setValue('subDp', devTrxData?.reduction_price_dp?.toString() ?? '')
		setValue('subDpDesc', devTrxData?.reduction_price_dp_description ?? '')
		setValue(
			'priceNet',
			devTrxData?.netto_price?.toString() ??
				(transactionData?.unit_block_price?.unit_nominal_nett ?? 0).toString()
		)
		setValue(
			'dpNet',
			devTrxData?.dp_nominal_nett?.toString() ??
				(transactionData?.unit_block_price?.dp_nett ?? 0).toString()
		)
		setValue(
			'monthlyInstallment',
			devTrxData?.installment_amount?.toString() ??
				transactionData?.unit_block_price?.monthly_installment ??
				0
		)
	}

	const clearForm = () => {
		setValue('add', '')
		setValue('addDesc', '')
		setValue('addDp', '')
		setValue('addDpDesc', '')
		setValue('sub', '')
		setValue('subDesc', '')
		setValue('subDp', '')
		setValue('subDpDesc', '')
		setValue(
			'priceNet',
			(transactionData?.unit_block_price?.unit_nominal_nett ?? 0).toString()
		)
		setValue(
			'dpNet',
			(transactionData?.unit_block_price?.dp_nett ?? 0).toString()
		)
		setValue(
			'monthlyInstallment',
			(transactionData?.unit_block_price?.monthly_installment ?? 0).toString()
		)
	}

	const calculateTotalPrice = () => {
		const totalPrice =
			(transactionData?.unit_block_price?.unit_nominal_nett ?? 0) +
			Number(getValues('add') ?? '0') -
			Number(getValues('sub') ?? '0')
		const totalDp =
			(transactionData?.unit_block_price?.dp_nett ?? 0) +
			Number(getValues('addDp') ?? '0') -
			Number(getValues('subDp') ?? '0')
		let totalInstallment = 0
		if (transactionData?.unit_block_price.type_payment == 'KPR') {
			totalInstallment =
				totalDp / (transactionData?.unit_block_price?.dp_installment_termin ?? 1)
		} else {
			totalInstallment =
				(totalPrice - totalDp) /
				(transactionData?.unit_block_price?.dp_installment_termin ?? 1)
		}
		setValue('priceNet', totalPrice.toString())
		setValue('dpNet', totalDp.toString())
		setValue('monthlyInstallment', totalInstallment.toString())
	}

	const {
		getAll: trxScdGetAll,
		data: trxScdData,
		loading: trxScdLoading,
		meta: trxScdMeta,
	} = useFetch<IDeveloperPaymentSchedule>(
		ENDPOINTS.DEVELOPER_PAYMENT_SCHEDULES,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH,
		{ limit: 10, mode: 'next-prev' }
	)

	const trxScdGetAllWParams = async (params?: { page?: number }) => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([
			'developer_detail_transaction_id',
			transactionData?.booking.developer_detail_transaction?.id,
		])
		await trxScdGetAll(queryParams, { toPage: params?.page ?? 0 })
	}

	useEffect(() => {
		if (devTrxData) fillForm()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [devTrxData])
	useEffect(() => {
		if (transactionData) {
			devTrxGetOneWParams()
			trxScdGetAllWParams()
		}
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
			title="Anda yakin data yang dimasukkan sudah benar?"
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
						onClick={handleSubmit(doEdit)}
						loading={devTrxCudLoading}
						variant="contained"
					>
						<Typography variant="caption" color="white" fontWeight={700}>
							GENERATE PEMBAYARAN
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
					Jika anda menekan tombol generate pembayaran, maka data informasi yang
					anda masukkan akan ditagihkan ke buyer. Data yang sudah ditambahkan{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						tidak dapat diubah
					</Typography>
					. Jadi pastikan data yang Anda input{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						sudah sesuai
					</Typography>
				</Typography>
			</Stack>
		</ConfirmDialog>
	)

	return (
		<CustomSkeleton width="100%" loading={devTrxLoading}>
			<>
				{confirmDialog}
				<Grid container spacing={2}>
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
					<Grid item xs={12} md={6}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Tanggal Pemesanan
						</Typography>
						<Typography variant="body1" fontWeight={700}>
							{formatDateSpace(transactionData?.booking?.booking_date)}
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Cara Pembayaran
						</Typography>
						<Typography variant="body1" fontWeight={700}>
							{transactionData?.unit_block_price?.type_payment}
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Termin Pembayaran
						</Typography>
						<Typography variant="body1" fontWeight={700}>
							{transactionData?.unit_block_price?.dp_installment_termin +
								' kali' ?? 0 + ' kali'}
							{transactionData?.unit_block_price.type_payment == 'INHOUSE' &&
							transactionData?.unit_block_price.dp_nett
								? ' + 1 kali DP'
								: ''}
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Harga{' '}
							<Typography variant="caption" color="grey.400">
								(yang tampil di aplikasi)
							</Typography>
						</Typography>
						<Typography variant="body1" fontWeight={700}>
							{formatNumber(
								transactionData?.unit_block_price?.unit_nominal_nett ?? 0
							)}
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							DP{' '}
							<Typography variant="caption" color="grey.400">
								(yang tampil di aplikasi)
							</Typography>
						</Typography>
						<Typography variant="body1" fontWeight={700}>
							{formatNumber(transactionData?.unit_block_price?.dp_nett ?? 0)}
						</Typography>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							UTJ
						</Typography>
						<Typography variant="body1" fontWeight={700}>
							{formatNumber(transactionData?.grand_total ?? 0)}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Stack width={{ xs: '100%', md: '50%' }} pr={{ xs: 0, md: 1 }}>
							<Typography variant="caption" fontWeight={700} color="grey.400">
								Tanggal Cicilan Awal
							</Typography>
							<Controller
								control={control}
								name={'date'}
								render={({ field: { value, onChange, name } }) => (
									<DatePickerField
										onChange={(v) => onChange(v)}
										placeholder="Pilih Tanggal"
										value={watch(name)}
										error={!!errors.date?.message}
										helperText={errors.date?.message}
										disabled={
											disableForm ||
											devTrxData?.is_generate ||
											!transactionData?.booking.status_buyer
										}
									/>
								)}
							/>
						</Stack>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Total Harga Tertagih
						</Typography>
						<Stack alignItems="center" direction="row" spacing={2}>
							<Typography variant="h4" fontWeight={700}>
								Rp {formatNumber(watch('priceNet') ?? '0')}
							</Typography>
							<DefaultPopover
								id="total-price"
								renderContent={
									<Stack p={2} width="374px">
										<Typography>
											Total harga tertagih adalah hasil perhitungan harga final
											setelah dihitung dengan{' '}
											<Typography component="span" fontWeight={700}>
												biaya-biaya lainnya
											</Typography>
											.
										</Typography>
									</Stack>
								}
							>
								<HelpIcon sx={{ fill: (thm) => thm.palette.grey[400] }} />
							</DefaultPopover>
						</Stack>
						<Button
							endIcon={
								showAdd ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
							}
							onClick={() => setShowAdd((v) => !v)}
							variant="text"
							size="small"
							sx={{ width: 'fit-content' }}
						>
							Tambahkan panambah atau pengurang harga
						</Button>
					</Grid>
					{showAdd && (
						<>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Penambah Harga
								</Typography>
								<NumberFormatField
									startAdornment={<Typography>Rp</Typography>}
									onChange={(v) => {
										setValue('add', v)
										calculateTotalPrice()
									}}
									value={getValues('add')}
									readOnly={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									error={errors?.add?.message}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Keterangan Penambah Harga
								</Typography>
								<TextField
									{...register('addDesc')}
									disabled={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									size="small"
									fullWidth
									placeholder="Tulis Keterangan"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Pengurang Harga
								</Typography>
								<NumberFormatField
									startAdornment={<Typography>Rp</Typography>}
									onChange={(v) => {
										setValue('sub', v)
										calculateTotalPrice()
									}}
									value={getValues('sub')}
									readOnly={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									error={errors?.sub?.message}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Keterangan Pengurang Harga
								</Typography>
								<TextField
									{...register('subDesc')}
									disabled={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									size="small"
									fullWidth
									placeholder="Tulis Keterangan"
								/>
							</Grid>
						</>
					)}
				</Grid>
				<Divider sx={{ my: 3 }} />
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Dp Tertagih
						</Typography>
						<Stack direction="row" alignItems="center" spacing={2}>
							<Typography variant="h4" fontWeight={700}>
								Rp {formatNumber(watch('dpNet') ?? '0')}
							</Typography>
							<DefaultPopover
								id="total-price"
								renderContent={
									<Stack p={2} width="374px">
										<Typography>
											DP tertagih adalah nilai DP yang akan{' '}
											<Typography component="span" fontWeight={700}>
												dibayarkan
											</Typography>{' '}
											oleh Buyer setelah dihitung dengan{' '}
											<Typography component="span" fontWeight={700}>
												biaya-biaya lainnya
											</Typography>
											.
										</Typography>
									</Stack>
								}
							>
								<HelpIcon sx={{ fill: (thm) => thm.palette.grey[400] }} />
							</DefaultPopover>
						</Stack>
						<Button
							endIcon={
								showAddDp ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
							}
							onClick={() => setShowAddDp((v) => !v)}
							variant="text"
							size="small"
							sx={{ width: 'fit-content' }}
						>
							Tambahkan panambah atau pengurang harga
						</Button>
					</Grid>
					{showAddDp && (
						<>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Penambah Dp
								</Typography>
								<NumberFormatField
									startAdornment={<Typography>Rp</Typography>}
									onChange={(v) => {
										setValue('addDp', v)
										calculateTotalPrice()
									}}
									value={getValues('addDp')}
									readOnly={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									error={errors?.addDp?.message}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Keterangan Penambah Dp
								</Typography>
								<TextField
									{...register('addDpDesc')}
									disabled={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									size="small"
									fullWidth
									placeholder="Tulis Keterangan"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Pengurang Dp
								</Typography>
								<NumberFormatField
									startAdornment={<Typography>Rp</Typography>}
									onChange={(v) => {
										setValue('subDp', v)
										calculateTotalPrice()
									}}
									value={getValues('subDp')}
									error={errors?.sub?.message}
									readOnly={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Keterangan Pengurang Dp
								</Typography>
								<TextField
									{...register('subDpDesc')}
									disabled={
										devTrxData?.is_generate ||
										disableForm ||
										!transactionData?.booking.status_buyer
									}
									size="small"
									fullWidth
									placeholder="Tulis Keterangan"
								/>
							</Grid>
						</>
					)}
				</Grid>
				<Divider sx={{ my: 3 }} />
				<Grid container spacing={2}>
					<Grid item xs={12} md={4}>
						<Typography variant="caption" fontWeight={700} color="grey.400">
							Tagihan Cicilan perbulan
						</Typography>
						<Stack direction="row" alignItems="center" spacing={2}>
							<Typography variant="h4" fontWeight={700}>
								Rp {formatNumber(watch('monthlyInstallment') ?? '0')}
							</Typography>
							<DefaultPopover
								id="total-price"
								renderContent={
									<Stack p={2} width="374px">
										<Typography>
											Cicilan perbulan adalah nilai yang akan{' '}
											<Typography component="span" fontWeight={700}>
												dibayarkan
											</Typography>{' '}
											oleh buyer setiap bulan. Cicilan perbulan dihitung dari
											nilai{' '}
											<Typography component="span" fontWeight={700}>
												total tertagih
											</Typography>{' '}
											dibagi dengan{' '}
											<Typography component="span" fontWeight={700}>
												termin
											</Typography>{' '}
											yang dipilih oleh buyer.
										</Typography>
									</Stack>
								}
							>
								<HelpIcon sx={{ fill: (thm) => thm.palette.grey[400] }} />
							</DefaultPopover>
						</Stack>
					</Grid>
				</Grid>
				{!devTrxData?.is_generate &&
					!disableForm &&
					transactionData?.booking.status_buyer && (
						<>
							<Divider sx={{ my: 3 }} />
							<Stack spacing={2} direction="row" justifyContent="end">
								<LoadingButton
									onClick={clearForm}
									variant="contained"
									color="inherit"
									sx={{
										fontWeight: 700,
										// color: 'white',
										width: 'fit-content',
									}}
								>
									Hapus
								</LoadingButton>
								<LoadingButton
									onClick={openConfirmDialog}
									variant="contained"
									sx={{
										fontWeight: 700,
										color: 'white',
										width: 'fit-content',
									}}
								>
									Generate Pembayaran
								</LoadingButton>
							</Stack>
						</>
					)}
				<Divider sx={{ my: 3 }} />
				<Typography mb={2} variant="body1" fontWeight={700}>
					Pembayaran UTJ
				</Typography>
				<CustomTable
					data={[
						{
							keterangan: 'UTJ',
							tgl: transactionData?.created_at,
							nominal: transactionData?.total,
							buyerStatus: transactionData?.booking?.booking_is_paid,
							redeemStatus: transactionData?.redeem_status,
						},
					]}
					headers={[
						{
							label: 'JENIS PEMBAYARAN',
							key: 'keterangan',
							align: 'center',
							weight: 700,
						},
						{
							label: 'TANGGAL JATUH TEMPO',
							key: 'tgl',
							align: 'center',
							weight: 700,
							render: (item, itemI) => formatDateSpace(item.tgl),
						},
						{
							label: 'NOMINAL CICILAN',
							key: 'nominal',
							align: 'center',
							weight: 700,
							render: (item, itemI) =>
								`Rp ${formatNumber(item?.nominal ?? '0')}`,
						},
						{
							label: 'STATUS BUYER',
							key: 'buyerStatus',
							align: 'center',
							weight: 700,
							render: (item) => (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
									justifyContent="center"
								>
									<CircleIcon
										color={item.buyerStatus ? 'success' : 'error'}
										sx={{ width: '10px', height: '10px' }}
									/>
									<Typography
										color={item.buyerStatus ? 'success.main' : 'error.main'}
										variant="caption"
										fontWeight={700}
									>
										{item.buyerStatus ? 'Terbayar' : 'Belum Lunas'}
									</Typography>
								</Stack>
							),
						},
						{
							label: 'STATUS PENCAIRAN',
							key: 'redeemStatus',
							align: 'center',
							weight: 700,
							render: (item) => (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
									justifyContent="center"
								>
									<CircleIcon
										color={item.redeemStatus ? 'success' : 'error'}
										sx={{ width: '10px', height: '10px' }}
									/>
									<Typography
										color={item.redeemStatus ? 'success.main' : 'error.main'}
										variant="caption"
										fontWeight={700}
									>
										{item.redeemStatus ? 'Sudah Dicairkan' : 'Belum Dicairkan'}
									</Typography>
								</Stack>
							),
						},
					]}
				/>
				<Divider sx={{ my: 3 }} />
				<Typography mb={2} variant="body1" fontWeight={700}>
					Detail Pembayaran
				</Typography>
				<CustomTable
					data={trxScdData}
					loading={trxScdLoading}
					headers={[
						{
							label: 'JENIS PEMBAYARAN',
							key: 'payment_type',
							align: 'center',
							weight: 700,
						},
						{
							label: 'TANGGAL JATUH TEMPO',
							key: 'deadline_payment',
							align: 'center',
							weight: 700,
							render: (item, itemI) => formatDateSpace(item.deadline_payment),
						},
						{
							label: 'NOMINAL CICILAN',
							key: 'installment_amount',
							align: 'center',
							weight: 700,
							render: (item, itemI) =>
								`Rp ${formatNumber(item?.installment_amount ?? '0')}`,
						},
						{
							label: 'STATUS BUYER',
							key: 'buyer_status',
							align: 'center',
							weight: 700,
							render: (item) => (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
									justifyContent="center"
								>
									<CircleIcon
										color={item.buyer_status ? 'success' : 'error'}
										sx={{ width: '10px', height: '10px' }}
									/>
									<Typography
										color={item.buyer_status ? 'success.main' : 'error.main'}
										variant="caption"
										fontWeight={700}
									>
										{item.buyer_status ? 'Terbayar' : 'Belum Lunas'}
									</Typography>
								</Stack>
							),
						},
						// {
						// 	label: 'UPLOAD KWITANSI',
						// 	key: 'developer_detail_transaction_id',
						// 	align: 'center',
						// 	weight: 700,
						// 	noPadding: true,
						// 	render: (item) => (
						// 		<Stack alignItems="center">
						// 			<ButtonUploadField
						// 				text
						// 				onChange={function (
						// 					v?:
						// 						| { url?: string | undefined; id?: string | undefined }
						// 						| undefined
						// 				): void {
						// 					throw new Error('Function not implemented.')
						// 				}}
						// 			/>
						// 		</Stack>
						// 	),
						// },
						{
							label: 'STATUS PENCAIRAN',
							key: 'redeem_status',
							align: 'center',
							weight: 700,
							render: (item) => (
								<Stack
									direction="row"
									spacing={1}
									alignItems="center"
									justifyContent="center"
								>
									<CircleIcon
										color={item.redeem_status ? 'success' : 'error'}
										sx={{ width: '10px', height: '10px' }}
									/>
									<Typography
										color={item.redeem_status ? 'success.main' : 'error.main'}
										variant="caption"
										fontWeight={700}
									>
										{item.redeem_status ? 'Sudah Dicairkan' : 'Belum Dicairkan'}
									</Typography>
								</Stack>
							),
						},
					]}
				/>
				<Box mx={4}>
					<DefaultPagination
						count={trxScdMeta.total_pages}
						onChange={(page) => trxScdGetAllWParams({ page })}
						page={trxScdMeta.page + 1}
						limit={10}
						totalData={trxScdMeta.total}
						visibleCount={trxScdMeta.visible}
						loading={trxScdLoading}
					/>
				</Box>
			</>
		</CustomSkeleton>
	)
}

export default PaymentContentTab
