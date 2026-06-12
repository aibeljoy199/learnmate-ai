# LearnMate AI

An AI-powered profile analyzer built using React, Node.js, and Langflow (integrated with IBM watsonx.ai).

## Setup Instructions

### 1. IBM Cloud & Langflow Setup
1. Ensure Langflow is installed and running locally on port 7860.
2. Inside the Langflow dashboard, click **Import** and upload the `learnmate_flow.json` file provided in this repository.
3. Open the newly imported flow. Inside the IBM LLM component, you must provide your own IBM Cloud credentials:
   - **IBM Cloud API Key** (Found via Profile and Settings > API Key)
   - **watsonx Project ID** (Found via your Watsonx Project > Manage tab > Details)

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on the provided `.env.example`.
4. Add your Langflow API Key and Flow ID to the `.env` file.
5. Start the server: `node server.js` (runs on port 3000)

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

IBM Cloud Configuration (For watsonx.ai Integration)
To enable the AI capabilities in this project, you must provide your own IBM Cloud credentials. Follow these steps to generate them:

How to get your IBM Cloud API Key:
Log in to your IBM Cloud account.

From the top navigation bar, click on your Avatar/Profile icon.

Select Profile and settings.

In the left-hand menu, navigate to API keys.

Click Create (or Generate new key).

Give it a name (e.g., "LearnMate_Key"), click Create, and copy the key immediately. Note: For security, IBM will not show this key again.

How to get your watsonx.ai Project ID:
Navigate to the watsonx.ai dashboard.

Select your specific project from the list.

Click on the Manage tab in the top menu bar.

On the General page, locate the Details section.

Copy the alphanumeric string listed next to Project ID