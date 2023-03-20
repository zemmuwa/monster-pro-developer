import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import { TableCellProps } from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import { NestedKeyOf } from '../../types/globals'
import getByKey from '../../utils/object-utils'
import CustomTableCell from './CustomTableCell'
import TableContainer from '@mui/material/TableContainer'

export interface ICustomTableHeader<T extends object> {
	label: string
	key: NestedKeyOf<T>
	w?: string
	align?: TableCellProps['align']
	weight?: number
	color?: string
	noPadding?: boolean
	render?: (item: T, index: number) => ReactNode | string
	onClick?: (item: T, index: number) => void
	sticky?: boolean
}

interface ICustomTable<T extends object> {
	headers: ICustomTableHeader<T>[]
	data: T[]
	loading?: boolean
	minWidth?: string | number
	onRowClick?: (item: T) => void
	stickyLastCol?: boolean
}
function CustomTable<T extends object>({
	headers,
	data,
	loading,
	onRowClick,
	minWidth,
	stickyLastCol,
}: ICustomTable<T>) {
	const renderText = (text: string | number, column: ICustomTableHeader<T>) => {
		return (
			<Box display="flex" justifyContent={column.align}>
				<Typography
					variant="caption"
					color={column?.color ?? 'grey.400'}
					fontWeight={column.weight}
					noWrap
				>
					{text}
				</Typography>
			</Box>
		)
	}
	const renderCell = (
		row: T,
		column: ICustomTableHeader<T>,
		rowI: number,
		columnI: number
	) => {
		if (!column.render) return renderText(getByKey(row, column.key), column)
		else {
			const customRender = column.render(row, rowI)
			if (typeof customRender == 'string')
				return renderText(customRender, column)
			else return customRender
		}
	}

	const getOffset = (index: number) => {
		let offset = 0
		headers
			.filter((v, vi) => vi < index)
			.forEach(
				(v) =>
					(offset += Number(
						(v?.w?.includes('px') ? v.w.replace('px', '') : v.w) ?? 0
					))
			)
		return offset
	}
	return (
		<TableContainer sx={{ height: '100%', maxWidth: '100%' }}>
			<Table
				sx={{
					borderCollapse: 'separate',
					tableLayout: 'fixed',
					minWidth: { minWidth },
				}}
				aria-label="simple table"
				stickyHeader
			>
				<TableHead>
					<TableRow sx={{ backgroundColor: 'white' }}>
						{headers.map((v, index) => (
							<CustomTableCell
								key={v.key as string}
								align={v.align}
								sx={{
									borderTop: '1px solid #e2e8f0',
									borderLeft: index == 0 ? '1px solid #e2e8f0' : undefined,
									borderRight:
										index == headers.length - 1
											? '1px solid #e2e8f0'
											: undefined,
									borderTopLeftRadius: index == 0 ? '12px' : undefined,
									// borderBottomLeftRadius: index == 0 ? '12px' : undefined,
									borderTopRightRadius:
										index == headers.length - 1 ? '12px' : undefined,
									// borderBottomRightRadius:
									// 	index == headers.length - 1 ? '12px' : undefined,
									width: v.w,
									position:
										v?.sticky || (stickyLastCol && index == headers.length - 1)
											? 'sticky'
											: undefined,
									left: v?.sticky
										? index == 0
											? 0
											: getOffset(index)
										: undefined,
									zIndex:
										v?.sticky || (stickyLastCol && index == headers.length - 1)
											? 3
											: undefined,
									right:
										stickyLastCol && index == headers.length - 1
											? 0
											: undefined,
								}}
							>
								<Typography variant="caption" fontWeight={700} noWrap>
									{v.label}
								</Typography>
							</CustomTableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.length == 0 || loading ? (
						<TableRow sx={{ backgroundColor: 'white' }}>
							<CustomTableCell
								align="center"
								sx={{
									// borderTopLeftRadius: '12px',
									borderBottomLeftRadius: '12px',
									// borderTopRightRadius: '12px',
									borderBottomRightRadius: '12px',
									borderLeft: '1px solid #e2e8f0',
									borderRight: '1px solid #e2e8f0',
								}}
								colSpan={headers.length}
							>
								<Stack
									direction={'row'}
									spacing={1}
									justifyContent="center"
									alignItems="center"
								>
									{loading && <CircularProgress size={16} />}
									<Typography
										variant="body2"
										fontWeight={700}
										color="#A0AEC0"
										noWrap
									>
										{loading ? 'Proses...' : 'Data tidak ditemukan'}
									</Typography>
								</Stack>
							</CustomTableCell>
						</TableRow>
					) : (
						data.map((row, index) => (
							<TableRow
								onClick={onRowClick ? () => onRowClick(row) : undefined}
								hover
								sx={{ backgroundColor: 'white' }}
								key={index}
							>
								{headers.map((v, indexHeader) => (
									<CustomTableCell
										key={v.key as string}
										sx={{
											// backgroundColor:getByKey(row, activeKey)?'white':'grey.300',
											borderRight:
												indexHeader == headers.length - 1
													? '1px solid #e2e8f0'
													: undefined,
											borderLeft:
												indexHeader == 0 ? '1px solid #e2e8f0' : undefined,
											borderBottomLeftRadius:
												index == data.length - 1 && indexHeader == 0
													? '12px'
													: undefined,
											borderBottomRightRadius:
												index == data.length - 1 &&
												indexHeader == headers.length - 1
													? '12px'
													: undefined,
											width: v.w,
											p: v.noPadding ? 0 : undefined,
											position:
												v?.sticky ||
												(stickyLastCol && indexHeader == headers.length - 1)
													? 'sticky'
													: undefined,
											left: v?.sticky
												? indexHeader == 0
													? 0
													: getOffset(indexHeader)
												: undefined,
											zIndex:
												v?.sticky ||
												(stickyLastCol && indexHeader == headers.length - 1)
													? 3
													: undefined,
											right:
												stickyLastCol && indexHeader == headers.length - 1
													? 0
													: undefined,
										}}
										align={v.align}
										onClick={() =>
											v.onClick ? v.onClick(row, index) : undefined
										}
									>
										{renderCell(row, v, index, indexHeader)}
									</CustomTableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
export default CustomTable
