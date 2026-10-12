import { Application } from "pixi.js";


async function main(): Promise<void>
{

	// Constructions
	const app = new Application();
	await app.init
	({
		width: 540,
		height: 960,
		backgroundColor: 0x4fb8c9,
	});
	document.body.appendChild(app.canvas);

	// Initializations
	app.stage.sortableChildren = true;

	// Game loop
	app.ticker.add
	(
		(ticker) =>
		{
		}
	);
}

await main();
