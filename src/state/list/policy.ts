import { Application, Container, Sprite, Text, TextStyle, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { currentGamePage, gameData } from "../../global";
import { createSingleCard } from "../../helper";

export class PolicyState implements State
{
	name = "policy";
	container: Container;
	app: Application;

	private cards: Sprite[][];
	private lines: Sprite[];
	private headerStyle: TextStyle;
	private headerTexts: Text[];

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.lines = [];
		this.lines[0] = Sprite.from("line");
		this.headerStyle = new TextStyle();
		this.headerTexts = [];
		this.headerTexts[0] = new Text();
		this.cards = [];
		this.cards[0] = [];
		gameData.cards[0].forEach
		(
			(number, index) => { this.cards[0][index] = createSingleCard(number); }
		);

		this.container.addChild
		(
			this.lines[0],
			this.headerTexts[0],
		);
		this.cards[0].forEach
		(
			(sprite) => { this.container.addChild(sprite); }
		);
	}

	public enter()
	{
		const verticalMargin = 10;
		this.headerStyle.fontFamily = "terminess";
		this.headerStyle.fontSize = 28;
		this.headerStyle.fill = 0x000000;

		this.lines[0].x = (this.app.screen.width - this.lines[0].width) / 2;
		this.headerTexts[0].style = this.headerStyle;
		this.headerTexts[0].text = "1st Year";
		this.headerTexts[0].x = this.lines[0].x;
		this.headerTexts[0].y = 152 + verticalMargin;
		this.lines[0].y = this.headerTexts[0].y + this.headerTexts[0].height + verticalMargin;

		this.cards[0].forEach
		(
			(sprite, index) =>
			{
				sprite.x = this.lines[0].x;
				sprite.y = this.lines[0].y + verticalMargin +
					(verticalMargin * (index + 1)) +
					(this.cards[0][0].height * index);
			}
		);

		this.lines[0].x = (this.app.screen.width - this.lines[0].width) / 2;
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
