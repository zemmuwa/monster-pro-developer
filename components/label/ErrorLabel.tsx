import Typography from '@mui/material/Typography'
import React, { PropsWithChildren } from 'react'

function ErrorLabel({ children,fontWeight }: PropsWithChildren & {fontWeight?:number}) {
	return (
		<Typography noWrap variant="caption" mt={1} color={'error.main'} fontWeight={fontWeight}>
			{children}
		</Typography>
	)
}

export default ErrorLabel
