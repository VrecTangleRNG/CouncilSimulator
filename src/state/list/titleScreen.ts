import { Application, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { LevelSelectionState } from "./levelSelect";

export class TitleScreenState implements State
{
	name = "titleScreen";
	container: Container;
	app: Application;

	private title: Sprite;
	private playBtn: Sprite;
	private quitBtn: Sprite;
	private isChangeToLevel: boolean;
	private isQuit: boolean;

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.title = Sprite.from("title");
		this.playBtn = Sprite.from("playBtn");
		this.quitBtn = Sprite.from("quitBtn");
		this.container.addChild
		(
			this.title,
			this.playBtn,
			this.quitBtn
		);
		
		this.isChangeToLevel = false;
		this.isQuit = false;
	}

	public enter()
	{
		let titleMargin = (this.app.screen.width - this.title.width) / 2;
		this.title.position.set(titleMargin);

		this.quitBtn.x = (this.app.screen.width - this.quitBtn.width) / 2;
		this.quitBtn.y = this.app.screen.height - this.quitBtn.height - titleMargin;
		this.quitBtn.eventMode = "static";
		this.quitBtn.cursor = "pointer";
		this.quitBtn.on
		(
			"pointerdown", () => { this.isQuit = true; }
		);

		this.playBtn.x = this.quitBtn.x;
		this.playBtn.y = this.quitBtn.y - this.playBtn.height - titleMargin / 2;
		this.playBtn.eventMode = "static";
		this.playBtn.cursor = "pointer";
		this.playBtn.on
		(
			"pointerdown", () => { this.isChangeToLevel = true; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		if (this.isChangeToLevel)
		{
			return { type: "replace", state: new LevelSelectionState(this.app) };
		}
		if (this.isQuit)
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
