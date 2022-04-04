import { DataGrid, DropDownBox, Validator } from 'devextreme-react';
import { Scrolling, Paging, FilterRow, Selection, Column, RequiredRule, Lookup } from 'devextreme-react/data-grid';
import React, { Component } from 'react'
import { requestTbl } from '../../../actions/objectActions';
import { ITbl } from '../../../entities/Tbl';

type PropsType = {
    fld: string
    multiple: boolean
    value: any
    displayExpr: string,
    valueExpr: string
    spr: ITbl,
    setValue: (e: any, field: string, multiple: boolean) => void
    disabled: boolean
    isRequired: boolean
    sprs: ITbl[]
}

type StateType = {
    disableOnChange: boolean
    sprs: ITbl[]
}
export default class DropDownGrid extends Component<PropsType, StateType> {
    
    constructor(props: PropsType) {
        super(props)
        
        this.state = {
            disableOnChange: false,
            sprs: this.props.sprs
        }
    }

    componentDidMount() {
        this.getLostSprs()
    }

    getLostSprs = async () => {
        let sprs = [...this.state.sprs]

        if (this.props.spr.fields) {            
            for (let i = 0; i < this.props.spr.fields.length; i++) {
                const f = this.props.spr.fields[i]
                if (f.obj_code && !this.state.sprs.some(s => s.code === f.obj_code)) {
                    const spr = await requestTbl(f.obj_code)
                    if (spr) {
                        sprs.push(spr)
                    }
                }
            }
        }

        this.setState({sprs})
    }

    dataGridRender = () => {
        let columns: Array<any> = []
        if (this.props.spr && this.props.spr.fields !== undefined) {
            this.props.spr.fields!.filter(f => !f.not_visible).map(fld => {
                switch (fld.type) {
                    case 'object':
                        const spr = this.state.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code}>
                            <Lookup dataSource={spr? spr!.data : []} displayExpr={displayExpr} valueExpr={valueExpr}></Lookup>
                        </Column>)
                    case 'object[]':
                        const spr2 = this.state.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr2 = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr2 = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} calculateCellValue={(data: any) => {
                            if (!data[fld.code!] || data[fld.code!].length === 0) {
                                return null
                            } else {
                                let value = ''
                                for(let i = 0; i < data[fld.code!].length; i++) {
                                    debugger
                                    value += ', ' + (spr2? spr2!.data.find((s:any) => s[valueExpr2] === data[fld.code!][i])[displayExpr2] : '')
                                }
                                if (value.length > 0) {
                                    value = value.substring(2)
                                }

                                return value
                            }
                        }}>
                        </Column>)
                    case 'grid':
                        const spr3 = this.state.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr3 = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr3 = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code}>
                            <Lookup dataSource={spr3? spr3!.data : []} displayExpr={displayExpr3} valueExpr={valueExpr3}></Lookup>
                        </Column>)
                    case 'grid[]':
                        const spr4 = this.state.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                        const displayExpr4 = fld.obj_name === null? 'name' : fld.obj_name
                        const valueExpr4 = fld.obj_field === null? 'code' : fld.obj_field
                        return columns.push(<Column key={fld.code} caption={fld.name} dataField={fld.code} calculateCellValue={(data: any) => {
                            debugger
                            if (!data[fld.code!] || data[fld.code!].length === 0) {
                                return null
                            } else {
                                let value = ''
                                for(let i = 0; i < data[fld.code!].length; i++) {
                                    value += ', ' + (spr4? spr4!.data.find((s:any) => s[valueExpr4] === data[fld.code!][i])[displayExpr4] : '')
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
            <DataGrid
                dataSource={this.props.spr.data}
                hoverStateEnabled={true}
                keyExpr={this.props.valueExpr}
                selectedRowKeys={this.props.value}
                onSelectionChanged={this.dataGrid_onSelectionChanged}
                allowColumnResizing={true}
                columnResizingMode='widget'
                height="100%">
                <Selection mode={this.props.multiple? "multiple" : "single"} />
                <Scrolling />
                <Paging enabled={true} pageSize={10} />
                <FilterRow visible={true} />
                {columns}
            </DataGrid>
        );
    }

    dataGrid_onSelectionChanged = (e:any) => {
        debugger
        this.props.setValue(e, this.props.fld, this.props.multiple)
    }
  

    syncDataGridSelection = (e:any) => {
        debugger
        this.props.setValue(e, this.props.fld, this.props.multiple)
    }

    render() {
        return (
            <DropDownBox value={this.props.value}
            disabled={this.props.disabled}
            deferRendering={false}
            dataSource={this.props.spr.data} displayExpr={this.props.displayExpr} valueExpr={this.props.valueExpr}
            onValueChanged={this.syncDataGridSelection}
            contentRender={this.dataGridRender}
            >
                <Validator>
                    {this.props.isRequired === true? <RequiredRule message='Поле обязательное для заполнения!' /> : null}
                </Validator>
            </DropDownBox>
        )
    }
}
