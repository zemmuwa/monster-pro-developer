import * as yup from 'yup'
import {
	ITypeUnitClusterPostBody,
	ITypeUnitDocumentPostBody,
} from '../interfaces/interfaceApiTypeUnit'
export type TypeUnitFormValues = {
	image_thumbnail?: { url: string | undefined; id: string | undefined }
	type_unit_name: string
	location: string
	optional_data_cluster?: ITypeUnitClusterPostBody
	land_area: string
	building_area: string
	number_of_bedroom: string
	number_of_bathroom: string
	floor_level: string
	id_spec: string
	blt: string
	fee_agent: string
	type_unit_support_document: ITypeUnitDocumentPostBody[]
	type_unit_gallery: {
		url: string | undefined
		id: string | undefined
		gallery_type: string | undefined
		id_gallery?: string
	}[]
	plot_plan?: { url: string | undefined; id: string | undefined }
}

const typeUnitFormSchema = yup
	.object({
		image_thumbnail: yup.object().shape({
			id: yup.string().required('Wajib diisi'),
		}),
		type_unit_name: yup.string().required('Wajib diisi'),
		location: yup.string().required('Wajib diisi'),
		// optional_data_cluster: yup.object().shape({
		// 	id: yup.string().required('Wajib diisi'),
		// }),
		land_area: yup
			.string()
			.required('Wajib diisi')
			.test(
				'Is positive?',
				'Harus lebih dari 0',
				(value) => Number(value ?? 0) > 0
			),
		building_area: yup
			.string()
			.required('Wajib diisi')
			.test(
				'Is positive?',
				'Harus lebih dari 0',
				(value) => Number(value ?? 0) > 0
			),
		number_of_bedroom: yup
			.string()
			.required('Wajib diisi')
			.test(
				'Is positive?',
				'Harus lebih dari 0',
				(value) => Number(value ?? 0) > 0
			),
		number_of_bathroom: yup
			.string()
			.required('Wajib diisi')
			.test(
				'Is positive?',
				'Harus lebih dari 0',
				(value) => Number(value ?? 0) > 0
			),
		floor_level: yup
			.string()
			.required('Wajib diisi')
			.test(
				'Is positive?',
				'Harus lebih dari 0',
				(value) => Number(value ?? 0) > 0
			),
		// blt: yup.string().required('Wajib diisi'),
		// fee_agent: yup.string().required('Wajib diisi'),
		type_unit_support_document: yup.array().of(
			yup.object().shape({
				document_id: yup.string().required('Wajib diisi'),
			})
		),
		type_unit_gallery: yup.array().of(
			yup.object().shape({
				id: yup.string().required('Wajib diisi'),
				gallery_type: yup.string().required('Wajib diisi'),
			})
		),
		plot_plan: yup.object().shape({
			id: yup.string().nullable().required('Wajib diisi'),
		}),
	})
	.required()
export default typeUnitFormSchema
