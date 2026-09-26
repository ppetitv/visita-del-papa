(() => {
  const totalStops = 6;
  const totalEvents = 22;
  const completedEvents = 8;
  const currentStop = 3;
  const progress = Math.round((completedEvents / totalEvents) * 100);
  const stopDetails = {
    1: { state: 'Jornada completada', title: 'Llegada y bienvenida oficial', detail: 'Lima · 11 de noviembre', next: 'Jornada cerrada' },
    2: { state: 'Jornada completada', title: 'Encuentros y vigilia', detail: 'Lima · 12 de noviembre', next: 'Jornada cerrada' },
    3: { state: 'Seguimiento en vivo', title: 'Santa Misa', detail: 'Chiclayo · Explanada frente a las Pampas de Pimentel', next: 'Siguiente: visita privada · 12:40 p. m.' },
    4: { state: 'Programada', title: 'Rito de Coronación de la Virgen Inmaculada', detail: 'Chiclayo · 14 de noviembre', next: 'Pendiente de cobertura' },
    5: { state: 'Programada', title: 'Encuentro con los fieles', detail: 'Cusco · Pucallpa · 15 de noviembre', next: 'Pendiente de cobertura' },
    6: { state: 'Programada', title: 'Ceremonia de despedida', detail: 'Lima · 16 de noviembre', next: 'Pendiente de cobertura' },
  };

  const shell = document.querySelector('.visit-widget__shell');
  const progressBar = document.querySelector('[data-widget-progress]');
  const progressTrack = document.querySelector('[role="progressbar"]');
  const stopList = document.querySelector('[data-widget-stops]');

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const update = (stop = currentStop) => {
    const detail = stopDetails[stop] || stopDetails[currentStop];
    setText('[data-widget-state]', detail.state);
    setText('[data-widget-title]', detail.title);
    setText('[data-widget-detail]', detail.detail);
    setText('[data-widget-next]', detail.next);
    setText('[data-widget-percent]', `${progress}%`);
    setText('[data-widget-completed]', completedEvents);
    setText('[data-widget-total]', totalEvents);
    progressBar?.style.setProperty('width', `${progress}%`);
    progressTrack?.setAttribute('aria-valuenow', String(progress));
    stopList?.style.setProperty('--route-progress', `${((stop - 1) / (totalStops - 1)) * 100}%`);
    shell?.classList.toggle('is-preview-stop', stop !== currentStop);
    document.querySelectorAll('.visit-widget__stop').forEach((item) => {
      const itemStop = Number(item.dataset.stop);
      item.classList.toggle('is-complete', itemStop < stop);
      item.classList.toggle('is-current', itemStop === stop);
      item.querySelector('button')?.setAttribute('aria-current', itemStop === stop ? 'step' : 'false');
    });
  };

  stopList?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const stop = Number(button.closest('[data-stop]')?.dataset.stop);
    if (stop) update(stop);
  });

  update();
})();
