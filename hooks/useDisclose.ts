import { useState } from 'react'

function useDisclose<T>() {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedData, setSelectedData] = useState<T | undefined>(undefined)

	const open = () => {
		setIsOpen(true)
	}
	const openWithData = (data: T) => {
		setSelectedData(data)
		setIsOpen(true)
	}
	const close = () => {
		setSelectedData(undefined)
		setIsOpen(false)
	}
	return { isOpen, open, openWithData, close, selectedData }
}

export default useDisclose
