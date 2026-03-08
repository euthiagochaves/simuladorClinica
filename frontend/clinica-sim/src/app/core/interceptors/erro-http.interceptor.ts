import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const erroHttpInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      let mensagem = 'Ocurrió un error inesperado.';

      if (erro.status === 0) {
        mensagem = 'No fue posible conectarse al servidor. Verifique su conexión.';
      } else if (erro.status === 404) {
        mensagem = 'Recurso no encontrado.';
      } else if (erro.status === 400) {
        mensagem = erro.error?.message || 'Datos inválidos. Verifique los campos.';
      } else if (erro.status === 500) {
        mensagem = 'Error interno del servidor. Intente nuevamente más tarde.';
      }

      console.error(`[ErroHTTP] ${erro.status}: ${mensagem}`, erro);
      return throwError(() => ({ ...erro, mensagemAmigavel: mensagem }));
    })
  );
};
