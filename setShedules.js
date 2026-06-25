import routes from "./shedule-2026-routes.js";

const ROUTE_IDS = [290, 292, 293];
const enabledRoutes = new Set(ROUTE_IDS);

const timeNextKadino = document.getElementById("timeNextKadino");
const timeNextKirova = document.getElementById("timeNextKirova");
const timeNextRomanovichi = document.getElementById("timeNextRomanovichi");
const timeNextVokzal = document.getElementById("timeNextVokzal");
const timeNextMyasokombinat = document.getElementById("timeNextMyasokombinat");
const sheduleKadino = document.getElementById("sheduleKadino");
const sheduleKirova = document.getElementById("sheduleKirova");
const sheduleRomanovichi = document.getElementById("sheduleRomanovichi");
const sheduleVokzal = document.getElementById("sheduleVokzal");
const sheduleMyasokombinat = document.getElementById("sheduleMyasokombinat");
let timer
let day
let hours
let showingDay

function getRouteStopKey (stop, day) {
  if (day === 6) return `${stop}6`;
  if (day === 7) return `${stop}7`;
  return stop;
}

function parseTime (time) {
  const [h, m] = time.split(":");
  return Number(h) * 60 + Number(m);
}

function buildSchedule (stop, day, kind = "main") {
  const stopKey = getRouteStopKey(stop, day);
  const entries = [];

  for (const routeId of ROUTE_IDS) {
    if (!enabledRoutes.has(routeId)) continue;
    const times = routes[routeId][kind]?.[stopKey] || [];
    for (const time of times) {
      entries.push({ time, route: routeId });
    }
  }

  return entries.sort((a, b) => parseTime(a.time) - parseTime(b.time));
}

function createTimeSpan ({ time, route }, stateClasses) {
  const span = document.createElement("span");
  span.classList.add("shedule", `route-${route}`);
  stateClasses.forEach((cls) => span.classList.add(cls));
  span.textContent = time;
  return span;
}

export default function setShedules (showDay) {
  showingDay = showDay
  const date = new Date();
  const cday = date.getDay();
  day = showDay !== undefined ? showDay : cday;
  if (day === 0) day = 7;
  hours = date.getHours();
  const mins = date.getMinutes();
  if (showDay !== undefined) {
    clearTimeout(timer);
    hours = 0;
  }

  function sheduling (entries, nextEl, sheduleEl) {
    sheduleEl.replaceChildren();
    nextEl.replaceChildren();
    nextEl.classList.remove("hidden");

    const elNow = [];
    const elBack = [];

    entries.forEach((entry) => {
      const [h, m] = entry.time.split(":");
      const hour = Number(h);
      const minute = Number(m);
      const stateClasses = [];

      if (hour >= hours) {
        if (hour === hours && minute < mins) stateClasses.push("oldshedule");
        if (hour === hours && minute >= mins) {
          stateClasses.push("shedulenow");
          elNow.push(entry);
        }
        if ((hour - hours) === 1) elNow.push(entry);
        if ((hour - hours) > 1) {
          stateClasses.push("shedulelong");
          elBack.push(entry);
        }
      } else {
        stateClasses.push("oldshedule");
      }

      sheduleEl.appendChild(createTimeSpan(entry, stateClasses));
    });

    const upcoming = elNow.length > 0 ? elNow : elBack;
    upcoming.forEach((entry, index) => {
      if (index > 0) nextEl.appendChild(document.createTextNode(", "));
      nextEl.appendChild(createTimeSpan(entry, ["shedulenow"]));
    });

    if (showingDay === undefined && upcoming.length < 1) nextEl.classList.add("hidden");
  }

  sheduling(buildSchedule("vokzal", day), timeNextVokzal, sheduleVokzal);
  sheduling(buildSchedule("myasokombinat", day), timeNextMyasokombinat, sheduleMyasokombinat);
  sheduling(buildSchedule("kirova", day), timeNextKirova, sheduleKirova);
  sheduling(buildSchedule("kadino", day), timeNextKadino, sheduleKadino);
  sheduling(buildSchedule("romanovichi", day), timeNextRomanovichi, sheduleRomanovichi);

  timer = setTimeout(() => setShedules(showingDay), 10000);
};

export function initRouteToggles () {
  document.querySelectorAll(".route-legend-item[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const routeId = Number(btn.dataset.route);
      const isActive = btn.classList.contains("is-active");

      if (isActive && enabledRoutes.size === 1) return;

      if (isActive) {
        enabledRoutes.delete(routeId);
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      } else {
        enabledRoutes.add(routeId);
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      }

      setShedules(showingDay);
    });
  });
}
