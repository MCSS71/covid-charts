/**
 * ---------------------------------------
 * Covid19 chart by continent.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

am4core.ready(function () {

    var numberFormatter = new am4core.NumberFormatter();

    /* ------------------ */
    /* ----- COLORS ----- */
    /* ------------------ */

    var activeColor = am4core.color("#ff8726");
    var confirmedColor = am4core.color("#d21a1a");
    var recoveredColor = am4core.color("#45d21a");
    var deathsColor = am4core.color("#1c5fe5");

    var countryColor = am4core.color("#3b3b3b");
    var countryStrokeColor = am4core.color("#000000");
    var countryHoverColor = am4core.color("#8f8f8f"); // am4core.color("#1b1b1b");
    var activeCountryColor = am4core.color("#0f0f0f");

    var buttonStrokeColor = am4core.color("#ffffff");
    var backgroundColor = am4core.color("#1e2128");

    // for an easier access by key
    var colors = { active: activeColor, confirmed: confirmedColor, recovered: recoveredColor, deaths: deathsColor };

    // ----- END COLORS

    var currentType;
    var currentTypeName;
    var perCapita = false;


    var max = { confirmed: 0, deaths: 0, tests: 0, active: 0, recovered: 0, critical: 0 };
    var maxPC = { confirmed: 0, deaths: 0, tests: 0, active: 0, recovered: 0, critical: 0 };

    // get max cases values
    for (var i = 0; i < mydata.length; i++) {
        var di = mydata[i];
        if (di.cases > max.confirmed) {
            max.confirmed = di.cases;
        }
        if (di.deaths > max.deaths) {
            max.deaths = di.deaths
        }
        if (di.tests > max.tests) {
            max.tests = di.tests
        }
        if (di.active > max.active) {
            max.active = di.active;
        }
        if (di.recovered > max.recovered) {
            max.recovered = di.recovered;
        }
        if (di.critical > max.critical) {
            max.critical = di.critical;
        }

        if (di.casesPerOneMillion > maxPC.confirmed) {
            maxPC.confirmed = di.casesPerOneMillion;
        }
        if (di.deathsPerOneMillion > maxPC.deaths) {
            maxPC.deaths = di.deathsPerOneMillion;
        }
        if (di.testsPerOneMillion > maxPC.tests) {
            maxPC.tests = di.testsPerOneMillion
        }
        if (di.activePerOneMillion > maxPC.active) {
            maxPC.active = di.activePerOneMillion;
        }
        if (di.recoveredPerOneMillion > maxPC.recovered) {
            maxPC.recovered = di.recoveredPerOneMillion;
        }
        if (di.criticalPerOneMillion > maxPC.critical) {
            maxPC.critical = di.criticalPerOneMillion;
        }
    }
    console.log(max);



    /* -------------------------- */
    /* ----- MAIN CONTAINER ----- */
    /* -------------------------- */
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

    // ----- END OF MAIN CONTAINER ----- //



    /*---------------------- */
    /* ----- MAP CHART ----- */
    /*---------------------- */
    var mapChart = container.createChild(am4maps.MapChart);
    mapChart.geodata = am4geodata_continentsRussiaEuropeLow;
    mapChart.projection = new am4maps.projections.Miller();
    //map.projection = new am4maps.projections.Mercator();

    mapChart.language.locale["_thousandSeparator"] = " ";

    // you can have pacific - centered map if you set this to -154.8
    mapChart.deltaLongitude = -8;

    //mapChart.height = am4core.percent(80);

    mapChart.zoomControl = new am4maps.ZoomControl();
    mapChart.zoomControl.align = "right";
    mapChart.zoomControl.marginRight = 15;
    mapChart.zoomControl.valign = "middle";
    mapChart.zoomControl.slider.height = 100;

    //map.panBehavior = "move"; // default
    mapChart.panBehavior = "rotateLong";

    // ----- END OF MAP ----- //



    /* -------------------------------*/
    /* ----- MAP POLYGON SERIES ----- */
    /* -------------------------------*/
    var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.data = mydata;
    //polygonSeries.dataFields.id = "name"; //"continent";
    polygonSeries.dataFields.value = "casesPerOneMillion";
    polygonSeries.interpolationDuration = 0;

    polygonSeries.exclude = ["antarctica"];

    polygonSeries.nonScalingStroke = true;
    polygonSeries.strokeWidth = 0.5;
    // this helps to place bubbles in the visual middle of the area
    polygonSeries.calculateVisualCenter = true;

    // ----- Configure polygon series ----- //
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.fill = countryColor;
    polygonTemplate.fillOpacity = 1
    polygonTemplate.stroke = countryStrokeColor;
    polygonTemplate.strokeOpacity = 0.15
    polygonTemplate.setStateOnChildren = true;

    //polygonTemplate.tooltipText = "{name} {value.formatNumber('# ###')}"; // value igual a casesPerOneMillion defenido acima
    //polygonTemplate.tooltipText = "{name} {value.formatNumber('#a')}"; // value igual a casesPerOneMillion defenido acima

    // polygon states
    var polygonHoverState = polygonTemplate.states.create("hover");
    polygonHoverState.transitionDuration = 1400;
    polygonHoverState.properties.fill = countryHoverColor;

    var polygonActiveState = polygonTemplate.states.create("active")
    polygonActiveState.properties.fill = activeCountryColor;

    // Add heat rule
    polygonSeries.heatRules.push({
        "target": polygonSeries.mapPolygons.template,
        "property": "fill",
        //"min": am4core.color("#ffffff"),
        "min": countryColor, //am4core.color("#3b3b3b"),
        "max": countryColor, //am4core.color("#d21a1a"), // min max mesmo valor para as cores dos continentes serem iguais porque inicia com bubbles
        //"dataField": "value",
        //"logarithmic": true
    });

    /*     polygonSeries.heatRules.getIndex(0).minValue = 40000;
        polygonSeries.heatRules.getIndex(0).maxValue = max.confirmed; */
    //indices nao sao para aqui chamados e index maior que 0 dá erro

    //afinal o index é essencial. uppsss!

    //polygonSeries.heatRules.getIndex(0).minValue = 100000;
    //polygonSeries.heatRules.getIndex(0).minValue = 5000000;

    //polygonSeries.heatRules.getIndex(0).maxValue = maxPC.confirmed;
    //polygonSeries.heatRules.getIndex(0).maxValue = 25000000;

    // ----- END OF MAP POLYGON SERIES ----- //



    /* ------------------------------*/
    /* ----- MAP BUBBLE SERIES ----- */
    /* ------------------------------*/
    var bubbleSeries = mapChart.series.push(new am4maps.MapImageSeries());
    bubbleSeries.data = mydata;

    bubbleSeries.dataFields.id = "id";
    bubbleSeries.dataFields.value = "cases"; //"confirmed";

    // adjust tooltip
    bubbleSeries.tooltip.animationDuration = 0;
    bubbleSeries.tooltip.showInViewport = false;
    bubbleSeries.tooltip.background.fillOpacity = 0.2;
    bubbleSeries.tooltip.getStrokeFromObject = true;
    bubbleSeries.tooltip.getFillFromObject = false;
    bubbleSeries.tooltip.background.fill = am4core.color("#000000");

    var imageTemplate = bubbleSeries.mapImages.template;
    // if you want bubbles to become bigger when zoomed, set this to false
    imageTemplate.nonScaling = false;
    imageTemplate.strokeOpacity = 0;
    imageTemplate.fillOpacity = 0.55;
    imageTemplate.tooltipText = "{name}: [bold]{value}[/]";
    imageTemplate.applyOnClones = true;

    //imageTemplate.events.on("over", handleImageOver);
    //imageTemplate.events.on("out", handleImageOut);
    //imageTemplate.events.on("hit", handleImageHit);

    // this is needed for the tooltip to point to the top of the circle instead of the middle
    imageTemplate.adapter.add("tooltipY", function (tooltipY, target) {
        return -target.children.getIndex(0).radius;
    })

    // When hovered, circles become non-opaque  
    var imageHoverState = imageTemplate.states.create("hover");
    imageHoverState.properties.fillOpacity = 1;

    // add circle inside the image
    var circle = imageTemplate.createChild(am4core.Circle);
    // this makes the circle to pulsate a bit when showing it
    circle.hiddenState.properties.scale = 0.0001;
    circle.hiddenState.transitionDuration = 2000;
    circle.defaultState.transitionDuration = 2000;
    circle.defaultState.transitionEasing = am4core.ease.elasticOut;
    // later we set fill color on template (when changing what type of data the map should show) and all the clones get the color because of this
    circle.applyOnClones = true;

    // heat rule makes the bubbles to be of a different width. Adjust min/max for smaller/bigger radius of a bubble
    bubbleSeries.heatRules.push({
        "target": circle,
        "property": "radius",
        "min": 3,
        "max": 60,
        "dataField": "value"
    })

    // when data items validated, hide 0 value bubbles (because min size is set)
    bubbleSeries.events.on("dataitemsvalidated", function () {
        bubbleSeries.dataItems.each((dataItem) => {
            var mapImage = dataItem.mapImage;
            var circle = mapImage.children.getIndex(0);
            if (mapImage.dataItem.value == 0) {
                circle.hide(0);
            }
            else if (circle.isHidden || circle.isHiding) {
                circle.show();
            }
        })
    })

    // this places bubbles at the visual center of a country
    imageTemplate.adapter.add("latitude", function (latitude, target) {
        var polygon = polygonSeries.getPolygonById(target.dataItem.id);
        if (polygon) {
            target.disabled = false;
            return polygon.visualLatitude;
        }
        else {
            target.disabled = true;
        }
        return latitude;
    })

    imageTemplate.adapter.add("longitude", function (longitude, target) {
        var polygon = polygonSeries.getPolygonById(target.dataItem.id);
        if (polygon) {
            target.disabled = false;
            return polygon.visualLongitude;
        }
        else {
            target.disabled = true;
        }
        return longitude;
    })
    // ----- END OF MAP BUBBLES SERIES ----- //



    /* -------------------------------- */
    /* ----- SWITCHES AND BUTTONS ----- */
    /* -------------------------------- */

    // switch between map and globe
    var mapGlobeSwitch = mapChart.createChild(am4core.SwitchButton);
    /*     mapGlobeSwitch.align = "right"
        mapGlobeSwitch.y = 15;
        mapGlobeSwitch.leftLabel.text = "Map";
        mapGlobeSwitch.leftLabel.fill = am4core.color("#ffffff");
        mapGlobeSwitch.rightLabel.fill = am4core.color("#ffffff");
        mapGlobeSwitch.rightLabel.text = "Globe";
        mapGlobeSwitch.verticalCenter = "top"; */

    // switch between absolute and percapita
    var absolutePerCapitaSwitch = mapChart.createChild(am4core.SwitchButton);
    absolutePerCapitaSwitch.align = "center"
    absolutePerCapitaSwitch.y = 15;
    absolutePerCapitaSwitch.leftLabel.text = "Absolute";
    absolutePerCapitaSwitch.leftLabel.fill = am4core.color("#ffffff");
    absolutePerCapitaSwitch.rightLabel.text = "Per Capita";
    absolutePerCapitaSwitch.rightLabel.fill = am4core.color("#ffffff");
    //absolutePerCapitaSwitch.rightLabel.interactionsEnabled = true;
    //absolutePerCapitaSwitch.rightLabel.tooltipText = "When calculating max value, countries with population less than 1.000.000 are not included."
    absolutePerCapitaSwitch.verticalCenter = "top";

    absolutePerCapitaSwitch.events.on("toggled", function () {
        if (absolutePerCapitaSwitch.isActive) {
            bubbleSeries.hide(0);
            perCapita = true;
            bubbleSeries.interpolationDuration = 0;
            polygonSeries.heatRules.getIndex(0).max = colors[currentType];
            polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
            polygonSeries.mapPolygons.template.applyOnClones = true;

            //sizeSlider.hide()
            //filterSlider.hide();
            //sizeLabel.hide();
            //filterLabel.hide();

            updateCountryTooltip();

        } else {
            perCapita = false;
            polygonSeries.interpolationDuration = 0;
            bubbleSeries.interpolationDuration = 1000;
            bubbleSeries.show();
            polygonSeries.heatRules.getIndex(0).max = countryColor;
            polygonSeries.mapPolygons.template.tooltipText = undefined;
            //sizeSlider.show()
            //filterSlider.show();
            //sizeLabel.show();
            //filterLabel.show();
        }

        polygonSeries.mapPolygons.each(function (mapPolygon) {
            mapPolygon.fill = mapPolygon.fill;
            mapPolygon.defaultState.properties.fill = undefined;
        })

        console.log(currentType);
    })


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

        var circleActiveState = circle.states.create("active");
        circleActiveState.properties.fill = color;
        circleActiveState.properties.fillOpacity = 0.5;

        button.events.on("hit", handleButtonClick);

        button.icon = circle;

        // capitalize first letter
        button.label.text = name.charAt(0).toUpperCase() + name.slice(1);

        // save name to dummy data for later use
        button.dummyData = name;

        return button;
    };

    // create buttons
    var activeButton = addButton("active", activeColor);
    var confirmedButton = addButton("confirmed", confirmedColor);
    var recoveredButton = addButton("recovered", recoveredColor);
    var deathsButton = addButton("deaths", deathsColor);

    var buttons = { active: activeButton, confirmed: confirmedButton, recovered: recoveredButton, deaths: deathsButton };

    // moved inside function (addButton)
    /*     for (var key in buttons) {
            buttons[key].label.text = capitalizeFirstLetter(key);
        };
    
        // capitalize first letter
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } */

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

        /* if (perCapita) {
            currentType += "PerOneMillion";
        } */

        // make button active
        var activeButton = buttons[name];
        activeButton.isActive = true;
        // make other buttons inactive
        for (var key in buttons) {
            if (buttons[key] != activeButton) {
                buttons[key].isActive = false;
            }
        }

        // tell bubble series new field name
        bubbleSeries.dataFields.value = name;
        bubbleSeries.dataItems.each(function (dataItem) {
            dataItem.setValue("value", dataItem.dataContext[currentType]);
        })
        bubbleSeries.mapImages.template.tooltipText = "[bold]{name}: {value}[/] [font-size:10px]\n" + currentTypeName;

        // change color of bubbles
        // setting colors on mapImage for tooltip colors
        bubbleSeries.mapImages.template.fill = colors[name];
        bubbleSeries.mapImages.template.stroke = colors[name];


        // tell polygon series new field name

        //polygonSeries.dataFields.value = name;
        polygonSeries.dataFields.value = currentType + "PerOneMillion";

        polygonSeries.dataItems.each(function (dataItem) {
            dataItem.setValue("value", dataItem.dataContext[currentType + "PerOneMillion"]);
            dataItem.mapPolygon.defaultState.properties.fill = undefined;
        })


        // update heat rule's maxValue
        bubbleSeries.heatRules.getIndex(0).maxValue = max[currentType];
        polygonSeries.heatRules.getIndex(0).maxValue = maxPC[currentType];
        if (perCapita) {
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
        //polygonSeries.mapPolygons.template.tooltipText = "[bold]{name}: {value.formatNumber('#a')}[/]\n[font-size:10px]" + currentTypeName
        polygonSeries.mapPolygons.template.tooltipText = "[bold]{name}: {value}[/]\n[font-size:10px]" + currentTypeName + " per million"

    }

});
