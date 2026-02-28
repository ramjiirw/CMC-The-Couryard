/**
 * auth.js — CMC The Courtyard shared authentication guard
 *
 * Include this script in the <head> of every protected page:
 *   <script src="auth.js"></script>
 *
 * Configuration is inherited from the session set by index.html.
 * To change idle timeout, update CONFIG.idleMinutes in index.html.
 */

(function () {
  const IDLE_MINUTES = 30;                  // must match index.html CONFIG.idleMinutes
  const LOGIN_PAGE   = 'index.html';
  const IDLE_MS      = IDLE_MINUTES * 60 * 1000;

  function getLastActive() {
    return parseInt(sessionStorage.getItem('cyard_last_active') || '0');
  }

  function updateLastActive() {
    sessionStorage.setItem('cyard_last_active', Date.now().toString());
  }

  function logout(reason) {
    // Store current page so user returns here after re-login
    sessionStorage.setItem('cyard_return_to', window.location.pathname + window.location.search);
    sessionStorage.removeItem('cyard_auth');
    sessionStorage.removeItem('cyard_last_active');
    window.location.href = LOGIN_PAGE + (reason ? '?reason=' + reason : '');
  }

  // ── Check auth on load ──────────────────────────────────────────────
  const auth = sessionStorage.getItem('cyard_auth');

  if (auth !== '1') {
    logout('');
    return; // stop executing — redirect is underway
  }

  const elapsed = Date.now() - getLastActive();
  if (elapsed >= IDLE_MS) {
    logout('timeout');
    return;
  }

  // Valid session — refresh the timestamp
  updateLastActive();

  // ── Reset idle timer on any user activity ───────────────────────────
  let idleTimer = null;

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    updateLastActive();
    idleTimer = setTimeout(function () {
      logout('timeout');
    }, IDLE_MS);
  }

  // Start the timer
  resetIdleTimer();

  // Listen for activity events
  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(function (evt) {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });

  // ── Expose a logout function for pages that want a logout button ────
  window.cmcLogout = function () {
    clearTimeout(idleTimer);
    sessionStorage.removeItem('cyard_auth');
    sessionStorage.removeItem('cyard_last_active');
    window.location.href = LOGIN_PAGE;
  };

})();
