import { QueryFn } from '@angular/fire/compat/firestore';

export interface IQueryFnWhere {
  path: string;
  operation: any;
  value: string;
}

export class functions {
  /**
   * Añadir condicion where
   *
   * @static
   * @param {QueryFn} qf
   * @param {IQueryFnWhere} whereCondition
   * @return {*}  {QueryFn}
   * @memberof functions
   */
  static editQF(qf: QueryFn, whereCondition: IQueryFnWhere): QueryFn {
    if (qf == null) {
      return (qf = (ref) =>
        ref.where(
          whereCondition.path,
          whereCondition.operation,
          whereCondition.value
        ));
    } else {
      return (ref) => {
        let query: any = qf(ref);
        return query.where(
          whereCondition.path,
          whereCondition.operation,
          whereCondition.value
        );
      };
    }
  }
}
