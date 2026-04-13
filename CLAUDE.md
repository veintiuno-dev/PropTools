# CLAUDE.md — PropTools
> Este archivo es el punto de entrada para cualquier sesión de trabajo con Claude.
> Leerlo completo antes de tocar cualquier archivo del proyecto.

---

## 🗺️ Qué es esto

**PropTools** es una suite de herramientas de marketing digital white-label para agentes y brokers inmobiliarios. Desarrollada por **10101** (`diezdiez.uno`), cliente piloto **REMAX Central CR**.

Modelo de negocio: SaaS multi-tenant. Cada brokerage es un `tenant`. Los agentes son `users` dentro de ese tenant.

---

## 🌐 URLs

| Ambiente | URL | Supabase |
|---|---|---|
| **Producción** | `https://proptools.app/` | `zsldwaiwcvziqfajcmph.supabase.co` |
| **Staging** | `https://proptools.app/dev/` | `ttfkznarmavpfmvdwale.supabase.co` |

> ⚠️ El dominio real es `proptools.app`, no `veintiuno-dev.github.io/PropTools/`. GitHub Pages redirige automáticamente.

### Credenciales Supabase — PRODUCCIÓN
```
URL:      https://zsldwaiwcvziqfajcmph.supabase.co
ANON KEY: ver memorias de Claude / buscar en /perfil/index.html
```

### Credenciales Supabase — STAGING (proptools-dev)
```
URL:      https://ttfkznarmavpfmvdwale.supabase.co
ANON KEY: ver memorias de Claude / buscar en /dev/perfil/index.html
```

---

## 🗂️ Estructura de archivos

```
PropTools/                          ← raíz del repo GitHub
├── CLAUDE.md                       ← este archivo
├── PROPTOOLS_DOCS.md               ← documentación técnica detallada
├── index.html                      ← landing/selector
├── perfil/index.html               ← gestión de perfil (login aquí)
├── firmas/index.html               ← generador de firmas de correo
├── tarjetas/index.html             ← generador de tarjetas
├── rotulos/index.html              ← generador de rótulos/vallas
├── admin/index.html                ← panel admin (service role key)
└── dev/                            ← STAGING — espejo de producción
    ├── index.html
    ├── perfil/index.html
    ├── firmas/index.html
    ├── tarjetas/index.html
    ├── rotulos/index.html
    └── admin/index.html
```

**Flujo dev → prod:**
1. Hacer cambios en `/dev/módulo/index.html`
2. Probar en `proptools.app/dev/módulo/`
3. Cuando esté aprobado: copiar el archivo a `/módulo/index.html` (producción)
4. Subir ambos a GitHub vía web UI o API

---

## 🚀 Deploy

- **Hosting:** GitHub Pages (`veintiuno-dev/PropTools`, branch `main`)
- **Método:** Manual — subir archivos vía GitHub web UI o GitHub API desde el browser
- **Sin CI/CD, sin build step, sin node_modules**

### Subir via GitHub API (desde browser en proptools.app)
```js
// 1. Siempre obtener SHA actual primero
const r = await fetch('https://api.github.com/repos/veintiuno-dev/PropTools/contents/PATH', {
  headers: { Authorization: `token GITHUB_TOKEN` }
});
const { sha } = await r.json();

// 2. Luego hacer PUT con el sha
await fetch('https://api.github.com/repos/veintiuno-dev/PropTools/contents/PATH', {
  method: 'PUT',
  headers: { Authorization: `token GITHUB_TOKEN`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'update', content: btoa(htmlContent), sha })
});
```
> ⚠️ El entorno bash de Claude **no tiene acceso a internet**. Los uploads siempre se hacen desde el browser.

---

## 🎨 Design System

### Variables CSS
```css
:root {
  --blue:     #1B6EF3;
  --ink:      #0D0F12;
  --ink-mid:  #5A6070;
  --surface:  #fff;
  --surface2: #F4F5F7;
  --border:   #E2E5EA;
  --muted:    #9CA3AF;
}
```

### Logo PropTools
El logo es **puramente CSS + texto**, no hay SVG de rectángulos. Estructura HTML:
```html
<div class="pt-logo-mark">
  <span class="pt-logo-bar"></span>
  <span class="pt-logo-wordmark">
    <span class="pt-logo-prop">Prop</span><span class="pt-logo-tools">TOOLS</span>
  </span>
</div>
```
- `pt-logo-bar`: barra vertical con gradiente (coral → violeta → índigo)
- `pt-logo-prop`: font-weight 300
- `pt-logo-tools`: font-weight 900, mayúsculas
- **"PropTools" es una sola palabra, sin espacio** — los spans van inline sin whitespace entre ellos

