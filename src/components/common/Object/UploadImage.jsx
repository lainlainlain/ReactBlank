import React from 'react'
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(img, callback) {
  debugger
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    return callback(reader.result)
  })
  reader.readAsDataURL(img)
}

export default class UploadImage extends React.Component {
  state = {
  };

  componentDidMount() {
    this.setState({imageUrl: this.props.value})
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({imageUrl: this.props.value})
    }
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Неверный формат изображения. Разрешенные форматы: JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Слишком большой размер файла. Размер файла не должен превышать 2MB!');
    }
    debugger
    if (isJpgOrPng && isLt2M) {
        getBase64(file, imageUrl => {
          this.props.setFile(imageUrl, this.props.field)
        })
        return true
    } else {
      return false
    }
  }

  handleChange = info => {
  }

  render() {
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Загрузить</div>
      </div>
    );
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={'data:image/jpeg;base64,' + imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}