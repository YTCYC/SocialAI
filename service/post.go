package service

import (
	"fmt"
	"log"
	"mime/multipart"
	"reflect"

	"SocialAI/backend"
	"SocialAI/constants"
	"SocialAI/model"

	"github.com/olivere/elastic/v7"
)

func SearchPostsByUser(user string) ([]model.Post, error) {
	query := elastic.NewTermQuery("user", user)
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
	if err != nil {
		log.Fatalf("Error read data (user) from elasticsearch: %v", err)
		return nil, err
	}
	return getPostFromSearchResult(searchResult), nil
}

func SearchPostsByKeywords(keywords string) ([]model.Post, error) {
	query := elastic.NewMatchQuery("message", keywords)
	query.Operator("AND")
	if keywords == "" {
		// if no keyword specified, we return all posts
		query.ZeroTermsQuery("all")
	}
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.POST_INDEX)
	if err != nil {
		log.Fatalf("Error read data (keyword) from elasticsearch: %v", err)
		return nil, err
	}
	return getPostFromSearchResult(searchResult), nil
}

func getPostFromSearchResult(searchResult *elastic.SearchResult) []model.Post {
	var ptype model.Post
	var posts []model.Post

	for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
		p := item.(model.Post)
		posts = append(posts, p)
	}
	return posts
}

// save uploaded data into elasticsearch and gcs
func SavePost(post *model.Post, file multipart.File) error {
	medialink, err := backend.GCSBackend.SaveToGCS(file, post.Id)
	if err != nil {
		return fmt.Errorf("Fail to save data into GCS: %w", err)
	}

	// update post url to be medialink of uploaded data
	post.Url = medialink

	// save post and medialink into elasticsearch
	return backend.ESBackend.SaveToES(post, constants.POST_INDEX, post.Id)
}
