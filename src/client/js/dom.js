//Global variables
addToListBtn = document.querySelector('.btn-addToList');
headerTabs = document.querySelectorAll('.nav-links a');

// Change header links appearance when hovering over them
headerTabs.forEach(heading => {
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

//Scroll to section when clicking on the header tabs
headerTabs.forEach(heading => {
  heading.addEventListener('click', function(e) {
    e.preventDefault();
    const eventId = e.target.getAttribute('href');
    if (eventId != null && eventId !== '#') {
      console.log(eventId);
      document.getElementById(eventId).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
