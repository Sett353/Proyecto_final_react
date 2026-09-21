function Dragon({ posicion, direccion }) {
  return (
    <div
      className="dragon"
      style={{
        left: `${posicion}px`,
      }}
    >
      <span
        className="dragon__emoji"
        aria-label="dragón"
        style={{
          transform: direccion === 'derecha' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        🐉
      </span>
    </div>
  );
}

export default Dragon;
