Hi! 👋 We’re building Talk2Me, an affordable AI therapy solution which can serve as an on-demand, low-cost resource for crisis support, emotional expression, and preliminary mental health insights. Continue reading to learn how to run our agent!

# Project Setup 🤖

## 1. Obtain OpenAI API key

To run the agent, you'll need a OpenAI API key.

### a. Run the following command in your shell to set the API key:

  ```bash
  export OPENAI_API_KEY=xxxxx
  ```

  Replace `xxxxx` with your actual API key.

### b.  Save the API key in a .env file

  For a more permanent and secure setup, you can store your API key in a `.env` file and manage through the `python-dotenv` library. Follow these steps:

- Create a .env file
  At the root of this repository, create a file named `.env`

- Add the API Key to `.env`
  Open the `.env` file in a text editor and add the following line:

  ```
  OPENAI_API_KEY=xxxxx
  ```

  Replace `xxxxx` with your actual API key.

- `.gitignore` file is already set up to ignore `.env` file by Git
  
## 2. Install Dependencies

Install the Python openai library. Run:

  ```bash
  pip install openai
  ```

Install the python-dotenv library. Run:
  ```bash
  pip install python-dotenv
  ```

---

# Running the Agent

## 1. Start the Backend

To run the agent, follow these steps:

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Run the agent with:

   ```bash
   python run.py
   ```
   Press Ctrl+C or type 'exit' to quit.
---
# Developer Culture 🔧
- If you’re working on a task, create an issue for it and assign it to yourself. Write updates as comments on your issue until you complete your task, upon which you can close your issue.
- If you’re writing new code, create a branch with the naming format "FIRSTNAME-BRANCH-REASON" (for example, winson-cot-prompts). 
- The main branch should ideally never have any bugs, and represents our overall progress. When you want to merge your changes to main, submit a pull request and have another team member review your code prior to completing the merge.
