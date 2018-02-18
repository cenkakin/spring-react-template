import { defineMessages } from 'react-intl';

export default defineMessages({
  networkError: {
    id: 'srt.request.network.error.message',
    defaultMessage: 'İnternet bağlantınızı kontrol edip, yeniden deneyiniz',
  },
  serverError: {
    id: 'srt.request.server.error.message',
    defaultMessage: 'Hata oluştu',
  },
  timeoutError: {
    id: 'srt.request.timeout.error.message',
    defaultMessage: 'İstek zaman aşımına uğradı, lütfen yeniden deneyiniz',
  },
  unauthorizedError: {
    id: 'srt.request.unauthorizedError.error.message',
    defaultMessage: 'Açık bir oturumunuz bulunmamaktadır',
  },
});
