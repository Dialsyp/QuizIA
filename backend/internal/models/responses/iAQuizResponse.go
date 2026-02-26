package responses


type IAQuizQuestion struct {
	Type string `bson:"type" json:"type"`

	Question string `bson:"question" json:"question"`

	Options []string `bson:"options" json:"options"`

	Answer string `bson:"answer" json:"answer"`

	Explanation string `bson:"explanation" json:"explanation"`
}

type AIQuizResponse struct {
	Topic    string         `json:"topic"`
	Questions []IAQuizQuestion  `json:"questions"`
}
