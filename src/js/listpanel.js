var ListPanel = function (parent) {
    this._container = document.getElementById('list-panel');
    parent.appendChild(this._container);
};

ListPanel.prototype.setVisible = function (visibilty) {
    var display = 'none';
    if (visibilty) {
        display = 'block';
    }
    this._container.style.display = display;
};

ListPanel.prototype.clear = function () {
    this._container.innerHTML = '';
};

ListPanel.prototype.renderStore = function (store) {
    var cell = document.createElement('div');
    var streetView = 'https://maps.googleapis.com/maps/api/streetview?size=250x100&location={latlng}'.replace('{latlng}', store.position);
    cell.innerHTML = '<div class="container pt1"><b>' + store.data_properties.name + '   </b>' +
        '<button id="btn-' + store.id + '" data-id=' + store.id + ' class="btn btn--outline btn--sm">Vroum</button>' + '<br/>' +
        '<span>' + store.properties.distancetext + ' : ' + store.properties.duration + '</span>' + '<br/>' +
        '<img src="' + streetView + '"/></div>';

    return cell;
};

ListPanel.prototype.render = function (stores) {
    this.clear();
    var header = document.createElement('div');
    header.innerHTML = '<h1 class="container">The 5 closest Bars</h1>';
    this._container.appendChild(header);
    for (var i = 0; i < stores.length; i++) {
        var child = this.renderStore(stores[i]);
        this._container.appendChild(child);
    }
};

module.exports = ListPanel;