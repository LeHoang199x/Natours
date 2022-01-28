/* eslint-disable */

export const displayMap = locations => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaG9hbmdsZTE5OXgiLCJhIjoiY2t4aXhmM3hqNGR2dzJ3bzV5YnU2c294YSJ9.SQA6ryTIAEvyV2HCByK5Ag';
    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/hoangle199x/ckxj03o862wvp15nxtq012a1r', // style URL
        scrollZoom: false,
        // zoom: 9,
        // center: [-118.113491, 34.111745], // starting position [lng, lat]
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
        // Create marker
        const el = document.createElement('div');
        el.className = 'marker';
    
        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
        .setLngLat(loc.coordinates)
        .addTo(map)
    
        // Add Popup
        new mapboxgl.Popup({
            offset: 30
        })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)
    
        //Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });
    
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}

