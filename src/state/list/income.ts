import { Application, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";


export class GameplayState implements State
{
	name = "gameplay";
	container = new Container();
	app: Application;

	constructor(app: Application)
	{
		this.app = app;
		app.stage.addChild(this.container);
	}

	public enter()
	{
	}

	public update(ticker: Ticker): StateTransition
	{
		return { type: "stay" };
	}

	public pause(ticker: Ticker)
	{
		return;
	}

	public exit(): void
	{
		this.app.stage.removeChild(this.container);
	}
}