### Header (`#pt-header`)
```html
<header id="pt-header">
  <button id="pt-sidebar-toggle"><!-- hamburger SVG --></button>
  <div class="pt-logo-mark">...</div>
  <nav id="pt-header-nav">
    <a href="/perfil/" class="pt-hnav-item">...</a>
    <!-- más items -->
  </nav>
  <!-- logo del tenant al extremo derecho -->
</header>
```
- Altura: 88px
- Fondo: blanco, `border-bottom: 1px solid var(--border)`

### Tipografía
```css
font-family: 'DM Sans', sans-serif;   /* 300 / 700 — UI general */
font-family: 'DM Mono', monospace;    /* datos, etiquetas */
```

### Sidebar
```html
<aside id="pt-sidebar">
  <!-- Primer ítem siempre: "Mi información" -->
</aside>
```

---

## 🗄️ Base de Datos — Supabase

### Regla de oro: SIEMPRE usar `DROP POLICY IF EXISTS` antes de `CREATE POLICY`

### Tablas completas (schema real a abril 2026)

| Tabla | Descripción |
|---|---|
| `tenants` | Brokerages/clientes. Tiene `plan_id`, `logo_url`, colores, dominio |
| `users` | Perfil de agentes. **`auth_id` referencia `auth.users`**. Tiene redes sociales |
| `plans` | Planes de suscripción (Starter / Pro / Brokerage) |
| `apps` | Catálogo de módulos disponibles (perfil, firmas, tarjetas, rótulos, etc.) |
| `plan_apps` | Qué apps incluye cada plan |
| `tenant_apps` | Qué apps tiene habilitadas cada tenant |
| `tenant_templates` | Templates de diseño por tenant |
| `invitations` | Invitaciones a agentes. Token UUID, 7 días de expiración |
| `signatures` | Firmas de correo guardadas. `user_id` → `auth.users` |
| `tarjetas` | Tarjetas de presentación guardadas. `user_id` → `auth.users` |
| `rotulos` | Rótulos/vallas guardados. `user_id` → `auth.users` |
| `calendarios` | Calendarios del equipo |
| `eventos_calendario` | Eventos dentro de calendarios |
| `equipos` | Equipos físicos disponibles para reserva |
| `reservas` | Reservas de equipos por agentes |
| `reserva_equipos` | Relación N:N reservas ↔ equipos |

### Columnas críticas de `users`
```
id, tenant_id, auth_id, name, email, role, job_title, active,
photo_url, whatsapp, phone, instagram, facebook, linkedin, tiktok,
created_at, updated_at
```
> ⚠️ `role` tiene CHECK constraint: solo acepta `'admin'` o `'agent'`
> ⚠️ Usar `job_title` para el cargo libre ("Agente Senior", "Broker"), NUNCA `role`
> ✅ `updated_at` SÍ existe en `users` (a diferencia de versiones anteriores)

### Query estándar de perfil
```js
const { data: profile } = await sb
  .from('users')
  .select('*, tenants(*)')
  .eq('auth_id', currentUser.id)
  .single();
```
> Nunca usar `.from('profiles')` — la tabla se llama `users`

### FK crítica en rótulos, signatures, tarjetas
```js
// ✅ Correcto — user_id apunta a auth.users
user_id: currentUser.id          // session.user.id

// ❌ Incorrecto
user_id: profile.id              // este es el ID de la tabla users, no de auth
```

---

## 🔐 Autenticación

```js
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Patrón de inicialización en cada página
const { data: { session } } = await sb.auth.getSession();
if (!session) {
  window.location.href = '/perfil/';
  return;
}
const currentUser = session.user; // currentUser.id = auth.users.id
```

- La sesión se guarda en `localStorage` bajo el dominio `proptools.app`
- Todas las apps del mismo dominio comparten el auth state automáticamente
- `/admin/` usa **service role key** y verifica `role === 'admin'` manualmente
- Las Edge Functions tienen "Verify JWT" **deshabilitado** — auth se hace con `sb.auth.getUser(token)`

