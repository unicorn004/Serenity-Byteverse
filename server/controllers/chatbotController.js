const chatWithBot = async (req, res) => {
    try {
        const userMessage = req.body.message;
        const botResponse = `You said: "${userMessage}"`;  // replace w/ actual chatbot logic

        res.json({ response: botResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { chatWithBot };