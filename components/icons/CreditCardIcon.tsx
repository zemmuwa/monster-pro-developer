import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import React from 'react'

function CreditCardIcon(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path
				d="M20 4H4A2 2 0 0 0 2 6V18A2 2 0 0 0 4 20H20A2 2 0 0 0 22 18V6A2 2 0 0 0 20 4M20 11H4V8H20Z"
			/>
		</SvgIcon>
	)
}

export default CreditCardIcon
