import Avatar from '@mui/material/Avatar'
import Box, { BoxProps } from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { formatDateSpace } from '../../utils/date'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import MapIcon from '@mui/icons-material/Map'
import { ITypeUnitGet } from '../../interfaces/interfaceApiTypeUnit'
import helper from '../../utils/helper'
import { useRouter } from 'next/router'
import LinkLabel from '../label/LinkLabel'

interface PropsUnitDetailHeader {
	loading?: boolean
	data?: ITypeUnitGet
}

function UnitDetailHeader({
	loading,
	data,
	...props
}: BoxProps & PropsUnitDetailHeader) {
	const router = useRouter()
	return (
		<Box position="relative" {...props}>
			{loading ? (
				<Skeleton
					sx={{
						display: 'flex',
						alignItems: 'center',
						position: 'relative',
						minHeight: '18.75rem',
						borderRadius: 'xl',
					}}
					variant="rounded"
				/>
			) : (
				<Box
					display="flex"
					alignItems="center"
					position="relative"
					minHeight="18.75rem"
					borderRadius="xl"
					sx={{
						backgroundImage: `url("${helper.fileUrl(
							data?.image_thumbnail_url ?? ''
						)}")`,
						backgroundSize: 'cover',
						backgroundPosition: '50%',
						overflow: 'hidden',
						borderRadius: '12px',
					}}
				/>
			)}

			<Card
				sx={{
					backdropFilter: `saturate(200%) blur(27px)`,
					borderRadius: '12px',
					backgroundColor: 'rgba(255, 255, 255, 0.8000)',
					position: 'relative',
					mt: -8,
					mx: 3,
					py: 2,
					px: 2,
				}}
			>
				<Grid container spacing={3} alignItems="center">
					<Grid item xs={12} sm={6}>
						<Stack direction={'row'} spacing={'15px'} alignItems={'center'}>
							<Box flexGrow={1} height="100%" mt={0.5} lineHeight={1}>
								<Stack direction="row" alignItems="center" spacing={0.5}>
									<Typography variant="h4" fontWeight={700}>
										{loading ? (
											<Skeleton width={'80%'} />
										) : (
											data?.type_unit_name
										)}
									</Typography>
									<IconButton
										onClick={() =>
											router.push(
												`/developer/${router.query.id}/project-unit/project/${
													router.query.projectId ?? ''
												}/type-unit/cu/edit-type-unit/${data?.id}`
											)
										}
									>
										<EditIcon sx={{ fill: (thm) => thm.palette.grey[400] }} />
									</IconButton>
								</Stack>

								<Typography variant="body2" fontWeight={600} color="grey.400">
									{loading ? (
										<Skeleton width={'60%'} />
									) : (
										data?.optional_data_cluster?.cluster_name ?? ''
									)}
								</Typography>
							</Box>
						</Stack>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Stack>
							<Typography
								color="grey.400"
								variant="h5"
								fontWeight={400}
								sx={{ textAlign: { xs: 'left', sm: 'right' } }}
							>
								Stok Unit{' '}
								<Typography component="span" variant="h5" fontWeight={700}>
									{(data?.sum_of_unit_block?.sum_of_block ?? 0) -
										(data?.sum_of_unit_block?.sum_of_block_sold ?? 0)}
								</Typography>
							</Typography>
							<Button
							onClick={()=>window.open(data?.location??'','_blank')}
								startIcon={<MapIcon />}
								sx={{ alignSelf: { xs: 'start', sm: 'end' } }}
							>
								Lihat Denah Lokasi
							</Button>
						</Stack>
					</Grid>
				</Grid>
			</Card>
		</Box>
	)
}

export default UnitDetailHeader
