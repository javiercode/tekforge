# Guía de Integración de API para Publicidad de TikTok (SaaS Multitenant & Analíticas)

Esta guía técnica describe la arquitectura y el flujo de implementación para integrar la **API de Marketing de TikTok (TikTok Ads API)** dentro de la suite SaaS multitenant de TekForge. Esta integración permite a múltiples creadores y marcas (inquilinos/tenants) conectar de manera segura sus propias cuentas publicitarias individuales de TikTok, administrar campañas, y auditar analíticas consolidadas en tiempo real desde un único panel administrativo.

---

## 1. Arquitectura Multitenant de la Integración

En un entorno SaaS multitenant, cada usuario (tenant) posee un identificador de inquilino único en Firebase (`userId`). La integración debe cumplir con las siguientes pautas de aislamiento de datos:
1.  **Aislamiento de Credenciales:** Las credenciales de acceso de las APIs de TikTok (Access Tokens y Refresh Tokens) correspondientes a cada inquilino se almacenan en una colección privada y cifrada en Firestore, indexada bajo su `userId` respectivo.
2.  **Segregación de Consultas:** Todas las llamadas hacia la API de TikTok se ejecutan utilizando el token exclusivo del inquilino autenticado en la sesión, garantizando que un tenant jamás pueda ver ni alterar campañas publicitarias de otro.
3.  **Seguridad en Base de Datos:** Se implementan Reglas de Seguridad en Firestore para blindar el acceso a los tokens de vinculación, permitiendo que únicamente el propietario del `userId` pueda leer o escribir en su documento de credenciales.

---

## 2. Configuración en el Portal de Desarrolladores de TikTok

Para dar de alta la aplicación y obtener el consentimiento de los inquilinos, sigue estos pasos:

1.  **Crear cuenta de desarrollador:** Regístrate en el [TikTok Developer Portal](https://developers.tiktok.com/).
2.  **Crear una App Comercial:** Da de alta una nueva aplicación de tipo **Marketing API** (TikTok Ads Platform).
3.  **Obtener Credenciales de la App:**
    *   `Client Key` (ID de Cliente)
    *   `Client Secret` (Secreto de Cliente)
4.  **Configurar Redirect URI (Retorno OAuth):**
    *   Registra las URLs de redireccionamiento autorizadas para el flujo OAuth 2.0.
    *   Para desarrollo local: `http://localhost:3000/#/app`
    *   Para producción: `https://<tu-subdominio>.tekforge.app/#/app` o tu ruta en GitHub Pages.
5.  **Solicitar Permisos de API (Scopes):**
    *   `ads.manage`: Requerido para crear, pausar o editar anuncios y campañas.
    *   `ads.read`: Requerido para consultar campañas y métricas estadísticas.
    *   `analytics.read`: Requerido para auditar datos analíticos profundos de conversión de pixeles.

---

## 3. Flujo OAuth 2.0 Multitenant en Detalle

El flujo de autorización permite a cada inquilino enlazar su cuenta publicitaria de TikTok de manera interactiva:

```
  +--------------+          +---------------------+          +-------------------+
  |   Inquilino  |  ----->  | TekForge Client     |  ----->  | TikTok Auth Portal|
  |   (Tenant)   |          | (Lanza botón OAuth) |          | (Pide consent)    |
  +--------------+          +---------------------+          +-------------------+
         ^                             ^                               |
         |                             |                               v
  +--------------+          +---------------------+          +-------------------+
  | Credenciales |  <-----  | Intercambio de      |  <-----  | Redirecciona con  |
  | Guardadas en |          | Token en Backend    |          | Código de Auth    |
  | Firestore    |          | (Access & Refresh)  |          | (Redirect URI)    |
  +--------------+          +---------------------+          +-------------------+
```

### Paso 3.1: Redireccionar al Inquilino al Portal de TikTok
En tu panel administrativo, el inquilino hace clic en "Conectar mi Cuenta de TikTok Ads", lo cual dispara la redirección:

```typescript
const initiateTikTokOAuth = () => {
  const clientKey = "TU_CLIENT_KEY_OFICIAL";
  const redirectUri = encodeURIComponent("https://tu-app.com/#/app");
  const state = "userId_del_inquilino_autenticado"; // Pasa el uid de Firebase para verificar coherencia
  const scopes = "ads.read,ads.manage,analytics.read";
  
  const authUrl = `https://business-api.tiktok.com/portal/auth?app_id=${clientKey}&state=${state}&redirect_uri=${redirectUri}&scope=${scopes}`;
  window.location.href = authUrl;
};
```

### Paso 3.2: Recepción del Código de Autorización y Canje (Exchange)
Al autorizar el acceso, TikTok redirige al usuario de vuelta a tu `Redirect URI` adjuntando un parámetro `auth_code`:
`https://tu-app.com/#/app?auth_code=CODE_AQUI&state=userId_del_inquilino`

