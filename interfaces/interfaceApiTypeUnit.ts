export interface ITypeUnitGalleryPostBody {
	gallery_id: string
	gallery_type: string
	gallery_url: string
	id?: string
}

export interface ITypeUnitDocumentPostBody {
	document_id: string
	document_url: string
	master_document_type_id: string
	id?: string
}

export interface ITypeUnitSpecPostBody {
	number_of_bathroom?: number
	number_of_bedroom?: number
	building_area?: number
	floor_level?: number
	land_area?: number
	id?: string
}

export interface ITypeUnitClusterPostBody {
	cluster_name: string
	id?: string
}

export interface ITypeUnitGet {
	attribute1: null
	attribute2: null
	attribute3: null
	attribute4: null
	attribute5: null
	created_at: string
	cash_bonus: number
	fee_agent: number
	// developer_project_data: null
	developer_project_data_id: string
	id: string
	image_thumbnail_id: string
	image_thumbnail_url: string
	location: string
	maximum_installment: number
	maximum_price: number
	minimum_installment: number
	minimum_price: number
	// optional_data_cluster: null
	// optional_data_cluster_id: '1df859a3-8729-475e-94e5-d68af4d9e6f9'
	sort: number
	type_unit_code: string
	type_unit_name: string
	// unit_spec_data: null
	// unit_type_gallery_data: null
	updated_at: string
	sum_of_unit_block?: { sum_of_block?: number; sum_of_block_sold?: number }
	unit_type_gallery_data?: ITypeUnitGalleryPostBody[]
	unit_spec_data?: ITypeUnitSpecPostBody
	optional_data_cluster_id?: string
	optional_data_cluster?: ITypeUnitClusterPostBody
	data_type_unit_support_documents?: ITypeUnitDocumentPostBody[]
	plot_plan_id?:string
	plot_plan_url?:string
}

export interface ITypeUnitPostBody {
	image_thumbnail_id?: string
	image_thumbnail_url?: string
	type_unit_name?: string
	location?: string
	optional_data_cluster_id?: string
	unit_spec_data?: ITypeUnitSpecPostBody
	data_type_unit_support_documents?: ITypeUnitDocumentPostBody[]
	cash_bonus?: number
	fee_agent?: number
	unit_type_gallery_data?: ITypeUnitGalleryPostBody[]
	developer_project_data_id?: string
	plot_plan_id?:string
	plot_plan_url?:string
}
