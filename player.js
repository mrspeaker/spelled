export const mk_player = (x, y) => {
  return {
    x,
    y,
    tx: x,
    ty: y,
  };
};

export const update_player = (p) => {
  p.x += (p.tx - p.x) * 0.01;
};
