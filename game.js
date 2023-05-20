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
        super({key: 'level 1',
        physics: {
            arcade: {
                debug: false,
                gravity: { y: 0 }
            },
            matter: {
                debug: false,
                gravity: { y: 0 },
                plugins: {attractors: true}
            }
        }});
    }
    preload() {
        this.load.path = './assets/';
        this.load.image('playersprite', 'longlostbrother.png');
        this.load.image('fistsprite', 'puncher.png');
        this.load.image('brick', 'brick.png');
        this.load.image('brick2', 'brick2.png');
        this.load.image('fish', 'fish.JPG');
    }
    create() {
        this.cameras.main.setBackgroundColor(0x548bb8);
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(960, 1000, 'brick').refreshBody();
        this.platforms.create(960, 1000, 'brick2').refreshBody();
        this.add.text(70, 950, 'Grab the fist and go ham on the fish! You can whack the fish or you can try and slingshot your fist.', {fontSize: 30})
        this.matter.add.sprite(-1000, 100, 'fish', {}, {ignorePointer: true}).setScale(1);
        this.matter.add.sprite(2000, 500, 'fish', {}, {ignorePointer: true}).setScale(1);
        let fish1 = this.matter.add.sprite(700, -8000, 'fish', {}, {ignorePointer: true}).setScale(1);
        let spawn = 1;
        new Player(this, 950, 600, 'playersprite');
        let puncher = this.matter.add.sprite(150, 250, 'fistsprite', {}, {plugin: {attractors: [(bodyA, bodyB) => ({
            x: (bodyA.position.x - bodyB.position.x) * 0.000007,
            y: (bodyA.position.y - bodyB.position.y) * 0.000007
        })]}}).setScale(.2);
        this.matter.add.worldConstraint(puncher, 10, .05, {pointA: {x: 960, y: 600}});
        this.matter.add.mouseSpring();
        this.matter.world.on('collisionstart', (event) =>
        {
            event.pairs[0].bodyA.gameObject.setTint(0xff0000);
            event.pairs[0].bodyA.destroy();
            if (fish1.isTinted && spawn == 1) {
                spawn--;
                this.matter.add.sprite(2000, 500, 'fish', {}, {ignorePointer: true}).setScale(1);
            }
            if (puncher.isTinted) {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => this.scene.start('level 1 summary'));
            }
        });
    }
    update() {
        
    }
}

class Lvl1Summary extends Phaser.Scene {
    constructor() {
        super('level 1 summary');
    }
    create() {
        this.add.text(150, 300, 'Nice Job taking out those fish, now to deal with some tubby fish.\n\n\n\n\nClick To continue...', {fontSize: 40})
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('level 2'));
        });
    }
}

class Level2 extends Phaser.Scene {
    constructor() {
        super({key: 'level 2',
        physics: {
            arcade: {
                debug: false,
                gravity: { y: 0 }
            },
            matter: {
                debug: false,
                gravity: { y: 0 },
                plugins: {attractors: true}
            }
        }});
    }
    preload() {
        this.load.path = './assets/';
        //this.load.image('playersprite', 'longlostbrother.png');
        //this.load.image('fistsprite', 'puncher.png');
        //this.load.image('brick', 'brick.png');
        //this.load.image('brick2', 'brick2.png');
        this.load.image('tubby', 'tubby.png');
    }
    create() {
        this.cameras.main.setBackgroundColor(0x548bb8);
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(960, 1000, 'brick').refreshBody();
        this.platforms.create(960, 1000, 'brick2').refreshBody();
        this.matter.add.sprite(-1000, 100, 'tubby', {}, {ignorePointer: true}).setScale(.2);
        this.matter.add.sprite(2000, 500, 'tubby', {}, {ignorePointer: true}).setScale(.5);
        let fish1 = this.matter.add.sprite(700, -5000, 'tubby', {}, {ignorePointer: true}).setScale(.4);
        this.matter.add.sprite(1500, -8000, 'tubby', {}, {ignorePointer: true}).setScale(.3);
        let spawn = 1;
        new Player(this, 950, 600, 'playersprite');
        let puncher = this.matter.add.sprite(150, 250, 'fistsprite', {}, {plugin: {attractors: [(bodyA, bodyB) => ({
            x: (bodyA.position.x - bodyB.position.x) * 0.000007,
            y: (bodyA.position.y - bodyB.position.y) * 0.000007
        })]}}).setScale(.2);
        this.matter.add.worldConstraint(puncher, 10, .05, {pointA: {x: 960, y: 600}});
        this.matter.add.mouseSpring();
        this.matter.world.on('collisionstart', (event) =>
        {
            event.pairs[0].bodyA.gameObject.setTint(0xff0000);
            event.pairs[0].bodyA.destroy();
            if (fish1.isTinted && spawn == 1) {
                spawn--;
                this.matter.add.sprite(2000, 500, 'tubby', {}, {ignorePointer: true}).setScale(.4);
            }
            if (puncher.isTinted) {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => this.scene.start('level 2 summary'));
            }
        });
    }
    update() {
        
    }
}

