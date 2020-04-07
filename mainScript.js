$(function () {

    //Erstellen der Objekte in Variablen
    var jobSelect = '#jobSelect';
    var klassenSelect = '#klassenSelect';
    var wochenDisplay = '#wochenDisplay';
    var stundenplanContainer = '#stundenplanContainer';
    var buttonZurueck = '#buttonLinks';
    var buttonVorwaerts = '#buttonRechts';
    var informationsMeldung = '#informationsMeldung';
    var wochenAuswahl = '#wochenAuswahl';

    //Daten aus dem Localstorage laden
    var jobIdLocalstorage = getLocalstorageJobId();
    var klassenIdLocalstorage = getLocalstorageKlassenId()

    //Datumsobjekt erstellen und in Wochenformat umwandeln
    var datum = moment();
    var datumWoche = moment(datum).format('WW-GGGG');

    //Funktion mit allen ActionListener
    function addListeners() {
        $(jobSelect).on('change', function () {
            //Ueberpruefung auf Inhalt von Jobselect und danach loadKlassenSelect aufrufen, sowie Wert in Localstorage speichern.
            if ($("#jobSelect :selected").val() != "Wählen Sie Ihren Beruf") {
                loadKlassenSelect();
                doAnimation(klassenSelect);
                setLocalstorageJobId($("#jobSelect :selected").val());
            }
        })

        $(klassenSelect).on('change', function () {
            //Ueberpruefung auf Inhalt von Klassenselect und danach loadTable aufrufen, sowie Wert in Localstorage speichern.
            if ($("#klassenSelect :selected").val() != "Wählen Sie Ihren Beruf") {
                setLocalstorageKlassenId($("#klassenSelect :selected").val());
                loadTable();
            }
        })

        $(buttonZurueck).on('click', function () {
            //Vom Datum eine Woche abziehen, es neu in datumWoche abspeichern
            datum = moment(datum).subtract(1, 'w');
            datumWoche = moment(datum).format('WW-GGGG');

            //WochenDisplay aktualisieren und loadTable aufrufen
            $(wochenDisplay).text(moment(datum).format('WW-GGGG'));
            loadTable();
        })

        $(buttonVorwaerts).on('click', function () {
            //Zum Datum eine Woche addieren und es neu in datumWoche abspeichern
            datum = moment(datum).add(1, 'w');
            datumWoche = moment(datum).format('WW-GGGG');

            //WochenDisplay aktualisieren und loadTable aufrufen
            $(wochenDisplay).text(moment(datum).format('WW-GGGG'));
            loadTable();
        })
    }

    //Animiert das bekommene Element
    function doAnimation(element) {
        $(element).animate({
            opacity: '0.2'
        });
        $(element).animate({
            opacity: '1'
        });
    }

    function loadJobSelect() {
        //API Abfrage
        $.getJSON('https://sandbox.gibm.ch/berufe.php')
            //Bei Fehler eine Meldung ausgeben.
            .fail(function () {
                alert("Verbindung zum Server fehlgeschlagen!");
            })
            //Ansonsten die Daten in JobSelect abfuellen
            .done(function (data) {
                $(jobSelect)
                    .empty()
                    .append('<option value="0">Wählen Sie Ihren Beruf</option>');
                $.each(data, function (i, jobSelector) {
                    if (jobSelector.beruf_name != 1) {
                        $('<option value="' + jobSelector.beruf_id + '">' + jobSelector.beruf_name + '</option>').appendTo($(jobSelect));
                    }
                })
                //Falls schon Daten im LocalStorage sind, werden diese eingetragen
                if (jobIdLocalstorage != null) {
                    $(jobSelect + " option[value='" + jobIdLocalstorage + "']").attr("selected", 'true');
                    loadKlassenSelect();
                }
            });
    }

    function loadKlassenSelect() {
        //Abfrage des Inhalts des jobSelects
        if ($("#jobSelect :selected").val() == 0) {
            //verstecken der Elemente
            $(klassenSelect).hide();
            $(informationsMeldung).removeClass("d-flex");
            $(wochenAuswahl).removeClass("d-flex");
            $(informationsMeldung).hide();
            $(wochenAuswahl).hide();
            $(stundenplanContainer).empty();
        } else {
            $(klassenSelect).show();
            var jobID = $("#jobSelect :selected").val();
            //Anhand des Inhalts mit der API die Daten fürs KlassenSelect abfragen
            $.getJSON('https://sandbox.gibm.ch/klassen.php?beruf_id=' + jobID)
                //Bei Fehler, Meldung ausgeben
                .fail(function () {
                    alert("Verbindung zum Server fehlgeschlagen!");
                })
                //Ansonsten die Daten ins klassenSelect abfuellen.
                .done(function (data) {
                    $(klassenSelect)
                        .empty()
                        .append('<option value="0">Wählen Sie Ihre Klasse</option>')
                    $.each(data, function (i, klassenSelector) {
                        $('<option value="' + klassenSelector.klasse_id + '">' + klassenSelector.klasse_longname + '</option>').appendTo($(klassenSelect));
                    })
                    //Falls schon Daten im LocalStorage sind, werden diese eingetragen
                    if (klassenIdLocalstorage != null) {
                        $(klassenSelect + " option[value='" + klassenIdLocalstorage + "']").attr("selected", 'true');
                        loadTable();
                    }
                });
        }
    }

    function loadTable() {
        //Abfrage des Inhalts des klassenSelect
        if ($("#klassenSelect :selected").val() == 0) {
            //verstecken der Elemente
            $(informationsMeldung).removeClass("d-flex");
            $(wochenAuswahl).removeClass("d-flex");
            $(informationsMeldung).hide();
            $(wochenAuswahl).hide();
            $(stundenplanContainer).empty();
        } else {
            //anzeigen der richtigen Elemente
            $(wochenAuswahl).addClass("d-flex");
            $(wochenAuswahl).show();
            $(informationsMeldung).removeClass("d-flex");
            $(informationsMeldung).hide();
            var klassenID = $("#klassenSelect :selected").val();
            //API abfrage anhand von klassenID und datumWoche
            $.getJSON('http://sandbox.gibm.ch/tafel.php?klasse_id=' + klassenID + '&woche=' + datumWoche)
                //Bei Fehler wird meldung ausgegeben
                .fail(function () {
                    alert("Verbindung zum Server fehlgeschlagen!");
                })
                //Starten mit dem Aufbau der Tabelle
                .done(function (data) {
                    $(stundenplanContainer).empty();
                    //Wenn die Datenlänge nicht 0 ist wird die Tabelle aufgebaut, ansonsten wird eine Informationsmeldung angezeigt.
                    if (data.length != 0) {
                        //Header der Tabelle
                        $(stundenplanContainer).append(
                            '<thead><tr><th scope="col">Datum</th><th scope="col">Tag</th><th scope="col">Von</th><th scope="col">Bis</th><th scope="col">Lehrer</th><th scope="col">Fach</th><th scope="col">Raum</th></tr></thead>'
                        );
                        //Alle Eintraege durchlaufen und in Tabelle abfuellen
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
                        //Animation wird gemacht, damit eine Veraenderung klar ersichtlich ist
                        doAnimation(stundenplanContainer);
                    } else {
                        //Anzeigen der Information, falls keine Daten gefunden wurden
                        $(informationsMeldung).addClass("d-flex");
                        $(informationsMeldung).show();

                        //Animation wird gemacht, damit eine Veraenderung klar ersichtlich ist
                        doAnimation(informationsMeldung);
                    }
                });
        }
    }

    //Funktion zum Starten der ganzen Applikation
    function startApplication() {
        //Versteckt Elemente
        $(klassenSelect).hide();
        $(informationsMeldung).removeClass("d-flex");
        $(wochenAuswahl).removeClass("d-flex");
        $(informationsMeldung).hide();
        $(wochenAuswahl).hide();

        //Setzt aktuelles Datum aufs wochenDisplay
        $(wochenDisplay).text(datumWoche);

        //ruft die ersten Methoden auf
        addListeners();
        loadJobSelect();

    }

    //Methodenaufruf zum Starten der Applikation
    startApplication();
});
