import { Assets } from 'pixi.js';

export async function load()
{
	await Assets.load
	([

		// Textures
		{ alias: "title", src: "assets/textures/title.png"},
		{ alias: "playBtn", src: "assets/textures/playBtn.png"},
		{ alias: "quitBtn", src: "assets/textures/quitBtn.png"},

		// UI elements

		// Texts
	]);
}

//export class sounds {}
