// HerzWash — small helpers: mobile menu, click-to-load maps, placeholder highlight.
(function () {
  "use strict";

  // Mobile menu
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    var setOpen = function (open) {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };
    toggle.addEventListener("click", function () {
      setOpen(!header.classList.contains("nav-open"));
    });
    document.querySelectorAll(".nav a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Google Maps loads only after a click (no data goes to Google before that)
  document.querySelectorAll(".map[data-map-src]").forEach(function (box) {
    var button = box.querySelector("button");
    if (!button) return;
    button.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = box.getAttribute("data-map-src");
      frame.title = box.getAttribute("data-map-title") || "Karte";
      frame.referrerPolicy = "no-referrer-when-downgrade";
      frame.setAttribute("allowfullscreen", "");
      box.innerHTML = "";
      box.appendChild(frame);
    });
  });

  // Highlight placeholders such as [PREIS-AUSSEN] so they are easy to spot before launch
  var pattern = /\[[A-ZÄÖÜ][A-ZÄÖÜa-z0-9 .\/-]*\]/g;
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      var parent = node.parentNode && node.parentNode.nodeName;
      if (parent === "SCRIPT" || parent === "STYLE") return NodeFilter.FILTER_REJECT;
      pattern.lastIndex = 0;
      return pattern.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (node) {
    var frag = document.createDocumentFragment();
    var text = node.nodeValue;
    var last = 0;
    text.replace(pattern, function (match, offset) {
      frag.appendChild(document.createTextNode(text.slice(last, offset)));
      var mark = document.createElement("mark");
      mark.className = "ph";
      mark.textContent = match;
      frag.appendChild(mark);
      last = offset + match.length;
    });
    frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  });
})();
