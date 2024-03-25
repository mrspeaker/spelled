export const update_physics = (state) => {
    const { player } = state;
    player.x += player.vx;
    player.y += player.vy;

    player.vx += player.acx;
    player.acx = 0;

    if (!player.jumping) {
        player.vx *= 0.9;
    }

    // Gravity
    player.acy += 0.01;
    player.vy += player.acy;
    player.acy = 0;
};
