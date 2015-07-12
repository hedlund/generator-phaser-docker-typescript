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
			desc: 'The name of the state'
		});

		this.option('skip-config', {
			desc: 'Don\'t add the new file to tsconfig.'
		});
	},

	initializing: function() {
		this.log(chalk.magenta('Generate a new game state'));
		this.module = this.config.get('module');
	},

	prompting: function() {
		if (!this.name) {
			var done = this.async();
			var prompt = {
				type: 'input',
				name: 'name',
				default: 'State',
				message: 'What\'s the name of the state'
			};
			this.prompt(prompt, function (answers) {
				this.name = answers.name;
				done();
			}.bind(this));
		}
	},

	configuring: function() {
		this.name = _.capitalize(_.camelCase(this.name));
	},

	writing: function() {
		var filename = 'src/' + this.module + '/State/' + this.name + '.ts';
		this.fs.copyTpl(
			this.templatePath('State.ts'),
			this.destinationPath(filename),
			this
		);

		//Add to dependencies
		if (!this.options['skip-config']) {
			var configPath = this.destinationPath('tsconfig.json'),
				config = this.fs.readJSON(configPath);
			config['files'].push(filename);
			this.fs.writeJSON(configPath, config);
		}
	},

	end: function() {
		this.log(chalk.magenta('Enjoy!'));
	}

});