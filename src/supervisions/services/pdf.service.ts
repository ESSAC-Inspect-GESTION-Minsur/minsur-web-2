import { AppServices } from '@/shared/service/api.service'

export class SupervisionPDFServices extends AppServices {
  constructor () {
    super({ baseUrl: 'supervisions', contentType: 'application/pdf' })
  }

  exportPdf = async (id: string, code: string, type: string): Promise<void> => {
    await this.get<any>(`/${id}/generate-pdf`, {
      responseType: 'blob'
    })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = downloadUrl
        link.download = `${code}_${type}.pdf`.toUpperCase()
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
  }
}
