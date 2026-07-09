;(function () {
  'use strict'
  var loadingClasses = ['pathable-js-loading', 'usa-js-loading']
  var fallback
  loadingClasses.forEach(function (c) {
    document.documentElement.classList.add(c)
  })
  function revertClasses() {
    loadingClasses.forEach(function (c) {
      document.documentElement.classList.remove(c)
    })
  }
  fallback = setTimeout(revertClasses, 8000)
  function verifyLoaded() {
    if (window.pathableJsLoaded) {
      clearTimeout(fallback)
      revertClasses()
      window.removeEventListener('load', verifyLoaded, true)
    }
  }
  // Check immediately in case the bundle already loaded before this script runs
  verifyLoaded()
  window.addEventListener('load', verifyLoaded, true)
})()
