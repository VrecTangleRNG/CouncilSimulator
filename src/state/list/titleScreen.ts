import { Container, Ticker } from "pixi.js";
import { State, StateTransition } from "../machine";


export class TitleScreenState implements State
{
	name = "titleScreen";
	container = new Container;

	public enter()
	{
	}

	public update(ticker: Ticker): StateTransition
	{
		return { type: "stay" };
	}

	public pause(ticker: Ticker)
	{
	}

	public exit(): void
	{
	}
}
