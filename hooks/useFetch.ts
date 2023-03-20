import React, { useEffect, useRef, useState } from 'react'
import { IApiResponseList } from '../interfaces/interfaceApiResponse'
import ConsumeApi from '../utils/consume-api/ConsumeApi'

const defaultMeta: IApiResponseList<undefined> = {
	first: false,
	items: undefined,
	last: false,
	max_page: 0,
	page: 0,
	size: 0,
	total: 0,
	total_pages: 0,
	visible: 0,
}

function useFetch<T>(
	endpointArg: string,
	servicePathArg?: string,
	additional?: { limit: number; mode: 'next' | 'next-prev' }
) {
	const [data, setData] = useState<T[]>([])
	const [dataSingle, setDataSingle] = useState<T | undefined>(undefined)
	const [meta, setMeta] = useState<IApiResponseList<undefined>>(defaultMeta)
	const page = useRef(0)
	const isUpdate = useRef(true)
	const [loading, setLoading] = useState(false)
	const [isNextPage, setIsNextPage] = useState(false)

	const getAll = async (
		params?: {},
		option?: { nextPage?: boolean; toPage?: number }
	) => {
		if (option?.nextPage && !isNextPage) {
			return
		}
		setLoading(true)
		if (!option?.nextPage) {
			page.current = 0
			setMeta(defaultMeta)
			setData([])
		}
		const endpoint = endpointArg.includes('?') ? endpointArg : `${endpointArg}?`
		let json = await ConsumeApi<IApiResponseList<T[]>>(
			endpoint +
				new URLSearchParams(params).toString() +
				(additional?.limit
					? `&page=${option?.toPage ? option?.toPage - 1 : page.current}&size=${
							additional.limit
					  }`
					: ''),
			'GET',
			undefined,
			servicePathArg
		)
		if ('items' in json && isUpdate) {
			const resData = json as IApiResponseList<T[]>
			if (additional?.mode == 'next') {
				page.current += 1
				setData((v) => [...v, ...(resData.items ?? [])])
			} else setData(resData.items)
			setMeta({ ...resData, items: undefined })
		}
		setLoading(false)
	}

	const getOne = async (id?: string) => {
		setLoading(true)
		let json = await ConsumeApi<T>(
			endpointArg + (id ?? ''),
			'GET',
			undefined,
			servicePathArg
		)
		if (!('message' in json) && isUpdate) {
			setDataSingle(json)
		}
		setLoading(false)
		return json
	}

	useEffect(() => {
		if (meta.total > data.length) setIsNextPage(true)
		else setIsNextPage(false)
	}, [meta, data])
	useEffect(() => {
		isUpdate.current = true
		return () => {
			isUpdate.current = false
		}
	}, [])

	return {
		data,
		dataSingle,
		getAll,
		getOne,
		loading,
		setData,
		isNextPage,
		setDataSingle,
		meta,
	}
}

export default useFetch
