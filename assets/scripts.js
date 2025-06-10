$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

let settings = {};

async function getSettings(){
  href = encodeURIComponent(window.location.href);
  url = `https://script.google.com/macros/s/AKfycbyNvGeZ-QbGCuxf-POFbp1b_r4qPJ-DTxLqEI7YxvltZkabBHfrDd4OGJJPiGw9-2wn/exec?request=settings&href=${href}`
  const response = await fetch(url);
  if(response.status == 200){
    settings = await response.json();
  }
}
