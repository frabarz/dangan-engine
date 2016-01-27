import Character from './Character.js';

import DiscussionStage from './DiscussionStage.js';

export default class Trial
{
	constructor(width, height)
	{
		this.W = width;
		this.H = height;

		this.characters = {};
		this.renderer = {};
	}

	setupRenderer(type, renderer)
	{
		this.renderer[type] = renderer;
		return this;
	}

	setNarrator(nametag)
	{
		this.characters.narrator = new Character({
			id: Character.NARRATOR,
			name: nametag
		});
	}

	setCharacter(character, position)
	{
		if (!character)
			return;

		character = new Character(character);
		this.characters[character.id] = character;

		this.renderer.scene.locateCharacter(character, position);
	}

	putTheFuckingBear()
	{
		let kuma = new Character({
			id: 'monokuma',
			name: 'Monokuma'
		});
		this.characters.monokuma = kuma;

		this.renderer.scene.heIsHere(kuma);
	}

	changeStage(mode)
	{
		switch (mode)
		{
			case 'discussion':
				this.stage = new DiscussionStage(this);
				break;

			// case 'nsd':
			// 	this.stage = new NSDStage(this);
			// 	break;
		}
	}

	loadScript(url)
	{
		fetch(url)
			.then(function (res) {
				return res.json();
			})
			.then(function (script) {
				script.forEach(this.parseScript, this);
			}.bind(this));
	}

	parseScript(block)
	{
		if (block.kind) {
			this.stage.end(block);
		} else {
			if (block.speaker == 'narrator') {
				this.stage.queueNarratorScript(block);
			} else {
				this.stage.queueCharacterScript(block);
			}
		}
	}
}