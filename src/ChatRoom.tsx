import  { useEffect, useRef, useState } from "react";

const ChatRoom = () => {

    const wsRef = useRef<WebSocket | null>(null);


    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onmessage = (event) => {
            setMessages(s => [...s , {text : event.data , fromMe : false}]);
        }
        wsRef.current = ws;

        return () => {
            ws.close();
        }
    }, []);


  const [messages, setMessages] = useState([
    { text: "Hello!", fromMe: false },
    { text: "Hey! What's up?", fromMe: true },
  ]);
  const [input, setInput] = useState("");
  // const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, fromMe: true }]);
      setInput("");
      wsRef.current?.send(JSON.stringify(input));
    }
  };

  return (
    <div className="flex flex-col h-screen w-full  ">
      {/* Header */}
      <div className="p-4 bg-green-600 text-white text-lg font-semibold text-center">
        Room Name
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 flex   max-w-xs ${
              msg.fromMe
                ? " self-end ml-auto"
                : " self-start mr-auto"
            }`}
          >
            <span
                className={`py-2 px-4 rounded-lg shadow max-w-xs break-words ${
                    msg.fromMe ? "bg-green-200 ml-auto" : "bg-white mr-auto"
                }`}
                
            >
                {msg.text}
            </span>
            
          </div>
        ))}
        
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
