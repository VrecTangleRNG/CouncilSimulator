import { Application, BitmapText, Container, Graphics, Rectangle, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { PolicyState } from "./policy";
import { IncomeState } from "./income";
import { currentGamePage, gameData } from "../../global";

export class GameplayState implements State
{
	name = "gameplay";
	container: Container;
	app: Application;

	private playHUD: Sprite;
	private currencyIcon: Sprite;
	private timeIcon: Sprite;
	private trustIcon: Sprite;
	private textboxes: Sprite[];
	private bar: Sprite;
	private pauseBtn: Sprite;
	private policyBtn: Sprite;
	private incomeBtn: Sprite;
	private barFilled: Graphics;
	private moneyText: BitmapText;
	private timeText: BitmapText;

	private dayRate: number;
	private daysPassed: number;

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.playHUD = Sprite.from("playHUD");
		this.currencyIcon = Sprite.from("currencyIcon");
		this.timeIcon = Sprite.from("timeIcon");
		this.trustIcon = Sprite.from("trustPointIcon");
		this.bar = Sprite.from("bar");
		this.pauseBtn = Sprite.from("pauseBtn");
		this.policyBtn = Sprite.from("policiesBtn");
		this.incomeBtn = Sprite.from("incomeBtn");
		this.textboxes = [];
		this.textboxes[0] = Sprite.from("textbox");
		this.textboxes[1] = Sprite.from("textbox");
		this.barFilled = new Graphics();
		this.moneyText = new BitmapText();
		this.timeText = new BitmapText();

		this.dayRate = 0;
		this.daysPassed = 0;

		this.container.addChild
		(
			this.playHUD,
			this.currencyIcon,
			this.timeIcon,
			this.trustIcon,
			this.textboxes[0],
			this.textboxes[1],
			this.bar,
			this.pauseBtn,
			this.policyBtn,
			this.incomeBtn,
			this.barFilled,
			this.moneyText,
			this.timeText,
		);
	}

	public enter()
	{
		this.app.stage.eventMode = "static";
		this.app.stage.hitArea = new Rectangle
		(
			0, this.playHUD.height,
			this.app.screen.width, this.app.screen.height - this.playHUD.height
		);

		this.container.zIndex = 1;

		this.currencyIcon.x = (this.app.screen.width - this.currencyIcon.width -
			this.textboxes[0].width - this.trustIcon.width - this.bar.width) / 3;
		this.currencyIcon.y = this.currencyIcon.x;

		this.timeIcon.x = this.currencyIcon.x;
		this.timeIcon.y = this.currencyIcon.x * 2 + this.currencyIcon.height;

		this.textboxes[0].x = this.currencyIcon.x + this.currencyIcon.width;
		this.textboxes[0].y = this.currencyIcon.x;

		this.textboxes[1].x = this.currencyIcon.x + this.currencyIcon.width;
		this.textboxes[1].y = this.timeIcon.y;

		this.moneyText.style =
		{
			fontFamily: "terminessBMP",
			fontSize: 32,
			fill: 0x000000
		};
		this.moneyText.text = "$" + gameData.money.toFixed(2) + "M";
		this.moneyText.anchor.set(0.5);
		this.moneyText.x = this.textboxes[0].x + this.textboxes[0].width / 2;
		this.moneyText.y = this.textboxes[0].y + this.textboxes[0].height / 2;

		this.timeText.style = this.moneyText.style;
		this.timeText.text = this.daysPassed + " Days";
		this.timeText.anchor.set(0.5);
		this.timeText.x = this.textboxes[1].x + this.textboxes[1].width / 2;
		this.timeText.y = this.textboxes[1].y + this.textboxes[1].height / 2;

		this.trustIcon.x = this.textboxes[0].x + this.textboxes[0].width + this.currencyIcon.x;
		this.trustIcon.y = this.currencyIcon.x;

		this.bar.x = this.trustIcon.x + this.trustIcon.width;
		this.bar.y = this.trustIcon.y + this.trustIcon.height / 2 - this.bar.height / 2;

		this.barFilled.rect(0, 0, this.bar.width, this.bar.height);
		this.barFilled.fill(0x00cc00);
		this.barFilled.position = this.bar.position;

		this.pauseBtn.x = this.bar.x + this.bar.width - this.pauseBtn.width;
		this.pauseBtn.y = this.timeIcon.y;
		this.pauseBtn.eventMode = "static";
		this.pauseBtn.cursor = "pointer";

		this.policyBtn.x = (this.app.screen.width - this.policyBtn.width * 2) / 3;
		this.policyBtn.y = this.app.screen.height - this.policyBtn.height - this.policyBtn.x;
		this.policyBtn.eventMode = "static";
		this.policyBtn.cursor = "pointer";
		this.policyBtn.on
		(
			"pointerdown", () => { currentGamePage.state = "policy"; }
		);

		this.incomeBtn.x = this.policyBtn.width + this.policyBtn.x * 2;
		this.incomeBtn.y = this.policyBtn.y;
		this.incomeBtn.eventMode = "static";
		this.incomeBtn.cursor = "pointer";
		this.incomeBtn.on
		(
			"pointerdown", () => { currentGamePage.state = "income"; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		// State Transitions
		if (currentGamePage.state === "policy")
		{
			this.policyBtn.tint = 0x888888;
			this.incomeBtn.tint = 0xffffff;
			return { type: "push", state: new PolicyState(this.app) };
		}
		else if (currentGamePage.state === "income")
		{
			this.incomeBtn.tint = 0x888888;
			this.policyBtn.tint = 0xffffff;
			return { type: "push", state: new IncomeState(this.app) };
		}
		return { type: "stay" };
	}

	public pause(ticker: Ticker)
	{
		// Update trust bar
		gameData.trust -= ticker.deltaMS / 750;
		if (gameData.trust <= 0) gameData.trust = 0;
		this.barFilled.scale.x = gameData.trust / 100;

		// Update HUD
		this.daysPassed += ticker.deltaMS / 1500;
		this.dayRate += ticker.deltaMS / 1500;
		if (this.dayRate >= 1)
		{
			gameData.incomes.forEach
			(
				(n) => { gameData.money += n; }
			);
			this.dayRate = 0;
			this.timeText.text = this.daysPassed.toFixed(0) + " Days";
		}
		this.moneyText.text = "$" + gameData.money.toFixed(2) + "M";

		return;
	}

	public exit(): void
	{
		this.app.stage.removeAllListeners("pointermove");
		this.app.stage.removeChild(this.container);
	}
}
