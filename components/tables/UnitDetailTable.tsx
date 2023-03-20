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
import UnitDetailTableCell from './CustomTableCell'
import TableContainer from '@mui/material/TableContainer'
import Checkbox from '@mui/material/Checkbox'

interface IUnitDetailTableHeader<T extends object> {
	label: string
	key: NestedKeyOf<T>
	w?: string
	align?: TableCellProps['align']
	weight?: number
	color?: string
	noPadding?: boolean
	render?: (item: T, index: number) => ReactNode | string
}

interface IUnitDetailTable<T extends object> {
	headers: IUnitDetailTableHeader<T>[]
	highlightKey: NestedKeyOf<T>
	highlightValue: string | number
	data: T[]
	loading?: boolean
	onRowClick?: (item: T) => void
	dataChecked: string[] | number[]
	onCheck: (item: T, value: boolean, index: number) => void
	checkedKey?: NestedKeyOf<T>
}
function UnitDetailTable<T extends object>({
	headers,
	data,
	loading,
	onRowClick,
	dataChecked,
	onCheck,
	highlightKey,
	highlightValue,
	checkedKey,
}: IUnitDetailTable<T>) {
	const renderText = (
		text: string | number,
		column: IUnitDetailTableHeader<T>
	) => {
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
		column: IUnitDetailTableHeader<T>,
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
	return (
		// <TableContainer sx={{ height:'100%' }}>
		<Table
			sx={{
				borderCollapse: 'separate',
				tableLayout: 'fixed',
			}}
			aria-label="simple table"
			stickyHeader
		>
			<TableHead>
				<TableRow sx={{ backgroundColor: 'white' }}>
					<UnitDetailTableCell
						sx={{
							borderTop: '1px solid #e2e8f0',
							borderLeft: '1px solid #e2e8f0',
							borderTopLeftRadius: '12px',
							// width: v.w,
						}}
						align="center"
					>
						<Typography variant="caption" fontWeight={700} noWrap>
							PILIH
						</Typography>
					</UnitDetailTableCell>
					{headers.map((v, index) => (
						<UnitDetailTableCell
							key={v.key as string}
							align={v.align}
							sx={{
								borderTop: '1px solid #e2e8f0',
								// borderLeft: index == 0 ? '1px solid #e2e8f0' : undefined,
								borderRight:
									index == headers.length - 1 ? '1px solid #e2e8f0' : undefined,
								// borderTopLeftRadius: index == 0 ? '12px' : undefined,
								borderTopRightRadius:
									index == headers.length - 1 ? '12px' : undefined,
								width: v.w,
							}}
						>
							<Typography variant="caption" fontWeight={700} noWrap>
								{v.label}
							</Typography>
						</UnitDetailTableCell>
					))}
				</TableRow>
			</TableHead>
			<TableBody>
				{data.length == 0 || loading ? (
					<TableRow sx={{ backgroundColor: 'white' }}>
						<UnitDetailTableCell
							align="center"
							sx={{
								// borderTopLeftRadius: '12px',
								borderBottomLeftRadius: '12px',
								// borderTopRightRadius: '12px',
								borderBottomRightRadius: '12px',
								borderLeft: '1px solid #e2e8f0',
								borderRight: '1px solid #e2e8f0',
							}}
							colSpan={headers.length + 1}
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
						</UnitDetailTableCell>
					</TableRow>
				) : (
					data.map((row, index) => (
						<TableRow
							onClick={onRowClick ? () => onRowClick(row) : undefined}
							hover
							sx={{ backgroundColor: 'white' }}
							key={index}
						>
							<UnitDetailTableCell
								align="center"
								sx={{
									borderLeft: '1px solid #e2e8f0',
									borderBottomLeftRadius:
										index == data.length - 1 ? '12px' : undefined,
									bgcolor:
										getByKey(row, highlightKey) == highlightValue
											? 'grey.300'
											: undefined,
									p: 0,
								}}
							>
								<Checkbox
									checked={
										checkedKey
											? dataChecked.includes(getByKey(row, checkedKey) as never)
											: dataChecked.includes(index as never)
									}
									onChange={(ev, val) => onCheck(row, val, index)}
									inputProps={{ 'aria-label': 'controlled' }}
								/>
							</UnitDetailTableCell>
							{headers.map((v, indexHeader) => (
								<UnitDetailTableCell
									key={v.key as string}
									sx={{
										// backgroundColor:getByKey(row, activeKey)?'white':'grey.300',
										borderRight:
											indexHeader == headers.length - 1
												? '1px solid #e2e8f0'
												: undefined,
										// borderLeft:
										// 	indexHeader == 0 ? '1px solid #e2e8f0' : undefined,
										// borderBottomLeftRadius:
										// 	index == data.length - 1 && indexHeader == 0
										// 		? '12px'
										// 		: undefined,
										borderBottomRightRadius:
											index == data.length - 1 &&
											indexHeader == headers.length - 1
												? '12px'
												: undefined,
										width: v.w,
										p: v.noPadding ? 0 : undefined,
										bgcolor:
											getByKey(row, highlightKey) == highlightValue
												? 'grey.300'
												: undefined,
									}}
									align={v.align}
								>
									{renderCell(row, v, index, indexHeader)}
								</UnitDetailTableCell>
							))}
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
		// </TableContainer>
	)
}
export default UnitDetailTable
