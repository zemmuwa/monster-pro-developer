import * as yup from 'yup'
export type TransactionRejectFormValues = {
	reason: string
}

const transactionRejectFormSchema = yup
	.object({
		reason: yup.string().required('Wajib diisi'),
	})
	.required()

export default transactionRejectFormSchema
