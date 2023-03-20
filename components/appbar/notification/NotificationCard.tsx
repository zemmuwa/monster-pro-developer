import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'
import { IInboxGet } from '../../../interfaces/interfaceApiInbox'
import { formatDateFromNow, formatTime } from '../../../utils/date'
import CreditCardIcon from '../../icons/CreditCardIcon'
import CustomSkeleton from '../../skeleton/CustomSkeleton'
import InfoIcon from '@mui/icons-material/Info'
import CampaignIcon from '@mui/icons-material/Campaign'
import CardActionArea from '@mui/material/CardActionArea'
import { useRouter } from 'next/router'
import helper from '../../../utils/helper'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

interface PropsNotificationCard {
	data?: IInboxGet
	loading?: boolean
	onClick: (data?: IInboxGet) => void
}

function NotificationCard({ data, loading, onClick }: PropsNotificationCard) {
	const router = useRouter()
	const getTypeIcon = () => {
		if (data?.inbox_category.code == 'TRX') {
			return <CreditCardIcon sx={{ fill: (thm) => thm.palette.primary.main }} />
		}
		if (data?.inbox_category.code == 'OTR') {
			return <InfoIcon sx={{ fill: (thm) => thm.palette.primary.main }} />
		} else {
			return <CampaignIcon sx={{ fill: (thm) => thm.palette.primary.main }} />
		}
	}
	const getTypeLabel = () => {
		let label = ''
		switch (data?.inbox_category.code) {
			case 'TRX':
				label = 'Transaksi'
				break
			case 'OTR':
				label = 'Lainnya'
				break

			default:
				break
		}
		return label
	}

	return (
		<CustomSkeleton loading={loading} width="100%">
			<CardActionArea
				onClick={() => onClick(data)}
				sx={{
					bgcolor: data?.read_at ? 'white' : '#ebeff4',
					px: 3,
					py: 1.5,
					display: 'flex',
					':hover': { bgcolor: 'grey.300' },
					border: (thm) => `1px solid #e2e8f0`,
				}}
			>
				<Stack direction="row" spacing={1.5}>
					{getTypeIcon()}
					<Stack flexGrow={1}>
						<Typography variant="caption" color="grey.400">
							{getTypeLabel()}
						</Typography>
						<Typography sx={{
								display: '-webkit-box',
								overflow: 'hidden',
								WebkitBoxOrient: 'vertical',
								WebkitLineClamp: 2,
							}} variant="body2" fontWeight={600} mb={1}>
							{data?.content.title}
						</Typography>
						<Typography
							sx={{
								display: '-webkit-box',
								overflow: 'hidden',
								WebkitBoxOrient: 'vertical',
								WebkitLineClamp: 2,
							}}
							variant="caption"
							color="grey.400"
							mb={1}
						>
							{data?.content.subtitle}
						</Typography>
						{data?.inbox_category.code == 'TRX' && (
							<Stack
								height="50px"
								mb={1}
								bgcolor="white"
								borderRadius="6px"
								direction="row"
								alignItems="center"
								spacing={1.5}
								border={(thm) => `1px solid #e2e8f0`}
							>
								<Avatar
									variant="square"
									sx={{
										width: 50,
										height: 50,
										borderTopLeftRadius: '6px',
										borderBottomLeftRadius: '6px',
									}}
									alt="img-detail"
									src={helper.fileUrl(data?.content?.icon_url)}
								/>
								<Typography
									flexGrow={1}
									noWrap
									variant="body2"
									color="grey.400"
									fontWeight={600}
								>
									{data?.content?.detail}
								</Typography>
								<Button sx={{ fontWeight: 600 }}>Detail</Button>
							</Stack>
						)}
						<Typography fontSize="10px" color="grey.400">
							{formatDateFromNow(data?.created_at)},{' '}
							{formatTime(data?.created_at)} WIB
						</Typography>
					</Stack>
				</Stack>
			</CardActionArea>
		</CustomSkeleton>
	)
}

export default NotificationCard
