$(document).ready(function() {
    var task = $('#taskName');
    var deadline = $('#deadline');
    var submit = $('#submit');

    // min start date for input[date]
    $('input[type = date]').attr('min', getDate);

    // output task list
    getTask();

    // add task
    $('#form').on('submit', function(e) {
        e.preventDefault();
        var url = "https://api.mlab.com/api/1/databases/phonebook/collections/task?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ";
        var taskVal = task.val();
        var deadlineVal = deadline.val();
        var type = "POST";
        var done = false;

        if (taskVal !== '' && deadlineVal !== '') { // check form

            //refresh server data
            updateTask(url, type, taskVal, deadlineVal, done);

            //clear form
            $('#taskName').val('');
            $('#deadline').val('');
        }

    });

    // edit taskName and deadline editbutton
    $('body').on('click', '.editLink', function(e) {
        e.preventDefault();
        var $this = $(this);
        var done = $this.siblings().filter('.taskDone').data('done');
        var inptDeadline = $this.parent().siblings().filter('.deadlineRend');
        var valDeadline = inptDeadline.data('deadline');
        var inpt = $this.siblings().filter('.taskRend');
        var id = $(this).data('id');
        var urlId = "https://api.mlab.com/api/1/databases/phonebook/collections/task/" + id + "?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ";
        var type = "PUT";
        var save = $(this).next();

        if (!done) {

            $this
                .addClass('hide')
                .next()
                .removeClass('hide');

            inptDeadline
                .attr('type', 'date')
                .attr('min', getDate)
                .prev()
                .addClass('hide');

            inpt
                .val('')
                .removeAttr('disabled')
                .focus();


            /*$('.taskRend, .deadlineRend').keypress(function(event) {
                if (event.which == 13) {                   
                }
            });*/

            save.on('click', function() {

                if (inpt.val() == '')
                    inpt.val(inpt.attr('placeholder'));

                if (inptDeadline.val() !== '')
                    valDeadline = inptDeadline.val();

                inpt.attr('disabled', 'disabled');

                inptDeadline
                    .attr('disabled', 'disabled')
                    .attr('type', 'hidden')
                    .prev()
                    .removeClass('hide');
                //refresh server data
                updateTask(urlId, type, inpt.val(), valDeadline, done);
            });

        }
    });

    //delete task 
    $('body').on('click', '.deleteLink', function() {

        $(this).parents('.task').slideUp(100);
        var id = $(this).data('id');
        var urlId = "https://api.mlab.com/api/1/databases/phonebook/collections/task/" + id + "?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ";
        $.ajax({
            url: urlId,
            async: true,
            type: "DELETE",
            timeout: 300000,
        });
    });

    //edit task name doubleclick
    $('body').on('dblclick', '.taskRend', editDBLTaskName);

    //edit task status
    $('body').on('click', '.taskDone', editTaskStatus);

    // search task by name
    $('#search').on('keyup', function() {
        var srchVal = $(this).val().toLowerCase();
        var taskName = $('.taskRend');
        $.each(taskName, function(key, val) {
            $this = $(this);

            //$('.all').addClass('active').siblings().removeClass('hide');

            var pos = $this.val().toLowerCase().indexOf(srchVal);

            if (!$this.parents('task').hasClass('hide')) {
                if (srchVal !== "") {
                    if (pos == -1) {
                        $this.parents('.task').addClass('searchHide');
                    } else {
                        $this.parents('.task').removeClass('searchHide');
                    }
                } else {
                    $this.parents('.task').removeClass('searchHide');
                }
            }

        });
    });

    //filter task
    $('body').on('click', '.filter', function() {
        var $this = $(this);
        var done = $('.done');
        var notDone = $('.notDone');
        var all = $('.all');
        var makeToday = $('.today');
        var expired = $('.exp');
        var taskStatus = $('.taskRend');
        var task = $('.task');

        if (!$this.hasClass('active')) {
            $this
                .addClass('active')
                .siblings()
                .removeClass('active');
        }
        // view done tasks
        if (done.hasClass('active')) {
            $.each(taskStatus, function(key, val) {
                $this = $(this);

                if (!$this.hasClass('done')) {
                    $this.parents('.task').addClass('hide');
                } else {
                    $this.parents('.task').removeClass('hide');
                }

            });
        }
        // view undone tasks
        if (notDone.hasClass('active')) {
            $.each(taskStatus, function(key, val) {
                $this = $(this);

                if ($this.hasClass('done')) {
                    $this.parents('.task').addClass('hide');
                } else {
                    $this.parents('.task').removeClass('hide');
                }
            });
        }
        // view undone expired tasks
        if (expired.hasClass('active')) {
            $.each(task, function(key, val) {
                $this = $(this);

                if (!$this.hasClass('expired')) {
                    $this.addClass('hide');
                } else {
                    $this.removeClass('hide');
                }
            });
        }
        // view undone today tasks
        if (makeToday.hasClass('active')) {
            $.each(task, function(key, val) {
                $this = $(this);

                if (!$this.hasClass('mktoday')) {
                    $this.addClass('hide');
                } else {
                    $this.removeClass('hide');
                }
            });
        }

        if (all.hasClass('active')) {
            $.each(taskStatus, function(key, val) {
                $this = $(this);
                $this.parents('.task').siblings().removeClass('hide');

            });
        }
    });

});

