import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CardActionArea from '@mui/material/CardActionArea'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import { IBookingGet } from '../../../interfaces/interfaceApiBooking'
import ENDPOINTS from '../../../utils/constants/endpoints'
import helper from '../../../utils/helper'
import ErrorLabel from '../../label/ErrorLabel'
import InfiniteScrollList from '../../list/InfiniteScrollList'
import CustomSkeleton from '../../skeleton/CustomSkeleton'
import ErrorIcon from '@mui/icons-material/Error'
import { formatNumber } from '../../../utils/number'
import usePermission from '../../../hooks/usePermission'

function AllTransactionTab() {
	const router = useRouter()
	const { isAdmin } = usePermission()
	const {
		data: trxData,
		getAll: trxGetAll,
		loading: trxLoading,
		isNextPage: trxIsNext,
	} = useFetch<IBookingGet>(
		ENDPOINTS.BOOKING,
		process.env.NEXT_PUBLIC_TRANSACTION_PATH,
		{
			limit: 10,
			mode: 'next',
		}
	)

	const trxGetAllWParams = async (params?: { isNext?: boolean }) => {
		let queryParams: Record<string, any> = {}
		queryParams.filters = JSON.stringify([['developer_id', router.query.id],['AND'],['booking_is_paid',true]])
		// }
		await trxGetAll(queryParams, { nextPage: params?.isNext ?? false })
	}
	useEffect(() => {
		if (router.query.id) {
			trxGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.query.id])
	const renderSaldoItemCard = (
		props:
			| {
					data?: IBookingGet
					loading?: boolean
			  }
			| undefined
	) => {
		const isSpr =
			props?.data?.status_spr == true && props?.data?.status_buyer == true
		return (
			<CustomSkeleton width="100%" loading={props?.loading}>
				<Stack
					// bgcolor={!isSpr ? 'grey.300' : undefined}
					borderRadius={1}
					border={(theme) => `1px solid #E2E8F0`}
					py="12px"
					width="100%"
				>
					<Stack direction="row" spacing="12px" flexGrow={1} mx={1.5}>
						<Avatar
							alt="image-unit"
							variant="rounded"
							src={helper.fileUrl(
								props?.data?.unit_block_data?.data_type_unit
									?.image_thumbnail_url ?? ''
							)}
							sx={{ width: 48, height: 48 }}
						/>
						<Stack flexGrow={1}>
							<Typography variant="body1" fontWeight={700}>
								{props?.data?.booking_code}
							</Typography>
							<Typography variant="caption" mb={1}>
								{props?.data?.developer?.developer_name} -{' '}
								{
									props?.data?.unit_block_data?.developer_project_data
										.project_name
								}{' '}
								- Tipe{' '}
								{props?.data?.unit_block_data?.data_type_unit.type_unit_name} -
								Blok {props?.data?.unit_block_data?.block_name} Nomor{' '}
								{props?.data?.unit_block_data?.block_number}
							</Typography>
						</Stack>
					</Stack>
					<Stack direction="row" spacing="12px" alignItems="center" mx={1.5}>
						<Box width={48} />
						<Typography variant="body2" fontWeight={700}>
							Rp {formatNumber(props?.data?.total ?? '0')}
						</Typography>
					</Stack>
					<Divider color="#E2E8F0" sx={{ my: 2 }} />
					<Button
						onClick={() =>
							router.push(router.asPath + '/order/' + props?.data?.id)
						}
						disabled={!isSpr}
						variant="contained"
						sx={{ mx: 1.5 }}
					>
						<Typography variant="caption" fontWeight={700} color="white">
							{isAdmin ? 'Lihat Detail' : 'Ajukan Pencairan'}
						</Typography>
					</Button>
					{!isSpr && (
						<Stack alignItems="center">
						<CardActionArea
							sx={{ mt: 1, width: 'fit-content' }}
							onClick={() =>
								router.push(
									`/developer/${router.query.id}/transaction/${props?.data?.transaction?.id}`
								)
							}
						>
							<Stack
								my={1}
								mx={2}
								justifyContent="center"
								direction="row"
								spacing={1}
								alignItems="center"
							>
								<ErrorIcon
									color="error"
									sx={{ width: '16px', height: '16px' }}
								/>

								<ErrorLabel fontWeight={700}>
									Anda belum menyelesaikan proses SPR{' '}
								</ErrorLabel>
							</Stack>
						</CardActionArea>
						</Stack>
					)}
				</Stack>
			</CustomSkeleton>
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

export default AllTransactionTab
