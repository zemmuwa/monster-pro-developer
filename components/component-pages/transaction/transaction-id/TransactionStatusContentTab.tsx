import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import useFetch from '../../../../hooks/useFetch'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import { ILogBookingGet } from '../../../../interfaces/interfaceApiLogBooking'
import { formatDateSpace } from '../../../../utils/date'

interface PropsTransactionStatusContentTab {
	transactionData?: ITransactionGet
}

function TransactionStatusContentTab({
	transactionData,
}: PropsTransactionStatusContentTab) {
	const {
		data: statusData,
		getAll: statusGetAll,
		loading: statusLoading,
	} = useFetch<ILogBookingGet>(
		ENDPOINTS.LOG_BOOKING,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH
	)

	const statusGetAllWParams = () => {
		statusGetAll({
			filters: JSON.stringify(['booking_id', transactionData?.booking_id]),
			sort: 'created_at',
			size:-1
		})
	}

	useEffect(() => {
		if (transactionData) statusGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [transactionData])

	return (
		<>
			<Box width={{ xs: '100%', md: '50%' }}>
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
										<Stack direction="row" spacing={2}>
											<Stack mr="auto">
												<Typography variant="body2" fontWeight={700}>
													{stsItem?.activities_status?.status_name +
														(stsItem?.desc ?? '')}
												</Typography>
												<Typography
													variant="caption"
													color="grey.700"
													fontWeight={600}
												>
													{stsItem?.activities_status?.description}
												</Typography>
											</Stack>
											<Typography
												noWrap
												overflow="visible"
												variant="caption"
												color="grey.700"
												fontWeight={600}
											>
												{formatDateSpace(stsItem?.created_at)}
											</Typography>
										</Stack>
									</TimelineContent>
								</TimelineItem>
						  ))
						: [1, 2, 3].map((stsItem, stsI) => (
								<TimelineItem key={stsI}>
									<TimelineSeparator>
										<TimelineDot />
										<TimelineConnector />
									</TimelineSeparator>
									<TimelineContent>
										<Stack direction="row" spacing={2}>
											<Stack mr="auto">
												<Typography variant="body2" fontWeight={700}>
													<Skeleton width={'200px'} />
												</Typography>
												<Typography
													variant="caption"
													color="grey.700"
													fontWeight={600}
												>
													<Skeleton />
												</Typography>
											</Stack>
											<Typography
												noWrap
												overflow="visible"
												variant="caption"
												color="grey.700"
												fontWeight={600}
											>
												<Skeleton />
											</Typography>
										</Stack>
									</TimelineContent>
								</TimelineItem>
						  ))}
				</Timeline>
			</Box>
		</>
	)
}

export default TransactionStatusContentTab
