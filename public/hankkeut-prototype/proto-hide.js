(function(){
  if(location.hostname==='localhost'||location.hostname==='127.0.0.1') return;
  var s=document.createElement('style');
  s.textContent='.proto-bar{display:none!important}header{top:0!important}';
  document.head.appendChild(s);
})();
