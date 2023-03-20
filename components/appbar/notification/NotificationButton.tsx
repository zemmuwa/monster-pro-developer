import React, { useEffect, useState } from 'react'
import { useMqttState, useSubscription } from 'mqtt-react-hooks'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import NotificationsIcon from '@mui/icons-material/Notifications'
import useFetch from '../../../hooks/useFetch'
import ENDPOINTS from '../../../utils/constants/endpoints'
import DropdownButton from '../../button/DropdownButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DropdownIconButton from '../../button/DropdownIconButton'
import Divider from '@mui/material/Divider'
import ChipGroup from './ChipGroup'
import InfiniteScrollList from '../../list/InfiniteScrollList'
import { IInboxGet } from '../../../interfaces/interfaceApiInbox'
import NotificationCard from './NotificationCard'
import Image from 'next/image'
import useApiCUD from '../../../hooks/useApiCUD'
import { formatDateDash, getMomentNow } from '../../../utils/date'
import { ButtonProps } from '@mui/material/Button'

interface PropsNotificationButton {
	userId?: string
}

export type TypeNotif = 'TRX' | 'OTR' | 'ALL'

interface IFilter {
	type?: TypeNotif
}

function NotificationButton({
	userId,
	...props
}: PropsNotificationButton & ButtonProps) {
	const { connectionStatus } = useMqttState()
	const [filter, setFilter] = useState<IFilter | undefined>({
		type: 'ALL',
	})
	const {
		data: inboxUnreadData,
		getAll: inboxUnreadGet,
		loading: inboxUnreadLoading,
	} = useFetch<IInboxGet>(
		ENDPOINTS.NOTIFICATION_INBOX,
		process.env.NEXT_PUBLIC_INBOX_PATH
	)

	const {
		data: inboxData,
		getAll: inboxGet,
		loading: inboxLoading,
		meta: inboxMeta,
		isNextPage: inboxIsNext,
		setData: inboxSetData,
	} = useFetch<IInboxGet>(
		ENDPOINTS.NOTIFICATION_INBOX,
		process.env.NEXT_PUBLIC_INBOX_PATH,
		{ limit: 15, mode: 'next' }
	)

	const {
		data: inboxTrxData,
		getAll: inboxTrxGet,
		loading: inboxTrxLoading,
		meta: inboxTrxMeta,
		isNextPage: inboxTrxIsNext,
		setData: inboxTrxSetData,
	} = useFetch<IInboxGet>(
		ENDPOINTS.NOTIFICATION_INBOX,
		process.env.NEXT_PUBLIC_INBOX_PATH,
		{ limit: 15, mode: 'next' }
	)
	const {
		data: inboxOtrData,
		getAll: inboxOtrGet,
		loading: inboxOtrLoading,
		meta: inboxOtrMeta,
		isNextPage: inboxOtrIsNext,
		setData: inboxOtrSetData,
	} = useFetch<IInboxGet>(
		ENDPOINTS.NOTIFICATION_INBOX,
		process.env.NEXT_PUBLIC_INBOX_PATH,
		{ limit: 15, mode: 'next' }
	)

	const { edit: inboxEdit } = useApiCUD(
		ENDPOINTS.NOTIFICATION_INBOX,
		process.env.NEXT_PUBLIC_INBOX_PATH
	)

	const inboxUnreadGetAllWParams = async () => {
		await inboxUnreadGet({
			filters: JSON.stringify(['read_at', 'IS', 'null']),
			size: -1,
		})
	}

	const inboxGetAllWParams = async (params?: { isNext?: boolean }) => {
		await inboxGet({ sort: '-created_at' }, { nextPage: params?.isNext })
	}
	const inboxTrxGetAllWParams = async (params?: { isNext?: boolean }) => {
		await inboxTrxGet(
			{
				filters: JSON.stringify(['inbox_category.code', 'TRX']),
				sort: '-created_at',
			},
			{ nextPage: params?.isNext }
		)
	}
	const inboxOtrGetAllWParams = async (params?: { isNext?: boolean }) => {
		await inboxOtrGet(
			{
				filters: JSON.stringify(['inbox_category.code', 'OTR']),
				sort: '-created_at',
			},
			{ nextPage: params?.isNext }
		)
	}

	const chipGroupData = [
		{ name: `Semua (${inboxMeta.total ?? 0})`, key: 'ALL' },
		{ name: `Transaksi (${inboxTrxMeta.total ?? 0})`, key: 'TRX' },
		{ name: `Lainnya (${inboxOtrMeta.total ?? 0})`, key: 'OTR' },
	]

	useEffect(() => {
		console.log(connectionStatus)
	}, [connectionStatus])

	const { message } = useSubscription([`/inbox-${userId}`])

	useEffect(() => {
		inboxUnreadGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [message])

	useEffect(() => {
		if (filter?.type == 'ALL') {
			inboxGetAllWParams()
		} else if (filter?.type == 'TRX') {
			inboxTrxGetAllWParams()
		} else if (filter?.type == 'OTR') {
			inboxOtrGetAllWParams()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter?.type])

	useEffect(() => {
		inboxTrxGetAllWParams()
		inboxOtrGetAllWParams()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onClickCard = async (data?: IInboxGet) => {
		window.open(data?.content.route_url, '_blank')?.focus()
		if (!data?.read_at) {
			const readAt = getMomentNow()

			inboxSetData((oldData) =>
				oldData.map((v) => {
					if (v.id == data?.id) {
						return { ...v, read_at: readAt }
					} else {
						return v
					}
				})
			)
			inboxTrxSetData((oldData) =>
				oldData.map((v) => {
					if (v.id == data?.id) {
						return { ...v, read_at: readAt }
					} else {
						return v
					}
				})
			)
			inboxOtrSetData((oldData) =>
				oldData.map((v) => {
					if (v.id == data?.id) {
						return { ...v, read_at: readAt }
					} else {
						return v
					}
				})
			)
			await inboxEdit({ read_at: readAt }, data?.id ?? '')
		}
	}

	const renderEmptyState = (
		<Stack
			width={'100%'}
			flexGrow={1}
			alignItems="center"
			justifyContent={'start'}
			spacing="20px"
		>
			<Image
				width="245px"
				height="223px"
				src="/assets/empty-notification.png"
				alt="img-empty"
			/>
			<Typography mt={3} fontWeight={600}>
				Belum Ada Notifikasi !
			</Typography>
			<Typography mt={1.5} color="grey.400" px={9} textAlign="center">
				Berbagai informasi transaksi dan pemberitahuan lainnya dapat Anda lihat
				disini
			</Typography>
		</Stack>
	)
	return (
		<DropdownIconButton
			sx={props?.sx}
			menuWidth="450px"
			content={
				<Stack height="100%" width="100%">
					<Stack className="custom-elevation-2" pb={2} px={3} pt={2} zIndex={1}>
						<Typography variant="h5">Notifikasi</Typography>
						<Divider sx={{ mx: -3, my: 1.5 }} />
						<ChipGroup
							data={chipGroupData}
							labelKey="name"
							value={filter?.type ?? ''}
							valueKey="key"
							onChange={(v) =>
								setFilter((f) => ({ ...f, type: v as TypeNotif }))
							}
							persistent
						/>
					</Stack>
					<Stack overflow="auto" height="400px">
						{filter?.type == 'ALL' && (
							<InfiniteScrollList
								data={inboxData}
								render={(props) => (
									<NotificationCard onClick={onClickCard} {...props} />
								)}
								loading={inboxLoading}
								isNext={inboxIsNext}
								getData={() => inboxGetAllWParams({ isNext: true })}
								noPadding
								spacingRow={0}
								renderEmpty={renderEmptyState}
							/>
						)}
						{filter?.type == 'TRX' && (
							<InfiniteScrollList
								data={inboxTrxData}
								render={(props) => (
									<NotificationCard onClick={onClickCard} {...props} />
								)}
								loading={inboxTrxLoading}
								isNext={inboxTrxIsNext}
								getData={() => inboxTrxGetAllWParams({ isNext: true })}
								noPadding
								spacingRow={0}
								renderEmpty={renderEmptyState}
							/>
						)}
						{filter?.type == 'OTR' && (
							<InfiniteScrollList
								data={inboxOtrData}
								render={(props) => (
									<NotificationCard onClick={onClickCard} {...props} />
								)}
								loading={inboxOtrLoading}
								isNext={inboxOtrIsNext}
								getData={() => inboxOtrGetAllWParams({ isNext: true })}
								noPadding
								spacingRow={0}
								renderEmpty={renderEmptyState}
							/>
						)}
					</Stack>
				</Stack>
			}
		>
			<Badge
				sx={{ '& .MuiBadge-badge': { fontSize: 10, fontWeight: 600 } }}
				badgeContent={inboxUnreadData?.length}
				max={99}
				color="error"
			>
				<NotificationsIcon sx={{ fontSize: 20, color: '#67748E' }} />
			</Badge>
		</DropdownIconButton>
	)
}

export default NotificationButton
