import AlarmIcon from '@mui/icons-material/Alarm'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import CircleIcon from '@mui/icons-material/Circle'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import PaymentsIcon from '@mui/icons-material/Payments'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences'
import StarIcon from '@mui/icons-material/Star'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import { styled, useTheme } from '@mui/material/styles'
import { SvgIconProps } from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import MapMarkerRadius from '../icons/MapMarkerRadius'

const drawerWidth = 262

const CustomListItemIcon = styled(ListItemIcon)`
	minwidth: 32px;
	justify-content: center;
	margin-right: 12px;
`

function NavDrawer() {
	const [mobileOpen, setMobileOpen] = React.useState(false)
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}
	const listRoute = useMemo<PropsDropdownList[]>(
		() => [
			{
				title: 'Master Wilayah',
				icon: (props) => <MapMarkerRadius {...props} />,
				path: '/region',
				menus: [
					{ title: 'Provinsi', path: '/province' },
					{ title: 'Kabupaten / Kota', path: '/city' },
					{ title: 'Kecamatan', path: '/district' },
				],
			},
			{
				title: 'Master Pembayaran',
				icon: (props) => <PaymentsIcon {...props} />,
				path: '/payment',
				menus: [
					{ title: 'Bank', path: '/bank' },
					{ title: 'Tipe Pembayaran', path: '/payment-type' },
				],
			},
			{
				title: 'Master Membership',
				icon: (props) => <StarIcon {...props} />,
				path: '/membership',
			},
			{
				title: 'Master Legal Dokumen',
				icon: (props) => <PrivacyTipIcon {...props} />,
				path: '/legal-document',
			},
			{
				title: 'Master Pajak',
				icon: (props) => <ReceiptLongIcon {...props} />,
				path: '/tax',
			},
			{
				title: 'Master Status Global',
				icon: (props) => <BookmarkAddedIcon {...props} />,
				path: '/global-status',
			},
			{
				title: 'Master Kategori Global',
				icon: (props) => <RoomPreferencesIcon {...props} />,
				path: '/global-category',
			},
			{
				title: 'Master SLA',
				icon: (props) => <AlarmIcon {...props} />,
				path: '/sla',
			},
			{
				title: 'Master Kelengkapan Dokumen',
				icon: (props) => <FileCopyIcon {...props} />,
				path: '/document-completeness',
				menus: [
					{ title: 'Jenis Dokumen', path: '/document-type' },
					{ title: 'Grup Dokumen', path: '/document-group' },
				],
			},
		],
		[]
	)
	const drawer = (
		<Box component={Paper} height="100%" display="flex" flexDirection="column">
			<Box width="100%" p="16px">
				<Image
					src="/assets/monster-logo.png"
					alt="Monster Logo"
					layout="responsive"
					width={2948}
					height={774}
					priority
				/>
			</Box>
			<Divider sx={{ mx: 2, mb: 2 }} />
			<Typography color="grey.400" variant="body2" fontWeight={700} px="16px">
				Global Setting
			</Typography>
			<Box flexGrow={1} overflow="auto">
				{listRoute.map((routeItem, routeI) => (
					<DropdownList
						key={routeI}
						title={routeItem.title}
						icon={routeItem.icon}
						menus={routeItem?.menus}
						path={routeItem?.path}
					/>
				))}
			</Box>
			<Box width="115px" alignSelf="center">
				<Image
					src="/assets/monster-group-logo.png"
					alt="Monster Logo"
					layout="responsive"
					width={2948}
					height={774}
				/>
			</Box>
			<Typography
				mb={2}
				textAlign="center"
				color="grey.700"
				fontWeight={600}
				variant="caption"
			>
				Ver 1.0.0.0
			</Typography>
		</Box>
	)
	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			aria-label="mailbox folders"
		>
			{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
			<Drawer
				// container={container}
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
						border: 'none',
						// borderRadius:'12px'
						backgroundColor: 'background.default',
						pt: '16px',
						pl: 4,
						pb: '16px',
						overflow: 'hidden',
					},
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	)
}
interface DropdownListChildren {
	title: string
	path: string
}
interface PropsDropdownList {
	title: string
	icon: (props: SvgIconProps) => ReactNode
	menus?: DropdownListChildren[]
	path: string
}
function DropdownList({ icon, title, menus, path }: PropsDropdownList) {
	const [open, setOpen] = React.useState(true)
	const theme = useTheme()
	const [isActive, setIsActive] = useState(false)
	const router = useRouter()
	const handleClick = () => {
		menus ? setOpen(!open) : router.push(`${path}`)
	}
	useEffect(() => {
		if (router.pathname == path) setIsActive(true)
		else setIsActive(false)
		if (menus) {
			const check = menus.some((v) => `${path}${v.path}` == router.pathname)
			if (check) setIsActive(true)
			else setIsActive(false)
		}
	}, [menus, path, router.pathname])
	return (
		<>
			<ListItemButton onClick={handleClick}>
				<CustomListItemIcon sx={{ minWidth: '32px' }}>
					<Paper
						sx={{
							height: '32px',
							width: '32px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: '4px',
							backgroundColor: isActive ? 'primary.main' : 'grey.100',
						}}
					>
						{icon({
							sx: { fill: isActive ? 'white' : theme.palette.grey[400] },
							width: '16px',
							height: '16px',
						})}
					</Paper>
				</CustomListItemIcon>
				<ListItemText
					primary={title}
					primaryTypographyProps={{
						fontWeight: isActive ? 700 : 600,
						color: isActive ? undefined : 'grey.400',
						variant: 'caption',
					}}
				/>
				{menus && (open ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
			</ListItemButton>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<List component="div" disablePadding>
					{menus?.map((v, childrenI) => {
						const isChildActive = `${path}${v.path}` == router.pathname
						// if (isChildActive) setIsActive(true)
						return (
							<ListItemButton
								onClick={() =>
									!isChildActive ? router.push(`${path}${v.path}`) : undefined
								}
								key={childrenI}
							>
								<CustomListItemIcon sx={{ minWidth: '32px' }}>
									<CircleIcon
										sx={{
											width: '6px',
											height: '6px',
											fill: isChildActive
												? theme.palette.primary.main
												: theme.palette.grey[400],
										}}
									/>
								</CustomListItemIcon>
								<ListItemText
									primary={v.title}
									primaryTypographyProps={{
										fontWeight: isChildActive ? 700 : 600,
										color: isChildActive ? 'primary.main' : 'grey.400',
										variant: 'caption',
									}}
								/>
							</ListItemButton>
						)
					})}
				</List>
			</Collapse>
		</>
	)
}

export default NavDrawer
