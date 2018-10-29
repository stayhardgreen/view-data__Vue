export function elementWidth(ref) {
  return ref && ref instanceof Element ? ref.clientWidth : 0;
}

export function breakPointName(size) {
  if (size && typeof size === 'number') {
    if (size < 480) {
      return 'smaller';
    } else if (size < 768) {
      return 'small';
    } else if (size < 1680) {
      return 'medium';
    }
  }
  return 'large';
}

export function sizeValidator(value, withAuto = false) {
  if (withAuto) {
    return ['auto', 'large', 'medium', 'small', 'smaller'].includes(value);
  }
  return ['large', 'medium', 'small', 'smaller'].includes(value);
}
