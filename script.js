$(function () {

    const jobSelect = '#jobSelect';
    const klassenSelect = '#klassenSelect';

    function addListeners() {
        $(jobSelect).on('change', function () {
            loadKlassenSelect();
            setLocalstorageJobId($("#jobSelect :selected").val());
        })

        $(klassenSelect).on('change', function () {
            setLocalstorageKlassenId($("#klassenSelect :selected").val());
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
            });
    }

    function loadKlassenSelect() {
        $(klassenSelect).show();
        var valueID = $("#jobSelect :selected").val();
        $.getJSON('https://sandbox.gibm.ch/klassen.php?beruf_id=' + valueID)
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
            });

    }

    function init() {
        $(klassenSelect).hide();

        addListeners();
        loadJobSelect();
    }

    init();
});
