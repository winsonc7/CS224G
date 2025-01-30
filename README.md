To contribute new code, create a branch with the naming format "FIRSTNAME-BRANCH-REASON" (for example, winson-cot-prompts).

# Project Setup

## 1. Obtain OpenAI API Key

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

---
