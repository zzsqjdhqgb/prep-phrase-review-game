# AI Prompt Guide

# Quiz Data Format

The quiz data should be a JSON array of objects. Each object must contain these fields:

- sentence: A string containing "{{blank}}" to mark where the phrase should be filled in
- answer: The correct phrase that should go in the blank
- options: An array of exactly 4 strings, one being the answer
- full: The complete phrase with context

Example:

```json
[
    {
        "sentence": "We should give {{blank}} to environmental protection",
        "answer": "priority",
        "options": ["priority", "issue", "advantage", "attention"],
        "full": "give priority to"
    },
    {
        "sentence": "She takes {{blank}} with his unfair comments",
        "answer": "issue",
        "options": ["priority", "issue", "care", "part"],
        "full": "take issue with"
    }
]
```

# Quiz Index Format

The quiz index should be a JSON object containing a "sets" array. Each set object must contain these fields:

- name: Display name of the quiz set
- description: Brief description of the content
- details: Additional information about the quiz set
- path: Path to the quiz JSON file

Example:
```json
{
  "sets": [
    {
      "name": "Basic Phrases",
      "description": "Common prepositional phrases",
      "details": "Essential phrases for daily use",
      "path": "data/phrases.json"
    }
  ]
}
```

