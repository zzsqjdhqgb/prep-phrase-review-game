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