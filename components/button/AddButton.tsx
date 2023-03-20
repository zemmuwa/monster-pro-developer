import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'
import Paper from '@mui/material/Paper'
import React from 'react'

function AddButton(props: IconButtonProps) {
	return (
		<Paper sx={{ borderRadius: '100%', height: 'fit-content' }} elevation={4}>
			<IconButton color="primary" aria-label="apps" size="small" {...props}>
				<AddIcon sx={{ fontSize: 20 }} />
			</IconButton>
		</Paper>
	)
}

export default AddButton
