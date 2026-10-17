import { Application, Text, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { TitleScreenState } from "./titleScreen";
import { Position, createCards } from "../../helper";
import { GameplayState } from "./gameplay";

export class LevelSelectionState implements State
{
	app: Application;
	name = "titleScreen";
	container: Container;

	private policyHeader: Sprite;
	private diffText: Text;
	private backBtn: Sprite;
	private nextBtn: Sprite;
	private randBtn: Sprite;
	private easy: Sprite;
	private medium: Sprite;
	private hard: Sprite;
	private wni: Sprite;
	private cards: Sprite[];
	private displayPos: Position[];
	private checkmarks: Sprite[];
	private isContinue: boolean;
	private isBack: boolean;
	private addedCards: number[];

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.policyHeader = Sprite.from("policyHeader");
		this.backBtn = Sprite.from("smallBackBtn");
		this.nextBtn = Sprite.from("smallNextBtn");
		this.randBtn = Sprite.from("smallRandBtn");
		this.easy = Sprite.from("easyHeader");
		this.medium = Sprite.from("mediumHeader");
		this.hard = Sprite.from("hardHeader");
		this.wni = Sprite.from("wniHeader");
		this.diffText = new Text
		({
			text: "DIFFICULTY",
			style:
			{
				fontFamily: "terminess",
				fontSize: 32,
				fill: 0x000000,
			},
		});

		this.cards = createCards();
		this.checkmarks = [];
		for (let i = 0; i < 4; i++)
		{
			this.checkmarks[i] = Sprite.from("checkmark");
		}

		this.displayPos = [];
		this.addedCards = [];
		this.isContinue = false;
		this.isBack = false;

		this.container.addChild
		(
			this.policyHeader,
			this.backBtn,
			this.randBtn,
			this.nextBtn,
			this.diffText,
			this.easy,
			this.medium,
			this.hard,
			this.wni,
		);
		this.cards.forEach
		(
			(sprite) => { this.container.addChild(sprite); }
		);
		this.checkmarks.forEach
		(
			(sprite) => {this.container.addChild(sprite); }
		);
	}

	public enter()
	{
		this.container.sortableChildren = true;

		this.policyHeader.x = (this.app.screen.width - this.policyHeader.width) / 2;
		this.policyHeader.y = this.policyHeader.x

		this.diffText.x = this.app.screen.width / 2 - this.diffText.width / 2;
		this.diffText.y = this.policyHeader.y * 2 + this.policyHeader.height

		this.backBtn.x = this.policyHeader.x;
		this.backBtn.y = this.app.screen.height - this.backBtn.height - this.policyHeader.x;
		this.backBtn.eventMode = "static";
		this.backBtn.cursor = "pointer";
		this.backBtn.on
		(
			"pointerdown", () => { this.isBack = true; }
		);

		this.randBtn.x = this.app.screen.width - this.randBtn.width - this.policyHeader.x;
		this.randBtn.y = this.backBtn.y;
		this.randBtn.eventMode = "static";
		this.randBtn.cursor = "pointer";
		this.randBtn.on
		(
			"pointerdown", () =>
			{
				this.cards.forEach
				(
					(card) =>
					{
						card.zIndex = 0;
						card.visible = false;
						card.removeAllListeners("pointerdown");
					}
				);
				this.randomizeCards();
			}
		);

		this.nextBtn.visible = false;
		this.nextBtn.x = this.app.screen.width / 2 - this.nextBtn.width / 2;
		this.nextBtn.y = this.backBtn.y;
		this.nextBtn.eventMode = "static";
		this.nextBtn.cursor = "pointer";
		this.nextBtn.on
		(
			"changedcards", () =>
			{
				if (this.addedCards.length > 0)
				{
					this.nextBtn.visible = true;
					this.nextBtn.on
					(
						"pointerdown",  () =>
						{
							this.isContinue = true;
						}
					);

					switch (this.addedCards.length)
					{
						case 1:
						{
							this.easy.visible = true;
							this.medium.visible = this.hard.visible = this.wni.visible = false;
						} break;
						case 2:
						{
							this.medium.visible = true;
							this.easy.visible = this.hard.visible = this.wni.visible = false;
						} break;
						case 3:
						{
							this.hard.visible = true;
							this.medium.visible = this.easy.visible = this.wni.visible = false;
						} break;
						case 4:
						{
							this.wni.visible = true;
							this.medium.visible = this.hard.visible = this.easy.visible = false;
						} break;
					}
				}
				else
				{
					this.nextBtn.visible = false;
					this.nextBtn.removeAllListeners("pointerdown");
					this.easy.visible = this.medium.visible = false;
					this.hard.visible = this.wni.visible = false;
				}
			}
		);

		this.easy.visible = false;
		this.easy.x = this.policyHeader.x;
		this.easy.y = this.diffText.y + this.diffText.height + this.policyHeader.x;

		this.medium.visible = false;
		this.medium.position = this.easy.position;

		this.hard.visible = false;
		this.hard.position = this.easy.position;

		this.wni.visible = false;
		this.wni.position = this.easy.position;

		this.cards.forEach
		(
			(sprite) =>
			{
				sprite.zIndex = 0;
				sprite.visible = false;
				sprite.eventMode = "static";
				sprite.cursor = "pointer";
			}
		);

		let cardsMargin = (this.app.screen.width - this.policyHeader.x) / 2 - this.cards[0].width;
		this.displayPos =
		[
			{
				x: cardsMargin,
				y: this.easy.y + this.easy.height + this.policyHeader.x
			},
			{
				x: cardsMargin,
				y: this.easy.y + this.easy.height + this.policyHeader.x * 2 + this.cards[0].height
			},
			{
				x: cardsMargin + this.cards[0].width + this.policyHeader.x,
				y: this.easy.y + this.easy.height + this.policyHeader.x
			},
			{
				x: cardsMargin + this.cards[0].width + this.policyHeader.x,
				y: this.easy.y + this.easy.height + this.policyHeader.x * 2 + this.cards[0].height
			},
		];

		this.checkmarks.forEach
		(
			(sprite, index) =>
			{
				sprite.zIndex = 2;
				sprite.position = this.displayPos[index];
				sprite.visible = false;
			}
		);

		this.randomizeCards();
	}

	public update(ticker: Ticker): StateTransition
	{
		if (this.isBack)
		{
			return { type: "replace", state: new TitleScreenState(this.app) };
		}
		if (this.isContinue)
		{
			return { type: "replace", state: new GameplayState(this.app, this.addedCards) };
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

	private randomizeCards()
	{
		for (let i = 0; i < 4; i++)
		{
			let randomIndex: number;
			do
			{
				randomIndex = Math.floor(Math.random() * 7.9);
			}
			while (this.cards[randomIndex].visible);
			this.cards[randomIndex].zIndex = 1;
			this.cards[randomIndex].visible = true;
			this.cards[randomIndex].position = this.displayPos[i];
			this.cards[randomIndex].on
			(
				"pointerdown", () =>
				{
					this.checkmarks[i].visible = !this.checkmarks[i].visible;
					if (this.checkmarks[i].visible)
					{
						this.addedCards.push(randomIndex);
					}
					else
					{
						this.addedCards.splice(this.addedCards.indexOf(randomIndex), 1);
					}
					this.nextBtn.emit("changedcards");
				}
			);
		}
	}
}
