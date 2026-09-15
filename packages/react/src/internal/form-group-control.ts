const compositeControls = new WeakSet<object>()

export function registerFormGroupCompositeControl(control: object) {
  compositeControls.add(control)
}

export function isFormGroupCompositeControl(control: unknown) {
  return (
    ((typeof control === 'object' && control !== null) ||
      typeof control === 'function') &&
    compositeControls.has(control)
  )
}
