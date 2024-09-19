package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"path/filepath"

	"SocialAI/model"
	"SocialAI/service"

	"github.com/google/uuid"
)

// literal map for different media types
var (
	mediaTypes = map[string]string{
		".jpeg": "image",
		".jpg":  "image",
		".gif":  "image",
		".png":  "image",
		".mov":  "video",
		".mp4":  "video",
		".avi":  "video",
		".flv":  "video",
		".wmv":  "video",
	}
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Parse from body of request to get a json object.
	fmt.Println("Received one upload request")

	// create an instance of a post
	post := model.Post{
		Id:      uuid.New().String(),
		User:    r.FormValue("user"),
		Message: r.FormValue("message"),
	}

	// retrieve file expected to be uploaded
	file, header, err := r.FormFile("media_file")
	if err != nil {
		http.Error(w, "Media file is not available", http.StatusBadRequest)
		fmt.Printf("Media file is not available %v\n", err)
		return
	}

	// determine type of an uploaded file
	// extract file extentio (suffix)
	suffix := filepath.Ext(header.Filename)
	if t, ok := mediaTypes[suffix]; ok { // type assertion
		// mediaTypes[suffix]: Looks up the file extension
		post.Type = t
		// t: The value corresponding to the file extension in the map
		// if return true, update post type
	} else {
		// if not true, post type set to unknown
		post.Type = "unknown"
	}

	err = service.SavePost(&post, file)
	if err != nil {
		http.Error(w, "Failed to save post to backend", http.StatusInternalServerError)
		fmt.Printf("Failed to save post to backend %v\n", err)
		return
	}

	fmt.Println("Post is saved successfully.")

	// Create a JSON decoder
	// decoder := json.NewDecoder(r.Body)
	// var post model.Post

	// // Attempt to decode the request body
	// if err := decoder.Decode(&post); err != nil {
	// 	// Respond with 400 Bad Request if there's an error during decoding
	// 	// panic(err)
	// 	http.Error(w, "Invalid JSON data", http.StatusBadRequest)
	// 	fmt.Printf("Error decoding JSON: %v\n", err)
	// }

	// // Send a success response
	// fmt.Fprintf(w, "Post received: %s\n", post.Message)
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Received one request for search")
	w.Header().Set("Content-Type", "application/json")

	user := r.URL.Query().Get("user")
	keywords := r.URL.Query().Get("keywords")

	var posts []model.Post
	var err error
	if user != "" {
		// search posts based on user
		posts, err = service.SearchPostsByUser(user)
	} else {
		// if no user given, search based on keyworrds
		posts, err = service.SearchPostsByKeywords(keywords)
	}

	if err != nil {
		http.Error(w, "Failed to read post from backend", http.StatusInternalServerError)
		fmt.Printf("Failed to read post from backend %v.\n", err)
		return
	}

	js, err := json.Marshal(posts)
	if err != nil {
		http.Error(w, "Failed to parse posts into JSON format", http.StatusInternalServerError)
		fmt.Printf("Failed to parse posts into JSON format %v.\n", err)
		return
	}
	w.Write(js)
}
