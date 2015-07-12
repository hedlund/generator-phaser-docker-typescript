module <%= module %>.State {
	
	export class Preload extends Phaser.State {

		preloadBar: Phaser.Sprite;

		preload() {
			// Setup the preloader sprite
			this.preloadBar = this.add.sprite(250, 250, 'preloadBar');
            this.load.setPreloadSprite(this.preloadBar);

            // Load the actual game assets
		}

		create() {
			var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(() => {
            	this.game.state.start('main');
            }, this);
		}

	}

}