import { Application, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";


export class TitleScreenState implements State
{
	name = "titleScreen";
	container = new Container();

	private S_WIDTH: number;
	private S_HEIGHT: number;

	private title: Sprite;
	private playBtn: Sprite;
	private quitBtn: Sprite;

	constructor(app: Application)
	{
		app.stage.addChild(this.container);
		this.S_WIDTH = app.screen.width;
		this.S_HEIGHT = app.screen.height;

		this.title = Sprite.from("title");
		this.playBtn = Sprite.from("playBtn");
		this.quitBtn = Sprite.from("quitBtn");
		this.container.addChild
		(
			this.title,
			this.playBtn,
			this.quitBtn
		);
	}

	public enter()
	{
		let titleMargin = (this.S_WIDTH - this.title.width) / 2;
		this.title.position.set(titleMargin);

		this.quitBtn.x = (this.S_WIDTH - this.quitBtn.width) / 2;
		this.quitBtn.y = this.S_HEIGHT - this.quitBtn.height - titleMargin;
		
		this.playBtn.x = this.quitBtn.x;
		this.playBtn.y = this.quitBtn.y - this.playBtn.height - titleMargin / 2;
	}

	public update(ticker: Ticker): StateTransition
	{
		return { type: "stay" };
	}

	public pause(ticker: Ticker)
	{
	}

	public exit(): void
	{
	}
}
