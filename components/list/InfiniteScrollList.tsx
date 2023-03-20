import ArticleIcon from '@mui/icons-material/Article'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

interface PropsInfiniteScrollList<T> {
	data: T[]
	isNext: boolean
	getData: () => void
	loading?: boolean
	md?: number
	sm?: number
	lg?: number
	xl?: number
	render: (props: { loading?: boolean; data?: T }) => ReactNode
	renderEmpty?: ReactNode
	spacingRow?: number
	spacingCol?: number
	noPadding?: boolean
}

function InfiniteScrollList<T>({
	data,
	getData,
	isNext,
	loading,
	render,
	spacingCol,
	spacingRow,
	noPadding,
	renderEmpty,
	...cols
}: PropsInfiniteScrollList<T>) {
	return data.length ? (
		<Box id="scrollable" sx={{ overflow: 'overlay', flexGrow: 1 }}>
			<InfiniteScroll
				next={getData}
				hasMore={isNext}
				loader={
					<Grid
						my={1}
						container
						rowSpacing={spacingRow ?? 2}
						columnSpacing={spacingCol ?? 2}
						sx={{ px: noPadding ? 0 : 4 }}
					>
						{[1, 2, 3, 4].map((v, index) => (
							<Grid item key={index} xs={12} {...cols}>
								{render({ loading })}
							</Grid>
						))}
					</Grid>
				}
				dataLength={data.length}
				scrollableTarget="scrollable"
			>
				<Grid
					container
					rowSpacing={spacingRow ?? 2}
					columnSpacing={spacingCol ?? 2}
					mb={1}
					sx={{ px: noPadding ? 0 : 4 }}
				>
					{data.map((v, index) => (
						<Grid item key={index} xs={12} {...cols}>
							{render({ data: v })}
						</Grid>
					))}
				</Grid>
			</InfiniteScroll>
		</Box>
	) : loading ? (
		<Grid
			container
			rowSpacing={spacingRow ?? 2}
			columnSpacing={spacingCol ?? 2}
			mb={1}
			sx={{ px: noPadding ? 0 : 4 }}
		>
			{[1, 2, 3, 4].map((v, index) => (
				<Grid item key={index} xs={12} {...cols}>
					{render({ loading })}
				</Grid>
			))}
		</Grid>
	) : renderEmpty ? (
		<>{renderEmpty}</>
	) : (
		<Stack
			width={'100%'}
			flexGrow={1}
			alignItems="center"
			justifyContent={'center'}
			spacing="20px"
		>
			<ArticleIcon sx={{ fontSize: 64, color: 'grey.700' }} />
			<Typography fontWeight={700} color="grey.700" variant="body1">
				Data tidak ditemukan
			</Typography>
		</Stack>
	)
}

export default InfiniteScrollList
