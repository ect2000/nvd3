# ontimize-web-ngx-nvd3
Angular component for nvd3. Forked from daominhsangvn/ng2-nvd3@1.1.3

[![Build Status](https://travis-ci.org/krispo/ng2-nvd3.svg?branch=master)](https://travis-ci.org/krispo/ng2-nvd3)
[![NPM Version](http://img.shields.io/npm/v/ng2-nvd3.svg?style=flat)](https://www.npmjs.org/package/ng2-nvd3)

Angular component for nvd3. It has similar technique as [angular-nvd3](http://krispo.github.io/angular-nvd3) for angular 1, but designed for angular 2 and without extra features (like extended mode) you won't need.

## Demos

Online demos:

1. [web page](http://krispo.github.io/ng2-nvd3)
2. [plnkr](http://plnkr.co/edit/T4i7Zh?p=preview)

## Install

    npm install ng2-nvd3 d3@^3 nvd3

it requires `angular`, `d3` and `nvd3` and `nvd3-extra` as dependencies. Tested with the current `@angular` version `~8.2.14`.

## Basic usage

### Simple bar chart
Note: `d3` and `nvd3` should be also included in your project bundle.

Simple discrete bar chart:

```js
app.component.ts

import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'main',
  template: `
    <div>
      <nvd3 [options]="options" [data]="data"></nvd3>
    </div>
  `
})

export class Main implements OnInit{
  options;
  data;
  ngOnInit(){
    this.options = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showValues: true,
        valueFormat: function(d){
          return d3.format(',.4f')(d);
        },
        duration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: -10
        }
      }
    }
    this.data = [
      {
        key: "Cumulative Return",
        values: [
          {
            "label" : "A" ,
            "value" : -29.765957771107
          } ,
          {
            "label" : "B" ,
            "value" : 0
          } ,
          {
            "label" : "C" ,
            "value" : 32.807804682612
          } ,
          {
            "label" : "D" ,
            "value" : 196.45946739256
          } ,
          {
            "label" : "E" ,
            "value" : 0.19434030906893
          } ,
          {
            "label" : "F" ,
            "value" : -98.079782601442
          } ,
          {
            "label" : "G" ,
            "value" : -13.925743130903
          } ,
          {
            "label" : "H" ,
            "value" : -5.1387322875705
          }
        ]
      }
    ];
  }

}

app.module.ts

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Main }  from 'app.component';

import 'd3';
import 'nvd3';
import {NvD3Module} from 'ng2-nvd3';

@NgModule({
  imports:      [ BrowserModule, NvD3Module ],
  declarations: [ Main ],
  bootstrap:    [ Main ]
})
export class AppModule { }
```

### Usage directive `api`

No need to use `api` as in angular 1 case. We can get access to directive instance from parent component via `@ViewChild`:

```js
import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {nvD3} from 'ng2-nvd3';

@Component({
  selector: 'main',
  template: `<div><nvd3 #chart [options]="options" [data]="data"></nvd3></div>`
})
export class Main {
  options;
  data;

  @ViewChild('chart')
  nvD3: nvD3;

  ngOnInit(){
    this.options = {...};
    this.data = [...];
  }

  ngAfterViewInit() {
    // this.nvD3 - directive instance
    // for example, to update the chart
    this.nvD3.update();
  }
}
```

## Tests

    npm test

## Change Log

#### 8.0.0 (master)
* Angular 8

## License
MIT