---

## 📦 Dependencias CDN

```html
<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

<!-- jsPDF -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- QRCode.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

<!-- Tipografía -->
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;700&family=DM+Mono&display=swap" rel="stylesheet">
```

---

## 📬 Email (Resend + Edge Functions)

- Transaccional para invitaciones de agentes
- Edge Function: `invite-agent`
- Sender: resolver verificación de dominio `sunrisecr.com` en resend.com/domains
  - Workaround temporal: usar `onboarding@resend.dev`
- `RESEND_FROM` debe vivir como Supabase secret (no hardcodeado)
- "Verify JWT" debe estar **deshabilitado** en la Edge Function

---

## 🖼️ Cloudinary

```
Cloud name:    dlgrhr6lh
Upload preset: firmas
```

```js
// Upload desde browser
const fd = new FormData();
fd.append('file', file);
fd.append('upload_preset', 'firmas');
const res = await fetch('https://api.cloudinary.com/v1_1/dlgrhr6lh/image/upload', {
  method: 'POST', body: fd
});
const { secure_url } = await res.json();
```

---

## 🐛 Bugs conocidos y sus fixes

| Error | Causa | Fix |
|---|---|---|
| `422` en GitHub API PUT | SHA no incluido o desactualizado | Siempre hacer GET primero para obtener SHA |
| `violates foreign key constraint` en rótulos/firmas/tarjetas | Usar `profile.id` en vez de `currentUser.id` | Usar siempre `session.user.id` para `user_id` |
| `policy already exists` | `CREATE POLICY` sin DROP previo | Siempre `DROP POLICY IF EXISTS` antes |
| `invalid input value for enum role` | Guardar cargo libre en `role` | Usar `job_title` para texto libre |
| "PropTools" se renderiza con espacio | Whitespace entre spans en el HTML | Los spans del logo deben ir inline sin whitespace |
| ES module truncado sin error | Archivo cortado a mitad del módulo | Verificar que requests a Supabase disparan (no que el script se lea) |
| `ReferenceError` silencioso en canvas | Variable usa `const` antes de que esté definida (temporal dead zone) | Definir variables en orden de dependencia |

---

## 🔧 Diagnóstico con Chrome MCP

Patrón estándar para depurar en vivo:

```js
// Ver si Supabase está respondiendo
// → read_network_requests con urlPattern: 'supabase'

// Cache-bust para confirmar que el archivo deployado es el correcto
fetch('/dev/firmas/index.html?v=' + Date.now()).then(r=>r.text()).then(t=>{ window._src = t; })
// luego en otro javascript_exec:
window._src.length + ' chars | last 200: ' + window._src.slice(-200)

// Inspeccionar DOM del header
document.querySelector('#pt-header').innerHTML.substring(0, 500)
```

---

## 📋 Estado actual de módulos (Abril 2026)

| Módulo | Estado | Notas |
|---|---|---|
| `/perfil/` | ✅ Completo | Login único, upload foto a Cloudinary |
| `/firmas/` | ✅ Completo | Preview en tiempo real, guardado en `signatures` |
| `/tarjetas/` | ✅ Completo | Export PDF, QR, guardado en `tarjetas` |
| `/rotulos/` | ✅ Completo | Canvas 300dpi, vertical+horizontal, guardado en `rotulos` |
| `/admin/` | ✅ Completo | Service role, CRUD tenants/users, invitaciones |
| `/dev/` | ✅ Creado | Staging — espejo de producción con Supabase dev |

---

## ⚠️ Reglas de desarrollo — NO romper estas

1. **Nunca editar archivos de producción directamente** cuando hay cambio en desarrollo — usar `/dev/` primero
2. **Nunca** `.from('profiles')` — la tabla se llama `users`
3. **Nunca** incluir `updated_at` en `.update()` sobre `users` si el valor no viene del form — Supabase lo maneja con trigger
4. **Nunca** `user_id: profile.id` en rotulos/firmas/tarjetas — siempre `currentUser.id`
5. **Nunca** `CREATE POLICY` sin `DROP POLICY IF EXISTS` antes
6. **Siempre** obtener SHA antes de un PUT a la GitHub API
7. **Siempre** verificar con `read_network_requests` en Chrome MCP antes de concluir que algo no funciona

---

*PropTools by 10101 (diezdiez.uno) · Actualizado abril 2026*
