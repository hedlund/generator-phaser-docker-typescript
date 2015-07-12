var generators = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var _ = require('lodash');
var pkg = require('../package.json');


module.exports = generators.Base.extend({

	constructor: function() {
		generators.Base.apply(this, arguments);

		this.argument('name', {
			type: String,
			required: false,
			desc: 'The name of the game'
		});

		this.option('module', {
			type: String,
			alias: 'm',
			desc: 'The name of the main module'
		});

		this.option('skip-code', {
			desc: 'Don\'t add settings for Visual Studio Code.'
		});
	},

	initializing: function () {
		this.log(chalk.magenta('\nPhaser + Typescript + Docker'));
		this.log(chalk.magenta('----------------------------'));
		this.log(chalk.magenta('Version ' + pkg.version + '\n'));
	},

	prompting: function() {
		if (!this.name) {
			this.log(chalk.magenta('First some configuration...'));
			var done = this.async();
			var prompt = {
				type: 'input',
				name: 'name',
				default: path.basename(process.cwd()),
				message: 'What\'s the name of the game'
			};
			this.prompt(prompt, function (answers) {
				this.name = answers.name;
				done();
			}.bind(this));
		}
	},

	configuring: {
		userConfig: function() {
			this.module = _.capitalize(_.camelCase(this.options.module || this.name));
			this.config.set({
				name: this.name,
				module: this.module
			});
			this.log('The game "' + chalk.cyan(this.name) + '" will be created with the module ' + chalk.cyan(this.module) + '.');
		},
		projectFiles: function() {
			this.log(chalk.magenta('Generate project files...'));
			this._copy('gitignore', '.gitignore');
			this._copy('docker-compose.yml');
			this._template('tsconfig.json');
			this._copy('bowerrc', '.bowerrc');
			this._template('bower.json', 'bower.json', {
				name: _.kebabCase(this.name)
			});
		},
		visualStudioCode: function() {
			if (!this.options['skip-code']) {
				this.log(chalk.magenta('Generate Visual Studio Code settings...'));
				this._copy('settings', '.settings');
			}
		}
	},

	writing: {
		binFolder: function() {
			this.log(chalk.magenta('Create bin folder...'));
			this._template('index.html', 'bin/index.html');
			this._copy('app.css', 'bin/css/app.css');
		},
		srcFolder: function() {
			this.log(chalk.magenta('Create src folder...'));
			this._template('app.ts', 'src/app.ts');
			this._template('src', 'src/' + this.module);
		}
	},

	install: {
		dependencies: function() {
			this.log(chalk.magenta('Install the dependencies...'));
			this.bowerInstall(null, null, this.install._postInstall.bind(this));
		},

		_postInstall: function() {
			if (this.options['skip-install']) {
				this.log(chalk.red('Installation was skipped!'));
				this.log('You will have to manually copy all dependencies.');
			}
			else {
				var copy = this.install._copyDependency.bind(this);
				copy('vendor/phaser-official/typescript/p2.d.ts', 'tsDefinitions/p2.d.ts');
				copy('vendor/phaser-official/typescript/phaser.comments.d.ts', 'tsDefinitions/phaser.comments.d.ts');
	        	copy('vendor/phaser-official/typescript/pixi.comments.d.ts', 'tsDefinitions/pixi.comments.d.ts');

	        	copy('vendor/phaser-official/build/phaser.js', 'bin/js/phaser.js');
	        	copy('vendor/phaser-official/build/phaser.map', 'bin/js/phaser.map');
	        	copy('vendor/phaser-official/build/phaser.min.js', 'bin/js/phaser.min.js');

	        	copy('vendor/phaser-official/resources/Phaser Logo/PNG/Phaser-Logo-Small.png', 'bin/assest/images/loader.png');
	        }
		},

		_copyDependency: function(from, to) {
			this.fs.copy(
				this.destinationPath(from),
				this.destinationPath(to)
			);
		}
	},

	end: function() {
		this.log(chalk.magenta('Enjoy!'));
	},

	_copy: function(from, to) {
		this.fs.copy(
			this.templatePath(from),
			this.destinationPath(to || from)
		);
	},

	_template: function(from, to, context) {
		this.fs.copyTpl(
			this.templatePath(from),
			this.destinationPath(to || from),
			context || this
		);
	}
});