function getTask() {
    $.ajax({
        url: "https://api.mlab.com/api/1/databases/phonebook/collections/task?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ",
        type: "GET"
    }).done(function(data) {
        var task = '';
        data = data.reverse();
        $.each(data, function(key, val) {

            if (expirationDate(val.deadline) < 0 && !val.done)
                task += '<div class="task expired">';
            else if (expirationDate(val.deadline) == 0 && !val.done)
                task += '<div class="task mktoday">';
            else
                task += '<div class="task">';

            task += '<div class="taskView">';

            if (val.done) {
                task += '<input type = "checkbox" checked class = "taskDone" data-done = "' + val.done + '">';
                task += '<input type = "text" class = "taskRend done" disabled value="' + val.name + '" placeholder = "' + val.name + '">';
            } else {
                task += '<input type = "checkbox" class = "taskDone" data-done = "' + val.done + '">';
                task += '<input type = "text" class = "taskRend" disabled value="' + val.name + '" placeholder = "' + val.name + '">';
            }

            task += '<span class = "editLink fa fa-pencil-square-o fa-2x" aria-hidden="true" data-id = "' + val._id.$oid + '"></span>';
            task += '<span class = "hide saveLink fa fa-floppy-o fa-2x" aria-hidden="true"></span>';
            task += '<span class = "deleteLink fa fa-times fa-2x" aria-hidden="true" data-id = "' + val._id.$oid + '"></span>';
            task += '</div>';

            if (!val.done) {
                if (expirationDate(val.deadline) >= 0)
                    task += '<span class="timeEnd" data-deadline = "' + val.deadline + '"><i class="fa fa-clock-o" aria-hidden="true"></i>' + val.deadline + '</span>';
                else
                    task += '<span class="timeEnd red" data-deadline = "' + val.deadline + '"><i class="fa fa-clock-o" aria-hidden="true"></i>' + val.deadline + '</span>';
            } else {
                task += '<span class="timeEnd" data-deadline = "' + val.deadline + '"><i class="fa fa-clock-o" aria-hidden="true"></i>' + val.deadline + '</span>';
            }

            task += '<input type="hidden" name="" class="deadlineRend" value = "' + val.deadline + '" >';
            if (!val.done) {
                if (expirationDate(val.deadline) < 0)
                    task += '<span class="timeLeft red" >The task is overdue</span>';
                else if (expirationDate(val.deadline) == 0)
                    task += '<span class="timeLeft makeToday" >Make today!!!</span>';
                else if (expirationDate(val.deadline) > 0)
                    task += '<span class="timeLeft" >Days left: ' + expirationDate(val.deadline) + '</span>';
            } else {
                task += '<span class="timeLeft" >Task done</span>';
            }
            task += '</div>'
        });

        if (task == "") {
            task = '<h2>Nothing to do )))</h2>'
        }

        $('.taskBook').html(task);

    });
}

function getDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = "" + (date.getMonth() + 1);
    var day = date.getDate() + "";
    month = (month.length < 2) ? '0' + month : month;
    day = (day.length < 2) ? '0' + day : day;

    return year + '-' + month + '-' + day;
}

function editDBLTaskName() {
    var $this = $(this);
    var done = $this.siblings().filter('.taskDone').data('done');
    var valDate = $this.parent().siblings().filter('.timeEnd').data('deadline');
    var id = $this.siblings().filter('.editLink').data('id');
    var urlId = "https://api.mlab.com/api/1/databases/phonebook/collections/task/" + id + "?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ";
    var type = "PUT";

    if (!done) {
        $this
            .val('')
            .removeAttr('disabled')
            .focus();

        $('*').on('click', function() {
            $this
                .val($this.attr('placeholder'))
                .attr('disabled', 'disabled');
        });

        $this.keypress(function(event) {

            if (event.which == 13) {

                if ($this.val() == '')
                    $this.val($this.attr('placeholder'));

                $this.attr('disabled', 'disabled');
                //refresh server data
                updateTask(urlId, type, $this.val(), valDate, done);
            }
        });
    }
}

function editTaskStatus() {
    var $this = $(this);
    var valDate = $this.parent().siblings().filter('.timeEnd').data('deadline');
    var id = $this.siblings().filter('.editLink').data('id');
    var urlId = "https://api.mlab.com/api/1/databases/phonebook/collections/task/" + id + "?apiKey=qk_MeyFtWmpiezNlUJb-fQGGcvA3lBqJ";
    var inpt = $this.siblings().filter('.taskRend').attr('placeholder');
    var type = "PUT";
    var done;

    $this.attr('disabled', 'disabled');

    if ($this.data('done'))
        done = false;
    else
        done = true;
    //refresh server data
    updateTask(urlId, type, inpt, valDate, done);
}


function updateTask(url, type, taskName, deadline, status) {

    $.ajax({
        url: url,
        data: JSON.stringify({
            "name": taskName,
            "deadline": deadline,
            "startDate": getDate(),
            "done": status,
        }),
        async: true,
        type: type,
        contentType: "application/json",
        success: function(data) {
            getTask();
            //refresh task list
        },
        error: function(xhr, status, err) {
            console.log(err);
        }
    });
}

function expirationDate(deadline) {

    var dateNow = Math.ceil(Date.parse(Date()) / (1000 * 3600 * 24));
    var deadl = Date.parse(deadline) / (1000 * 3600 * 24) + 1;
    var res = deadl - dateNow;

    return res;
}