import './polyfills';

import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlatteningOperatorsExample } from './app/flattening-operators-example';

@NgModule({
  exports: [
    CdkTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
  ],
})
export class DemoMaterialModule {}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    DemoMaterialModule,
    ReactiveFormsModule,
  ],
  entryComponents: [FlatteningOperatorsExample],
  declarations: [FlatteningOperatorsExample],
  bootstrap: [FlatteningOperatorsExample],
  providers: [],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
