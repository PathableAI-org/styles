;(function () {
  'use strict'
  const loadingClasses = ['pathable-js-loading', 'usa-js-loading']
  loadingClasses.forEach(function (c) {
    document.documentElement.classList.add(c)
  })
  function revertClasses() {
    loadingClasses.forEach(function (c) {
      document.documentElement.classList.remove(c)
    })
  }
  const fallback = setTimeout(revertClasses, 8000)
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
