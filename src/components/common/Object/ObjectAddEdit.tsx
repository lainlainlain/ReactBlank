import React, { Component } from 'react'
import Modal from 'antd/lib/modal/Modal'
import { TextBox, Validator, NumberBox, SelectBox, ValidationSummary, Button, DateBox, CheckBox } from 'devextreme-react'
import { RequiredRule } from 'devextreme-react/form'
import { message, Row, Col, Select } from 'antd'
import { ITbl, ITblFld } from '../../../entities/Tbl'
import { requestTblRowEdit, requestAddRepoFile, requestDeleteRepoFile, requestTblRowAdd } from '../../../actions/objectActions'
import DropDownTree from './DropDownTree'
import SunEditor from 'suneditor-react'
import UploadImage from './UploadImage'
import DropDownGrid from './DropDownGrid'
import UploadImages from './UploadImages'
import { siteUrl } from '../../../constants/constants'
import UploadFiles from './UploadFiles'

const info = (text: string) => {
    message.info(text);
};

function getBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  

const buttonSunEditor = [
    ['font', 'fontSize'],
    ['fontColor', 'hiliteColor'],
    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
    ['align', 'horizontalRule', 'list', 'lineHeight'],
    ['table', 'link', 'image', 'video', 'audio'],
    ['fullScreen']
]

type PropsType = {
    isEdit: boolean
    editData: any
    sprs: Array<ITbl>
    fields: Array<ITblFld>
    keyfield: string
    modal_onClose: (data: any) => void
    tblCode: string
    modalTitle: string
    disabledFields?: string[]
}

type StateType = {
    data: any
    repoImages: any[]
    repoFiles: any[]
}

