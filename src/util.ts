export const removeLeadingDashes = (property: string): string => {
    return property.replace(/^-+/, '');
};

export const removeQuotes = (string: string): string => {
    return string.replace(/(?:^['"]|['"]$)/g, '');
};

export const toCamelCase = (property: string): string => {
    return property.replace(/-([a-zA-Z0-9_])/g, (match, letter) => letter.toUpperCase());
};

export const restrict = (num: number, min: number, max: number): number => {
    return Math.min(max, Math.max(min, num));
};

export const map = (num: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};

export const mod = (num: number, mod: number) => {
    return ((num % mod) + mod) % mod;
};

export const toRad = (angle: number): number => angle * Math.PI / 180;