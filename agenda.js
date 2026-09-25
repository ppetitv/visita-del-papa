const agendaTabs = document.querySelectorAll('[data-agenda-tab]');
const agendaDays = document.querySelectorAll('[data-agenda-day]');

const setAgendaDay = (selectedDay) => {
  agendaTabs.forEach((tab) => {
    const isActive = tab.dataset.agendaTab === selectedDay;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  agendaDays.forEach((day) => {
    const shouldShow = selectedDay === 'all' || day.dataset.agendaDay === selectedDay;
    day.hidden = !shouldShow;
  });
};

agendaTabs.forEach((tab) => {
  tab.addEventListener('click', () => setAgendaDay(tab.dataset.agendaTab));

  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = [...agendaTabs].indexOf(tab);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? agendaTabs.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + agendaTabs.length) % agendaTabs.length;
    const nextTab = agendaTabs[nextIndex];
    nextTab.focus();
    setAgendaDay(nextTab.dataset.agendaTab);
  });
});

setAgendaDay('all');
