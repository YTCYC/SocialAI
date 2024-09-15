package constants

import (
	"crypto/tls"
	"crypto/x509"
	"net/http"
	"os"

	"github.com/olivere/elastic/v7"
)

func NewElasticsearchClient() (*elastic.Client, error) {
    caCert, err := os.ReadFile("/path/to/elasticsearch/certificate/http_ca.crt")
    if err != nil {
        return nil, err
    }

    caCertPool := x509.NewCertPool()
    caCertPool.AppendCertsFromPEM(caCert)

    httpClient := &http.Client{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{
                RootCAs: caCertPool,
            },
        },
    }

    client, err := elastic.NewClient(
        elastic.SetURL("https://localhost:9200"),
        elastic.SetHttpClient(httpClient),
    )

    if err != nil {
        return nil, err
    }

    return client, nil
}
