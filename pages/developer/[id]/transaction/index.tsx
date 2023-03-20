import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { AppBarProviderContext } from '../../../../components/appbar/DefaultAppBar'
import AddButton from '../../../../components/button/AddButton'
import DropdownButton from '../../../../components/button/DropdownButton'
import SearchField from '../../../../components/field/SearchField'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import InfiniteScrollList from '../../../../components/list/InfiniteScrollList'
import TransactionCard from '../../../../components/card/TransactionCard'
import useMenuAppbar from '../../../../hooks/useMenuAppbar'
import ENDPOINTS from '../../../../utils/constants/endpoints'
import { IDeveloperGet } from '../../../../interfaces/interfaceApiDeveloper'
import helper from '../../../../utils/helper'
import useFetch from '../../../../hooks/useFetch'
import { ITransactionGet } from '../../../../interfaces/interfaceApiTransaction'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TransactionActiveTabContent from '../../../../components/component-pages/transaction/TransactionActiveTabContent'
import TransactionFinishTabContent from '../../../../components/component-pages/transaction/TransactionFinishTabContent'
import Box from '@mui/material/Box'
interface IFilter {
	search: string | undefined
}
const Transaction: NextPage = () => {
	const router = useRouter()
	const [tab, setTab] = useState(0)
	const { setCompanyApp, setLoading } = useMenuAppbar()
	const {
		dataSingle: developerData,
		loading: developerLoading,
		getOne: developerGetOne,
	} = useFetch<IDeveloperGet>(
		ENDPOINTS.DEVELOPER,
		process.env.NEXT_PUBLIC_DEVELOPER_PATH
	)
	useEffect(() => {
		if (developerData) {
			setCompanyApp(
				developerData.developer_name,
				helper.fileUrl(developerData.logo_url)
			)
			setLoading(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [developerData])

	useEffect(() => {
		if (router.query.id) {
			developerGetOne(('/' + router.query.id) as string)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])
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
			['booking.booking_is_refund', 'IS', null],
			['OR'],
			['booking.booking_is_refund', false],
		])
		filters.push(['AND'])
		filters.push([
			['booking.is_paid_off', 'IS', null],
			['OR'],
			['booking.is_paid_off', false],
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
		await transactionGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	return (
		<Grid height="100%" container justifyContent="center">
			<Grid height="100%" item xs={12} md={10} lg={8}>
				<Stack height="100%" pt={2}>
					<Box mx={4}>
						<Tabs
							sx={{ mb: 2 }}
							variant="fullWidth"
							value={tab}
							onChange={(ev, val) => setTab(val)}
						>
							<Tab
								sx={{ '&.MuiTab-root': { fontSize: 14 } }}
								label="Transaksi Aktif"
							/>
							<Tab
								sx={{ '&.MuiTab-root': { fontSize: 14 } }}
								label="Transaksi Selesai"
							/>
						</Tabs>
					</Box>
					{tab == 0 ? (
						<TransactionActiveTabContent />
					) : (
						<TransactionFinishTabContent />
					)}
				</Stack>
			</Grid>
		</Grid>
	)
}

export default Transaction
