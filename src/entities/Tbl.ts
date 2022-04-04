export interface ITbl {
    code: string,
    name: string,
    count: number,
    obj_type: string,
    parms?: any,
    data?: any,
    fields?: Array<ITblFld>
}

export interface ITblFld {
    code: string,
    name: string,
    type: string,
    obj_code: string | null,
    obj_field: string | null,
    obj_name: string | null,
    ord: number,
    is_edit: boolean,
    is_required: boolean,
    not_visible: boolean,
    frozen: string | null,
    width: number | null,
    group: boolean,
    parent: string | null,
    is_band: boolean
}