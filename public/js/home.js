async function loadHome() {
  const grid = document.getElementById('featuredGrid');
  try {
    const events = await apiGet('/api/events');

    const eventCount = String(events.length).padStart(2, '0');
    const formatCount = String(new Set(events.map(function (e) { return e.cat; })).size).padStart(2, '0');
    document.getElementById('heroMetrics').innerHTML = `
      <div class="metric"><strong>${eventCount}</strong><span>Curated events</span></div>
      <div class="metric"><strong>${formatCount}+</strong><span>Event formats</span></div>
      <div class="metric"><strong>∞</strong><span>New connections</span></div>`;

    const first = events[0];
    if (first) {
      document.getElementById('heroFeatured').innerHTML = `
        <div class="mini-label">Featured · ${monthName(first.date)} ${parseDate(first.date).getDate()}</div>
        <div class="mini-title">${first.title}</div>
        <div class="mini-sub">Ideas that scale beyond the cloud.</div>
        <div style="margin-top:10px"><span class="mini-pill">${first.seatsLeft} seats left</span></div>`;
    }

    grid.innerHTML = events.slice(0, 3).map(eventCard).join('');
  } catch (err) {
    grid.innerHTML = '<div class="empty">Could not load events. Please make sure the server is running.</div>';
  }
}

loadHome();
