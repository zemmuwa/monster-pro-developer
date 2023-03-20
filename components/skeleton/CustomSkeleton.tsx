import { Skeleton } from '@mui/material'
import { SxProps } from '@mui/material/styles'
import React, { PropsWithChildren } from 'react'

interface PropsCustomSkeleton {
	loading?: boolean
	height?: string | number
	width?: string | number
}

function CustomSkeleton({
	children,
	height,
	loading,
	width,
	...props
}: PropsWithChildren<PropsCustomSkeleton> & SxProps) {
	return loading ? (
		<Skeleton sx={{ ...props }} variant="rounded" height={height} width={width}>
			{children}
		</Skeleton>
	) : (
		<>{children}</>
	)
}

export default CustomSkeleton