export default class ObjectAddEdit extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props)

        let initialData: any = {}

        this.props.fields.filter(f => f.is_edit === true).forEach(field => {
            initialData[field.code] = null
        })

        this.state = {
            data: initialData,
            repoImages: [],
            repoFiles: []
        }

        this.form_onSubmit = this.form_onSubmit.bind(this)
    }

    async componentDidMount() {
        debugger
        if (this.props.editData) {
            this.setState({data: this.props.editData})
        }

        await this.props.fields.filter(f => f.is_edit === true).forEach(async fld => {
            if (fld.type === 'images') {
                if (this.props.editData && this.props.editData[fld.code]) {
                    let repoImages = this.state.repoImages
                    const images = this.props.editData[fld.code]

                    for(let i = 0; i < images.length; i++) {
                        if (!repoImages.some(r => r.code === images[i])) {
                            // let file = await requestRepoFile(images[i])
                            debugger
                            let blob = await fetch(siteUrl + '/api/repo/' + images[i]).then(r => r.blob());
                            let base64 = await getBase64(blob)
                            if (base64) {
                                repoImages.push({code: images[i], fld: fld.code, file: base64, isDeleted: false, orig: blob})
                            }
                        }
                    }

                    this.setState({repoImages})
                }
            }
            if (fld.type === 'files') {
                if (this.props.editData && this.props.editData[fld.code]) {
                    let repoFiles = this.state.repoFiles
                    const files = this.props.editData[fld.code]

                    for(let i = 0; i < files.length; i++) {
                        if (!repoFiles.some(r => r.code === files[i].code)) {
                            repoFiles.push({code: files[i].code, fld: fld.code, name: files[i].name, ext: files[i].ext, isDeleted: false})
                        }
                    }

                    this.setState({repoFiles})
                }
            }
        })
    }



    async form_onSubmit(e: any) {
        e.preventDefault();
        
        if (this.props.isEdit) { // Изменение
            const result = await requestTblRowEdit(this.props.tblCode, this.state.data)
            if (result && result[this.props.keyfield]) {
                info('Успешно изменено!')
                
                if (this.state.repoImages.length > 0) {
                    await this.uploadImages_saveFiles(result[this.props.keyfield])
                }
                if (this.state.repoFiles.length > 0) {                    
                    await this.uploadFiles_saveFiles(result[this.props.keyfield])
                }
            }
            this.props.modal_onClose(result)
        } else { // добавление
            const result = await requestTblRowAdd(this.props.tblCode, this.state.data)
            if (result && result[this.props.keyfield]) {
                info('Успешно добавлено!')
        
                if (this.state.repoImages.length > 0) {
                    await this.uploadImages_saveFiles(result[this.props.keyfield])
                }
                if (this.state.repoFiles.length > 0) {                    
                    await this.uploadFiles_saveFiles(result[this.props.keyfield])
                }
            }
            this.props.modal_onClose(result)
        }
    }

    dropDownTree_onSetValue = (e: any, field: string, multiple: boolean) => {

        let value: any = null
        
        if (e.component.getSelectedNodeKeys) {
            if (multiple) {
                value = e.component.getSelectedNodeKeys().length > 0? e.component.getSelectedNodeKeys() : null
            } else {
                value = e.component.getSelectedNodeKeys().length > 0? e.component.getSelectedNodeKeys()[0] : null
            }
        }
        
        let data = this.state.data
        const oldValue = data[field]
        
        if (oldValue !== value) {
            data[field] = value
            this.setState({data})
        }
    }

    dropDownGrid_onSetValue = (e: any, field: string, multiple: boolean) => {

        let value: any = null
        
        if (e.component.getSelectedRowKeys) {
            if (multiple) {
                value = e.component.getSelectedRowKeys().length > 0? e.component.getSelectedRowKeys() : null
            } else {
                value = e.component.getSelectedRowKeys().length > 0? e.component.getSelectedRowKeys()[0] : null
            }
        }

        let data = this.state.data
        const oldValue = data[field]
        
        if (oldValue !== value) {
            data[field] = value
            this.setState({data})
        }
    }

    input_onValueChanged = (field: string, value: any) => {
        let data = this.state.data
        const oldValue = data[field]
        if (oldValue !== value) {
            data[field] = value
            this.setState({data})
        }
    }

    checkDisabledField = (code: string) => {
        if (this.props.disabledFields && this.props.disabledFields.some(f => f === code)) {
            return true
        } else {
            return false
        }
    }

    uploadImage_setFile = (file: any, field: string) => {
        let data = this.state.data
        const oldValue = data[field]
        if (oldValue !== file) {
            let index = file.toString().indexOf(',')
            data[field] = file.toString().substring(index + 1)
            
            this.setState({data})
        }
    }

    uploadImages_saveFiles = async (code: string) => {

        for(let i = 0; i < this.state.repoImages.length; i++) {
            if (this.state.repoImages[i].isDeleted === true && this.state.repoImages[i].code) {
                await requestDeleteRepoFile(this.state.repoImages[i].code)
            } else {
                if (!this.state.repoImages[i].code) {
                    await requestAddRepoFile(this.props.tblCode, code, this.state.repoImages[i].orig)
                }
            }
        }
    }

    uploadImages_prepare = (fld: string) => {
        let fileList: any[] = []
        
        this.state.repoImages.filter(r => r.fld === fld && r.isDeleted !== true).forEach(f => {
                fileList.push(f.file)
        });
        
        return fileList
    }

    uploadImages_addFile = async (fld: string, file: File) => {
        let repoImages = this.state.repoImages
        
        if (!repoImages.some(r => r.file === file)) {
            let base64 = await getBase64(file)

            repoImages.push({code: null, fld, file: base64, orig: file})
        }

        this.setState({repoImages})
    }

    uploadImages_deleteFile = (fld: string, file: File) => {
        let repoImages = this.state.repoImages
        
        const index = repoImages.findIndex(r => r.file === file)
        if (index >= 0) {
            let file:any = repoImages[index]
            file.isDeleted = true
        }

        this.setState({repoImages})
    }

    uploadFiles_saveFiles = async (code: string) => {

        for(let i = 0; i < this.state.repoFiles.length; i++) {
            if (this.state.repoFiles[i].isDeleted === true && this.state.repoFiles[i].code) {
                await requestDeleteRepoFile(this.state.repoFiles[i].code)
            } else {
                if (!this.state.repoFiles[i].code) {
                    await requestAddRepoFile(this.props.tblCode, code, this.state.repoFiles[i].file)
                }
            }
        }
    }

    uploadFiles_prepare = (fld: string) => {
        let fileList: any[] = []
        
        this.state.repoFiles.filter(r => r.fld === fld && r.isDeleted !== true).forEach(f => {
                fileList.push(f)
        });
        
        return fileList
    }

    uploadFiles_addFile = async (fld: string, file: File) => {
        let repoFiles = this.state.repoFiles
        debugger
        if (!repoFiles.some(r => r.name === file.name)) {
            repoFiles.push({code: null, fld, name: file.name, ext: '', file: file})
        }

        this.setState({repoFiles})
    }

    uploadFiles_deleteFile = (fld: string, name: string) => {
        let repoFiles = this.state.repoFiles
        
        const index = repoFiles.findIndex(r => r.name === name)
        if (index >= 0) {
            let file:any = repoFiles[index]
            file.isDeleted = true
        }   

        this.setState({repoFiles})
    }

    render() {
        let fields: Array<any> = []
        
        fields =  this.props.fields.filter(f => f.is_edit === true).map(fld => {

            let input = null

            switch (fld.type) {
                case 'object':
                    const spr = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                    const displayExpr = fld.obj_name === null? 'name' : fld.obj_name
                    const valueExpr = fld.obj_field === null? 'code' : fld.obj_field
                    
                    if (spr?.fields?.some(f => f.code === 'parent')) {
                        input = (
                                <DropDownTree multiple={false} fld={fld.code} valueExpr={valueExpr} displayExpr={displayExpr} isRequired={fld.is_required} spr={spr!} value={this.state.data? this.state.data[fld.code] : undefined} setValue={this.dropDownTree_onSetValue} disabled={this.checkDisabledField(fld.code)} />
                        )
                    } else {
                        input = (
                            <SelectBox value={this.state.data? this.state.data[fld.code] : undefined} onValueChanged={(e: any) => this.input_onValueChanged(fld.code, e.value)} dataSource={spr?.data} displayExpr={displayExpr} valueExpr={valueExpr} showClearButton={true} searchEnabled={true} disabled={this.checkDisabledField(fld.code)}>
                                {fld.is_required === true? <Validator><RequiredRule message='Поле обязательное для заполнения!' /></Validator> : null}
                            </SelectBox>
                        )
                    }
                    break
                case 'object[]':
                    const spr2 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                    const displayExpr2 = fld.obj_name === null? 'name' : fld.obj_name
                    const valueExpr2 = fld.obj_field === null? 'code' : fld.obj_field
                    input = (
                        <DropDownTree multiple={true} fld={fld.code} valueExpr={valueExpr2} displayExpr={displayExpr2} isRequired={fld.is_required} spr={spr2!} value={this.state.data? this.state.data[fld.code] : undefined} setValue={this.dropDownTree_onSetValue} disabled={this.checkDisabledField(fld.code)} />
                    )
                    break
                case 'grid':
                    const spr3 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                    const displayExpr3 = fld.obj_name === null? 'name' : fld.obj_name
                    const valueExpr3 = fld.obj_field === null? 'code' : fld.obj_field
                    input = (
                        <DropDownGrid multiple={false} fld={fld.code} valueExpr={valueExpr3} displayExpr={displayExpr3} isRequired={fld.is_required} spr={spr3!} value={this.state.data? this.state.data[fld.code] : undefined} setValue={this.dropDownGrid_onSetValue} disabled={this.checkDisabledField(fld.code)} sprs={this.props.sprs} />
                    )
                    break
                case 'grid[]':
                    const spr4 = this.props.sprs.find(s => s.code.toLowerCase() === fld.obj_code!.toLowerCase())
                    const displayExpr4 = fld.obj_name === null? 'name' : fld.obj_name
                    const valueExpr4 = fld.obj_field === null? 'code' : fld.obj_field
                    input = (
                        <DropDownGrid multiple={true} fld={fld.code} valueExpr={valueExpr4} displayExpr={displayExpr4} isRequired={fld.is_required} spr={spr4!} value={this.state.data? this.state.data[fld.code] : undefined} setValue={this.dropDownGrid_onSetValue} disabled={this.checkDisabledField(fld.code)} sprs={this.props.sprs} />
                    )
                    break
                case 'html':
                    input = (
                            <SunEditor lang='ru' setContents={this.state.data? this.state.data[fld.code] : undefined} showToolbar={false} autoFocus={false} disable={this.checkDisabledField(fld.code)}
                                setOptions={{ mode: 'inline', buttonList: buttonSunEditor, height: 'auto', minHeight: 100, maxHeight: 500, resizingBar: false }} 
                                onChange={(e: any) => { this.input_onValueChanged(fld.code, e) }}/>
                    )
                    break
                case 'images':
                    const imagesList = this.uploadImages_prepare(fld.code)
                    input = (
                        <UploadImages fileList={imagesList} addFile={this.uploadImages_addFile} fld={fld.code} deleteFile={this.uploadImages_deleteFile} />
                    )
                    break
                case 'files':
                    const filesList = this.uploadFiles_prepare(fld.code)
                    input = (
                        <UploadFiles fileList={filesList} addFile={this.uploadFiles_addFile} fld={fld.code} deleteFile={this.uploadFiles_deleteFile} />
                    )
                    break
                case 'byte':
                    input = (
                        <UploadImage field={fld.code} setFile={this.uploadImage_setFile} value={this.state.data? this.state.data[fld.code] : null} />
                    )
                    break
                case 'int':
                    input = (
                        <NumberBox value={this.state.data? this.state.data[fld.code] : undefined} format="###0" onValueChanged={(e: any) => this.input_onValueChanged(fld.code, e.value)} disabled={this.checkDisabledField(fld.code)}>
                            {fld.is_required === true? 
                                <Validator><RequiredRule message='Поле обязательное для заполнения!' /></Validator> : null}
                        </NumberBox>
                    )
                    break
                case 'decimal':
                    input = (
                        <NumberBox value={this.state.data? this.state.data[fld.code] : undefined} onValueChanged={(e: any) => this.input_onValueChanged(fld.code, e.value)} disabled={this.checkDisabledField(fld.code)}>
                            {fld.is_required === true? 
                                <Validator><RequiredRule message='Поле обязательное для заполнения!' /></Validator> : null}
                        </NumberBox>
                    )
                    break
                case 'datetime':
                    input = (
                        <DateBox type='datetime' value={this.state.data? this.state.data[fld.code] : undefined} onValueChanged={(e: any) => this.input_onValueChanged(fld.code, e.value)} disabled={this.checkDisabledField(fld.code)}>
                            {fld.is_required === true? 
                                <Validator><RequiredRule message='Поле обязательное для заполнения!' /></Validator> : null}
                        </DateBox>
                    )
                    break
                case 'bool':
                    input = (
                        <CheckBox value={this.state.data? this.state.data[fld.code] : undefined} onValueChanged={(e: any) => this.input_onValueChanged(fld.code, e.value)} disabled={this.checkDisabledField(fld.code)} />
                    )
                    break
                case 'string[]':
                    input = (
                        <Select mode="tags" value={this.state.data && this.state.data[fld.code]? this.state.data[fld.code] : undefined} style={{ width: '100%' }} onChange={(e: any) => this.input_onValueChanged(fld.code, e)} tokenSeparators={[',']}>
                        </Select>
                    )
                    break
                default:
                    input = (
                        <TextBox value={this.state.data? this.state.data[fld.code] : undefined} onValueChanged={(e: any) => this.input_onValueChanged(fld.code, e.value)} disabled={this.checkDisabledField(fld.code)}>
                            {fld.is_required === true? 
                                <Validator><RequiredRule message='Поле обязательное для заполнения!' /></Validator> : null}
                        </TextBox>
                    )
                    break
            }

            return (
                <div key={fld.code}>
                    <Row gutter={[20,20]}>
                        <Col span={8}>
                            <div className='ta-r' style={{marginTop: 6}}>{fld.name}:</div>
                        </Col>
                        <Col span={16}>
                            {input}
                        </Col>
                    </Row>
                </div>
            )
        })


        return (

            <Modal
                title={this.props.modalTitle}
                visible={true}
                onCancel={this.props.modal_onClose}
                footer={null}
                width={800}
                maskClosable={false}
                destroyOnClose={true}
            >
                <form onSubmit={this.form_onSubmit}>
                        {fields}
                        <ValidationSummary id="summary" className='m-b-10'></ValidationSummary>
                        <div className='ta-r'>
                            <Button
                            id="button"
                            text="Сохранить"
                            type="success"
                            useSubmitBehavior={true} />
                        </div>
                </form>
            </Modal>
        )
    }
}
