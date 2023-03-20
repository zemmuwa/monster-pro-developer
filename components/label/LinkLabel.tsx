import Link, { LinkProps } from '@mui/material/Link'
import React, { PropsWithChildren } from 'react'
import NextLink from 'next/link'
import { Url } from 'url'

interface PropsLinkLabel {
	href: string
	newtab?: boolean
}

function LinkLabel({
	href,
	newtab,
	children,
	...props
}: PropsWithChildren<PropsLinkLabel> & LinkProps) {
	return (
		<Link
			variant="body2"
			underline="hover"
			color="inherit"
			href={href}
			// component={'p'}
			// component="p"
			target={newtab ? '_blank' : undefined}
			{...props}
		>
				{children}
			{/* <NextLink target={newtab ? '_blank' : 'yeee'} href={href}>
				{children}
			</NextLink> */}
		</Link>
	)
}

export default LinkLabel
