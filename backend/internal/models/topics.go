package models

import (
	"go.mongodb.org/mongo-driver/v2/bson"
	"time"
	"QuizIA/internal/models/responses"

)

type Topic struct {
	ID     bson.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID string        `bson:"user_id" json:"user_id"`
	Topic    string `bson:"topic" json:"topic"`
	Level    string `bson:"level" json:"level"`
	
	QuizType []string `bson:"quiz_type" json:"quiz_type"`
	AIResponse []responses.IAQuizQuestion `bson:"ai_response" json:"ai_response"`
	CreatedAt time.Time `bson:"created_at" json:"created_at"`
}

