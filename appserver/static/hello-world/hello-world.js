function queryAJAX() {
    // console.log("Starting our thing..")
    $.ajax({
        type: "GET",
        url: "/en-US/splunkd/__raw/servicesNS/-/-/apps/local?count=0&output_mode=json",
        success: function(data, textStatus, xhr) {
            for (var i = 0; i < data['entry'].length; i++) {
                
                if (data['entry'][i]['name'] ==  "Splunk_Security_Essentials" ) {

                    $("#results").append($("<p></p>").text(data['entry'][i]['name']))

                }
            }
        },
        error: function(xhr, textStatus, error) {
            console.error("Error!", error);
            $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> Error running search! Check out the error in the Javascript Console.</p>")
        }
    });
}

queryAJAX()