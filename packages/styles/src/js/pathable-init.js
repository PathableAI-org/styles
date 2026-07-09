;(function () {
  'use strict'
  var loadingClass = 'pathable-js-loading'
  var fallback
  document.documentElement.classList.add(loadingClass)
  function revertClass() {
    document.documentElement.classList.remove(loadingClass)
  }
  fallback = setTimeout(revertClass, 8000)
  function verifyLoaded() {
    if (window.pathableJsLoaded) {
      clearTimeout(fallback)
      revertClass()
      window.removeEventListener('load', verifyLoaded, true)
    }
  }
  // Check immediately in case the bundle already loaded before this script runs
  verifyLoaded()
  window.addEventListener('load', verifyLoaded, true)
})()