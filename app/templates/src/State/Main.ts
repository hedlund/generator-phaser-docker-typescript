module <%= module %>.State {
	
	export class Main extends Phaser.State {

		preload() {

		}

		create() {
			var text = this.add.text(this.world.centerX, this.world.centerY, '<%= name %>', {
				font: '32px Monospace',
				fill: '#fff',
				align: 'center'
			});
			text.anchor.set(0.5, 0.5);
		}
	}

}