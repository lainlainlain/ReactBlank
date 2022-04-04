import React, { Component } from 'react'
import { Upload, Button, Popover } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'

type PropsType = {
  addFile: (fld: string, file: File) => void
  deleteFile: (fld: string, file: File) => void
  fld: string
  fileList: any[]
}

export default class UploadImages extends Component<PropsType> {
  constructor(props: PropsType) {
      super(props)
      this.state = {
          fileList: []
      };

      this.onChange = this.onChange.bind(this)
      this.onRemove = this.onRemove.bind(this)
      this.beforeUpload = this.beforeUpload.bind(this)
  }

  onChange(info: any) {
      
  }
  onRemove(file:any) {
      this.props.deleteFile(this.props.fld, file)
  }
  beforeUpload(file:any) {
      if (this.props.fileList.filter(e => e === file).length === 0) {
          this.props.addFile(this.props.fld, file)
      }

      return false;
  }

  popoverContent = (file: any) => {
    return <div className='common-upload-preview'><img src={file} alt='изображение' /></div>
  }

  render() {
      let filesJsx:any = []
      
      if (this.props.fileList !== undefined && this.props.fileList.length > 0) {
        this.props.fileList.forEach(f => {
            filesJsx.push(
            <Popover content={() => this.popoverContent(f)} title={false} key={f}>
                <div className='common-upload-img'>
                    <img src={f} alt='изображение' />
                    <div className='common-upload-img_toolbar'>
                        <Button type='link' icon={<DeleteOutlined />} title={'Удалить'} onClick={() => this.onRemove(f)} />
                    </div>
                </div>
            </Popover>
        )})
      }
          
      return (
          <>
              <div className='common-upload-container'>{filesJsx}</div>
              <Upload multiple={true} name={this.props.fld} onChange={this.onChange} beforeUpload={this.beforeUpload}
                showUploadList={false}>
                  <Button>
                      <UploadOutlined /> Добавить файлы
                  </Button>
              </Upload>
          </>
      )
  }
}
