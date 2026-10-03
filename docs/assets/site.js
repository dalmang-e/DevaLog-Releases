// GitHub 릴리스에서 최신 버전·설치 파일·패치노트를 불러온다. 실패하면 HTML에 적힌 내용을 그대로 둔다.
(function () {
  var API = 'https://api.github.com/repos/dalmang-e/DevaLog-Releases/releases?per_page=5';
  function day(iso) {
    var d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
    return d.getUTCFullYear() + '.' + String(d.getUTCMonth() + 1).padStart(2, '0') + '.' + String(d.getUTCDate()).padStart(2, '0');
  }
  function bullets(body) {
    return (body || '').split(/\r?\n/).filter(function (l) { return /^[-*] \S/.test(l); })
      .map(function (l) { return l.slice(2).replace(/<[^>]*>|\*\*|`/g, '').trim(); }).slice(0, 3);
  }
  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (list) {
      list = list.filter(function (r) { return !r.draft && !r.prerelease; });
      if (!list.length) return;
      var top = list[0];
      var ver = document.querySelector('.ver');
      if (ver) ver.textContent = '최신 ' + top.tag_name + ' · ' + day(top.published_at);
      var exe = (top.assets || []).filter(function (a) { return /\.exe$/i.test(a.name); })[0];
      var btn = document.querySelector('.dlbtn');
      if (btn && exe) btn.href = exe.browser_download_url;
      var notes = document.getElementById('notes');
      var more = notes && notes.querySelector('.more');
      if (!notes || !more) return;
      var shown = list.map(function (r) { return { r: r, b: bullets(r.body) }; })
        .filter(function (x) { return x.b.length; }).slice(0, 2);
      if (!shown.length) return;
      notes.querySelectorAll('.rel').forEach(function (el) { el.remove(); });
      shown.forEach(function (x) {
        var div = document.createElement('div'); div.className = 'rel';
        var v = document.createElement('span'); v.className = 'v';
        v.textContent = x.r.tag_name + ' · ' + day(x.r.published_at);
        var ul = document.createElement('ul');
        x.b.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
        div.appendChild(v); div.appendChild(ul);
        notes.insertBefore(div, more);
      });
    })
    .catch(function () {});
})();
