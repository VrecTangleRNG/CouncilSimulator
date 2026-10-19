import
{
	Application, Container, Sprite, Text, TextStyle, Ticker
}
from "pixi.js";
import { State, StateTransition } from "../machine";

import { currentGamePage, gameData } from "../../global";
import { Position } from "../../helper";
import { CardItem } from "../../entities";

export class PolicyState implements State
{
	name = "policy";
	container: Container;
	app: Application;

	private cards: CardItem[][];
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

		// Object creations
		this.lines = [];
		this.headerTexts = [];
		this.cards = [];
		this.cards[0] = [];
		gameData.cards.forEach
		(
			(ids, i) =>
			{
				this.lines[i] = Sprite.from("line");
				this.headerTexts[i] = new Text();
				ids.forEach
				(
					(id, j) =>
					{
						this.cards[i][j] = new CardItem(id);
						this.container.addChild(this.cards[i][j].container);
					}
				);
			}
		);
		this.headerStyle = new TextStyle();

		// Back-end variables
		this.isDragging = false;
		this.isDoneMove = false;
		this.startPoint = { x: 0, y: 0 };
		this.startContainer = { x: 0, y: 0 };

		// Add objects to stage
		this.lines.forEach( (sprite) => { this.container.addChild(sprite); } );
		this.headerTexts.forEach( (sprite) => { this.container.addChild(sprite); } );
	}

	public enter()
	{
		const verticalMargin = 10;
		const HUDHeight = 152;

		// Scrolling functionality
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

		this.headerStyle.fontFamily = "terminess";
		this.headerStyle.fontSize = 28;
		this.headerStyle.fill = 0x000000;

		gameData.cards.forEach
		(
			(ids, i) =>
			{
				this.lines[i].x = (this.app.screen.width - this.lines[0].width) / 2;
				this.headerTexts[i].x = this.lines[0].x;
				this.headerTexts[i].y = HUDHeight + verticalMargin;
				this.headerTexts[i].style = this.headerStyle;
				this.headerTexts[i].text = (i + 1) + "st Periods";
				this.lines[i].y = this.headerTexts[i].y +
					this.headerTexts[i].height + verticalMargin;
				ids.forEach
				(
					(id, j) =>
					{
						let card = this.cards[i][j];
						card.container.x = this.lines[0].x;
						card.container.y = this.lines[i].y + this.lines[i].height +
							verticalMargin + (verticalMargin + card.card.height) * j;
					}
				);
			}
		);
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
