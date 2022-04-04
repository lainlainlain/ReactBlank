import { Button, message, Popconfirm, Space } from 'antd'
import { TreeList } from 'devextreme-react'
import { Column, ColumnFixing, FilterRow, HeaderFilter, Lookup, Pager, Paging, Selection } from 'devextreme-react/tree-list'
import React, { Component } from 'react'
import { requestTblRowDelete } from '../../../actions/objectActions'
import { ITbl } from '../../../entities/Tbl'
import ObjectAddEdit from './ObjectAddEdit'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';


const info = (text: string) => {
    message.info(text);
};

type PropsType = {
    exportName?: string
    editMode: boolean
    tblCode: string
    tbl: ITbl
    sprs: ITbl[]
    parentFld: string
    getTbl: () => void
}

type StateType = {
    isCreateEdit: boolean
    isCreatePopupVisible: boolean
    selectedRowKey: number | null
    editData: any
    keyfield: string
}

export default class ObjectTree extends Component<PropsType, StateType> {
    constructor (props: PropsType) {
        super(props)

        let keyfield = 'code'

        if (this.props.tbl.parms.keyfield) {
            keyfield = this.props.tbl.parms.keyfield
        }

        this.state = {
            isCreateEdit: false,
            isCreatePopupVisible: false,
            selectedRowKey: null,
            editData: null,
            keyfield
        }
    }

    componentDidUpdate(prevProps: PropsType) {
        if (prevProps.tblCode !== this.props.tblCode) {
            let keyfield = 'code'

            if (this.props.tbl.parms.keyfield) {
                keyfield = this.props.tbl.parms.keyfield
            }

            this.setState({
                keyfield,
                isCreateEdit: false,
                isCreatePopupVisible: false,
                selectedRowKey: null,
                editData: null
            })
        }
    }

    dataGrid_onSelectionChanged = (e: any) => {
        if (e.selectedRowKeys && e.selectedRowKeys.length > 0) {
            this.setState({selectedRowKey: e.selectedRowKeys[0]})
        }
    }

    dataGrid_onRowDblClick = (e: any) => {
        if (!this.props.editMode) {
            return
        }

        const editData = this.props.tbl.data.find((u: any) => u[this.state.keyfield] === e.key)
        this.setState({selectedRowKey: e.key, isCreatePopupVisible: true, editData: editData, isCreateEdit: true })
    }

    btnCreate_onClick = (e: any) => {
        let editData = null
        let isCreateEdit = false

        if (e.currentTarget.dataset.type === 'edit') {
            editData = this.props.tbl.data.find((u: any) => u[this.state.keyfield] === this.state.selectedRowKey)
            isCreateEdit = true
        } 

        this.setState({ isCreatePopupVisible: true, editData: editData, isCreateEdit })
    }

    btnDelete_onConfirm = async () => {
        const result = await requestTblRowDelete(this.props.tblCode, this.state.selectedRowKey)
        info(result)
        this.props.getTbl()
    }

    modalCreate_onClose = () => {
        this.setState({isCreatePopupVisible: false })
        this.props.getTbl()
    }

    render() {
        let columns: Array<any> = []
        if (this.props.tbl && this.props.tbl.fields !== undefined) {
            
            this.props.tbl.fields!.filter(f => !f.not_visible).map(fld => {
                switch (fld.type) {
                    case 'object':
                        const spr = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code}>
                            <Lookup dataSource={spr!.data} displayExpr={displayExpr} valueExpr={valueExpr}></Lookup>
                        </Column>)
                    case 'object[]':
                        const spr2 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr2 = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr2 = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} calculateCellValue={(data: any) => {
                            if (!data[fld.code!] || data[fld.code!].length === 0) {
                                return null
                            } else {
                                let value = ''
                                for(let i = 0; i < data[fld.code!].length; i++) {
                                    debugger
                                    value += ', ' + spr2!.data.find((s:any) => s[valueExpr2] === data[fld.code!][i])[displayExpr2]
                                }
                                if (value.length > 0) {
                                    value = value.substring(2)
                                }

                                return value
                            }
                        }}>
                        </Column>)
                    case 'grid':
                        const spr3 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr3 = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr3 = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code}>
                            <Lookup dataSource={spr3!.data} displayExpr={displayExpr3} valueExpr={valueExpr3}></Lookup>
                        </Column>)
                    case 'grid[]':
                        const spr4 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr4 = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr4 = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} calculateCellValue={(data: any) => {
                            debugger
                            if (!data[fld.code!] || data[fld.code!].length === 0) {
                                return null
                            } else {
                                let value = ''
                                for(let i = 0; i < data[fld.code!].length; i++) {
                                    value += ', ' + spr4!.data.find((s:any) => s[valueExpr4] === data[fld.code!][i])[displayExpr4]
                                }
                                if (value.length > 0) {
                                    value = value.substring(2)
                                }

                                return value
                            }
                        }}>
                        </Column>)
                    case 'datetime':
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} dataType='datetime'></Column>)
                    case 'date':
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} dataType='date'></Column>)
                    case 'time':
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} dataType='datetime'></Column>)
                    default:
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code}></Column>)
                }
            })
        }

        return (
            <div>
                <div className='m-b-20' hidden={!this.props.editMode}>
                    <Space>
                        <Button type='primary' shape='round' data-type='create' onClick={this.btnCreate_onClick} icon={<PlusOutlined />}>Создать</Button>
                        <Button type='default' shape='round' data-type='edit' onClick={this.btnCreate_onClick} disabled={(this.state.selectedRowKey === null)} icon={<EditOutlined />}>Редактировать</Button>
                        <Popconfirm
                            title="Вы уверены что хотите удалить элемент?"
                            onConfirm={this.btnDelete_onConfirm}
                            okText="Да"
                            cancelText="Нет"
                            disabled={(this.state.selectedRowKey === null)}
                        >
                            <Button type='default' shape='round' data-type='delete' disabled={(this.state.selectedRowKey === null)} icon={<DeleteOutlined />}>Удалить</Button>
                        </Popconfirm>
                    </Space>
                </div>

                <TreeList
                    className='m-b-20 object-grid'
                    dataSource={this.props.tbl?.data}
                    showBorders={true}
                    hoverStateEnabled={true}
                    width='100%'
                    keyExpr={this.state.keyfield}
                    allowColumnReordering={true}
                    allowColumnResizing={true}
                    columnResizingMode='widget'
                    onSelectionChanged={this.dataGrid_onSelectionChanged}
                    onRowDblClick={this.dataGrid_onRowDblClick}
                    parentIdExpr={this.props.parentFld}
                    rowAlternationEnabled={true}
                >
                    <FilterRow visible={true} />
                    <HeaderFilter visible={true} />
                    <Paging enabled={true} defaultPageSize={20} />
                    <Pager
                        showPageSizeSelector={true}
                        allowedPageSizes={[20, 50, 100]}
                        showInfo={true}
                        visible={true} />
                    <ColumnFixing enabled={true} />
                    {columns}
                    <Selection
                        mode='single'
                    />
                </TreeList>

                {this.state.isCreatePopupVisible? <ObjectAddEdit isEdit={this.state.isCreateEdit} editData={this.state.editData} sprs={this.props.sprs} fields={this.props.tbl.fields!} modal_onClose={this.modalCreate_onClose} keyfield={this.props.tbl.parms.keyfield} tblCode={this.props.tblCode} modalTitle={this.state.editData? 'Редактирование элемента' : 'Добавление элемента'} /> : null}
            </div>
        )
    }
}
