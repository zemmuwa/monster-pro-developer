import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactNode } from 'react'
import { ITransactionGet } from '../../../interfaces/interfaceApiTransaction'
import { formatNumber } from '../../../utils/number'
import CustomChip from '../../chip/CustomChip'
import ClipboardChecked from '../../icons/ClipboardChecked'
import CustomSkeleton from '../../skeleton/CustomSkeleton'
import DownloadIcon from '@mui/icons-material/Download'
import helper from '../../../utils/helper'

interface PropsTransactionBookingCard {
	data?: ITransactionGet
	loading?: boolean
	showFile?: boolean
	withDueDate?: boolean
	withReceipt?: boolean
	renderBottomSection?: (id: string) => ReactNode
	renderLeftSection?: (id: string) => ReactNode
}

function TransactionBookingCard({
	data,
	showFile,
	loading,
	withDueDate,
	withReceipt,
	renderBottomSection,
	renderLeftSection,
}: PropsTransactionBookingCard) {
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
	const status = getStatusProgress(data?.redeem_status ?? 0)
	return (
		<CustomSkeleton width="100%" loading={loading}>
			<Stack direction="row" spacing={2} alignItems="center">
				{renderLeftSection?.(data?.id ?? '')}
				<Stack spacing={2} width="100%">
					<Stack
						// bgcolor={!isSpr ? 'grey.300' : undefined}
						borderRadius={1}
						border={(theme) => `1px solid #E2E8F0`}
						py="12px"
						width="100%"
					>
						<Stack direction="row" justifyContent="space-between" mx={1.5}>
							<Typography fontWeight={700} variant="body2">
								{data?.transaction_type}
								{data?.developer_payment_schedule
									? ' DP ke ' + data?.developer_payment_schedule.termin
									: ''}
							</Typography>
							<Typography variant="caption">
								Kode Booking :{' '}
								<Typography variant="caption" component="span" fontWeight={700}>
									{data?.booking.booking_code}
								</Typography>
							</Typography>
						</Stack>
						<Divider color="#E2E8F0" sx={{ my: 1 }} />
						<Stack direction="row" spacing="12px" flexGrow={1} mx={1.5}>
							<ClipboardChecked
								sx={{ stroke: (thm) => thm.palette.text.primary }}
								fillOpacity={'0'}
							/>
							<Stack flexGrow={1}>
								<Typography variant="body1" fontWeight={700}>
									{data?.transaction_code}
								</Typography>
								<Typography variant="caption" mb={1}>
									{data?.developer?.developer_name} -{' '}
									{data?.unit_block_data?.developer_project_data.project_name} -
									Tipe {data?.unit_block_data?.data_type_unit.type_unit_name} -
									Blok {data?.unit_block_data?.block_name} Nomor{' '}
									{data?.unit_block_data?.block_number}
								</Typography>
							</Stack>
						</Stack>
						<Stack direction="row" alignItems="center">
							<Box width={48} />
							<Stack direction="row" alignItems="center" spacing={1}>
								<Typography variant="body2" fontWeight={700}>
									Rp {formatNumber(data?.total ?? '0')}
								</Typography>
								<CustomChip
									bgColor={status.color}
									label={status.label}
									color={'white'}
								/>
							</Stack>
						</Stack>
						{showFile && data?.redeem_status != 3 && (
							<>
								<Divider sx={{ my: 1 }} />
								<Stack direction="row" spacing={2} mx={2} alignItems="center">
									<Button
										onClick={() =>
											window.open(
												helper.fileUrl(
													data?.current_redeem?.file_redeem?.find(
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
									<Button
										onClick={() =>
											window.open(
												helper.fileUrl(
													data?.current_redeem?.file_redeem?.find(
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
									{withDueDate && (
										<Stack flexGrow={1} alignItems="end">
											<Typography variant="caption" color="error.main">
												Transafer sebelum :{' '}
												<Typography
													component="span"
													fontWeight={700}
													variant="caption"
												>
													12-12-1912
												</Typography>
											</Typography>
										</Stack>
									)}
									{withReceipt && data?.redeem_status == 4 && (
										<Button
											onClick={() =>
												window.open(
													helper.fileUrl(
														data?.current_redeem?.file_redeem?.find(
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
									)}
								</Stack>
							</>
						)}
					</Stack>
					{renderBottomSection?.(data?.id ?? '')}
				</Stack>
			</Stack>
		</CustomSkeleton>
	)
}

export default TransactionBookingCard
