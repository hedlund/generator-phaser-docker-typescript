module <%= module %> {
	
	export class Game extends Phaser.Game {
		
		constructor() {
			super(800, 600, Phaser.AUTO, null, null);
			
			this.state.add('boot', State.Boot, false);
			this.state.add('preload', State.Preload, false);
			this.state.add('main', State.Main, false);
			
			this.state.start('boot');
		}
	}
}