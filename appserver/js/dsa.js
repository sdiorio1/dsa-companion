require([
    "splunkjs/mvc/searchmanager",
    "splunkjs/mvc/tableview",
    "splunkjs/mvc/simplexml/ready"
], function(
    Searchmanager,
    Tableview
){
    var search1 = new SearchManager({
        id: "table-search",
        search:"| rest /servicesNS/-/-/apps/local splunk_server=* \
        | table title, version \
        | sort - title",
        earliest_time: "-15d",
        latest_time: "now",
        preview: true,
        cache: true
    });

    var table1 = new TableView({
        id: "table-view",
        managerid: "table-search",
        el: $("#table1")
    }).render();
});