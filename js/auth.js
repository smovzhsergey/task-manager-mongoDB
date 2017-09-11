$(document).ready(function() {

    $('input').focus(function() {
        $(this).siblings('span.error').remove();
    });

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

        if (login !== '' && pass !== '') {
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/phonebook/collections/users?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ",
                type: "GET",
            }).done(function(data) {
                $.each(data, function(key, val) {
                    var db;
                    if (login == val.login) {
                        if (pass == val.pass) {
                            localStorage.setItem('db', val._id.$oid);
                            document.location.href = "taskmanager.html";
                        }
                    } else {
                        addErrorMesage($('#userName'), 'Bad Login or Pasword');
                    }
                });
            });
            //clear form
            $('#authForm')[0].reset();
        }

    });

    $('#confNewUserPass').on('blur', function() {
        var $this = $(this);
        var offsetX = $this.offset().left + 10;
        var offsetY = $this.offset().top + parseInt($this.css('height')) + 5;

        if ($this.val() != $('#newUserPass').val()) {
            $('span.error')
                .text('Pasword not correct')
                .css({
                    'top': offsetY,
                    'left': offsetX
                });

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
        .insertAfter(el)
        .text(message)
        .css({
            'top': top,
            'left': left
        });
}