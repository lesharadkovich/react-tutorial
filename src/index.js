import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			squares: Array(9).fill(null),
			xIsNext: true
		};
	}

	renderSquare(i) {
		return (
			<Square
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		let squares = [];
		let index = 0;

		for(let i = 0; i < 3; i++) {
			let sq = [];

			for(let j = 0; j < 3; j++) {
				sq.push(this.renderSquare(index))
				index++;
			}

			squares.push(<div className="board-row">{sq}</div>);
		}

		return (
			<div>
				{squares}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			stepNumber: 0,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		
		if(calculateWinner(squares) || squares[i]) {
			return;
		}
		
		squares[i] = this.state.xIsNext ? 'X' : 'O';

		this.setState({
			history: history.concat([{
				squares: squares,
				coords: getCoords(i)
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0
		});
	}
	
	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			let desc = move ?
				(`Go to move #${move} (${step.coords.x}, ${step.coords.y})`) :
				'Go to game start';


			let isLast = move === this.state.stepNumber ? 'last' : '';

			return (
				<li key={move} className={isLast}>
					<button className={isLast} onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			)
		})


		let status;
		if(winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}
		
		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{ status }</div>
					<ol>{ moves }</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);

function getCoords(i) {
	const map = [
		{x: 1, y: 1},
		{x: 1, y: 2},
		{x: 1, y: 3},
		{x: 2, y: 1},
		{x: 2, y: 2},
		{x: 2, y: 3},
		{x: 3, y: 1},
		{x: 3, y: 2},
		{x: 3, y: 3},
	];

	return map[i];
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}