Tu cliente React detecta el `auth_code` y lo envía a tu servidor backend (Cloud Function o API Node.js de Express) para canjearlo de manera segura:

```typescript
// Llamada al Backend canjeadora
const exchangeTikTokCode = async (authCode: string, tenantId: string) => {
  const response = await fetch("https://api.tu-backend.com/tiktok/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: authCode, tenantId })
  });
  return await response.json();
};
```

### Paso 3.3: Lógica del Backend para el Intercambio y Cifrado
Tu servidor ejecuta el canje directo con los endpoints protegidos de TikTok (evitando exponer el `Client Secret` en el navegador del inquilino):

```javascript
// Servidor Backend (Express / Firebase Cloud Function)
app.post("/tiktok/token", async (req, res) => {
  const { code, tenantId } = req.body;
  
  try {
    const response = await axios.post("https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/", {
      secret: "TU_CLIENT_SECRET_DE_TIKTOK",
      app_id: "TU_CLIENT_KEY_DE_TIKTOK",
      auth_code: code,
    });

    const { access_token, refresh_token, advertiser_ids } = response.data.data;

    // Guardar tokens de manera multitenant aislada en Firestore
    await db.collection("connections").doc(tenantId).set({
      platform: "tiktok",
      accessToken: encrypt(access_token), // Cifrar para máxima seguridad
      refreshToken: encrypt(refresh_token),
      advertiserIds: advertiser_ids, // IDs de cuentas publicitarias autorizadas
      updatedAt: new Date().toISOString()
    });

    res.json({ success: true, advertiserIds: advertiser_ids });
  } catch (err) {
    res.status(500).json({ error: "Error canjeando código publicitario de TikTok" });
  }
});
```

---

## 4. Obtención de Analíticas de Campañas en Tiempo Real

Para construir el panel analítico integrado con TikTok, realiza peticiones cronometradas o bajo demanda a la API de Marketing de TikTok utilizando el token del inquilino respectivo.

### Endpoint 4.1: Listar Campañas Activas
Consulta `/open_api/v1.3/campaign/get/` para traer la jerarquía de campañas de un anunciante:

```typescript
const getTikTokCampaigns = async (accessToken: string, advertiserId: string) => {
  const response = await axios.get("https://business-api.tiktok.com/open_api/v1.3/campaign/get/", {
    headers: { "Access-Token": accessToken },
    params: { advertiser_id: advertiserId }
  });
  return response.data.data.list; // Arreglo de campañas publicitarias
};
```

### Endpoint 4.2: Traer Métricas de Conversión (Analíticas Consolidadas)
Consulta el endpoint integrado `/open_api/v1.3/report/integrated/get/` para recopilar impresiones, clics, CTR, costo por clic y conversiones totales filtradas por rangos de fecha y agrupadas por campaña:

```typescript
const getTikTokAdsReport = async (accessToken: string, advertiserId: string) => {
  const response = await axios.get("https://business-api.tiktok.com/open_api/v1.3/report/integrated/get/", {
    headers: { "Access-Token": accessToken },
    params: {
      advertiser_id: advertiserId,
      report_type: "BASIC",
      data_level: "AU_ADVERTISER",
      dimensions: '["stat_time_day"]',
      metrics: '["impressions","clicks","ctr","spend","conversion","cpc"]',
      start_date: "2026-09-01",
      end_date: "2026-09-16"
    }
  });
  return response.data.data.list; // Datos consolidados para graficar
};
```

---

## 5. Reglas de Seguridad de Firestore para Entornos Multitenant

Protege de manera estricta las credenciales de tus integraciones utilizando reglas de seguridad que garanticen el aislamiento a nivel de documento para que un usuario jamás pueda interceptar tokens de otro tenant:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regla de aislamiento de conexiones para TikTok y Analíticas
    match /connections/{tenantId} {
      allow read, write: if request.auth != null && request.auth.uid == tenantId;
    }
    
    // Las páginas de biografía siguen siendo públicas para lectura, pero privadas para edición
    match /bios/{username} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 6. Mantenimiento y Renovación de Tokens (Refrescos Automáticos)
Los Access Tokens de TikTok expiran típicamente cada 24 horas. El Refresh Token tiene una validez mayor (aproximadamente de 11 meses). Tu backend debe automatizar la renovación recurrente cuando la API retorne un error de expiración (`code: 40001` u homólogo):

```javascript
const refreshTikTokAccessToken = async (refreshToken) => {
  const response = await axios.post("https://business-api.tiktok.com/open_api/v1.3/oauth2/refresh_token/", {
    secret: "TU_CLIENT_SECRET",
    app_id: "TU_CLIENT_KEY",
    refresh_token: refreshToken
  });
  return response.data.data.access_token;
};
```
