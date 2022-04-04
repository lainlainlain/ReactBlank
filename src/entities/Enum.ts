export interface IEnum {
    code: string
    name: string
    objType: string
    fields: Array<any>
    data: Array<IEnumItem>
}

export interface IEnumItem {
    code: string
    name: string
}