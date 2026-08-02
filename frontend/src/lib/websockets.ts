const socket = new WebSocket(import.meta.env.VITE_WS_URL);

socket.onopen = () => {
  console.log("Connected to WebSocket");

  socket.send(
    JSON.stringify({
      type: "AUTH",
      userId: "123", // We'll replace this with the logged-in user's ID later
    })
  );
};

socket.onmessage = (event) => {
  console.log("Message from server:", event.data);
};

export default socket;