window.main = {
    init : function() {
        $(".btn-file :file").bind("change", this.fileOnChange);
        $(".fa-bar-chart").bind("click", this.showBarChart)
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
            dataset = data.map(function(d) { return [   +d["ID"], 
                                                        d["Prenom"],
                                                        d["Nom"],
                                                        d["Sexe"],
                                                        +d["Age"],
                                                        d["Pays"],
                                                        +d["VitesseMoyenne"],
                                                        d["CouleurVoiture"],
                                                        d["MarqueVoiture"]
                                                    ];});

            // csv modal content
            d3.select(".modal-body")
                .selectAll("div")
                .data(dataset)
                .enter()
                .append("div")
                .attr("class", "row")
                .html(function(d){ 
                    var id              = d[0],
                        prenom          = d[1],
                        nom             = d[2],
                        sexe            = d[3],
                        age             = d[4],
                        pays            = d[5],
                        vitesse_moyenne = d[6],
                        couleur_voiture = d[7],
                        marque_voiture  = d[8];

                    var line =  "<div class='col-md-1 center'>"+id+"</div> " +
                                "<div class='col-md-2 center'>"+prenom+"</div> " +
                                "<div class='col-md-2 center'>"+nom+"</div> " +
                                "<div class='col-md-1 center'>"+sexe+"</div> " +
                                "<div class='col-md-1 center'>"+age+"</div> " +
                                "<div class='col-md-1 center'>"+pays+"</div> " +
                                "<div class='col-md-1 center'>"+vitesse_moyenne+"</div>"+
                                "<div class='col-md-2 center'>"+marque_voiture+"</div>"+
                                "<div class='col-md-1 center car_color' style='background-color:"+couleur_voiture+";'>"+couleur_voiture+"</div>";
                    return line; 
                });
            $("#file_container.btn-success").bind("click", main.showData);

            // Bar chart

            var chart = d3.select("#bar_chart");

            var barWidth = 50;

            var car_brands = d3.map(dataset, function(d){return d[8];}).keys();

            var car_brands_count = Array.apply(null, Array(car_brands.length)).map(Number.prototype.valueOf,0);;

            for(var i = 0; i < dataset.length; i++){
                for(var j = 0; j < car_brands.length; j++){
                    if(dataset[i][8] == car_brands[j]){
                        car_brands_count[j] += 1;
                    }
                }
            }

            var bar = chart.selectAll("div")
                .data(car_brands)
                .enter()
                .append("div")
                .attr("class", "bar")
                .attr("style",function(d, i){ return "height:"+car_brands_count[i]*4+"px";})
                .append("div")
                .html(function(d){ return d;});

            var left_counter = 390;
            $( "#bar_chart div" ).each(function() {                
                $(this).css("left", left_counter);
                left_counter += 26;
            });
        });
    },

    showBarChart : function(){
        $("#bar_chart_content").css("opacity", 1);
    },

    showData : function(){
        $('#csv_content').modal('show');
    }
};

$(document).ready(function() {
    window.main.init();
});
