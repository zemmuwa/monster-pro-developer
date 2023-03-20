import { IDocumentTypeGet } from "./interfaceApiDocumentType";

    

    export interface ILogBuyerDoc {
        id: string;
        sort: number;
        created_at: string;
        updated_at: string;
        creator_id?: any;
        modifier_id?: any;
        developer_detail_transaction_id: string;
        is_valid: boolean;
        master_document_type_id: string;
        master_document_id: string;
        master_document_url: string;
        description: string;
        attribute1?: any;
        attribute2?: any;
        attribute3?: any;
        attribute4?: any;
        attribute5?: any;
        developer_detail_transaction?: any;
        master_document_type_data: IDocumentTypeGet;
    }
