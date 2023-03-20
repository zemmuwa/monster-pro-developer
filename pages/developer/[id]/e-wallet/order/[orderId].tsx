import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import DefaultBreadcrumb from '../../../../../components/breadcrumb/DefaultBreadcrumb'
import useMenuAppbar from '../../../../../hooks/useMenuAppbar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import helper from '../../../../../utils/helper'
import { IDeveloperGet } from '../../../../../interfaces/interfaceApiDeveloper'
import useFetch from '../../../../../hooks/useFetch'
import ENDPOINTS from '../../../../../utils/constants/endpoints'
import { IBookingGet } from '../../../../../interfaces/interfaceApiBooking'
import CustomSkeleton from '../../../../../components/skeleton/CustomSkeleton'
import ActiveTransactionOrderTab, {
	RefActiveTransactionOrderTab,
} from '../../../../../components/component-pages/e-wallet/order/ActiveTransactionOrderTab'
import { formatNumber } from '../../../../../utils/number'
import ProcessTransactionTab from '../../../../../components/component-pages/e-wallet/ProcessTransactionTab'
import FinishedTransactionTab from '../../../../../components/component-pages/e-wallet/FinishedTransactionTab'
import usePermission from '../../../../../hooks/usePermission'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import ActiveTransactionOrderAdminTab, {
	RefActiveTransactionOrderAdminTab,
} from '../../../../../components/component-pages/e-wallet/order/ActiveTransactionOrderAdminTab'
import ProcessTransactionOrderAdminTab, {
	RefProcessTransactionOrderAdminTab,
} from '../../../../../components/component-pages/e-wallet/order/ProcessTransactionOrderAdminTab'

