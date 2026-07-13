# Telvoice AI

Landing independiente de **Telvoice AI**, orientada a implementar agentes de inteligencia artificial, automatización e integraciones en empresas de Latinoamérica.

## Desarrollo local

```bash
python3 -m http.server 8080
```

Abrir `http://localhost:8080`.

## Validación

```bash
npm test
```

## Despliegue en Vercel

1. Importar el repositorio `VictorTelvoice/telvoice.ai` en Vercel.
2. Framework Preset: **Other**.
3. Root Directory: raíz del repositorio.
4. No se requiere Output Directory.
5. Agregar el dominio `telvoice.ai` y luego `www.telvoice.ai` si se desea redirección.

## Formulario

La función `api/contact.js` requiere:

- `CONTACT_WEBHOOK_URL`: endpoint HTTPS que recibirá los leads.
- `CONTACT_WEBHOOK_TOKEN`: token Bearer opcional.

Sin `CONTACT_WEBHOOK_URL`, el formulario entrega un mensaje explícito de canal no configurado y no simula éxito.

## Estado

Primera versión del landing basada en la dirección visual aprobada: isotipo circular, fondo navy, azul/cyan/violeta, red de canales, servicios, proceso, experiencia, equipo y diagnóstico.
