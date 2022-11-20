import Phaser from "phaser";

class Escena extends Phaser.Scene {

    //Se cargan variables globales (se pueden usar constructores pero podrían dar problemas a futuro)
    plataforms = null;
    player = null;
    cursors = null;
    stars = null;
    bombs = null;
    gameOver = false;
    score = 0;
    scoreText;
    //Carga todos los recursos iniciales del juego que se van a utilizar (imagenes, sprites y sonido)
    preload() {
        this.load.image("sky", "img/sky.png");
        this.load.image("ground", "img/plataform.png");
        this.load.image("star", "img/star.png");
        this.load.image("bomb", "img/bomb.png");
        this.load.spritesheet("dude", "img/dude.png", { frameWidth: 32, frameHeight: 48 });
    }
    //Muestra lo que se verá en pantalla
    create() {
        //Se crea el fondo
        this.add.image(400, 300, "sky");
        //Se crean las plataformas
        this.plataforms = this.physics.add.staticGroup();

        this.plataforms.create(400, 568, "ground").setScale(2).refreshBody();

        this.plataforms.create(600, 400, "ground");
        this.plataforms.create(50, 250, "ground");
        this.plataforms.create(750, 220, "ground");

        //Al personaje se le asigna el sprite
        this.player = this.physics.add.sprite(100, 300, "dude");

        //Seteando rebote y el choque con los límites del canva
        this.player.setBounce(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(100);

        //Se crean los movimientos (que serán utilizados en el update)
        this.anims.create({
            key: "izquierda",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        //Agregando estrellas
        this.stars = this.physics.add.group({
            key: "star",
            repeat: 13,
            setXY: { x: 12, 7: 0, stepX: 60 }
        });

        //Esto si genera el rebote del grupo
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        //Rebote contra las plataformas
        this.physics.add.collider(this.player, this.plataforms);
        this.physics.add.collider(this.stars, this.plataforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        //Choque de las estrellas con el jugador
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        //Agregamos el texto
        this.scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "32px", fill: "#000" });

        //Agregamos las bombas y algunos colliders
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.plataforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    //Se ejectua constantemente, aqui van los movimientos, animaciones, acciones, presionar teclas, etc
    update() {
        if (this.gameOver) {
            return;
        }
        //Movimientos según el cursor del teclado
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play("izquierda", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn");
        }
        //Salto según el personaje esté en el suelo y si se presiona la tecla arriba
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
        }
    }
    //Se llama desde el collider entre el jugador y las bombas
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.gameOver = true;
    }
    //Se llama desde el collider entre el jugador y las estrellas
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }
}
export default Escena;