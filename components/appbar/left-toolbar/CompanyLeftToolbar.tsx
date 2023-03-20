import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import { useRouter } from 'next/router'
import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Typography from '@mui/material/Typography'
interface PropsCompanyLeftToolbar {
	title: string
	avatar: string
	loading?: boolean
}

function CompanyLeftToolbar({
	avatar,
	title,
	loading,
}: PropsCompanyLeftToolbar) {
	const router = useRouter()
	const titleText = (
		<Typography variant="h5" component="div">
			{title}
		</Typography>
	)

	return (
		<>
			<IconButton
				edge="start"
				color="inherit"
				aria-label="apps"
				onClick={() => router.replace('/')}
				// sx={{ mr: 2 }}
			>
				<ArrowBackIcon sx={{ fontSize: 24, color: 'text.primary' }} />
			</IconButton>
			<Avatar
				sx={{ width: 27, height: 27, mr: '6px' }}
				alt="PT.Clean Indonesia"
				src={avatar}
				// src="https://s3-alpha-sig.figma.com/img/ffa6/5d00/1f9da0c00bce4d9a2e596c1d714542b0?Expires=1664150400&Signature=b42MS1h4gD~FhCRBuQgy~VH3yZjHHwAAcmOBitmNxniUHmmqrK1-ifd7TbYiFRvP2qLbBve4zJ0-6qTvo11QbNIW4i0h0v5ND3ZInhgZJFdRSkRodHd5-OuD-vyzd2qhFjjbxpz4HsM0HjU3tf7Gid9Ukxxs9EkKgbojSki~p2seMUp5Pofdm9JQhMxgM3Xsy9n82DZff2KZCqUXMhBnf0pAE5iCGLI2yGBOXhqUDtinjRG7x8c8w~Gr4b599bl2cFcQW3IqxgN6KXxWvGeDwjkNN9YGVgt-GGnithinaBUbgrqON2ISL2p1XlFikx6c9evdQmgrILRKghojQIhV5A__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
			/>
			{loading ? <Skeleton>{titleText}</Skeleton> : titleText}
		</>
	)
}

export default CompanyLeftToolbar
