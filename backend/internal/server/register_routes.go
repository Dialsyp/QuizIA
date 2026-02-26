package server

import (
	"QuizIA/internal/oauth"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"os"
)

func (s *Server) RegisterRoutes() http.Handler {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{os.Getenv("VITE_URL_FRONTEND")},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/auth/:provider/callback", s.GetAuthCallbackFunction)
	r.GET("/auth/:provider", s.LoginProvider)
	r.POST("/api/respondQuiz", s.RespondQuiz)
	r.POST("/api/generateQuiz", s.GenerateQuiz)
	r.Use(oauth.AuthRequired())
	{
		r.GET("/logout/:provider", s.LogoutProvider)
		r.GET("/api/CurrentUser", s.GetCurrentUser)
		
		
	}

	return r
}
