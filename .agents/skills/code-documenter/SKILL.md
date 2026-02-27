---
name: code-documenter
description: 
    Use this skill to document the changes made after each successfull implementation. 
---

# Code-Documenter
    This skill instructs agent to document everything they did after successfull implementation.

## Workflow
### File creation
Use the following script to create a file and write documentation
```bash
cd ./progress
touch "file_$(date +%Y-%m-%d_%H-%M-%S).md"
```
### File format
Must include
- Changes made (Concise)
- Why - Reason (Descriptive)
- When can this be replicated