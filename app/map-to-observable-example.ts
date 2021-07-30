import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/observable/of';
import {
  tap,
  switchMap,
  filter,
  mergeMap,
  concatMap,
  exhaustMap,
  delay
} from 'rxjs/operators';

export enum OperatorTypeEnum {
  SWITCH_MAP,
  CONCAT_MAP,
  MERGE_MAP,
  EXHAUST_MAP
}

@Component({
  selector: 'map-to-observable-example',
  templateUrl: 'map-to-observable-example.html',
  styleUrls: ['map-to-observable-example.scss']
})
export class MapToObservableExample implements OnInit {
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
   * Enumatore in cui sono definiti tutti i tipi di map-to-observable
   */
  OperatorTypeEnum = OperatorTypeEnum;

  /**
   * Tipo di operatore map-to-observable selezionato dall'utente
   */
  selectedOperatorType: OperatorTypeEnum = OperatorTypeEnum.SWITCH_MAP;

  ngOnInit() {
    this.addCookieEvent$
      .pipe(tap(_ => console.log('Voglio aggiungere un nuovo biscotto!')))
      .subscribe();

    // Si inizializza una subscription per ogni tipo di map-to-observable. Tutte le subs rimangono in ascolto sull'evento di aggiunta di un nuovo biscotto.
    this.setupSwitchMapListener();
    this.setupMergeMapListener();
    this.setupConcatMapListener();
    this.setupExhaustMapListener();
  }

  setupSwitchMapListener() {
    this.addCookieEvent$
      .pipe(
        this.filterForOperatorType(OperatorTypeEnum.SWITCH_MAP),
        switchMap(this.launchHttpFakeCallAndIncrementCallsCounter())
      )
      .subscribe();
  }

  setupMergeMapListener() {
    this.addCookieEvent$
      .pipe(
        this.filterForOperatorType(OperatorTypeEnum.MERGE_MAP),
        mergeMap(this.launchHttpFakeCallAndIncrementCallsCounter())
      )
      .subscribe();
  }

  setupConcatMapListener() {
    this.addCookieEvent$
      .pipe(
        this.filterForOperatorType(OperatorTypeEnum.CONCAT_MAP),
        concatMap(this.launchHttpFakeCallAndIncrementCallsCounter())
      )
      .subscribe();
  }

  setupExhaustMapListener() {
    this.addCookieEvent$
      .pipe(
        this.filterForOperatorType(OperatorTypeEnum.EXHAUST_MAP),
        exhaustMap(this.launchHttpFakeCallAndIncrementCallsCounter())
      )
      .subscribe();
  }

  /**
   * Custom pipe utile per far partire le chiamate solo per il tipo di RxJs attualmente selezionato dall'utente
   */
  filterForOperatorType(operatorType: OperatorTypeEnum) {
    return (sourceObs: Observable<void>) => {
      return sourceObs.pipe(
        filter(_ => this.selectedOperatorType === operatorType)
      );
    };
  }

  launchHttpFakeCallAndIncrementCallsCounter() {
    return _ => this.fakeHttpCall(++this.httpCallCounter);
  }

  /**
   * Simula una chiamata HTTP
   */
  fakeHttpCall(httpCallId: number) {
    return of(null).pipe(
      tap(_ =>
        console.log(
          '%c Avvio chiamata HTTP numero ' + httpCallId,
          'color: #ffc491'
        )
      ),
      // Prima di una qualsiasi risposta, aspetta un minimo di 1 secondo + un tempo pseudocasuale compreso tra 0 e 2 secondi
      delay(Math.random() * 2000 + 1000),
      tap(_ => {
        console.log(
          '%c Risposta dalla chiamata HTTP numero ' + httpCallId,
          'color: #32CD32'
        );

        // Una volta ottenuta la risposta, viene memorizzato l'ID della chiamata così che venga mostrato all'utente
        this.httpResponsesIds.push(httpCallId);
      })
    );
  }

  /**
   * Emette un evento nel subject addCookieEvent$
   */
  addOneCookie() {
    this.addCookieEvent$.next();
  }

  clearCookies() {
    this.httpResponsesIds = [];
  }
}
