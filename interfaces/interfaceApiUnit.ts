export interface IUnitFacilityPostBody {
	id?: string
	master_detail_category_id?: string
	type?: string
}
export interface IUnitBlockPostBody {
	block_name?: string
	block_number?: number
	development_status_id?: string
	id?: string
}
export interface IUnitDataPricePostBody {
	dp_installment_termin?: number | string
	dp_percentage?: number | string
	dp_total?: number | string
	id?: string
	monthly_installment?: number | string
	payment_termin?: number | string
	price_after_dp?: number | string
	type_payment?: 'CASH' | 'INHOUSE' | 'KPR' | string
	unit_nominal?: number | string
	utj_price?: number | string
	ppn?: number
	bphtb?: number
	include_utj?: number
	discount?: number
	unit_nominal_nett?:number
	dp_nett?:number
}
export interface IUnitPostBody {
	master_category_unit_id?: string
	master_certificate_unit_id?: string
	map?: string
	handover_year?: number
	selling_point?: string
	data_type_unit_id?: string
	unit_facility?: IUnitFacilityPostBody[]
	unit_data_price?: IUnitDataPricePostBody[]
	unit_block_data?: IUnitBlockPostBody[]
}

export interface IUnitGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	data_type_unit_id: string
	master_category_unit_id: string
	master_certificate_unit_id: string
	map: string
	handover_year: number
	selling_point: string
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	data_type_unit?: any
	unit_data_price?: any
	unit_facility?: any
	unit_block_data?: any
	master_certificate?: any
}
