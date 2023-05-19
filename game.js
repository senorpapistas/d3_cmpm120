class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, 'player');
        scene.add.existing(this);
        this.setScale(.35);
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro');
    }
    create() {
        this.add.text(50, 50, "\n\nClick anywhere to begin.").setFontSize(40);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('menu'));
        });
    }
}

class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }
    preload() {
        this.load.path = './assets/';
        this.load.image('fish2', 'fish2.JPG');
    }
    create() {
        this.cameras.main.setBackgroundColor(0x548bb8);
        this.add.text(100, 70, 'Fish Puncher 2D', {fontFamily: 'Impact', fontSize: '104px', color: '#00ffff'});
        this.add.text(100, 450, 'Start Game', {fontFamily: 'Impact', fontSize: '82px', color: '#ffab40'})
            .setInteractive()
            .on('pointerdown', () => {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => this.scene.start('level 1'));
            });
        let fish_img = this.add.image(1360, -360, 'fish2');
        fish_img.setScale(1.7);
        this.tweens.add({targets: fish_img, y: 500, duration: 500});
    }
}

class Level1 extends Phaser.Scene {
    constructor() {
        super({key: 'level 1',});
    }
    preload() {
        this.load.path = './assets/';
        this.load.image('playersprite', 'longlostbrother.png');
        this.load.image('fistsprite', 'puncher.png');
        this.load.image('brick', 'brick.png');
        this.load.image('brick2', 'brick2.png');
        this.load.image('TheMan', 'theMan.png');
        this.load.image('tubby', 'tubby.png');
    }
    create() {
        this.matter.world.setBounds();
        this.cameras.main.setBackgroundColor(0x548bb8);
        this.matter.add.sprite(960, 1000, 'brick', {}, {isStatic: true});
        this.matter.add.sprite(960, 1000, 'brick2', {}, {isStatic: true});
        this.matter.add.sprite(100, 100, 'tubby', {}, {ignorePointer: false})
            .setScale(.3)
        let hotdog = new Player(this, 950, 600, 'playersprite');
        let attracted = this.matter.add.sprite(950, 680, 'TheMan', {}, {plugin: {attractors: [(bodyA, bodyB) => ({
            x: (bodyA.position.x - bodyB.position.x) * 0.0001,
            y: (bodyA.position.y - bodyB.position.y) * 0.0001
        })]}, isStatic: true})
            .alpha = 1;
        const puncher = this.matter.add.sprite(150, 250, 'fistsprite')
            .setScale(.2);
        this.matter.add.worldConstraint(puncher, 10, .05, {pointA: {x: 960, y: 600}});
        this.matter.add.mouseSpring();
    }
    update() {

    }
}

const game = new Phaser.Game({
    scale: {
        type: Phaser.WEBGL,
        mode: Phaser.Scale.FIT,
        autocenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    physics: {default: 'matter', matter: {debug: false, gravity: { y: 0 }, plugins: {attractors: true}}},
    scene: [/*Intro, Menu,*/ Level1],
    title: "Fish Puncher 2D"
})