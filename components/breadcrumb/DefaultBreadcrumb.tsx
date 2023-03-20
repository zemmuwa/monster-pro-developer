import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

interface PropsDefaultBreadcrumb {
	data: { label: string; path: string }[]
}
function DefaultBreadcrumb({ data }: PropsDefaultBreadcrumb) {
	const router = useRouter()
	return (
		<Stack px={4} my={2} direction="row" spacing={1} alignItems="center">
			<IconButton
				edge="start"
				color="inherit"
				aria-label="apps"
				onClick={() => router.back()}
				// sx={{ mr: 2 }}
			>
				<ArrowBackIcon sx={{ fontSize: 16, color: 'text.primary' }} />
			</IconButton>
			<Breadcrumbs aria-label="breadcrumb">
				{data.map((dataItem, dataI) =>
					dataI + 1 >= data.length ? (
						<Typography
							key={dataI}
							variant="body2"
							fontWeight={700}
							color="text.primary"
						>
							{dataItem.label}
						</Typography>
					) : (
						<Link
							key={dataI}
							variant="body2"
							underline="hover"
							color="inherit"
							// href={dataItem.path}
						>
							<NextLink href={dataItem.path}>{dataItem.label}</NextLink>
							{/* {dataItem.label} */}
						</Link>
					)
				)}
			</Breadcrumbs>
		</Stack>
	)
}

export default DefaultBreadcrumb
