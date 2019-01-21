require(['jquery',
    "splunkjs/mvc/utils",
    "splunkjs/mvc/searchmanager"
], function($,
    utils,
    SearchManager) {
    var desiredSearchName = "exampleSearch1"
    if (typeof splunkjs.mvc.Components.getInstance(desiredSearchName) == "object") {
        // console.log(desiredSearchName, "already exists. This probably means you're copy-pasting the same code repeatedly, and so we will clear out the old object for convenience")
        splunkjs.mvc.Components.revokeInstance(desiredSearchName)
    }

    var mySearchString = ''

    var sm = new SearchManager({
        "id": desiredSearchName,
        "cancelOnUnload": true,
        "latest_time": "",
        "status_buckets": 0,
        "earliest_time": "0",
        "search": mySearchString,
        "app": utils.getCurrentApp(),
        "preview": true,
        "runWhenTimeIsUndefined": false,
        "autostart": true
    }, { tokens: true, tokenNamespace: "submitted" });
    // To manually check the status at any time, open the Javascript Console and run splunkjs.mvc.Components.getInstance("exampleSearch1") -- particularly accessing attributes.data
    // You will also find fun methods like splunkjs.mvc.Components.getInstance("exampleSearch1").startSearch() and others.
    sm.on('search:start', function(properties) {
        var searchName = properties.content.request.label
            // console.log(searchName, "started", properties)
    });
    sm.on('search:error', function(properties) {

        // console.log("errored", properties)
        $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> Error running search! Check out the error in the Javascript Console.</p>")
    });
    sm.on('search:fail', function(properties) {
        var searchName = properties.content.request.label
            // console.log(searchName, "failed", properties)
        $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> Search Failed! Check out the error in the Javascript Console.</p>")
    });
    sm.on('search:done', function(properties) {
        var searchName = properties.content.request.label
        if (properties.content.resultCount == 0) {
            // console.log(searchName, "gave no results", properties)
            $("#results").html("<p><span style=\"color: red; font-weight: bolder;\">ERROR!</span> No Results.... do you have any data?</p>")
        } else {
            var results = splunkjs.mvc.Components.getInstance(searchName).data('results', { output_mode: 'json', count: 0 });
            results.on("data", function(properties) {
                var searchName = properties.attributes.manager.id
                var data = properties.data().results
                    // console.log(searchName, "gave results", properties, data)
                    // OPTION ONE 
                    // Let's push the results of the first event to a div with id="results"
                    // $("#results").text(data[0]['_raw'])
                    // OPTION TWO
                    // If we had multiple results (e.g., if you are doing | head 10 instead of head 1 in the search), let's iterate through and add each.
                for (var i = 0; i < data.length; i++) {
                    $("#results").append($("<pre></pre>").text(data[i]['_raw']))
                }
            })
        }
    });
})