package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"SocialAI/model"
)

func uploadHandler(w http.ResponseWriter, r *http.Request) {
    // Parse from body of request to get a json object.
    fmt.Println("Received one upload request")
	// Create a JSON decoder
    decoder := json.NewDecoder(r.Body)
    var post model.Post

	// Attempt to decode the request body
    if err := decoder.Decode(&post); err != nil {
		// Respond with 400 Bad Request if there's an error during decoding
        // panic(err)
		http.Error(w, "Invalid JSON data", http.StatusBadRequest)
		fmt.Printf("Error decoding JSON: %v\n", err)
    }

	 // Send a success response
    fmt.Fprintf(w, "Post received: %s\n", post.Message)
}