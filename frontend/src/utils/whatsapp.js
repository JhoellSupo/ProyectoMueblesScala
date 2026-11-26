export const SCALA_WHATSAPP_NUMBER = '51923254150';

/**
 * Construye el enlace de WhatsApp con mensaje pre-llenado para cotizar un mueble específico.
 */
export function getProductWhatsAppUrl(product = {}) {
  const nombre = product?.nombre || 'este mueble';
  const precioNum = Number(product?.precio);
  const precioText =
    product?.precio !== undefined &&
    product?.precio !== null &&
    product?.precio !== '' &&
    !Number.isNaN(precioNum)
      ? ` (Precio: S/. ${precioNum.toLocaleString('es-PE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })})`
      : '';

  const message = `Hola Muebles Scala, deseo consultar sobre el mueble: *${nombre}*${precioText}. ¿Podrían brindarme información sobre disponibilidad y tiempos de entrega?`;
  return `https://wa.me/${SCALA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Construye el enlace de WhatsApp para consultas generales desde el pie de página.
 */
export function getGeneralWhatsAppUrl() {
  const message = 'Hola, estoy en su tienda virtual y tengo una duda...';
  return `https://wa.me/${SCALA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
