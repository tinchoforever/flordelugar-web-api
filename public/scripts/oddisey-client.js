var defaultIcon = L.icon({
      iconUrl: 'icons/circle-stroked-24.png'
  });

  // create a map
  var map = L.map('map').setView([0, 0.0], 15);
  L.tileLayer('http://tile.stamen.com/terrain-lines/{z}/{x}/{y}.png', { attribution: 'data OSM - map stamen' }).addTo(map).setOpacity(0.3);

  // create a sequential trigger
  var seq = O.Sequential();

  // when press left mode to next
  O.Keys().left().then(seq.prev, seq)
  O.Keys().right().then(seq.next, seq)

  // create a story 
  var story = O.Story()

  // fetch datmy_placesa from a geojson file
  $.getJSON('/json/venues.json', function(data) {
    var disabledStyle = {
        color: '#F00',
        fillColor:   "#F00",
        radius:      4,
        weight:      0,
        fillOpacity: 0.5
    }
    var enabledStyle = {
        color: '#F00',
        fillColor:   "#F00",
        radius:      8,
        weight:      0,
        fillOpacity: 0.8
    }

    var positions = []
    // load stops
    for (var i = 0; i < data.length; ++i) {
      var stop = data[i];
      var pos = [stop.location.lat, stop.location.lon]
      positions.push(pos);

      // execute the actions one after another
      var action = O.Step(
          // move the map to the position
          map.actions.panTo(pos),
          // toggle style for the marker
          L.circleMarker(pos, disabledStyle)
            .addTo(map)
            .actions.toggleStyle(disabledStyle, enabledStyle),
          O.Sleep(500),
          new L.DirectionalPopup({
            closeButton: false,
            className: 'odyssey-popup-lateral',
            offset:[30, 0],
            position: 'right'
          })
          .setLatLng(pos)
          .setContent(
            "<h1>" + stop.name + "</h1>" + 
            "<p>" + stop.description + "</p>")
          .actions.openClose(map)

      );
      story.addState(seq.step(i), action)
    }

    // add a polyline to give context
    L.polyline (positions, {
          color:        "#F00",
          weight:       2,
          opacity:      0.5,
          smoothFactor: 1,
          clickable:    false
    }).addTo (map);

    story.go(0);
  });