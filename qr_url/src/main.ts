import { applets } from '@web-applets/sdk';

declare const QRCode: any;

const context = applets.register();

context.setActionHandler('generateQRCode', async (parameters) => {
  const qrContainer = document.getElementById('qrCode');
  if (!qrContainer) return;

  const text = parameters.text?.trim();
  if (!text) {
    qrContainer.innerHTML = '<p>No text provided for QR code.</p>';
    return;
  }

  qrContainer.innerHTML = '';

  new QRCode(qrContainer, {
    text,
    width: 200,
    height: 200,
  });

  context.data = { generatedFor: text };
});
