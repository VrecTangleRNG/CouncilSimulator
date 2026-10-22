type GameData =
{
	cards: number[][],
	progress: number[][],
	incomes: number[],
	money: number,
	trust: number,
	trustRate: number,
	days: number
};
export let gameData: GameData;

export function resetGameData()
{
	gameData =
	{
		cards: [],
		progress: [[]],
		incomes: [15.50, 0, 0],
		money: 200.00,
		trust: 50,
		trustRate: 1.4,
		days: 0
	};
}

type GameplayPage = { state: "policy" | "income" };
export let currentGamePage: GameplayPage = { state: "policy" };
