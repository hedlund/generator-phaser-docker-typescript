module <%= module %>.State {
	
	export class Boot extends Phaser.State {

		preload() {
			this.load.image('preloadBar', 'assets/images/loader.png');
		}

		create() {
			// Prevent the browser from pausing the game (and it's timers) if the tab loses focus
			this.stage.disableVisibilityChange = true;

			// Scale on all devices
			this.scale.pageAlignHorizontally = true;
			this.scale.pageAlignVertically = true;
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

			// Other typical settings
			//this.stage.scale.minWidth = 480;
			//this.stage.scale.minHeight = 260;
			//this.stage.scale.maxWidth = 1024;
			//this.stage.scale.maxHeight = 768;
			//this.stage.scale.forceLandscape = true;
			//this.stage.scale.setScreenSize(true);
			//this.input.maxPointers = 1;

			// Start the preloader state
			this.game.state.start('preload');
		}
	}

}