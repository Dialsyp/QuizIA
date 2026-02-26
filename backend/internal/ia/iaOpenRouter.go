package ai

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
)

type Service interface {
	GenerateQuiz(prompt string) (string, error)
}

type service struct {
	apiKey string
}

func New() Service {

	return &service{
		apiKey: os.Getenv("OPENROUTER_API_KEY"),

	}
}

type openRouterRequest struct {
	Model    string       `json:"model"`
	Messages []aiMessage  `json:"messages"`
}

type aiMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}


func (s *service) GenerateQuiz(prompt string) (string, error) {

	url := "https://openrouter.ai/api/v1/chat/completions"

	reqBody := openRouterRequest{
		Model: "stepfun/step-3.5-flash:free",
		Messages: []aiMessage{
			{
				Role:    "user",
				Content: prompt,
			},
		},
	}

	jsonData, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	client := &http.Client{}

	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var raw map[string]interface{}
	if err := json.Unmarshal(body, &raw); err != nil {
		return "", err
	}

	choices, ok := raw["choices"].([]interface{})
	if !ok || len(choices) == 0 {
		return "", err
	}
	choice := choices[0].(map[string]interface{})
	message:= choice["message"].(map[string]interface{})
	content := message["content"].(string)

	log.Printf("OpenRouter response content: %s", content)
	return content, nil
}