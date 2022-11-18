import React from "react";
import Phaser from "phaser";
import { useState, useEffect } from "react";
import Escena from "./components/Escena";

function App() {
  //Uso state de una variable listo, si no usamos esto los lienzos se acumularán en la vista
  const [listo, setListo] = useState(false);

  //Usamos el hook para que renderice acciones que react no hace
  useEffect(() =>{
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 100},
          debug: false
        }
      },
      scene:[Escena]
      //scene: {
      //  preload: preload,
      //  create: create
      //}
    };

    //Arranca el juego
    const game = new Phaser.Game(config);

    //Trigger cuando el juego esta completamente listo
    game.events.on("LISTO", setListo)

    //Si no pongo esto, se acumulan los duplicados del lienzo
    return () => {
      setListo(false);
      game.destroy(true);
    }
  }, [listo]);
}

export default App;