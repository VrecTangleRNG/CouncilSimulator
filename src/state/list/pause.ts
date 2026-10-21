import { Application, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";
import { WarningState } from "./warning";

export class PausedState implements State
{
	name = "paused";
	container: Container;
	app: Application;

	private panel: Sprite;
	private continueBtn: Sprite;
	private downBtn: Sprite;

	private isExit: boolean;
	private isWarning: boolean;

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.panel = Sprite.from("pausePanel");
		this.continueBtn = Sprite.from("smallContinueBtn");
		this.downBtn = Sprite.from("smallDownBtn");

		this.isExit = false;
		this.isWarning = false;

		this.container.addChild
		(
			this.panel,
			this.continueBtn,
			this.downBtn
		);
	}

	public enter()
	{
		this.container.zIndex = 2;

		this.panel.x = (this.app.screen.width - this.panel.width) / 2;
		this.panel.y = (this.app.screen.height - this.panel.height) / 2;

		let margin = (this.panel.height - 138 - this.downBtn.height * 2) / 3;
		this.continueBtn.x = this.panel.x + (this.panel.width - this.continueBtn.width) / 2;
		this.continueBtn.y = this.panel.y + 138 + margin;
		this.continueBtn.eventMode = "static";
		this.continueBtn.cursor = "pointer";
		this.continueBtn.on
		(
			"pointerdown", () => { this.isExit = true; }
		);

		this.downBtn.x = this.continueBtn.x;
		this.downBtn.y = this.continueBtn.y + this.continueBtn.height + margin;
		this.downBtn.eventMode = "static";
		this.downBtn.cursor = "pointer";
		this.downBtn.on
		(
			"pointerdown", () => { this.isWarning = true; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		if (this.isExit)
		{
			this.app.stage.emit("resume");
			return { type: "pop" };
		}
		if (this.isWarning)
		{
			this.isWarning = false;
			return { type: "push", state: new WarningState(this.app) };
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
