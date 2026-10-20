import { Application, Container, Sprite, Text, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";

import { gameData } from "../../global";
import { CardItem } from "../../entities";

export class ConfirmationState implements State
{
	name = "confirmation";
	container = new Container();
	app: Application;

	private panel: Sprite;
	private yesBtn: Sprite;
	private yesGrayBtn: Sprite;
	private noBtn: Sprite;
	private text: Text;
	private accessedCard: CardItem | null;

	private isExit: boolean;
	private type: string;

	constructor(app: Application, type: "pay" | "add", card: CardItem | null)
	{
		this.app = app;
		app.stage.addChild(this.container);

		this.panel = Sprite.from("confirmationPanel");
		this.yesBtn = Sprite.from("yesBtn");
		this.yesGrayBtn = Sprite.from("grayedYesBtn");
		this.noBtn = Sprite.from("noBtn");
		this.text = new Text();

		if (type === "pay") this.accessedCard = card;
		else this.accessedCard = null;
		this.isExit = false;
		this.type = type;

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

		this.text.text =
			this.type === "pay" ?
			"Are you sure want to spend\n$100.00M\nfor the topmost plan?" :
			this.type === "add" ?
			"Are sure want to raise the\noverall taxes?\n\nThis will effect\nthe people trusts" :
			"";

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
				if (this.type === "pay" && this.accessedCard != null)
				{
					gameData.money -= 100;
					gameData.trust += 8;
					this.accessedCard.progress += 1;
					this.accessedCard.container.emit("progressed");
				}
				else if (this.type === "add")
				{
					gameData.incomes[0] = gameData.incomes[0] + 4.5;
					gameData.incomes[1] = gameData.incomes[1] + 2.75;
					gameData.incomes[2] = gameData.incomes[2] + 1.25;
					let totalTax = 0;
					gameData.incomes.forEach
					(
						(tax) => {totalTax += tax}
					);
					gameData.trust -= totalTax / 5;
					this.isExit = true;
				}
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
		if (this.type === "add" || gameData.money >= 100)
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
