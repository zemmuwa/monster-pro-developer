import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import React, { ReactNode } from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Link from '@mui/material/Link'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import NextLink from 'next/link'
import Box from '@mui/material/Box'
import CustomSkeleton from '../skeleton/CustomSkeleton'

interface PropsDashboardBlackCard {
	loading?: boolean
	data?: { title: string|ReactNode; sub: string }
	icon: ReactNode
	href?: string
}

function DashboardBlackCard({
	loading,
	data,
	icon,
	href,
}: PropsDashboardBlackCard) {
	return (
		<CustomSkeleton width="100%" loading={loading}>
			<Card
				sx={{
					width: '100%',
					borderRadius: '8px',
					backgroundColor: 'text.primary',
				}}
			>
				{/* <CardActionArea> */}
				<CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
					<Stack direction="row">
						<Typography noWrap mr="auto" color="white" variant="h2">
							{data?.title}
						</Typography>
						<Paper
							sx={{
								height: '48px',
								width: '48px',
								display: 'flex',
								flexShrink:0,
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '4px',
								backgroundColor: 'primary.main',
							}}
						>
							{icon}
						</Paper>
					</Stack>
					<Stack direction="row" spacing={2} alignItems="center">
						<Typography color="white" noWrap variant="body1">
							{data?.sub}
						</Typography>
						{href && (
							<Link
								underline="none"
								noWrap
								color="primary.main"
								href={href}
								display="flex"
							>
								<NextLink href={href}>
									<Box display="contents">
										<Typography noWrap variant="body1" fontWeight={700}>
											Lihat Detail
										</Typography>
										<ChevronRightIcon />
									</Box>
								</NextLink>
							</Link>
						)}
					</Stack>
					{/* <Stack direction="row" spacing={2}>
						<Paper
							sx={{
								height: '56px',
								width: '56px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: '4px',
								backgroundColor: 'primary.main',
							}}
						>
							{icon}
						</Paper>
						<Typography variant="h1">{data?.title}</Typography>
					</Stack> */}
				</CardContent>
				{/* </CardActionArea> */}
			</Card>
		</CustomSkeleton>
	)
}

export default DashboardBlackCard
