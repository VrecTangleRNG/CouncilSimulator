import { Container, Sprite } from "pixi.js";
import { createSingleCard } from "./helper";

export class CardItem
{
	private allocateBtn: Sprite;
	private bullets: Sprite[];
	public card: Sprite;
	public container: Container;

	constructor(id: number)
	{
		this.container = new Container();
		this.card = createSingleCard(id);
		this.allocateBtn = Sprite.from("allocateBtn");
		this.bullets = [];
		for (let i = 0; i < 4; i++)
		{
			this.bullets[i] = Sprite.from("taskPoint");

		this.container.addChild(this.bullets[i]); }
		this.container.addChild(this.card, this.allocateBtn);
		this.init();
	}

	private init(): void
	{
		const margin = 10;
		this.allocateBtn.x = 569 - this.allocateBtn.width;
		this.allocateBtn.y = this.card.height - this.allocateBtn.height;
		this.allocateBtn.on("pointerdown", () => {} );

		this.bullets.forEach
		(
			(sprite, index) =>
			{
				sprite.x = this.card.width + margin;
				sprite.y = this.card.y + (sprite.height + margin * 2) * index;
			}
		);
	}
}
