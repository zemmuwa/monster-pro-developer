import { IDocumentTypeGet } from '../interfaces/interfaceApiDocumentType'
import * as yup from 'yup'
export type TransactionDetailBuyerFormValues = {
	buyerDoc: (IDocumentTypeGet | null)[]
}
const transactionDetailBuyerFormSchema = yup
	.object({
		buyerDoc: yup
			.array()
			.of(
				yup
					.object()
					.shape({
						id: yup.string().required('Wajib diisi'),
					})
					.typeError('Wajib diisi')
			)
			.min(1, 'Minimal 1 opsi terisi')
			.typeError('Minimal 1 opsi terisi')
			.required('Minimal 1 opsi terisi')
			.test('unique', 'Tidak boleh ada data yg sama', (value) => {
				const ids = value?.map((obj) => obj.id)
				const set = new Set(ids)
				return !(set.size < (value?.length ?? 0))
			}),
	})
	.required()

export default transactionDetailBuyerFormSchema
