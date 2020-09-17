export function guid () {
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

export function removeFirstItem (array, item) {
  for (let i = 0; i < array.length; ++i) {
    if (array[i] === item) {
      array.splice(i, i + 1)
      break
    }
  }
}

export function removeItem (array, item) {
  for (let i = 0; i < array.length; ++i) {
    if (array[i] === item) {
      array.splice(i, i + 1)
    }
  }
}

export function isIn (rc, p) {
  return p.x >= rc.x && p.x < rc.x + rc.width && p.y >= rc.y && p.y < rc.y + rc.height
}

export function centerOf (n) {
  return {x: (n.offsetWidth || n.clientWidth) / 2 + 1, y: (n.offsetHeight || n.clientHeight) / 2 + 1}
}

export function rectOf (n) {
  return {x: 0, y: 0, width: n.offsetWidth || n.clientWidth, height: n.offsetHeight || n.clientHeight}
}

export function transformToGlobal (n, p) {
  const np = { x: p.x + n.offsetLeft || n.clientLeft, y: p.y + n.offsetTop || n.clientTop }
  for (let parent = n.offsetParent || n.parentElement; parent; parent = parent.offsetParent || parent.parentElement) {
    np.x += parent.offsetLeft || parent.clientLeft
    np.y += parent.offsetTop || parent.clientTop
  }
  return np
}

export function globalTransformTo (n, p) {
  const np = transformToGlobal(n, {x: 0, y: 0})
  return {x: p.x - np.x, y: p.y - np.y}
}

export function transformTo (from, to, p) {
  const p1 = transformToGlobal(from, p)
  const p2 = transformToGlobal(to, {x: 0, y: 0})
  return {x: p1.x - p2.x, y: p1.y - p2.y}
}
