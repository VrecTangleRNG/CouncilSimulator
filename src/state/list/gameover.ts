import { Application, Container, Sprite, Text, TextStyle, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";
import { gameData } from "../../global";
import { TitleScreenState } from "./titleScreen";

export class GameoverState implements State
{
	name = "gameover";
	container: Container;
	app: Application;

	private demotedScreen: Sprite;
	private backBtn: Sprite;
	private daysText: Text;
	private upperText: Text;
	private lowerText: Text;
	private textStyle: TextStyle;

	private isBack: boolean;

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.demotedScreen = Sprite.from("demotedScreen");
		this.backBtn = Sprite.from("backBtn");
		this.daysText = new Text();
		this.upperText = new Text();
		this.lowerText = new Text();
		this.textStyle = new TextStyle();

		this.isBack = false;

		this.container.addChild
		(
			this.demotedScreen,
			this.backBtn,
			this.daysText,
			this.upperText,
			this.lowerText
		);
	}

	public enter()
	{
		const margin = 20;
		this.demotedScreen.x = (this.app.screen.width - this.demotedScreen.width) / 2;
		this.demotedScreen.y = this.demotedScreen.x;

		this.textStyle.fontFamily = "terminess";
		this.textStyle.fontSize = 32;
		this.textStyle.fill = 0x000000;

		this.backBtn.x = (this.app.screen.width - this.backBtn.width) / 2;
		this.backBtn.y = this.app.screen.height - this.backBtn.height - this.demotedScreen.x;
		this.backBtn.eventMode = "static";
		this.backBtn.cursor = "pointer";
		this.backBtn.on
		(
			"pointerdown", () => { this.isBack = true; }
		);

		this.daysText.style.fontFamily = "terminess";
		this.daysText.style.fontSize = 64;
		this.daysText.style.fill = 0x000000;
		this.daysText.text = gameData.days + " DAYS";
		this.daysText.x = (this.app.screen.width - this.daysText.width) / 2;
		this.daysText.y = (this.app.screen.height - this.daysText.height) / 2;

		this.upperText.style = this.textStyle;
		this.upperText.text = "YOU SERVED AS COUNCIL FOR:";
		this.upperText.x = (this.app.screen.width - this.upperText.width) / 2;
		this.upperText.y = this.daysText.y - this.upperText.height - margin;

		this.lowerText.style = this.textStyle;
		this.lowerText.text = "AND THEN LOSE THE POSITION";
		this.lowerText.x = (this.app.screen.width - this.lowerText.width) / 2;
		this.lowerText.y = this.daysText.y + this.daysText.height + margin;
	}

	public update(ticker: Ticker): StateTransition
	{
		if (this.isBack)
		{
			return { type: "replace", state: new TitleScreenState(this.app) };
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
