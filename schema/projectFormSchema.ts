import * as yup from 'yup'
import { IBankGet } from '../interfaces/interfaceApiBank'
import { ICityGet } from '../interfaces/interfaceApiCity'
import { IDetailCategoryGet } from '../interfaces/interfaceApiDetailCategory'
import { IDistrictGet } from '../interfaces/interfaceApiDistrict'
import {
	IProjectClusterPostBody,
	IProjectDocumentPostBody,
} from '../interfaces/interfaceApiProject'
import { IProvinceGet } from '../interfaces/interfaceApiProvince'
export type ProjectFormValues = {
	project_cover?: { url: string | undefined; id: string | undefined }
	project_name: string
	project_category?: IDetailCategoryGet
	optional_data_cluster: IProjectClusterPostBody[]
	project_legal_document: IProjectDocumentPostBody[]
	master_province?: IProvinceGet
	master_city?: ICityGet
	master_district?: IDistrictGet
	project_address: string
	bank_cooperation: IBankGet[]
	project_support_document: IProjectDocumentPostBody[]
	project_gallery: {
		url: string | undefined
		id: string | undefined
		gallery_type: string | undefined
		id_gallery?: string
	}[]
}

const projectFormSchema = yup
	.object({
		project_cover: yup.object().shape({
			id: yup.string().required('Wajib diisi'),
		}),
		project_name: yup.string().required('Wajib diisi'),
		project_category: yup.object().shape({
			id: yup.string().required('Wajib diisi'),
		}),
		optional_data_cluster: yup.array().of(
			yup.object().shape({
				cluster_name: yup.string().required('Wajib diisi'),
			})
		),
		project_legal_document: yup.array().of(
			yup.object().shape({
				document_id: yup.string().required('Wajib diisi'),
			})
		),
		master_province: yup.object().shape({
			id: yup.string().required('Wajib diisi'),
		}),
		master_city: yup.object().shape({
			id: yup.string().required('Wajib diisi'),
		}),
		master_district: yup.object().shape({
			id: yup.string().required('Wajib diisi'),
		}),
		project_address: yup
			.string()
			.required('Wajib diisi')
			.min(7, 'Minimal 7 karakter')
			.max(150, 'Maksimal 150 karakter'),
		bank_cooperation: yup
			.array()
			.min(1, 'Minimal 1 bank terisi')
			.required('Minimal 1 bank terisi'),
		project_support_document: yup.array().of(
			yup.object().shape({
				document_id: yup.string().required('Wajib diisi'),
			})
		),
		project_gallery: yup.array().of(
			yup.object().shape({
				id: yup.string().required('Wajib diisi'),
				gallery_type: yup.string().nullable().required('Wajib diisi'),
			})
		),
	})
	.required()
export default projectFormSchema
