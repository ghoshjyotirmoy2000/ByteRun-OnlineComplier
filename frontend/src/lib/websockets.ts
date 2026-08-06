const socket = new WebSocket(import.meta.env.VITE_WS_URL);

socket.onopen = () => {
  console.log("Connected to WebSocket");
};

socket.onmessage = (event) => {
  console.log("Message from server:", event.data);
};

export function authenticateSocket(userId: string) {
  const send = () => socket.send(JSON.stringify({ type: "AUTH", userId }));

  if (socket.readyState === WebSocket.OPEN) {
    send();
  } else {
    socket.addEventListener("open", send, { once: true });
  }
}

export default socket;