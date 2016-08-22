//loads modal on page load
$(document).ready(function () {
    $("#welcome-popup").modal("show");
});

//----------------------------------------------------------------------------------------------------------------------

//creates variable for public functions
var app;

//imports necessary packages and calls app main function
require(["dojo/dom",
    "dojo/_base/array",
    "esri/Color",

    "esri/map",
    "esri/toolbars/draw",
    "esri/layers/FeatureLayer",
    "esri/SnappingManager",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/tasks/Geoprocessor",
    "esri/tasks/FeatureSet",
    "esri/tasks/LinearUnit",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol","esri/request"],
    function(dom, array, Color, Map, Draw, FeatureLayer, SnappingManager,
             Graphic, graphicsUtils, Geoprocessor, FeatureSet, LinearUnit,
             SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, esriRequest) {

    //creates map
    var map = new Map("mapDiv", {
        center: [-69.5, 18.6],
        zoom: 8,
        basemap: "satellite"
    });

    //creates streamlines featuer layer and adds it to the map
    var featureLayer = new FeatureLayer("http://geoserver.byu.edu/arcgis/rest/services/hydropower_mskl/backgroundData/MapServer/1");
    map.addLayer(featureLayer);

    var layerInfos = [{
        layer: featureLayer
    }];

    //add snapping functionality to the map
    map.enableSnapping({alwaysSnap: true}).setLayerInfos(layerInfos);

    //creates geoprocessing task by calling geoprocessing service for server
    gp = new Geoprocessor("http://geoserver.byu.edu/arcgis/rest/services/hydropower_mskl/reservoirVolumeDR/GPServer/Reservoir%20Volume");
    gp.setOutputSpatialReference({wkid: 102100});

    //creates drawing tool
    function createToolbar(map) {
        toolbar = new Draw(map);
        toolbar.on("draw-complete", addPointToMap);
    }

    //function to enable draw point tool on map
    var pointTest;
    function drawPoint() {
        map.graphics.clear();
        if (pointTest === false) {
            toolbar.deactivate();
        }
        pointTest = true;
        map.graphics.clear();
        map.setMapCursor("crosshair");
        $("#initDraw").bind("click", createToolbar(map));
        toolbar.activate(Draw.POINT);
        map.hideZoomSlider();
    }

    //variable to save point drawn on map for later use when running geoprocessing task
    var featureSet = new FeatureSet();

    //gets parameters and sends request to server to run geoprocessing service
    function submitResRequest() {
        var params = {
            "pour_point": featureSet,
            "height": $("#damHeight").val()
        };
        map.setMapCursor("progress");
        gp.submitJob(params, completeCallback, statusCallback);
    };

    //creates symbology for point, draws point, adds it to map, and adds it to feature set variable
    function addPointToMap(evt) {
        var pointSymbol = new SimpleMarkerSymbol();
        pointSymbol.setSize(14);
        pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
        pointSymbol.setColor(new Color([0, 0, 255, 0.25]));

        map.setMapCursor("auto")
        map.showZoomSlider();
        if (pointTest === true) {
            var graphic = new Graphic(evt.geometry, pointSymbol);
            map.graphics.add(graphic);

            var features = [];
            features.push(graphic);
            featureSet.features = features;
            pointTest = false;
        };
    };

    //displays request status
    function statusCallback(jobInfo) {
        if (jobInfo.jobStatus === "esriJobSubmitted") {
            $("#vol").html("<h6>Request submitted...</h6>");
        } else if (jobInfo.jobStatus === "esriJobExecuting") {
            $("#vol").html("<h6>Executing...</h6>");
        } else if (jobInfo.jobStatus === "esriJobSucceeded") {
            $("#vol").html("<h6>Retrieving results...</h6>");
        }
    }

    //calls draw reservoir and get volume on success, or failedcallback on failed request
    function completeCallback(jobInfo) {
        map.graphics.clear()
        gp.getResultData(jobInfo.jobId, "watershed", drawWatershed, failedCallback);
        gp.getResultData(jobInfo.jobId, "reservoir", drawReservoir);
        gp.getResultData(jobInfo.jobId, "volume", getVolume);
    }

    //prints alert for wrong input point on failed request
    function failedCallback() {
        map.setMapCursor("auto");
        $("#vol").html("<p class='bg-danger'><span id='volError'>No nearby stream found</span></p>");
        alert("No major stream found nearby. Please click at least within 100 meters of a major stream.")
    }

     //creates reservoir polygon on successful request and adds it to the map
    function drawReservoir(reservoir) {
        var polySymbol = new SimpleFillSymbol();
        polySymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255, 0.5]), 1));
        polySymbol.setColor(new Color([0, 127, 255, 0.7]));
        var features = reservoir.value.features;
        for (var f = 0, fl = features.length; f < fl; f++) {
            var featureRe = features[f];
            featureRe.setSymbol(polySymbol);
            map.graphics.add(featureRe);
        }
    };

    //creates watershed polygon on successful request and adds it to the map
    function drawWatershed(watershed) {
        var polySymbol = new SimpleFillSymbol();
        polySymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 255, 0.5]), 2));
        polySymbol.setColor(new Color([0, 127, 255, 0]));
        var features = watershed.value.features;
        for (var f = 0, fl = features.length; f < fl; f++) {
            var featureWa = features[f];
            featureWa.setSymbol(polySymbol);
            map.graphics.add(featureWa);
        }
        map.setMapCursor("auto");
        map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics), true);
    };

    //sends request to get volume text file from server
    function getVolume(volume) {
        var req = esriRequest({
            "url": volume.value.url,
            "handleAs": "text"
        });
        req.then(requestSucceeded, requestFailed);
    }

    //manipulates text dile and adds total volume to app on successful text file request
    function requestSucceeded(response){
        var elem = response.split(",");
        var volNumber = Number(elem[elem.length - 1]).toFixed(2);
        $("#vol").html(
            "<h6>Total Volume:</h6>" +
            "<p class='bg-primary'> <span id='volBlue'>" +
            volNumber + "</span> Cubic Meters</p>"
        );
    }

    //returns error on failed text file request
    function requestFailed(error){
        $("#vol").html("<p class='bg-danger'>Error: " + error + " happened while retrieving the volume</p>");
    }

    //adds public functions to variable app
    app = {map: map, drawPoint: drawPoint, submitResRequest: submitResRequest};
});