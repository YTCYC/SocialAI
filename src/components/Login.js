import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axios from "axios"; // third party package to call backend from front end

import { BASE_URL } from "../constants";

// handles the communication logic between backend and frontend
function Login(props) { // props is passed by parent so it is from Main
 const { handleLoggedIn } = props;

 const onFinish = (values) => {
   const { username, password } = values;
   const opt = {
     method: "POST",
     url: `${BASE_URL}/signin`,
     data: {
       username: username,
       password: password
     },
     headers: { "Content-Type": "application/json" }
   };
   axios(opt) // this returns promise , opt is returned from backend
     .then((res) => { // if success, runs this, 
       if (res.status === 200) {
         const { data } = res;
         handleLoggedIn(data); // data is the token returned by backend
         message.success("Login succeed! ");
       }
     })
     .catch((err) => { // if request fails, run this
       console.log("login failed: ", err.message);
       message.error("Login failed!");
     });
 };

 return (
   <Form name="normal_login" className="login-form" onFinish={onFinish}>
     <Form.Item
       name="username"
       rules={[
         {
           required: true,
           message: "Please input your Username!"
         }
       ]}
     >
       <Input
         prefix={<UserOutlined className="site-form-item-icon" />}
         placeholder="Username"
       />
     </Form.Item>
     <Form.Item
       name="password"
       rules={[
         {
           required: true,
           message: "Please input your Password!"
         }
       ]}
     >
       <Input
         prefix={<LockOutlined className="site-form-item-icon" />}
         type="password"
         placeholder="Password"
       />
     </Form.Item>

     <Form.Item>
       <Button type="primary" htmlType="submit" className="login-form-button">
         Login
       </Button>
       Or <Link to="/register">Register Now!</Link> 
       {/* link to register router */}
     </Form.Item>
   </Form>
 );
}

export default Login;

