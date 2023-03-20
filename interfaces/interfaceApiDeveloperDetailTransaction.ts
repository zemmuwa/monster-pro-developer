import { IDocumentTypeGet } from './interfaceApiDocumentType'

export interface IDeveloperDetailTransaction {
	id?: string
	sort?: number
	created_at?: string
	updated_at?: string
	creator_id?: any
	modifier_id?: any
	booking_id?: string
	unit_block_price_id?: string
	unit_block_data_id?: string
	nominal?: any
	discount?: any
	other_discount?: any
	tax?: any
	netto_price?: any
	discount_description?: any
	payment_method?: any
	installment_termin?: any
	first_installment_date?: any
	installment_amount?: any
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	booking?: any
	unit_block_data?: any
	unit_block_price?: any
	buyer_transaction_document?: BuyerTransactionDocument[]
	document_schedule?: DocumentSchedule[]
	spr_document?: BuyerTransactionDocument
	additional_price?: number
	additional_price_description?: string
	reduction_price?: number
	reduction_price_description?: string
	dp_nominal_nett?: number
	additional_price_dp: number
	additional_price_dp_description: string
	reduction_price_dp: number
	reduction_price_dp_description: string
	is_generate?:boolean
}

export interface BuyerTransactionDocument {
	id?: string
	sort?: number
	created_at?: string
	updated_at?: string
	creator_id?: any
	modifier_id?: any
	developer_detail_transaction_id?: string
	developer_id?: any
	master_document_type_id?: string
	master_document_id?: string
	master_document_url?: string
	description?: any
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	developer_detail_transaction?: any
	master_document_type_data?: IDocumentTypeGet
	is_valid?: boolean | null
}

export interface DocumentSchedule {
	id: string
	sort: number
	created_at: string
	updated_at: string
	creator_id?: any
	modifier_id?: any
	developer_detail_transaction_id: string
	developer_id?: any
	master_document_type_id: string
	master_document_id: string
	master_document_url: string
	document_date?: any
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	developer_detail_transaction?: any
	master_document_type_data: IDocumentTypeGet
}
