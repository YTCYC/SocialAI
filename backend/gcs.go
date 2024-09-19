package backend

import (
	"context"
	"fmt"
	"io"

	"SocialAI/constants"

	"cloud.google.com/go/storage"
)

type GoogleCloudStorageBackend struct {
	client *storage.Client
	bucket string
}

var (
	GCSBackend *GoogleCloudStorageBackend
)

func InitGCSBackend() {
	client, err := storage.NewClient(context.Background())
	if err != nil {
		fmt.Printf("storage.NewClient: %v", err)
	}

	GCSBackend = &GoogleCloudStorageBackend{
		client: client,
		bucket: constants.GCS_BUCKET,
	}
}

// save file to gcs
func (backend *GoogleCloudStorageBackend) SaveToGCS(r io.Reader, objectName string) (string, error) {
	ctx := context.Background()
	// backend.bucket := "bucket - name"
	object := backend.client.Bucket(backend.bucket).Object(objectName)

	// Upload an object with storage.Writer.
	wc := object.NewWriter(ctx)
	if _, err := io.Copy(wc, r); err != nil {
		// fmt.Printf("%v\n", err)
		return "", fmt.Errorf("failed to copy object: %w", err)
	}

	if err := wc.Close(); err != nil {
		// fmt.Printf("%v\n", err)
		return "", fmt.Errorf("failed to close object: %w", err)
	}

	// set public read permissions
	if err := object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
		return "", fmt.Errorf("failed to set ACL for object: %w", err)
	}

	//  retrieve the attributes of an object
	attrs, err := object.Attrs(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to retrieve attributes of an object: %w", err)
	}

	fmt.Printf("File is saved to GCS: %s\n", attrs.MediaLink)
	return attrs.MediaLink, nil
}
