import { closeAutoList } from './dom.js';
import { addAutoCompleteList} from './dom.js';

const dest_box = document.getElementById('destination-text')
dest_box.addEventListener('input', citySearch);

function citySearch(e) {
  let name = e.target.value;
  closeAutoList();
  if (!name) return false;
  if (name.length >= 3) { //if user has entered the first three letters
    postData('http://localhost:3000/places', {
        cityName: name
      })
      .then(addAutoCompleteList)
    }
    else {
      const auto = document.getElementById("auto");
      if(auto) auto.remove();
    }
  }

    // post data to the server side to find the city name suggestions
    const postData = async (url = '', data = {}) => {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(data),
      });

      try {
        const newData = await response.json();
        console.log(newData);
        return newData;
      } catch (error) {
        console.log("error", error);
      }
    }
