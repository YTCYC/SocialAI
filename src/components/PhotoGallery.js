import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, message, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { Gallery } from "react-grid-gallery";
import { BASE_URL, TOKEN_KEY } from "../constants";

const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  maxHeight: "240px",
  overflow: "hidden",
  position: "absolute",
  bottom: "0",
  width: "100%",
  color: "white",
  padding: "2px",
  fontSize: "90%",
};

const wrapperStyle = {
  display: "block",
  minHeight: "1px",
  width: "100%",
  border: "1px solid #ddd",
  overflow: "auto",
};

function PhotoGallery(props) {
  const [images, setImages] = useState(props.images);

  const imageArr = images.map((image) => {
    // let ownedThisPost = false;

    return {
      ...image, // spread
      customOverlay: (
        <div style={captionStyle}>
          <div
            // this is just test, didn't do anything
            onClick={() => console.log("test")}
          >{`${image.user}: ${image.caption}`}</div>
          {/* {ownedThisPost && ( */}
            <Button
              style={{ marginTop: "1px", marginLeft: "20%" }}
              key="deleteImage"
              type="primary"
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => onDeleteImage(image.postId)}
            >
              Delete
            </Button>
          {/* )} */}
        </div>
      ),
    };
  });

  const onDeleteImage = (postId) => {
    if (window.confirm(`Do you really want to delete this image?`)) {
      const newImageArr = images.filter((img) => img.postId !== postId);
      // update image to be all image but the id just deleted
      console.log("delete image ", newImageArr);
      const opt = {
        method: "DELETE",
        url: `${BASE_URL}/post/${postId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      };

      axios(opt)
        .then((res) => {
          console.log("delete result -> ", res);
          // case1: success
          if (res.status === 200) {
            // step1: set state
            setImages(newImageArr); // update image state
          }
        })
        .catch((err) => {
          // case2: fail
          message.error("Fetch posts failed!");
          console.log("fetch posts failed: ", err.message);
        });
    }
  };

  useEffect(() => {
    setImages(props.images);
  }, [props.images]);

  return (
    <div style={wrapperStyle}>
      <Gallery
        images={imageArr}
        enableImageSelection={false}
        backdropClosesModal={true}
      />
    </div>
  );
}

// if typescript has different type, if propTyeps is different, error will occur
PhotoGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      postId: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      thumbnailWidth: PropTypes.number.isRequired,
      thumbnailHeight: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default PhotoGallery;
