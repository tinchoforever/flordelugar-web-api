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
  $.getJSON('/json/recorridos.json', function(data) {
    var recorridos = data;
    for (var i = 0; i < recorridos.length; i++) {
      if (recorridos[i].id == recorridoId){
        var recorrido = recorridos[i];
        break;
      }
    }
    if (!recorrido){
        $('#map').hide();
        $('#error').show();
        return;
      }

    $.getJSON('/json/venues.json', function(d) {

      data = [];

      // load stops
      for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < recorrido.venues.length; j++) {
          if (recorrido.venues[j] === d[i].id){
            data.push(d[i]);
          }
        };
        
      }

      if (data.length === 0){
        $('#map').hide();
        $('#error').show();
        return;
      }

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
            new L.Popup({
              closeButton: true,
              className: 'odyssey-popup-lateral wow fadeIn animated',
              offset:[300, 200],
              position: 'right'
            })
            .setLatLng(pos)
            .setContent(
              "<h1>"+ stop.name + "</h1>" + 
              "<img src='" +  stop.assets.image+ "'></img>" +
              "<audio controls='controls' autoplay src='" + stop.assets.audio+ "'></audio>"+
              "<p>" + stop.description + "</p>"
              )
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

});