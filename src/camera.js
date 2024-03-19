export const mk_camera = () => ({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
});

export const update_camera = (camera, state) => {
    const { player, w, h, tw, th } = state;
    camera.tx = player.x * tw - w / 2;
    camera.ty = player.y * th - h / 2;
    camera.x += (camera.tx - camera.x) * 0.04;
    camera.y += (camera.ty - camera.y) * 0.04;
};
