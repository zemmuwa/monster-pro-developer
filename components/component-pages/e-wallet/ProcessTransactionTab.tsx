import Stack from '@mui/material/Stack'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import ENDPOINTS from '../../../utils/constants/endpoints'
import InfiniteScrollList from '../../list/InfiniteScrollList'
import { ITransactionGet } from '../../../interfaces/interfaceApiTransaction'
import TransactionBookingCard from './TransactionBookingCard'

interface PropsProcessTransactionTab {
	bookingId?: string
	showFile?: boolean
	withDueDate?: boolean
}

function ProcessTransactionTab({
	bookingId,
	withDueDate,
	showFile,
}: PropsProcessTransactionTab) {
	const router = useRouter()
	const {
		data: trxData,
		getAll: trxGetAll,
		loading: trxLoading,
		isNextPage: trxIsNext,
	} = useFetch<ITransactionGet>(
		ENDPOINTS.TRANSACTION,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH,
		{
			limit: 10,
			mode: 'next',
		}
	)

	const trxGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		const filter: any[] = [
			['developer_id', router.query.id],
			['AND'],
			[['redeem_status', 1], ['OR'], ['redeem_status', 2]],
		]
		if (bookingId) {
			filter.push(['AND'])
			filter.push(['booking_id', bookingId])
		}
		queryParams.filters = JSON.stringify(filter)
		// }
		await trxGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	useEffect(() => {
		if (router.query.id) {
			trxGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id, bookingId])
	const renderSaldoItemCard = (
		props:
			| {
					data?: ITransactionGet
					loading?: boolean
			  }
			| undefined
	) => {
		return (
			<TransactionBookingCard
				data={props?.data}
				loading={props?.loading}
				showFile={showFile}
				withDueDate={withDueDate}
			/>
		)
	}
	return (
		<Stack height="100%" overflow="auto">
			<InfiniteScrollList
				data={trxData}
				render={(props) => renderSaldoItemCard(props)}
				loading={trxLoading || !router.query.id}
				isNext={trxIsNext}
				getData={() => trxGetAllWParams({ isNext: true })}
			/>
		</Stack>
	)
}

export default ProcessTransactionTab
