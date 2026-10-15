import { Application } from "pixi.js";

import { StateMachine } from "./state/machine";
import * as assets from "./assets";

import { TitleScreenState } from "./state/list/titleScreen";

async function main(): Promise<void>
{

	// Initializations
	const app = new Application();
	await app.init
	({
		width: 640,
		height: 960,
		backgroundColor: 0x4fb8c9,
	});
	document.body.appendChild(app.canvas);
	app.stage.sortableChildren = true;
	await assets.load();
	const stateMachine: StateMachine = new StateMachine(new TitleScreenState(app));

	// Game loop
	app.ticker.add
	(
		(ticker) =>
		{
			stateMachine.run(ticker);
		}
	);
}

await main();
