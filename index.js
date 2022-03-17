function load() {
    fetch('sites_alive.json?' + Math.random())
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            layoutData(data);
        })
        .catch(function(err) {
            console.log('error: ' + err);
        });

    function layoutData(data) {
        var dateHtml = document.getElementById("date");
        var newDate = new Date();
        newDate.setTime(data.date * 1000);
        dateHtml.innerText = newDate.toLocaleString();

        var mainContainer = document.getElementById("stats");
        mainContainer.innerHTML = '';
        list = data.list;
        list.sort(function(a, b) {
            if (a.st == b.st) {
                return a.page < b.page ? -1 : 1;
            } else
                return a.st > b.st ? -1 : 1;
        });

        let protected = ["cloudflare", "ddos-guard"]

        for (var i = 0; i < list.length; i++) {
            var div = document.createElement("div");
            var page = list[i].page;
            var status = list[i].st;
            var protect = list[i].protect;
            var c_size = parseFloat(list[i].cs || 0).toFixed(2);
            div.innerHTML = `
            <div class=" item">\
                <div class="status inl ${status?"alive":"dead"}">&nbsp;</div>\
                <div class="url inl" title="${c_size}kb">${page}<span>${c_size}kb</span></div>\
                <div class="inl ${protected.includes(protect)?"secure":""}" title="${protect}"></div>\
            </div>`;
            div = div.children[0];
            mainContainer.appendChild(div);
        }
    }
}

let timerId = setInterval(() => load(), 1000 * 60);
load();