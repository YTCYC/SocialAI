package backend

import (
	"context"
	"fmt"
	"log"

	"SocialAI/constants"

	"github.com/olivere/elastic/v7"
)

// use a global varibale to wrap client
//The purpose of the ElasticsearchBackend struct is to encapsulate the Elasticsearch client.
// we could add other fields or methods related to interacting with Elasticsearch later on.
// This struct acts as a centralized place to manage interactions with Elasticsearch.

type ElasticsearchBackend struct {
	client *elastic.Client
}

var (
	ESBackend *ElasticsearchBackend
	// declare other global variable related to elastc search in the furture
)

func InitElasticsearchBackend() {
	fmt.Println("starting elastic search init")
	client, err := elastic.NewClient(
		elastic.SetURL(constants.ES_URL),
		elastic.SetSniff(false)) //,
	//elastic.SetBasicAuth(constants.ES_USERNAME, constants.ES_PASSWORD))
	if err != nil {
		log.Fatalf("Error creating the Elasticsearch client: %v", err)
	}

	exists, err := client.IndexExists(constants.POST_INDEX).Do(context.Background())
	if err != nil {
		// panic(err)
		log.Fatalf("Error checking if post index exists: %v", err)
		fmt.Printf("Error checking if post index exists: %v\n", err)
	}

	if !exists {
		mapping := `{
            "mappings": {
                "properties": {
                    "id":       { "type": "keyword" },
                    "user":     { "type": "keyword" },
                    "message":  { "type": "text" },
                    "url":      { "type": "keyword", "index": false },
                    "type":     { "type": "keyword", "index": false }
                }
            }
        }`
		_, err := client.CreateIndex(constants.POST_INDEX).Body(mapping).Do(context.Background())
		if err != nil {
			// panic(err)
			log.Fatalf("Error creating post index: %v", err)
			fmt.Printf("Error creating post index: %v\n", err)
		}
	}

	exists, err = client.IndexExists(constants.USER_INDEX).Do(context.Background())
	if err != nil {
		// panic(err)
		log.Fatalf("Error checking if user index exists: %v", err)
		fmt.Printf("Error checking if user index exists: %v\n", err)
	}

	if !exists {
		mapping := `{
                        "mappings": {
                                "properties": {
                                        "username": {"type": "keyword"},
                                        "password": {"type": "keyword"},
                                        "age":      {"type": "long", "index": false},
                                        "gender":   {"type": "keyword", "index": false}
                                }
                        }
                }`
		_, err = client.CreateIndex(constants.USER_INDEX).Body(mapping).Do(context.Background())
		if err != nil {
			// panic(err)
			log.Fatalf("Error creating user index: %v", err)
			fmt.Printf("Error creating user index: %v\n", err)
		}
	}
	fmt.Println("Post and User Indexes are created.")

	ESBackend = &ElasticsearchBackend{client: client}
}

// read data from elastic search: user and post info
func (backend *ElasticsearchBackend) ReadFromES(query elastic.Query, index string) (*elastic.SearchResult, error) {
	searchResult, err := backend.client.Search().
		Index(index).
		Query(query).
		Pretty(true).
		Do(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to read data from elasticsearch: %w", err)
	}

	return searchResult, nil
}

// save data into es
func (backend *ElasticsearchBackend) SaveToES(i interface{}, index string, id string) error {
	_, err := backend.client.Index().
		Index(index).
		Id(id).
		BodyJson(i).
		Do(context.Background())
	return fmt.Errorf("failed to save data into elasticsearch: %w", err)
}

// delete data from es
func (backend *ElasticsearchBackend) DeleteFromES(query elastic.Query, index string) error {
	_, err := backend.client.DeleteByQuery().
		Index(index).
		Query(query).
		Pretty(true).
		Do(context.Background())

	return err
}
