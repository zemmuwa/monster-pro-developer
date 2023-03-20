import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import React, { useState } from 'react'

function PasswordField(props: TextFieldProps) {
	const [showPassword, setShowPassword] = useState(false)
	const handleClickShowPassword = () => {
		setShowPassword((v) => !v)
	}

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault()
	}
	return (
		<TextField
			{...props}
			sx={{ mb: '28px' }}
			size="small"
			fullWidth
			variant="outlined"
			placeholder="*********"
			type={showPassword ? 'text' : 'password'}
			InputProps={{
				sx: { backgroundColor: 'background.paper' },
				endAdornment: (
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={handleClickShowPassword}
							onMouseDown={handleMouseDownPassword}
							edge="end"
						>
							{showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
						</IconButton>
					</InputAdornment>
				),
			}}
		/>
	)
}

export default PasswordField
