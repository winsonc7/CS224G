Hi! 👋 We’re building Talk2Me, an affordable AI therapy solution which can serve as an on-demand, low-cost resource for crisis support, emotional expression, and preliminary mental health insights. Continue reading to learn how to run our agent!

Info on general sprint progress and individual contributions are in the `progress` folder.

[Link to Sprint 1 progress and contributions](https://github.com/winsonc7/CS224G/blob/main/progress/SPRINT_ONE.md)

# Project Setup 🤖

## 1. Obtain OpenAI/ElevenLabs API keys and set ElevenLabs audio agent ID

To run the agent, you'll need a OpenAI API key, ElevenLabs API key, and set the audio agent ID (aB08fUqZnmePxNvmkWTM).

Chat with the agent directly in the browser [here](https://elevenlabs.io/app/talk-to?agent_id=aB08fUqZnmePxNvmkWTM)

### a. Run the following commands in your shell to set the API key:

  ```bash
  export OPENAI_API_KEY=xxxxx
  export ELEVENLABS_API_KEY=xxxxx
  export ELEVENLABS_AGENT_ID=aB08fUqZnmePxNvmkWTM
  ```

  Replace `xxxxx` with your actual API keys.

### b.  Save the API keys and audio agent ID in a .env file

  For a more permanent and secure setup, you can store your API key in a `.env` file and manage through the `python-dotenv` library. Follow these steps:

- Create a .env file

  At the root of this repository, create a file named `.env`

- Add the API Key to `.env`

  Open the `.env` file in a text editor and add the following line:

  ```
  OPENAI_API_KEY=xxxxx
  ELEVENLABS_API_KEY=xxxxx
  ELEVENLABS_AGENT_ID=aB08fUqZnmePxNvmkWTM
  ```

  Replace `xxxxx` with your actual API keys.

- `.gitignore` file is already set up to ignore `.env` file by Git
  
## 2. Install Dependencies w/ Poetry

This project manages dependencies using Poetry. Follow these steps:

### a. Install Poetry (if not already installed)

If Poetry is not installed, you can install it globally using the following command:

  ```bash
  curl -sSL https://install.python-poetry.org | python3 -
  ```

If you run into issues, check out the [Poetry docs](https://python-poetry.org/docs/#installing-with-the-official-installer) for help.

### b. Install / update dependencies

Install all project dependencies by running:

  ```bash
  poetry install --no-root
  ```
---

# Running the Agent

## 1. Start the Backend

To run the agent, follow these steps:

1. Ensure you're in the root directory (for .env to properly load in the code) and run the agent in Poetry's virtual environment:

   ```bash
   poetry run python backend/run.py
   ```
  
2. To quit, press Ctrl+C or type 'exit'.
---
# Developer Culture 🔧
- If you’re working on a task, create an issue for it and assign it to yourself. Write updates as comments on your issue until you complete your task, upon which you can close your issue.
- If you’re writing new code, create a branch with the naming format "FIRSTNAME-BRANCH-REASON" (for example, winson-cot-prompts).
- The main branch should ideally never have any bugs, and represents our overall progress. **Commits should only be pushed to main in the cases of (1) minor bug fixes or (2) markdown file updates.**
- When you want to merge your changes to main, submit a pull request and have another team member review your code prior to completing the merge. For cleanliness, make sure to delete your branch after it's been merged.
