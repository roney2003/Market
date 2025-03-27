import React, { useEffect, useState } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [chatResponse, setChatResponse] = useState("");

  useEffect(() => {
    // Zapier iframe se response extract karne ka simulation (actual implementation alag hoga)
    const handleMessage = (event) => {
      if (event.data && typeof event.data === "string") {
        setChatResponse(event.data);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="chatbot">
      <iframe
        src="https://interfaces.zapier.com/embed/chatbot/cm8omx267001f4nw926t9a2zi"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
      ></iframe>
      {chatResponse.includes("Here’s a comparison graph:") && (
        <div>
          <img src={extractUrl(chatResponse)} alt="Comparison Graph" />
        </div>
      )}
    </div>
  );
};

const extractUrl = (text) => {
  const match = text.match(/https:\/\/quickchart\.io\/chart\?c=[^ ]+/);
  return match ? match[0] : "";
};

export default Chatbot;