const Ewallet: NextPage = () => {
	const router = useRouter()
	const { isAdmin } = usePermission()
	const { setCompanyApp } = useMenuAppbar()
	const activeTransactionTabRef = useRef<RefActiveTransactionOrderTab>(null)
	const activeTransactionAdminTabRef =
		useRef<RefActiveTransactionOrderAdminTab>(null)
	const processTransactionAdminTabRef =
		useRef<RefProcessTransactionOrderAdminTab>(null)
	const [tab, setTab] = useState(0)

	const { dataSingle: developerData, getOne: developerGetOne } =
		useFetch<IDeveloperGet>(
			ENDPOINTS.DEVELOPER,
			process.env.NEXT_PUBLIC_DEVELOPER_PATH
		)
	const {
		dataSingle: bookingData,
		loading: bookingLoading,
		getOne: bookingGetOne,
	} = useFetch<IBookingGet>(
		ENDPOINTS.BOOKING,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

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
		if (router.query?.id) {
			developerGetOne(`/${router.query.id}`)
			bookingGetOne(`/${router.query.orderId}`)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])

	const dataBreadcrumb = [
		{ label: 'Dashboard', path: `/developer/${router.query.id}` },
		{ label: 'E-Wallet', path: `/developer/${router.query.id}/e-wallet` },
		{ label: 'ORDER', path: '' },
	]

	const renderGridItemOrderInfo = (params: {
		leftLabel: string
		leftVal?: string
		rightLabel: string
		rightVal?: string
	}) => {
		return (
			<>
				<Grid item xs={12} md={6}>
					<Stack>
						<Typography fontWeight={700} fontSize={10} color="grey.400">
							{params.leftLabel}
						</Typography>
						<Typography variant="caption">{params?.leftVal ?? '-'}</Typography>
					</Stack>
				</Grid>
				<Grid item xs={12} md={6}>
					<Stack>
						<Typography fontWeight={700} fontSize={10} color="grey.400">
							{params.rightLabel}
						</Typography>
						<Typography variant="caption">{params?.rightVal ?? '-'}</Typography>
					</Stack>
				</Grid>
			</>
		)
	}
	const [amount, setAmount] = useState<string | number>('0')
	const [count, setCount] = useState<string | number>('0')

	const showSummary =
		(isAdmin && tab == 0) || (isAdmin && tab == 1) || (!isAdmin && tab == 0)

	const renderInformationCard = (
		<Stack height="100%" spacing={2}>
			{showSummary && (
				<Stack
					borderRadius="12px"
					boxShadow={1}
					display="flex"
					flexShrink={1}
					bgcolor="background.paper"
					p={3}
					// overflow="auto"
				>
					<Typography variant="body1" color="black" mb={0.5} fontWeight={700}>
						Ringkasan Pencairan
					</Typography>
					{isAdmin && (
						<Stack
							direction="row"
							spacing={2}
							bgcolor="primary.200"
							p={1}
							borderRadius="4px"
							mb={2}
						>
							<ReportProblemOutlinedIcon
								color="primary"
								sx={{ width: '16px', height: '16px' }}
							/>
							{tab == 0 ? (
								<Typography fontSize={10}>
									Sebelum menyetujui pencairan, pastikan Anda telah melakukan{' '}
									<Typography fontSize={10} component="span" fontWeight={700}>
										verifikasi
									</Typography>{' '}
									pada dokumen pengajuan{' '}
								</Typography>
							) : (
								<Typography fontSize={10}>
									Pastikan Anda mengirim bukti transfer pada{' '}
									<Typography fontSize={10} component="span" fontWeight={700}>
										masing-masing transaksi
									</Typography>{' '}
									dengan jumlah yang{' '}
									<Typography fontSize={10} component="span" fontWeight={700}>
										sesuai
									</Typography>{' '}
								</Typography>
							)}
						</Stack>
					)}
					<Stack
						direction="row"
						spacing={2}
						justifyContent="space-between"
						mb={1.5}
					>
						<Typography variant="caption" color="grey.400">
							Total dicairkan ({count} {isAdmin ? 'transaksi' : 'pembayaran'})
						</Typography>
						<Typography variant="caption" color="grey.400">
							Rp {formatNumber(amount)}
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2} justifyContent="space-between">
						<Typography variant="caption" color="grey.400">
							Biaya pencairan
						</Typography>
						<Typography variant="caption" color="grey.400">
							- Rp 0
						</Typography>
					</Stack>
					<Divider sx={{ my: 1.5 }} />
					<Stack
						direction="row"
						spacing={2}
						justifyContent="space-between"
						mb={2}
					>
						<Typography variant="body1" color="black" fontWeight={700}>
							Total
						</Typography>
						<Typography variant="body1" color="black" fontWeight={700}>
							Rp {formatNumber(amount)}
						</Typography>
					</Stack>
					{isAdmin ? (
						tab == 0 ? (
							<Stack direction="row" spacing={2}>
								<Button
									fullWidth
									size="small"
									disabled={count == 0}
									onClick={() => activeTransactionAdminTabRef.current?.accept()}
									variant="contained"
									sx={{ fontWeight: 700, color: 'white' }}
								>
									Setujui Pencairan
								</Button>
								<Button
									fullWidth
									color="error"
									size="small"
									disabled={count == 0}
									onClick={() => activeTransactionAdminTabRef.current?.reject()}
									variant="outlined"
									sx={{ fontWeight: 700, color: 'error.main' }}
								>
									Tolak Pencairan
								</Button>
							</Stack>
						) : (
							<Button
								disabled={count == 0}
								onClick={() => processTransactionAdminTabRef.current?.submit()}
								variant="contained"
								sx={{ fontWeight: 700, color: 'white' }}
							>
								Saya sudah tranfer
							</Button>
						)
					) : (
						<Button
							disabled={count == 0}
							onClick={() => activeTransactionTabRef.current?.submit()}
							variant="contained"
							sx={{ fontWeight: 700, color: 'white' }}
						>
							Ajukan Pencairan
						</Button>
					)}
				</Stack>
			)}
			<CustomSkeleton
				loading={bookingLoading}
				width="100%"
				flexGrow={1}
				display="flex"
				overflow="auto"
			>
				<Stack
					borderRadius="12px"
					boxShadow={1}
					flexGrow={1}
					bgcolor="background.paper"
					p={2}
					overflow="auto"
				>
					<Stack direction="row" spacing="12px">
						<Avatar
							alt="image-unit"
							variant="rounded"
							src={helper.fileUrl(
								bookingData?.unit_block_data?.data_type_unit
									?.image_thumbnail_url ?? ''
							)}
							sx={{ width: 48, height: 48 }}
						/>
						<Stack flexGrow={1}>
							<Typography variant="body1" fontWeight={700} noWrap>
								{bookingData?.booking_code ?? '-'}
							</Typography>
							<Typography variant="caption" mb={1}>
								{bookingData?.developer?.developer_name} -{' '}
								{
									bookingData?.unit_block_data?.developer_project_data
										.project_name
								}{' '}
								- Tipe{' '}
								{bookingData?.unit_block_data?.data_type_unit.type_unit_name} -
								Blok {bookingData?.unit_block_data?.block_name} Nomor{' '}
								{bookingData?.unit_block_data?.block_number}
							</Typography>
						</Stack>
					</Stack>
					<Divider sx={{ my: 3 }} />
					<Grid container rowSpacing={3}>
						{renderGridItemOrderInfo({
							leftLabel: 'Nama Pembeli',
							leftVal: bookingData?.personal_data_booking?.name,
							rightLabel: 'No. KTP',
							rightVal: bookingData?.personal_data_booking?.ktp_number,
						})}
						{renderGridItemOrderInfo({
							leftLabel: 'Nomor Telepon',
							leftVal: bookingData?.personal_data_booking?.phone,
							rightLabel: 'Email',
							rightVal: bookingData?.buyer?.email,
						})}
						{renderGridItemOrderInfo({
							leftLabel: 'Alamat',
							leftVal: bookingData?.personal_data_booking?.address,
							rightLabel: '',
							rightVal: '',
						})}
					</Grid>
				</Stack>
			</CustomSkeleton>
		</Stack>
	)

	useEffect(() => {
		setCount('0')
		setAmount('0')
	}, [tab])

	const renderDisbursementCard = (
		<Box
			borderRadius="12px"
			boxShadow={1}
			height="100%"
			bgcolor="background.paper"
			p={3}
		>
			<Stack height="100%">
				<Typography variant="h5">Penarikan Saldo</Typography>
				<Tabs sx={{ mb: 2 }} value={tab} onChange={(ev, val) => setTab(val)}>
					<Tab
						sx={{ '&.MuiTab-root': { fontSize: 14 } }}
						label="Transaksi Aktif"
					/>
					<Tab
						sx={{ '&.MuiTab-root': { fontSize: 14 } }}
						label="Pencairan di Proses"
					/>
					<Tab
						sx={{ '&.MuiTab-root': { fontSize: 14 } }}
						label="Pencairan Selesai"
					/>
				</Tabs>
				{tab == 0 && (
					<CustomSkeleton loading={!Boolean(bookingData)} width="100%">
						{isAdmin ? (
							<ActiveTransactionOrderAdminTab
								ref={activeTransactionAdminTabRef}
								onCheckChange={(amount, count) => {
									setAmount(amount)
									setCount(count)
								}}
								bookingId={bookingData?.id}
							/>
						) : (
							<ActiveTransactionOrderTab
								ref={activeTransactionTabRef}
								onCheckChange={(amount, count) => {
									setAmount(amount)
									setCount(count)
								}}
								bookingId={bookingData?.id}
							/>
						)}
					</CustomSkeleton>
				)}
				{tab == 1 && (
					<CustomSkeleton loading={!Boolean(bookingData)} width="100%">
						{isAdmin ? (
							<ProcessTransactionOrderAdminTab
								ref={processTransactionAdminTabRef}
								onCheckChange={(amount, count) => {
									setAmount(amount)
									setCount(count)
								}}
								bookingId={bookingData?.id}
							/>
						) : (
							<ProcessTransactionTab bookingId={bookingData?.id} showFile />
						)}
					</CustomSkeleton>
				)}
				{tab == 2 && (
					<CustomSkeleton loading={!Boolean(bookingData)} width="100%">
						<FinishedTransactionTab
							bookingId={bookingData?.id}
							showFile
							withReceipt
						/>
					</CustomSkeleton>
				)}
			</Stack>
		</Box>
	)

	return (
		<Stack height="100%">
			<DefaultBreadcrumb data={dataBreadcrumb} />
			<Container sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
				<Grid spacing={2} container pb={2} height="100%">
					<Grid item xs={12} md={4} height="100%">
						{renderInformationCard}
					</Grid>
					<Grid item xs={12} md={8} height="100%">
						{renderDisbursementCard}
					</Grid>
				</Grid>
			</Container>
		</Stack>
	)
}

export default Ewallet
