export const update_physics = (state) => {
    const { player } = state;
    player.x += player.vx;
    player.y += player.vy;

    // Gravity
    player.acy += 0.01;
    player.vy += player.acy;
    player.acy = 0;
};
