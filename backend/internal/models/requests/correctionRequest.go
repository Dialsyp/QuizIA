package requests

import "go.mongodb.org/mongo-driver/v2/bson"

type CorrectionRequest struct {
	TopicID   bson.ObjectID `json:"topic_id"`
}

type QuestionAnswer struct {	
	Question string `json:"question"`
	Answer   string `json:"answer"`
}
	