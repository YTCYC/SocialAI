package service

import (
	"fmt"
	"reflect"

	"SocialAI/backend"
	"SocialAI/constants"
	"SocialAI/model"

	"github.com/olivere/elastic/v7"
)

// check if username annd password matches
func CheckUser(username, password string) (bool, error) {
	query := elastic.NewBoolQuery()
	query.Must(elastic.NewTermQuery("username", username))
	// query.Must(elastic.NewTermQuery("password", password))
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.USER_INDEX)
	if err != nil {
		return false, fmt.Errorf("Error reading user from ES: %w", err)
	}

	// init user
	var utype model.User
	for _, item := range searchResult.Each(reflect.TypeOf(utype)) {
		u := item.(model.User)
		if u.Password == password {
			fmt.Printf("Login as %s\n", username)
			return true, nil
		}
	}
	return false, nil
}

// add new user to ES
func AddUser(user *model.User) (bool, error) {
	query := elastic.NewTermQuery("username", user.Username)

	// first check if this user exists or not
	searchResult, err := backend.ESBackend.ReadFromES(query, constants.USER_INDEX)
	if err != nil {
		return false, err
	}

	if searchResult.TotalHits() > 0 {
		// if user already exists, we cannot add this user again
		fmt.Println("This usernname is already exists, pick a different name")
		return false, nil
	}

	err = backend.ESBackend.SaveToES(user, constants.USER_INDEX, user.Username)
	if err != nil {
		return false, err
	}
	fmt.Printf("User is added: %s\n", user.Username)
	return true, nil
}
