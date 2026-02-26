package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"QuizIA/internal/models"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type Service interface {
	Health() map[string]string
	InsertUser(user models.User) error
	SaveTopic(topic models.Topic) (string, error)
	GetTopicByID(id bson.ObjectID) (models.Topic, error)
}

type service struct {
	db *mongo.Client
}

var (
	host     = os.Getenv("BLUEPRINT_DB_HOST")
	port     = os.Getenv("BLUEPRINT_DB_PORT")
	database = os.Getenv("BLUEPRINT_DB_DATABASE")
)

func New() Service {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
	connectionString := os.Getenv("MONGODB_URI")

	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(connectionString).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(opts)

	if err != nil {
		log.Fatal(err)

	}
	return &service{
		db: client,
	}
}

func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	err := s.db.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("db down: %v", err)
	}

	return map[string]string{
		"message": "It's healthy",
	}
}

func (s *service) InsertUser(user models.User) error {
	dbEnv := os.Getenv("MONGODB_DATABASE")

	if dbEnv == "" {
		return fmt.Errorf("database not found: %s", os.Getenv("MONGODB_DATABASE"))
	}

	collection := s.db.Database(dbEnv).Collection("users")

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, user)
	if err != nil {
		return err
	}

	fmt.Println("Inserted user with id:", result.InsertedID)
	return nil
}

func (s *service) SaveTopic(topic models.Topic) (string, error) {
	dbEnv := os.Getenv("MONGODB_DATABASE")
	
	if dbEnv == "" {
		return "", fmt.Errorf("database not found: %s", os.Getenv("MONGODB_DATABASE"))
	}

	collection := s.db.Database(dbEnv).Collection("topics")
	
	topic.CreatedAt = time.Now()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	result , err := collection.InsertOne(ctx, topic)
	if err != nil {
		return "", err
	}
	
	fmt.Println("Inserted topic with id:", result.InsertedID)
	oid, ok := result.InsertedID.(bson.ObjectID)
    if !ok {
        return "", fmt.Errorf("failed to convert InsertedID to ObjectID")
    }

	return oid.Hex(), nil
}

func (s *service) GetTopicByID(id bson.ObjectID) (models.Topic, error) {
	dbEnv := os.Getenv("MONGODB_DATABASE")
	
	if dbEnv == "" {
		return models.Topic{}, fmt.Errorf("database not found: %s", os.Getenv("MONGODB_DATABASE"))
	}

	collection := s.db.Database(dbEnv).Collection("topics")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	
	filter := bson.D{{"_id", id}}
	opts := options.FindOne().SetProjection(bson.D{{"ai_response", 1}})


	var topic models.Topic
	err := collection.FindOne(ctx, filter, opts).Decode(&topic)
	
	if err != nil {
		return models.Topic{}, err
	}
	
	return topic, nil
}