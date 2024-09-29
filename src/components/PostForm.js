
import React, { forwardRef } from "react";
import { Form, Upload, Input } from "antd";
import { FileAddOutlined } from "@ant-design/icons"; // why not in antd??

export const PostForm = forwardRef((props, formRef) => {
 const formItemLayout = { // object
   labelCol: { span: 6 },
   wrapperCol: { span: 14 }
 };
 const normFile = (e) => { // e = event
   console.log("Upload event:", e);
   if (Array.isArray(e)) { // this checks if an object is an array, js func
     return e;
   }
   return e?.fileList; // this checks if e exists and then return e and its fileList, which is a list
 };
 return (
   <Form name="validate_other" {...formItemLayout} ref={formRef}>
     <Form.Item
       name="description"
       label="Message"
       rules={[
         {
           required: true,
           message: "Please input your post message!"
         }
       ]}
     >
       <Input placeholder="Hey what's in your mind?"/>
     </Form.Item>
     <Form.Item label="Dragger">
       <Form.Item
         name="uploadPost"
         valuePropName="fileList"
         getValueFromEvent={normFile}
         noStyle
         rules={[
           {
             required: true,
             message: "upload an image or a video that you want to share!"
           }
         ]}
       >
         <Upload.Dragger name="files" beforeUpload={() => false}>
           <p className="ant-upload-drag-icon">
             <FileAddOutlined />
           </p>
           <p className="ant-upload-text">
             Click or drag your file to this area to upload
           </p>
         </Upload.Dragger>
       </Form.Item>
     </Form.Item>
   </Form>
 );
});

