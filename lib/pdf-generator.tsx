// PDF generation utilities for certificates and results
import html2pdf from "html2pdf.js";

export interface CertificateData {
  codigo: string;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaEmision: string;
  score: number;
  totalQuestions: number;
}

export const generateCertificatePDF = async (
  data: CertificateData
): Promise<void> => {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error("No se pudo abrir la ventana para generar el PDF");
  }

  const percentage = Math.round((data.score / data.totalQuestions) * 100);

  // HTML content for the certificate - A4 size
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Certificado SGD - ${data.codigo}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.4;
          color: #333;
          background: #fff;
          width: 210mm;
          height: 297mm;
          margin: 0 auto;
        }
        
        .certificate {
          width: 210mm;
          height: 297.8mm;
          padding: 20mm;
          border: 8px solid #dc2626;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }
        
        .header {
          text-align: center;
          margin-bottom: 15px;
          border-bottom: 3px solid #dc2626;
          padding-bottom: 15px;
        }
        
        .logo {
          width: 60px;
          height: 60px;
          background: #dc2626;
          border-radius: 50%;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          font-weight: bold;
        }
        
        .institution {
          font-size: 20px;
          font-weight: bold;
          color: #dc2626;
          margin-bottom: 5px;
        }
        
        .department {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }
        
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #dc2626;
          margin: 15px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 25px;
        }
        
        .content {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin: 10px 0;
        }
        
        .recipient {
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .name {
          font-size: 22px;
          font-weight: bold;
          color: #dc2626;
          margin: 15px 0;
          text-transform: uppercase;
          border-bottom: 2px solid #dc2626;
          padding-bottom: 8px;
          display: inline-block;
        }
        
        .dni {
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
          font-family: monospace;
        }
        
        .achievement {
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0 10px;
          color: #333;
          max-width: 90%;
          margin-left: auto;
          margin-right: auto;
        }
        
        .score {
          background: #f0fdf4;
          border: 2px solid #16a34a;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
          display: inline-block;
        }
        
        .score-text {
          font-size: 18px;
          font-weight: bold;
          color: #16a34a;
        }
        
        .footer {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        
        .signature-section {
          text-align: center;
          flex: 1;
        }
        
        .signature-line {
          border-top: 2px solid #333;
          width: 150px;
          margin: 40px auto 8px;
        }
        
        .signature-title {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          line-height: 1.3;
        }
        
        .certificate-info {
          text-align: right;
          flex: 1;
        }
        
        .code {
          font-size: 14px;
          font-weight: bold;
          color: #dc2626;
          font-family: monospace;
          margin-bottom: 5px;
        }
        
        .date {
          font-size: 12px;
          color: #666;
        }
        
        .verification {
          text-align: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
          font-size: 11px;
          color: #666;
          line-height: 1.3;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }
          
          .certificate {
            width: 210mm;
            height: 297mm;
            border: 8px solid #dc2626 !important;
            background: #ffffff !important;
            page-break-after: always;
          }
          
          @page {
            size: A4;
            margin: 0;
          }
        }
        
        /* Media query para pantalla */
        @media screen {
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #f0f0f0;
          }
          
          .certificate {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <div class="logo">SGD</div>
          <div class="institution">GOBIERNO REGIONAL DE AYACUCHO</div>
          <div class="department">Oficina de Tecnologías de la Información</div>
        </div>
        
        <div class="content">
          <h1 class="title">CONSTANCIA DE APROBACIÓN</h1>
          <p class="subtitle">Sistema de Evaluación del Sistema de Gestión Documental</p>
          
          <p class="recipient">Se otorga la presente constancia a:</p>
          
          <div class="name">${data.nombres} ${data.apellidos}</div>
          <div class="dni">DNI: ${data.dni}</div>
          
          <p class="achievement">
            Por haber aprobado satisfactoriamente el examen de evaluación del 
            <strong>Sistema de Gestión Documental</strong>, demostrando conocimientos 
            sólidos en los procesos y herramientas de gestión documental electrónica 
            implementados en el Gobierno Regional de Ayacucho.
          </p>
          
          <div class="score">
            <div class="score-text">
              Calificación Obtenida: ${data.score}/${
    data.totalQuestions
  } (${percentage}%)
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="signature-section">
            <div class="signature-line"></div>
            <div class="signature-title">Jefe de la Oficina de<br>Tecnologías de la Información</div>
          </div>
          
          <div class="certificate-info">
            <div class="code">Código: ${data.codigo}</div>
            <div class="date">Ayacucho, ${
              data.fechaEmision
                ? new Date(data.fechaEmision).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) +
                  " " +
                  new Date(data.fechaEmision).toLocaleTimeString("es-PE", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "Sin fecha" /*new Date(data.fechaEmision).toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })*/
            }</div>
          </div>
        </div>
        
        <div class="verification">
          <p><strong>Verificación:</strong> Este certificado puede ser verificado en línea ingresando a:</p>
          <p><strong>${window.location.origin}/verificar</strong></p>
          <p>Código de verificación: <strong>${data.codigo}</strong></p>
        </div>
      </div>
      
      <script>
        // Auto-print after load
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          }, 1000);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const downloadCertificateHTML = async (data: CertificateData): Promise<void> => {
  const percentage = Math.round((data.score / data.totalQuestions) * 100);

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificado SGD - ${data.codigo}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      line-height: 1.4; 
      color: #333; 
      background: #fff; 
      width: 210mm;
      height: 297mm;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #f0f0f0;
    }
    .certificate { 
      width: 210mm;
      height: 296.8mm;
      padding: 20mm;
      border: 8px solid #dc2626; 
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .header { text-align: center; margin-bottom: 15px; border-bottom: 3px solid #dc2626; padding-bottom: 15px; }
    .logo { width: 60px; height: 60px; background: #dc2626; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; }
    .institution { font-size: 20px; font-weight: bold; color: #dc2626; margin-bottom: 5px; }
    .department { font-size: 14px; color: #666; margin-bottom: 10px; }
    .title { font-size: 24px; font-weight: bold; color: #dc2626; margin: 15px 0; text-transform: uppercase; letter-spacing: 1px; }
    .subtitle { font-size: 16px; color: #666; margin-bottom: 25px; }
    .content { text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; margin: 10px 0; }
    .recipient { font-size: 16px; margin-bottom: 8px; }
    .name { font-size: 22px; font-weight: bold; color: #dc2626; margin: 15px 0; text-transform: uppercase; border-bottom: 2px solid #dc2626; padding-bottom: 8px; display: inline-block; }
    .dni { font-size: 16px; color: #666; margin-bottom: 20px; font-family: monospace; }
    .achievement { font-size: 16px; line-height: 1.6; margin: 20px 0 10px; color: #333; max-width: 90%; margin-left: auto; margin-right: auto; }
    .score { background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 15px; margin: 15px 0; display: inline-block; }
    .score-text { font-size: 18px; font-weight: bold; color: #16a34a; }
    .footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .signature-section { text-align: center; flex: 1; }
    .signature-line { border-top: 2px solid #333; width: 150px; margin: 40px auto 8px; }
    .signature-title { font-size: 12px; font-weight: bold; color: #666; line-height: 1.3; }
    .certificate-info { text-align: right; flex: 1; }
    .code { font-size: 14px; font-weight: bold; color: #dc2626; font-family: monospace; margin-bottom: 5px; }
    .date { font-size: 12px; color: #666; }
    .verification { text-align: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #666; line-height: 1.3; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="header">
      <div class="logo">SGD</div>
      <div class="institution">GOBIERNO REGIONAL DE AYACUCHO</div>
      <div class="department">Oficina de Tecnologías de la Información</div>
    </div>
    
    <div class="content">
      <h1 class="title">CONSTANCIA DE APROBACIÓN</h1>
      <p class="subtitle">Sistema de Evaluación del Sistema de Gestión Documental</p>
      
      <p class="recipient">Se otorga la presente constancia a:</p>
      
      <div class="name">${data.nombres} ${data.apellidos}</div>
      <div class="dni">DNI: ${data.dni}</div>
      
      <p class="achievement">
        Por haber aprobado satisfactoriamente el examen de evaluación del 
        <strong>Sistema de Gestión Documental</strong>, demostrando conocimientos 
        sólidos en los procesos y herramientas de gestión documental electrónica 
        implementados en el Gobierno Regional de Ayacucho.
      </p>
      
      <div class="score">
        <div class="score-text">
          Calificación Obtenida: ${data.score}/${
    data.totalQuestions
  } (${percentage}%)
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div class="signature-section">
        <div class="signature-line"></div>
        <div class="signature-title">Jefe de la Oficina de<br>Tecnologías de la Información</div>
      </div>
      
      <div class="certificate-info">
        <div class="code">Código: ${data.codigo}</div>
        <div class="date">Ayacucho, ${new Date(
          data.fechaEmision
        ).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}</div>
      </div>
    </div>
    
    <div class="verification">
      <p><strong>Verificación:</strong> Este certificado puede ser verificado en línea ingresando a:</p>
      <p><strong>${window.location.origin}/verificar</strong></p>
      <p>Código de verificación: <strong>${data.codigo}</strong></p>
    </div>
  </div>
</body>
</html>
  `;

  /*const blob = new Blob([htmlContent], { type: "text/html" })
  const url = URL.createObjectURL(blob);*/

  // Crear el Blob como PDF
  /*const blob = new Blob([htmlContent], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);*/

  /*const a = document.createElement("a");
  a.href = url;
  //a.download = `Certificado_SGD_${data.codigo}.html`;
  a.download = `Certificado_SGD_${data.codigo}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);*/

  // Crear elemento temporal en el DOM
  const element = document.createElement("div");
  element.innerHTML = htmlContent;

  html2pdf()
    .from(element)
    .set({
      margin: 0,
      filename: `Certificado_SGD_${data.codigo}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};
