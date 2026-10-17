import { Sprite } from "pixi.js";

export type Position = { x: number, y: number };

export function createCards(): Sprite[]
{
	let cards: Sprite[] = [];
	cards[0] = Sprite.from("infrastructureCard");
	cards[1] = Sprite.from("educationCard");
	cards[2] = Sprite.from("safetyCard");
	cards[3] = Sprite.from("servicesCard");
	cards[4] = Sprite.from("environmentCard");
	cards[5] = Sprite.from("legislativesCard");
	cards[6] = Sprite.from("financeCard");
	cards[7] = Sprite.from("socialsCard");
	return cards;
}
