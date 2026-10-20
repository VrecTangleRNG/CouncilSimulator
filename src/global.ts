type GameData = { cards: number[][], incomes: number[], money: number, trust: number};
export let gameData: GameData =
{
	cards: [],
	incomes: [15.50, 0, 0],
	money: 200.00,
	trust: 50,
};

type GameplayPage = { state: "policy" | "income" };
export let currentGamePage: GameplayPage = { state: "policy" };
