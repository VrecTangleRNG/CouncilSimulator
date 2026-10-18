type GameData = { cards: number[][], incomes: number[] };
export let gameData: GameData =
{
	cards: [],
	incomes: [15.50, 0, 0],
};

type GameplayPage = { state: "policy" | "income" };
export let currentGamePage: GameplayPage = { state: "policy" };
