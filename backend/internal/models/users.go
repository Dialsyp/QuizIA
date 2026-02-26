package models

import (
	"encoding/gob"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID         bson.ObjectID `bson:"_id,omitempty" json:"id"`
	FirstName  string        `bson:"first_name" json:"first_name"`
	LastName   string        `bson:"last_name" json:"last_name"`
	Email      string        `bson:"email" json:"email"`
	Provider   string        `bson:"provider" json:"provider"`
	ProviderID string        `bson:"provider_id" json:"provider_id"`
	CreatedAt  time.Time     `bson:"created_at" json:"created_at"`
	UpdatedAt  time.Time     `bson:"updated_at" json:"updated_at"`
	AvatarURL  string        `bson:"avatar_url" json:"avatar_url"`
}

type SessionUser struct {
	ID        string
	Email     string
	Name      string
	FirstName string
	LastName  string
	Avatar    string
	Provider  string
}

func init() {
	gob.Register(SessionUser{})
}