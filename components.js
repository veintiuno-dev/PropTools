/**
 * PropTools – Shared UI Components
 * ─────────────────────────────────
 * Uso en cada página (una sola llamada):
 *
 *   const { profile, apps } = await initComponents({ active: 'firmas' });
 *
 * Requiere que `sb` (Supabase client) esté definido antes de este script.
 */

// ─── SVG Logo ─────────────────────────────────────────────────────────────────

const PROPTOOLS_SVG = `<svg width="28" height="32" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1.375" y="1.375" width="7.25"  height="33.25" rx="2.75" fill="#1B6EF3" stroke="#1B6EF3" stroke-width="0.75"/>
  <rect x="1.375" y="1.375" width="30.25" height="7.25"  rx="2.75" fill="#1B6EF3" stroke="#1B6EF3" stroke-width="0.75"/>
  <rect x="1.375" y="14.375" width="20.25" height="7.25" rx="2.75" fill="#1B6EF3" stroke="#1B6EF3" stroke-width="0.75"/>
  <rect x="23.375" y="14.375" width="8.25" height="22.25" rx="2.75" fill="#1B6EF3" stroke="#1B6EF3" stroke-width="0.75"/>
</svg>`;

// ─── CSS ──────────────────────────────────────────────────────────────────────

function injectComponentStyles() {
  if (document.getElementById('pt-components-css')) return;
  const style = document.createElement('style');
  style.id = 'pt-components-css';
  style.textContent = `
    :root {
      --blue:      #1B6EF3;
      --blue-dark: #1558C9;
      --ink:       #0D0F12;
      --ink-soft:  #4B5260;
      --surface:   #ffffff;
      --surface2:  #F4F5F7;
      --border:    #E2E5EA;
      --header-h:  88px;
      --sidebar-w: 232px;
      --radius:    8px;
      --font:      'DM Sans', sans-serif;
      --font-mono: 'DM Mono', monospace;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--font); color: var(--ink); background: var(--surface2); min-height: 100vh; }

    #pt-layout {
      display: grid;
      grid-template-columns: var(--sidebar-w) 1fr;
      grid-template-rows: var(--header-h) 1fr auto;
      min-height: 100vh;
    }

    /* Header */
    #pt-header {
      grid-column: 1 / -1; position: sticky; top: 0; z-index: 100;
      height: var(--header-h); background: var(--surface); border-bottom: 1px solid var(--border);
      display: flex; align-items: center; padding: 0 28px; gap: 10px;
    }
    #pt-header .pt-logo-mark {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; color: var(--ink); flex-shrink: 0;
    }
    #pt-header .pt-logo-mark span { font-weight: 700; font-size: 17px; letter-spacing: -0.3px; }
    #pt-header .pt-app-badge { font-weight: 300; color: var(--ink-soft); }
    #pt-header .pt-header-spacer { flex: 1; }
    #pt-header .pt-tenant-logo { height: 50px; width: auto; object-fit: contain; }

    /* Sidebar */
    #pt-sidebar {
      background: var(--surface); border-right: 1px solid var(--border);
      display: flex; flex-direction: column; padding: 24px 16px; gap: 2px;
      position: sticky; top: var(--header-h); height: calc(100vh - var(--header-h)); overflow-y: auto;
    }
    #pt-sidebar .pt-nav-section-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--ink-soft); padding: 12px 12px 6px; opacity: 0.7;
    }
    #pt-sidebar .pt-nav-section-admin { margin-top: 8px; }
    #pt-sidebar a.pt-nav-item {
      display: flex; align-items: center; gap: 10px; padding: 9px 12px;
      border-radius: var(--radius); text-decoration: none; font-size: 14px;
      font-weight: 500; color: var(--ink-soft); transition: background 0.12s, color 0.12s; line-height: 1;
    }
    #pt-sidebar a.pt-nav-item .pt-nav-icon {
      width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
    }
    #pt-sidebar a.pt-nav-item:hover       { background: var(--surface2); color: var(--ink); }
    #pt-sidebar a.pt-nav-item.active      { background: #EBF2FF; color: var(--blue); }
    #pt-sidebar a.pt-nav-item-admin:hover { background: #F5F3FF; color: #6D28D9; }
    #pt-sidebar a.pt-nav-item-admin.active{ background: #EDE9FE; color: #6D28D9; }

    #pt-sidebar .pt-sidebar-footer {
      margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border);
    }
    #pt-sidebar .pt-logout-btn {
      width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 12px;
      border-radius: var(--radius); background: none; border: none; cursor: pointer;
      font-family: var(--font); font-size: 14px; font-weight: 500; color: var(--ink-soft);
      transition: background 0.12s, color 0.12s;
    }
    #pt-sidebar .pt-logout-btn:hover { background: #FEF2F2; color: #DC2626; }

    /* Main */
    #pt-main { padding: 32px 36px; min-width: 0; }

    /* Footer */
    #pt-footer {
      border-top: 1px solid var(--border); background: var(--surface);
      padding: 16px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
    }
    #pt-footer .pt-footer-brand {
      display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ink-soft);
    }
    #pt-footer .pt-footer-brand strong { color: var(--ink); font-weight: 600; }
    #pt-footer .pt-footer-version { font-family: var(--font-mono); font-size: 11px; color: var(--ink-soft); opacity: 0.6; }

    /* Nav horizontal en header (cuando no hay sidebar) */
    #pt-header-nav {
      display: flex; align-items: center; gap: 2px; margin-left: 8px;
    }
    #pt-header-nav a.pt-hnav-item {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 10px; border-radius: 6px;
      text-decoration: none; font-size: 13px; font-weight: 500;
      color: var(--ink-soft); transition: background 0.12s, color 0.12s;
      white-space: nowrap;
    }
    #pt-header-nav a.pt-hnav-item:hover { background: var(--surface2); color: var(--ink); }
    #pt-header-nav a.pt-hnav-item.active { background: #EBF2FF; color: var(--blue); }
    #pt-header-nav a.pt-hnav-item-admin:hover { background: #F5F3FF; color: #6D28D9; }
    #pt-header-nav a.pt-hnav-item-admin.active { background: #EDE9FE; color: #6D28D9; }
    #pt-header-nav .pt-hnav-divider {
      width: 1px; height: 20px; background: var(--border); margin: 0 4px;
    }
    #pt-header .pt-logout-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 10px; border-radius: 6px;
      background: none; border: none; cursor: pointer;
      font-family: var(--font); font-size: 13px; font-weight: 500;
      color: var(--ink-soft); transition: background 0.12s, color 0.12s;
    }
    #pt-header .pt-logout-btn:hover { background: #FEF2F2; color: #DC2626; }

    /* Mobile */
    #pt-sidebar-toggle { display: none; background: none; border: none; cursor: pointer; padding: 6px; color: var(--ink); }
    @media (max-width: 768px) {
      #pt-layout { grid-template-columns: 1fr; }
      #pt-sidebar-toggle { display: flex; }
      #pt-sidebar {
        position: fixed; top: var(--header-h); left: 0; width: var(--sidebar-w);
        height: calc(100vh - var(--header-h)); z-index: 90;
        transform: translateX(-100%); transition: transform 0.2s ease;
        box-shadow: 4px 0 24px rgba(0,0,0,0.08);
      }
      #pt-sidebar.open { transform: translateX(0); }
      #pt-main { padding: 24px 20px; }
      #pt-sidebar-backdrop {
        display: none; position: fixed; inset: 0; top: var(--header-h);
        background: rgba(0,0,0,0.3); z-index: 89;
      }
      #pt-sidebar-backdrop.open { display: block; }
    }
  `;
  document.head.appendChild(style);
}

