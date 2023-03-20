import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

const CustomSwitch = styled(Switch)(({ theme }) => ({
	'& .MuiSwitch-switchBase': {
		// padding: 2,
		'&.Mui-checked': {
			// transform: 'translateX(12px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				opacity: 1,
				backgroundColor: theme.palette.success,
			},
		},
	},
}))
export default CustomSwitch
