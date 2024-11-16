import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [activeUsers, setActiveUsers] = useState({});

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("connected", newSocket.id);
      setUserId(newSocket.id);
    });

    newSocket.on("userStatus", (userStatus) => {
      setActiveUsers((prevStatus) => ({
        ...prevStatus,
        [userStatus.userId]: userStatus.isActive,
      }));
    });

    newSocket.on("sendingMessage", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...data, sender: false },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket && message.trim()) {
      const msgData = { text: message, sender: true, senderId: userId };
      setMessages((prevMessages) => [...prevMessages, msgData]);
      socket.emit("message", { text: message, senderId: userId });
      setMessage("");
    }
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        marginTop: "20px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        borderRadius: "15px",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        component="div"
        gutterBottom
        align="center"
        style={{ color: "#ffffff", fontWeight: "bold" }}
      >
        Chat Application
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
          alignItems: "center",
        }}
      >
        <div
          style={{ textAlign: "left", display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: activeUsers[userId] ? "green" : "gray",
              marginRight: "5px",
            }}
          />
          <Typography variant="body2" style={{ color: "#aaa" }}>
            {userId}
          </Typography>
        </div>

        {Object.keys(activeUsers).length > 1 && (
          <div
            style={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: activeUsers[
                  Object.keys(activeUsers).find((id) => id !== userId)
                ]
                  ? "green"
                  : "gray",
                marginRight: "5px",
              }}
            />
            <Typography variant="body2" style={{ color: "#aaa" }}>
              {Object.keys(activeUsers).find((id) => id !== userId)}
            </Typography>
          </div>
        )}
      </div>

      <Typography
        variant="h6"
        component="div"
        gutterBottom
        align="center"
        style={{ color: "#ffffff" }}
      >
        {userId}
      </Typography>

      <Paper
        elevation={2}
        style={{
          backgroundColor: "#2c2c2c",
          marginTop: "20px",
          maxHeight: "300px",
          overflow: "auto",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body1" align="center" style={{ color: "#aaa" }}>
            No messages available.
          </Typography>
        ) : (
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: msg.sender ? "flex-end" : "flex-start",
                  marginBottom: "10px",
                }}
              >
                <Box
                  style={{
                    backgroundColor: msg.sender ? "#00796b" : "#424242",
                    color: msg.sender ? "#e0f2f1" : "#ffffff",
                    borderRadius: "15px",
                    padding: "10px 15px",
                    maxWidth: "70%",
                  }}
                >
                  <ListItemText primary={msg.text} />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", marginTop: "20px" }}
      >
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="input"
          label="Type your message"
          variant="outlined"
          InputProps={{
            style: {
              backgroundColor: "#2c2c2c",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
          InputLabelProps={{
            style: { color: "#aaa" },
          }}
        />
        <Button
          variant="contained"
          type="submit"
          style={{
            backgroundColor: "#00796b",
            color: "#fff",
            borderRadius: "20px",
            padding: "10px 20px",
          }}
        >
          Send
        </Button>
      </form>
    </Container>
  );
};

export default App;
