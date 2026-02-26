package server

import (
	"QuizIA/internal/models"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/markbates/goth/gothic"
)

func (s *Server) GetAuthCallbackFunction(c *gin.Context) {
	provider := c.Param("provider")
	if provider == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "provider not specified"})
		return
	}

	q := c.Request.URL.Query()
	q.Add("provider", provider)
	c.Request.URL.RawQuery = q.Encode()

	log.Println("Cookies:", c.Request.Cookies())
	log.Println("URL:", c.Request.URL.String())

	user, err := gothic.CompleteUserAuth(c.Writer, c.Request)
	if err != nil {
		log.Println("Auth error:", err)
		c.String(http.StatusBadRequest, err.Error())
		return
	}
	log.Println("User:", user)

	// Create user in database
	userModel := models.User{
		FirstName:  user.FirstName,
		LastName:   user.LastName,
		Email:      user.Email,
		Provider:   user.Provider,
		ProviderID: user.UserID,
		AvatarURL:  user.AvatarURL,
	}
	err = s.db.InsertUser(userModel)
	if err != nil {
		log.Println("Error inserting user:", err)
		// Maybe still redirect, or handle error
	}

	session, _ := gothic.Store.Get(c.Request, "auth-session")
	if err != nil {
		log.Println("Error getting session:", err)
	} else {
		session.Values["user"] = models.SessionUser{
			ID:        user.UserID,
			Email:     user.Email,
			Name:      user.Name,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Avatar:    user.AvatarURL,
			Provider:  user.Provider,
		}
		err = session.Save(c.Request, c.Writer)
		if err != nil {
			log.Println("Error saving session:", err)
		}
	}

	log.Printf("User %s authenticated successfully with provider %s", user.Email, user.Provider)
	log.Printf("Session data: %v", session.Values)

	http.Redirect(c.Writer, c.Request, "http://localhost:5173?user="+user.Email, http.StatusFound)
	// c.JSON(http.StatusOK, user)
}

func (s *Server) GetCurrentUser(c *gin.Context) {
	// Get session
	session, err := gothic.Store.Get(c.Request, "auth-session")

	log.Println("getCurrentUser called, session data:", session)

	if err != nil {
		log.Println("Error getting session:", err)
		c.JSON(http.StatusOK, gin.H{"user": nil})
		return
	}

	userData, ok := session.Values["user"].(models.SessionUser)
	if !ok {
		c.JSON(http.StatusOK, gin.H{"user": nil})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": userData})
}


func (s *Server) LogoutProvider(c *gin.Context) {
	provider := c.Param("provider")
	if provider == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "provider not specified"})
		return
	}

	// Injecter le provider dans la query pour gothic
	q := c.Request.URL.Query()
	q.Add("provider", provider)
	c.Request.URL.RawQuery = q.Encode()

	err := gothic.Logout(c.Writer, c.Request)
	session, _ := gothic.Store.Get(c.Request, "auth-session")
	session.Options.MaxAge = -1
	session.Save(c.Request, c.Writer)
	if err != nil {
		log.Printf("Erreur lors du logout: %v", err)
	}

	c.Redirect(http.StatusTemporaryRedirect, "http://localhost:5173/")
}

func (s *Server) LoginProvider(c *gin.Context) {
	provider := c.Param("provider")
	if provider == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "provider not specified"})
		return
	}

	// Injecter le provider dans le contexte
	q := c.Request.URL.Query()
	q.Add("provider", provider)
	c.Request.URL.RawQuery = q.Encode()

	authURL, err := gothic.GetAuthURL(c.Writer, c.Request)
	if err != nil {
		log.Printf("Erreur lors de la génération de l'URL d'authentification: %v", err)
		c.String(http.StatusInternalServerError, "Erreur lors de la génération de l'URL d'authentification")
		return
	}

	if provider == "google" {
		if strings.Contains(authURL, "?") {
			// L'URL contient déjà des paramètres, ajouter avec &
			authURL += "&prompt=select_account"
		} else {
			// L'URL ne contient pas encore de paramètres, ajouter avec ?
			authURL += "?prompt=select_account"
		}
	}

	// Rediriger vers l'URL d'authentification modifiée
	c.Redirect(http.StatusTemporaryRedirect, authURL)
}
