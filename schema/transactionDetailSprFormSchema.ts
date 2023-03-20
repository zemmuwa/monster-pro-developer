import { IDocumentTypeGet } from '../interfaces/interfaceApiDocumentType'
import * as yup from 'yup'
export type TransactionDetailSprFormValues = {
	document: { url: string | undefined; id: string | undefined }
}
const transactionDetailSprFormSchema = yup
	.object({
		document: yup
			.object()
			.shape({
				id: yup.string().required('Wajib diisi'),
			})
			.typeError('Wajib diisi'),
	})
	.required()

export default transactionDetailSprFormSchema
