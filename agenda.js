const agendaTabs = document.querySelectorAll('[data-agenda-tab]');
const agendaDays = document.querySelectorAll('[data-agenda-day]');

const setAgendaDay = (selectedDay) => {
  agendaTabs.forEach((tab) => {
    const isActive = tab.dataset.agendaTab === selectedDay;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  agendaDays.forEach((day) => {
    const shouldShow = selectedDay === 'all' || day.dataset.agendaDay === selectedDay;
    day.hidden = !shouldShow;
  });
};

agendaTabs.forEach((tab) => {
  tab.addEventListener('click', () => setAgendaDay(tab.dataset.agendaTab));
});

setAgendaDay('all');
