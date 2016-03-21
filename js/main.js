window.main = {
    init : function() {
        $(".btn-file :file").bind("change", this.fileOnChange);
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
                                                        +d["VitesseMoyenne"],
                                                        d["CouleurVoiture"],
                                                        d["MarqueVoiture"]
                                                    ];});

            console.log(data);
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
                        vitesse_moyenne = d[5],
                        couleur_voiture = d[6],
                        marque_voiture  = d[7];

                    var line =  "<div class='col-md-1 center'>"+id+"</div> " +
                                "<div class='col-md-2 center'>"+prenom+"</div> " +
                                "<div class='col-md-2 center'>"+nom+"</div> " +
                                "<div class='col-md-1 center'>"+sexe+"</div> " +
                                "<div class='col-md-1 center'>"+age+"</div> " +
                                "<div class='col-md-1 center'>"+vitesse_moyenne+"</div>"+
                                "<div class='col-md-2 center'>"+marque_voiture+"</div>"+
                                "<div class='col-md-2 center car_color' style='background-color:"+couleur_voiture+";'>"+couleur_voiture+"</div>";
                    return line; 
                });
            $("#file_container.btn-success").bind("click", main.showData);
        });
    },

    showData : function(){
        $('#csv_content').modal('show');
    }
};

$(document).ready(function() {
    window.main.init();
});
