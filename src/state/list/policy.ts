import
{
	Application, Container, FederatedPointerEvent, Sprite, Text, TextStyle, Ticker
}
from "pixi.js";
import { State, StateTransition } from "../machine";

import { currentGamePage, gameData } from "../../global";
import { createSingleCard, Position } from "../../helper";

export class PolicyState implements State
{
	name = "policy";
	container: Container;
	app: Application;

	private cards: Sprite[][];
	private lines: Sprite[];
	private headerStyle: TextStyle;
	private headerTexts: Text[];

	private isDragging: boolean;
	private isDoneMove: boolean;
	private startPoint: Position;
	private startContainer: Position;

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

		this.isDragging = false;
		this.isDoneMove = false;
		this.startPoint = { x: 0, y: 0 };
		this.startContainer = { x: 0, y: 0 };

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
		console.log("hello");

		this.app.stage.on
		(
			"pointerdown", (event) =>
			{
				if (!this.isDragging)
				{
					this.startContainer = this.container.position;
					this.isDragging = true;
				}
			}
		);
		this.app.stage.on
		(
			"pointermove", (event) =>
			{
				this.isDoneMove = !this.isDoneMove;
				if (this.isDragging && this.isDoneMove)
				{
					this.container.y = this.startContainer.y +
						(event.globalY - this.startPoint.y) * 2;
					if (this.container.y >= 0) this.container.y = 0;
				}
				else
				{
					this.startPoint = { x: event.globalX, y: event.globalY };
				}
			}
		);
		this.app.stage.on("pointerup", () => { this.isDragging = false; } );
		this.app.stage.on("pointerupoutside", () => { this.isDragging = false; } );

		this.container.position = this.startContainer;

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
