import { yupResolver } from '@hookform/resolvers/yup'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CloseIcon from '@mui/icons-material/Close'
import { LoadingButton } from '@mui/lab'
import { IconButton } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useApiCUD from '../../../../hooks/useApiCUD'
import useDisclose from '../../../../hooks/useDisclose'
import useFetch from '../../../../hooks/useFetch'
import { IDocumentTypeGet } from '../../../../interfaces/interfaceApiDocumentType'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import { ILogBuyerDoc } from '../../../../interfaces/interfaceLogBuyerDoc'
import { ToastProviderContext } from '../../../../providers/ToastProvider'
import transactionDetailBuyerFormSchema, {
	TransactionDetailBuyerFormValues,
} from '../../../../schema/transactionDetailBuyerFormSchema'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import { formatDateSpace } from '../../../../utils/date'
import helper from '../../../../utils/helper'
import ConfirmDialog from '../../../dialog/ConfirmDialog'
import AutoCompleteAsyncField from '../../../field/AutoCompleteAsyncField'
import ErrorLabel from '../../../label/ErrorLabel'
import CustomTable from '../../../tables/CustomTable'

interface PropsBuyerDocumentContentTab {
	transactionData?: ITransactionGet
	disableForm?: boolean
	onSave?: () => void
	transactionSetData?: (data: ITransactionGet) => void
}
function BuyerDocumentContentTab({
	disableForm,
	onSave,
	transactionData,
	transactionSetData,
}: PropsBuyerDocumentContentTab) {
	const { openToast } = useContext(ToastProviderContext)

	const [rejectReasons, setRejectReasons] = useState<string[]>([])
	const [rejectedId, setRejectedId] = useState('')
	useEffect(() => {
		if (transactionData)
			setRejectReasons([
				...(transactionData.booking.developer_detail_transaction?.buyer_transaction_document?.map(
					(bv) => bv?.description ?? ''
				) ?? []),
			])
	}, [transactionData])
	const { edit: rejectBuyerDoc, loading: rejectBuyerDocLoading } = useApiCUD(
		ENDPOINTS.BUYER_TRANSACTION_DOCUMENT,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)
	const doReject = async (value: false | null, desc: string, id: string) => {
		setRejectedId(id)
		const res = await rejectBuyerDoc({ is_valid: value, description: desc }, id)
		setRejectedId('')
		if (helper.isErrorApi(res))
			openToast(true, 'error', res?.message ?? 'Server Error')
		else {
			openToast(true, 'success', 'Data Berhasil Diubah.')
			transactionSetData?.({
				...transactionData,
				booking: {
					...transactionData?.booking,
					developer_detail_transaction: {
						...transactionData?.booking?.developer_detail_transaction,
						buyer_transaction_document:
							transactionData?.booking?.developer_detail_transaction?.buyer_transaction_document?.map(
								(btd, btdI) =>
									btd.id == id
										? { ...btd, description: desc, is_valid: value }
										: btd
							),
					},
				},
			} as ITransactionGet)
			logBuyerDocGetAllWParams()
		}
	}

	const {
		isOpen: isOpenDataBuyerDialog,
		open: openDataBuyerDialog,
		close: closeDataBuyerDialog,
	} = useDisclose()

	const dataBuyerRejectDocumentDialog = (
		<ConfirmDialog
			onClose={closeDataBuyerDialog}
			open={isOpenDataBuyerDialog}
			title="Tolak Dokumen"
			maxWidth="md"
			renderAction={
				<Stack
					py={1}
					px={2}
					width="100%"
					direction="row"
					alignItems="center"
					spacing={1.5}
				>
					{/* <Button variant="contained">
						<Typography variant="caption" color="white" fontWeight={700}>
							KIRIMKAN
						</Typography>
					</Button> */}
					<Button
						onClick={closeDataBuyerDialog}
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
			<CustomTable
				data={
					transactionData?.booking?.developer_detail_transaction
						?.buyer_transaction_document ?? []
				}
				headers={[
					{
						key: 'master_document_url',
						label: 'Nama Dokumen',
						// noPadding: true,
						align: 'center',
						render: (item) => (
							<Stack direction="row" alignItems="center" spacing={1.5}>
								<Avatar
									src={helper.fileUrl(item.master_document_url ?? '')}
									alt="image"
									variant="rounded"
									sx={{
										width: '60px',
										height: '40px',
										// aspectRatio: '16/9',
									}}
								/>
								<Typography variant="caption">
									{item.master_document_type_data?.name}
								</Typography>
							</Stack>
						),
					},
					{
						key: 'attribute2',
						label: 'Alasan Penolakan',
						// noPadding: true,
						render: (item, itemI) =>
							item.is_valid == false ? (
								<Typography variant="caption" fontWeight={700}>
									{item.description}
								</Typography>
							) : (
								<TextField
									value={rejectReasons[itemI]}
									onChange={(ev) =>
										setRejectReasons((rr) =>
											rr.map((rrm, rrmI) =>
												rrmI == itemI ? ev.target.value : rrm
											)
										)
									}
									fullWidth
									size="small"
								/>
							),
					},
					{
						key: 'attribute1',
						label: 'Tolak  Dokumen',
						// noPadding: true,
						align: 'center',
						render: (item, itemI) => (
							<Stack
								direction="row"
								alignItems="center"
								spacing={1.5}
								justifyContent="center"
							>
								{item.is_valid != null ? (
									<LoadingButton
										disabled={item.is_valid}
										loading={rejectBuyerDocLoading && rejectedId == item?.id}
										variant="outlined"
										color="inherit"
										onClick={() => doReject(null, '', item?.id ?? '')}
									>
										<Typography
											variant="caption"
											color="grey.400"
											fontWeight={700}
										>
											Batalkan
										</Typography>
									</LoadingButton>
								) : (
									<LoadingButton
										disabled={!rejectReasons[itemI] || rejectBuyerDocLoading}
										loading={rejectBuyerDocLoading && rejectedId == item?.id}
										size="small"
										variant="contained"
										color="error"
										onClick={() =>
											doReject(false, rejectReasons[itemI], item?.id ?? '')
										}
									>
										<Typography variant="caption" fontWeight={700}>
											Tolak
										</Typography>
									</LoadingButton>
								)}
							</Stack>
						),
					},
				]}
			/>
		</ConfirmDialog>
	)
	const {
		handleSubmit: submitBuyerDoc,
		control: controlBuyerDoc,
		formState: { errors: errorsBuyerDoc },
		setValue: setBuyerDoc,
		getValues: getBuyerDoc,
		register: regBuyerDoc,
		watch: watchBuyerDoc,
	} = useForm<TransactionDetailBuyerFormValues>({
		resolver: yupResolver(transactionDetailBuyerFormSchema),
	})
	const addBuyerDocItem = () => {
		const oldVal = getBuyerDoc('buyerDoc') ?? []
		setBuyerDoc('buyerDoc', [...oldVal, null])
	}
	const delBuyerDocItemByIndex = (index: number) => {
		const bdocValue = getBuyerDoc('buyerDoc')
		bdocValue.splice(index, 1)
		setBuyerDoc('buyerDoc', bdocValue)
	}
	const { edit: buyerDocEdit, loading: buyerDocCudLoading } = useApiCUD(
		ENDPOINTS.DEVELOPER_DETAIL_TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)
	const doSaveBuyerDoc = async (values: TransactionDetailBuyerFormValues) => {
		const body =
			values?.buyerDoc?.map((v) => {
				const dataDocBuyer =
					transactionData?.booking?.developer_detail_transaction?.buyer_transaction_document?.find(
						(v2) => v2.master_document_type_id == v?.id
					) ?? {}
				return {
					...dataDocBuyer,
					master_document_type_id: v?.id,
				}
			}) ?? []
		const spr =
			transactionData?.booking?.developer_detail_transaction?.spr_document
		const res = await buyerDocEdit(
			{ buyer_transaction_document: [...body, spr] },
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
			setBuyerDoc(
				'buyerDoc',
				transactionData?.booking?.developer_detail_transaction?.buyer_transaction_document?.map(
					(v) => v?.master_document_type_data ?? null
				) ?? []
			)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])

	const { edit: confirmDocument, loading: confirmDocumentLoading } = useApiCUD(
		`${ENDPOINTS.BUYER_TRANSACTION_DOCUMENT}`,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const doConfirmTransaction = async () => {
		const checkNoReject =
			!transactionData?.booking?.developer_detail_transaction?.buyer_transaction_document?.find(
				(btd) => btd.is_valid != null
			)
		if (checkNoReject) {
			const res = await confirmDocument(
				{ is_valid: true },
				`${transactionData?.booking?.developer_detail_transaction?.id}/developer_detail_transaction`
			)
			if (helper.isErrorApi(res))
				openToast(true, 'error', res?.message ?? 'Server Error')
			else {
				openToast(true, 'success', 'Data Berhasil Diubah.')
				onSave?.()
				closeConfirmDocDialog()
				logBuyerDocGetAllWParams()
			}
		} else
			openToast(
				true,
				'error',
				'Terdapat beberapa dokumen yg masih ditolak, batalkan penolakan untuk konfirmasi'
			)
	}
	const isBuyerDocConfirmed =
		transactionData?.booking?.developer_detail_transaction?.buyer_transaction_document?.find(
			(btd) => btd.is_valid == true
		)
	const {
		data: logBuyerDoc,
		loading: logBuyerDocLoading,
		getAll: logBuyerDocGetAll,
	} = useFetch<ILogBuyerDoc>(
		ENDPOINTS.LOG_BUYER_TRANSACTION_DOCUMENT,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const logBuyerDocGetAllWParams = async () => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([
			'developer_detail_transaction_id',
			'=',
			transactionData?.booking?.developer_detail_transaction?.id,
		])
		await logBuyerDocGetAll(queryParams)
	}

	useEffect(() => {
		if (transactionData) {
			logBuyerDocGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])

	const {
		close: closeConfirmDocDialog,
		open: openConfirmDocDialog,
		isOpen: isOpenConfirmDocDialog,
	} = useDisclose()
	const confirmDocDialog = (
		<ConfirmDialog
			onClose={closeConfirmDocDialog}
			open={isOpenConfirmDocDialog}
			title="Konfirmasi Dokumen"
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
						loading={confirmDocumentLoading}
						onClick={doConfirmTransaction}
						variant="contained"
					>
						<Typography variant="caption" color="white" fontWeight={700}>
							KONFIRMASI
						</Typography>
					</LoadingButton>
					<Button
						onClick={closeDataBuyerDialog}
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
				<Typography variant="body2" fontWeight={700} mb="10px">
					Apakah anda yakin untuk mengkonfirmasi semua berkas?
				</Typography>
			</Stack>
		</ConfirmDialog>
	)
	return (
		<>
			{dataBuyerRejectDocumentDialog}
			{confirmDocDialog}
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Nama Pembeli
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{transactionData?.booking?.personal_data_booking?.name}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						No. KTP
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{transactionData?.booking?.personal_data_booking?.ktp_number}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Nomor Telepon
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{transactionData?.booking?.personal_data_booking?.phone}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Email
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{transactionData?.buyer?.email}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Alamat
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{transactionData?.booking?.personal_data_booking?.address??'-'}
					</Typography>
				</Grid>
			</Grid>
			<Divider sx={{ my: 3 }} />
			<Typography mb={1} variant={'caption'} fontWeight={700}>
				Pengaturan Dokumen
			</Typography>
			<Grid container spacing={2} mb={4}>
				{watchBuyerDoc('buyerDoc')?.map((bdoc, bdocI) => (
					<Grid item xs={12} md={6} key={bdocI}>
						<Stack direction="row" alignItems="center">
							{!isBuyerDocConfirmed && !disableForm && (
								<IconButton
									sx={{ mt: '16px' }}
									edge="start"
									color="inherit"
									onClick={() => delBuyerDocItemByIndex(bdocI)}
								>
									<CloseIcon sx={{ fontSize: 24, color: 'error.main' }} />
								</IconButton>
							)}
							<Stack flex={1}>
								<Typography variant="caption" fontWeight={700} color="grey.400">
									Nama Dokumen {bdocI + 1}
								</Typography>
								<Controller
									control={controlBuyerDoc}
									name={`buyerDoc[${bdocI}]` as any}
									render={({ field: { value, onChange, name } }) => (
										<AutoCompleteAsyncField
											endpoint={ENDPOINTS.TRANSACTION_BUYER_DOCUMENT_TYPE}
											servicePath={process.env.NEXT_PUBLIC_MISCELLANEOUS_PATH}
											labelKey={'name' as keyof IDocumentTypeGet}
											valueKey={'id'}
											disabled={Boolean(isBuyerDocConfirmed) || disableForm}
											value={watchBuyerDoc(name)}
											onChange={(v) => onChange(v)}
											error={
												errorsBuyerDoc?.buyerDoc?.[bdocI]?.id?.message ||
												errorsBuyerDoc?.buyerDoc?.[bdocI]?.message
											}
											params={{ sort: 'name' }}
											searchKey="name"
										/>
									)}
								/>
							</Stack>
						</Stack>
					</Grid>
				))}
			</Grid>
			{!isBuyerDocConfirmed && !disableForm && (
				<Stack direction="row" spacing={2}>
					<Button
						onClick={addBuyerDocItem}
						sx={{ alignSelf: 'start' }}
						startIcon={<AddOutlinedIcon />}
					>
						<Typography variant="body2" fontWeight={700}>
							Tambah Dokumen
						</Typography>
					</Button>
					<LoadingButton
						loading={buyerDocCudLoading}
						onClick={submitBuyerDoc(doSaveBuyerDoc)}
						sx={{ alignSelf: 'start' }}
						variant="contained"
					>
						<Typography color="white" variant="body2" fontWeight={700}>
							Simpan
						</Typography>
					</LoadingButton>
				</Stack>
			)}
			<Stack alignItems="center">
				<ErrorLabel>{errorsBuyerDoc?.buyerDoc?.message}</ErrorLabel>
			</Stack>
			<Grid container spacing={2}>
				{transactionData?.booking?.developer_detail_transaction?.buyer_transaction_document?.map(
					(v, vI) => (
						<Grid key={vI} item xs={6} sm={4} md={2}>
							<Typography variant="caption" fontWeight={700} color="grey.400">
								{v.master_document_type_data?.name}
							</Typography>
							<Box height={8} />
							<Avatar
								src={helper.fileUrl(v?.master_document_url ?? '')}
								alt={v.master_document_type_data?.name}
								variant="rounded"
								sx={{
									width: '100%',
									height: 'auto',
									aspectRatio: '16/9',
								}}
							>
								{v?.master_document_url
									? ''
									: v.master_document_type_data?.name}
							</Avatar>
						</Grid>
					)
				)}
			</Grid>
			<Typography mt={3} mb={1} variant={'caption'} fontWeight={700}>
				Log Dokumen
			</Typography>
			{logBuyerDoc.map((lbd) => (
				<>
					<Divider sx={{ mb: 2 }} />
					<Stack direction="row" spacing={4}>
						<Typography color="grey.700" variant="body1">
							{formatDateSpace(lbd.created_at)}
						</Typography>
						<Typography variant="body1">
							{lbd.is_valid == false ? 'Revisi : ' : ''}
							{lbd.description}
						</Typography>
					</Stack>
				</>
			))}
			<Divider sx={{ my: 2 }} />
			{!isBuyerDocConfirmed && !disableForm && (
				<Stack direction="row" spacing={2}>
					<Button
						onClick={openDataBuyerDialog}
						size="small"
						color="error"
						variant="outlined"
					>
						<Typography fontWeight={700}>Tolak Berkas</Typography>
					</Button>
					<LoadingButton
						onClick={openConfirmDocDialog}
						size="small"
						variant="contained"
					>
						<Typography color="white" fontWeight={700}>
							Konfirmasi Berkas
						</Typography>
					</LoadingButton>
				</Stack>
			)}
		</>
	)
}

export default BuyerDocumentContentTab
