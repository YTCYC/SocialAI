
import React from "react";
import { useNavigate } from "react-router-dom";

import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

import { BASE_URL } from "../constants";

// (mobile) responsiveness design

const formItemLayout = {
   labelCol: {
       xs: { span: 24 },
       sm: { span: 8 },
   },
   wrapperCol: {
       xs: { span: 24 },
       sm: { span: 16 },
   },
};
const tailFormItemLayout = {
   wrapperCol: {
       xs: {
           span: 16,
           offset: 0,
       },
       sm: {
           span: 16,
           offset: 8,
       },
   },
};

function Register(props) {
 const [form] = Form.useForm();
 const navigate = useNavigate();

 const onFinish = values => {
     console.log('Received values of form: ', values);
     const { username, password } = values;
     const opt = {
         method: 'POST',
         url: `${BASE_URL}/signup`,
         data: {
             username: username,
             password: password
         },
         headers: { 'content-type': 'application/json'}
     };

     axios(opt)
         .then( (response) => {
             console.log(response)
             // case1: registered success
             if(response.status === 200) {
                 message.success('Congrats! Registration succeed!');
                //  props.history.push('/login'); // if success, add login in the history stack
                 // the logic is when registered successfully, we want user to login afterwards immediately
                 navigate("/login");
             }
         })
         .catch( error => {
             console.log('register failed: ', error.message);
             message.error('Registration failed!');
             // throw new Error('Signup Failed!')
         })
 };

 return (
     <Form
         {...formItemLayout} // spread operater, get all elements in formItemLayout
         // rest operater is used in function : rest of parameters
         // here we just use spread operator to expend formItemLayout this object
         form={form}
         name="register"
         onFinish={onFinish}
         className="register"
     >
         <Form.Item
             name="username"
             label="Username"
             rules={[
                 {
                     required: true,
                     message: 'Please input your Username!',
                 },
             ]}
         >
             <Input />
         </Form.Item>

         <Form.Item
             name="password"
             label="Password"
             rules={[
                 {
                     required: true,
                     message: 'Please input your password!',
                 },
             ]}
             hasFeedback
         >
             <Input.Password />
         </Form.Item>

         <Form.Item
             name="confirm"
             label="Confirm Password"
             dependencies={['password']}
             hasFeedback
             rules={[
                 {
                     required: true,
                     message: 'Please confirm your password!',
                 },
                 ({ getFieldValue }) => ({
                     validator(rule, value) {
                         if (!value || getFieldValue('password') === value) {
                             return Promise.resolve();
                         }
                         return Promise.reject('The two passwords that you entered do not match!');
                     },
                 }),
             ]}
         >
             <Input.Password />
         </Form.Item>

         <Form.Item {...tailFormItemLayout}>
             <Button type="primary" htmlType="submit" className="register-btn">
                 Register
             </Button>
         </Form.Item>
     </Form>
 );
}

export default Register;

