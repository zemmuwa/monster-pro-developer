import CancelIcon from '@mui/icons-material/Cancel'
import DownloadIcon from '@mui/icons-material/Download'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import React from 'react'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import helper from '../../../../utils/helper'
import { formatNumber } from '../../../../utils/number'
import DefaultDialog, {
	PropsDefaultDialog,
} from '../../../dialog/DefaultDialog'

interface PropsRedeemFailedDialog {
	data: ITransactionGet[]
}

function RedeemFailedDialog({
	data,
	...props
}: PropsDefaultDialog & PropsRedeemFailedDialog) {
	return (
		<DefaultDialog
			{...props}
			renderHeader={
				<Stack direction="row" spacing={2}>
					<Box width="100px">
						<Image
							width={512}
							height={522}
							alt="Img"
							layout="responsive"
							unoptimized
							src={'/assets/transaction-failed.png'}
						/>
					</Box>
					<Stack justifyContent="space-evenly">
						<Typography variant="h5">{props.title}</Typography>
						<Stack
							bgcolor="error.300"
							direction="row"
							px={1.5}
							py="10px"
							spacing={1.5}
							borderRadius="4px"
						>
							<CancelIcon
								color="error"
								sx={{ width: '20px', height: '20px' }}
							/>
							<Typography fontWeight={600} variant="caption" color="error.main">
								{props.title}!
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			}
		>
			<Stack>
				<Typography fontWeight={700}>
					Detail Penarikan Saldo e-Wallet
				</Typography>
				{data?.map((mt, mI) => {
					return (
						<Grid key={mI} container spacing={1.5}>
							<Grid item xs={6} md={4}>
								<Typography variant="body2" color="grey.400">
									Nama Pembeli
								</Typography>
							</Grid>
							<Grid xs={6} md={8} item>
								<Typography variant="body2" fontWeight={600}>
									{mt?.buyer?.name ?? '-'}
								</Typography>
							</Grid>
							<Grid item xs={6} md={4}>
								<Typography variant="body2" color="grey.400">
									Kode Booking
								</Typography>
							</Grid>
							<Grid xs={6} md={8} item>
								<Typography variant="body2" fontWeight={600}>
									{mt?.booking?.booking_code ?? '-'}
								</Typography>
							</Grid>
							<Grid item xs={6} md={4}>
								<Typography variant="body2" color="grey.400">
									Detail Unit
								</Typography>
							</Grid>
							<Grid xs={6} md={8} item>
								<Typography variant="body2" fontWeight={600}>
									{mt?.developer?.developer_name} -{' '}
									{mt?.unit_block_data?.developer_project_data.project_name} -
									Tipe {mt?.unit_block_data?.data_type_unit.type_unit_name} -
									Blok {mt?.unit_block_data?.block_name} Nomor{' '}
									{mt?.unit_block_data?.block_number}
								</Typography>
							</Grid>
							<Grid item xs={6} md={4}>
								<Typography variant="body2" color="grey.400">
									Jenis Penarikan
								</Typography>
							</Grid>
							<Grid xs={6} md={8} item>
								<Typography variant="body2" fontWeight={600}>
									{mt?.transaction_type}
									{mt?.developer_payment_schedule
										? ' DP ke ' + mt?.developer_payment_schedule.termin
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
									{mt?.transaction_code}
								</Typography>
							</Grid>
							<Grid item xs={6} md={4}>
								<Typography variant="body2" color="grey.400">
									Jumlah Penarikan
								</Typography>
							</Grid>
							<Grid xs={6} md={8} item>
								<Typography variant="body2" fontWeight={600}>
									{formatNumber(mt?.total ?? '0')}
								</Typography>
							</Grid>
							{Boolean(
								mt?.current_redeem?.file_redeem?.find(
									(cr) => cr.description == 'INVOICE'
								)?.master_document_url
							) && (
								<>
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
														mt?.current_redeem?.file_redeem?.find(
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
								</>
							)}
							{Boolean(
								mt?.current_redeem?.file_redeem?.find(
									(cr) => cr.description == 'KWITANSI'
								)?.master_document_url
							) && (
								<>
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
														mt?.current_redeem?.file_redeem?.find(
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
								</>
							)}
							{Boolean(
								mt?.current_redeem?.file_redeem?.find(
									(cr) => cr.description == 'RECEIPT'
								)?.master_document_url
							) && (
								<>
									<Grid item xs={6} md={4}>
										<Typography variant="body2" color="grey.400">
											Bukti Transfer
										</Typography>
									</Grid>
									<Grid xs={6} md={8} item>
										<Button
											onClick={() =>
												window.open(
													helper.fileUrl(
														mt?.current_redeem?.file_redeem?.find(
															(cr) => cr.description == 'RECEIPT'
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
											Bukti Transfer
										</Button>
									</Grid>
								</>
							)}
							{mI + 1 < data.length && (
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
		</DefaultDialog>
	)
}

export default RedeemFailedDialog
