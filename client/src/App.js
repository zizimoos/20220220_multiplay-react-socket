import { useEffect, useRef } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import Player from "./player";
import controls from "./controls";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const socket = io.connect("http://localhost:3001");

function App() {
  const canvasRef = useRef();
  const ctx = useRef();
  let players = [];

  socket.on("init", ({ id, playersArryServer }) => {
    console.log("init", id, playersArryServer);

    const player = new Player({ id });
    controls(player, socket);

    socket.emit("new-player", player);
    //for other players
    socket.on("new-player", (obj) => {
      players.push(new Player(obj));
    });
    socket.on("move-player", ({ id, dir }) => {
      players.find((p) => p.id === id).move(dir);
    });
    socket.on("stop-player", ({ id, dir }) => {
      players.find((p) => p.id === id).stop(dir);
    });

    // players.push(player);
    const prePlayers = playersArryServer.map((p) => new Player(p));
    players = [...prePlayers, player];
  });

  const draw = () => {
    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    players.forEach((p) => p.draw(ctx.current));
    requestAnimationFrame(draw);
  };

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }

    draw();
  }, [players]);

  return (
    <Container>
      <canvas
        style={{
          border: "1px solid #000",
          backgroundColor: "black",
        }}
        width={800}
        height={600}
        ref={canvasRef}
      />
    </Container>
  );
}

export default App;
