import { Application, Container, Sprite, Text, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { createCards } from "../../helper";
import { gameData } from "../../global";
import { CardItem } from "../../entities";

export class AllocateState implements State
{
	name = "allocate";
	container = new Container();
	app: Application;

	private panel: Sprite;
	private yesBtn: Sprite;
	private yesGrayBtn: Sprite;
	private noBtn: Sprite;
	private text: Text;
	private accessedCard: CardItem;

	private isExit: boolean;

	constructor(app: Application, card: CardItem)
	{
		this.app = app;
		app.stage.addChild(this.container);

		this.panel = Sprite.from("confirmationPanel");
		this.yesBtn = Sprite.from("yesBtn");
		this.yesGrayBtn = Sprite.from("grayedYesBtn");
		this.noBtn = Sprite.from("noBtn");
		this.text = new Text();
		this.accessedCard = card;

		this.isExit = false;

		this.container.addChild
		(
			this.panel,
			this.yesBtn,
			this.yesGrayBtn,
			this.noBtn,
			this.text
		);
	}

	public enter()
	{
		this.container.zIndex = 2;

		this.panel.x = (this.app.screen.width - this.panel.width) / 2;
		this.panel.y = (this.app.screen.height - this.panel.height) / 2;

		this.text.style.fontFamily = "terminess";
		this.text.style.fontSize = 28;
		this.text.style.fill = 0x000000;
		this.text.style.align = "center";
		this.text.text = "Are you sure want to spend\n$100.00M\nfor the topmost plan?";
		let margin = (this.panel.width - this.text.width) / 2;
		this.text.x = this.panel.x + margin;
		this.text.y = this.panel.y + (this.panel.height - this.text.height) / 2;

		this.yesBtn.x = this.text.x;
		this.yesBtn.y = this.panel.y + this.panel.height - this.yesBtn.height - margin;
		this.yesBtn.eventMode = "static";
		this.yesBtn.cursor = "pointer";
		this.yesBtn.on
		(
			"pointerdown", () =>
			{
				gameData.money -= 100;
				gameData.trust += 8;
				this.accessedCard.progress += 1;
				this.accessedCard.container.emit("progressed");
				this.isExit = true;
			}
		);

		this.yesGrayBtn.visible = false;
		this.yesGrayBtn.position = this.yesBtn.position;

		this.noBtn.x = this.text.x + this.text.width - this.noBtn.width;
		this.noBtn.y = this.yesBtn.y;
		this.noBtn.eventMode = "static";
		this.noBtn.cursor = "pointer";
		this.noBtn.on
		(
			"pointerdown", () => { this.isExit = true; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		// Money amount checking
		if (gameData.money >= 100)
		{
			this.yesBtn.visible = true;
			this.yesGrayBtn.visible = false;
		}
		else
		{
			this.yesBtn.visible = false;
			this.yesGrayBtn.visible = true;
		}

		// State transitions
		if (this.isExit) return { type: "pop" };
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
