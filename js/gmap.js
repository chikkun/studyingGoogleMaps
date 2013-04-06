function InfoBox(opts) {
  google.maps.OverlayView.call(this);
  this.latlng_ = opts.latlng;
  this.map_ = opts.map;
  this.offsetVertical_ = -70;
  this.offsetHorizontal_ = -65;
  this.height_ = 40;
  this.width_ = 130;
  this.msg = opts.msg;
  var me = this;
  this.boundsChangedListener_ =
    google.maps.event.addListener(this.map_, "bounds_changed", function() {
      return me.panMap.apply(me);
    });
  this.setMap(this.map_);
}

InfoBox.prototype = new google.maps.OverlayView();

InfoBox.prototype.remove = function() {
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
};

InfoBox.prototype.draw = function() {
  this.createElement();
  if (!this.div_) return;
  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
  if (!pixPosition) return;

  this.div_.style.width = this.width_ + "px";
  this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
  this.div_.style.height = this.height_ + "px";
  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
  this.div_.style.display = 'block';
};

InfoBox.prototype.createElement = function() {
  var panes = this.getPanes();
  var div = this.div_;
  if (!div) {
    div = this.div_ = document.createElement("div");
    div.style.border = "0px none";
    div.style.position = "absolute";
    div.style.background = "url('fuki.gif')";
    div.style.width = this.width_ + "px";
    div.style.height = this.height_ + "px";
    var contentDiv = document.createElement("div");
    contentDiv.style.paddingTop = "8px";
    contentDiv.style.position = "absolute";
    contentDiv.style.width = div.style.width;
    contentDiv.style.height = div.style.height;
    contentDiv.style.left = div.style.left;
    contentDiv.style.top = div.style.top;
    contentDiv.style.display = 'block';
    contentDiv.style.textAlign = "center";
    contentDiv.innerHTML = this.msg;

    var topDiv = document.createElement("div");
    topDiv.style.textAlign = "right";
    var closeImg = document.createElement("img");
    closeImg.style.width = "32px";
    closeImg.style.height = "32px";
    closeImg.style.cursor = "pointer";
    closeImg.src = "closebigger.gif";
    topDiv.appendChild(closeImg);

    function removeInfoBox(ib) {
      return function() {
        ib.setMap(null);
      };
    }
    google.maps.event.addDomListener(closeImg, 'click', removeInfoBox(this));
    div.appendChild(contentDiv);
    div.appendChild(topDiv);
    div.style.display = 'none';
    panes.floatPane.appendChild(div);
    this.panMap();
  } else if (div.parentNode != panes.floatPane) {
    div.parentNode.removeChild(div);
    panes.floatPane.appendChild(div);
  } else {
    // The panes have not changed, so no need to create or move the div.
  }
};

InfoBox.prototype.panMap = function() {
  var map = this.map_;
  var bounds = map.getBounds();
  if (!bounds) return;

  var position = this.latlng_;

  var iwWidth = this.width_;
  var iwHeight = this.height_;

  var iwOffsetX = this.offsetHorizontal_;
  var iwOffsetY = this.offsetVertical_;

  var padX = 5;
  var padY = 5;

  var mapDiv = map.getDiv();
  var mapWidth = mapDiv.offsetWidth;
  var mapHeight = mapDiv.offsetHeight;
  var boundsSpan = bounds.toSpan();
  var longSpan = boundsSpan.lng();
  var latSpan = boundsSpan.lat();
  var degPixelX = longSpan / mapWidth;
  var degPixelY = latSpan / mapHeight;

  var mapWestLng = bounds.getSouthWest().lng();
  var mapEastLng = bounds.getNorthEast().lng();
  var mapNorthLat = bounds.getNorthEast().lat();
  var mapSouthLat = bounds.getSouthWest().lat();

  var iwWestLng = position.lng() + (iwOffsetX - padX) * degPixelX;
  var iwEastLng = position.lng() + (iwOffsetX + iwWidth + padX) * degPixelX;
  var iwNorthLat = position.lat() - (iwOffsetY - padY) * degPixelY;
  var iwSouthLat = position.lat() - (iwOffsetY + iwHeight + padY) * degPixelY;

  var shiftLng =
      (iwWestLng < mapWestLng ? mapWestLng - iwWestLng : 0) +
      (iwEastLng > mapEastLng ? mapEastLng - iwEastLng : 0);
  var shiftLat =
      (iwNorthLat > mapNorthLat ? mapNorthLat - iwNorthLat : 0) +
      (iwSouthLat < mapSouthLat ? mapSouthLat - iwSouthLat : 0);

  var center = map.getCenter();

  var centerX = center.lng() - shiftLng;
  var centerY = center.lat() - shiftLat;

  map.setCenter(new google.maps.LatLng(centerY, centerX));

  google.maps.event.removeListener(this.boundsChangedListener_);
  this.boundsChangedListener_ = null;
};


function createMarker(map, latlng, msg) {
    //マーカーを作成
    var marker = new google.maps.Marker();
    marker.setPosition(latlng);
    marker.setMap(map);
    google.maps.event.addListener(marker, "click", function(e) {
	var infoBox = new InfoBox({latlng: marker.getPosition(), map: map, msg: msg});
    });
    google.maps.event.trigger(marker, "click");
    return marker;
}
