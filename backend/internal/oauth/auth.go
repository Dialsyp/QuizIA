package oauth

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
)

const (
	MaxAge  = 86400 * 30
	IsProd  = true

)

func NewAuth(){
    err := godotenv.Load()
    if err != nil {
        log.Fatal("error loading .env file")
    }

    googleClientID := os.Getenv("GOOGLE_CLIENT_ID")
    googleClientSecret := os.Getenv("GOOGLE_SECRET_ID")

    if googleClientID == "" || googleClientSecret == "" {
        log.Fatal("GOOGLE_CLIENT_ID or GOOGLE_SECRET_ID not set in environment")
    }
    key := []byte(os.Getenv("COOKIE_SECRET_KEY"))
    store := sessions.NewCookieStore(key)
    store.MaxAge(MaxAge)

    store.Options.Path = "/"
    store.Options.HttpOnly = true
    store.Options.SameSite = http.SameSiteNoneMode
    store.Options.Secure = isProd

    gothic.Store = store

    goth.UseProviders(
        google.New(googleClientID, googleClientSecret, os.Getenv("VITE_URL_BACKEND")+"/auth/google/callback", "email", "profile", ),
    )
    
}
