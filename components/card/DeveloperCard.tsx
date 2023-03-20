import CircleIcon from '@mui/icons-material/Circle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import VerifiedIcon from '@mui/icons-material/Verified'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import React, { useContext } from 'react'
import { IDeveloperGet } from '../../interfaces/interfaceApiDeveloper'
import { ToastProviderContext } from '../../providers/ToastProvider'
import helper from '../../utils/helper'
import BuildingIcon from '../icons/BuildingIcon'
import HouseIcon from '../icons/HouseIcon'

interface PropsDeveloperCard {
	loading?: boolean
	data?: IDeveloperGet
	onClick?: (item?: IDeveloperGet) => void
}

function DeveloperCard({ data, loading, onClick }: PropsDeveloperCard) {
	const { openToast } = useContext(ToastProviderContext)
	const copyToClipboard = (value: string) => {
		navigator.clipboard.writeText(value)
		openToast(true, 'success', 'Kode Referal Tersalin')
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
			<CardActionArea
				onClick={() => (onClick ? onClick(data) : undefined)}
				sx={{ p: '12px' }}
			>
				<Stack direction="row" spacing={1} height="100%" alignItems="center">
					<Avatar
						src={helper.fileUrl(data?.logo_url ?? '')}
						alt="profile-image"
						variant="rounded"
						sx={{
							height: '100%',
							width: '56px',
							aspectRatio: '1/1',
						}}
					/>
					<Stack
						justifyContent={'space-between'}
						sx={{ mr: 'auto !important' }}
					>
						<Stack direction="row" alignItems="center">
							<Typography
								color={'black'}
								fontWeight={700}
								mr="6px"
								variant="body1"
							>
								{data?.developer_name}
							</Typography>
							{data?.rei_membership_status == 1 && (
								<>
									<Image
										width={15}
										height={15}
										alt="rei-logo"
										unoptimized
										src={'/assets/rei-logo.png'}
									/>

									<Stack direction="row" alignItems="center">
										<Typography
											color={'grey.400'}
											fontSize="10px"
											variant="caption"
											ml="4px"
										>
											REI Certified
										</Typography>
										<VerifiedIcon
											color="success"
											sx={{ width: '9px', height: '9px', alignSelf: 'start' }}
										/>
									</Stack>
								</>
							)}
						</Stack>
						<Stack direction="row" alignItems="center" spacing={1}>
							<BuildingIcon
								fillOpacity={0}
								sx={{
									fontSize: '16px',
									stroke: (theme) => theme.palette.grey[400],
								}}
							/>
							<Typography noWrap color={'grey.400'} variant="caption">
								{data?.sum_of_developer?.sum_of_project ?? '0'} Proyek
								Terdaftar
							</Typography>
							<CircleIcon sx={{ color: 'grey.700', fontSize: '6px', mx: 1 }} />
							<HouseIcon
								sx={{
									fontSize: '14px',
									color: (theme) => theme.palette.grey[400],
								}}
							/>
							<Typography noWrap color={'grey.400'} variant="caption">
								{data?.sum_of_developer?.sum_of_unit ?? '0'} Unit Terdaftar
							</Typography>
						</Stack>
					</Stack>
					<Stack alignItems="end">
						<Stack direction="row" alignItems="center">
							<Typography color="grey.400" variant="caption">
								{data?.reff ?? '-'}
							</Typography>
							<IconButton
								onClick={(ev) => {
									ev.stopPropagation()
									copyToClipboard(data?.reff ?? '')
								}}
								size="small"
							>
								<ContentCopyIcon color="primary" width="16px" height="16px" />
							</IconButton>
						</Stack>
						<Box
							borderRadius="100px"
							bgcolor={(theme) => theme.palette.primary.main}
							px="24px"
							py="6px"
						>
							<Typography fontWeight={700} color="white" variant="caption">
								{data?.sum_of_developer?.sum_of_active_transactions ?? '0'} Transaksi Aktif
							</Typography>
						</Box>
					</Stack>
				</Stack>
			</CardActionArea>
		</Card>
	)
}

export default DeveloperCard
