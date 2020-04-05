$(function () {

    var jobSelect = '#jobSelect';
    var klassenSelect = '#klassenSelect';
    var wochenDisplay = '#wochenDisplay';
    var stundenplanContainer = '#stundenplanContainer';
    var buttonZurueck = '#buttonLinks';
    var buttonVorwaerts = '#buttonRechts';
    var jobIdLocalstorage = getLocalstorageJobId();
    var klassenIdLocalstorage = getLocalstorageKlassenId()
    var datum = moment();
    var datumWoche = moment(datum).format('WW-GGGG');

    function addListeners() {
        $(jobSelect).on('change', function () {
            loadKlassenSelect();
            setLocalstorageJobId($("#jobSelect :selected").val());
        })

        $(klassenSelect).on('change', function () {
            setLocalstorageKlassenId($("#klassenSelect :selected").val());
            loadTable();
        })

        $(buttonZurueck).on('click', function () {
            datum = moment(datum).subtract(1, 'w');
            datumWoche = moment(datum).format('WW-GGGG');

            $(wochenDisplay).text(moment(datum).format('WW-GGGG'));
            loadTable();
        })

        $(buttonVorwaerts).on('click', function () {
            datum = moment(datum).add(1, 'w');
            datumWoche = moment(datum).format('WW-GGGG');

            $(wochenDisplay).text(moment(datum).format('WW-GGGG'));
            loadTable();
        })
    }

    function loadJobSelect() {
        $.getJSON('https://sandbox.gibm.ch/berufe.php')
            .fail(function () {
                alert("Verbindung zum Server fehlgeschlagen!");
            })
            .done(function (data) {
                $(jobSelect)
                    .empty()
                    .append('<option value="">Wählen Sie Ihren Beruf</option>');
                $.each(data, function (i, jobSelector) {
                    if (jobSelector.beruf_name != 1) {
                        $('<option value="' + jobSelector.beruf_id + '">' + jobSelector.beruf_name + '</option>').appendTo($(jobSelect));
                    }
                })
                if (jobIdLocalstorage != null) {
                    $(jobSelect + " option[value='" + jobIdLocalstorage + "']").attr("selected", 'true');
                    loadKlassenSelect();
                }
            });
    }

    function loadKlassenSelect() {
        $(klassenSelect).show();
        var jobID = $("#jobSelect :selected").val();
        $.getJSON('https://sandbox.gibm.ch/klassen.php?beruf_id=' + jobID)
            .fail(function () {
                alert("Verbindung zum Server fehlgeschlagen!");
            })
            .done(function (data) {
                $(klassenSelect)
                    .empty()
                    .append('<option>Wählen Sie Ihre Klasse</option>')
                $.each(data, function (i, klassenSelector) {
                    $('<option value="' + klassenSelector.klasse_id + '">' + klassenSelector.klasse_longname + '</option>').appendTo($(klassenSelect));
                })
                if (klassenIdLocalstorage != null) {
                    $(klassenSelect + " option[value='" + klassenIdLocalstorage + "']").attr("selected", 'true');
                    loadTable();
                }
            });
    }

    function loadTable() {
        var klassenID = $("#klassenSelect :selected").val();
        $.getJSON('http://sandbox.gibm.ch/tafel.php?klasse_id=' + klassenID + '&woche=' + datumWoche)
            .fail(function () {
                alert("Verbindung zum Server fehlgeschlagen!");
            })
            .done(function (data) {
                $(stundenplanContainer).empty();
                if (data.length != 0) {
                    $(stundenplanContainer).append(
                        '<thead><tr><th scope="col">Datum</th><th scope="col">Tag</th><th scope="col">Von</th><th scope="col">Bis</th><th scope="col">Lehrer</th><th scope="col">Fach</th><th scope="col">Raum</th></tr></thead>'
                    );
                    $.each(data, function (i, objectStundenplan) {
                        $(stundenplanContainer).append(
                            '<tr>' +
                            '<th scope="row">' +
                            moment(objectStundenplan.tafel_datum).format('DD.MM.YYYY') +
                            '</th>' +
                            '<td>' +
                            moment(objectStundenplan.tafel_datum)
                                .day(objectStundenplan.tafel_wochentag)
                                .format('dddd') +
                            '</td>' +
                            '<td>' +
                            moment(objectStundenplan.tafel_von, 'HH:mm:ss').format('HH:mm') +
                            '</td>' +
                            '<td>' +
                            moment(objectStundenplan.tafel_bis, 'HH:mm:ss').format('HH:mm') +
                            '</td>' +
                            '<td>' +
                            objectStundenplan.tafel_lehrer +
                            '</td>' +
                            '<td>' +
                            objectStundenplan.tafel_longfach +
                            '</td>' +
                            '<td>' +
                            objectStundenplan.tafel_raum +
                            '</td>' +
                            '</tr>'
                        );
                    });
                }
            });
    }


    function startApplication() {
        $(klassenSelect).hide();

        $(wochenDisplay).text(datumWoche);

        addListeners();
        loadJobSelect();

    }

    startApplication();
});
