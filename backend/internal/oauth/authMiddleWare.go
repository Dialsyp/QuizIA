package oauth

import (
	"QuizIA/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		session, _ := gothic.Store.Get(c.Request, "auth-session")
		user, ok := session.Values["user"].(models.SessionUser)

		if !ok || user == (models.SessionUser{}) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"error": "Not authenticated",
			})
			return
		}

		c.Set("user", user)

		c.Next()
	}
}
