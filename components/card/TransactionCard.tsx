import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import TaskIcon from '@mui/icons-material/Task'
import Divider from '@mui/material/Divider'
import UtjIcon from '../icons/UtjIcon'
import CreditCardIcon from '../icons/CreditCardIcon'
import CustomChip from '../chip/CustomChip'
import { ITransactionGet } from '../../interfaces/interfaceApiTransaction'
import { formatNumber } from '../../utils/number'
import helper from '../../utils/helper'
import useDisclose from '../../hooks/useDisclose'
import ConfirmDialog from '../dialog/ConfirmDialog'
import { useForm } from 'react-hook-form'
import transactionRejectFormSchema, {
	TransactionRejectFormValues,
} from '../../schema/transactionRejectFormSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import useApiCUD from '../../hooks/useApiCUD'
import ENDPOINTS from '../../utils/constants/endpoints'
import { LoadingButton } from '@mui/lab'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useRouter } from 'next/router'
import useCountDown from 'react-countdown-hook'
import { milisDateRange, msToMS } from '../../utils/date'
import usePermission from '../../hooks/usePermission'
interface PropsTransactionCard {
	loading?: boolean
	data?: ITransactionGet
	onClick?: (item?: ITransactionGet) => void
	onChangeStatus?: (item?: ITransactionGet) => void
}
function TransactionCard({
	data,
	loading,
	onClick,
	onChangeStatus,
}: PropsTransactionCard) {
	const { permission } = usePermission()
	const router = useRouter()
	const [timeLeft, { start, reset }] = useCountDown(0, 1000)
	const restart = React.useCallback(() => {
		if (data?.last_log_booking?.deadline_sla) {
			const newTime = milisDateRange(
				new Date(),
				data?.last_log_booking?.deadline_sla
			)
			start(newTime)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])
	useEffect(() => {
		restart()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const isTimerEnd = data?.last_log_booking?.deadline_sla && timeLeft <= 0
	const isReject =
		data?.booking?.status_dev == false ||
		data?.booking?.status_buyer == false ||
		isTimerEnd

	const isConfirmation =
		data?.booking?.status_dev == null && data?.booking?.status_buyer != false
	const canOpenDetail =
		data?.booking?.status_dev == true &&
		data?.booking?.status_buyer != false &&
		!isTimerEnd
	const {
		isOpen: isOpenReject,
		open: openReject,
		close: closeReject,
	} = useDisclose()
	const {
		isOpen: isOpenConfirm,
		open: openConfirm,
		close: closeConfirm,
	} = useDisclose()
	const {
		handleSubmit: handleSubmit,
		formState: { errors: errors },
		register: register,
	} = useForm<TransactionRejectFormValues>({
		resolver: yupResolver(transactionRejectFormSchema),
	})
	const { edit: transactionEdit, loading: transactionCudLoading } = useApiCUD(
		ENDPOINTS.BOOKING,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)
	const doReject = async (values: TransactionRejectFormValues) => {
		await transactionEdit(
			{ desc_cancel_dev: values.reason, status_dev: false },
			data?.booking_id ?? ''
		)
		onChangeStatus?.()
	}
	const doConfirm = async () => {
		await transactionEdit({ status_dev: true }, data?.booking_id ?? '')
		onChangeStatus?.()
	}

	return loading ? (
		<Skeleton height="90px" width="100%" variant="rounded" />
	) : (
		<Card
			sx={{
				border: '1px solid',
				borderColor: '#E2E8F0',
				borderRadius: '8px',
				boxShadow: 'none',
			}}
		>
			<Box
				// onClick={() => (onClick ? onClick(data) : undefined)}
				sx={{ p: '12px' }}
			>
				<Stack direction="row" spacing={1} height="100%" alignItems="center">
					<Avatar
						src={helper.fileUrl(
							data?.unit_block_data?.data_type_unit?.image_thumbnail_url ?? ''
						)}
						alt="profile-image"
						variant="rounded"
						sx={{
							height: '100%',
							width: '56px',
							aspectRatio: '1/1',
						}}
					/>
					<Stack justifyContent={'space-evenly'} sx={{ mr: 'auto !important' }}>
						<Typography
							color={'black'}
							fontWeight={700}
							mr="6px"
							variant="body1"
						>
							{data?.unit_block_data?.block_name}{' '}
							{data?.unit_block_data?.block_number}
						</Typography>

						<Typography noWrap color={'grey.400'} variant="caption">
							{data?.unit_block_data?.data_type_unit?.type_unit_name}
						</Typography>
					</Stack>
					<Stack alignItems="end" justifyContent={'space-between'}>
						<Typography color={'grey.700'} mr="6px" variant="caption">
							Status Transaksi:
						</Typography>
						<Stack spacing={1} direction="row" alignItems="center">
							<TaskIcon
								color={isReject ? 'error' : 'primary'}
								sx={{ width: '20px', height: '20px' }}
							/>
							<Typography
								noWrap
								fontWeight={700}
								variant="body2"
								color={isReject ? 'error' : undefined}
							>
								{(data?.last_log_booking?.activities_status?.status_name ??
									'') + (data?.last_log_booking?.desc ?? '')}
								<Typography
									component="span"
									fontWeight={700}
									variant="body2"
									color="error.main"
								>
									{data?.last_log_booking?.deadline_sla
										? ` (${msToMS(timeLeft, true)})`
										: ''}
								</Typography>
							</Typography>
						</Stack>
					</Stack>
				</Stack>
				<Divider sx={{ my: 1.5 }} />
				<Stack direction="row">
					<Stack mr={1} justifyContent="space-evenly">
						<Typography noWrap color="grey.400" variant="caption">
							Pembeli
						</Typography>
						<Typography noWrap color="grey.400" variant="caption">
							Agen
						</Typography>
					</Stack>
					<Stack mr={3} justifyContent="space-evenly">
						<Typography
							fontWeight={600}
							color="grey.400"
							variant="caption"
							component="span"
						>
							{data?.buyer?.name}
						</Typography>
						<Typography
							fontWeight={600}
							color="grey.400"
							variant="caption"
							component="span"
						>
							{data?.agency?.agency_name} - {data?.agent?.first_name}{' '}
							{data?.agent?.last_name}
						</Typography>
					</Stack>
					<Stack justifyContent="space-evenly" mr="auto">
						<Stack spacing={0.5} direction="row" alignItems="center">
							<CreditCardIcon
								sx={{
									fill: (thm) => thm.palette.grey[400],
									stroke: 'white',
									width: '16px',
								}}
							/>
							<Typography
								fontWeight={600}
								color="grey.400"
								variant="caption"
								component="span"
							>
								{data?.unit_block_price?.type_payment}{' '}
								{data?.unit_block_price?.type_payment !== 'CASH'
									? `${data?.unit_block_price?.dp_installment_termin ?? 0} bulan`
									: ''}
							</Typography>
						</Stack>
						<Stack spacing={0.5} direction="row" alignItems="center">
							<UtjIcon
								sx={{
									fill: (thm) => thm.palette.grey[400],
									stroke: 'white',
									width: '14px',
								}}
							/>
							<Typography
								fontWeight={600}
								color="grey.400"
								variant="caption"
								component="span"
							>
								Rp {formatNumber(data?.grand_total ?? '0')}
							</Typography>
							<CustomChip
								radius={'4px'}
								label={'Lunas'}
								color="white"
								bgColor="primary.main"
							/>
						</Stack>
					</Stack>
					<Stack spacing={1} direction="row" alignItems="center">
						{isConfirmation && (
							<>
								<Button
									size="small"
									onClick={openReject}
									variant="outlined"
									color="error"
								>
									<Typography variant="body2" fontWeight={700} color="error">
										Tolak
									</Typography>
								</Button>
								<Button onClick={openConfirm} size="small" variant="contained">
									<Typography variant="body2" fontWeight={700} color="white">
										Konfirmasi
									</Typography>
								</Button>
							</>
						)}
						{canOpenDetail && (
							<Button
								onClick={() => router.push(router.asPath + '/' + data?.id)}
								size="small"
								variant="contained"
							>
								<Typography variant="body2" fontWeight={700} color="white">
									Lihat Detail
								</Typography>
							</Button>
						)}
						{/* {isReject &&
							!data.booking.booking_is_paid &&
							permission.canRefundUtj && (
								<Button size="small" variant="contained" color="error">
									<Typography variant="body2" fontWeight={700} color="white">
										Refund UTJ
									</Typography>
								</Button>
							)} */}
					</Stack>
				</Stack>
			</Box>
			<ConfirmDialog
				open={isOpenConfirm}
				onClose={closeConfirm}
				maxWidth="md"
				title={'Konfirmasi Ketersediaan Unit'}
				renderAction={
					<Stack direction="row" spacing={2} width="100%">
						<LoadingButton
							fullWidth
							onClick={doConfirm}
							variant="contained"
							loading={transactionCudLoading}
						>
							<Typography variant="body2" fontWeight={700} color="white">
								Konfirmasi
							</Typography>
						</LoadingButton>
					</Stack>
				}
			>
				<Stack>
					<Typography variant="body1" mb="10px">
						Ada pesanan masuk yang harus dikonfirmasi dengan rincian :
					</Typography>
					<Divider sx={{ my: 2 }} />
					<Typography variant="body1" fontWeight={700} mb="10px">
						Detail Pesanan
					</Typography>
					<Container maxWidth="sm">
						<Stack direction="row" spacing={4}>
							<Avatar
								src={helper.fileUrl(
									data?.unit_block_data?.data_type_unit?.image_thumbnail_url ??
										''
								)}
								alt="profile-image"
								variant="rounded"
								sx={{
									height: '100%',
									width: '73px',
									aspectRatio: '1/1',
								}}
							/>
							<Stack alignItems="center" justifyContent="space-evenly">
								<Typography variant="body2" fontWeight={700}>
									No. Invoice : {data?.transaction_code}
								</Typography>
								<Typography variant="body2">
									{data?.developer?.developer_name} -{' '}
									{data?.unit_block_data?.developer_project_data?.project_name}{' '}
									- {data?.unit_block_data?.data_type_unit?.type_unit_name} -
									Blok {data?.unit_block_data?.block_name} Nomor{' '}
									{data?.unit_block_data?.block_number}
								</Typography>
								<Typography variant="body2">
									LT:{' '}
									{data?.unit_block_data?.data_type_unit?.unit_spec_data
										?.land_area ?? 0}{' '}
									- LB:{' '}
									{data?.unit_block_data?.data_type_unit?.unit_spec_data
										?.building_area ?? 0}{' '}
									- KT:{' '}
									{data?.unit_block_data?.data_type_unit?.unit_spec_data
										?.number_of_bedroom ?? 0}{' '}
									- KM:{' '}
									{data?.unit_block_data?.data_type_unit?.unit_spec_data
										?.number_of_bathroom ?? 0}{' '}
									- Tingkat:{' '}
									{data?.unit_block_data?.data_type_unit?.unit_spec_data
										?.floor_level ?? 0}
								</Typography>
							</Stack>
						</Stack>
					</Container>
					<Divider sx={{ my: 2 }} />
					<Typography variant="body1" fontWeight={700} mb="10px">
						Detail Pesanan
					</Typography>
					<Container maxWidth="md">
						<Grid container spacing={1}>
							<Grid item xs={12} md={6}>
								<Typography variant="body1">Pembeli</Typography>
								<Typography fontWeight={700} variant="body1">
									{data?.buyer?.name}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1">Agen</Typography>
								<Typography fontWeight={700} variant="body1">
									{data?.agency?.agency_name} - {data?.agent?.first_name}{' '}
									{data?.agent?.last_name}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1">Metode pemesanan</Typography>
								<Typography fontWeight={700} variant="body1">
									{data?.unit_block_price?.type_payment}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1">Termin</Typography>
								<Typography fontWeight={700} variant="body1">
									{data?.unit_block_price?.type_payment != 'KPR'
										? data?.unit_block_price?.dp_installment_termin ?? 0
										: 0}{' '}
									kali
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1">Jumlah DP</Typography>
								<Typography fontWeight={700} variant="body1">
									IDR. {formatNumber(data?.unit_block_price?.dp_total ?? '0')}
								</Typography>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1">Lama Cicilan DP</Typography>
								<Typography fontWeight={700} variant="body1">
									{data?.unit_block_price?.type_payment == 'KPR'
										? data?.unit_block_price?.dp_installment_termin ?? 0
										: 0}{' '}
									bulan
								</Typography>
							</Grid>
						</Grid>
					</Container>
					<Divider sx={{ my: 2 }} />
					<Typography variant="body1" textAlign="justify">
						Dengan menekan tombol konfirmasi dibawah, maka Anda tidak dapat{' '}
						<Typography component="span" fontWeight={700}>
							membatalkan
						</Typography>{' '}
						pesanan pembeli dengan alasan apapun. Jadi, pastikan unit yang
						dipesan sesuai data di atas{' '}
						<Typography component="span" fontWeight={700}>
							benar-benar tersedia
						</Typography>{' '}
						tersedia dan{' '}
						<Typography component="span" fontWeight={700}>
							belum terjual
						</Typography>
						.
					</Typography>
				</Stack>
			</ConfirmDialog>
			<ConfirmDialog
				open={isOpenReject}
				onClose={closeReject}
				title={'Tulis alasan penolakan'}
				renderAction={
					<Stack direction="row" spacing={2}>
						<LoadingButton
							onClick={handleSubmit(doReject)}
							variant="contained"
							loading={transactionCudLoading}
						>
							<Typography variant="body2" fontWeight={700} color="white">
								Submit
							</Typography>
						</LoadingButton>
						<Button onClick={closeReject} variant="contained" color="inherit">
							<Typography variant="body2" fontWeight={700}>
								Kembali
							</Typography>
						</Button>
					</Stack>
				}
			>
				<Stack>
					<Typography variant="caption" fontWeight={700} mb="10px">
						Alasan Penolakan
					</Typography>
					<TextField
						sx={{ mb: '16px' }}
						size="small"
						fullWidth
						rows={4}
						multiline
						variant="outlined"
						placeholder="Tulis Deskripsi"
						{...register('reason')}
						helperText={errors.reason?.message ?? undefined}
						error={!!errors.reason?.message}
					/>
				</Stack>
			</ConfirmDialog>
		</Card>
	)
}

export default TransactionCard
