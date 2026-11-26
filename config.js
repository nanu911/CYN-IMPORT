// ============ CONFIGURACIÓN DE LA TIENDA ============
// Editá solo este archivo para cambiar tus datos.
window.SITE = {
  name: "CYN IMPORT",
  tagline: "Productos importados de calidad. Envíos por zona o retiro en nuestro domicilio. Elegí lo que te guste y escribinos por WhatsApp.",

  // Número con código de país y sin "+" ni espacios. Argentina: 549 + código de área + número.
  // Ejemplo: 5491122334455
  whatsapp: "5491159495036",
  email: "ventas@cynimport.com",
  ciudad: "Buenos Aires, Argentina",
  horario: "Respondemos de lunes a sábado de 7 a 23 hs.",

  // Mensaje que le llega a tu WhatsApp. {producto} y {precio} se reemplazan solos.
  mensaje: "Hola! Me interesa este producto: {producto} ({precio}). ¿Está disponible?",

  // Barra superior (dejala vacía "" para ocultarla)
  barra: "🚚 Envíos por zona con costo adicional · 🏠 Retiro en domicilio · 💵 Efectivo o transferencia",

  // Recargo (%) al pagar por transferencia. Se muestra en el detalle del producto.
  // Si lo cambiás, actualizá también la pregunta de medios de pago.
  recargoTransferencia: 3,

  // Los recuadros debajo del título principal
  beneficios: [
    { icono: "🚚", titulo: "Envíos por zona", detalle: "Con un costo mínimo adicional" },
    { icono: "🏠", titulo: "Retiro en domicilio", detalle: "Coordinamos por WhatsApp" },
    { icono: "💵", titulo: "Formas de pago", detalle: "Efectivo o transferencia (+3%)" },
  ],

  // Preguntas frecuentes (agregá, quitá o cambiá las que quieras)
  faq: [
    { p: "¿Cómo compro?", r: "Tocá \"Ver detalles\" para conocer el producto y después \"Consultar por WhatsApp\" para coordinar la entrega y el pago." },
    { p: "¿Hacen envíos?", r: "Solo hacemos envíos por zona, con un costo mínimo adicional. Escribinos para saber si llegamos a la tuya y cuánto sale." },
    { p: "¿Puedo retirar mi compra?", r: "Sí, podés retirarla por nuestro domicilio. Coordinamos día y horario por WhatsApp." },
    { p: "¿Qué medios de pago aceptan?", r: "Efectivo o transferencia bancaria. Pagando por transferencia se aplica un 3% de recargo." }
  ],

  // Texto del banner naranja de ofertas
  ofertasTitulo: "🔥 Ofertas de la semana",
  ofertasTexto: "Productos seleccionados con precio rebajado. ¡Aprovechá antes de que se agoten!"
};
