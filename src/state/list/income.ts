import { Application, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { currentGamePage } from "../../global";

export class IncomeState implements State
{
	name = "income";
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
		if (currentGamePage.state !== this.name)
		{
			return { type: "pop" };
		}
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
