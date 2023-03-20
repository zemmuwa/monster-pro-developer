import { IAgencyGet } from './interfaceApiAgency'
import { IAgentGet } from './interfaceApiAgent'
import { IBookingGet } from './interfaceApiBooking'
import { IBuyerGet } from './interfaceApiBuyer'
import { IDeveloperGet } from './interfaceApiDeveloper'
import { ILogBookingGet } from './interfaceApiLogBooking'
import { IUnitBlockGet, IUnitBlockPrice } from './interfaceApiUnitBlock'
export interface ITransactionRedeemList {
	id: string
	sort: number
	created_at: string
	updated_at: string
	creator_id?: any
	modifier_id?: any
	developer_payment_schedule_id?: string
	buyer_id: string
	developer_id: string
	agent_id: string
	agency_id: string
	unit_block_data_id: string
	unit_block_price_id: string
	booking_id: string
	redeem_id?: any
	refund_id?: any
	transaction_code: string
	transaction_type: string
	total: number
	payment_gateway_code?: any
	payment_gateway_trx?: any
	payment_gateway_status?: any
	tax?: any
	discount?: any
	payment_gateway_fee?: any
	service_charge_mp?: any
	grand_total?: any
	is_paid?: any
	payment_schedule_due_date?: any
	attribute1?: any
	attribute2?: any
	attribute3?: any
	attribute4?: any
	attribute5?: any
	developer_payment_schedule?: IDeveloperPaymentSchedule
	unit_block_data: IUnitBlockGet
	unit_block_price: IUnitBlockPrice
	developer: IDeveloperGet
	agent: IAgentGet
	agency: IAgencyGet
	booking: IBookingGet
	redeem?: any
	refund?: any
	buyer: IBuyerGet
	last_log_booking: ILogBookingGet
	redeem_status: number
}

interface IDeveloperPaymentSchedule {
	attribute1: any
	attribute2: any
	attribute3: any
	attribute4: any
	attribute5: any
	buyer_status: number
	created_at: string
	creator_id: any
	deadline_payment: string
	developer_detail_transaction: any
	developer_detail_transaction_id: string
	due_date: any
	grand_total: any
	id: string
	installment_amount: number
	is_upload_receipt: number
	modifier_id: any
	payment_gateway_code: any
	payment_gateway_status: any
	payment_gateway_trx: any
	payment_type: string
	redeem_status: number
	service_charge: any
	sort: number
	termin: number
	transaction_payment: any
	transaction_redeem: any
	unit_block_price: any
	unit_block_price_id: any
	updated_at: string
}
