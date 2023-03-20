import Alert, { AlertColor } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import React, {
	ForwardedRef,
	forwardRef,
	useImperativeHandle,
	useState,
} from 'react'
export interface RefDefaultSnackbar {
	setOpen: (val: boolean, variant: AlertColor, label: string) => void
}
interface PropsDefaultSnackbar {}

function DefaultSnackbar(
	{}: PropsDefaultSnackbar,
	ref: ForwardedRef<RefDefaultSnackbar>
) {
	const [open, setOpen] = useState(false)
	const [variant, setVariant] = useState<AlertColor>('error')
	const [label, setLabel] = useState('')
	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setOpen(false)
	}
	useImperativeHandle(ref, () => ({
		setOpen(val, variant, label) {
			setLabel(label)
			setVariant(variant)
			setOpen(val)
		},
	}))
	return (
		<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
			<Alert onClose={handleClose} severity={variant} sx={{ width: '100%' }}>
				{label}
			</Alert>
		</Snackbar>
	)
}

export default forwardRef(DefaultSnackbar)
