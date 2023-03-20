import { AlertColor } from '@mui/material/Alert'
import React, { createContext, PropsWithChildren, useMemo, useRef } from 'react'
import DefaultSnackbar, {
	RefDefaultSnackbar,
} from '../components/Snackbar/DefaultSnackbar'
export const ToastProviderContext = createContext({
	openToast: (value: boolean, variant: AlertColor, label: string) => {},
})
function ToastProvider({ children }: PropsWithChildren) {
	const snackbar = useRef<RefDefaultSnackbar>(null)
	const openToast = useMemo(
		() => ({
			openToast: (value: boolean, variant: AlertColor, label: string) => {
				snackbar.current?.setOpen(value, variant, label)
			},
		}),
		[]
	)
	return (
		<ToastProviderContext.Provider value={openToast}>
			<>
				<DefaultSnackbar ref={snackbar} />
				{children}
			</>
		</ToastProviderContext.Provider>
	)
}

export default ToastProvider
