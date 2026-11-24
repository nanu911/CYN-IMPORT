// ============ CONFIGURACIÓN DE LA TIENDA ============
// Editá solo este archivo para cambiar tus datos.
window.SITE = {
  name: "CYN IMPORT",
  tagline: "Productos importados de calidad con garantía y envíos a todo el país. Elegí lo que te guste y escribinos por WhatsApp.",

  // Número con código de país y sin "+" ni espacios. Argentina: 549 + código de área + número.
  // Ejemplo: 5491122334455
  whatsapp: "5491168658567",
  email: "ventas@cynimport.com",
  ciudad: "Buenos Aires, Argentina",
  horario: "Respondemos de lunes a sábado de 7 a 23 hs.",

  // Mensaje que le llega a tu WhatsApp. {producto} y {precio} se reemplazan solos.
  mensaje: "Hola! Me interesa este producto: {producto} ({precio}). ¿Está disponible?",

  // Barra superior (dejala vacía "" para ocultarla)
  barra: "🚚 Envíos x la zona · 💳 Consultá cuotas · 🛡️ Garantía en todos los productos",

  // Cartel "3 cuotas de $X sin interés" en cada producto. Poné 0 para ocultarlo.
  cuotas: 3,

  // Los 4 recuadros debajo del título principal
  beneficios: [
    { icono: "🚚", titulo: "Envíos a todo el país", detalle: "Coordinamos por WhatsApp" },
    { icono: "🛡️", titulo: "Garantía", detalle: "Cambios y devoluciones" },
  ],

  // Preguntas frecuentes (agregá, quitá o cambiá las que quieras)
  faq: [
    { p: "¿Cómo compro?", r: "Elegí tu producto, tocá \"Consultar por WhatsApp\" y te respondemos para coordinar pago y envío." },
    { p: "¿Cuánto tarda el envío?", r: "En AMBA entre 2 y 4 días hábiles; al interior del país entre 4 y 8 días hábiles, según la localidad." },
    { p: "¿Los productos tienen garantía?", r: "Sí. Todos cuentan con garantía por defectos de fábrica. Escribinos por WhatsApp con los datos de tu compra." },
    { p: "¿Qué medios de pago aceptan?", r: "Tarjetas de crédito y débito, transferencia bancaria y efectivo. Los detalles te los pasamos por WhatsApp." },
    { p: "¿Puedo retirar mi compra?", r: "Sí, coordinamos el punto de retiro por WhatsApp." }
  ],

  // Texto del banner naranja de ofertas
  ofertasTitulo: "🔥 Ofertas de la semana",
  ofertasTexto: "Productos seleccionados con precio rebajado. ¡Aprovechá antes de que se agoten!"
};
