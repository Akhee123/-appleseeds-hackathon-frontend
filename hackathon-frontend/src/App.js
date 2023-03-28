import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";

const socket = io.connect("https://chat-api-kp6i.onrender.com/", {
  transports: ["websocket"],
});

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  const [translatedText, setTranslatedText] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("source_language", "he");
    encodedParams.append("target_language", "ar");
    encodedParams.append("text", `${message}`);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "52f19da703msh32ec53ffcb1ac43p1d86b6jsn763f57f12920",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then(function (response) {
        //console.log(response.data);

        setTranslatedText([
          ...translatedText,
          response.data.data.translatedText,
        ]);
        const oldArr = JSON.parse(localStorage.getItem("translated"));
        oldArr.push(response.data.data.translatedText);
        localStorage.setItem("translated", JSON.stringify(oldArr));
        // setTranslatedText([...translatedText, message]);
      })
      .catch(function (error) {
        console.error(error);
      });

    setMessageHistory([...messageHistory, message]);
    setMessage("");

    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setTranslatedText([...translatedText, data.message]);
      setTranslatedText([...translatedText, message]);
      setMessageReceived(data.message);
    });
  }, [socket]);

  useEffect(() => {
    localStorage.setItem("translated", JSON.stringify([]));
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
      {messageHistory?.map((message) => (
        <div key={Math.random()}>messageHistory:{message}</div>
      ))}
      {translatedText?.map((message) => (
        <div key={Math.random()}>translatedText:{message}</div>
      ))}
    </div>
  );
}

export default App;
