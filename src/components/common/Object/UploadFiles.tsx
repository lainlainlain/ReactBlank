import React, { Component } from 'react'
import { Upload, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { siteUrl } from '../../../constants/constants';

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

type PropsType = {
  addFile: (fld: string, file: File) => void
  deleteFile: (fld: string, code: string) => void
  fld: string
  fileList: any[]
}

export default class UploadFiles extends Component<PropsType> {
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
  onRemove(name: string) {
      this.props.deleteFile(this.props.fld, name)
  }
  beforeUpload(file:any) {
      if (this.props.fileList.filter(e => e === file).length === 0) {
          this.props.addFile(this.props.fld, file)
      }

      return false;
  }

  render() {
      let filesJsx:any = []
      
      if (this.props.fileList !== undefined && this.props.fileList.length > 0) {
        this.props.fileList.forEach(f => {
            filesJsx.push(
              <div className='common-upload-file'>
                {f.code? <a href={siteUrl + '/api/repo/' + f.code}>{f.name + f.ext}</a> : <span>{f.name + f.ext}</span>}
                <div className='common-upload-file_toolbar'>
                    <Button type='link' icon={<DeleteOutlined />} title={'Удалить'} onClick={() => this.onRemove(f.name)} />
                </div>
              </div>
        )})
      }
          
      return (
          <>
              <div className='common-upload-container_files'>{filesJsx}</div>
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
