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

        d3.csv(label, function(data) {
            dataset = data.map(function(d) { return [   +d["ID"], 
                                                        d["Prenom"],
                                                        d["Nom"],
                                                        d["Sexe"],
                                                        +d["Age"],
                                                        d["CouleurVoiture"]
                                                    ];});
            //console.log(data);
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
                        couleur_voiture = d[5];

                    var line =  "<div class='col-md-2'>"+id+"</div> " +
                                "<div class='col-md-2'>"+prenom+"</div> " +
                                "<div class='col-md-2'>"+nom+"</div> " +
                                "<div class='col-md-2'>"+sexe+"</div> " +
                                "<div class='col-md-2'>"+age+"</div> " +
                                "<div class='col-md-2 car_color' style='background-color:"+couleur_voiture+";'>"+couleur_voiture+"</div>";
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
