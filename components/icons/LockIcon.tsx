import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

function LockIcon(props: SvgIconProps) {
	return (
		<SvgIcon viewBox="0 0 16 17" {...props}>
			<path
				d="M11.3334 5.83334V5.16668C11.3334 3.32868 9.83808 1.83334 8.00008 1.83334C6.16208 1.83334 4.66675 3.32868 4.66675 5.16668V7.16668H4.00008C3.26475 7.16668 2.66675 7.76468 2.66675 8.50001V13.8333C2.66675 14.5687 3.26475 15.1667 4.00008 15.1667H12.0001C12.7354 15.1667 13.3334 14.5687 13.3334 13.8333V8.50001C13.3334 7.76468 12.7354 7.16668 12.0001 7.16668H6.00008V5.16668C6.00008 4.06401 6.89741 3.16668 8.00008 3.16668C9.10275 3.16668 10.0001 4.06401 10.0001 5.16668V5.83334H11.3334Z"
			/>
		</SvgIcon>
	)
}

export default LockIcon