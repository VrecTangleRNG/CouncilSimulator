import { Application, Text, Container, Sprite, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { TitleScreenState } from "./titleScreen";
import { Position } from "../../helper";


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

		this.isContinue = false;
		this.isBack = false;

		this.cards = [];
		this.cards[0] = Sprite.from("infrastructureCard");
		this.cards[1] = Sprite.from("educationCard");
		this.cards[2] = Sprite.from("safetyCard");
		this.cards[3] = Sprite.from("servicesCard");
		this.cards[4] = Sprite.from("environmentCard");
		this.cards[5] = Sprite.from("legislativesCard");
		this.cards[6] = Sprite.from("financeCard");
		this.cards[7] = Sprite.from("socialsCard");
		this.displayPos = [];
		this.checkmarks = [];
		for (let i = 0; i < 4; i++)
		{
			this.checkmarks[i] = Sprite.from("checkmark");
		}

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
			"pointertap", () => { this.isBack = true; }
		);

		this.randBtn.x = this.app.screen.width - this.randBtn.width - this.policyHeader.x;
		this.randBtn.y = this.backBtn.y;
		this.randBtn.eventMode = "static";
		this.randBtn.cursor = "pointer";
		this.randBtn.on
		(
			"pointertap", () =>
			{
				this.cards.forEach
				(
					(card) => { card.visible = false; }
				);
				this.randomizeCards();
			}
		);

		this.nextBtn.x = this.app.screen.width / 2 - this.nextBtn.width / 2;
		this.nextBtn.y = this.backBtn.y;
		this.nextBtn.eventMode = "static";
		this.nextBtn.cursor = "pointer";
		this.nextBtn.on
		(
			"pointertap", () => { this.isContinue = true; }
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

		for (let i = 0; i < this.cards.length; i++)
		{
			this.cards[i].visible = false;
			this.cards[i].eventMode = "static";
			this.cards[i].cursor = "pointer";
		}

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
			// TODO: add state first
		}
		return { type: "stay" };
	}

	public pause(ticker: Ticker)
	{
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
			this.cards[randomIndex].visible = true;
			this.cards[randomIndex].position = this.displayPos[i];
		}
	}
}
