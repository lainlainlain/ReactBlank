import React, { Component } from "react";
import Title from "antd/lib/typography/Title";
import "antd/dist/antd.css";
import { Form, Input, Select, Button, DatePicker } from "antd";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default class Home extends Component {
  render() {
    return (
      <div>
        <Title level={2}>Главная</Title>
        {userName}
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          scrollToFirstError
        >
          <Form.Item
            name="firstname"
            label="Имя"
            rules={[{ required: true, message: "Введите имя" }]}
          >
            <Input placeholder="Имя" value={userName}></Input>
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Фамилия"
            rules={[{ required: true, message: "Введите фамилию" }]}
          >
            <Input placeholder="Фамилия" />
          </Form.Item>
          <Form.Item
            name="fathersname"
            label="Отчество"
            rules={[{ required: true, message: "Введите отчество" }]}
          >
            <Input placeholder="Отчество" />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              {
                required: true,
                message: "Пожалуйста введите ваш пароль!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Подтвердите"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Пожалуйста подтвердите ваш пароль!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Номер телефона"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item name="date" label="Дата рождения">
            <DatePicker onChange={onChange} />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
