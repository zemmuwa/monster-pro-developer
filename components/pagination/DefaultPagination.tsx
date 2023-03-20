import Skeleton from '@mui/material/Skeleton'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

interface PropsDefaultPagination {
	count: number
	onChange: (page: number) => void
	page: number
	loading?: boolean
	totalData: number
	limit: number
	visibleCount: number
}
function DefaultPagination({
	count,
	onChange,
	page,
	loading,
	limit,
	totalData,
	visibleCount,
}: PropsDefaultPagination) {
	const from = () => {
		let result = (page - 1) * limit
		if (count) result += 1
		return result
	}
	const to = () => {
		let result = (page - 1) * limit + visibleCount
		return result
	}

	return (
		<Stack my={2} direction="row">
			<Typography mr="auto" variant="body2">
				{loading ? (
					<Skeleton variant="rounded" width={'100px'} height="24px" />
				) : (
					`Result ${from()}-${to()} of ${totalData}`
				)}
			</Typography>
			{loading ? (
				<Skeleton variant="rounded" width={'200px'} height="24px" />
			) : (
				<Pagination
					color="primary"
					sx={{
						'&>.MuiPagination-ul': { justifyContent: 'end' },
						'& .MuiPaginationItem-root': { backgroundColor: 'white' },
					}}
					// count={count}
					count={count}
					variant="outlined"
					// shape="rounded"
					page={page}
					onChange={(event, page) => onChange(page)}
				/>
			)}
		</Stack>
	)
}

export default DefaultPagination
