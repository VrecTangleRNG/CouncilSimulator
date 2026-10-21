import
{
	Application, Container, Sprite, Text, TextStyle, Ticker
}
from "pixi.js";
import { State, StateTransition } from "../machine";

import { currentGamePage, gameData } from "../../global";
import { Position } from "../../helper";
import { CardItem } from "../../entities";
import { ConfirmationState } from "./confirmation";
import { PausedState } from "./pause";

export class PolicyState implements State
{
	name = "policy";
	container: Container;
	app: Application;

	private cards: CardItem[][];
	private lines: Sprite[];
	private headerStyle: TextStyle;
	private headerTexts: Text[];
	private pauseBtn: Sprite;

	private isDragging: boolean;
	private isDoneMove: boolean;
	private isConfirm: boolean;
	private canScrolling: boolean;
	private whichCardToOpenAllocate: CardItem;
	private startPoint: Position;
	private startContainer: Position;
	private isPaused: boolean;
	private isOver: boolean;

	constructor(app: Application, pauseBtn: Sprite)
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
						this.cards[i][j] = new CardItem(id, i, j);
						this.container.addChild(this.cards[i][j].container);
					}
				);
			}
		);
		this.headerStyle = new TextStyle();
		this.whichCardToOpenAllocate = new CardItem(0, 0, 0);
		this.pauseBtn = pauseBtn;

		// Back-end variables
		this.isDragging = false;
		this.isDoneMove = false;
		this.isConfirm = false;
		this.canScrolling = true;
		this.startPoint = { x: 0, y: 0 };
		this.startContainer = { x: 0, y: 0 };
		this.isPaused = false;
		this.isOver = false;

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
			"pointerdown", () =>
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
				if (this.isDragging && this.isDoneMove && this.canScrolling)
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
		this.app.stage.on("gameover", () => { this.isOver = true; } );

		this.headerStyle.fontFamily = "terminess";
		this.headerStyle.fontSize = 32;
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
						card.container.emit("progressed");

						card.allocateBtn.on
						(
							"pointerdown", (event) =>
							{
								event.stopPropagation();
								this.whichCardToOpenAllocate = card;
								this.isConfirm = true;
							}
						);
					}
				);
			}
		);

		this.pauseBtn.on
		(
			"pointerdown", () => { this.isPaused = true; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		this.canScrolling = true;
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
			return {
				type: "push",
				state: new ConfirmationState(this.app, "pay", this.whichCardToOpenAllocate)
			};
		}
		return { type: "stay" };
	}

	public pause(ticker: Ticker)
	{
		this.canScrolling = false;
		return;
	}

	public exit(): void
	{
		this.app.stage.removeChild(this.container);
	}
}
