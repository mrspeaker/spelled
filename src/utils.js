export const rnd = (min = 0, max = 100) => Math.floor(rndf(min, max));

export const rndf = (min = 0, max = 1) => {
    return Math.random() * (max - min) + min;
};
