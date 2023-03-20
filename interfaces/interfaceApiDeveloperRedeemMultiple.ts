export interface IDeveloperRedeemMultiplePostBody {
	file_redeem?: IDeveloperRedeemMultipleFileRedeemPostBody[]
	is_paid?: boolean
	is_upload?: boolean
	transaction_id?: string
	id?: string
}
export interface IDeveloperRedeemMultipleGet {
	attribute1: null
	attribute2: null
	attribute3: null
	attribute4: null
	attribute5: null
	created_at: string
	creator_id: string
	id: string
	is_paid: boolean
	is_upload: boolean
	modifier_id: string
	sort: number
	transaction_id: string
	updated_at: string
	file_redeem: IDeveloperRedeemMultipleFileRedeemPostBody[]
}

interface IDeveloperRedeemMultipleFileRedeemPostBody {
	created_at?: string
	creator_id?: string
	description?: string
	developer_transaction_redeem?: string
	id?: string
	master_document_id?: string
	master_document_url?: string
	modifier_id?: string
	sort?: number
	transaction?: string
	updated_at?: string
}