class Lvl2Summary extends Phaser.Scene {
    constructor() {
        super('level 2 summary');
    }
    create() {
        this.add.text(150, 300, 'Those were some scary fish. Now it is time to deal with the\nfinal horde. This is your final hurdle.\n\n\n\n\nClick To continue...', {fontSize: 40})
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('level 3'));
        });
    }
}

class Level3 extends Phaser.Scene {
    constructor() {
        super({key: 'level 3',
        physics: {
            arcade: {
                debug: false,
                gravity: { y: 0 }
            },
            matter: {
                debug: false,
                gravity: { y: 0 },
                plugins: {attractors: true}
            }
        }});
    }
    preload() {
        /*this.load.path = './assets/';
        this.load.image('playersprite', 'longlostbrother.png');
        this.load.image('fistsprite', 'puncher.png');
        this.load.image('brick', 'brick.png');
        this.load.image('brick2', 'brick2.png');
        this.load.image('tubby', 'tubby.png');
        this.load.image('fish', 'fish.JPG');*/
    }
    create() {
        this.cameras.main.setBackgroundColor(0x548bb8);
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(960, 1000, 'brick').refreshBody();
        this.platforms.create(960, 1000, 'brick2').refreshBody();
        this.matter.add.sprite(-1000, 100, 'tubby', {}, {ignorePointer: true}).setScale(.2);
        this.matter.add.sprite(2000, 500, 'tubby', {}, {ignorePointer: true}).setScale(.5);
        this.matter.add.sprite(700, -5000, 'tubby', {}, {ignorePointer: true}).setScale(.3);
        this.matter.add.sprite(-1000, 700, 'fish', {}, {ignorePointer: true}).setScale(1.2);
        this.matter.add.sprite(2000, -500, 'fish', {}, {ignorePointer: true}).setScale(1);
        this.matter.add.sprite(1700, -5000, 'fish', {}, {ignorePointer: true}).setScale(.9);
        let fish1 = this.matter.add.sprite(1500, -8000, 'tubby', {}, {ignorePointer: true}).setScale(.4);
        let spawn = 1;
        new Player(this, 950, 600, 'playersprite');
        let puncher = this.matter.add.sprite(150, 250, 'fistsprite', {}, {plugin: {attractors: [(bodyA, bodyB) => ({
            x: (bodyA.position.x - bodyB.position.x) * 0.000007,
            y: (bodyA.position.y - bodyB.position.y) * 0.000007
        })]}}).setScale(.2);
        this.matter.add.worldConstraint(puncher, 10, .05, {pointA: {x: 960, y: 600}});
        this.matter.add.mouseSpring();
        this.matter.world.on('collisionstart', (event) =>
        {
            event.pairs[0].bodyA.gameObject.setTint(0xff0000);
            event.pairs[0].bodyA.destroy();
            if (fish1.isTinted && spawn == 1) {
                spawn--;
                this.matter.add.sprite(1900, 100, 'tubby', {}, {ignorePointer: true}).setScale(1);
            }
            if (puncher.isTinted) {
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => this.scene.start('level 3 summary'));
            }
        });
    }
    update() {
        
    }
}

class Lvl3Summary extends Phaser.Scene {
    constructor() {
        super('level 3 summary');
    }
    create() {
        this.add.text(150, 300, 'You have conquered the horde. Congratulations!\n\n\n\n\nClick To restart...', {fontSize: 40})
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => this.scene.start('menu'));
        });
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
    //physics: {default: 'matter', arcade: {debug: false, gravity: { y:0 }}, matter: {debug: false, gravity: { y: 0 }, plugins: {attractors: true}}},
    scene: [Intro, Menu, Level1, Lvl1Summary, Level2, Lvl2Summary, Level3, Lvl3Summary],
    title: "Fish Puncher 2D"
})