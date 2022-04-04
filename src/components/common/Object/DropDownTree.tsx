import React, { Component } from 'react'
import { RequiredRule } from 'devextreme-react/form'
import { ITbl } from '../../../entities/Tbl'
import { TreeView, Validator, DropDownBox } from 'devextreme-react';

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
}

type StateType = {
    treeValue: any
    disableOnChange: boolean
}

export default class DropDownTree extends Component<PropsType, StateType> {
    private treeView: TreeView | null
    constructor(props: PropsType) {
        super(props)
        
        let treeValue: any[] = []
        if (this.props.value) {
            if (this.props.multiple) {
                treeValue = this.props.value
            } else {
                treeValue.push(this.props.value)
            }
        }

        this.state = {
            treeValue,
            disableOnChange: false
        }

        this.treeView = null

        this.treeViewRender = this.treeViewRender.bind(this)
        this.syncTreeViewSelection = this.syncTreeViewSelection.bind(this)
        this.treeView_onContentReady = this.treeView_onContentReady.bind(this)
    }

    componentDidUpdate(prevProps: PropsType) {
        if(prevProps.value !== this.props.value) {
            let treeValue: any[] = []
            if (this.props.multiple) {
                treeValue = this.props.value
            } else {
                treeValue.push(this.props.value)
            }
            this.setState({treeValue})
        }
    }

    syncTreeViewSelection(e: any) {
        let treeView = (e.component.selectItem && e.component) || (this.treeView && this.treeView.instance);

        if (treeView) {
            if (e.value === null) {
                treeView.unselectAll();
            }
            else {
                let values = e.value || this.state.treeValue;
                
                values && values.forEach(function (value: any) {
                    treeView.selectItem(value);
                });
            }
        }

        if (e.value !== undefined) {
            this.setState({
                treeValue: e.value
            });
        }
    }

    treeViewRender() {
        
        return (
            <TreeView dataSource={this.props.spr.data}
                ref={(ref) => this.treeView = ref}
                dataStructure="plain"
                keyExpr={this.props.valueExpr}
                parentIdExpr="parent"
                selectionMode={this.props.multiple? "multiple" : "single"}
                searchEnabled={true}
                searchTimeout={2000}
                showCheckBoxesMode="normal"
                selectNodesRecursive={false}
                displayExpr={this.props.displayExpr}
                selectByClick={true}
                onContentReady={this.treeView_onContentReady}
                onItemSelectionChanged={(e: any) => !this.state.disableOnChange? this.props.setValue(e, this.props.fld, this.props.multiple) : null}
            />
        );
    }

    treeView_onContentReady(e: any) {
        this.setState({disableOnChange: true})
        e.component.unselectAll()
        if (this.state.treeValue) {
            for (let i = 0; i < this.state.treeValue.length; i++) {
                e.component.selectItem(this.state.treeValue[i]);
            }
        }
        this.setState({disableOnChange: false})
    }
    
    render() {
        return (
            <DropDownBox value={this.state.treeValue}
            disabled={this.props.disabled}
            dataSource={this.props.spr.data} displayExpr={this.props.displayExpr} valueExpr={this.props.valueExpr}
            contentRender={this.treeViewRender}
            onValueChanged={this.syncTreeViewSelection}>
            <Validator>
                {this.props.isRequired === true? <RequiredRule message='Поле обязательное для заполнения!' /> : null}
            </Validator>
            </DropDownBox>
        )
    }
}
