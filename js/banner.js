(function(){
  const imgs = document.querySelectorAll('.banner-rotator img');
  if(!imgs.length) return;
  let i = 0;
  setInterval(()=>{
    imgs[i].classList.remove('active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('active');
  }, 4000);
})();
