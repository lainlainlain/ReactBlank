import { api } from "../api/api"
import { ITblFld, ITbl } from "../entities/Tbl"

export type RequestTblOptions = {
    where?: string,
    orderby?: string,
    page?: number,
    page_size?: number
}

export const requestTblRowAdd = (tbl: string, dataRow: any) => {
    const request = api.addObject(tbl, dataRow)
    return request
}


export const requestTblRowEdit = (tbl: string, dataRow: any) => {
    const request = api.editObject(tbl, dataRow)
    return request
}

export const requestTblRowDelete = (tbl: string, id: any) => {
    const request = api.deleteObject(tbl, id)
    return request
}

export const requestTbl = (tbl: string) => {
    return api.getObjects(tbl)
}

export const requestTblDataRow = (tbl: string, code: string) => {
    return api.getObjectDataRow(tbl, code)
}

export const requestTblFields = (tbl: string) => {
    return api.getObjectFields(tbl)
}

export const requestTblWithOptions = (tbl: string, options: RequestTblOptions) => {
    return api.getObjectsWithOptions(tbl, options)
}

export const requestTblSprs = async (fields: ITblFld[]) => {
    let sprs: ITbl[] = []

    for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
        if (field.type.startsWith('object') && !sprs.some(s => s.code === field.obj_code)) {
            const responseSpr: ITbl = await api.getObjects(field.obj_code!)
            sprs.push(responseSpr)
        }
        if (field.type.startsWith('grid') && !sprs.some(s => s.code === field.obj_code)) {
            const responseSpr: ITbl = await api.getObjects(field.obj_code!)
            sprs.push(responseSpr)
        }
    }

    return sprs
}

export const requestAddRepoFile = (obj: string, obj_code: string, file: File) => {
    return api.addRepoFile(obj, obj_code, file)
}

export const requestRepoFile = (code: string) => {
    return api.getRepoFile(code)
}

export const requestDeleteRepoFile = (code: string) => {
    return api.deleteRepoFile(code)
}