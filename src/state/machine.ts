import { Container, Ticker } from 'pixi.js';

export type StateTransition =
	| { type: "stay" | "pop" }
	| { type: "push" | "replace"; state: State };

export interface State
{
	name: string;
	container: Container;

	enter(): void;
	update(ticker: Ticker): StateTransition;
	pause(ticker: Ticker): void;
	exit(): void;
}

export class StateMachine
{
	private states: State[] = [];

	constructor(initialState: State)
	{
		initialState.enter();
		this.states.push(initialState);
	}

	run(ticker: Ticker)
	{
		// Update head
		let runningStateLength = this.states.length;
		let stateDecider: StateTransition = this.states[runningStateLength - 1].update(ticker);

		// Update stack, except the head
		for (let i = runningStateLength - 2; i >= 0; i--)
		{
			this.states[i].pause(ticker);
		}

		// Push state
		if (stateDecider.type === "push" || stateDecider.type === "replace")
		{
			// Replace state
			if (stateDecider.type === "replace")
			{
				this.states[runningStateLength - 1].exit();
				this.states.pop();
			}

			stateDecider.state.enter();
			this.states.push(stateDecider.state);
		}

		// Pop state
		else if (stateDecider.type === "pop")
		{
			this.states[runningStateLength - 1].exit();
			this.states.pop();
		}

		// TODO: quit the game when the stack is empty
	}
}
