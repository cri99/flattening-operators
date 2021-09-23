import { Component, OnInit } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import {
  tap,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap,
  delay,
} from 'rxjs/operators';

export enum OperatorTypeEnum {
  SWITCH_MAP,
  CONCAT_MAP,
  MERGE_MAP,
  EXHAUST_MAP,
}

export const OperatorTypeEnumMap: {
  [key in OperatorTypeEnum]: typeof switchMap;
} = {
  [OperatorTypeEnum.SWITCH_MAP]: switchMap,
  [OperatorTypeEnum.CONCAT_MAP]: concatMap,
  [OperatorTypeEnum.MERGE_MAP]: mergeMap,
  [OperatorTypeEnum.EXHAUST_MAP]: exhaustMap,
};

@Component({
  selector: 'flattening-operators-example',
  templateUrl: 'flattening-operators-example.html',
  styleUrls: ['flattening-operators-example.scss'],
})
export class FlatteningOperatorsExample implements OnInit {
  /**
   * Array in cui saranno presenti gli ID delle finte chiamate HTTP, i valori saranno immessi nell'array solo una volta ottenuta una risposta dalla relativa chiamata
   */
  httpResponsesIds: number[] = [];

  /**
   * Evento emesso quando l'utente vuole aggiungere un nuovo biscotto
   */
  addCookieEvent$ = new Subject<void>();

  /**
   * Contatore di tutte le finte chiamate HTTP lanciate, utile per assegnare un ID univoco (di fatto un numero progressivo) ad ogni chiamata per tenerne traccia
   */
  httpCallCounter = 0;

  /**
   * Enumatore in cui sono definiti tutti i tipi di flattening operators
   */
  OperatorTypeEnum = OperatorTypeEnum;

  /**
   * Tipo di flattening operator selezionato dall'utente
   */
  selectedOperatorType$: BehaviorSubject<OperatorTypeEnum> =
    new BehaviorSubject(OperatorTypeEnum.SWITCH_MAP);

  ngOnInit() {
    this.selectedOperatorType$
      .pipe(
        switchMap((type) => {
          const operator = OperatorTypeEnumMap[type];
          return this.addCookieEvent$.pipe(operator(() => this.fakeHttpCall()));
        })
      )
      .subscribe();

    this.selectedOperatorType$.subscribe(console.log);
  }

  /**
   * Simula una chiamata HTTP
   */
  fakeHttpCall() {
    const counter = ++this.httpCallCounter;
    return of(null).pipe(
      tap((_) =>
        console.log(
          '%c Avvio chiamata HTTP numero ' + counter,
          'color: #ffc491'
        )
      ),
      // Prima di una qualsiasi risposta, aspetta un minimo di 1 secondo + un tempo pseudocasuale compreso tra 0 e 2 secondi
      delay(Math.random() * 2000 + 1000),
      tap((_) => {
        console.log(
          '%c Risposta dalla chiamata HTTP numero ' + counter,
          'color: #32CD32'
        );

        // Una volta ottenuta la risposta, viene memorizzato l'ID della chiamata così che venga mostrato all'utente
        this.httpResponsesIds.push(counter);
      })
    );
  }

  addOneCookie() {
    this.addCookieEvent$.next();
  }

  clearCookies() {
    this.httpResponsesIds = [];
  }

  selectOperatorType(type: OperatorTypeEnum) {
    this.selectedOperatorType$.next(type);
  }
}
