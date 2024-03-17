export const update_physics = (state) => {
  const { player } = state;

  player.vx += player.acx;
  player.acx = 0;

  player.vy += player.acy;
  player.acy = 0;

  // Gravity
  player.vy += 0.01;

  player.x += player.vx;
  player.y += player.vy;
};
