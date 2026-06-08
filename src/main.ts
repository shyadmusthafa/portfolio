import { portfolioData } from './data.js';
import type { Project } from './types.js';

/* ─── Utilities ─── */
const $ = <T extends HTMLElement>(sel: string, ctx: ParentNode = document) =>
  ctx.querySelector<T>(sel)!;

const $$ = <T extends HTMLElement>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));

function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

/* ─── Loading Screen ─── */
function initLoader(): void {
  const loader = $('#loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 600);
  });
}

/* ─── Theme Toggle ─── */
function initTheme(): void {
  const stored = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored ?? (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  const toggle = $('#theme-toggle');
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateChartsTheme();
  });
}

/* ─── Navbar ─── */
function initNavbar(): void {
  const navbar = $('#main-nav');
  const links = $$<HTMLAnchorElement>('.nav-link');
  const sections = links.map((l) => $(l.getAttribute('href')!)).filter(Boolean);

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => observer.observe(s));

  $('#nav-toggle').addEventListener('click', () => {
    $('#nav-menu').classList.toggle('open');
    $('#nav-toggle').classList.toggle('active');
  });

  links.forEach((l) =>
    l.addEventListener('click', () => {
      $('#nav-menu').classList.remove('open');
      $('#nav-toggle').classList.remove('active');
    })
  );
}

