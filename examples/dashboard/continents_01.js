
am4core.ready(function () {


    am4core.useTheme(am4themes_animated);


    var max = { confirmed: 0, recovered: 0, deaths: 0, active: 0 };
    //var maxPC = { confirmed: 0, recovered: 0, deaths: 0, active: 0 };

    // the last day will have most
    for (var i = 0; i < mydata.length; i++) {
        var di = mydata[i];
        if (di.cases > max.confirmed) {
            max.confirmed = di.cases;
        }
        if (di.recovered > max.recovered) {
            max.recovered = di.recovered;
        }
        if (di.deaths > max.deaths) {
            max.deaths = di.deaths
        }
        if (di.active > max.active) {
            max.active = di.active;
        }
    }

    console.log(max);

    var map = am4core.create("vis1", am4maps.MapChart);

    map.geodata = am4geodata_continentsRussiaEuropeLow;

    map.projection = new am4maps.projections.Miller();
    //map.projection = new am4maps.projections.Mercator();

    // you can have pacific - centered map if you set this to -154.8
    map.deltaLongitude = -8;

    var polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    polygonSeries.data = mydata;

    //polygonSeries.data = mapData;
    //polygonSeries.data.url = "../data/API/continentes.json";
    //polygonSeries.dataSource.url = "../data/API/continentes.json";
    //polygonSeries.dataFields.id = "name"; //"continent";
    polygonSeries.dataFields.value = "cases";

    polygonSeries.exclude = ["antarctica"];

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    //polygonTemplate.tooltipText = "{name} {value} {cases}";
    polygonTemplate.tooltipText = "{name} {value}"; // value igual a cases defenido acima
    //polygonTemplate.fill = am4core.color("#74B266");
    //polygonTemplate.fill = am4core.color("#ffffff");

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    //hs.properties.fill = am4core.color("#367B25");
    hs.properties.fill = am4core.color("#8f8f8f");

    // Add heat rule
    polygonSeries.heatRules.push({
        "target": polygonSeries.mapPolygons.template,
        "property": "fill",
        //"min": am4core.color("#ffffff"),
        "min": am4core.color("#3b3b3b"),
        "max": am4core.color("#d21a1a"),
        //"dataField": "value",
        //"logarithmic": true
    });

    /*     polygonSeries.heatRules.getIndex(0).minValue = 40000;
        polygonSeries.heatRules.getIndex(0).maxValue = max.confirmed; */
    //indices nao sao para aqui chamados e index maior que 0 dá erro

    //afinal o index é essencial. uppsss!

    polygonSeries.heatRules.getIndex(0).minValue = 5000000;
    polygonSeries.heatRules.maxValue = max.confirmed;
    //polygonSeries.heatRules.getIndex(0).maxValue = 25000000;

    // Add grid
    var grid = map.series.push(new am4maps.GraticuleSeries());
    grid.mapLines.template.line.stroke = am4core.color("#e33");
    grid.mapLines.template.line.strokeOpacity = 0.2;
    // if not set default to 10
    grid.longitudeStep = 15; // if not set default to 10
    grid.latitudeStep = 15; // if not set default to 10

    grid.fitExtent = false; // to span it whole area of the world

    grid.toBack();

    //map.panBehavior = "move"; // default
    map.panBehavior = "rotateLong";
    //map.panBehavior = "rotateLat";
    //map.panBehavior = "rotateLongLat";

    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.align = "right";
    map.zoomControl.marginRight = 15;
    map.zoomControl.valign = "middle";
    map.zoomControl.slider.height = 100;

});
