import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactNode } from 'react'
import CircleIcon from '@mui/icons-material/Circle'
import Paper from '@mui/material/Paper'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material/SvgIcon'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import PlainTableCell from '../tables/PlainTableCell'

interface PropsDashboardCard {
	loading?: boolean
	data?: { title: string; sub: string }
	icon: ReactNode
}

function DashboardCard({ loading, data, icon }: PropsDashboardCard) {
	return loading ? (
		<Skeleton width="100%" variant="rounded" height={'154px'} />
	) : (
		<Card sx={{ width: '100%', borderRadius: '8px' }}>
			<CardActionArea>
				<CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
					<Table size="small">
						<TableRow>
							<PlainTableCell width="1%">
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
							</PlainTableCell>
							<PlainTableCell>
								<Typography variant="h1">{data?.title}</Typography>
							</PlainTableCell>
						</TableRow>
						<TableRow>
							<PlainTableCell width="1%"></PlainTableCell>
							<PlainTableCell>
								<Typography variant="body1">{data?.sub}</Typography>
							</PlainTableCell>
						</TableRow>
					</Table>
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
			</CardActionArea>
		</Card>
	)
}

export default DashboardCard
