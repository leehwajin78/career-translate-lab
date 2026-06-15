(function(){
  if(location.hostname==='localhost'||location.hostname==='127.0.0.1') return;
  var bar=document.querySelector('.proto-bar');
  if(bar) bar.remove();
  var header=document.querySelector('header');
  if(header && header.style.top==='33px') header.style.top='0';
})();
