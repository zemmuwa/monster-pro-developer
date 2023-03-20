import Button, { ButtonProps } from '@mui/material/Button'
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
}

function DropdownButton({
	children,
	menu,
	content,
	menuWidth,
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
			<Button
				id="basic-button"
				aria-haspopup="true"
				onClick={handleClick}
				variant={props.variant ?? 'contained'}
				color="inherit"
				disableElevation
				sx={
					props.sx ?? {
						backgroundColor: 'white',
						border: 1,
						borderColor: '#F0F0F0',
					}
				}
				{...props}
			>
				{children}
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={!!anchorEl}
				onClose={handleClose}
				sx={{ '& .MuiPaper-root': { width: menuWidth ?? '400px' } }}
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

export default DropdownButton
