new Autocomplete("search", {
    onSearch: ({ currentValue }) => {
        const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&city=${encodeURI(currentValue)}`;
  
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            resolve(data.features);
            console.log(data)
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
  
    // nominatim GeoJSON format
    
    onResults: ({ currentValue, matches, message }) => {
      const regex = new RegExp(currentValue, "gi");

      return matches === 0
        ? template
        : matches
            .map((element) => {
              return `
                  <li>
                    <p>
                      ${element.properties.display_name.replace(regex,(str) => `<b>${str}</b>`)}
                    </p>
                  </li>`;
            })
            .join("");
    },
  
    onSubmit: ({ object }) => {
      // remove all layers from the map
      map.eachLayer(function (layer) {
        if (!!layer.toGeoJSON) {
          map.removeLayer(layer);
        }
      });
  
      const { display_name } = object.properties;
      const [lng, lat] = object.geometry.coordinates;
      // custom id for marker
  
      const marker = L.marker([lat, lng], {
        draggable: true,
      });
  
      marker.addTo(map).bindPopup(display_name);
  
   
      marker.addEventListener("click", function (e) {
        let x = e.target.getLatLng();
        address(x.lat, x.lng)
          .then((add) => {
            return add;
          })
          .then((res) => {
         marker.addTo(map).bindPopup(`${res}`);
          });
      });
  
      map.setView([lat, lng], 8);
    },
  
    noResults: ({ currentValue, message }) =>
      message(`<li>No results found: "${currentValue}"</li>`),
  });
  

  
  
  const lat = 20.5937;
  const lng = 78.9629;
  
  const map = L.map("map").setView([lat, lng], 6);
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  
  const address = async function getAddress(lat, lng) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name;
  };
  
  