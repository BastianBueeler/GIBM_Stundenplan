$(function () {

    const jobSelect = '#jobSelect';
    const klassenSelect = '#klassenSelect';


    function hideElements() {
        $(klassenSelect).hide();

    }

    function addListeners() {
        $(jobSelect).on('change', function () {

        })
    }

    function loadJobSelect() {
        $.getJSON('https://sandbox.gibm.ch/berufe.php')
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

    function init() {
        hideElements();
        addListeners();

        loadJobSelect();
    }

    init();
});
