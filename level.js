export const mk_level = () => {
  const txt = `


oh the level is made of text wowo


of a great fortune must be in want
                   u
                   p
it's not   up to me to say really
       u            g
       p            o
beyond the recesses of the southern
`;
  const lines = txt.split("\n").slice(1).slice(0, -1);
  const longest = lines.reduce(
    (ac, el) => (el.length > ac ? el.length : ac),
    0
  );
  const chars = lines.map((l) => l.padEnd(longest).split(""));

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

  return {
    w: longest,
    h: lines.length,
    chars,
    words,
    word_at_xy,
  };
};
