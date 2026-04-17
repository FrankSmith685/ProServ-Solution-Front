# Mejoras propuestas para backend de cotizaciones

Este documento resume cambios recomendados para que el flujo comercial de cotizaciones sea más completo y escalable.

## 1) Campos nuevos en `quotes`

- `numero` (string, único): correlativo legible, ejemplo `COT-2026-000123`.
- `fecha_envio` (datetime, nullable): cuándo se envió al cliente.
- `fecha_vencimiento` (date, nullable): vigencia de la cotización.
- `moneda` (string, default `PEN`): soporte multi-moneda.
- `subtotal` (decimal, nullable).
- `impuestos` (decimal, nullable).
- `descuento` (decimal, nullable).
- `total` (decimal, obligatorio para `enviada` o `aprobada`).
- `observaciones` (text, nullable).
- `motivo_rechazo` (text, nullable, obligatorio si `estado = rechazada`).

## 2) Tabla de ítems de cotización

Crear `quote_items`:

- `id`
- `quote_id` (FK)
- `descripcion`
- `cantidad`
- `precio_unitario`
- `subtotal`
- `orden`

Regla recomendada: el `total` de `quotes` se recalcula desde `quote_items`.

## 3) Reglas de transición de estado

Estados actuales frontend:

- `pendiente`
- `enviada`
- `aprobada`
- `rechazada`

Reglas recomendadas:

- `pendiente -> enviada` requiere `total > 0`.
- `enviada -> aprobada` requiere `total > 0`.
- `enviada -> rechazada` requiere `motivo_rechazo`.
- bloquear saltos directos inválidos (`pendiente -> aprobada` sin envío).

## 4) Endpoints sugeridos

- `POST /quotes/:id/send`
  - Marca `estado = enviada`, setea `fecha_envio`.
  - Opcional: dispara envío de correo/WhatsApp template server-side.
- `POST /quotes/:id/items`
- `PUT /quotes/:id/items/:itemId`
- `DELETE /quotes/:id/items/:itemId`
- `GET /quotes/:id/pdf` (render PDF con branding).
- `POST /quotes/:id/approve` y `POST /quotes/:id/reject`.

## 5) Auditoría y trazabilidad

Agregar tabla `quote_events`:

- `id`
- `quote_id`
- `user_id`
- `tipo_evento` (`created`, `status_changed`, `sent_whatsapp`, `sent_email`, etc.)
- `metadata` (json)
- `created_at`

Esto permite timeline por cotización y métricas comerciales.

## 6) Métricas mínimas para panel comercial

- tasa de aprobación (`aprobadas / enviadas`).
- tiempo medio de cierre (`aprobada.created_at - enviada.fecha_envio`).
- monto enviado vs aprobado por rango de fechas.
