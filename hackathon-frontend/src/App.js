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
  const [messageTrans, setMessageTrans] = useState("");
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
        "X-RapidAPI-Key": "1344c3a46amsh6fd0a404afe4b48p1f8215jsn0e96ab86672e",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then(function (response) {
        setTranslatedText([
          ...translatedText,
          response.data.data.translatedText,
        ]);
        setMessageTrans(response.data.data.translatedText);
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
    const encodedParams = new URLSearchParams();
    encodedParams.append("source_language", "he");
    encodedParams.append("target_language", "ar");
    encodedParams.append("text", `${message}`);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "1344c3a46amsh6fd0a404afe4b48p1f8215jsn0e96ab86672e",
        "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
      },
      data: encodedParams,
    };

    axios
      .request(options)
      .then(function (response) {
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
  }, []);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setTranslatedText([...translatedText, data.message]);
      //setTranslatedText([...translatedText, message]);
      setMessageReceived(data.message);

    });
  }, [socket]);
/*
  useEffect(() => {
    localStorage.setItem("translated", JSON.stringify([]));
    localStorage.setItem("messages", JSON.stringify([]));
  }, []);
  */

  return (
    <div className="App">
      <h1>Welcome to Chat Translation App</h1>
      <div className="container">
        <input
          placeholder="Pick room number..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button className="btn" onClick={joinRoom}>
          Join Room
        </button>
      </div>
      <div className="container">
        <input
          placeholder="Enter message..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button className="btn" onClick={sendMessage}>
          Send Message
        </button>
      </div>
      <h1> Message:</h1>
      <div className="message">
        {messageTrans && JSON.parse(localStorage.getItem('translated')).map((sen) => <p key={sen}>{sen}</p>)}
        {messageHistory?.map((message) => (
          <div key={Math.random()}>{message}</div>
        ))}
        {translatedText?.map((message) => (
          <div key={Math.random()}>{message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
