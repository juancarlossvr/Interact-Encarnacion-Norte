document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('interactive-calendar');

    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            locale: 'es',
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            events: {
                url: '/data/eventos.json',
                failure: function() {
                    alert('Hubo un error al cargar los eventos del calendario.');
                }
            },
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            height: 'auto'
        });
        
        calendar.render();
    }
});