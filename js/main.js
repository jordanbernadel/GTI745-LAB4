window.main = {
    init : function() {
        $(".btn-file :file").bind("change", this.fileOnChange);
        $(".fa-bar-chart").bind("click", this.showBarChart);
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

            var continent_male_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

            var continent_female_count = Array.apply(null, Array(continent_array.length)).map(Number.prototype.valueOf,0);

            for(var i = 0; i < dataset.length; i++){
                for(var j = 0; j < continent_array.length; j++){
                    if(dataset[i][3] == continent_array[j]){
                        if(dataset[i][1] == "M"){
                            continent_male_count[j] += 1;
                        }else if(dataset[i][1] == "F"){
                            continent_female_count[j] += 1;
                        }
                    }
                }
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

            
        });
    },

    showBarChart : function(){
        if($("#bar_chart_content").css("opacity") == 0){
            $("#bar_chart_content").css("opacity", 1);
            $(".fa-bar-chart").addClass("active");
            $("#bar_chart .bar").removeClass('init');
        }else{
            $("#bar_chart_content").css("opacity", 0);
            $(".fa-bar-chart").removeClass("active");
            $("#bar_chart .bar").addClass('init');
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
