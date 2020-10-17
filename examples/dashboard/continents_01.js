
am4core.ready(function () {


    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_dark);

    var numberFormatter = new am4core.NumberFormatter();

    var backgroundColor = am4core.color("#1e2128");
    var activeColor = am4core.color("#ff8726");
    var confirmedColor = am4core.color("#d21a1a");
    var recoveredColor = am4core.color("#45d21a");
    var deathsColor = am4core.color("#1c5fe5");

    // for an easier access by key
    var colors = { active: activeColor, confirmed: confirmedColor, recovered: recoveredColor, deaths: deathsColor };

    var countryColor = am4core.color("#3b3b3b");
    var countryStrokeColor = am4core.color("#000000");
    var buttonStrokeColor = am4core.color("#ffffff");
    var countryHoverColor = am4core.color("#1b1b1b");
    var activeCountryColor = am4core.color("#0f0f0f");

    var currentType;
    var currentTypeName;
    var perCapita = false;


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

    // ----- MAIN CONTAINER ----- //
    // https://www.amcharts.com/docs/v4/concepts/svg-engine/containers/
    var container = am4core.create("chartdiv", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);

    container.tooltip = new am4core.Tooltip();
    container.tooltip.background.fill = am4core.color("#000000");
    container.tooltip.background.stroke = activeColor;
    container.tooltip.fontSize = "0.9em";
    container.tooltip.getFillFromObject = false;
    container.tooltip.getStrokeFromObject = false;

    // ---- MAP CHART ----- //
    var mapChart = container.createChild(am4maps.MapChart);
    mapChart.geodata = am4geodata_continentsRussiaEuropeLow;
    mapChart.projection = new am4maps.projections.Miller();
    //map.projection = new am4maps.projections.Mercator();

    mapChart.language.locale["_thousandSeparator"] = " ";

    // you can have pacific - centered map if you set this to -154.8
    mapChart.deltaLongitude = -8;

    mapChart.zoomControl = new am4maps.ZoomControl();
    mapChart.zoomControl.align = "right";
    mapChart.zoomControl.marginRight = 15;
    mapChart.zoomControl.valign = "middle";
    mapChart.zoomControl.slider.height = 100;

    //map.panBehavior = "move"; // default
    mapChart.panBehavior = "rotateLong";


    // ---- MAP POLYGON SERIES ----- //
    var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.data = mydata;
    //polygonSeries.dataFields.id = "name"; //"continent";
    polygonSeries.dataFields.value = "cases";

    polygonSeries.exclude = ["antarctica"];

    // ----- Configure polygon series ----- //
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.fill = countryColor;
    polygonTemplate.fillOpacity = 1
    polygonTemplate.stroke = countryStrokeColor;
    polygonTemplate.strokeOpacity = 0.15
    //polygonTemplate.tooltipText = "{name} {value.formatNumber('# ###')}"; // value igual a cases defenido acima

    //polygonTemplate.tooltipText = "{name} {value.formatNumber('#a')}"; // value igual a cases defenido acima


    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#8f8f8f");

    // Add heat rule
    polygonSeries.heatRules.push({
        "target": polygonSeries.mapPolygons.template,
        "property": "fill",
        //"min": am4core.color("#ffffff"),
        "min": countryColor, //am4core.color("#3b3b3b"),
        "max": am4core.color("#d21a1a"),
        //"dataField": "value",
        //"logarithmic": true
    });

    /*     polygonSeries.heatRules.getIndex(0).minValue = 40000;
        polygonSeries.heatRules.getIndex(0).maxValue = max.confirmed; */
    //indices nao sao para aqui chamados e index maior que 0 dá erro

    //afinal o index é essencial. uppsss!

    polygonSeries.heatRules.getIndex(0).minValue = 100000;

    //polygonSeries.heatRules.getIndex(0).minValue = 5000000;
    polygonSeries.heatRules.getIndex(0).maxValue = max.confirmed;
    //polygonSeries.heatRules.getIndex(0).maxValue = 25000000;

    // ----- END OF MAP POLYGON SERIES ----- //

    // END OF MAP

    // switch between map and globe
    var mapGlobeSwitch = mapChart.createChild(am4core.SwitchButton);
    mapGlobeSwitch.align = "right"
    mapGlobeSwitch.y = 15;
    mapGlobeSwitch.leftLabel.text = "Map";
    mapGlobeSwitch.leftLabel.fill = am4core.color("#ffffff");
    mapGlobeSwitch.rightLabel.fill = am4core.color("#ffffff");
    mapGlobeSwitch.rightLabel.text = "Globe";
    mapGlobeSwitch.verticalCenter = "top";

    // buttons & chart container
    var buttonsAndChartContainer = container.createChild(am4core.Container);
    buttonsAndChartContainer.layout = "vertical";
    buttonsAndChartContainer.height = am4core.percent(15); // make this bigger if you want more space for the chart
    buttonsAndChartContainer.width = am4core.percent(100);
    buttonsAndChartContainer.valign = "bottom";

    // country name and buttons container
    var nameAndButtonsContainer = buttonsAndChartContainer.createChild(am4core.Container)
    nameAndButtonsContainer.width = am4core.percent(100);
    nameAndButtonsContainer.padding(0, 10, 5, 20);
    nameAndButtonsContainer.layout = "horizontal";

    // buttons container (active/confirmed/recovered/deaths)
    var buttonsContainer = nameAndButtonsContainer.createChild(am4core.Container);
    buttonsContainer.layout = "grid";
    buttonsContainer.width = am4core.percent(100);
    buttonsContainer.x = 10;
    buttonsContainer.contentAlign = "right";

    // BUTTONS
    // create buttons
    var activeButton = addButton("active", activeColor);
    var confirmedButton = addButton("confirmed", confirmedColor);
    var recoveredButton = addButton("recovered", recoveredColor);
    var deathsButton = addButton("deaths", deathsColor);

    var buttons = { active: activeButton, confirmed: confirmedButton, recovered: recoveredButton, deaths: deathsButton };


    // add button
    function addButton(name, color) {
        var button = buttonsContainer.createChild(am4core.Button)
        button.label.valign = "middle"
        button.label.fill = am4core.color("#ffffff");
        //button.label.fontSize = "11px";
        button.background.cornerRadius(30, 30, 30, 30);
        button.background.strokeOpacity = 0.3
        button.background.fillOpacity = 0;
        button.background.stroke = buttonStrokeColor;
        button.background.padding(2, 3, 2, 3);
        button.states.create("active");
        button.setStateOnChildren = true;

        var activeHoverState = button.background.states.create("hoverActive");
        activeHoverState.properties.fillOpacity = 0;

        var circle = new am4core.Circle();
        circle.radius = 8;
        circle.fillOpacity = 0.3;
        circle.fill = buttonStrokeColor;
        circle.strokeOpacity = 0;
        circle.valign = "middle";
        circle.marginRight = 5;
        button.icon = circle;

        // save name to dummy data for later use
        button.dummyData = name;

        var circleActiveState = circle.states.create("active");
        circleActiveState.properties.fill = color;
        circleActiveState.properties.fillOpacity = 0.5;

        button.events.on("hit", handleButtonClick);

        return button;
    };

    for (var key in buttons) {
        buttons[key].label.text = capitalizeFirstLetter(key);
    };

    // capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // handle button clikc
    function handleButtonClick(event) {
        // we saved name to dummy data
        changeDataType(event.target.dummyData);
    };

    // change data type (active/confirmed/recovered/deaths)
    function changeDataType(name) {
        currentType = name;
        currentTypeName = name;
        if (name != "deaths") {
            currentTypeName += " cases";
        }

        if (name == "confirmed") {
            currentType = "cases";
            currentTypeName = "confirmed cases";
        }

        //bubbleSeries.mapImages.template.tooltipText = "[bold]{name}: {value}[/] [font-size:10px]\n" + currentTypeName;

        // make button active
        var activeButton = buttons[name];
        activeButton.isActive = true;
        // make other buttons inactive
        for (var key in buttons) {
            if (buttons[key] != activeButton) {
                buttons[key].isActive = false;
            }
        }
        // tell series new field name
        polygonSeries.dataFields.value = name;

        /*     bubbleSeries.dataItems.each(function (dataItem) {
              dataItem.setValue("value", dataItem.dataContext[currentType]);
            }) */

        polygonSeries.dataItems.each(function (dataItem) {
            dataItem.setValue("value", dataItem.dataContext[currentType]);
            dataItem.mapPolygon.defaultState.properties.fill = undefined;
        })


        // update heat rule's maxValue
        polygonSeries.heatRules.getIndex(0).maxValue = max[currentType];
        if (!perCapita) {
            polygonSeries.heatRules.getIndex(0).max = colors[name];
            updateCountryTooltip();
        }
    }

    // Add grid
    var grid = mapChart.series.push(new am4maps.GraticuleSeries());
    grid.mapLines.template.line.stroke = am4core.color("#e33");
    grid.mapLines.template.line.strokeOpacity = 0.2;
    // if not set default to 10
    grid.longitudeStep = 15; // if not set default to 10
    grid.latitudeStep = 15; // if not set default to 10

    grid.fitExtent = false; // to span it whole area of the world

    grid.toBack();

    changeDataType("active");

    function updateCountryTooltip() {
        //polygonSeries.mapPolygons.template.tooltipText = "[bold]{name}: {value.formatNumber('#.')}[/]\n[font-size:10px]" + currentTypeName + " per million"
        polygonSeries.mapPolygons.template.tooltipText = "[bold]{name}: {value.formatNumber('#a')}[/]\n[font-size:10px]" + currentTypeName
    }

});
