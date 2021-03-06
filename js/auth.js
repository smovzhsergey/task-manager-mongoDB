$(document).ready(function() {

    userAgent();

    var loader = $('.loaderWrap');
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

        loader.removeClass('hide');

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
                            loader.addClass('hide');
                        }
                    }
                });
                if (serverResponse == false) {
                    loader.addClass('hide');
                    addErrorMesage($('#userName'), 'Bad Login or Pasword');
                }
            });

            $('#authForm input').focus(function() {
                removeErrorMesage($(this));
                $(this).removeClass('errorValue');
            });
        }
    });

    // check username
    $('#newUserName').on('blur', function() {
        var $this = $(this);
        if ($this.val() !== '') {
            loader.removeClass('hide');
            $.ajax({
                url: "https://api.mlab.com/api/1/databases/phonebook/collections/users?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ",
                type: "GET",
            }).done(function(data) {

                $.each(data, function(key, val) {

                    if ($this.val() == val.login) {
                        addErrorMesage($this, 'This user name is already taken. Please use different one.');
                    }
                });
                loader.addClass('hide');
            });
        }
    });

    $('#newUserName').focus(function() {
        removeErrorMesage($(this));
        $(this).removeClass('errorValue');
    });

    $('#confNewUserPass').on('blur', function() {
        var $this = $(this);

        if ($this.val() != $('#newUserPass').val()) {
            if (!$this.hasClass('errorValue'))
                addErrorMesage($this, 'Pasword not correct');
        } else {
            removeErrorMesage($this);
            $this.removeClass('errorValue');
        }
    });



    $('#newUserForm').on('submit', function(e) {
        e.preventDefault();
        var newUserLogin = $('#newUserName').val();
        var newUserPass = $('#newUserPass').val();
        var confNewUserPass = $('#confNewUserPass').val();

        if (newUserLogin !== '' && newUserPass !== '' && newUserPass == confNewUserPass && !$('#newUserName').hasClass('errorValue')) {
            loader.removeClass('hide');

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
                    $('#newUserForm')[0].reset();
                    loader.addClass('hide');
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
        }
    });
});

function addErrorMesage(el, message) {
    var left = el.offset().left + 10;
    var top = el.offset().top + parseInt(el.css('height')) + 5;
    $('<span class = "error"></span>')
        .insertAfter(el)
        .text(message)
        .css({
            'top': top,
            'left': left
        });

    el.addClass('errorValue');
}

function removeErrorMesage(el) {
    el.next('span.error').remove();
}

// check user browser
function userAgent() {
    var browser = navigator.userAgent;

    if (browser.search(/Firefox/) > -1 || browser.search(/MSIE/) > -1 || browser.search(/Trident/) > -1) {

        $('body').prepend('<p class = "wrongBrows">Sorry, but the application is working correctly (temporarily) in Chrome and Opera... </p>');
    }
}