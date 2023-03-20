import * as yup from 'yup'
export type TransactionPaymentFormValues = {
	date: string
	add: string
	addDesc: string
	addDp: string
	addDpDesc: string
	sub: string
	subDesc: string
	subDp: string
	subDpDesc: string
	priceNet: string
	dpNet: string
	monthlyInstallment: string
}

const transactionPaymentFormSchema = yup
	.object({
		// reason: yup.string().required('Wajib diisi'),
	})
	.required()

export default transactionPaymentFormSchema
