import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CardActionArea from '@mui/material/CardActionArea'
import React, { useState } from 'react'
import HouseIcon from '../icons/HouseIcon'
import SoldIcon from '../icons/SoldIcon'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { useRouter } from 'next/router'
import { IProjectGet } from '../../interfaces/interfaceApiProject'
import { ITypeUnitGet } from '../../interfaces/interfaceApiTypeUnit'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import helper from '../../utils/helper'
interface PropsUnitList {
	loading?: boolean
	data?: ITypeUnitGet
	projectId?: string
}
function UnitCard({ loading, data, projectId }: PropsUnitList) {
	const router = useRouter()
	const developerId = router.query.id
	const [showAddStock, setShowAddStock] = useState(false)
	return (
		<Card className={showAddStock ? 'custom-elevation' : ''}>
			<CardActionArea
				onMouseEnter={() => setShowAddStock(true)}
				onMouseLeave={() => setShowAddStock(false)}
				sx={{
					'& .MuiCardActionArea-focusHighlight': { background: 'transparent' },
				}}
				onClick={() => {
					router.push(
						`/developer/${developerId}/project-unit/project/${projectId}/type-unit/${data?.id}`
					)
				}}
			>
				<Box p={2}>
					<Stack direction="row" spacing={1.5} alignItems="center">
						<Avatar
							sx={{ width: '56px', height: '56px' }}
							variant="rounded"
							src={helper.fileUrl(data?.image_thumbnail_url ?? '')}
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
								{data?.type_unit_name}
							</Typography>
							<Stack direction="row" alignItems="center" spacing={1}>
								<HouseIcon
									fillOpacity={0}
									sx={{
										fontSize: '14px',
										stroke: (theme) => theme.palette.grey[400],
									}}
								/>
								<Typography noWrap color={'grey.400'} variant="caption">
									{data?.sum_of_unit_block?.sum_of_block ?? 0} Unit Terdaftar
								</Typography>
								<SoldIcon
									sx={{
										fontSize: '14px',
										color: (theme) => theme.palette.grey[400],
									}}
								/>
								<Typography noWrap color={'grey.400'} variant="caption">
									{data?.sum_of_unit_block?.sum_of_block_sold ?? 0} Terjual
								</Typography>
							</Stack>
						</Stack>
						<Stack direction="row" spacing={1}>
							<Button
								onClick={(ev) => {
									ev.stopPropagation()
									router.push(
										`/developer/${developerId}/project-unit/project/${projectId}/type-unit/${data?.id}/unit/add-unit`
									)
								}}
								size="small"
								color="inherit"
								endIcon={
									<AddOutlinedIcon
										sx={{ fill: (theme) => theme.palette.grey[400] }}
									/>
								}
							>
								<Typography fontWeight={700} color="grey.400" variant="body2">
									Tambah Stok
								</Typography>
							</Button>
							{showAddStock && (
								<Button
									// onClick={() =>
									// 	router.push(
									// 		`/developer/${developerId}/project-unit/project/${projectId}/type-unit/${data?.id}`
									// 	)
									// }
									size="small"
									endIcon={<ArrowForwardIcon />}
								>
									<Typography fontWeight={700} variant="body2">
										Lihat Detail
									</Typography>
								</Button>
							)}
						</Stack>
					</Stack>
				</Box>
			</CardActionArea>
		</Card>
	)
}

export default UnitCard
