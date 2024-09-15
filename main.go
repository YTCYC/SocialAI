package main

import (
	"fmt"
	"log"
	"net/http"

	"SocialAI/backend"
	"SocialAI/handler"
)

func main(){
	// fmt.Println("'hello ya'") // test

	fmt.Println("started-service")

	backend.InitElasticsearchBackend()
	fmt.Println("elastic initiated")
    log.Fatal(http.ListenAndServe(":8080", handler.InitRouter()))
}