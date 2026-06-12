require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); 
app.use(express.json()); 

const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY;
const FLOW_ID = process.env.FLOW_ID;

// Use localhost for their local testing
const langflowURL = `http://127.0.0.1:7860/api/v1/run/${FLOW_ID}`;

console.log("--- Boot Sequence Checks ---");
if (!FLOW_ID) {
    console.log("🚨 WARNING: FLOW_ID is missing!");
} else {
    console.log("✅ FLOW_ID loaded successfully!");
}

app.post('/api/guidance', async (req, res) => {
    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'Please provide profile details.' });
    }

    try {
        const langflowURL = `http://127.0.0.1:7860/api/v1/run/${FLOW_ID}`;
        console.log(`Contacting LearnMate AI at: ${langflowURL}`);
        
        const response = await axios.post(
            langflowURL, 
            {
                input_value: userInput,
                input_type: 'chat',
                output_type: 'chat',
                tweaks: {} 
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LANGFLOW_API_KEY}`
                }
            }
        );

        // --- THE FIX: EXTRACT ONLY THE TEXT ---
        let aiText = "";
        try {
            // Langflow hides the text deep inside this exact path
            aiText = response.data.outputs[0].outputs[0].results.message.text;
            console.log("✅ Successfully extracted AI text!");
        } catch (parseError) {
            console.log("⚠️ Could not find exact text path, sending raw data as fallback.");
            aiText = JSON.stringify(response.data, null, 2);
        }

        // Send ONLY the clean text back to the React UI
        res.json({ data: aiText });

    } catch (error) {
        console.error('--- Backend Bridge Error ---');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Langflow Details:', error.response.data);
        }
        res.status(500).json({ error: 'Failed to communicate with the local AI engine.' });
    }
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend bridge is actively listening on http://localhost:${PORT}`);
});