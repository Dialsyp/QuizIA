package server

import (
	"QuizIA/internal/constant"
	"QuizIA/internal/models/requests"
	"QuizIA/internal/models"
	"QuizIA/internal/models/responses"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func (s *Server) RespondQuiz(c *gin.Context)  {

	var req requests.CorrectionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	TopicModel, err := s.db.GetTopicByID(req.TopicID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"ai_response": TopicModel.AIResponse,
	})

}

func (s *Server) GenerateQuiz(c *gin.Context) {

	var req requests.TopicRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	log.Printf("Received quiz generation request: topic=%s, level=%s, quiz_type=%v",
		req.Topic, req.Level, req.QuizType)

	prompt := constant.GetPrompt(req.Language, req.Topic, req.QuizType, req.Level)

	var aiResp responses.AIQuizResponse
	var lastErr error

	for attempt := 1; attempt <= 5; attempt++ {

		log.Printf("AI generation attempt %d", attempt)

		aiRaw, err := s.ai.GenerateQuiz(prompt)
		if err != nil {
			log.Println("AI generation error:", err)
			lastErr = err
			continue
		}

		if err := json.Unmarshal([]byte(aiRaw), &aiResp); err != nil {
			log.Println("Invalid JSON from AI:", err)
			lastErr = err
			continue
		}

		if aiResp.Topic == "" || len(aiResp.Questions) == 0 {
			lastErr = err
			continue
		}

		valid := true

		for _, q := range aiResp.Questions {

			if q.Question == "" || q.Answer == "" || q.Explanation == "" {
				valid = false
				break
			}

			if (q.Type == "qcm" || q.Type == "single_choice") && len(q.Options) < 2 {
				valid = false
				break
			}

			if q.Type == "true_false" && len(q.Options) != 2 {
				valid = false
				break
			}
		}

		if !valid {
			lastErr = err
			continue
		}

		lastErr = nil
		break
	}

	if lastErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate valid quiz"})
		return
	}

	var questions []responses.QuizQuestion

	for _, q := range aiResp.Questions {
		questions = append(questions, responses.QuizQuestion{
			Type:        q.Type,
			Question:    q.Question,
			Options:     q.Options,
		})
	}

		// user, exists := c.Get("user")
		// if !exists {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		// 	return
		// }

		// userID := user.(models.SessionUser).ID
	userID := "100014447254567" 

	TopicModel := models.Topic{
		UserID:    userID,
		Topic:     aiResp.Topic,
		Level:     req.Level,
		QuizType:  req.QuizType,
		AIResponse: aiResp.Questions,
	}

	resultTopic, err := s.db.SaveTopic(TopicModel)
	if err != nil {
		log.Println("Error creating topic in database:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save quiz"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"topic_id":  resultTopic,
		"topic":     aiResp.Topic,
		"questions": questions,
	})
}