// ─── Header ───────────────────────────────────────────────────────────────────

function renderHeader({ tenantLogo = '', tenantName = 'Tenant', apps = [], active = '', role = 'agent' } = {}) {
  const el = document.getElementById('pt-header');
  if (!el) return;

  const hasSidebar = !!document.getElementById('pt-sidebar');

  // Nav horizontal: solo si no hay sidebar
  let navHTML = '';
  if (!hasSidebar && apps.length > 0) {
    const toolApps  = apps.filter(a => a.requires_role !== 'admin');
    const adminApps = apps.filter(a => a.requires_role === 'admin' && role === 'admin');

    const buildLink = (app) => `
      <a href="${app.href}"
         class="pt-hnav-item${app.requires_role === 'admin' ? ' pt-hnav-item-admin' : ''}${active === app.slug ? ' active' : ''}">
        ${app.icon_svg}${app.label}
      </a>`;

    const adminSection = adminApps.length
      ? `<div class="pt-hnav-divider"></div>${adminApps.map(buildLink).join('')}`
      : '';

    navHTML = `
      <nav id="pt-header-nav">
        ${toolApps.map(buildLink).join('')}
        ${adminSection}
        <div class="pt-hnav-divider"></div>
        <button class="pt-logout-btn" onclick="window.__ptLogout()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Salir
        </button>
      </nav>`;
  }

  el.innerHTML = `
    <button id="pt-sidebar-toggle" aria-label="Menú" onclick="window.__ptToggleSidebar()">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="3" y1="6"  x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <a href="/PropTools/" class="pt-logo-mark">
      ${PROPTOOLS_SVG}
      <span>PropTools <span class="pt-app-badge">| App</span></span>
    </a>
    ${navHTML}
    <div class="pt-header-spacer"></div>
    ${tenantLogo ? `<img src="${tenantLogo}" alt="${tenantName}" class="pt-tenant-logo" />` : ''}
  `;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function renderSidebar({ apps = [], active = '', role = 'agent' } = {}) {
  const el = document.getElementById('pt-sidebar');
  if (!el) return;

  const toolApps  = apps.filter(a => a.requires_role !== 'admin');
  const adminApps = apps.filter(a => a.requires_role === 'admin' && role === 'admin');

  const buildLink = (app) => `
    <a href="${app.href}"
       class="pt-nav-item${app.requires_role === 'admin' ? ' pt-nav-item-admin' : ''}${active === app.slug ? ' active' : ''}"
       aria-current="${active === app.slug ? 'page' : 'false'}">
      <span class="pt-nav-icon">${app.icon_svg}</span>
      ${app.label}
    </a>`;

  el.innerHTML = `
    <span class="pt-nav-section-label">Herramientas</span>
    ${toolApps.map(buildLink).join('')}
    ${adminApps.length ? `
      <span class="pt-nav-section-label pt-nav-section-admin">Administración</span>
      ${adminApps.map(buildLink).join('')}
    ` : ''}
    <div class="pt-sidebar-footer">
      <button class="pt-logout-btn" onclick="window.__ptLogout()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar sesión
      </button>
    </div>
  `;

  if (!document.getElementById('pt-sidebar-backdrop')) {
    const backdrop = document.createElement('div');
    backdrop.id = 'pt-sidebar-backdrop';
    backdrop.onclick = () => window.__ptToggleSidebar(false);
    document.body.appendChild(backdrop);
  }
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function renderFooter({ version = '' } = {}) {
  const el = document.getElementById('pt-footer');
  if (!el) return;
  el.innerHTML = `
    <div class="pt-footer-brand">
      ${PROPTOOLS_SVG}
      <span><strong>PropTools</strong> &mdash; Veintiuno &copy; ${new Date().getFullYear()}</span>
    </div>
    ${version ? `<span class="pt-footer-version">${version}</span>` : ''}
  `;
}

// ─── initComponents ───────────────────────────────────────────────────────────

/**
 * Inicializa toda la UI en una sola llamada.
 *
 * 1. Verifica sesión → redirige a /perfil/ si no hay
 * 2. Consulta perfil del usuario (users + tenants)
 * 3. Llama RPC get_tenant_apps() → plan del tenant + overrides individuales
 * 4. Filtra apps por rol (admin ve sección Administración)
 * 5. Renderiza header, sidebar y footer
 * 6. Retorna { profile, apps } para uso en la página
 *
 * @param {object} opts
 * @param {string} opts.active    Slug de la página activa
 * @param {string} [opts.version] Versión para el footer
 * @returns {Promise<{ profile: object, apps: Array } | null>}
 */
async function initComponents({ active = '', version = '' } = {}) {
  injectComponentStyles();

  if (typeof sb === 'undefined') {
    console.error('[PropTools] initComponents: `sb` no está definido.');
    return null;
  }

  // 1. Sesión
  // getSession() puede retornar null en el primer render aunque haya sesión en localStorage.
  // Esperar hasta 3s a que Supabase la restaure antes de redirigir.
  let session = (await sb.auth.getSession()).data.session;
  if (!session) {
    session = await new Promise(resolve => {
      const timeout = setTimeout(() => resolve(null), 3000);
      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, s) => {
        if (s) { clearTimeout(timeout); subscription.unsubscribe(); resolve(s); }
      });
    });
  }
  if (!session) {
    window.location.href = '/PropTools/perfil/';
    return null;
  }

  // 2. Perfil
  const { data: profile, error: profileError } = await sb
    .from('users')
    .select('*, tenants(*)')
    .eq('auth_id', session.user.id)
    .single();

  if (profileError || !profile) {
    console.warn('[PropTools] No se encontró perfil:', profileError);
    renderHeader();
    renderSidebar({ apps: [], active, role: 'agent' });
    renderFooter({ version });
    return null;
  }

  // 3. Apps resueltos por RPC (plan + overrides)
  const { data: apps, error: appsError } = await sb
    .rpc('get_tenant_apps', { p_auth_id: session.user.id });

  if (appsError) console.warn('[PropTools] Error cargando apps:', appsError);

  let resolvedApps = apps || [];

  // Fallback: si el tenant no tiene plan asignado, cargar todos los apps del catálogo
  if (resolvedApps.length === 0) {
    console.warn('[PropTools] No apps via RPC (¿tenant sin plan?). Usando catálogo completo.');
    const { data: allApps } = await sb
      .from('apps')
      .select('slug, label, icon_svg, href, nav_order, requires_role')
      .order('nav_order');
    resolvedApps = allApps || [];
  }

  // 4 + 5. Render
  renderHeader({
    tenantLogo: profile.tenants?.logo_url || '',
    tenantName: profile.tenants?.name     || 'Tenant',
    apps: resolvedApps,
    active,
    role: profile.role,
  });

  renderSidebar({ apps: resolvedApps, active, role: profile.role });

  renderFooter({ version });

  return { profile, apps: resolvedApps };
}

// ─── Helpers globales ─────────────────────────────────────────────────────────

window.__ptToggleSidebar = function (force) {
  const sidebar  = document.getElementById('pt-sidebar');
  const backdrop = document.getElementById('pt-sidebar-backdrop');
  if (!sidebar) return;
  const open = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
  sidebar.classList.toggle('open', open);
  backdrop?.classList.toggle('open', open);
};

window.__ptLogout = async function () {
  try { if (typeof sb !== 'undefined') await sb.auth.signOut(); }
  catch (e) { console.warn('[PropTools] Logout error:', e); }
  window.location.href = '/PropTools/';
};

// export { renderHeader, renderSidebar, renderFooter, initComponents };
