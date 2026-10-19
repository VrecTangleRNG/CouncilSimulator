import
{
	Application, Container, Sprite, Text, TextStyle, Ticker
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
	private tasks: Sprite[];
	private allocateBtns: Sprite[][];

	private cardsCount: number;
	private periodsCount: number;
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
		this.cards = [];
		this.cards[0] = [];
		this.lines = [];
		this.headerTexts = [];
		this.allocateBtns = [];
		this.allocateBtns[0] = [];
		this.cardsCount = 0;
		this.periodsCount = 0;
		gameData.cards.forEach
		(
			(n1, i) =>
			{
				this.periodsCount++;
				this.lines[i] = Sprite.from("line");
				this.headerTexts[i] = new Text();
				n1.forEach
				(
					(n2, j) =>
					{
						this.cardsCount++;
						this.cards[i][j] = createSingleCard(n2);
						this.allocateBtns[i][j] = Sprite.from("allocateBtn");
					}
				);
			}
		);
		this.tasks = [];
		for (let i = 0; i < 4 * this.cards[0].length; i++)
		{
			this.tasks[i] = Sprite.from("taskPoint");
		}
		this.headerStyle = new TextStyle();

		// Back-end variables
		this.isDragging = false;
		this.isDoneMove = false;
		this.startPoint = { x: 0, y: 0 };
		this.startContainer = { x: 0, y: 0 };

		// Add objects to stage
		this.cards.forEach
		(
			(sprites, i) =>
			{
				sprites.forEach
				(
					(sprite, j) =>
					{
						this.container.addChild(sprite, this.allocateBtns[i][j]);
					}
				)
			}
		);
		this.lines.forEach( (sprite) => { this.container.addChild(sprite); } );
		this.headerTexts.forEach( (sprite) => { this.container.addChild(sprite); } );
		this.tasks.forEach( (sprite) => { this.container.addChild(sprite); } );
	}

	public enter()
	{
		const verticalMargin = 10;
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

		let cardsIndex = 0;
		this.cards.forEach
		(
			(sprites, i) =>
			{
				this.lines[i].x = (this.app.screen.width - this.lines[0].width) / 2;
				this.headerTexts[i].style = this.headerStyle;
				this.headerTexts[i].text = "1st Year";
				this.headerTexts[i].x = this.lines[0].x;
				this.headerTexts[i].y = 152 + verticalMargin;

				this.lines[i].y = this.headerTexts[0].y +
					this.headerTexts[0].height + verticalMargin;
				this.lines[0].x = (this.app.screen.width - this.lines[0].width) / 2;

				sprites.forEach
				(
					(sprite, j) =>
					{
						sprite.x = this.lines[0].x;
						sprite.y = this.lines[0].y + verticalMargin +
							(verticalMargin * (j + 1)) +
							(this.cards[0][0].height * j);

						this.allocateBtns[i][j].x = this.lines[0].x +
							this.lines[0].width - this.allocateBtns[i][j].width;
						this.allocateBtns[i][j].y = sprite.y +
							sprite.height - this.allocateBtns[i][j].height;
						this.allocateBtns[i][j].eventMode = "static";
						this.allocateBtns[i][j].cursor = "pointer";
						this.allocateBtns[i][j].on
						(
							"pointerdown", (event) =>
							{
								event.stopPropagation();
							}
						);

						for (let k = 0; k < 4; k++)
						{
							this.tasks[cardsIndex * 4 + k].x = this.cards[0][0].x +
								this.cards[0][0].width + verticalMargin;
							this.tasks[cardsIndex * 4 + k].y = this.cards[i][j].y +
								(this.tasks[0].height + verticalMargin * 2) * k;
						}
						cardsIndex++;
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
