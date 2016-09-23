var Script = function () {


    /* initialize the external events
     -----------------------------------------------------------------*/

    $('#external-events div.external-event').each(function () {

        // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
        // it doesn't need to have a start or end
        var eventObject = {
            title: $.trim($(this).text()) // use the element's text as the event title
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });

    });


    /* initialize the calendar
     -----------------------------------------------------------------*/

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },
        editable: true,
        titleFormat: {
            month: 'MMMM yyyy', // September 2013
            week: "MMM d[ yyyy]{ '—'[ MMM] d yyyy}", // Sep 7 - 13 2013
            day: 'dddd, MMM d, yyyy' // Tuesday, Sep 8, 2013
        },

        buttonText: {
            prev: '?', // ?
            next: '?', // ?
            prevYear: '?', // ?
            nextYear: '?', // ?
            today: '今天',
            month: '月',
            week: '周',
            day: '天'
        },
        monthNamesShort:['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        dayNames:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],
        dayNamesShort:['星期一','星期二','星期三','星期四','星期五','星期六','星期日'],

        droppable: true, // this allows things to be dropped onto the calendar !!!
        drop: function (date, allDay) { // this function is called when something is dropped

            // retrieve the dropped element's stored Event Object
            var originalEventObject = $(this).data('eventObject');

            // we need to copy it, so that multiple events don't have a reference to the same object
            var copiedEventObject = $.extend({}, originalEventObject);

            // assign it the date that was reported
            copiedEventObject.start = date;
            copiedEventObject.allDay = allDay;

            // render the event on the calendar
            // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
            $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                $(this).remove();
            }

        },
        /*        events: function (start, end, timezone, callback) {
         var eventServer = [];
         var view = $('#calendar').fullCalendar('getView');
         var viewName = view.name;

         $.ajax({
         url: "/festival/api/get",
         dataType: 'json',
         success: function (doc) {
         for (var i = 0; i < doc.data.length; i++) {
         var obj = new Object();
         obj.title = doc.data[i].title;
         obj.start = doc.data[i].start;
         //obj.textColor=doc.data[i].textColor;
         obj.color = '#000';
         //alert(obj.textColor);
         $("#calendar").fullCalendar('renderEvent', obj, true);
         }
         }
         })
         },*/


        events: {
            url: '/festival/api/get',
            type: 'GET',
            error: function () {
                alert('there was an error while fetching events!');
            },
            /*         color: 'rad',   // a non-ajax option
             textColor: 'black' // a non-ajax option*/
        },
    })
}();