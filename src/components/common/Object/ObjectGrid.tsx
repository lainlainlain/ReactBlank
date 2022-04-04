import React, { Component } from 'react'
import { Button, Space, Popconfirm, message, Carousel, Popover } from 'antd'
import { ITbl, ITblFld } from '../../../entities/Tbl'
import { DataGrid } from 'devextreme-react'
import { FilterRow, HeaderFilter, Paging, Pager, ColumnFixing, Column, Selection, Lookup } from 'devextreme-react/data-grid'
import { PlusOutlined, EditOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { requestTblRowDelete } from '../../../actions/objectActions'
import ObjectAddEdit from '../../common/Object/ObjectAddEdit'
import { siteUrl } from '../../../constants/constants'

const info = (text: string) => {
    message.info(text);
};

type PropsType = {
    exportName?: string
    editMode: boolean
    tblCode: string
    tbl: ITbl
    sprs: ITbl[]
    getTbl: () => void
}

type StateType = {
    editMode: boolean
    isCreateEdit: boolean
    isCreatePopupVisible: boolean
    selectedRowKey: number | null
    editData: any
    keyfield: string
}

export default class ObjectGrid extends Component<PropsType, StateType> {
    constructor (props: PropsType) {
        super(props)

        let keyfield = 'code'

        if (this.props.tbl.parms.keyfield) {
            keyfield = this.props.tbl.parms.keyfield
        }

        this.state = {
            editMode: true,
            isCreateEdit: false,
            isCreatePopupVisible: false,
            selectedRowKey: null,
            editData: null,
            keyfield
        }
    }

    componentDidMount() {        
        let keyfield = 'code'
        let editMode = this.props.editMode
        debugger
        if (this.props.tbl.parms.read_only && this.props.tbl.parms.read_only === true) {
            editMode = false
        }

        if (this.props.tbl.parms.keyfield) {
            keyfield = this.props.tbl.parms.keyfield
        }

        this.setState({
            keyfield,
            editMode,
            isCreateEdit: false,
            isCreatePopupVisible: false,
            selectedRowKey: null,
            editData: null
        })
    }

    componentDidUpdate(prevProps: PropsType) {
        if (prevProps.tblCode !== this.props.tblCode) {
            let keyfield = 'code'
            let editMode = this.props.editMode
            debugger
            if (this.props.tbl.parms.read_only && this.props.tbl.parms.read_only === true) {
                editMode = false
            }

            if (this.props.tbl.parms.keyfield) {
                keyfield = this.props.tbl.parms.keyfield
            }

            this.setState({
                keyfield,
                editMode,
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
        if (!this.state.editMode) {
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

    popoverContent = (code: any) => {
      return <div className='common-upload-preview'><img src={siteUrl + '/api/repo/' + code} alt='изображение' /></div>
    }

    columnImages_cellRender = (data:any, fld: string) => {
        let images: any[] = []

        if (data.data && data.data[fld]) {
            images = data.data[fld].map((i:any) => {
                return (
                    <div key={i}>
                        <Popover content={() => this.popoverContent(i)} title={false} key={i}>
                            <div className='common-grid-column-images-item'><img src={siteUrl + '/api/repo/' + i} alt='изображение' /></div>
                        </Popover>
                    </div> 
                )
            })
        }
        
        return (
            <div className='common-grid-column-images'>
                <Carousel>
                    {images}
                </Carousel>
            </div>
        )
    }

    columnFiles_cellRender = (data:any, fld: string) => {
        let files: any[] = []

        if (data.data && data.data[fld]) {
            files = data.data[fld].map((f:any) => {
                return (
                    <a className='common-grid-column-files-item' href={siteUrl + '/api/repo/' + f.code}><FileOutlined />{f.name + f.ext}</a>
                )
            })
        }
        
        return (
            <div className='common-grid-column-files'>
                {files}
            </div>
        )
    }

    getTableHeader = () => {
        let columns: Array<any> = []
        if (this.props.tbl && this.props.tbl.fields !== undefined) {
            this.props.tbl.fields!.filter(f => !f.not_visible).map(fld => {
                
                if (fld.parent === null) {
                    if (!this.props.tbl.fields!.some((d: any) => d.parent === fld.code))
                        columns.push(this.getColumn(fld))
                    else 
                        columns.push(this.getBand(fld))    
                }
            })
        }
        return columns
    }

    getBand = (fld: ITblFld) => {
        let band: any = []

        this.props.tbl.fields!.forEach((child: any) => {
            if (child.parent === fld.code) {
                if (!this.props.tbl.fields!.some((d: any) => d.parent === child.code))
                    band.push(this.getColumn(child))
                else 
                    band.push(this.getBand(child))    
            }
        })

        return <Column caption={fld.name} >
                    {band}
                </Column> 
    }

    getColumn = (fld: ITblFld) => {
        let params: any = {}  

        if (this.props.tbl.parms.field_width) {
            params.width = this.props.tbl.parms.field_width
        }

        if (fld.width)
            params.width = fld.width

        if (fld.frozen) {
            params.fixed = true
            params.fixedPosition = fld.frozen
        }

        switch (fld.type) {
            case 'object':
                const spr = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                const displayExpr = fld.obj_name === null? 'name' : fld.obj_name
                const valueExpr = fld.obj_field === null? 'code' : fld.obj_field
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} cssClass='common-grid-middle' {...params}>
                    <Lookup dataSource={spr!.data} displayExpr={displayExpr} valueExpr={valueExpr}></Lookup>
                </Column>
            case 'object[]':
                const spr2 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                const displayExpr2 = fld.obj_name === null? 'name' : fld.obj_name
                const valueExpr2 = fld.obj_field === null? 'code' : fld.obj_field
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} calculateCellValue={(data: any) => {
                    if (!data[fld.code!] || data[fld.code!].length === 0) {
                        return null
                    } else {
                        let value = ''
                        for(let i = 0; i < data[fld.code!].length; i++) {
                            
                            value += ', ' + spr2!.data.find((s:any) => s[valueExpr2] === data[fld.code!][i])[displayExpr2]
                        }
                        if (value.length > 0) {
                            value = value.substring(2)
                        }

                        return value
                    }
                }} cssClass='common-grid-middle' {...params}>
                </Column>
            case 'grid':
                const spr3 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                const displayExpr3 = fld.obj_name === null? 'name' : fld.obj_name
                const valueExpr3 = fld.obj_field === null? 'code' : fld.obj_field
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} cssClass='common-grid-middle' {...params}>
                    <Lookup dataSource={spr3!.data} displayExpr={displayExpr3} valueExpr={valueExpr3}></Lookup>
                </Column>
            case 'grid[]':
                const spr4 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                const displayExpr4 = fld.obj_name === null? 'name' : fld.obj_name
                const valueExpr4 = fld.obj_field === null? 'code' : fld.obj_field
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} calculateCellValue={(data: any) => {
                    
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
                }} cssClass='common-grid-middle' {...params}>
                </Column>
            case 'datetime':
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} dataType='datetime' cssClass='common-grid-middle' {...params}></Column>
            case 'date':
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} dataType='date' cssClass='common-grid-middle' {...params}></Column>
            case 'time':
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} dataType='datetime' cssClass='common-grid-middle' {...params}></Column>
            case 'byte':
                return
            case 'images':
                return <Column key={fld.code} caption={fld.name} width={'140px'} dataField={fld.code} cellRender={(data:any) => this.columnImages_cellRender(data, fld.code)} cssClass='common-grid-middle' {...params}></Column>
            case 'files':
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} cellRender={(data:any) => this.columnFiles_cellRender(data, fld.code)} cssClass='common-grid-middle' {...params}></Column>
            default:
                return <Column key={fld.code} caption={fld.name} dataField={fld.code} cssClass='common-grid-middle' {...params}></Column>
        }
    }

    render() {

        return (
            <div>
                <div className='m-b-20' hidden={!this.state.editMode}>
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
                
                <DataGrid
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
                    export={{enabled: (this.props.exportName? true : false), fileName: this.props.exportName}}
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
                    {this.getTableHeader()}
                    <Selection
                        mode='single'
                    />
                </DataGrid>

                {this.state.isCreatePopupVisible? <ObjectAddEdit isEdit={this.state.isCreateEdit} editData={this.state.editData} sprs={this.props.sprs} fields={this.props.tbl.fields!} modal_onClose={this.modalCreate_onClose} keyfield={this.props.tbl.parms.keyfield} tblCode={this.props.tblCode} modalTitle={this.state.editData? 'Редактирование элемента' : 'Добавление элемента'} /> : null}
            </div>
        )
    }
}
