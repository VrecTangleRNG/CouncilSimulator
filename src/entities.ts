import { BitmapText, Container, Sprite, TextStyle } from "pixi.js";
import { createSingleCard } from "./helper";
import { gameData } from "./global";

export class CardItem
{
	private bullets: Sprite[];
	private texts: BitmapText[];
	private textStyle: TextStyle;
	public container: Container;
	public card: Sprite;
	public allocateBtn: Sprite;

	public period: number;
	public id: number;

	constructor(cardsId: number, period: number, id: number)
	{
		this.container = new Container();
		this.card = createSingleCard(cardsId);
		this.allocateBtn = Sprite.from("allocateBtn");
		this.textStyle = new TextStyle();

		this.period = period;
		this.id = id;

		this.bullets = [];
		this.texts = [];
		for (let i = 0; i < 4; i++)
		{
			this.bullets[i] = Sprite.from("taskPoint");
			this.texts[i] = new BitmapText();

		this.container.addChild(this.bullets[i]);
		this.container.addChild(this.texts[i]);
		}
		this.container.addChild(this.card, this.allocateBtn);
		this.init();
	}

	private init(): void
	{
		const margin = 10;

		this.container.on
		(
			"progressed", () =>
			{
				let progress = gameData.progress[this.period][this.id];
				if (progress >= 0)
				{
					this.bullets.forEach
					(
						(sprite, index) =>
						{
							if (progress >= index)
							{
								sprite.visible = false;
								this.texts[index].visible = false;
							}
						}
					);
				}
				if (!this.bullets[3].visible)
				{
					gameData.progress[this.period][this.id] = -1;
					this.bullets.forEach
					(
						(sprite, index) =>
						{
							sprite.visible = true;
							sprite.x = this.card.width + margin;
							sprite.y = this.card.y + (sprite.height + margin * 2) * index;
							this.texts[index].visible = true;
							this.texts[index].x = sprite.x + sprite.width + margin;
							this.texts[index].y = sprite.y +
								(sprite.height - this.texts[index].height) / 2;
						}
					);
				}
			}
		);

		this.allocateBtn.x = 569 - this.allocateBtn.width;
		this.allocateBtn.y = this.card.height - this.allocateBtn.height;
		this.allocateBtn.eventMode = "static";
		this.allocateBtn.cursor = "pointer";

		this.textStyle.fontFamily = "terminessBMP";
		this.textStyle.fontSize = 20;
		this.textStyle.fill = 0x000000;

		this.bullets.forEach
		(
			(sprite, index) =>
			{
				sprite.x = this.card.width + margin;
				sprite.y = this.card.y + (sprite.height + margin * 2) * index;

				this.texts[index].style = this.textStyle;
				switch (index)
				{
					case 0: this.texts[index].text = "Formulate & launch policies";
						break;
					case 1: this.texts[index].text = "Implement policies";
						break;
					case 2: this.texts[index].text = "Mediate disputes about policy";
						break;
					case 3: this.texts[index].text = "Monitor & review policies";
						break;
					default: break;
				}
				this.texts[index].x = sprite.x + sprite.width + margin;
				this.texts[index].y = sprite.y + (sprite.height - this.texts[index].height) / 2;
			}
		);
	}
}
