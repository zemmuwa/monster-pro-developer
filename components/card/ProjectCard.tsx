import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { formatDateSpace } from '../../utils/date'
import helper from '../../utils/helper'
import DropdownButton from '../button/DropdownButton'
import CustomSwitch from '../switch/CustomSwitch'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import HouseIcon from '../icons/HouseIcon'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import { useRouter } from 'next/router'
import { IProjectGet } from '../../interfaces/interfaceApiProject'
interface PropsProjectCard {
	loading?: boolean
	data?: IProjectGet
	onSwitch?: (id: number | string) => void
	onEdit?: (data: IProjectGet) => void
	onDelete?: (data: IProjectGet) => void
}
function ProjectCard({
	loading,
	data,
	onSwitch,
	onDelete,
	onEdit,
}: PropsProjectCard) {
	const router = useRouter()
	return (
		<Card sx={{ width: '100%', borderRadius: '8px' }}>
			<CardActionArea
				onClick={() => router.push(`${router.asPath}/project/${data?.id}`)}
			>
				<Box sx={{ position: 'relative' }}>
					{loading ? (
						<Skeleton variant="rectangular" height="244px" animation="wave" />
					) : (
						<>
							<CardMedia
								component="img"
								height="244px"
								// image={helper.fileUrl(data?.thumbnail_image_url ?? '')}
								image={helper.fileUrl(data?.project_cover_url ?? '')}
								alt={data?.project_name}
								sx={{
									filter: data?.is_publish
										? 'brightness(75%)'
										: 'grayscale(100%) brightness(75%)',
								}}
							></CardMedia>
							<Stack
								sx={{
									position: 'absolute',
									top: 0,
									pt: '12px',
									px: '8px',
									justifyContent: 'space-between',
								}}
								direction={'row'}
								alignItems="center"
								width="100%"
							>
								<Chip
									avatar={
										<HouseIcon
											sx={{
												fill: 'white',
												width: '14px !important',
												height: '14px !important',
											}}
										/>
									}
									label={data?.sum_of_block ?? 0}
									sx={{
										bgcolor: 'rgba(37, 47, 64, 0.24)',
										color: 'white',
										px: '12px',
										py: '4px',
										fontWeight: 700,
										fontSize: 12,
										mr: 'auto',
									}}
								/>
								<Box
									width="20px"
									height="20px"
									bgcolor={data?.is_publish?"success.main":'error.main'}
									borderRadius="6px"
									border="1px solid white"
								/>
								{/* <CustomSwitch
								onClick={() =>
									onSwitch ? onSwitch(data?.id ?? '0') : undefined
								}
								color="success"
								checked={data?.is_show}
							/> */}
								{/* <DropdownButton
								sx={{ minWidth: 0 }}
								variant="text"
								size="small"
								menuWidth={'100px'}
								menu={[
									{
										content: (
											<Typography fontWeight={700} variant="caption">
												EDIT
											</Typography>
										),
										onClick: () => (onEdit && data ? onEdit(data) : undefined),
									},
									{
										content: (
											<Typography fontWeight={700} variant="caption">
												DELETE
											</Typography>
										),
										onClick: () =>
											onDelete && data ? onDelete(data) : undefined,
									},
								]}
							>
								<MoreVertIcon />
							</DropdownButton> */}
							</Stack>
							<Stack
								sx={{
									position: 'absolute',
									bottom: 0,
									pb: '12px',
									px: '8px',
									justifyContent: 'space-between',
								}}
								width="100%"
							>
								<Typography
									noWrap
									variant="h5"
									fontWeight={700}
									component="div"
									color="white"
								>
									{loading ? <Skeleton /> : data?.project_name}
								</Typography>
								<Stack direction="row" alignItems="center" spacing={1}>
									<LocationOnOutlinedIcon
										sx={{ color: 'white', fontSize: '12px' }}
									/>
									<Typography color="white" noWrap variant="caption">
										{loading ? (
											<Skeleton />
										) : (
											`${data?.master_city?.city_name ?? ''}, ${
												data?.master_province?.province_name ?? ''
											}`
										)}
									</Typography>
								</Stack>
							</Stack>
						</>
					)}
				</Box>
			</CardActionArea>
		</Card>
	)
}
export default ProjectCard
