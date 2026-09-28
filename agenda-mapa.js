(() => {
  // Editorially verified states only. Scheduled times never complete an activity automatically.
  const confirmedStatuses = Object.freeze({});
  const simulationStatuses = Object.freeze({
    'llegada-callao': 'completed', 'bienvenida-palacio': 'completed',
    'visita-presidencia': 'completed', 'encuentro-autoridades': 'completed',
    'obispos-peru': 'completed', 'hora-media': 'completed',
    'desafios-futuro': 'completed', 'vigilia-jovenes': 'completed',
    'misa-pimentel': 'live',
  });
  const preview = new URLSearchParams(location.search).get('vista') === 'en-vivo';
  const statuses = preview ? simulationStatuses : confirmedStatuses;
  const event = (id, time, iso, title, place) => ({ id, time, iso, title, place });
  const days = [
    {
      id: 1, date: 'Miércoles 11 de noviembre', short: 'Mié 11 nov', city: 'Lima', markers: ['lima'],
      mapCaption: 'Lima · 11 de noviembre',
      events: [
        event('llegada-callao', '5:30 p. m.', '2026-11-11T17:30-05:00', 'Llegada y Bienvenida Oficial', 'Base Aérea del Callao'),
        event('bienvenida-palacio', '6:15 p. m.', '2026-11-11T18:15-05:00', 'Ceremonia de Bienvenida en el Palacio de Gobierno', 'Palacio de Gobierno, Lima'),
        event('visita-presidencia', '6:45 p. m.', '2026-11-11T18:45-05:00', 'Visita a la Presidente de la República', 'Palacio de Gobierno'),
        event('encuentro-autoridades', '7:45 p. m.', '2026-11-11T19:45-05:00', 'Encuentro con las Autoridades, la Sociedad Civil y el Cuerpo Diplomático', 'Gran Teatro Nacional'),
      ],
    },
    {
      id: 2, date: 'Jueves 12 de noviembre', short: 'Jue 12 nov', city: 'Lima', markers: ['lima'],
      mapCaption: 'Lima · 12 de noviembre',
      events: [
        event('obispos-peru', '9:30 a. m.', '2026-11-12T09:30-05:00', 'Encuentro con los Obispos del Perú', 'Capilla del Palacio Arzobispal de Lima'),
        event('hora-media', '10:20 a. m.', '2026-11-12T10:20-05:00', 'Celebración de la Hora Media', 'Basílica Catedral de San Juan Apóstol y Evangelista'),
        event('desafios-futuro', '11:30 a. m.', '2026-11-12T11:30-05:00', 'Encuentro sobre los Desafíos y las Esperanzas para el Futuro del Pueblo Peruano', 'Plaza Frente a la Catedral'),
        event('vigilia-jovenes', '6:00 p. m.', '2026-11-12T18:00-05:00', 'Vigilia de Oración con los Jóvenes y Universitarios', 'Estadio Monumental de Lima'),
      ],
    },
    {
      id: 3, date: 'Viernes 13 de noviembre', short: 'Vie 13 nov', city: 'Chiclayo', markers: ['chiclayo'],
      mapCaption: 'Chiclayo · 13 de noviembre',
      events: [
        event('misa-pimentel', '10:30 a. m.', '2026-11-13T10:30-05:00', 'Santa Misa', 'Explanada frente a las Pampas de Pimentel'),
        event('capilla-romero', '12:40 p. m.', '2026-11-13T12:40-05:00', 'Visita privada a la capilla San Óscar A. Romero', 'Capilla San Óscar A. Romero'),
        event('encuentro-clero', '4:30 p. m.', '2026-11-13T16:30-05:00', 'Encuentro con Obispos, Sacerdotes, Religiosos y Religiosas', 'Santuario de Nuestra Señora de la Paz'),
        event('mundo-universitario', '5:45 p. m.', '2026-11-13T17:45-05:00', 'Encuentro con el Mundo Universitario', 'Universidad Católica Santo Toribio de Mogrovejo'),
      ],
    },
    {
      id: 4, date: 'Sábado 14 de noviembre', short: 'Sáb 14 nov', city: 'Chiclayo y Succhabamba', markers: ['chiclayo'],
      mapCaption: 'Chiclayo y Succhabamba · 14 de noviembre',
      events: [
        event('coronacion-virgen', '8:00 a. m.', '2026-11-14T08:00-05:00', 'Rito de Coronación de la Virgen Inmaculada', 'Catedral de Santa María'),
        event('misa-succhabamba', '11:00 a. m.', '2026-11-14T11:00-05:00', 'Santa Misa', 'Explanada de Santa Cruz de Succhabamba'),
        event('oracion-santuario', '5:30 p. m.', '2026-11-14T17:30-05:00', 'Encuentro de Oración con la Comunidad Católica', 'Santuario de Santo Toribio de Mogrovejo'),
      ],
    },
    {
      id: 5, date: 'Domingo 15 de noviembre', short: 'Dom 15 nov', city: 'Cusco y Pucallpa', markers: ['cusco', 'pucallpa'],
      mapCaption: 'Cusco y Pucallpa · 15 de noviembre',
      events: [
        event('fieles-cusco', '10:30 a. m.', '2026-11-15T10:30-05:00', 'Encuentro con los Fieles y Representantes de la Piedad Popular', 'Parque Arqueológico de Saqsaywaman, Cusco'),
        event('angelus-cusco', '11:45 a. m.', '2026-11-15T11:45-05:00', 'Rezo del Ángelus con la Comunidad Católica', 'Plaza frente a la Basílica Catedral, Cusco'),
        event('pueblos-amazonicos', '3:00 p. m.', '2026-11-15T15:00-05:00', 'Encuentro con Misioneros y Representantes de los Pueblos Amazónicos', 'Malecón Puerto Callao, Pucallpa'),
        event('misa-ucayali', '4:45 p. m.', '2026-11-15T16:45-05:00', 'Santa Misa', 'Villa Deportiva Regional Ucayali, Pucallpa'),
      ],
    },
    {
      id: 6, date: 'Lunes 16 de noviembre', short: 'Lun 16 nov', city: 'Lima', markers: ['lima'],
      mapCaption: 'Lima · 16 de noviembre',
      events: [
        event('casa-acogida', '8:30 a. m.', '2026-11-16T08:30-05:00', 'Visita a la Casa de Acogida de las Hermanitas de los Ancianos Desamparados', 'Lima'),
        event('misa-las-palmas', '10:30 a. m.', '2026-11-16T10:30-05:00', 'Santa Misa', 'Base Aérea Las Palmas'),
        event('despedida-callao', '1:15 p. m.', '2026-11-16T13:15-05:00', 'Ceremonia de Despedida', 'Base Aérea del Callao'),
      ],
    },
  ];

  const allEvents = days.flatMap((day) => day.events.map((item) => ({ ...item, day })));
  const completedCount = allEvents.filter((item) => statuses[item.id] === 'completed').length;
  const liveEvent = allEvents.find((item) => statuses[item.id] === 'live');
  const nextEvent = allEvents.find((item) => !statuses[item.id]);
  const focusEvent = liveEvent || nextEvent || allEvents.at(-1);
  const percent = Math.round((completedCount / allEvents.length) * 100);
  const select = (selector) => document.querySelector(selector);
  const setText = (selector, value) => { const element = select(selector); if (element) element.textContent = value; };

  setText('[data-phase]', preview && liveEvent ? 'Vista de prueba · En vivo' : liveEvent ? 'En vivo' : completedCount === allEvents.length ? 'La visita terminó' : completedCount === 0 ? 'La visita comienza el 11 de noviembre' : 'Próxima actividad');
  setText('[data-focus-title]', focusEvent.title);
  setText('[data-focus-detail]', `${focusEvent.day.short} · ${focusEvent.time} · ${focusEvent.place}, ${focusEvent.day.city}`);
  setText('[data-completed-count]', completedCount);
  setText('[data-total-count]', allEvents.length);
  setText('[data-progress-percent]', `${percent} %`);
  const progressFill = select('[data-progress-fill]');
  progressFill.style.transform = `scaleX(${percent / 100})`;
  requestAnimationFrame(() => progressFill.classList.add('is-ready'));
  select('[data-progress-bar]').setAttribute('aria-valuemax', String(allEvents.length));
  select('[data-progress-bar]').setAttribute('aria-valuenow', String(completedCount));
  select('[data-progress-bar]').setAttribute('aria-valuetext', `${completedCount} de ${allEvents.length} actividades realizadas`);
  select('[data-status-section]').classList.toggle('is-live', Boolean(liveEvent));
  if (preview) select('[data-demo-note]').hidden = false;

  for (const day of days) {
    const control = select(`[data-select-day="${day.id}"]`);
    const finished = day.events.every((item) => statuses[item.id] === 'completed');
    const live = day.events.some((item) => statuses[item.id] === 'live');
    control.classList.toggle('is-completed', finished);
    control.classList.toggle('is-live', live);
    control.querySelector('.journey__state').textContent = finished ? 'Finalizada' : live ? 'En vivo' : '';
  }

  const eventList = select('[data-event-list]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let selectedDay = null;
  const animateUpdatedText = (element) => {
    if (reducedMotion.matches || !element.animate) return;
    element.animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 360, easing: 'cubic-bezier(.22, 1, .36, 1)' },
    );
  };
  const renderDay = (id, animate = true) => {
    const day = days.find((item) => item.id === id);
    if (!day || selectedDay === id) return;
    const shouldAnimate = animate && !reducedMotion.matches;
    selectedDay = id;
    setText('[data-day-date]', day.date);
    setText('[data-day-title]', day.city);
    setText('[data-day-intro]', `${day.events.length} actividades en ${day.city} para el ${day.date.toLowerCase()}.`);
    const caption = select('[data-map-caption]');
    caption.replaceChildren();
    const strong = document.createElement('strong');
    const [city, ...rest] = day.mapCaption.split(' · ');
    strong.textContent = city;
    caption.append(strong, document.createTextNode(rest.length ? ` · ${rest.join(' · ')}` : ''));
    if (shouldAnimate) {
      for (const selector of ['[data-day-date]', '[data-day-title]', '[data-day-intro]', '[data-map-caption]']) {
        animateUpdatedText(select(selector));
      }
    }
    document.querySelectorAll('[data-select-day]').forEach((button) => {
      const active = Number(button.dataset.selectDay) === id;
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const dayScroller = select('.journey__scroll');
    if (dayScroller.scrollWidth > dayScroller.clientWidth) {
      const activeDay = select(`[data-select-day="${id}"]`);
      const left = dayScroller.scrollLeft + activeDay.getBoundingClientRect().left - dayScroller.getBoundingClientRect().left - (dayScroller.clientWidth - activeDay.clientWidth) / 2;
      dayScroller.scrollTo({ left, behavior: shouldAnimate ? 'smooth' : 'auto' });
    }
    document.querySelectorAll('[data-map-city]').forEach((pin) => {
      pin.classList.toggle('is-selected', day.markers.includes(pin.dataset.mapCity));
    });
    const fragment = document.createDocumentFragment();
    day.events.forEach((item, index) => {
      const state = statuses[item.id] || 'scheduled';
      const row = document.createElement('li');
      row.className = `event-list__item${state === 'completed' ? ' is-completed' : ''}${state === 'live' ? ' is-live' : ''}${item.id === focusEvent.id && state === 'scheduled' ? ' is-next' : ''}${shouldAnimate ? ' is-entering' : ''}`;
      if (shouldAnimate) row.style.setProperty('--enter-delay', `${Math.min(index, 3) * 60}ms`);
      const time = document.createElement('time');
      time.dateTime = item.iso;
      time.textContent = item.time;
      const details = document.createElement('div');
      if (state === 'live' || item.id === focusEvent.id && state === 'scheduled') {
        const badge = document.createElement('span');
        badge.className = 'event-list__badge';
        badge.textContent = state === 'live' ? preview ? 'En vivo · vista de prueba' : 'En vivo' : 'Próxima actividad';
        details.append(badge);
      }
      const title = document.createElement('h3');
      title.textContent = item.title;
      const place = document.createElement('p');
      place.textContent = item.place;
      details.append(title, place);
      row.append(time, details);
      fragment.append(row);
    });
    eventList.replaceChildren(fragment);
  };

  select('[data-day-picker]').addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-day]');
    if (button) renderDay(Number(button.dataset.selectDay));
  });
  document.querySelectorAll('[data-map-day]').forEach((pin) => pin.addEventListener('click', (event) => {
    event.preventDefault();
    renderDay(Number(pin.dataset.mapDay));
    if (window.matchMedia('(max-width: 700px)').matches) select('#cronograma').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }));
  renderDay(preview && liveEvent ? liveEvent.day.id : 1, false);

  if (!reducedMotion.matches) {
    select('.intro').classList.add('is-motion-entering');
    select('.status').classList.add('is-motion-entering');
    const sections = document.querySelectorAll('.journey, .map-panel, .schedule-panel');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-motion-entering');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      sections.forEach((section) => observer.observe(section));
    } else {
      sections.forEach((section) => section.classList.add('is-motion-entering'));
    }
  }
})();
