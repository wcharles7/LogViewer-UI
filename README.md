# Log Viewer

Application de monitoring des logs pour ton portail e-commerce.
Lit directement depuis ta table MySQL `log_entries`.

---

## Structure

```
log-viewer/
├── api/                          ← Fichiers à ajouter dans ton projet .NET
│   ├── Domain/Entities/
│   │   └── LogEntryEntity.cs
│   ├── Application/
│   │   ├── DTOs/Log/LogDtos.cs
│   │   └── Interfaces/Log/ILogQueryService.cs
│   ├── Infrastructure/Services/Log/
│   │   └── LogQueryService.cs
│   └── WebApi/
│       ├── Controllers/Log/LogEntryController.cs
│       └── Program_additions.cs  ← Lignes à ajouter dans Program.cs
│
└── react-app/                    ← Application React standalone
    ├── src/
    │   ├── api/logApi.ts
    │   ├── hooks/useLogs.ts
    │   ├── components/
    │   │   ├── LevelBadge.tsx
    │   │   ├── StatCard.tsx
    │   │   ├── LogTable.tsx
    │   │   ├── LogDetail.tsx
    │   │   ├── FiltersBar.tsx
    │   │   └── Pagination.tsx
    │   ├── App.tsx
    │   └── index.tsx
    ├── public/index.html
    ├── package.json
    ├── tsconfig.json
    └── .env
```

---

## Setup API .NET

### 1. Copier les fichiers
Copie les fichiers du dossier `api/` dans ton projet existant en respectant la structure.

### 2. Ajouter dans Program.cs
```csharp
// DI
builder.Services.AddScoped<ILogQueryService, LogQueryService>();

// CORS
builder.Services.AddCors(options =>
    options.AddPolicy("LogViewer", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()));

// Middleware
app.UseCors("LogViewer");
```

### 3. Endpoints disponibles
| Endpoint | Description |
|---|---|
| `GET /logs/get` | Logs paginés avec filtres |
| `GET /logs/get/{id}` | Détail d'un log |
| `GET /logs/stats` | Statistiques globales |
| `GET /logs/sources` | Liste des sources |

### 4. Paramètres de filtre (GET /logs/get)
| Paramètre | Type | Exemple |
|---|---|---|
| `levelName` | string | `Error` |
| `source` | string | `MonCashPaymentController` |
| `correlationId` | string | `a3f9c2b1-...` |
| `userId` | string | `f1e2d3c4-...` |
| `search` | string | `Unhandled exception` |
| `statusCode` | int | `500` |
| `httpMethod` | string | `POST` |
| `dateFrom` | datetime | `2024-01-15T00:00:00` |
| `dateTo` | datetime | `2024-01-15T23:59:59` |
| `page` | int | `1` |
| `pageSize` | int | `50` |

---

## Setup React App

### 1. Installer les dépendances
```bash
cd react-app
npm install
```

### 2. Configurer l'URL de l'API
Dans `.env` :
```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Lancer l'app
```bash
npm start
# → http://localhost:3000
```

### 4. Build production
```bash
npm run build
```

---

## Fonctionnalités

- Tableau des logs avec pagination (50 par page)
- Filtres : level, source, correlationId, method, date range, recherche full-text
- Clic sur une ligne → panneau détail avec tous les champs
- Exception affichée avec stack trace complète
- Metadata JSON formaté
- Statistiques en temps réel (total, errors, warnings, info)
- Auto-refresh toutes les 15 secondes
- Couleur du status code (vert/orange/rouge)

---

## Sécuriser en production

Ajouter un middleware de clé API dans `Program.cs` :

```csharp
app.Use(async (context, next) =>
{
    if (context.Request.Path.StartsWithSegments("/logs"))
    {
        if (!context.Request.Headers.TryGetValue("X-Log-Key", out var key)
            || key != Environment.GetEnvironmentVariable("LOG_VIEWER_KEY"))
        {
            context.Response.StatusCode = 401;
            return;
        }
    }
    await next();
});
```

Et dans `.env` du React :
```
REACT_APP_LOG_KEY=ta_clé_secrète
```

Puis dans `logApi.ts`, ajouter le header à chaque requête :
```typescript
headers: { 'X-Log-Key': process.env.REACT_APP_LOG_KEY ?? '' }
```
