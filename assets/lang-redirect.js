(function () {
  // Only runs on the French (default) root pages - each language subfolder's
  // own page never includes this script, so there's no redirect loop.
  var AVAILABLE = ['en', 'es', 'it', 'de', 'ar'];

  try {
    if (localStorage.getItem('talvo-lang-choice')) return;
  } catch (err) {
    // localStorage unavailable (private mode, etc.) - fall through and redirect anyway.
  }

  var browserLang = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
  if (AVAILABLE.indexOf(browserLang) === -1) return;

  var path = window.location.pathname; // e.g. "/", "/privacy.html", "/terms.html"
  window.location.replace('/' + browserLang + path);
})();
