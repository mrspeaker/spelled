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
  ctx.fillStyle = "hsl(140, 50%, 10%)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#8ae";
  ctx.font = "16px 'dos', monospace";

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (let j = 0; j < level.h; j++) {
    for (let i = 0; i < level.w; i++) {
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
  ctx.drawImage(state.imgs.ch, player.x * tw, player.y * th - 5);

  ctx.restore();

  ctx.fillStyle = "hsl(20, 50%, 70%)";
  ctx.fillText(`${cursor.x} ${cursor.y}`, 2, 2);
};
