import { txt } from "./level_txt.js";

export const load_level = (name) => {
    return fetch("res/data/" + name).then((r) => r.text());
};

export const mk_level = (txt) => {
    const raw = txt.split("\n");
    const longest = raw.reduce(
        (ac, el) => (el.length > ac ? el.length : ac),
        0
    );
    const lines = raw.map((l) => l.padEnd(longest) + "▓");

    const spawns = {
        player: [0, 0],
        pickups: [],
    };

    const chars = lines.map((l, y) =>
        l.split("").map((ch, x) => {
            if (ch === "☺") {
                spawns.player[0] = x;
                spawns.player[1] = y;
                return " ";
            }
            if (ch === "♦") {
                spawns.pickups.push([x, y]);
                return " ";
            }
            return ch;
        })
    );

    const indexes = lines.map((l) => {
        const words = l.split(" ");
        return words.reduce(
            (ac, el) => {
                const { words, i } = ac;
                const start = i;
                const word = el;
                const len = word.length;
                words.push({
                    word,
                    start,
                    end: start + len,
                });
                return { words, i: start + len + 1 };
            },
            { words: [], i: 0 }
        );
    });

    const get_by_index = (x, y) => {
        const word = indexes[y].words.find(({ end }) => end >= x);
        return word;
    };

    const words = lines.map((l) =>
        l.split(" ").reduce((ac, el) => {
            ac.push(el);
            return ac;
        }, [])
    );

    const word_at_xy = (x, y) => {
        const token = get_by_index(x, y);
        if (!token) {
            console.log(x, y, indexes[y].words);
        }
        const word = token.word;
        const char_idx = x - token.start;
        const start = token.start;
        const end = token.end;
        return {
            word,
            char_idx,
            start,
            end,
            y,
        };
    };

    const ch_at_xy = (x, y) => {
        const token = get_by_index(x, y);
        const char_idx = x - token.start;
        return token.word[char_idx] || " ";
    };

    return {
        w: longest,
        h: lines.length,
        chars,
        words,
        word_at_xy,
        ch_at_xy,
        spawns,
    };
};

export const find_free_ground = (level) => {
    return {
        x: (Math.random() * level.w) | 0,
        y: ((Math.random() * (level.h / 3)) | 0) * 3 + 0,
    };
};
