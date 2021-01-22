export function Lerp(x, y, t) {
  return x + t * (y - x);
}
export function RandomRange(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min;
}
;
export function Normalize2D(vector) {
  let vi = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
  let normalized = {
    x: vector.x / vi,
    y: vector.y / vi
  };
  return normalized;
}
export function VectorNumAdd(vector, scale) {
  return {
    x: vector.x + scale,
    y: vector.y + scale
  };
}
export function VectorNumScale(vector, scale) {
  return {
    x: vector.x * scale,
    y: vector.y * scale
  };
}
export function VectorDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
export function VectorAdd(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}
export function Clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
;
