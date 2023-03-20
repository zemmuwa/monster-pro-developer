import { IAgencyGet } from './interfaceApiAgency'
import { IAgentGet } from './interfaceApiAgent'
import { IBuyerGet } from './interfaceApiBuyer'
import { IDeveloperGet } from './interfaceApiDeveloper'
import { IDeveloperDetailTransaction } from './interfaceApiDeveloperDetailTransaction'
import { IGlobalStatusDetailGet } from './interfaceApiGlobalStatusDetail'
import { ITransactionGet } from './interfaceApiTransaction'
import { IUnitBlockGet, IUnitBlockPrice } from './interfaceApiUnitBlock'

export interface LogBooking {
	id: string
	sort: number
	creator_id?: any
	modifier_id?: any
	booking_id: string
	transaction_id: string
	transaction_status_id: string
	activities_status_id: string
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	booking?: any
	transaction?: any
	transaction_status?: any
	activities_status?: any
	created_at?: Date
	updated_at?: Date
}

export interface LastLogBooking {
	id: string
	sort: number
	creator_id?: any
	modifier_id?: any
	booking_id: string
	transaction_id?: any
	transaction_status_id: string
	activities_status_id: string
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	booking?: any
	transaction?: any
	transaction_status?: any
	activities_status: IGlobalStatusDetailGet
	deadline_sla?: string
	desc?: string
}

interface IPersonalDataBooking {
	id?: string
	sort?: number
	created_at?: string
	updated_at?: string
	creator_id?: any
	modifier_id?: any
	channel_id?: string
	booking_id?: string
	name?: string
	ktp_number?: string
	phone?: string
	address?: string
	booking?: string
}

export interface IBookingGet {
	id?: string
	sort?: number
	created_at?: string
	updated_at?: string
	creator_id?: any
	modifier_id?: any
	buyer_id?: string
	developer_id?: string
	agent_id?: string
	agency_id?: string
	unit_block_data_id?: string
	unit_block_price_id?: string
	channel_id?: string
	total?: number
	booking_date?: string
	booking_code?: string
	deadline_payment?: string
	payment_gateway_status?: boolean
	status_dev?: boolean
	status_buyer?: boolean
	status_spr?: boolean
	desc_cancel_dev?: string
	desc_cancel_buyer?: string
	booking_is_paid?: boolean
	booking_is_refund?: boolean
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	developer?: IDeveloperGet
	agent?: IAgentGet
	agency?: IAgencyGet
	unit_block_data?: IUnitBlockGet
	unit_block_price?: IUnitBlockPrice
	log_booking?: LogBooking[]
	last_log_booking?: LastLogBooking
	buyer?: IBuyerGet
	developer_detail_transaction?: IDeveloperDetailTransaction
	transaction?: ITransactionGet
	personal_data_booking?: IPersonalDataBooking
}
