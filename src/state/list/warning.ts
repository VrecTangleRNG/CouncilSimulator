import { Application, Container, Sprite, Ticker, Text } from "pixi.js";
import { State, StateTransition } from "../machine";

export class WarningState implements State
{
	name = "warning";
	container: Container;
	app: Application;

	private panel: Sprite;
	private yesBtn: Sprite;
	private noBtn: Sprite;
	private text: Text;

	private isCancel: boolean;
	private isQuit: boolean;

	constructor(app: Application)
	{
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.panel = Sprite.from("warningPanel");
		this.yesBtn = Sprite.from("yesBtn");
		this.noBtn = Sprite.from("noBtn");
		this.text = new Text();

		this.isCancel = false;
		this.isQuit = false;

		this.container.addChild
		(
			this.panel,
			this.yesBtn,
			this.noBtn,
			this.text
		);
	}

	public enter()
	{
		this.container.zIndex = 3;

		this.panel.x = (this.app.screen.width - this.panel.width) / 2;
		this.panel.y = (this.app.screen.height - this.panel.height) / 2;

		this.text.style.fontFamily = "terminess";
		this.text.style.fontSize = 28;
		this.text.style.fill = 0x000000;
		this.text.style.align = "center";
		this.text.text = "Are you sure want to step down\n\
		from this council position?\n\n\
		All of the progress\nwon't be saved";

		let margin = (this.panel.width - this.text.width) / 2;
		this.text.x = this.panel.x + margin;
		this.text.y = this.panel.y + (this.panel.height - this.text.height) / 2;

		this.yesBtn.x = this.text.x + margin;
		this.yesBtn.y = this.panel.y + this.panel.height - this.yesBtn.height - margin * 2;
		this.yesBtn.eventMode = "static";
		this.yesBtn.cursor = "pointer";
		this.yesBtn.on
		(
			"pointerdown", () => { this.isQuit = true; }
		);

		this.noBtn.x = this.text.x + this.text.width - this.noBtn.width - margin;
		this.noBtn.y = this.yesBtn.y;
		this.noBtn.eventMode = "static";
		this.noBtn.cursor = "pointer";
		this.noBtn.on
		(
			"pointerdown", () => { this.isCancel = true; }
		);
	}

	public update(ticker: Ticker): StateTransition
	{
		if (this.isCancel)
		{
			this.isCancel = false;
			return { type: "pop" };
		}
		if (this.isQuit)
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
