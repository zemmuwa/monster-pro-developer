import TaskIcon from '@mui/icons-material/Task'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import useCountDown from 'react-countdown-hook'
import DefaultBreadcrumb from '../../../../../components/breadcrumb/DefaultBreadcrumb'
import CustomSkeleton from '../../../../../components/skeleton/CustomSkeleton'
import useFetch from '../../../../../hooks/useFetch'
import useMenuAppbar from '../../../../../hooks/useMenuAppbar'
import { IDeveloperGet } from '../../../../../interfaces/interfaceApiDeveloper'
import { ITransactionGet } from '../../../../../interfaces/interfaceApiTransaction'
import { ToastProviderContext } from '../../../../../providers/ToastProvider'
import ENDPOINTS from '../../../../../utils/constants/endpoints'
import helper from '../../../../../utils/helper'
import { milisDateRange, msToMS } from '../../../../../utils/date'
import PaymentContentTab from '../../../../../components/component-pages/transaction/transaction-id/PaymentContentTab'
import TransactionStatusContentTab from '../../../../../components/component-pages/transaction/transaction-id/TransactionStatusContentTab'
import ReimbursementStatusContentTab from '../../../../../components/component-pages/transaction/transaction-id/ReimbursementStatusContentTab'
import usePermission from '../../../../../hooks/usePermission'
import ScheduleContentTab from '../../../../../components/component-pages/transaction/transaction-id/ScheduleContentTab'
import TransactionDetailTab from '../../../../../components/component-pages/transaction/transaction-id/TransactionDetailTab'
import BuyerDocumentContentTab from '../../../../../components/component-pages/transaction/transaction-id/BuyerDocumentContentTab'

