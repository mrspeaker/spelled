export const mk_camera = () => ({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    zoom: 2,
    tz: 2,
});

export const update_camera = (camera, state, snap = false) => {
    const { player, w, h, tw, th } = state;
    const move_speed = snap ? 1 : 0.04;
    const zoom_speed = snap ? 1 : 0.01;
    camera.tx = player.x * tw;
    camera.ty = player.y * th;
    camera.x += (camera.tx - camera.x) * move_speed;
    camera.y += (camera.ty - camera.y) * move_speed;
    camera.zoom += (camera.tz - camera.zoom) * zoom_speed;
};