/* ─── Smooth Scroll ─── */
function initSmoothScroll(): void {
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─── Scroll Animations ─── */
function initScrollAnimations(): void {
  const els = $$('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => observer.observe(el));
}

/* ─── Typed Text ─── */
function initTypedText(): void {
  const el = $('#typed-text');
  const roles = [
    'Software Engineer',
    'Full Stack Developer',
    'Backend Developer',
    'PHP & Laravel Developer',
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick(): void {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  tick();
}

/* ─── Counter Animation ─── */
function initCounters(): void {
  const counters = $$('[data-count]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseInt(el.dataset.count!, 10);
        const suffix = el.dataset.suffix ?? '';
        const duration = 2000;
        const start = performance.now();

        function step(now: number): void {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => observer.observe(c));
}

/* ─── Skill Bars ─── */
function initSkillBars(): void {
  const bars = $$('.skill-bar-fill');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target as HTMLElement;
          bar.style.width = bar.dataset.level + '%';
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((b) => observer.observe(b));
}

/* ─── Skill Category Tabs ─── */
function initSkillTabs(): void {
  const tabs = $$('.skill-tab');
  const panels = $$('.skill-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.category!;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.dataset.category === id));
    });
  });
}

/* ─── Render Dynamic Content ─── */
function renderContent(): void {
  const d = portfolioData;

  // Profile
  $('#hero-name').textContent = d.profile.name;
  $('#hero-intro').textContent = d.profile.introduction;
  const avatar = $('#hero-avatar') as HTMLImageElement;
  avatar.src = d.profile.avatar;
  avatar.alt = d.profile.name;
  ($('#resume-btn') as HTMLAnchorElement).href = d.profile.resumeUrl;
  $('#about-summary').textContent = d.about.summary;
  $('#contact-email').textContent = d.profile.email;
  $('#contact-phone').textContent = d.profile.phone;
  $('#contact-location').textContent = d.profile.location;
  $('#footer-name').textContent = d.profile.name;

  // Social links
  const socialContainers = $$('.social-links');
  const socialHTML = d.profile.social
    .map(
      (s) =>
        `<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.platform}" class="social-link"><i class="bi ${s.icon}"></i></a>`
    )
    .join('');
  socialContainers.forEach((c) => (c.innerHTML = socialHTML));

  // Stats
  const statsGrid = $('#stats-grid');
  statsGrid.innerHTML = d.stats
    .map(
      (s, i) => `
    <div class="stat-card glass-card" data-animate="fade-up" style="--delay:${i * 0.1}s">
      <div class="stat-icon"><i class="bi ${s.icon}"></i></div>
      <div class="stat-value" data-count="${s.value}" data-suffix="${s.suffix}">0</div>
      <div class="stat-label">${s.label}</div>
    </div>`
    )
    .join('');

  // Personal info
  $('#personal-info-grid').innerHTML = d.about.personalInfo
    .map(
      (p, i) => `
    <div class="info-card glass-card" data-animate="fade-up" style="--delay:${i * 0.08}s">
      <i class="bi ${p.icon}"></i>
      <div><span class="info-label">${p.label}</span><span class="info-value">${p.value}</span></div>
    </div>`
    )
    .join('');

  // Achievements
  $('#achievements-list').innerHTML = d.about.achievements
    .map((a) => `<li><i class="bi bi-trophy"></i>${a}</li>`)
    .join('');

  // Journey timeline
  $('#journey-timeline').innerHTML = d.about.journey
    .map(
      (j, i) => `
    <div class="timeline-item ${i % 2 === 0 ? 'left' : 'right'}" data-animate="fade-${i % 2 === 0 ? 'right' : 'left'}">
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card">
        <span class="timeline-period">${j.period}</span>
        <h4>${j.title}</h4>
        <p class="timeline-subtitle">${j.subtitle}</p>
        <p>${j.description}</p>
        ${j.highlights ? `<ul>${j.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`
    )
    .join('');

  // Education
  $('#education-timeline').innerHTML = d.about.education
    .map(
      (e, i) => `
    <div class="timeline-item ${i % 2 === 0 ? 'left' : 'right'}" data-animate="fade-${i % 2 === 0 ? 'right' : 'left'}">
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card">
        <span class="timeline-period">${e.period}</span>
        <h4>${e.title}</h4>
        <p class="timeline-subtitle">${e.subtitle}</p>
        <p>${e.description}</p>
      </div>
    </div>`
    )
    .join('');

  // Skills
  const tabsContainer = $('#skill-tabs');
  const panelsContainer = $('#skill-panels');
  tabsContainer.innerHTML = d.skillCategories
    .map(
      (c, i) =>
        `<button class="skill-tab ${i === 0 ? 'active' : ''}" data-category="${c.id}"><i class="bi ${c.icon}"></i>${c.name}</button>`
    )
    .join('');
  panelsContainer.innerHTML = d.skillCategories
    .map(
      (c, i) => `
    <div class="skill-panel ${i === 0 ? 'active' : ''}" data-category="${c.id}">
      <div class="skill-cards-grid">
        ${c.skills
          .map(
            (s) => `
          <div class="skill-card glass-card">
            <div class="skill-card-header">
              <i class="bi ${s.icon}"></i>
              <span>${s.name}</span>
              <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-bar"><div class="skill-bar-fill" data-level="${s.level}"></div></div>
          </div>`
          )
          .join('')}
      </div>
    </div>`
    )
    .join('');

  // Experience
  $('#experience-timeline').innerHTML = d.experience
    .map(
      (exp, i) => `
    <div class="exp-card glass-card" data-animate="fade-up" style="--delay:${i * 0.1}s">
      <div class="exp-header">
        <div class="exp-period"><i class="bi bi-calendar3"></i>${exp.period}</div>
        <h4>${exp.role}</h4>
        <p class="exp-company">${exp.company} · ${exp.location}</p>
      </div>
      <p class="exp-desc">${exp.description}</p>
      <div class="exp-details">
        <div><h5>Responsibilities</h5><ul>${exp.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul></div>
        <div><h5>Achievements</h5><ul class="achievements">${exp.achievements.map((a) => `<li>${a}</li>`).join('')}</ul></div>
      </div>
      <div class="exp-projects">
        ${exp.projects.map((p) => `<span class="badge-tech">${p}</span>`).join('')}
      </div>
    </div>`
    )
    .join('');

  // Projects
  renderProjects(d.projects);

  // Certifications
  $('#cert-grid').innerHTML = d.certifications
    .map(
      (c, i) => `
    <div class="cert-card glass-card" data-animate="fade-up" style="--delay:${i * 0.1}s">
      <div class="cert-image"><img src="${c.image}" alt="${c.title}" loading="lazy"></div>
      <div class="cert-body">
        <h4>${c.title}</h4>
        <p class="cert-provider"><i class="bi bi-building"></i>${c.provider}</p>
        <p class="cert-date"><i class="bi bi-calendar-check"></i>${c.date}</p>
        <div class="cert-actions">
          ${c.credentialUrl ? `<a href="${c.credentialUrl}" class="btn btn-sm btn-outline-primary" target="_blank"><i class="bi bi-eye"></i> View</a>` : ''}
          ${c.downloadUrl ? `<a href="${c.downloadUrl}" class="btn btn-sm btn-primary"><i class="bi bi-download"></i> Download</a>` : ''}
        </div>
      </div>
    </div>`
    )
    .join('');

  // Services
  $('#services-grid').innerHTML = d.services
    .map(
      (s, i) => `
    <div class="service-card glass-card" data-animate="fade-up" style="--delay:${i * 0.1}s">
      <div class="service-icon"><i class="bi ${s.icon}"></i></div>
      <h4>${s.title}</h4>
      <p>${s.description}</p>
      <ul>${s.features.map((f) => `<li><i class="bi bi-check2"></i>${f}</li>`).join('')}</ul>
    </div>`
    )
    .join('');

  // Blog
  renderBlog(d.blog);

  // Map
  const mapFrame = $('#map-frame') as HTMLIFrameElement;
  mapFrame.src = d.contact.mapEmbed;
}

function renderProjects(projects: Project[]): void {
  const grid = $('#projects-grid');
  grid.innerHTML = projects
    .map(
      (p) => `
    <div class="project-card glass-card" data-category="${p.category}" data-title="${p.title.toLowerCase()}" data-animate="fade-up">
      <div class="project-image">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <div class="project-overlay">
          <button class="btn btn-primary btn-sm project-view-btn" data-project="${p.id}"><i class="bi bi-eye"></i> View Details</button>
        </div>
        ${p.featured ? '<span class="project-featured">Featured</span>' : ''}
      </div>
      <div class="project-body">
        <h4>${p.title}</h4>
        <p>${p.description.slice(0, 100)}...</p>
        <div class="project-tags">${p.tags.map((t) => `<span class="badge-tech">${t}</span>`).join('')}</div>
      </div>
    </div>`
    )
    .join('');

  $$('.project-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => openProjectModal(btn.dataset.project!));
  });
}

function renderBlog(posts: typeof portfolioData.blog): void {
  const grid = $('#blog-grid');
  grid.innerHTML = posts
    .map(
      (b) => `
    <article class="blog-card glass-card" data-category="${b.category.toLowerCase()}" data-title="${b.title.toLowerCase()}" data-animate="fade-up">
      <div class="blog-image">
        <img src="${b.image}" alt="${b.title}" loading="lazy">
        ${b.featured ? '<span class="blog-featured">Featured</span>' : ''}
      </div>
      <div class="blog-body">
        <div class="blog-meta">
          <span class="badge-tech">${b.category}</span>
          <span><i class="bi bi-clock"></i>${b.readTime}</span>
        </div>
        <h4>${b.title}</h4>
        <p>${b.excerpt}</p>
        <div class="blog-footer">
          <span><i class="bi bi-calendar3"></i>${b.date}</span>
          <a href="#" class="read-more">Read More <i class="bi bi-arrow-right"></i></a>
        </div>
      </div>
    </article>`
    )
    .join('');
}

/* ─── Project Filter & Search ─── */
function initProjectFilter(): void {
  const filterBtns = $$('.project-filter');
  const searchInput = $('#project-search') as HTMLInputElement;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter!, searchInput.value);
    });
  });

  searchInput.addEventListener(
    'input',
    debounce(() => {
      const active = $('.project-filter.active');
      filterProjects(active.dataset.filter!, searchInput.value);
    }, 300)
  );
}

function filterProjects(category: string, search: string): void {
  const cards = $$('.project-card');
  const q = search.toLowerCase().trim();
  cards.forEach((card) => {
    const matchCat = category === 'all' || card.dataset.category === category;
    const matchSearch = !q || card.dataset.title!.includes(q);
    card.style.display = matchCat && matchSearch ? '' : 'none';
  });
}

/* ─── Project Modal ─── */
function openProjectModal(id: string): void {
  const project = portfolioData.projects.find((p) => p.id === id);
  if (!project) return;

  const modal = $('#project-modal');
  $('#modal-title').textContent = project.title;
  ($('#modal-image') as HTMLImageElement).src = project.image;
  $('#modal-desc').textContent = project.description;
  $('#modal-tags').innerHTML = project.tags.map((t) => `<span class="badge-tech">${t}</span>`).join('');

  const liveBtn = $('#modal-live') as HTMLAnchorElement;
  const sourceBtn = $('#modal-source') as HTMLAnchorElement;
  liveBtn.style.display = project.liveUrl ? '' : 'none';
  sourceBtn.style.display = project.sourceUrl ? '' : 'none';
  if (project.liveUrl) liveBtn.href = project.liveUrl;
  if (project.sourceUrl) sourceBtn.href = project.sourceUrl;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function initProjectModal(): void {
  const modal = $('#project-modal');
  const close = () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  };
  $$('[data-close-modal]').forEach((el) => el.addEventListener('click', close));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });
}

/* ─── Blog Filter & Search ─── */
function initBlogFilter(): void {
  const filterBtns = $$('.blog-filter');
  const searchInput = $('#blog-search') as HTMLInputElement;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterBlog(btn.dataset.filter!, searchInput.value);
    });
  });

  searchInput.addEventListener(
    'input',
    debounce(() => {
      const active = $('.blog-filter.active');
      filterBlog(active.dataset.filter!, searchInput.value);
    }, 300)
  );
}

function filterBlog(category: string, search: string): void {
  const cards = $$('.blog-card');
  const q = search.toLowerCase().trim();
  cards.forEach((card) => {
    const matchCat = category === 'all' || card.dataset.category === category;
    const matchSearch = !q || card.dataset.title!.includes(q);
    card.style.display = matchCat && matchSearch ? '' : 'none';
  });
}

/* ─── Contact Form ─── */
function initContactForm(): void {
  const form = $('#contact-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = ($('#form-name') as HTMLInputElement).value.trim();
    const email = ($('#form-email') as HTMLInputElement).value.trim();
    const subject = ($('#form-subject') as HTMLInputElement).value.trim();
    const message = ($('#form-message') as HTMLTextAreaElement).value.trim();

    let valid = true;
    const showError = (id: string, show: boolean) => {
      $(`#error-${id}`).classList.toggle('d-none', !show);
      if (show) valid = false;
    };

    showError('name', !name);
    showError('email', !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    showError('subject', !subject);
    showError('message', !message);

    if (!valid) return;

    const toast = $('#form-toast');
    toast.classList.add('show');
    form.reset();
    setTimeout(() => toast.classList.remove('show'), 4000);
  });
}

/* ─── Analytics Dashboard ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let charts: Record<string, any> = {};

function initAnalytics(): void {
  const d = portfolioData.analytics;
  $('#analytics-views').textContent = d.pageViews.toLocaleString();
  $('#analytics-visitors').textContent = d.uniqueVisitors.toLocaleString();
  $('#analytics-session').textContent = d.avgSession;
  $('#analytics-bounce').textContent = d.bounceRate + '%';

  $('#analytics-btn').addEventListener('click', () => {
    $('#analytics-panel').classList.add('show');
    document.body.style.overflow = 'hidden';
    initCharts();
  });

  const panel = $('#analytics-panel');
  const closeAnalytics = () => {
    panel.classList.remove('show');
    document.body.style.overflow = '';
  };
  $$('[data-close-analytics]').forEach((el) => el.addEventListener('click', closeAnalytics));
  panel.addEventListener('click', (e) => {
    if (e.target === panel) closeAnalytics();
  });
}

function getChartColors(): { primary: string; secondary: string; grid: string; text: string } {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    primary: isDark ? '#6366f1' : '#4f46e5',
    secondary: isDark ? '#22d3ee' : '#0891b2',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    text: isDark ? '#94a3b8' : '#64748b',
  };
}

function initCharts(): void {
  const colors = getChartColors();
  const d = portfolioData.analytics;

  // Monthly views line chart
  const viewsCtx = ($('#chart-views') as HTMLCanvasElement).getContext('2d')!;
  if (charts.views) charts.views.destroy();
  charts.views = new window.Chart(viewsCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Page Views',
          data: d.monthlyViews,
          borderColor: colors.primary,
          backgroundColor: colors.primary + '20',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
        },
      ],
    },
    options: chartOptions(colors),
  });

  // Traffic sources doughnut
  const trafficCtx = ($('#chart-traffic') as HTMLCanvasElement).getContext('2d')!;
  if (charts.traffic) charts.traffic.destroy();
  charts.traffic = new window.Chart(trafficCtx, {
    type: 'doughnut',
    data: {
      labels: d.trafficSources.map((t) => t.source),
      datasets: [
        {
          data: d.trafficSources.map((t) => t.percentage),
          backgroundColor: ['#4f46e5', '#0891b2', '#10b981', '#f59e0b'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom', labels: { color: colors.text, padding: 16 } } },
    },
  });

  // Top projects bar chart
  const projectsCtx = ($('#chart-projects') as HTMLCanvasElement).getContext('2d')!;
  if (charts.projects) charts.projects.destroy();
  charts.projects = new window.Chart(projectsCtx, {
    type: 'bar',
    data: {
      labels: d.topProjects.map((p) => p.name),
      datasets: [
        {
          label: 'Views',
          data: d.topProjects.map((p) => p.views),
          backgroundColor: colors.secondary + 'cc',
          borderRadius: 8,
        },
      ],
    },
    options: {
      ...chartOptions(colors),
      indexAxis: 'y' as const,
    },
  });
}

function chartOptions(colors: ReturnType<typeof getChartColors>) {
  return {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
      y: { grid: { color: colors.grid }, ticks: { color: colors.text } },
    },
  };
}

function updateChartsTheme(): void {
  if ($('#analytics-panel').classList.contains('show')) initCharts();
}

/* ─── Back to Top ─── */
function initBackToTop(): void {
  const btn = $('#back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Track Page View (local analytics) ─── */
function trackPageView(): void {
  const views = parseInt(localStorage.getItem('portfolio-local-views') ?? '0', 10) + 1;
  localStorage.setItem('portfolio-local-views', String(views));
}

/* ─── Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initTheme();
  renderContent();
  initNavbar();
  initSmoothScroll();
  initScrollAnimations();
  initTypedText();
  initCounters();
  initSkillBars();
  initSkillTabs();
  initProjectFilter();
  initProjectModal();
  initBlogFilter();
  initContactForm();
  initAnalytics();
  initBackToTop();
  trackPageView();

  // Re-init scroll animations for dynamically added elements
  initScrollAnimations();
  initSkillBars();
  initCounters();
});

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Chart: any;
  }
}