function TransactionId() {
	const { permission } = usePermission()
	const router = useRouter()
	const { setCompanyApp } = useMenuAppbar()
	const {
		dataSingle: developerData,
		loading: developerLoading,
		getOne: developerGetOne,
	} = useFetch<IDeveloperGet>(
		ENDPOINTS.DEVELOPER,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
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
	const {
		dataSingle: transactionData,
		loading: transactionLoading,
		getOne: transactionGetOne,
		setDataSingle: transactionSetData,
	} = useFetch<ITransactionGet>(
		ENDPOINTS.TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const isSpr =
		transactionData?.booking?.developer_detail_transaction?.spr_document
			?.master_document_url

	const [timeLeft, { start, reset }] = useCountDown(0, 1000)
	const isTimerEnd =
		Boolean(transactionData?.last_log_booking?.deadline_sla) && timeLeft <= 0
	const isReject =
		transactionData?.booking?.status_dev == false ||
		transactionData?.booking?.status_buyer == false ||
		isTimerEnd
	const disableForm = isReject
	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
			transactionGetOne(('/' + router.query.transactionId) as string)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])
	const restart = React.useCallback(() => {
		if (transactionData?.last_log_booking?.deadline_sla) {
			const newTime = milisDateRange(
				new Date(),
				transactionData?.last_log_booking?.deadline_sla
			)
			start(newTime)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])
	const dataBreadcrumb = [
		{ label: 'Transaksi', path: `/developer/${router.query.id}/transaction` },
		{ label: transactionData?.transaction_code ?? '-', path: '' },
	]

	const mainCard = (
		<Card sx={{ overflow: 'initial' }}>
			<Box p={2}>
				<Stack>
					<Stack spacing={1.5} direction="row">
						<Avatar
							src={helper.fileUrl(
								transactionData?.unit_block_data?.data_type_unit
									?.image_thumbnail_url ?? ''
							)}
							alt="profile-image"
							variant="rounded"
							sx={{
								height: '100%',
								width: '56px',
								aspectRatio: '1/1',
							}}
						/>
						<Stack
							justifyContent={'space-evenly'}
							sx={{ mr: 'auto !important' }}
						>
							<Typography
								color={'black'}
								fontWeight={700}
								mr="6px"
								variant="body1"
							>
								{transactionData?.transaction_code}
							</Typography>

							<Typography noWrap color={'grey.400'} variant="caption">
								{transactionData?.developer?.developer_name} -{' '}
								{
									transactionData?.unit_block_data?.developer_project_data
										?.project_name
								}{' '}
								-{' '}
								{
									transactionData?.unit_block_data?.data_type_unit
										?.type_unit_name
								}{' '}
								- Blok {transactionData?.unit_block_data?.block_name} Nomor{' '}
								{transactionData?.unit_block_data?.block_number}
							</Typography>
						</Stack>
						<Stack alignItems="end" justifyContent={'space-between'}>
							<Typography color={'grey.700'} mr="6px" variant="caption">
								Status Transaksi:
							</Typography>
							<Stack spacing={1} direction="row" alignItems="center">
								<TaskIcon
									color="primary"
									sx={{ width: '20px', height: '20px' }}
								/>
								<Typography noWrap fontWeight={700} variant="body2">
									{
										transactionData?.last_log_booking?.activities_status
											?.status_name
									}{
										transactionData?.last_log_booking?.desc??''
									}
									<Typography
										component="span"
										fontWeight={700}
										variant="body2"
										color="error.main"
									>
										{transactionData?.last_log_booking?.deadline_sla
											? ` (${msToMS(timeLeft, true)})`
											: ''}
									</Typography>
								</Typography>
							</Stack>
						</Stack>
					</Stack>
					<Divider sx={{ my: 2 }} />
					<Typography
						mb={1}
						variant="caption"
						fontWeight={700}
						color="grey.400"
					>
						Informasi Agen
					</Typography>
					<Stack direction="row" spacing={3}>
						<Avatar
							src={helper.fileUrl(transactionData?.agency?.logo_url ?? '')}
							alt="profile-image"
							variant="rounded"
							sx={{
								width: '96px',
								height: '58px',
								aspectRatio: '1/1',
							}}
						/>
						<Stack justifyContent={'space-evenly'}>
							<Typography fontWeight={700} variant="caption">
								Kantor Agen
							</Typography>
							{transactionData?.agency?.agency_name}
							<Typography noWrap variant="body1"></Typography>
						</Stack>
						<Stack justifyContent={'space-evenly'} mr="auto !important">
							<Typography fontWeight={700} variant="caption">
								Agen
							</Typography>
							<Stack direction="row" spacing={1}>
								<Avatar
									src={helper.fileUrl(
										transactionData?.agent?.agent_photo_url ?? ''
									)}
									alt="profile-image"
									variant="circular"
									sx={{
										width: '22px',
										height: '22px',
										aspectRatio: '1/1',
									}}
								/>
								<Typography noWrap variant="body1">
									{transactionData?.agent?.first_name}{' '}
									{transactionData?.agent?.last_name}
								</Typography>
							</Stack>
						</Stack>
						{/* {isReject &&
							!transactionData?.booking?.booking_is_paid &&
							permission.canRefundUtj && (
								<Button
									sx={{ alignSelf: 'end' }}
									variant="contained"
									color="error"
								>
									<Typography variant="body2" fontWeight={700}>
										REFUND UTJ
									</Typography>
								</Button>
							)} */}
					</Stack>
				</Stack>
			</Box>
		</Card>
	)
	const [tab, setTab] = useState(0)
	useEffect(() => {
		if (transactionData) {
			if (transactionData?.last_log_booking?.deadline_sla) {
				restart()
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])

	return (
		<>
			<Stack height="100%">
				<DefaultBreadcrumb data={dataBreadcrumb} />
				<Container
					sx={{
						flexGrow: 1,
						display: 'flex',
						flexDirection: 'column',
						overflow: 'auto',
						pb: 2,
					}}
				>
					<CustomSkeleton
						width="100%"
						loading={transactionLoading || !router.query?.transactionId}
					>
						{mainCard}
					</CustomSkeleton>

					<Card sx={{ mt: 3, overflow: 'initial' }}>
						<CustomSkeleton
							width="100%"
							loading={transactionLoading || !router.query?.transactionId}
						>
							<Box p={2}>
								<Stack>
									<Tabs
										sx={{ mb: 3 }}
										value={tab}
										onChange={(ev, val) => setTab(val)}
									>
										<Tab label="Data Pembeli" />
										<Tab label="Detail Transaksi" />
										<Tab label="Penjadwalan" />
										<Tab label="Pembayaran" />
										<Tab label="Status Transaksi" />
										<Tab label="Status Pencairan Dana" />
									</Tabs>
									{tab == 0 && (
										<BuyerDocumentContentTab
											transactionData={transactionData}
											disableForm={disableForm}
											onSave={() =>
												transactionGetOne(
													('/' + router.query.transactionId) as string
												)
											}
											transactionSetData={transactionSetData}
										/>
									)}
									{tab == 1 && (
										<TransactionDetailTab
											isSpr={!!isSpr}
											transactionData={transactionData}
											disableForm={disableForm}
											onSave={() =>
												transactionGetOne(
													('/' + router.query.transactionId) as string
												)
											}
										/>
									)}
									{tab == 2 && (
										<ScheduleContentTab
											isSpr={!!isSpr}
											transactionData={transactionData}
											disableForm={disableForm}
											onSave={() =>
												transactionGetOne(
													('/' + router.query.transactionId) as string
												)
											}
										/>
									)}
									{tab == 3 && (
										<PaymentContentTab
											isSpr={!!isSpr}
											transactionData={transactionData}
											disableForm={disableForm}
											onSave={() =>
												transactionGetOne(
													('/' + router.query.transactionId) as string
												)
											}
										/>
									)}
									{tab == 4 && (
										<TransactionStatusContentTab
											transactionData={transactionData}
										/>
									)}
									{tab == 5 && (
										<ReimbursementStatusContentTab
											transactionData={transactionData}
										/>
									)}
								</Stack>
							</Box>
						</CustomSkeleton>
					</Card>
				</Container>
			</Stack>
		</>
	)
}

export default TransactionId
