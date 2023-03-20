import { yupResolver } from '@hookform/resolvers/yup'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import { LoadingButton } from '@mui/lab'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import useApiCUD from '../../../../hooks/useApiCUD'
import useDisclose from '../../../../hooks/useDisclose'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import { ToastProviderContext } from '../../../../providers/ToastProvider'
import transactionDetailSprFormSchema, {
	TransactionDetailSprFormValues,
} from '../../../../schema/transactionDetailSprFormSchema'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import { formatDateSpace } from '../../../../utils/date'
import helper from '../../../../utils/helper'
import { formatNumber } from '../../../../utils/number'
import ConfirmDialog from '../../../dialog/ConfirmDialog'
import UploadFileField from '../../../field/UploadFileField'
interface PropsScheduleContentTab {
	transactionData?: ITransactionGet
	onSave?: () => void
	disableForm?: boolean
	isSpr?: boolean
}
function TransactionDetailTab({
	onSave,
	transactionData,
	disableForm,
	isSpr,
}: PropsScheduleContentTab) {
	const { openToast } = useContext(ToastProviderContext)

	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		getValues,
		register,
		watch,
	} = useForm<TransactionDetailSprFormValues>({
		resolver: yupResolver(transactionDetailSprFormSchema),
	})

	const { edit: sprDocEdit, loading: sprDocCudLoading } = useApiCUD(
		ENDPOINTS.DEVELOPER_DETAIL_TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const doSaveSprDoc = async (values: TransactionDetailSprFormValues) => {
		const body = [
			...(transactionData?.booking?.developer_detail_transaction
				?.buyer_transaction_document ?? []),
			{
				...(transactionData?.booking?.developer_detail_transaction
					?.spr_document ?? {}),
				master_document_id: values.document.id,
				master_document_url: helper.filePath(values.document.url ?? ''),
			},
		]
		const res = await sprDocEdit(
			{ buyer_transaction_document: body },
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
		if (
			transactionData &&
			transactionData?.booking?.developer_detail_transaction?.spr_document
				?.master_document_id
		) {
			setValue('document', {
				id:
					transactionData?.booking?.developer_detail_transaction?.spr_document
						?.master_document_id ?? '',
				url: helper.fileUrl(
					transactionData?.booking?.developer_detail_transaction?.spr_document
						?.master_document_url ?? ''
				),
			})
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
			title="Apakah anda sudah yakin SPR yang diupload sudah sesuai?"
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
						onClick={handleSubmit(doSaveSprDoc)}
						loading={sprDocCudLoading}
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
					SPR tersebut{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						tidak dapat diubah
					</Typography>{' '}
					dan akan tampil di Apps pembeli untuk di konfirmasi, dan ada
					kemungkinan pembeli akan{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						menolak
					</Typography>{' '}
					pesanan. Jadi pastikan SPR yang anda upload{' '}
					<Typography variant="body2" fontWeight={700} component="span">
						sudah sesuai{' '}
					</Typography>{' '}
					dengan unit yang anda iklankan
				</Typography>
			</Stack>
		</ConfirmDialog>
	)

	return (
		<>
			{confirmDialog}
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Tanggal Pembayaran UTJ
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						{formatDateSpace(transactionData?.booking?.booking_date)}
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Nilai UTJ
					</Typography>
					<Typography variant="body1" fontWeight={700}>
						Rp {formatNumber(transactionData?.grand_total ?? '0')}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="caption" fontWeight={700} color="grey.400">
						Upload SPR
					</Typography>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack spacing={2}>
						<Controller
							control={control}
							name="document"
							render={({ field: { onBlur, onChange, value } }) => (
								<UploadFileField
									disabled={isSpr || disableForm}
									icon={
										<PictureAsPdfIcon
											sx={{ fontSize: 48, color: 'grey.400' }}
										/>
									}
									title="Dokumen SPR"
									types={['PDF']}
									label="SPR (.pdf)"
									value={value?.url}
									onChange={onChange}
									error={
										errors.document?.id?.message || errors.document?.message
									}
								/>
							)}
						/>
					</Stack>
				</Grid>
			</Grid>
			<Box height={'24px'} />
			{!isSpr && !disableForm && (
				<Button
					onClick={openConfirmDialog}
					sx={{ alignSelf: 'start' }}
					variant="contained"
				>
					<Typography color="white" variant="body2" fontWeight={700}>
						Upload SPR
					</Typography>
				</Button>
			)}
		</>
	)
}

export default TransactionDetailTab
