import { useState, useEffect } from 'react';
import House from './House';
import KeyboardEventHandler from 'react-keyboard-event-handler';

const Board = () => {
  const row1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const row2 = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11];
  const row3 = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  const [boardState, setBoardState] = useState({});
  const [selectedPiece, setSelectedPiece] = useState();

  console.log('boardState', boardState);
  console.log('selected', selectedPiece);

  const [roll, setRoll] = useState(0);
  const [turn, setTurn] = useState(1);
  const [stats, setStats] = useState({
    turn: 1,
    blackRolls: 0,
    whiteRolls: 0,
    blackPips: 0,
    whitePips: 0,
    blackDistance: 0,
    whiteDistance: 0,
  });
  const [playerTurn, setPlayerTurn] = useState('white');
  const [turnStatus, setTurnStatus] = useState('roll');

  let houseState = {};
  const boardStateKeys = Object.keys(boardState);
  boardStateKeys.forEach((piece) => {
    houseState[boardState[piece]] = +piece;
  });

  console.log('hs', houseState);
  const targetHouse = selectedPiece && boardState[selectedPiece] + roll;
  console.log('target', targetHouse);

  const getColor = (pieceId) => {
    if (!pieceId) {
      return 'empty';
    }
    return pieceId <= 5 ? 'black' : 'white';
  };

  const isBlockade = (indexes, enemyColor) => {
    const check1 = indexes[0];
    const check2 = indexes[1];
    const check3 = indexes[2];
    const check1row = Math.floor((check1 - 1) / 10) + 1;
    const check2row = Math.floor((check2 - 1) / 10) + 1;
    const check3row = Math.floor((check3 - 1) / 10) + 1;
    const check1color = getColor(houseState[check1]);
    const check2color = getColor(houseState[check2]);
    const check3color = getColor(houseState[check3]);
    if (
      check1row === check2row &&
      check2row === check3row &&
      check1color === enemyColor &&
      check2color === enemyColor &&
      check3color === enemyColor
    ) {
      return true;
    }

    return false;
  };

  let showExit = false;
  if (turnStatus === 'move') {
    if (playerTurn === 'black') {
      if (
        boardState[1] + roll === 31 ||
        boardState[2] + roll === 31 ||
        boardState[3] + roll === 31 ||
        boardState[4] + roll === 31 ||
        boardState[5] + roll === 31
      ) {
        showExit = true;
      }
    }
    if (playerTurn === 'white') {
      if (
        boardState[6] + roll === 31 ||
        boardState[7] + roll === 31 ||
        boardState[8] + roll === 31 ||
        boardState[9] + roll === 31 ||
        boardState[10] + roll === 31
      ) {
        showExit = true;
      }
    }
  }

  const canPieceMove = (pieceId) => {
    if (turnStatus !== 'move') {
      return false;
    }

    if (playerTurn === 'white' && pieceId <= 5) {
      return false;
    }

    if (playerTurn === 'black' && pieceId >= 6) {
      return false;
    }

    const destination = boardState[pieceId] + roll;
    const destinationColor = getColor(houseState[destination]);

    if (destination === 31) {
      return true;
    }

    // can't move to house occupied by same color
    if (destinationColor === playerTurn) {
      return false;
    }

    const enemyColor = playerTurn === 'white' ? 'black' : 'white';
    if (destinationColor === enemyColor) {
      const prevGuarded = ![1, 11, 21].includes(destination) && getColor(houseState[destination - 1]) === enemyColor;
      const nextGuarded = ![10, 20, 30].includes(destination) && getColor(houseState[destination + 1]) === enemyColor;
      // can't land on a guarded square
      if (nextGuarded || prevGuarded) {
        return false;
      }

      // can't land on safe spaces
      if ([15, 26, 28, 29].includes(destination)) {
        return false;
      }
    }

    // required to stop on 26
    if (destination > 26 && boardState[pieceId] !== 26) {
      return false;
    }

    // can't jump over a blockade
    if (roll === 4) {
      if (isBlockade([destination - 3, destination - 2, destination - 1], enemyColor)) {
        return false;
      }
    }

    if (roll === 5) {
      if (
        isBlockade([destination - 3, destination - 2, destination - 1], enemyColor) ||
        isBlockade([destination - 4, destination - 3, destination - 2], enemyColor)
      ) {
        return false;
      }
    }

    if (destination > 31) {
      return false;
    }

    return true;
  };

  const validMoves = {
    1: canPieceMove(1),
    2: canPieceMove(2),
    3: canPieceMove(3),
    4: canPieceMove(4),
    5: canPieceMove(5),
    6: canPieceMove(6),
    7: canPieceMove(7),
    8: canPieceMove(8),
    9: canPieceMove(9),
    10: canPieceMove(10),
  };

  console.log('validMoves', validMoves);

  const noValidMoves = !(
    validMoves[1] ||
    validMoves[2] ||
    validMoves[3] ||
    validMoves[4] ||
    validMoves[5] ||
    validMoves[6] ||
    validMoves[7] ||
    validMoves[8] ||
    validMoves[9] ||
    validMoves[10]
  );

  const initBoardState = () => {
    setBoardState({
      1: 1,
      2: 3,
      3: 5,
      4: 7,
      5: 9,
      6: 2,
      7: 4,
      8: 6,
      9: 8,
      10: 10,
    });
  };

  useEffect(() => {
    initBoardState();
  }, []);

  useEffect(() => {
    const blackPips =
      (boardState[1] > 31 ? 0 : 31 - boardState[1]) +
      (boardState[2] > 31 ? 0 : 31 - boardState[2]) +
      (boardState[3] > 31 ? 0 : 31 - boardState[3]) +
      (boardState[4] > 31 ? 0 : 31 - boardState[4]) +
      (boardState[5] > 31 ? 0 : 31 - boardState[5]);
    const whitePips =
      (boardState[6] > 31 ? 0 : 31 - boardState[6]) +
      (boardState[7] > 31 ? 0 : 31 - boardState[7]) +
      (boardState[8] > 31 ? 0 : 31 - boardState[8]) +
      (boardState[9] > 31 ? 0 : 31 - boardState[9]) +
      (boardState[10] > 31 ? 0 : 31 - boardState[10]);
    setStats((prevStats) => {
      return { ...prevStats, blackPips, whitePips };
    });
  }, [boardState]);

  useEffect(() => {
    setStats((prevStats) => {
      return { ...prevStats, turn: turn };
    });
  }, [turn]);

  const nextTurn = (trapped) => {
    setTurnStatus('roll');
    if (roll === 2 || roll === 3 || trapped) {
      const newColor = playerTurn === 'white' ? 'black' : 'white';
      setPlayerTurn(newColor);
      setTurn(turn + 1);
    }
  };

  const getTrapSquare = () => {
    return getColor(houseState[15]) === 'empty'
      ? 15
      : getColor(houseState[14]) === 'empty'
      ? 14
      : getColor(houseState[13]) === 'empty'
      ? 13
      : getColor(houseState[12]) === 'empty'
      ? 12
      : 11;
  };

  const pieceSelected = (houseId) => {
    console.log('houseId clicked', houseId);

    const pieceId = houseState[houseId];
    console.log('pieceId clicked', pieceId);

    if (houseId === targetHouse && selectedPiece) {
      console.log('moving...');
      const newBoardState = { ...boardState };
      let trapped = false;
      if (getColor(houseState[houseId]) === 'empty') {
        if (houseId === 27) {
          trapped = true;
          newBoardState[selectedPiece] = getTrapSquare();
        } else if (houseId === 31) {
          newBoardState[selectedPiece] = 99;
        } else {
          newBoardState[selectedPiece] = houseId;
        }
      } else {
        const oldHouseId = boardState[selectedPiece];
        const oldPiece = houseState[houseId];
        newBoardState[oldPiece] = oldHouseId;
        newBoardState[selectedPiece] = houseId;
      }
      console.log('newBoardState', newBoardState);
      setSelectedPiece(undefined);
      setBoardState(newBoardState);
      setStats((prevStats) => {
        const newStats = { ...prevStats };
        if (playerTurn === 'white') {
          newStats.whiteDistance = newStats.whiteDistance + roll;
        } else {
          newStats.blackDistance = newStats.blackDistance + roll;
        }
        return newStats;
      });
      nextTurn(trapped);
    } else if (validMoves[pieceId]) {
      setSelectedPiece(pieceId);
    }
  };

  const handleRoll = () => {
    const rand = Math.floor(Math.random() * 5) + 1;
    setRoll(rand);
    setTurnStatus('move');
    const newStats = { ...stats };
    if (playerTurn === 'white') {
      newStats.whiteRolls = newStats.whiteRolls + 1;
    } else {
      newStats.blackRolls = newStats.blackRolls + 1;
    }
    setStats(newStats);
  };

  const handleSkip = () => {
    setTurnStatus('roll');
    const newPlayerTurn = playerTurn === 'white' ? 'black' : 'white';
    setPlayerTurn(newPlayerTurn);
    const newStats = { ...stats };
    newStats.turn = stats.turn + 1;
    setStats(newStats);
  };

  const handleKeyPress = () => {
    if (turnStatus === 'roll') {
      handleRoll();
    } else if (noValidMoves) {
      handleSkip();
    }
  };

  return (
    <div className="rapper">
      <div className="game-state">
        <p>{playerTurn}'s turn</p>
        <p>
          {playerTurn} to {turnStatus} {turnStatus === 'move' ? roll : ''}
        </p>
        {turnStatus === 'move' && noValidMoves && (
          <div>
            <p>No Valid Moves!</p>
            <button className="roller" onClick={handleSkip}>
              Next Turn
            </button>
          </div>
        )}
        <button className="roller" onClick={handleRoll} disabled={turnStatus !== 'roll'}>
          Roll
        </button>
      </div>
      <h1>Senet</h1>
      <div className="game-stats">
        Stats:
        <pre>{JSON.stringify(stats, null, 1)}</pre>
      </div>
      <div className="row row1">
        {row1.map((id) => (
          <House
            key={id}
            id={id}
            boardState={boardState}
            houseState={houseState}
            validMoves={validMoves}
            selectedId={selectedPiece}
            target={targetHouse}
            pieceSelected={(id) => pieceSelected(id)}
          />
        ))}
      </div>
      <div className="row row2">
        {row2.map((id) => (
          <House
            key={id}
            id={id}
            board={boardState}
            houseState={houseState}
            validMoves={validMoves}
            selectedId={selectedPiece}
            target={targetHouse}
            pieceSelected={(id) => pieceSelected(id)}
          />
        ))}
      </div>
      <div className="row row3">
        {row3.map((id) => (
          <House
            key={id}
            id={id}
            boardState={boardState}
            houseState={houseState}
            validMoves={validMoves}
            selectedId={selectedPiece}
            target={targetHouse}
            pieceSelected={(id) => pieceSelected(id)}
          />
        ))}
        {showExit && (
          <House
            key={31}
            id={31}
            boardState={boardState}
            houseState={houseState}
            validMoves={validMoves}
            selectedId={selectedPiece}
            target={targetHouse}
            pieceSelected={(id) => pieceSelected(id)}
          />
        )}
      </div>
      <div className="rules">
        <p>
          Senet is an ancient egyptian game played by pharaohs and may be up to 5000 years old making it the oldest
          known board game in the world.
        </p>
        <p>
          Get your pieces to the end of the board before your opponent. If you land on a space occupied by an opponent,
          capture it by exchanging their places.
        </p>
        <p>
          Rolls are 1 through 5. If you roll a 1, 4, or 5 you can roll again. If you can make a valid move you must, and
          if you cannot make any valid moves your turn ends.
        </p>
        <p>
          Two pieces of the same color next to each other <strong>in the same row</strong> are safe and may not be
          captured.
        </p>
        <p>
          Three pieces of the same color all next to each other <strong>in the same row</strong> are a blockade and may
          not be captured or jumped over.
        </p>
        <p>
          Squares 15, 26, 28 and 29 are safe spaces and may not be captured at any time. You can only exit 28 and 29
          with an exact roll.
        </p>
        <p>You cannot proceed past square 26 without stopping on it first.</p>
        <p>If you land on square 27 you must return to square 15 instead.</p>
      </div>
      <KeyboardEventHandler handleKeys={['a', 'b', 'c', 'r']} onKeyEvent={(key, e) => handleKeyPress()} />
    </div>
  );
};

export default Board;
