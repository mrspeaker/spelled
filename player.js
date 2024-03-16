export const mk_player = (x, y) => {
  return {
    x,
    y,
    tx: x,
    ty: y,
  };
};

export const update_player = (p) => {
  if (p.y === p.ty) {
    p.x += (p.tx - p.x) * 0.01;
  } else {
    p.y = p.ty;
    p.x = p.tx;
  }
};
