import Stack from '@mui/material/Stack'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import React from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { IProjectGet } from '../../interfaces/interfaceApiProject'
import UnitCard from '../card/UnitCard'
import { useRouter } from 'next/router'
interface PropsUnitList {
	loading?: boolean
	data?: IProjectGet
}
function UnitList({ loading, data }: PropsUnitList) {
	const router = useRouter()
	return loading ? (
		<Skeleton variant="rectangular" height="244px" animation="wave" />
	) : (
		<Stack spacing={1}>
			<Stack direction="row" spacing={2} alignItems="center">
				<Typography fontWeight={700} variant="body1">
					{data?.project_name}
				</Typography>
				<Button
					onClick={() =>
						router.push(
							`/developer/${router.query.id}/project-unit/project/${data?.id??''}/type-unit/cu/add-type-unit`
						)
					}
					color="inherit"
					sx={{ color: 'grey.400' }}
					endIcon={<AddOutlinedIcon />}
				>
					<Typography fontWeight={700} variant="body2">
						Tambah Tipe
					</Typography>
				</Button>
			</Stack>
			{!!data?.data_type_unit?.length ? (
				data?.data_type_unit?.map((unitItem, unitI) => (
					<UnitCard
						projectId={data.id}
						loading={loading}
						data={unitItem}
						key={unitI}
					/>
				))
			) : (
				<Typography fontWeight={700} color="grey.400" textAlign="center">
					Belum memiliki tipe unit
				</Typography>
			)}
		</Stack>
	)
}

export default UnitList
