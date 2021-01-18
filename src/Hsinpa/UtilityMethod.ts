export function Lerp(x : number, y : number, t : number) {
    return x + (t * (y - x));
}