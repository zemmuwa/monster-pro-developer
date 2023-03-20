import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import DropdownButton from '../../button/DropdownButton'
import SearchField from '../../field/SearchField'
import TransactionCard from '../../card/TransactionCard'
import InfiniteScrollList from '../../list/InfiniteScrollList'
import { useRouter } from 'next/router'
import { ITransactionGet } from '../../../interfaces/interfaceApiTransaction'
import ENDPOINTS from '../../../utils/constants/endpoints'
import useFetch from '../../../hooks/useFetch'

interface IFilter {
	search: string | undefined
}
function TransactionFinishTabContent() {
	const router = useRouter()

	const [filter, setFilter] = useState<IFilter | undefined>({ search: '' })
	useEffect(() => {
		if (router.query.id) {
			transactionGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id, filter?.search])
	const {
		data: transactionData,
		getAll: transactionGetAll,
		isNextPage: transactionIsNext,
		loading: transactionLoading,
	} = useFetch<ITransactionGet>(
		ENDPOINTS.TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH,
		{ limit: 20, mode: 'next' }
	)
	const transactionGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		const filters = []
		filters.push(['developer_id', '=', router.query.id])
		filters.push(['AND'])
		filters.push(['transaction_type', 'UTJ'])
		filters.push(['AND'])
		filters.push([
			['booking.is_paid_off',true],
			['OR'],
			['booking.status_dev', false],
			['OR'],
			['booking.status_buyer', false],
		])
		if (filter?.search) {
			filters.push(['AND'])
			filters.push([
				['buyer.name', 'like', filter?.search],
				['OR'],
				['unit_block_data.block_name', 'like', filter?.search],
				['OR'],
				['agency.agency_name', 'like', filter?.search],
				['OR'],
				['agent.first_name', 'like', filter?.search],
				['OR'],
				['agent.last_name', 'like', filter?.search],
				['OR'],
				['data_type_unit.type_unit_name', 'like', filter?.search],
			])
		}
		queryParams.filters = JSON.stringify(filters)
		queryParams.sort ='-created_at'
		await transactionGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	return (
		<>
			<Grid mb={2} container spacing={2} sx={{ px: 4 }}>
				<Grid
					item
					xs={12}
					sm={12}
					md={5}
					lg={7}
					display="flex"
					alignItems="center"
				>
					<Typography variant="h4">Transaksi Selesai</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					md={3}
					lg={2}
					sx={{
						justifyContent: { xs: 'left', md: 'right' },
						display: 'flex',
					}}
				>
					<DropdownButton
						sx={{ display: 'none' }}
						startIcon={<FilterAltOutlinedIcon />}
						endIcon={
							<KeyboardArrowDownOutlinedIcon sx={{ color: 'grey.700' }} />
						}
					>
						Filter
					</DropdownButton>
				</Grid>
				<Grid item xs={12} sm={6} md={4} lg={3}>
					<SearchField
						onChange={(v) => setFilter((f) => ({ ...f, search: v }))}
					/>
				</Grid>
			</Grid>
			<Stack px={4} overflow="auto">
				<InfiniteScrollList
					data={transactionData}
					render={(props) => (
						<TransactionCard
							{...props}
							onChangeStatus={() => transactionGetAllWParams()}
						/>
					)}
					loading={transactionLoading || !router.query.id}
					isNext={transactionIsNext}
					getData={() => transactionGetAllWParams({ isNext: true })}
					noPadding
				/>
			</Stack>
		</>
	)
}

export default TransactionFinishTabContent
