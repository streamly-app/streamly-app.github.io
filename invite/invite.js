// "Invite a friend" link: https://streamly-app.github.io/invite/?c=<CODE>
// The code is 6 characters from an alphabet without look-alikes (no 0/O,
// 1/I/L). The apps open streamly://invite?c=<CODE>; the Android app also
// reads invite_code from the Play install referrer.
(function (root) {
  var ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  var PATTERN = new RegExp('^[' + ALPHABET + ']{6}$');

  // Returns the code in uppercase, or null when the link is not usable.
  function parse(params) {
    var raw = params.get('c') || params.get('C') || params.get('code') || '';
    var code = String(raw).trim().toUpperCase();
    return PATTERN.test(code) ? code : null;
  }

  function platform(userAgent, maxTouchPoints) {
    var ua = String(userAgent || '');
    if (/Android/i.test(ua)) return 'android';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
    // iPadOS presents itself as a Mac; a Mac has no touch screen.
    if (/Macintosh/i.test(ua) && maxTouchPoints > 1) return 'ios';
    return 'other';
  }

  root.StreamlyInvite = {
    parse: parse,
    platform: platform,
    appUrl: function (code) { return 'streamly://invite?c=' + code; },
    appStoreUrl: function () { return 'https://apps.apple.com/app/id6769753335?ct=invite&mt=8'; },
    playUrl: function (code) {
      var referrer = 'invite_code=' + code + '&utm_source=streamly&utm_medium=invite';
      return 'https://play.google.com/store/apps/details?id=com.streamly.iptv.app&referrer=' + encodeURIComponent(referrer);
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
