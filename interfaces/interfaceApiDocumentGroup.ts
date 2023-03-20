import { IDocumentTypeGet } from './interfaceApiDocumentType'

export interface IDocumentGroupGet {
	id: string
	sort: number
	created_at: Date
	updated_at: Date
	group_name: string
	code: string
	active: boolean
	master_document_type: IDocumentTypeGet[]
}

export interface IDocumentGroupPostBody {
	code: string
	active: boolean
	group_name: string
	master_document_type: IDocumentTypeGet[]
}

export interface IDocumentGroupPutBody {
	code?: string
	active?: boolean
	group_name?: string
	master_document_type?: IDocumentTypeGet[]
}
