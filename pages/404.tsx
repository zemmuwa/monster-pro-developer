import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import React from 'react'
import Link from '@mui/material/Link'

function NotFound() {
	return (
		<Stack>
			<Box width={'100%'}>
				<Image
					src="/assets/not-found-bg.png"
					alt="Monster Logo"
					layout="fill"
					width={5046}
					height={4000}
				/>
			</Box>
			<Stack width="100%" height="100%" position="absolute" alignItems="center">
				<Box width={'40%'}>
					<Image
						src="/assets/not-found-illustration.png"
						alt="Monster Logo"
						layout="responsive"
						width={5046}
						height={4000}
					/>
				</Box>
				<Stack alignItems="center" mt={2}>
					<Typography variant="h1">Uppss!!</Typography>
					<Typography variant="h5" fontWeight={400}>
						Jangan khawatir, Anda hanya tersesat :(
					</Typography>
					<Typography variant="h5" fontWeight={400}>
						Kami sarankan ketik ulang URL atau kembali ke{' '}
						<Link noWrap color="#317DFF" variant="h5" href={'/'}>
							homepage
						</Link>
					</Typography>
				</Stack>
			</Stack>
		</Stack>
	)
}

export default NotFound
