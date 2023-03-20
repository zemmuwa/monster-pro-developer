import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import CustomChip from '../../../chip/CustomChip'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import useFetch from '../../../../hooks/useFetch'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import { ITransactionRedeemList } from '../../../../interfaces/interfaceApiTransactionRedeemList'
import helper from '../../../../utils/helper'
import { formatNumber } from '../../../../utils/number'
import CustomSkeleton from '../../../skeleton/CustomSkeleton'
import { useRouter } from 'next/router'

interface PropsReimbursementStatusContentTab {
	transactionData?: ITransactionGet
}
function ReimbursementStatusContentTab({
	transactionData,
}: PropsReimbursementStatusContentTab) {
	const router = useRouter()
	const {
		data: statusData,
		getAll: statusGetAll,
		loading: statusLoading,
	} = useFetch<ITransactionRedeemList>(
		ENDPOINTS.TRANSACTION_REDEEM_GET,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const statusGetAllWParams = () => {
		statusGetAll({
			filters: JSON.stringify([['booking_id', transactionData?.booking_id],["AND"],[["transaction_type","=","UTJ"],["OR"],["transaction_type","=","UNT"]]]),
			sort: '-created_at',
			size:-1
		})
	}

	const getStatusProgress = (status: number) => {
		let statusProgress = { color: 'primary.main', label: 'Ajukan Pencairan' }
		switch (status) {
			case 1:
				statusProgress = { color: 'warning.main', label: 'Proses Pencairan' }
				break
			case 2:
				statusProgress = { color: 'success.main', label: 'Sudah Cair' }
				break

			default:
				break
		}
		return statusProgress
	}

	const renderChip = (trxRedeem: ITransactionRedeemList) => {
		const data = getStatusProgress(trxRedeem?.redeem_status)
		if (trxRedeem?.redeem_status) {
			return (
				<CustomChip bgColor={data.color} label={data.label} color={'white'} />
			)
		} else {
			return (
				<Button
					onClick={()=>router.push(`/developer/${router.query.id}/e-wallet/order/${trxRedeem.booking_id}`)}
					variant="contained"
					disabled={
						!trxRedeem.booking.status_buyer ||
						!trxRedeem.booking.status_dev ||
						!trxRedeem.booking.status_spr
					}
				>
					<Typography variant="caption" color="white" fontWeight={700}>
						{data.label}
					</Typography>
				</Button>
			)
		}
	}

	useEffect(() => {
		if (transactionData) statusGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])
	return (
		<>
			<Box width={{ xs: '100%' }}>
				<Timeline
					sx={{
						[`& .${timelineItemClasses.root}:before`]: {
							flex: 0,
							padding: 0,
						},
					}}
				>
					{!statusLoading && transactionData
						? statusData?.map((stsItem, stsI) => (
								<TimelineItem key={stsI}>
									<TimelineSeparator>
										<TimelineDot />
										<TimelineConnector />
									</TimelineSeparator>
									<TimelineContent>
										<Stack spacing={2}>
											<Typography variant="h5" fontWeight={700}>
												{stsItem?.transaction_type}{' '}
												{stsItem?.developer_payment_schedule
													? 'DP ke ' +
													  stsItem?.developer_payment_schedule.termin
													: ''}
											</Typography>
											<Stack
												p={2}
												direction="row"
												spacing={2}
												border={`1px solid #E2E8F0`}
												alignItems="start"
											>
												<Avatar
													variant="rounded"
													src={helper.fileUrl(
														transactionData?.unit_block_data?.data_type_unit
															?.image_thumbnail_url ?? ''
													)}
													alt="img"
													sx={{ width: '48px', height: '48px' }}
												/>
												<Stack flex={1}>
													<Typography variant="body1" fontWeight={700}>
														{stsItem?.transaction_code}
													</Typography>
													<Typography variant="caption" fontWeight={700} mb={1}>
														{transactionData?.developer?.developer_name} -{' '}
														{
															transactionData?.unit_block_data
																?.developer_project_data?.project_name
														}{' '}
														-{' '}
														{
															transactionData?.unit_block_data?.data_type_unit
																?.type_unit_name
														}{' '}
														- Blok{' '}
														{transactionData?.unit_block_data?.block_name} Nomor{' '}
														{transactionData?.unit_block_data?.block_number}
													</Typography>
													<Typography variant="body2" fontWeight={700}>
														Rp {formatNumber(stsItem?.grand_total ?? '0')}
													</Typography>
												</Stack>
												<Box alignSelf="end">{renderChip(stsItem)}</Box>
											</Stack>
										</Stack>
									</TimelineContent>
								</TimelineItem>
						  ))
						: [1, 2, 3]?.map((stsItem, stsI) => (
								<TimelineItem key={stsI}>
									<TimelineSeparator>
										<TimelineDot />
										<TimelineConnector />
									</TimelineSeparator>
									<TimelineContent>
										<CustomSkeleton loading width="100%">
											<Stack spacing={2}>
												<Typography variant="h5" fontWeight={700}></Typography>
												<Stack
													p={2}
													direction="row"
													spacing={2}
													border={`1px solid #E2E8F0`}
													alignItems="start"
												>
													<Avatar
														variant="rounded"
														src=""
														alt="img"
														sx={{ width: '48px', height: '48px' }}
													/>
													<Stack flex={1}>
														<Typography
															variant="body1"
															fontWeight={700}
														></Typography>
														<Typography
															variant="caption"
															fontWeight={700}
															mb={1}
														></Typography>
														<Typography
															variant="body2"
															fontWeight={700}
														></Typography>
													</Stack>
													<Box alignSelf="end"></Box>
												</Stack>
											</Stack>
										</CustomSkeleton>
									</TimelineContent>
								</TimelineItem>
						  ))}
				</Timeline>
			</Box>
		</>
	)
}

export default ReimbursementStatusContentTab
