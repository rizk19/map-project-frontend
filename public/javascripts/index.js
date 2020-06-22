let socketMaps = io.connect('http://localhost:5000/mapsocke');
$(document).ready(() => {
  let rawData = []
  let scripts = `<table class="table table-hover">
                  <thead class="thead-light">
                      <tr>
                          <th scope="col">Longitude</th>
                          <th scope="col">Latitude</th>
                          <th scope="col">Speed</th>
                          <th scope="col">Course</th>
                          <th scope="col">Image 1</th>
                          <th scope="col">Image 2</th>
                          <th scope="col">Image 3</th>
                      </tr>
                  </thead>
                  <tbody>`
  $("#progress-map").hide()
  let lastscript = `</tbody></table>`

  socketMaps.emit('requestListDirectory', 'CONNECT');

  socketMaps.on("data", (params) => {
    // console.log('index.js line 7 ===> PARAMS', params);

    let firstData = new ol.proj.fromLonLat([params.data[0].longitude, params.data[0].latitude])
    $(".map").empty();
    if (params) {
      params.data.map((item) => {
        rawData.push(new ol.Feature({
          geometry: new ol.geom.Point(new ol.proj.fromLonLat([item.longitude, item.latitude])),
          longitude: item.longitude,
          latitude: item.latitude,
          time: new moment(item.waktu).format('DD-MM-YYYY'),
          speed: item.speed,
          course: item.course,
          imagedata1: item.imagedata1,
          imagedata2: item.imagedata2,
          imagedata3: item.imagedata3
        }))
      });
      params.data.forEach((item, index) => {
        let srcImg1 = item.imagedata1 ? `${item.imagedata1}` : "../images/no_image.jpg"
        let srcImg2 = item.imagedata2 ? `${item.imagedata2}` : "../images/no_image.jpg"
        let srcImg3 = item.imagedata3 ? `${item.imagedata3}` : "../images/no_image.jpg"
        scripts += `<tr>
                      <td>${item.latitude}</td>
                      <td>${item.longitude}</td>
                      <td>${item.speed}</td>
                      <td>${item.course}</td>
                      <td class="text-center" style="width: 150px;"><img src="${srcImg1}" class="img-fluid img-thumbnail" alt="imagedata1" /></td>
                      <td class="text-center" style="width: 150px;"><img src="${srcImg2}" class="img-fluid img-thumbnail" alt="imagedata2" /></td>
                      <td class="text-center" style="width: 150px;"><img src="${srcImg3}" class="img-fluid img-thumbnail" alt="imagedata3" /></td>
                    </tr>`
      });
      $('#table-data').html(scripts+lastscript)
      $("div").remove("#map-spinner");
      $("div").remove("#table-spinner");
    }

    let resultlength = Math.ceil((rawData.length / params.length.total) * 100)
    // console.log('index.js line 46 ===> resultlength', resultlength);
    $("#progress-map").show()
    
    $("#progress-map-value").css({ "width": resultlength + '%' })
    $("#progress-map-value").text(resultlength + '%')
    if (resultlength == 100) {
      $("#progress-map").html('')
    }

    var jakarta = new ol.proj.fromLonLat([106.892348, -6.183103]);
    var jatim = new ol.proj.fromLonLat([114.371043, -8.216925]);
    var bali = new ol.proj.fromLonLat([115.214680, -8.697038]);
    var makasar = new ol.proj.fromLonLat([119.525044, -5.326763]);
    var papua = new ol.proj.fromLonLat([131.161245, -1.279684]);
    var balikpapan = new ol.proj.fromLonLat([116.661239, -1.335796]);
    var lampung = new ol.proj.fromLonLat([104.3316119, -4.9445864]);
    var aceh = new ol.proj.fromLonLat([96.256842, 4.950546]);
    var kupang = new ol.proj.fromLonLat([123.5796989, -10.1748647]);

    var redPoint = new ol.style.Circle({
      radius: 5,
      fill: null,
      stroke: new ol.style.Stroke({ color: 'red', width: 1 })
    });

    var stylesRed = {
      'Point': new ol.style.Style({
        image: redPoint
      }),
      'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#f00',
          width: 2
        })
      }),
      'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#0f0',
          width: 2
        })
      })
    };

    var styleFunctionRed = function (feature) {
      return stylesRed[feature.getGeometry().getType()];
    };

    var iconFeature =
    {
      features: rawData
    }

    var iconSource = new ol.source.Vector(iconFeature);

    var iconLayer = new ol.layer.Vector({
      source: iconSource,
      style: styleFunctionRed
    });

    var view = new ol.View({
      center: firstData,
      zoom: 10
    });

    map = new ol.Map({
      target: document.getElementById('map'),
      layers: [
        new ol.layer.Tile({
          preload: 4,
          source: new ol.source.OSM()
        }),
        iconLayer
      ],
      view: view
    });

    var element = document.getElementById('popup');

    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -15]
    });
    map.addOverlay(popup);

    function flyTo(location, done) {
      var duration = 2000;
      var zoom = view.getZoom();
      var parts = 2;
      var called = false;
      function callback(complete) {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called = true;
          done(complete);
        }
      }
      view.animate({
        center: location,
        duration: duration
      }, callback);
      view.animate({
        zoom: zoom - 1,
        duration: duration / 2
      }, {
        zoom: zoom,
        duration: duration / 2
      }, callback);
    }

    // display popup on click
    map.on('click', function (evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
          return feature;
        });
      if (feature) {
        var coordinates = feature.getGeometry().getCoordinates();
        popup.setPosition(coordinates);

        $(element).popover({
          placement: 'top',
          html: true,
          content: feature.get('time')
        });
        $(element).popover('show');
        displayFeatureInfo(evt.pixel);
      } else {
        $(element).popover('destroy');
      }
    });

    // change mouse cursor when over marker
    map.on('pointermove', function (e) {
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? 'pointer' : '';
    });

    var displayFeatureInfo = function (pixel) {
      var features = [];
      map.forEachFeatureAtPixel(pixel, function (feature) {
        features.push(feature);
      });
      if (features.length > 0) {
        let allClickedData = [];
        for (i = 0, ii = features.length; i < ii; ++i) {
          allClickedData.push(features[i].getProperties());
        }
        let scriptsclick =
          `<div>
            <button id="close-table-click"
            style="background-color:tomato; color: aliceblue; padding: 0 5px; margin-bottom: 5px;"
            type="button" class="close sticky-top" aria-label="Close"
              data-toggle="tooltip" data-placement="left" title="Close Table">
                <span aria-hidden="true">&times;</span>
            </button>
            <table class="table table-hover">
              <thead class="thead-light">
                  <tr>
                  <th scope="col">No.</th>
                  <th class='text-center' scope="col">Longitude</th>
                  <th class='text-center' scope="col">Latitude</th>
                  <th class='text-center' scope="col">Speed</th>
                  <th class='text-center' scope="col">Course</th>
                  <th scope="col">Image 1</th>
                  <th scope="col">Image 2</th>
                  <th scope="col">Image 3</th>
                  </tr>
              </thead>`
        allClickedData.forEach((item, index) => {
          let srcImg1 = item.imagedata1 ? `${item.imagedata1}` : "../images/no_image.jpg"
          let srcImg2 = item.imagedata2 ? `${item.imagedata2}` : "../images/no_image.jpg"
          let srcImg3 = item.imagedata3 ? `${item.imagedata3}` : "../images/no_image.jpg"
          scriptsclick += `<tr>`
          scriptsclick += `<th>${index + 1}</th>`
          scriptsclick += `<td class='text-center'>${item.longitude}</td>`
          scriptsclick += `<td class='text-center'>${item.latitude}</td>`
          scriptsclick += `<td class='text-center'>${item.speed}</td>`
          scriptsclick += `<td class='text-center'>${item.course}</td>`
          scriptsclick += `<td class="text-center" style="width: 100px;"><img src=${srcImg1} class="img-fluid img-thumbnail" alt="imagedata1" /></td>`
          scriptsclick += `<td class="text-center" style="width: 100px;"><img src=${srcImg2} class="img-fluid img-thumbnail" alt="imagedata2" /></td>`
          scriptsclick += `<td class="text-center" style="width: 100px;"><img src=${srcImg3} class="img-fluid img-thumbnail" alt="imagedata3" /></td>`
          scriptsclick += `</tr>`
        });
        let lastclick = `</table></div>`
        $("#table-click").show();
        $('#table-click').html(scriptsclick + lastclick)
        view.animate({
          center: new ol.proj.fromLonLat([allClickedData[0].longitude, allClickedData[0].latitude]),
          duration: 2000
        });
        $('#close-table-click').click(function () {
          $("#table-click").fadeToggle(500);
          setTimeout(() => {
            $('#table-click').html('')
          }, 500);
        });
        map.getTarget().style.cursor = 'pointer';
      } else {
        map.getTarget().style.cursor = '';
      }
    };

    function onClick(id, callback) {
      document.getElementById(id).addEventListener('click', callback);
    }


    onClick('rotate-left', function () {
      view.animate({
        rotation: view.getRotation() + Math.PI / 2
      });
    });

    onClick('rotate-right', function () {
      view.animate({
        rotation: view.getRotation() - Math.PI / 2
      });
    });

    onClick('fly-to-jakarta', function () {
      flyTo(jakarta, function () { });
    });

    onClick('fly-to-balikpapan', function () {
      flyTo(balikpapan, function () { });
    });

    onClick('fly-to-papua', function () {
      flyTo(papua, function () { });
    });

    onClick('fly-to-makasar', function () {
      flyTo(makasar, function () { });
    });

    onClick('fly-to-jatim', function () {
      flyTo(jatim, function () { });
    });

    onClick('fly-to-bali', function () {
      flyTo(bali, function () { });
    });

    onClick('fly-to-kupang', function () {
      flyTo(kupang, function () { });
    });

    onClick('fly-to-aceh', function () {
      flyTo(aceh, function () { });
    });

    onClick('fly-to-lampung', function () {
      flyTo(lampung, function () { });
    });
  })

  socketMaps.on("stopper", (indicator) => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Database selesai dibaca.',
      showConfirmButton: false,
      timer: 1000
    })
    $("#progress-map").html('')
  })

  $(".map").css({ "width": "100%", "height": (window.innerHeight - 170) });

  if (window.attachEvent) {
    window.attachEvent('onresize', function () {
      alert('attachEvent - resize');
    });
  }
  else if (window.addEventListener) {
    window.addEventListener('resize', function () {
      $(".map").css({ "width": "100%", "height": (window.innerHeight - 170) });
    }, true);
  }
  else {
    //The browser does not support Javascript event binding
  }
})
