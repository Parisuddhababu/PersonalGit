let mapOptions;
let map;
let autocomplete;
const coordinates = [];

function initMap() {
  const triangleCoords = [
    { lat: 23.011697, lng: 72.457074 },
    { lat: 22.99242, lng: 72.445401 },
    { lat: 22.996212, lng: 72.473553 },
  ];

  const rectangleCoords = [
    { lat: 23.0395, lng: 72.54222 },
    { lat: 23.00569, lng: 72.54153 },
    { lat: 23.00696, lng: 72.60539 },
    { lat: 23.03919, lng: 72.60367 },
  ];

  const location = new google.maps.LatLng(23.0225, 72.5714);
  mapOptions = {
    zoom: 12,
    center: location,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  const card = document.getElementById("pac-card");
  const input = document.getElementById("pac-input");
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);

  autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.bindTo("bounds", map);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");

  infowindow.setContent(infowindowContent);

  const marker = new google.maps.Marker({
    map,
    anchorPoint: new google.maps.Point(0, -29),
  });

  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry?.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(11);
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);
    infowindowContent.children["place-name"].textContent = place.name;
    infowindowContent.children["place-address"].textContent =
      place.formatted_address;
    infowindow.open(map, marker);
  });

  const polygonWithCoords = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: "#000",
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#ADFF2F",
    fillOpacity: 0.35,
    editable: true,
  });

  const polygonWithCoords1 = new google.maps.Polygon({
    paths: rectangleCoords,
    strokeColor: "#000",
    strokeOpacity: 1,
    strokeWeight: 3,
    fillColor: "#ADFF2F",
    fillOpacity: 0.35,
    editable: true,
  });

  const allOverlays = [];
  console.log(allOverlays);

  let selectedShape;
  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYGON],
    },
    polygonOptions: {
      clickable: true,
      draggable: false,
      editable: true,
      fillColor: "#ADFF2F",
      fillOpacity: 0.3,
    },
  });

  function clearSelection() {
    if (selectedShape) {
      selectedShape.setEditable(false);
      selectedShape = null;
    }
  }

  function stopDrawing() {
    drawingManager.setMap(null);
  }

  function setSelection(shape) {
    clearSelection();
    stopDrawing();
    selectedShape = shape;
    shape.setEditable(true);
  }

  function deleteSelectedShape() {
    if (selectedShape) {
      selectedShape.setMap(null);
      drawingManager.setMap(map);
      coordinates.splice(0, coordinates.length);
    }
    polygonWithCoords.setMap(null);
    polygonWithCoords1.setMap(null);
  }

  function CenterControl(controlDiv) {
    const controlUI = document.createElement("div");
    controlUI.style.marginBottom = "20px";
    controlUI.style.textAlign = "center";
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement("button");
    controlText.style.fontSize = "14px";
    controlText.style.height = "25px";
    controlText.style.cursor = "pointer";
    controlText.innerHTML = "Delete Area";
    controlUI.appendChild(controlText);

    //to delete the polygon
    controlUI.addEventListener("click", function () {
      deleteSelectedShape();
    });
  }

  drawingManager.setMap(map);

  const getPolygonCoords = function (newShape) {
    coordinates.splice(0, coordinates.length);

    const len = newShape.getPath().getLength();

    for (let i = 0; i < len; i++) {
      coordinates.push(newShape.getPath().getAt(i).toUrlValue(6));
    }
    return coordinates;
  };

  google.maps.event.addListener(
    drawingManager,
    "polygoncomplete",
    function (event) {
      event.getPath().getLength();
      google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

      google.maps.event.addListener(event.getPath(), "insert_at", function () {
        getPolygonCoords(event);
      });

      google.maps.event.addListener(event.getPath(), "set_at", function () {
        getPolygonCoords(event);
      });
    }
  );

  google.maps.event.addListener(
    drawingManager,
    "overlaycomplete",
    function (event) {
      allOverlays.push(event);
      if (event.type !== google.maps.drawing.OverlayType.MARKER) {
        drawingManager.setDrawingMode(null);

        const newShape = event.overlay;
        newShape.type = event.type;
        google.maps.event.addListener(newShape, "click", function () {
          setSelection(newShape);
        });
        setSelection(newShape);
      }
    }
  );

  const centerControlDiv = document.createElement("div");
  CenterControl(centerControlDiv);

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(
    centerControlDiv
  );

  const selectEle = document.getElementById("list");
  selectEle.addEventListener("change", function (e) {
    if (e.target.value === "1") {
      polygonWithCoords.setMap(map);
    } else {
      polygonWithCoords.setMap(null);
    }
    if (e.target.value === "2") {
      polygonWithCoords1.setMap(map);
    } else {
      polygonWithCoords1.setMap(null);
    }
  });
}

const coords = document.getElementById("coords");

const buttonEl = document.getElementById("save");
buttonEl.addEventListener("click", function () {
  const node = document.createElement("li");
  const textnode = document.createTextNode(coordinates);
  if (textnode.length !== 0) {
    node.appendChild(textnode);
    coords.appendChild(node);
  } else {
    alert("Please draw the polygon");
  }
});

initMap();
