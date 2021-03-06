window.main = {
    init : function() {
        $(".btn-file :file").bind("change", this.fileOnChange);
        $(".fa-bar-chart").bind("click", this.showBarChart);
        $(".fa-tree").bind("click", this.showTreeDiagram);
        $(".fa-cube").bind("click", this.show3dDiagram);
        $(".fa-smile-o").bind("click", this.showGlyphDiagram);
        $(".fa-bars").bind("click", this.showParallelCordsDiagram);
    },

    fileOnChange : function(){
        $("#chart_container").css("display","inherit");
        var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $("#csv_file_name").val(label);
        $("#file_container").html("Upload succeed")
                            .removeClass("btn-primary")
                            .addClass("btn-success");
        $("#modal_title").html(label+" content");
        $(".tools").removeClass("hide").css("opacity", 1);

        // Aggregation data
        var sommeFemme = 0;
        var sommeHomme = 0;
        var totalBieres = 0;
        var totalCafe = 0;
        var numTransport = {Voiture:0, Bateau:0, Avion:0, Train:0, Velo:0, Metro:0};
        var numPaiement = {PayPal:0, Comptant:0, Credit:0};

        d3.csv(label, function(data) {

            // Aggregation data
            var totalLines = 0;
            var totalAge = 0;
            var totalCafe = 0;
            var totalBieres = 0;
            var numSexe = {M: 0, F: 0};
            var numContinent = {NA: 0, SA: 0, EU: 0, AF: 0, AS: 0, OC: 0, AN: 0};
            var numTransport = {Voiture:0, Bateau:0, Avion:0, Train:0, Velo:0, Metro:0};
            var numPaiement = {PayPal:0, Comptant:0, Credit:0};

            dataset = data.map(function(d) { return [   +d["id"], 
                                                        d["Sexe"],
                                                        +d["Age"],
                                                        d["Continent"],
                                                        +d["NbCafeSemaine"],
                                                        +d["NbBiereSemaine"],
                                                        d["TransportFavori"],
                                                        d["PaiementFavori"]
                                                    ];});

            // csv modal content
            d3.select(".modal-body")
                .selectAll("div")
                .data(dataset)
                .enter()
                .append("div")
                .attr("class", "row")
                .html(function(d){ 
                    var id                  = d[0],
                        sexe                = d[1],
                        age                 = d[2],
                        continent           = d[3],
                        nb_cafe_semaine     = d[4],
                        nb_biere_semaine    = d[5],
                        transport_favori    = d[6],
                        paiement_favori     = d[7];

                    // Gestion des aggregation data

                    totalLines++;
                    totalAge += parseInt(age);
                    totalCafe += parseInt(nb_cafe_semaine);
                    totalBieres += parseInt(nb_biere_semaine);
                    numSexe[sexe]++;
                    numContinent[continent]++;
                    numTransport[transport_favori]++;
                    numPaiement[paiement_favori]++;

                    var line =  "<div class='col-md-1 center'>"+id+"</div> " +
                                "<div class='col-md-1 center'>"+sexe+"</div> " +
                                "<div class='col-md-1 center'>"+age+"</div> " +
                                "<div class='col-md-2 center'>"+continent+"</div> " +
                                "<div class='col-md-1 center'>"+nb_cafe_semaine+"</div> " +
                                "<div class='col-md-2 center'>"+nb_biere_semaine+"</div> " +
                                "<div class='col-md-2 center'>"+transport_favori+"</div>"+
                                "<div class='col-md-2 center'>"+paiement_favori+"</div>";
                    return line; 
                });
            $("#file_container.btn-success").bind("click", main.showData);

            // Set aggregation data
            main.addAggregationData("Moyenne d'age", totalAge/totalLines);
            main.addAggregationData("Moyenne de cafés par semaine", totalCafe/totalLines);
            main.addAggregationData("Moyenne de bières par semaine", totalBieres/totalLines);
            main.addAggregationData("Pourcentage d'hommes", numSexe["M"]/totalLines*100, true);
            main.addAggregationData("Pourcentage de personnes habitant en Europe", numContinent["EU"]/totalLines*100, true);
            main.addAggregationData("Pourcentage de personnes utilisant le métro", numTransport["Metro"]/totalLines*100, true);
            main.addAggregationData("Pourcentage de personnes utilisant PayPal", numPaiement["PayPal"]/totalLines*100, true);

            // Bar chart

            var chart_var_1 = d3.select("#bar_chart_var_1");
            var chart_var_2 = d3.select("#bar_chart_var_2");

            var barWidth = 50;

            var continent_array = d3.map(dataset, function(d){return d[3];}).keys();

            var transport_array = d3.map(dataset, function(d){return d[6];}).keys();

            var continent_male_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

            var continent_voiture_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_train_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_plane_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_bike_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_subway_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_boat_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

            var continent_male_voiture_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_male_train_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_male_plane_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_male_bike_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_male_subway_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_male_boat_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

            var continent_female_voiture_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_train_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_plane_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_bike_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_subway_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_boat_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

            for(var i = 0; i < dataset.length; i++){
                for(var j = 0; j < continent_array.length; j++){
                    if(dataset[i][3] == continent_array[j]){
                        if(dataset[i][1] == "M"){
                            continent_male_count[j] += 1;
                            if(dataset[i][6] == "Voiture"){
                                continent_male_voiture_count[j] += 1;
                            }else if(dataset[i][6] == "Train"){
                                continent_male_train_count[j] += 1;
                            }else if(dataset[i][6] == "Avion"){
                                continent_male_plane_count[j] += 1;
                            }else if(dataset[i][6] == "Metro"){
                                continent_male_subway_count[j] += 1;
                            }else if(dataset[i][6] == "Velo"){
                                continent_male_bike_count[j] += 1;
                            }else if(dataset[i][6] == "Bateau"){
                                continent_male_boat_count[j] += 1;
                            }
                        }else if(dataset[i][1] == "F"){
                            continent_female_count[j] += 1;
                            if(dataset[i][6] == "Voiture"){
                                continent_female_voiture_count[j] += 1;
                            }else if(dataset[i][6] == "Train"){
                                continent_female_train_count[j] += 1;
                            }else if(dataset[i][6] == "Avion"){
                                continent_female_plane_count[j] += 1;
                            }else if(dataset[i][6] == "Metro"){
                                continent_female_subway_count[j] += 1;
                            }else if(dataset[i][6] == "Velo"){
                                continent_female_bike_count[j] += 1;
                            }else if(dataset[i][6] == "Bateau"){
                                continent_female_boat_count[j] += 1;
                            }
                        }
                    }
                }
            }

            for(var i = 0; i < continent_array.length; i++){
                continent_voiture_count[i] = continent_male_voiture_count[i] + continent_female_voiture_count[i];
                continent_train_count[i] = continent_male_train_count[i] + continent_female_train_count[i];
                continent_plane_count[i] = continent_male_plane_count[i] + continent_female_plane_count[i];
                continent_bike_count[i] = continent_male_bike_count[i] + continent_female_bike_count[i];
                continent_subway_count[i] = continent_male_subway_count[i] + continent_female_subway_count[i];
                continent_boat_count[i] = continent_male_boat_count[i] + continent_female_boat_count[i];
            }

            function getFavoriteTransportForContinentByGender(i, gender){
                var temp = [];
                var index;

                if(gender == "M"){
                    temp = [
                        continent_male_voiture_count[i],
                        continent_male_train_count[i],
                        continent_male_plane_count[i],
                        continent_male_subway_count[i],
                        continent_male_bike_count[i],
                        continent_male_boat_count[i]
                    ];    
                }else if(gender == "F"){
                    temp = [
                        continent_female_voiture_count[i],
                        continent_female_train_count[i],
                        continent_female_plane_count[i],
                        continent_female_subway_count[i],
                        continent_female_bike_count[i],
                        continent_female_boat_count[i]
                    ];
                }

                index = temp.indexOf(Math.max.apply(Math,temp));

                var fav_transport = "";

                switch(index) {
                    case 0:
                        fav_transport = "Voiture";
                        break;
                    case 1:
                        fav_transport = "Train";
                        break;
                    case 2:
                        fav_transport = "Avion";
                        break;
                    case 3:
                        fav_transport = "Metro";
                        break;
                    case 4:
                        fav_transport = "Velo";
                        break;
                    case 5:
                        fav_transport = "Bateau";
                        break;
                }

                return fav_transport;
            }

            var bar_male = chart_var_1.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", function(d){ return d.toLowerCase()+" bar male init"; })
                .on("mouseenter", main.showBarChartInfo)
                .on("mouseleave", main.hideBarChartInfo)
                .attr("style",function(d, i){ return "height:"+continent_male_count[i]*2+"px";})
                .append("div")
                .html(function(d, i){ return continent_male_count[i];});

            var bar_female = chart_var_2.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", function(d){ return d.toLowerCase()+" bar female init"; })
                .on("mouseenter", main.showBarChartInfo)
                .on("mouseleave", main.hideBarChartInfo)
                .attr("style",function(d, i){ return "height:"+continent_female_count[i]*2+"px";})
                .append("div")
                .html(function(d, i){ return continent_female_count[i];});

            main.adapt_bar_chart();

            var bar_x_axis = d3.select("#bar_chart_x_axis");

            var x_axis_domain = bar_x_axis.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .html(function(d){ return d;});

            var bar_y_axis = d3.select("#bar_chart_y_axis_grad");

            var max_y_axis = Array.apply(null, Array(15)).map(Number.prototype.valueOf,0);

            var max = 150;

            for(var i = 0; i < 16; i++){
                max_y_axis[i] = max;
                max -=10;
            }

            var y_axis_domain = bar_y_axis.selectAll("div")
                .data(max_y_axis)
                .enter()
                .append("div")
                .html(function(d, i){ return max_y_axis[i];});

            // tree diagram
            var tree_diagram_layer_1 = d3.select("#tree_diagram_layer_1");
            var tree_diagram_layer_2 = d3.select("#tree_diagram_layer_2");
            var tree_diagram_layer_3 = d3.select("#tree_diagram_layer_3");
            var tree_diagram_layer_4 = d3.select("#tree_diagram_layer_4");

            var tree_diagram_layer_1_data = tree_diagram_layer_1.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", function(d){ return d.toLowerCase(); })
                .html(function(d){ return d;});

            var tree_diagram_layer_2_data = tree_diagram_layer_2.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", "gender_group")
                .attr("class", function(d){ return d.toLowerCase()+" gender_group"; })
                .html(function(d){ return "<div class='male'>H</div><div class='female'>F</div>";});

            var tree_diagram_layer_3_data = tree_diagram_layer_3.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", function(d){ return d.toLowerCase()+" gender_group"; })
                .html(function(d, i){ return "<div class='male'>"+continent_male_count[i]+"</div><div class='female'>"+continent_female_count[i]+"</div>";});

            var tree_diagram_layer_4_data = tree_diagram_layer_4.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", function(d){ return d.toLowerCase()+" gender_group"; })
                .html(function(d, i){ return "<div class='male'>"+getFavoriteTransportForContinentByGender(i, "M")+"</div><div class='female'>"+getFavoriteTransportForContinentByGender(i, "F")+"</div>";});

            // glyph diagram
            var glyph_diagram = d3.select("#glyph_diagram");

            var glyph_diagram_content = glyph_diagram.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", "row")
                .html(function(d, i){ 
                    var content =   "<div class='col-md-2 center'><i class='fa fa-car' style='font-size:"+continent_voiture_count[i]*2+"px;'><span>"+continent_voiture_count[i]+"</span></i></div>"+
                                    "<div class='col-md-2 center'><i class='fa fa-train' style='font-size:"+continent_train_count[i]*2+"px;'><span>"+continent_train_count[i]+"</span></i></div>"+
                                    "<div class='col-md-2 center'><i class='fa fa-plane' style='font-size:"+continent_plane_count[i]*2+"px;'><span>"+continent_plane_count[i]+"</span></i></div>"+
                                    "<div class='col-md-2 center'><i class='fa fa-subway' style='font-size:"+continent_bike_count[i]*2+"px;'><span>"+continent_bike_count[i]+"</span></i></div>"+
                                    "<div class='col-md-2 center'><i class='fa fa-bicycle' style='font-size:"+continent_subway_count[i]*2+"px;'><span>"+continent_subway_count[i]+"</span></i></div>"+
                                    "<div class='col-md-2 center'><i class='fa fa-ship' style='font-size:"+continent_boat_count[i]*2+"px;'><span>"+continent_boat_count[i]+"</span></i></div>";
                    return content; 
                });

            // 3D chart

            var globeWidth = 600, globeHeight = 500, sens = 0.25, focused;

            //Setting projection

            var projection = d3.geo.orthographic()
              .scale(245)
              .rotate([0, 0])
              .translate([globeWidth / 2, globeHeight / 2])
              .clipAngle(90);

            var path = d3.geo.path()
                .projection(projection);

            var svg = d3.select("#threed_diagram").append("svg")
              .attr("width", globeWidth)
              .attr("height", globeHeight);

            svg.append("path")
              .datum({type: "Sphere"})
              .attr("class", "water")
              .attr("d", path);

            var countryTooltip = d3.select("#threed_diagram").append("div").attr("class", "countryTooltip"),
            countryList = d3.select("#threed_diagram_select").append("select").attr("name", "countries");
       
            queue()
              .defer(d3.json, "/world-110m.json")
              .defer(d3.tsv, "/world-110m-country-names.tsv")
              .await(ready);

            function ready(error, world, countryData) {

                var countryById = {}, continentById = {}, 
                dictContinents = { NA: 'North America', SA: 'South America', AF: 'Africa', AS: 'Asia', OC: "Oceania", AN: 'Antartica', EU: 'Europe'}
                countries = topojson.feature(world, world.objects.countries).features;

                //Adding countries to select

                countryData.forEach(function(d) {
                  countryById[d.id] = d.name;
                  continentById[d.id] = d.continent;
                  option = countryList.append("option");
                  option.text(d.name);
                  option.property("value", d.id);
                });

                //Drawing countries on the globe

                var world = svg.selectAll("path.land")
                .data(countries)
                .enter().append("path")
                .attr("class", "land")
                .attr("d", path)

                //Drag event

                .call(d3.behavior.drag()
                  .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
                  .on("drag", function() {
                    var rotate = projection.rotate();
                    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                    svg.selectAll("path.land").attr("d", path);
                    svg.selectAll(".focused").classed("focused", focused = false);
                  }))

                //Mouse events

                .on("mouseover", function(d) {
                  countryTooltip.text("Habitants in " + dictContinents[continentById[d.id]] + ": " + numContinent[continentById[d.id]])
                  .style("left", (d3.event.pageX + 7) + "px")
                  .style("top", (d3.event.pageY - 15) + "px")
                  .style("display", "block")
                  .style("opacity", 1);
                })
                .on("mouseout", function(d) {
                  countryTooltip.style("opacity", 0)
                  .style("display", "none");
                })
                .on("mousemove", function(d) {
                  countryTooltip.style("left", (d3.event.pageX + 7) + "px")
                  .style("top", (d3.event.pageY - 15) + "px");
                });

                // Country focus on option select

                d3.select("select").on("change", function() {
                    var rotate = projection.rotate(),
                    focusedCountry = country(countries, this),
                    p = d3.geo.centroid(focusedCountry);

                    svg.selectAll(".focused").classed("focused", focused = false);

                    // Globe rotating

                    (function transition() {
                        d3.transition()
                        .duration(2500)
                        .tween("rotate", function() {
                            var r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
                            return function(t) {
                                projection.rotate(r(t));
                                svg.selectAll("path").attr("d", path)
                                .classed("focused", function(d, i) { return d.id == focusedCountry.id ? focused = d : false; });
                            };
                        })
                    })();
                });

                function country(cnt, sel) { 
                    for(var i = 0, l = cnt.length; i < l; i++) {
                        if(cnt[i].id == sel.value) {return cnt[i];}
                    }
                };

            };
        });

        /** parallel cords **/
        // inspired by http://bl.ocks.org/jasondavies/1341281

        var margin = {top: 30, right: 10, bottom: 10, left: 10},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal().rangePoints([0, width], 1),
            y = {},
            dragging = {};

        var line = d3.svg.line(),
            axis = d3.svg.axis().orient("left"),
            background,
            foreground;

        var svgpar = d3.select("#parallelcords_diagram").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        d3.csv(label, function(data) {

            // Extract the list of dimensions and create a scale for each.
            x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
                return d != "id" && d != "Sexe" && d != "Continent" && d != "TransportFavori" && d != "PaiementFavori" && (y[d] = d3.scale.linear()
                .domain(d3.extent(data, function(p) { 
                    return +p[d]; 
                }))
                .range([height, 0]));
            }));

            // Add grey background lines for context.
            background = svgpar.append("g")
                .attr("class", "background")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", path);

            // Add blue foreground lines for focus.
            foreground = svgpar.append("g")
                .attr("class", "foreground")
                .selectAll("path")
                .data(data)
                .enter().append("path")
                .attr("d", path);

            // Add a group element for each dimension.
            var g = svgpar.selectAll(".dimension")
                .data(dimensions)
                .enter().append("g")
                .attr("class", "dimension")
                .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                .call(d3.behavior.drag()
                .origin(function(d) { return {x: x(d)}; })
                .on("dragstart", function(d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
                dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                .attr("d", path)
                .transition()
                .delay(500)
                .duration(0)
                .attr("visibility", null);
            }));

            // Add an axis and title.
            g.append("g")
                .attr("class", "axis")
                .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .text(function(d) { return d; });

            // Add and store a brush for each axis.
            g.append("g")
                .attr("class", "brush")
                .each(function(d) {
                    d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
                })
                .selectAll("rect")
                .attr("x", -8)
                .attr("width", 16);
        });

        function position(d) {
            var v = dragging[d];
            return v == null ? x(d) : v;
        }

        function transition(g) {
            return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
            return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
        }

        function brushstart() {
            d3.event.sourceEvent.stopPropagation();
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush() {
            var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
            foreground.style("display", function(d) {
                return actives.every(function(p, i) {
                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                }) ? null : "none";
            });
        }
    },

    showBarChart : function(){
        if($("#bar_chart_content").css("opacity") == 0){
            $("#bar_chart_content").css("display","inherit");
            $("#bar_chart_content").stop().animate({opacity: 1}, 500);
            $(".fa-bar-chart").addClass("active");
            $("#bar_chart .bar").removeClass('init');
        }else{
            $("#bar_chart_content").stop().animate({opacity: 0}, 500, function(){
                $("#bar_chart_content").css("display","none");
            });
            $(".fa-bar-chart").removeClass("active");
            $("#bar_chart .bar").addClass('init');
        }
        
    },

    showTreeDiagram : function(){
        if($("#tree_diagram_content").css("opacity") == 0){
            $("#tree_diagram_content").css("display","inherit");
            $("#tree_diagram_content").stop().animate({opacity: 1}, 500);
            $(".fa-tree").addClass("active");
        }else{
            $("#tree_diagram_content").stop().animate({opacity: 0}, 500, function(){
                $("#tree_diagram_content").css("display","none");
            });
            $(".fa-tree").removeClass("active");
        }
        
    },

    show3dDiagram : function(){
        if($("#threed_diagram_content").css("opacity") == 0){            
            $("#threed_diagram_content").css("display","inherit");
            $("#threed_diagram_content").stop().animate({opacity: 1}, 500);
            $(".fa-cube").addClass("active");
        }else{
            $("#threed_diagram_content").stop().animate({opacity: 0}, 500, function(){
                $("#threed_diagram_content").css("display","none");
            });
            $(".fa-cube").removeClass("active");
        }
        
    },

    showGlyphDiagram : function(){
        if($("#glyph_diagram_content").css("opacity") == 0){
            $("#glyph_diagram_content").css("display","inherit");
            $("#glyph_diagram_content").stop().animate({opacity: 1}, 500);
            $(".fa-smile-o").addClass("active");
        }else{
            $("#glyph_diagram_content").stop().animate({opacity: 0}, 500, function(){
                $("#glyph_content").css("display","none");
            });
            $(".fa-smile-o").removeClass("active");
        }
        
    },

    showParallelCordsDiagram : function(){
        if($("#parallelcords_diagram_content").css("opacity") == 0){            
            $("#parallelcords_diagram_content").css("display","inherit");
            $("#parallelcords_diagram_content").stop().animate({opacity: 1}, 500);
            $(".fa-bars").addClass("active");
        }else{
            $("#parallelcords_diagram_content").stop().animate({opacity: 0}, 500, function(){
                $("#parallelcords_diagram_content").css("display","none");
            });
            $(".fa-bars").removeClass("active");
        }
        
    },

    showData : function(){
        $('#csv_content').modal('show');
    },

    showBarChartInfo : function(){
        $(this).children().css("opacity", 1);
        $(this).children().css("font-size", 60);
        $(this).children().css("margin-top", -150);

        if($(this).hasClass("male") && $(this).hasClass("af")){
            $("#tree_diagram #tree_diagram_layer_1 .af").css("background-color", "#3498db");
            $("#tree_diagram .af .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("male") && $(this).hasClass("oc")){
            $("#tree_diagram #tree_diagram_layer_1 .oc").css("background-color", "#3498db");
            $("#tree_diagram .oc .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("male") && $(this).hasClass("an")){
            $("#tree_diagram #tree_diagram_layer_1 .an").css("background-color", "#3498db");
            $("#tree_diagram .an .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("male") && $(this).hasClass("as")){
            $("#tree_diagram #tree_diagram_layer_1 .as").css("background-color", "#3498db");
            $("#tree_diagram .as .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("male") && $(this).hasClass("na")){
            $("#tree_diagram #tree_diagram_layer_1 .na").css("background-color", "#3498db");
            $("#tree_diagram .na .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("male") && $(this).hasClass("sa")){
            $("#tree_diagram #tree_diagram_layer_1 .sa").css("background-color", "#3498db");
            $("#tree_diagram .sa .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("male") && $(this).hasClass("eu")){
            $("#tree_diagram #tree_diagram_layer_1 .eu").css("background-color", "#3498db");
            $("#tree_diagram .eu .male").css("background-color", "#3498db");
        }

        if($(this).hasClass("female") && $(this).hasClass("af")){
            $("#tree_diagram #tree_diagram_layer_1 .af").css("background-color", "#e74c3c");
            $("#tree_diagram .af .female").css("background-color", "#e74c3c");
        }

        if($(this).hasClass("female") && $(this).hasClass("oc")){
            $("#tree_diagram #tree_diagram_layer_1 .oc").css("background-color", "#e74c3c");
            $("#tree_diagram .oc .female").css("background-color", "#e74c3c");
        }

        if($(this).hasClass("female") && $(this).hasClass("an")){
            $("#tree_diagram #tree_diagram_layer_1 .an").css("background-color", "#e74c3c");
            $("#tree_diagram .an .female").css("background-color", "#e74c3c");
        }

        if($(this).hasClass("female") && $(this).hasClass("as")){
            $("#tree_diagram #tree_diagram_layer_1 .as").css("background-color", "#e74c3c");
            $("#tree_diagram .as .female").css("background-color", "#e74c3c");
        }

        if($(this).hasClass("female") && $(this).hasClass("na")){
            $("#tree_diagram #tree_diagram_layer_1 .na").css("background-color", "#e74c3c");
            $("#tree_diagram .na .female").css("background-color", "#e74c3c");
        }

        if($(this).hasClass("female") && $(this).hasClass("sa")){
            $("#tree_diagram #tree_diagram_layer_1 .sa").css("background-color", "#e74c3c");
            $("#tree_diagram .sa .female").css("background-color", "#e74c3c");
        }

        if($(this).hasClass("female") && $(this).hasClass("eu")){
            $("#tree_diagram #tree_diagram_layer_1 .eu").css("background-color", "#e74c3c");
            $("#tree_diagram .eu .female").css("background-color", "#e74c3c");
        }
    },

    hideBarChartInfo : function(){
        $(this).children().css("opacity", 0);
        $(this).children().css("font-size", 10);
        $(this).children().css("margin-top", 10);

        if($(this).hasClass("male") && $(this).hasClass("af")){
            $("#tree_diagram #tree_diagram_layer_1 .af").css("background-color", "#34495e");
            $("#tree_diagram .af .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("male") && $(this).hasClass("oc")){
            $("#tree_diagram #tree_diagram_layer_1 .oc").css("background-color", "#34495e");
            $("#tree_diagram .oc .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("male") && $(this).hasClass("an")){
            $("#tree_diagram #tree_diagram_layer_1 .an").css("background-color", "#34495e");
            $("#tree_diagram .an .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("male") && $(this).hasClass("as")){
            $("#tree_diagram #tree_diagram_layer_1 .as").css("background-color", "#34495e");
            $("#tree_diagram .as .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("male") && $(this).hasClass("na")){
            $("#tree_diagram #tree_diagram_layer_1 .na").css("background-color", "#34495e");
            $("#tree_diagram .na .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("male") && $(this).hasClass("sa")){
            $("#tree_diagram #tree_diagram_layer_1 .sa").css("background-color", "#34495e");
            $("#tree_diagram .sa .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("male") && $(this).hasClass("eu")){
            $("#tree_diagram #tree_diagram_layer_1 .eu").css("background-color", "#34495e");
            $("#tree_diagram .eu .male").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("af")){
            $("#tree_diagram #tree_diagram_layer_1 .af").css("background-color", "#34495e");
            $("#tree_diagram .af .female").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("oc")){
            $("#tree_diagram #tree_diagram_layer_1 .oc").css("background-color", "#34495e");
            $("#tree_diagram .oc .female").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("an")){
            $("#tree_diagram #tree_diagram_layer_1 .an").css("background-color", "#34495e");
            $("#tree_diagram .an .female").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("as")){
            $("#tree_diagram #tree_diagram_layer_1 .as").css("background-color", "#34495e");
            $("#tree_diagram .as .female").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("na")){
            $("#tree_diagram #tree_diagram_layer_1 .na").css("background-color", "#34495e");
            $("#tree_diagram .na .female").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("sa")){
            $("#tree_diagram #tree_diagram_layer_1 .sa").css("background-color", "#34495e");
            $("#tree_diagram .sa .female").css("background-color", "#34495e");
        }

        if($(this).hasClass("female") && $(this).hasClass("eu")){
            $("#tree_diagram #tree_diagram_layer_1 .eu").css("background-color", "#34495e");
            $("#tree_diagram .eu .female").css("background-color", "#34495e");
        }
    },

    adapt_bar_chart : function(){
        var bar_chart_div = $('#bar_chart');
        var bottom = $(window).height() - bar_chart_div.offset().top - bar_chart_div.height();
        $("#bar_chart .bar").css("bottom", bottom);

        var barWidth = 50;
        var barGap = barWidth + 1;

        var left = bar_chart_div.offset().left + barGap;

        $("#bar_chart_x_axis").css("left", left + barWidth - 5);

        var left_male_counter = left;
        var gap = 150;
        $( "#bar_chart div.male" ).each(function() {                
            $(this).css("left", left_male_counter);
            left_male_counter += gap;
        });

        var left_female_counter = left + barGap;
        $( "#bar_chart div.female" ).each(function() {                
            $(this).css("left", left_female_counter);
            left_female_counter += gap;
        });
    },

    addAggregationData : function(title, value, isPercentage) {

        if(isPercentage) {
            value = value.toFixed(2) + "%";
        }

        var html = "";
        html += '<div class="aggregation_data_line">';
        html += '<span class="aggregation_data_line_title">'+title+': </span>';
        html += '<span class="aggregation_data_line_value">'+value+'</span>';
        html += '</div>';

        $("#aggregation_data").append(html);
    }
};

$(window).on('resize', main.adapt_bar_chart);

$(document).ready(function() {
    window.main.init();
});
