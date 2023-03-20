import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Popover'
import Box from '@mui/material/Box'
import React, { PropsWithChildren, ReactNode } from 'react'

interface PropsDefaultPopover {
	id: string
	renderContent: ReactNode
}

function DefaultPopover({
	id,
	children,
	renderContent,
}: PropsWithChildren<PropsDefaultPopover>) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)
	return (
		<>
			<Box
				aria-owns={open ? id : undefined}
				aria-haspopup="true"
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
				display="flex"
			>
				<>{children}</>
			</Box>
			<Popover
				id={id}
				sx={{
					pointerEvents: 'none',
				}}
				open={open ?? false}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<>{renderContent}</>
			</Popover>
		</>
	)
}

export default DefaultPopover
