export const mk_player = (x, y) => {
  return {
    x,
    y,
    tx: x,
    ty: y,
  };
};

export const update_player = (p) => {
  const dx = p.tx - p.x;
  const dy = p.ty - p.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    p.x += dx * 0.01;
    p.y = p.ty;
  } else {
    p.y += dy * 0.01;
    p.x = p.tx;
  }
};
