function renderDetails(e) {
  const pct = Math.max(4, Math.round((e.reserved / e.total) * 100));
  const full = e.seatsLeft <= 0;
  const badge = full ? 'Full' : (e.seatsLeft < 15 ? 'Filling fast' : 'Open');

  return `
    <div class="detailslayout">
      <div>
        <div class="detailbanner tone-${e.tone}">
          <span class="tag">${e.cat}</span>
          <div class="articon">${e.icon}</div>
          <div style="position:relative;z-index:1">
            <div style="font-size:11px;color:#dcebdf;font-weight:750">${e.tag}</div>
            <h1>${e.title}</h1>
            <div style="font-size:12px;color:#e6f0e8">${dayName(e.date)}, ${fmtDate(e.date)} · ${e.time}</div>
          </div>
        </div>

        <div class="detailcontent">
          <h2>About this event</h2>
          <p>${e.desc}</p>

          <div class="detailfacts">
            <div class="fact"><div class="label">DATE &amp; TIME</div><strong>${dayName(e.date)}, ${fmtDate(e.date)} · ${e.time}</strong></div>
            <div class="fact"><div class="label">VENUE</div><strong>${e.venue}</strong></div>
            <div class="fact"><div class="label">CATEGORY</div><strong>${e.cat}</strong></div>
            <div class="fact"><div class="label">FORMAT</div><strong>In-person · Student event</strong></div>
          </div>

          <h2 style="margin-top:28px">Event schedule</h2>
          <p>Here's what to expect throughout the session.</p>
          <div class="schedule">
            ${e.schedule.map(function (s) {
              return `<div class="slot"><time>${s[0]}</time><span>${s[1]}</span></div>`;
            }).join('')}
          </div>
        </div>
      </div>

      <aside class="sidecard">
        <div class="eyebrow">Save your spot</div>
        <h2 style="margin-top:8px">Join the experience</h2>
        <p class="muted small">Seats are limited. Register to reserve your place.</p>

        <div style="display:flex;justify-content:space-between;align-items:end;margin-top:20px">
          <div>
            <div class="seatnumber">${e.seatsLeft}</div>
            <div class="muted small">seats remaining</div>
          </div>
          <span class="tag">${badge}</span>
        </div>

        <div class="progress"><span style="width:${pct}%"></span></div>
        <div class="muted small">${e.reserved} of ${e.total} spots reserved</div>

        <button class="primary" id="registerBtn" ${full ? 'disabled' : ''}>${full ? 'Event full' : 'Register now &nbsp; ↗'}</button>
        <div class="muted small" style="text-align:center">Free registration · Confirmation included</div>

        <hr>
        <h3>Good to know</h3>
        <ul>
          <li>Arrive 10 minutes early</li>
          <li>Bring your student ID</li>
          <li>Be ready to learn and connect</li>
        </ul>
      </aside>
    </div>`;
}

async function loadDetails() {
  const root = document.getElementById('detailsRoot');
  const id = Number(new URLSearchParams(window.location.search).get('id'));

  if (!id) {
    root.innerHTML = '<div class="empty">No event selected. <a class="textlink" href="events.html">Browse events</a></div>';
    return;
  }

  try {
    const event = await apiGet('/api/events/' + id);
    document.title = 'EventEase — ' + event.title;
    root.innerHTML = renderDetails(event);

    const btn = document.getElementById('registerBtn');
    btn.addEventListener('click', function () {
      window.location.href = 'registration.html?id=' + event.id;
    });
  } catch (err) {
    root.innerHTML = '<div class="empty">' + err.message + ' <a class="textlink" href="events.html">Browse events</a></div>';
  }
}

loadDetails();
