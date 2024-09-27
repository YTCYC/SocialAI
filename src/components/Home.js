import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY } from "../constants";
import CreatePostButton from "./CreatePostButton";

const { TabPane } = Tabs; // destructure

function Home(props) {
  //The useState hook is used to declare and initialize state variables in a functional component. 
  // It returns an array with two elements: the current state value and a function that lets you update it.
  const [posts, setPost] = useState([]);
  const [activeTab, setActiveTab] = useState("image");
  const [searchOption, setSearchOption] = useState({
    type: SEARCH_KEY.all,
    keyword: "",
  });
  // searchOption is a state variable initialized with an object containing type and keyword properties. 
  // SEARCH_KEY.all and an empty string are the initial values for these properties, respectively.

  // define varible that will be passed to SearchBar
  const handleSearch = (option) => {  // option is varible name, user defined
    const { type, keyword } = option;
    // setSearchOption({ type: type, keyword: keyword });
    setSearchOption({ type, keyword }); // same as above
  };

  useEffect(() => {
    // hooks, replaces life cycle, did update etc.
    const { type, keyword } = searchOption;
    fetchPost(searchOption);
  }, [searchOption]); // [] is dependency array,

  const fetchPost = (option) => {
    const { type, keyword } = option;
    let url = ""; // declare url type

    if (type === SEARCH_KEY.all) {
      url = `${BASE_URL}/search`;
    } else if (type === SEARCH_KEY.user) {
      url = `${BASE_URL}/search?user=${keyword}`;
    } else {
      url = `${BASE_URL}/search?keywords=${keyword}`;
    }

    const opt = {
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
      },
      // this property sets the headers for the HTTP request. 
      // The headers include an "Authorization" header, which typically contains a token. 
      // The token is retrieved from the local storage 
    };

    axios(opt)
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data);
        }
      })
      .catch((err) => {
        message.error("Fetch posts failed!");
        console.log("fetch posts failed: ", err.message);
      });
  };

  const renderPosts = (type) => {
    if (!posts || posts.length === 0) {
      // handle corner case
      return <div>No such post exists!</div>;
    }
    if (type === "image") {
      const imageArr = posts
      // filter returns item that meets the requirement
        .filter((item) => item.type === "image")
        // .map iterates each element and do something
        .map((image) => {
          // re-shaping the data, non-technically speaking
          return {
            postId: image.id,
            src: image.url,
            user: image.user,
            caption: image.message,
            thumbnail: image.url,
            thumbnailWidth: 300,
            thumbnailHeight: 200,
          };
        });

      return <PhotoGallery images={imageArr} />;
    } else if (type === "video") {
      return (
        <Row gutter={32}>
          {posts
            .filter((post) => post.type === "video")
            .map((post) => (
              // re-shape the data
              <Col span={8} key={post.url}>
                <video src={post.url} controls={true} className="video-block" />
                <p>
                  {post.user}: {post.message}
                </p>
              </Col>
            ))}
        </Row>
      );
    }
  };

  // const operations = <Button>Click to Upload</Button>;
  const showPost = (type) => {
    console.log("type -> ", type);
    setActiveTab(type);
 
    setTimeout(() => { // set timer to refresh and load in posts just uploaded
      setSearchOption({ type: SEARCH_KEY.all, keyword: "" });
    }, 1000);
  };
 
  const operations = <CreatePostButton onShowPost={showPost} />;
 
  return (
    <div className="home">
      <SearchBar handleSearch={handleSearch}/>
      <div className="display">
        <Tabs
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey="image"
          activeKey={activeTab}
          tabBarExtraContent={operations}
        >
          <TabPane tab="Images" key="image">
            {renderPosts("image")}
          </TabPane>
          <TabPane tab="Videos" key="video">
            {renderPosts("video")}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Home;
