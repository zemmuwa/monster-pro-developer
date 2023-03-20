export interface Content {
	icon_url?: any
	route_url: string
	subtitle: string
	title: string
	detail?:string
}

export interface InboxCategory {
	id: string
	sort: number
	created_at: string
	updated_at: string
	code: string
	category_name: string
	icon_id: string
	icon_url: string
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
}

export interface IInboxGet {
	id: string
	sort: number
	created_at: string
	updated_at: string
	inbox_category_id: string
	user_id: string
	user_role: string
	read_at?: any
	content: Content
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	inbox_category: InboxCategory
}
