export const mk_renderer = (dom, selector) => {
  const ctx = dom.querySelector(selector).getContext("2d");
  ctx.textBaseline = "top";

  const w2 = ctx.canvas.width / 2;
  const h2 = ctx.canvas.height / 2;

  var g = ctx.createRadialGradient(w2, h2, 0, w2, h2, ctx.canvas.height);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.8, "#000");

  return {
    ctx,
    canvas: ctx.canvas,
    w: ctx.canvas.width,
    h: ctx.canvas.height,
    g,
  };
};

export const render = (renderer, state) => {
  const { ctx, w, h } = renderer;
  const { level, tw, th, cursor, player, cur_word, camera, entities } = state;
  ctx.fillStyle = "hsl(140, 50%, 0%)";
  ctx.fillRect(0, 0, w, h);
  ctx.font = "16px 'dos', monospace";

  if (state.flash > 0) {
    state.flash--;
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 0, w, h);
    return;
  }

  // Background
  ctx.globalAlpha = 0.5;
  ctx.drawImage(state.imgs.jim, 0, 0);
  ctx.globalAlpha = 1.0;

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  // Camera bounds
  const cx = Math.max(0, (camera.x / tw) | 0);
  const cy = Math.max(0, (camera.y / th) | 0);
  const cx2 = Math.min(level.w, (cx + w / tw) | 0) + 1;
  const cy2 = Math.min(level.h, (cy + h / th) | 0) + 1;

  // Level text
  ctx.fillStyle = "#68c";
  for (let j = cy; j < cy2; j++) {
    for (let i = cx; i < cx2; i++) {
      ctx.fillText(level.chars[j][i], i * tw, j * th);
    }
  }
  // Current word
  if (cur_word) {
    ctx.fillStyle = "hsl(0, 80%, 70%)";
    for (let i = cur_word.start; i < cur_word.end; i++) {
      ctx.fillText(cur_word.word[i - cur_word.start], i * tw, cur_word.y * th);
    }
  }

  // Cursor
  ctx.fillStyle = "hsl(20, 50%, 70%)";
  ((Date.now() / 500) | 0) % 2 &&
    ctx.fillText("|", cursor.x * tw - tw / 2.2, cursor.y * th);

  ctx.fillStyle = "yellow";
  entities.forEach((e, i) => {
    const on = Math.floor((Date.now() + i * 200) / 800) % 2 === 0;
    ctx.fillText(on ? "*" : ".", e.x, e.y + (on ? 0 : -3));
  });

  // Player
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

  // Edge mask
  ctx.fillStyle = renderer.g;
  ctx.rect(0, 0, w, h);
  ctx.fill();

  // UI
  ctx.fillStyle = "hsl(20, 50%, 70%)";
  ctx.fillText(`${cursor.x} ${cursor.y}`, 2, 2);
};
