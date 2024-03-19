import { colors } from "./colors.js";

export const mk_renderer = (doc, selector, imgs) => {
    const ctx = doc.querySelector(selector).getContext("2d");
    ctx.textBaseline = "top";
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    // Caching vignette mask
    const post_ctx = doc.createElement("canvas").getContext("2d");
    post_ctx.canvas.setAttribute("width", w);
    post_ctx.canvas.setAttribute("height", h);
    const w2 = w / 2;
    const h2 = h / 2;
    var g = ctx.createRadialGradient(w2, h2, 0, w2, h2, ctx.canvas.height);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgb(0,0,0)");
    post_ctx.fillStyle = g;
    post_ctx.rect(0, 0, w, h);
    post_ctx.fill();

    return {
        ctx,
        canvas: ctx.canvas,
        mask: post_ctx.canvas,
        w,
        h,
        imgs,
    };
};

export const render = (renderer, state) => {
    const { ctx, w, h, imgs } = renderer;
    const { level, tw, th, cursor, player, typing, camera, entities } = state;
    ctx.fillStyle = colors[15];
    ctx.fillRect(0, 0, w, h);
    ctx.font = "16px 'dos', monospace";

    if (state.flash > 0) {
        state.flash--;
        ctx.fillStyle = colors[0];
        ctx.fillRect(0, 0, w, h);
        return;
    }

    // Background
    //    ctx.globalAlpha = 0.7;
    //    ctx.drawImage(imgs.jim, 0, 0);
    //    ctx.globalAlpha = 1.0;

    ctx.save();
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

    // Camera bounds
    const cx = Math.max(0, (camera.x / tw) | 0);
    const cy = Math.max(0, (camera.y / th) | 0);
    const cx2 = Math.min(level.w, (cx + w / tw) | 0) + 1;
    const cy2 = Math.min(level.h, (cy + h / th) | 0) + 1;

    // Level text
    ctx.fillStyle = colors[1];
    for (let j = cy; j < cy2; j++) {
        for (let i = cx; i < cx2; i++) {
            ctx.fillText(level.chars[j][i], i * tw, j * th);
        }
    }

    // Target words
    let cur = { ch: "", x: -1, y: -1 };
    [typing.fwd, typing.back, typing.up, typing.down].forEach((w, wi) => {
        if (!w) return;
        ctx.fillStyle = colors[wi ? 11 : 8];
        for (let i = w.start; i < w.end; i++) {
            ctx.fillText(w.word[i - w.start], i * tw, w.y * th);
            if (wi === 0 && i === cursor.x) {
                cur.ch = w.word[i - w.start];
                cur.x = i;
                cur.y = w.y;
            }
        }
    });

    // Highlight current letter
    if (cur.ch) {
        ctx.fillStyle = colors[9];
        ctx.fillText(cur.ch, cur.x * tw, cur.y * th);
    }

    // Cursor
    ctx.fillStyle = colors[8];
    ((Date.now() / 500) | 0) % 2 &&
        ctx.fillText("|", cursor.x * tw - tw / 2.2, cursor.y * th);

    // Pickups
    ctx.fillStyle = colors[10];
    entities.forEach((e, i) => {
        const on = Math.floor((Date.now() + i * 200) / 800) % 2 === 0;
        ctx.fillText(on ? "*" : ".", e.x, e.y + (on ? 0 : -3));
    });

    // Player
    const fr_x =
        Math.abs(player.vx) > 0.0 ? Math.floor(Date.now() / 100) % 3 : 0;
    const fr_y = player.vx < 0 ? 1 : 0;
    ctx.drawImage(
        imgs.ch,
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

    // Vignette mask
    ctx.drawImage(renderer.mask, 0, 0);

    // UI
    ctx.fillStyle = colors[13];
    ctx.fillText(
        `${cursor.x} ${cursor.y}, ${state.cur_word?.word ?? "-"}`,
        2,
        2
    );
};
