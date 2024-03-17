export const mk_renderer = (dom, selector) => {
  const ctx = dom.querySelector(selector).getContext("2d");
  ctx.textBaseline = "top";
  return {
    ctx,
    canvas: ctx.canvas,
    w: ctx.canvas.width,
    h: ctx.canvas.height,
  };
};

export const render = (renderer, state) => {
  const { ctx, w, h } = renderer;
  const { level, tw, th, cursor, player, cur_word, camera } = state;
  ctx.fillStyle = "hsl(140, 50%, 5%)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#8ae";
  ctx.font = "16px 'dos', monospace";

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  const cx = (camera.x / tw) | 0;
  const cy = (camera.y / th) | 0;
  const cx2 = Math.min(level.w, (cx + w / tw) | 0) + 1;
  const cy2 = Math.min(level.h, (cy + h / th) | 0) + 1;

  for (let j = cy; j < cy2; j++) {
    for (let i = cx; i < cx2; i++) {
      ctx.fillText(level.chars[j][i], i * tw, j * th);
    }
  }
  if (cur_word) {
    ctx.fillStyle = "hsl(0, 80%, 70%)";
    for (let i = cur_word.start; i < cur_word.end; i++) {
      ctx.fillText(cur_word.word[i - cur_word.start], i * tw, cur_word.y * th);
    }
  }
  ctx.fillStyle = "hsl(20, 50%, 70%)";
  ((Date.now() / 500) | 0) % 2 &&
    ctx.fillText("|", cursor.x * tw - tw / 2.2, cursor.y * th);

  /*drawImage(image,
    sx, sy, sw, sh,
    dx, dy, dw, dh);    */
  const fr_x = Math.abs(player.vx) < 1 ? 0 : Math.floor(Date.now() / 100) % 3;
  const fr_y = player.vx < 0 ? 1 : 0;
  ctx.drawImage(
    state.imgs.ch,
    9 * fr_x,
    11 * fr_y,
    9,
    11,
    player.x * tw,
    player.y * th + 8,
    9,
    11
  );

  ctx.restore();
  ctx.fillStyle = "hsl(20, 50%, 70%)";
  ctx.fillText(`${cursor.x} ${cursor.y}`, 2, 2);
};
