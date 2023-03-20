import Button, { ButtonProps } from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { PropsWithChildren, ReactNode, useState } from 'react'

interface PropsDropdownButton {
	menu?: {
		content: string | ReactNode
		onClick?: (index: number) => void
		disabled?: boolean
	}[]
	content?: ReactNode
	menuWidth?: string | number
	menuHeight?: string | number
}

function DropdownIconButton({
	children,
	menu,
	content,
	menuWidth,
	menuHeight,
	...props
}: PropsWithChildren<PropsDropdownButton> & ButtonProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (menu?.length || content) setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	return (
		<>
			<IconButton
				color="inherit"
				id="basic-icon-button"
				aria-haspopup="true"
				onClick={handleClick}
				sx={props.sx}
			>
				{children}
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleClose}
				PaperProps={{className:'custom-elevation'}}
				sx={{
					'& .MuiPaper-root': {
						width: menuWidth ?? '400px',
						height: menuHeight ?? undefined,
						display: 'flex',
						overflow: 'hidden',
						'& .MuiList-root': {
							display: 'flex',
							flexDirection:'column',
							width:'100%',
							p:0
						},
					},
				}}
				MenuListProps={{
					'aria-labelledby': 'basic-button',
				}}
			>
				{menu
					? menu.map((menuItem, menuI) => (
							<MenuItem
								disabled={menuItem?.disabled}
								key={menuI}
								onClick={() => {
									menuItem.onClick ? menuItem.onClick(menuI) : undefined
									handleClose()
								}}
							>
								{menuItem.content}
							</MenuItem>
					  ))
					: content}
			</Menu>
		</>
	)
}

export default DropdownIconButton
