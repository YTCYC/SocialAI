
import React, { Component } from "react";
import { Modal, Button, message } from "antd";
import axios from "axios";

import { BASE_URL, TOKEN_KEY } from "../constants";
import { PostForm } from "./PostForm";

class CreatePostButton extends Component { // class component
  state = { // initial state
    visible: false,
    confirmLoading: false
  };

  showModal = () => { // when click "click to upload" button, visible will set to true
    this.setState({ // setState is one of the method from React.Component 
      visible: true
    });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true // this is the spinner
    });

    // get form data
    this.postForm // where does this come from?
      .validateFields() // check if everything is ok, ant design func
      .then((form) => { // if passes, then go to this line
        //form is from postForm
        const { description, uploadPost } = form;
        const { type, originFileObj } = uploadPost[0];
        // we only support uploading one post each time
        // however the component provided by ant design supports drag multi images each time
        // there is a discrepency, a "bug"
        // instead of hard coding 0, we could do for loop
        //    const postType = type.match(/^(image|video)/g)[0]; // regex
        // ^ means must be started with ..., here is image or video
        // this match func returns list of string
        // if Image, then null, a better way is add a logic to convert "type" variable to lower case
        // if not image nor video, then return null
        // second issue with this is returned postType could be null
        // and use [0] for null would result issues
        // use code below instead to solve these two corner cases 
        const validPostType = type.toLowerCase().match(/^(image|video)/g) ?? [];
        const postType = validPostType[0];
        if (postType) {
          let formData = new FormData(); // FormData is a js class
          formData.append("message", description);
          formData.append("media_file", originFileObj);

          const opt = {
            method: "POST",
            url: `${BASE_URL}/upload`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            },
            data: formData
          };

          axios(opt) // axios commumiates to backend and call func
            .then((res) => { // if successful
              if (res.status === 200) {
                message.success("Hooray! The image/video is uploaded successfully!");
                // add things we want to do when it's successful
                this.postForm.resetFields();
                this.handleCancel();
                //    this.handleCancel(); // this cancles form window 
                // not good in my mind because what if user wants to upload multi posts
                this.props.onShowPost(postType);
                // props is a keyword for class component
                // however props is not a keyword in func component
                this.setState({ confirmLoading: false });
              }
            })
            .catch((err) => {
              console.log("Upload image/video failed: ", err.message);
              // console.log is not recommended, since we don't know what would be returned from err.message
              // this is not safe, sensitive msg could be leaked
              message.error("Failed to upload image/video!");
              this.setState({ confirmLoading: false });
            });
        }
      })
      .catch((err) => {
        console.log("err ir validate form -> ", err);
      });
  };

  handleCancel = () => {
    console.log("Clicked cancel button");
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Click to Upload
        </Button>
        <Modal
          title="Create New Post"
          open={visible}
          onOk={this.handleOk}
          okText="Upload"
          confirmLoading={confirmLoading} // spinner
          onCancel={this.handleCancel}
        >
          <PostForm ref={(refInstance) => (this.postForm = refInstance)} />
        </Modal>
      </div>
    );
  }
}
export default CreatePostButton;

