function a() {
  let x = 1
  let y = b()
  return y
}


function b() {
  let x = 1
  return x
}

a()