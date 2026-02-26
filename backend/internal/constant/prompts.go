package constant

import "strings"

func GetPrompt(
	language string,
	topic string,
	quizType []string,
	level string) string {

	allowedTypes := `"` + strings.Join(quizType, `", "`) + `"`

	return `
		You are a quiz generation engine.

		STRICT RULES:
		- Output MUST be valid JSON.
		- Do NOT add explanations outside JSON.
		- Do NOT add markdown.
		- Do NOT wrap in backticks.
		- Do NOT add extra fields.
		- Response must start with { and end with }.
		- If the format is incorrect, regenerate internally before responding.

		Generate a quiz with mixed question types.

		Topic: ` + topic + `
		Difficulty level: ` + level + `
		Language: ` + language + `

		ALLOWED QUESTION TYPES:
		[` + allowedTypes + `]

		QUESTION TYPE RULES:
		- "qcm" → exactly 4 options, exactly 1 correct answer
		- "true_false" → options must be ["True", "False"]
		- "single_choice" → exactly 3 options, exactly 1 correct answer

		IMPORTANT OPTION RULES:
		- "options" MUST be a valid JSON array.
		- Each option MUST be a separate string inside the array.
		- Options MUST be separated by commas.
		- Options MUST be unique.
		- Do NOT return options as a single comma-separated string.
		- Example of VALID format:
		"options": ["Option A", "Option B", "Option C", "Option D"]

		DIFFICULTY RULES:
		- beginner → basic definitions and fundamental concepts
		- intermediate → applied knowledge and comparisons
		- advanced → deep reasoning, edge cases, scenario-based questions


			RESPONSE FORMAT (STRICT):

		{
		"topic": "` + topic + `",
		"questions": [
			{
			"type": "one value from allowed types",
			"question": "string",
			"options": ["string", "string", ...],
			"answer": "string",
			"explanation": "string"
			}
		]
		}

		CONSTRAINTS:
		- Generate between 4 and 6 questions.
		- Each question.type MUST be one of the allowed types.
		- Mix types when multiple types are allowed.
		- "answer" must exactly match one value inside "options".
		- No empty fields.
		- ensure all options are unique and separated by commas.
		- Ensure syntactically valid JSON.
		`
		}
