(function(){
  var h=location.hostname;
  if(h==='localhost'||h==='127.0.0.1'||h==='') return;
  var s=document.createElement('style');
  s.textContent='.proto-bar{display:none!important}header{top:0!important}';
  document.head.appendChild(s);
})();
