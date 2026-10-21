import { Application } from "pixi.js";

import { StateMachine } from "./state/machine";
import * as assets from "./assets";

import { TitleScreenState } from "./state/list/titleScreen";
import { GameoverState } from "./state/list/gameover";

async function main(): Promise<void>
{

	// Initializations
	const app = new Application();
	await app.init
	({
		width: 640,
		height: 960,
		backgroundColor: 0x4fb8c9,
		roundPixels: true,
	});
	document.body.appendChild(app.canvas);
	app.stage.sortableChildren = true;
	await assets.load();
	const stateMachine: StateMachine = new StateMachine(new GameoverState(app));

	// Game loop
	app.ticker.add
	(
		(ticker) =>
		{
			if (!stateMachine.run(ticker))
			{
				app.stop();
				app.destroy
				(
					true,
					{
						children: true,
						texture: true
					},
				);
			}
		}
	);
}

await main();
