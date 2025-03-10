document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Together AI API 設定
    const TOGETHER_API_KEY = "3a1de39e3c6be2425f3e251c3271bca622b8f0156c3a9fa25f78149d05a1c5dd"; 
    const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

    // 監聽按鈕點擊 & Enter 鍵
    sendBtn.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") sendMessage();
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        // 新增使用者訊息
        addMessage(message, "user-message");

        // 清空輸入框
        userInput.value = "";

        // 呼叫 Together AI API
        fetchTogetherAIResponse(message);
    }

    function fetchTogetherAIResponse(userMessage) {
        // 顯示 "正在回覆..."
        addMessage("正在回覆...", "bot-message");

        // 發送請求到 Together AI 伺服器
        fetch(TOGETHER_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${TOGETHER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo", // 使用 Together AI 提供的 Llama 3.3 70B
                messages: [{ role: "system", content: "你是一個友善的 AI 助手。" },
                           { role: "user", content: userMessage }],
                max_tokens: 200
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.choices && data.choices.length > 0) {
                const aiReply = data.choices[0].message.content.trim();
                updateLastMessage(aiReply);
            } else {
                updateLastMessage("⚠️ AI 沒有回應，請稍後再試！");
            }
        })
        .catch(error => {
            console.error("Together AI API 錯誤:", error);
            updateLastMessage("⚠️ 無法連接 Together AI，請檢查 API Key！");
        });
    }

    function addMessage(text, className) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", className);

        if (className === "bot-message") {
            const botName = document.createElement("span");
            botName.classList.add("bot-name");
            botName.innerText = "Together AI";
            msgDiv.appendChild(botName);
        }

        const textNode = document.createElement("p");
        textNode.innerText = text;
        msgDiv.appendChild(textNode);

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // 自動滾動到底部
    }

    function updateLastMessage(newText) {
        const messages = document.querySelectorAll(".bot-message p");
        if (messages.length > 0) {
            messages[messages.length - 1].innerText = newText;
        }
    }
});
