window.main = {
    init : function() {
        $(".btn-file :file").bind("change", this.fileOnChange);
        $(".fa-bar-chart").bind("click", this.showBarChart);
        $(".fa-tree").bind("click", this.showTreeDiagram);
    },

    fileOnChange : function(){
        var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        $("#csv_file_name").val(label);
        $("#file_container").html("Upload succeed")
                            .removeClass("btn-primary")
                            .addClass("btn-success");
        $("#modal_title").html(label+" content");
        $(".tools").removeClass("hide").css("opacity", 1);

        d3.csv(label, function(data) {
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

            // Bar chart

            var chart_var_1 = d3.select("#bar_chart_var_1");
            var chart_var_2 = d3.select("#bar_chart_var_2");

            var barWidth = 50;

            var continent_array = d3.map(dataset, function(d){return d[3];}).keys();

            var transport_array = d3.map(dataset, function(d){return d[6];}).keys();

            var continent_male_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);
            var continent_female_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

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
                .attr("class", "bar male init")
                .on("mouseenter", main.showBarChartInfo)
                .on("mouseleave", main.hideBarChartInfo)
                .attr("style",function(d, i){ return "height:"+continent_male_count[i]*2+"px";})
                .append("div")
                .html(function(d, i){ return continent_male_count[i];});

            var bar_female = chart_var_2.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", "bar female init")
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

            // tree diagram
            var tree_diagram_layer_1 = d3.select("#tree_diagram_layer_1");
            var tree_diagram_layer_2 = d3.select("#tree_diagram_layer_2");
            var tree_diagram_layer_3 = d3.select("#tree_diagram_layer_3");
            var tree_diagram_layer_4 = d3.select("#tree_diagram_layer_4");

            var tree_diagram_layer_1_data = tree_diagram_layer_1.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .html(function(d){ return d;});

            var tree_diagram_layer_2_data = tree_diagram_layer_2.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", "gender_group")
                .html(function(d){ return "<div>H</div><div>F</div>";});

            var tree_diagram_layer_3_data = tree_diagram_layer_3.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", "gender_group")
                .html(function(d, i){ return "<div>"+continent_male_count[i]+"</div><div>"+continent_female_count[i]+"</div>";});

                var tree_diagram_layer_4_data = tree_diagram_layer_4.selectAll("div")
                .data(continent_array)
                .enter()
                .append("div")
                .attr("class", "gender_group")
                .html(function(d, i){ return "<div>"+getFavoriteTransportForContinentByGender(i, "M")+"</div><div>"+getFavoriteTransportForContinentByGender(i, "F")+"</div>";});
        });
    },

    showBarChart : function(){
        if($("#bar_chart_content").css("opacity") == 0){
            if($("#bar_chart_content").css("display") == "none")
                $("#bar_chart_content").css("display", "inherit");

            $("#bar_chart_content").css("opacity", 1);
            
            $(".fa-bar-chart").addClass("active");
            $("#bar_chart .bar").removeClass('init');
        }else{
            if($("#tree_diagram_content").css("opacity") == 1)
                $("#bar_chart_content").css("display", "none");
            $("#bar_chart_content").css("opacity", 0);
            $(".fa-bar-chart").removeClass("active");
            $("#bar_chart .bar").addClass('init');
        }
        
    },

    showTreeDiagram : function(){
        if($("#tree_diagram_content").css("opacity") == 0){
            if($("#bar_chart_content").css("opacity") == 0)
                $("#bar_chart_content").css("display", "none");
            
            $("#tree_diagram_content").css("opacity", 1);
            $(".fa-tree").addClass("active");
        }else{
            $("#tree_diagram_content").css("opacity", 0);
            $(".fa-tree").removeClass("active");
        }
        
    },

    showData : function(){
        $('#csv_content').modal('show');
    },

    showBarChartInfo : function(){
        $(this).children().css("opacity", 1);
        $(this).children().css("font-size", 60);
        $(this).children().css("margin-top", -150);
    },

    hideBarChartInfo : function(){
        $(this).children().css("opacity", 0);
        $(this).children().css("font-size", 10);
        $(this).children().css("margin-top", 10);
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
};

$(window).on('resize', main.adapt_bar_chart);

$(document).ready(function() {
    window.main.init();
});
