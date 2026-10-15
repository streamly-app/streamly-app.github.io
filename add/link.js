// "Add to Streamly" link: one format, shared by this site and both apps.
//   https://streamly-app.github.io/add/?type=xtream&host=<server>&name=<label>
//   https://streamly-app.github.io/add/?type=m3u&url=<playlist>&name=<label>
// The apps open streamly://add?... with the same parameters. A link never
// carries a username or password, and the apps never save or connect on
// their own: they open the Add Playlist form with the address filled in.
(function (root) {
  var MAX = 2048;

  function cleanName(raw) {
    if (!raw) return null;
    var s = String(raw).replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
    // Never leave half of an emoji behind.
    if (/[\uD800-\uDBFF]$/.test(s)) s = s.slice(0, -1);
    return s.trim() || null;
  }

  function httpUrl(raw) {
    if (!raw || raw.length > MAX) return null;
    var s = String(raw).trim();
    // The apps refuse spaces, control characters and backslashes in an
    // address, so a link carrying one must not get an Open button here.
    if (/[\s\\\u0000-\u001F\u007F]/.test(s)) return null;
    var u;
    try { u = new URL(s); } catch (e) { return null; }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname || u.username || u.password) return null;
    return u;
  }

  // Returns {type, address, name} or null when the link is not usable.
  function parse(params) {
    var get = function (k) { return params.get(k) || params.get(k.toUpperCase()) || ''; };
    var type = get('type').toLowerCase();
    var host = get('host'), url = get('url');
    if (!type) type = host ? 'xtream' : (url ? 'm3u' : '');
    if (type === 'xtream') {
      var h = httpUrl(host);
      if (!h) return null;
      var path = h.pathname.replace(/\/+$/, '');
      return { type: 'xtream', address: h.protocol + '//' + h.host + path, name: cleanName(get('name')) };
    }
    if (type === 'm3u') {
      var m = httpUrl(url);
      if (!m) return null;
      return { type: 'm3u', address: String(url).trim(), name: cleanName(get('name')) };
    }
    return null;
  }

  function query(link) {
    var q = new URLSearchParams();
    q.set('type', link.type);
    q.set(link.type === 'xtream' ? 'host' : 'url', link.address);
    if (link.name) q.set('name', link.name);
    // %20, not +, for spaces: iOS does not read + as a space in a query.
    return q.toString().replace(/\+/g, '%20');
  }

  root.StreamlyLink = {
    parse: parse,
    webUrl: function (link) { return 'https://streamly-app.github.io/add/?' + query(link); },
    appUrl: function (link) { return 'streamly://add?' + query(link); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
