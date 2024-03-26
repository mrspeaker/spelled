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
    const {
        level,
        tw,
        th,
        cursor,
        player,
        typing,
        camera,
        entities,
        triggers,
        particles,
        t,
    } = state;

    const level_done = state.level_state == "done";

    ctx.fillStyle = colors[15];
    ctx.fillRect(0, 0, w, h);
    ctx.font = "16px 'dos', monospace";

    if (state.flash > 0) {
        state.flash--;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        return;
    }

    const zhw = w / 2 / camera.zoom;
    const zhh = h / 2 / camera.zoom;

    ctx.save();
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-Math.round(camera.x) + zhw, -Math.round(camera.y) + zhh);

    // Particles
    if (particles.length) {
        ctx.fillStyle = colors[11];
        particles.forEach((p) => {
            ctx.fillRect(p.x, p.y, p.size, p.size);
        });
    }

    // Camera bounds (in characters)
    const cx = Math.max(0, Math.floor((camera.x - zhw) / tw) + 0);
    const cy = Math.max(0, Math.floor((camera.y - zhh) / th) + 0);
    const cx2 = Math.min(level.w, Math.floor((camera.x + zhw) / tw) - 1);
    const cy2 = Math.min(level.h, Math.floor((camera.y + zhh) / th) + 1);

    // Level text
    ctx.fillStyle = colors[1];
    for (let j = cy; j < cy2; j++) {
        for (let i = cx; i < cx2; i++) {
            const ch = level.chars[j][i];
            ctx.fillText(ch, i * tw, j * th);
        }
    }

    // Target words
    let cur = { ch: "", x: -1, y: -1 };
    [typing.fwd, typing.back, typing.up, typing.down].forEach((w, wi) => {
        if (!w) return;
        ctx.fillStyle = colors[wi ? 8 : 11];
        for (let i = w.start; i <= w.end; i++) {
            const ch = w.word[i - w.start];
            ctx.fillText(ch, i * tw, w.y * th);
            if (wi === 0 && i === cursor.x) {
                cur.ch = w.word[i - w.start];
                cur.x = i;
                cur.y = w.y;
            }
        }
    });

    const blink = (ms, off = 0) => Math.floor((t + off) / ms) % 2 === 0;

    // Highlights
    if (cur.y !== -1 && blink(200) && !level_done) {
        // Cursor and current letter
        ctx.fillStyle = colors[10];
        //ctx.fillText("▓", cur.x * tw, cur.y * th);
        ctx.fillRect(cur.x * tw, cur.y * th, tw - 1, th);
        ctx.fillStyle = colors[15];
        ctx.fillText(cur.ch, cur.x * tw, cur.y * th);

        // Other target letters
        ctx.fillStyle = colors[1];
        typing.back &&
            typing.back.word.length &&
            ctx.fillText(
                typing.back.word[0],
                typing.back.start * tw,
                cur.y * th,
            );
        typing.up &&
            typing.up.word.length &&
            ctx.fillText(
                typing.up.word[0],
                typing.up.start * tw,
                (cur.y - 1) * th,
            );
        typing.down &&
            typing.down.word.length &&
            ctx.fillText(
                typing.down.word[0],
                typing.down.start * tw,
                (cur.y + 1) * th,
            );
    }

    // Pickups
    ctx.fillStyle = colors[10];
    entities.forEach((e, i) => {
        const on = blink(800, i * 200);
        ctx.fillText(on ? "*" : ".", e.x, e.y + (on ? 0 : -3));
    });

    // Triggers
    ctx.fillStyle = colors[13];
    triggers.forEach((t, i) => {
        if (t.type === "door") {
            ctx.fillText("╬", t.x * tw, t.y * th);
        }
    });

    // Player
    const fr_x = Math.abs(player.vx) > 0.002 ? Math.floor(t / 100) % 3 : 0;
    const fr_y = player.vx < 0 ? 1 : 0;
    ctx.drawImage(
        imgs.ch,
        9 * fr_x,
        11 * fr_y,
        9,
        11,
        player.x * tw,
        player.y * th + 6,
        9,
        11,
    );

    ctx.restore();

    // Vignette mask
    ctx.drawImage(renderer.mask, 0, 0);

    // UI
    ctx.fillStyle = colors[13];
    ctx.fillText(
        `${cur.ch} ${cur.y} ${cursor.x} ${cursor.y},${typing.fwd?.word ?? "-"}`,
        2,
        2,
    );

    ctx.font = "36px 'dos', monospace";

    if (state.level_state !== "init") {
        ctx.fillStyle = colors[11];
        (!level_done || blink(350)) &&
            ctx.fillText(
                `${(state.level_t / 1000).toFixed(2)}`,
                w / 2 - 50,
                30,
            );

        const high = state.highs[state.cur_level];
        if (level_done) {
            ctx.fillStyle = colors[0];
            ctx.fillText(
                high === state.level_t ? "new best!" : "complete!",
                w / 2 - 50,
                5,
            );
            ctx.font = "18px 'dos', monospace";
            ctx.fillText(
                `bonuses: ${(
                    (state.level_picked / state.level_picks) *
                    100
                ).toFixed(0)}%`,
                w / 2 - 50,
                70,
            );
        } else {
            ctx.font = "18px 'dos', monospace";
            ctx.fillText("hi: " + (high / 1000).toFixed(2), w / 2 - 50, 5);
        }
    }
};
