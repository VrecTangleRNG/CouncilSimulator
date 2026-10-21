import { Application, Container, Sprite, Ticker, Text, TextStyle } from "pixi.js";
import { State, StateTransition } from "../machine";

import { currentGamePage, gameData } from "../../global";
import { ConfirmationState } from "./confirmation";
import { PausedState } from "./pause";

export class IncomeState implements State
{
	name = "income";
	container: Container;
	app: Application;

	private line: Sprite;
	private headerText: Text;
	private propertyIcon: Sprite;
	private consumptionIcon: Sprite;
	private incomeIcon: Sprite;
	private iconTexts: Text[];
	private iconTextStyle: TextStyle;
	private taxBtn: Sprite;
	private pauseBtn: Sprite;

	private isConfirm: boolean;
	private isPaused: boolean;
	private isOver: boolean;

	constructor(app: Application, pauseBtn: Sprite)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.line = Sprite.from("line");
		this.headerText = new Text();
		this.propertyIcon = Sprite.from("propertyIcon");
		this.consumptionIcon = Sprite.from("consumptionIcon");
		this.incomeIcon = Sprite.from("individualIncomeIcon");
		this.taxBtn = Sprite.from("raiseTaxesBtn");
		this.iconTextStyle = new TextStyle();
		this.iconTexts = [];
		for (let i = 0; i < 3; i++)
		{
			this.iconTexts[i] = new Text();

		this.container.addChild(this.iconTexts[i]); }

		this.pauseBtn = pauseBtn;

		this.isConfirm = false;
		this.isPaused = false;
		this.isOver = false;

		this.container.addChild
		(
			this.line,
			this.headerText,
			this.propertyIcon,
			this.consumptionIcon,
			this.incomeIcon,
			this.taxBtn
		);
	}

	public enter()
	{
		const verticalMargin = 10;
		const HUDHeight = 152;
		this.app.stage.on("gameover", () => { this.isOver = true; } );

		this.headerText.style.fontFamily = "terminess";
		this.headerText.style.fontSize = 32;
		this.headerText.style.fill = 0x000000;

		this.line.x = (this.app.screen.width - this.line.width) / 2;
		this.headerText.x = this.line.x;
		this.headerText.y = HUDHeight + verticalMargin;
		this.headerText.text = "Taxes";
		this.line.y = this.headerText.y +
			this.headerText.height + verticalMargin;

		this.propertyIcon.x = this.line.x;
		this.propertyIcon.y = this.line.y + this.line.height + verticalMargin;

		this.consumptionIcon.x = this.line.x;
		this.consumptionIcon.y = this.propertyIcon.y +
			this.propertyIcon.height + verticalMargin * 2;

		this.incomeIcon.x = this.line.x;
		this.incomeIcon.y = this.consumptionIcon.y +
			this.propertyIcon.height + verticalMargin * 2;

		this.taxBtn.x = (this.app.screen.width - this.taxBtn.width) / 2;
		this.taxBtn.y = this.incomeIcon.y + this.incomeIcon.height + HUDHeight;
		this.taxBtn.eventMode = "static";
		this.taxBtn.cursor = "pointer";
		this.taxBtn.on
		(
			"pointerdown", () => { this.isConfirm = true; }
		);

		this.iconTextStyle = this.headerText.style;

		this.pauseBtn.on
		(
			"pointerdown", () => { this.isPaused = true; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		// Update display
		this.iconTexts.forEach
		(
			(text, index) =>
			{
				text.style = this.iconTextStyle;
				text.x = this.line.x + this.propertyIcon.width + 10;
				switch (index)
				{
					case 0:
						text.text = "Property Taxes\nIncome: $" +
						gameData.incomes[index].toFixed(2) + "M";
						text.y = this.propertyIcon.y;
						break;
					case 1:
						text.text = "Consumption Taxes\nIncome: $" +
						gameData.incomes[index].toFixed(2) + "M";
						text.y = this.consumptionIcon.y;
						break;
					case 2:
						text.text = "Individual income Taxes\nIncome: $" +
						gameData.incomes[index].toFixed(2) + "M";
						text.y = this.incomeIcon.y;
						break;
				}
			}
		);	

		// State transitions
		if (this.isOver)
		{
			return { type: "pop" };
		}
		if (this.isPaused)
		{
			this.isPaused = false;
			return { type: "push", state: new PausedState(this.app) };
		}
		if (currentGamePage.state !== this.name)
		{
			return { type: "pop" };
		}
		if (this.isConfirm)
		{
			this.isConfirm = false;
			return { type: "push", state: new ConfirmationState(this.app, "add", null) };
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
