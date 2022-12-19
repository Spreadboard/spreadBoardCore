export function kebab(str: string[]) {
    const replace = (s: string) => s.toLowerCase().replace(/ /g, '-');

    return Array.isArray(str) ? str.map(replace) : replace(str);
}
