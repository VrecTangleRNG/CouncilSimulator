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

export function createSingleCard(id: number): Sprite
{
	switch (id)
	{
		case 0: return Sprite.from("infrastructureCard");
		case 1: return Sprite.from("educationCard");
		case 2: return Sprite.from("safetyCard");
		case 3: return Sprite.from("servicesCard");
		case 4: return Sprite.from("environmentCard");
		case 5: return Sprite.from("legislativesCard");
		case 6: return Sprite.from("financeCard");
		case 7: return Sprite.from("socialsCard");
	}

	return new Sprite();
}
