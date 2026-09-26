const agendaDays = [...document.querySelectorAll('[data-agenda-day]')];
const agendaEvents = [...document.querySelectorAll('[data-event-id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isLocalPreview = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
const framedPreview = (() => {
  try { return window.frameElement?.getAttribute('name') === 'rpp-agenda-live-preview'; }
  catch { return false; }
})();
const previewLive = isLocalPreview && (
  new URLSearchParams(window.location.search).get('vista') === 'en-vivo'
  || window.name === 'rpp-agenda-live-preview'
  || framedPreview
);

// Solo la mesa editorial actualiza estos datos tras verificar la cobertura.
// Las horas programadas y la posición del scroll nunca confirman una actividad.
const editorialStatuses = Object.freeze({
  // 'llegada-callao': 'live' | 'completed' | 'rescheduled',
});
const editorialLiveFeeds = Object.freeze({
  // 'llegada-callao': { type: 'embed' | 'link', url: 'https://...', label: 'Ver transmisión' },
});
const editorialRecaps = Object.freeze({
  // '1': { title: 'Lo que dejó la jornada', summary: '...', photos: [{ src: 'assets/...', alt: '...' }] },
});
const previewStatuses = Object.freeze({
  'llegada-callao': 'completed',
  'bienvenida-palacio': 'completed',
  'visita-presidencia': 'completed',
  'encuentro-autoridades': 'completed',
  'obispos-peru': 'completed',
  'hora-media': 'completed',
  'desafios-futuro': 'completed',
  'vigilia-jovenes': 'completed',
  'misa-pimentel': 'live',
});
const previewRecaps = Object.freeze({
  '1': {
    title: 'Resumen editorial de muestra',
    summary: 'En esta sección aparecerán los hechos confirmados y las fotografías publicadas por RPP al cerrar la jornada.',
    photos: [],
  },
  '2': {
    title: 'Resumen editorial de muestra',
    summary: 'Al finalizar la jornada, RPP podrá condensar aquí sus momentos clave y añadir una galería verificada.',
    photos: [],
  },
});

const limaDateTime = (date, time) => {
  const match = time.match(/^(\d{1,2}):(\d{2})(am|pm)$/i);
  if (!match) return null;
  const hour = (Number(match[1]) % 12) + (match[3].toLowerCase() === 'pm' ? 12 : 0);
  return new Date(`${date}T${String(hour).padStart(2, '0')}:${match[2]}:00-05:00`);
};

const events = agendaEvents.map((element) => {
  const day = element.closest('[data-agenda-day]');
  return {
    element, day,
    id: element.dataset.eventId,
    date: limaDateTime(day.dataset.date, element.querySelector('time').textContent.trim()),
    title: element.querySelector('h4').textContent.trim(),
    place: element.querySelector('p').textContent.trim(),
    city: day.querySelector('h3').textContent.trim().replace(/\s*\/\s*/, ' · '),
    status: previewLive
      ? previewStatuses[element.dataset.eventId] || 'scheduled'
      : editorialStatuses[element.dataset.eventId] || 'scheduled',
  };
});

const statusLabels = { live: previewLive ? 'En vivo · simulación' : 'En vivo · cobertura confirmada', completed: 'Finalizado', rescheduled: 'Reprogramado' };
const now = new Date();
const completedCount = events.filter((event) => event.status === 'completed').length;
const liveEvent = events.find((event) => event.status === 'live');
const nextEvent = events.find((event) => event.status === 'scheduled' && event.date && event.date >= now);
const focusEvent = liveEvent || nextEvent || [...events].reverse().find((event) => event.status === 'scheduled') || events.at(-1);

events.forEach((event) => {
  event.element.dataset.status = event.status;
  if (event === focusEvent) event.element.classList.add('is-next');
  const label = statusLabels[event.status] || (event === nextEvent ? 'Siguiente en agenda' : null);
  if (!label) return;
  const badge = document.createElement('span');
  badge.className = 'agenda-event__status';
  badge.textContent = label;
  event.element.querySelector('h4').after(badge);
});

const safeCoverageUrl = (value) => {
  try {
    const url = new URL(value);
    const hosts = ['rpp.pe', 'rpp-noticias.io', 'youtube.com', 'youtube-nocookie.com'];
    return url.protocol === 'https:' && hosts.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`)) ? url.href : null;
  } catch { return null; }
};

const addLiveCoverage = (day, event) => {
  const feed = editorialLiveFeeds[event.id];
  const panel = document.createElement('aside');
  panel.className = 'agenda-day__live';
  panel.setAttribute('aria-label', 'Cobertura en vivo');
  const kicker = document.createElement('span');
  kicker.className = 'agenda-day__live-kicker';
  kicker.textContent = previewLive ? 'Vista previa · En vivo' : 'Cobertura confirmada · En vivo';
  const heading = document.createElement('h4');
  heading.textContent = event.title;
  panel.append(kicker, heading);
  if (previewLive) {
    const stage = document.createElement('div');
    stage.className = 'agenda-day__live-stage';
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Simulación del espacio reservado para la transmisión en vivo de RPP');
    const station = document.createElement('span');
    station.className = 'agenda-day__live-station';
    station.textContent = 'RPP Noticias · Señal en directo';
    const message = document.createElement('strong');
    message.textContent = 'La transmisión se verá aquí';
    const disclaimer = document.createElement('small');
    disclaimer.textContent = 'Vista previa de diseño · No es una señal real';
    stage.append(station, message, disclaimer);
    panel.append(stage);
    day.querySelector('.agenda-day__events').prepend(panel);
    return;
  }
  const url = feed && safeCoverageUrl(feed.url);
  const embedPath = url && /\/(embed|player)\b/i.test(new URL(url).pathname);
  if (embedPath && feed.type === 'embed') {
    const frame = document.createElement('iframe');
    frame.src = url;
    frame.title = `Transmisión en vivo: ${event.title}`;
    frame.loading = 'lazy';
    frame.allow = 'encrypted-media; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    panel.append(frame);
  } else if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = feed.label || (feed.type === 'embed' ? 'Abrir transmisión' : 'Seguir el minuto a minuto en RPP');
    panel.append(link);
  } else {
    const message = document.createElement('p');
    message.textContent = 'RPP confirmó esta actividad. El enlace a la transmisión o al minuto a minuto aún no está publicado.';
    panel.append(message);
  }
  day.querySelector('.agenda-day__events').prepend(panel);
};

const addCompletedRecap = (day) => {
  const recap = previewLive ? previewRecaps[day.dataset.agendaDay] : editorialRecaps[day.dataset.agendaDay];
  const details = document.createElement('details');
  details.className = 'agenda-day__history';
  const summary = document.createElement('summary');
  summary.textContent = recap
    ? (recap.photos?.length ? 'Ver resumen, fotos y actividades' : 'Ver resumen y actividades')
    : 'Ver actividades de la jornada finalizada';
  details.append(summary);
  if (recap) {
    const content = document.createElement('div');
    content.className = 'agenda-day__recap';
    const title = document.createElement('h4');
    title.textContent = recap.title;
    const description = document.createElement('p');
    description.textContent = recap.summary;
    content.append(title, description);
    if (Array.isArray(recap.photos)) {
      const gallery = document.createElement('div');
      gallery.className = 'agenda-day__gallery';
      recap.photos.forEach((photo) => {
        if (!photo.src || !photo.alt) return;
        const image = document.createElement('img');
        image.src = photo.src;
        image.alt = photo.alt;
        image.loading = 'lazy';
        gallery.append(image);
      });
      if (gallery.childElementCount) content.append(gallery);
    }
    details.append(content);
  }
  details.append(day.querySelector('.agenda-day__events'));
  day.append(details);
};

agendaDays.forEach((day) => {
  const dayEvents = events.filter((event) => event.day === day);
  const allCompleted = dayEvents.every((event) => event.status === 'completed');
  const dayLiveEvent = dayEvents.find((event) => event.status === 'live');
  const hasCompleted = dayEvents.some((event) => event.status === 'completed');
  const isNext = nextEvent && nextEvent.day === day;
  const lastDate = dayEvents.at(-1)?.date;
  const state = allCompleted ? 'completed' : dayLiveEvent ? 'live' : hasCompleted ? 'partial' : isNext ? 'next' : lastDate && lastDate < now ? 'unconfirmed' : 'scheduled';
  const label = {
    completed: 'Jornada finalizada', live: previewLive ? 'En vivo · simulación' : 'En vivo · cobertura confirmada', partial: 'Cobertura iniciada',
    next: 'Próxima jornada', unconfirmed: 'Cierre sin confirmar', scheduled: 'Programada',
  }[state];
  day.dataset.coverageState = state;
  day.querySelector('[data-day-status]').textContent = label;
  if (dayLiveEvent) addLiveCoverage(day, dayLiveEvent);
  if (allCompleted) addCompletedRecap(day);
});

const progressSummary = document.querySelector('[data-coverage-progress]');
const completedCities = [...new Set(agendaDays
  .filter((day) => day.dataset.coverageState === 'completed')
  .map((day) => day.querySelector('h3').textContent.trim().replace(/\s*\/\s*/, ' · ')))];
if (liveEvent) {
  progressSummary.textContent = `${completedCities.length ? `${completedCities.join(' y ')}: cobertura finalizada · ` : ''}${liveEvent.city}: en vivo${previewLive ? ' (simulación)' : ''}`;
} else if (completedCities.length) {
  progressSummary.textContent = `${completedCities.join(' y ')}: cobertura finalizada · No hay actividad en vivo confirmada`;
} else {
  progressSummary.textContent = `Sin jornadas cerradas · Próxima cita en ${nextEvent?.city || 'la agenda oficial'}`;
}

const statusSection = document.querySelector('.journey-status');
const phase = document.querySelector('[data-journey-phase]');
const title = document.querySelector('[data-journey-title]');
const detail = document.querySelector('[data-journey-detail]');
const dateDay = document.querySelector('[data-journey-day]');
const dateMonth = document.querySelector('[data-journey-month]');
const position = document.querySelector('[data-journey-position]');
const jump = document.querySelector('[data-journey-jump]');
const jumpLabel = document.querySelector('[data-journey-jump-label]');

if (isLocalPreview && window.parent === window) {
  document.body.classList.toggle('is-live-preview', previewLive);
  const notice = document.createElement('div');
  notice.className = 'agenda-preview-note';
  const note = document.createElement('span');
  note.textContent = previewLive
    ? 'Simulación editorial · Esta vista no muestra una transmisión real'
    : 'Vista de trabajo · Prueba el estado de cobertura en vivo';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.textContent = previewLive ? 'Volver a la agenda real' : 'Simular en vivo';
  toggle.addEventListener('click', () => {
    window.name = previewLive ? '' : 'rpp-agenda-live-preview';
    if (previewLive && window.location.search) window.location.replace('agenda.html');
    else window.location.reload();
  });
  notice.append(note, toggle);
  statusSection.prepend(notice);
}

if (focusEvent) {
  position.textContent = focusEvent.city;
  title.textContent = focusEvent.title;
  if (focusEvent.date) {
    dateDay.textContent = new Intl.DateTimeFormat('es-PE', { day: '2-digit', timeZone: 'America/Lima' }).format(focusEvent.date);
    dateMonth.textContent = new Intl.DateTimeFormat('es-PE', { month: 'short', timeZone: 'America/Lima' }).format(focusEvent.date).replace('.', '').toUpperCase();
  }
  const date = focusEvent.date
    ? new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'America/Lima' }).format(focusEvent.date).replace(',', '') : '';
  const time = focusEvent.element.querySelector('time').textContent.trim().replace('am', ' a. m.').replace('pm', ' p. m.');
  detail.textContent = `${date} · ${time} · ${focusEvent.place} · ${focusEvent.city}`;
  jumpLabel.textContent = focusEvent.status === 'live'
    ? 'Ver cobertura en vivo'
    : `Ver las ${events.filter((event) => event.day === focusEvent.day).length} actividades`;
}
if (liveEvent) {
  statusSection.dataset.state = 'live';
  phase.textContent = previewLive ? 'Simulación · En vivo ahora' : 'En vivo ahora';
} else if (nextEvent) {
  phase.textContent = 'Próxima cita en la agenda';
} else if (completedCount === events.length) {
  phase.textContent = 'Última cita · cierre verificado';
} else {
  phase.textContent = 'Última cita prevista · cierre sin confirmar';
}

jump.addEventListener('click', () => {
  if (!focusEvent) return;
  const history = focusEvent.element.closest('details');
  if (history) history.open = true;
  const target = focusEvent.status === 'live'
    ? focusEvent.day.querySelector('.agenda-day__live') || focusEvent.element
    : focusEvent.element;
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'center' });
});

// El trazo representa únicamente estados editoriales verificados, nunca el scroll.
const rail = document.querySelector('.agenda-days__rail');
const story = document.querySelector('.agenda-days');
let pendingFrame = false;
const updateJourneyProgress = () => {
  pendingFrame = false;
  if (!rail || !story) return;
  const height = Math.max(1, rail.getBoundingClientRect().height);
  const targetDay = liveEvent?.day || nextEvent?.day || focusEvent?.day;
  const offset = completedCount === events.length
    ? height
    : Math.max(0, Math.min(height, targetDay?.offsetTop || 0));
  story.dataset.journeyState = liveEvent ? 'live' : completedCount === events.length ? 'completed' : 'scheduled';
  story.style.setProperty('--journey-progress', (offset / height).toFixed(4));
  story.style.setProperty('--journey-offset', `${Math.round(offset)}px`);
};
const requestJourneyUpdate = () => {
  if (pendingFrame) return;
  pendingFrame = true;
  window.requestAnimationFrame(updateJourneyProgress);
};
window.addEventListener('resize', requestJourneyUpdate, { passive: true });
if ('ResizeObserver' in window) new ResizeObserver(requestJourneyUpdate).observe(story);
story.addEventListener('toggle', requestJourneyUpdate, true);
document.fonts?.ready.then(requestJourneyUpdate);
requestJourneyUpdate();

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  agendaDays.forEach((day) => observer.observe(day));
  document.body.classList.add('story-motion');
}
