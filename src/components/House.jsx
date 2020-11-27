const House = (props) => {
  const { id, boardState, houseState, selectedId, validMoves, pieceSelected, target } = props;

  const isSelected = houseState && selectedId ? selectedId === houseState[id] : false;
  const isTarget = target === id;

  let color = 'none';
  let pieceId = undefined;
  if (houseState) {
    pieceId = houseState[id];
  }
  if (pieceId !== undefined) {
    color = pieceId <= 5 ? 'black' : 'white';
  }

  const canMove = pieceId !== undefined && validMoves[pieceId];

  return (
    <div className={`house house${id}`}>
      <div className="house-id">{id <= 30 ? id : 'exit'}</div>
      <div
        className={`piece piece-${color} ${isSelected ? 'selected' : ''} ${canMove ? 'can-move' : ''} ${
          isTarget ? 'target' : ''
        }`}
        onClick={(e) => pieceSelected(id)}
      ></div>
    </div>
  );
};

export default House;
