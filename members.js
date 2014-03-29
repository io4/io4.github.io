function load() {
    var s = document.location.search.substring(1);
    if (s == "")
        createList();
    else
        createRecord(s);
}

function createRankBadge(rank) {
    var cl = "";
    if (rank.indexOf("Admiral") != -1)
        cl = "badge-warning";
    else if (rank.indexOf("Captain") != -1)
        cl = "badge-silver";
    else if (rank.indexOf("Commander") != -1)
        cl = "badge-bronze";
    else if (rank.indexOf("Lieutenant") != -1 || rank.indexOf("Ensign") != -1)
        cl = "badge-inverse";
    else
        cl = "badge-default";

    return $("<span class=\"badge " + cl + "\">" + rank + "</span>");
}

function createAwardBadge(name, rank) {
    var cl = "";
    var rn = "";
    switch (rank) {
        case 1:
            cl = "badge-inverse"; rn = "Standard rank"; break;
        case 2:
            cl = "badge-bronze"; rn = "Bronze rank"; break;
        case 3:
            cl = "badge-silver"; rn = "Silver rank"; break;
        case 4:
            cl = "badge-warning"; rn = "Gold rank"; break;
        case 5:
            cl = "badge-diamond"; rn = "Diamond rank"; break;
    }
    return $("<span class=\"badge " + cl + "\" title=\"" + rn + "\">" + name + "</span><span> </span>");
}

function createList() {
    var resp = jQuery.getJSON("members.json");
    // Set content to be fluid
    $("#content").addClass("row-fluid");

    resp.done(function(e) {
        var offbox = $("<div class=\"span6\"></div>");
        $("<h4>Officers</h4>").appendTo(offbox);
        var officers = $("<ul></ul>")
        for (var i = 0; i < e.officers.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.officers[i][0]) + "\">" +
                e.officers[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.officers[i][1]).appendTo(li);
            li.appendTo(officers);
        }
        officers.appendTo(offbox);
        offbox.appendTo("#content");

        var preoffbox = $("<div class=\"span6\"></div>");
        $("<h4>Preofficers</h4>").appendTo(preoffbox);
        var preofficers = $("<ul></ul>")
        for (var i = 0; i < e.preofficers.length; i++) {
            var li = $("<li></li>");
            $("<a href=\"members.html?" + encodeURIComponent(e.preofficers[i][0]) + "\">" +
                e.preofficers[i][0] + "</a><span> </span>").appendTo(li);
            createRankBadge(e.preofficers[i][1]).appendTo(li);
            li.appendTo(preofficers);
        }
        preofficers.appendTo(preoffbox);
        preoffbox.appendTo("#content");
    });
}

function createRecord(name) {
    var resp = jQuery.getJSON("members/" + name + ".json");
    resp.done(function(e) {
        // Title
        var title = $("<h4>" + name + " </h4>");
        createRankBadge(e.rank).appendTo(title);
        title.prependTo("#content");
        $("<i>" + e.rank_comment + "</i>").appendTo("#content");

        // Award box
        var box = $("<div class=\"award-box\"></div>");
        for (var i in e.awards) {
            createAwardBadge(i, e.awards[i]).appendTo(box);
        }
        box.appendTo("#content");

        // Links
        $("<br><a class=\"muted\" href=\"http://tpt.io/@" + name + "\">Forum Profile</a>").appendTo("#content");
        for (var i in e.links) {
            $("<span class=\"muted\">&nbsp;&middot;&nbsp;</span><a class=\"muted\" href=\"" + e.links[i] + "\">" + i + "</a>").appendTo("#content");
        }

        // Aaand add the page
        $("<div class=\"member-page\">" + e.page + "</div>").appendTo("#content")

        // Prepend the back link
        $("<a href=\"members.html\">< Back</a><br>").prependTo("#content");
    });

    resp.error(function(e) {
        // Prepend an error message
        $("<a href=\"members.html\">< Back</a>").prependTo("#content");
        $("<div class=\"alert alert-error\">Could find no member named \""
            + name + "\" :(</div>").appendTo("#content");
    });
}

$(load);
