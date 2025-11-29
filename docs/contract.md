# Contrato de Integración (IDs + Datos)

## LocalStorage keys
- `events_override`: Array<Event> personalizado para listar en `events.html`.
- `ca_user`: { id: string, email: string, role: 'USER' | 'ORGANIZER' }
- `ca_cart`: { eventId: string, qty: number, unitPrice: number, total: number }
- `ca_orders`: Array<{ id: string, createdAt: string, eventId: string, qty: number, total: number, status: 'pending'|'paid'|'canceled', qr?: string }>

## IDs del DOM (no cambiar)

### auth.html
- Inputs: `login-email`, `login-password`, `register-email`, `register-password`, `register-password2`
- Botones: `btn-login`, `btn-register`, `btn-logout`

### checkout.html
- Spans resumen: `checkout-event-name`, `checkout-qty`, `checkout-total`
- Botón: `btn-submit-order`

### account.html
- Tabla de compras: `<tbody id="orders-body">`
- Contenedor de tickets: `<div id="tickets-container">`
- Contenedor QR: `<div id="qr-container">`

### order-confirmation.html
- Campos: `confirm-order-id`, `confirm-order-total`, `confirm-order-status`, `confirm-order-qr`

## Contrato de funciones (stubs)
- `register(email, password, confirmPassword)`
- `login(email, password)` → guarda `ca_user`
- `logout()` → limpia `ca_user`
- `addToCart(eventId, qty, unitPrice)` → guarda `ca_cart`
- `clearCart()`
- `createOrderFromCart(user)` → agrega registro a `ca_orders`
- `renderAccount()` → usa IDs de `account.html`

Regla: Si se cambia algún ID o estructura, actualizar este documento y sincronizar ramas antes de continuar.
