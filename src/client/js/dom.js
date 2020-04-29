//Global variables
addToListBtn = document.querySelector('.btn-addToList');

// Change header links animation when hovering over them
document.querySelectorAll('.nav-links a').forEach(heading => {
  //hover over
  heading.addEventListener('mouseover', function() {
    heading.parentElement.classList.add('header-tab');
  })
  //hover out
  heading.addEventListener('mouseout', function() {
    heading.parentElement.classList.remove('header-tab');
  })
})

//Appear the "View my list" button after clicking the "+Add to list" button
addToListBtn.addEventListener('click', function() {
  document.querySelector('#addBtn').classList.remove('listview');
  document.querySelector('#addBtn').classList.add('listview-afterAddBtn', 'fade-in');
})
