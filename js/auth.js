$(document).ready(function() {

    $('.tabpanel>li').on('click', function() {
        var $this = $(this);
        if (!$this.hasClass('activeTab')) {
            $this
                .addClass('activeTab')
                .siblings()
                .removeClass('activeTab')
                .parent()
                .next()
                .children()
                .eq($this.index())
                .removeClass('hide')
                .siblings()
                .addClass('hide');
        }
    });

    $('#authForm').on('submit', function(e) {
        e.preventDefault();
        var login = $('#userName').val();
        var pass = $('#pass').val();
        var serverResponse = false;

        if (login !== '' && pass !== '') {
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/phonebook/collections/users?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ",
                type: "GET",
            }).done(function(data) {

                $.each(data, function(key, val) {

                    var db;
                    if (login == val.login) {
                        if (pass == val.pass) {
                            localStorage.setItem('userLogin', val.login);
                            localStorage.setItem('db', val._id.$oid);
                            document.location.href = "taskmanager.html";
                            serverResponse = true;
                            $('#authForm')[0].reset();
                        }
                    }
                });
                if (serverResponse == false)
                    addErrorMesage($('#userName'), 'Bad Login or Pasword');
            });

            $('#authForm input').focus(function() {
                $('span.error').text('');
            });

        }

    });

    $('#confNewUserPass').on('blur', function() {
        var $this = $(this);

        if ($this.val() != $('#newUserPass').val()) {
            addErrorMesage($this, 'Pasword not correct');
        } else {
            $('span.error').text('');
        }
    });

    $('#newUserForm').on('submit', function(e) {
        e.preventDefault();
        var newUserLogin = $('#newUserName').val();
        var newUserPass = $('#newUserPass').val();
        var confNewUserPass = $('#confNewUserPass').val();

        if (newUserLogin !== '' && newUserPass !== '' && newUserPass == confNewUserPass) {

            $.ajax({
                url: "https://api.mlab.com/api/1/databases/phonebook/collections/users?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ",
                data: JSON.stringify({
                    "login": newUserLogin,
                    "pass": newUserPass,
                }),
                async: true,
                type: 'POST',
                contentType: "application/json",
                success: function(data) {
                    localStorage.setItem('userLogin', data.login);
                    localStorage.setItem('db', data._id.$oid);
                    document.location.href = "taskmanager.html";
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });

            //clear form
            $('#newUserForm')[0].reset();
        }
    });
});

function addErrorMesage(el, message) {
    var left = el.offset().left + 10;
    var top = el.offset().top + parseInt(el.css('height')) + 5;
    $('span.error')
        .text('Pasword not correct')
        .css({
            'top': top,
            'left': left
        });
}