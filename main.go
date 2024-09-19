package main

import (
	"fmt"
	"log"
	"net/http"

	"SocialAI/backend"
	"SocialAI/handler"
)

func main() {
	// fmt.Println("'hello ya'") // test

	fmt.Println("started-service")

	// start elasticsearch
	backend.InitElasticsearchBackend()
	fmt.Println("elasticsearch initiated")

	// start GCS
	backend.InitGCSBackend()
	fmt.Println("GCS intiated")

	log.Fatal(http.ListenAndServe(":8080", handler.InitRouter()))
}
