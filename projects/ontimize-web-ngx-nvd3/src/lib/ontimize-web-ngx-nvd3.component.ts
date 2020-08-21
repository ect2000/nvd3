// import './custom_models/gauge.js';
// import './custom_models/gaugeChart.js';
// import './custom_models/packedBubble.js';
// import './custom_models/packedBubbleChart.js';
// import './custom_models/radar.js';
// import './custom_models/radarChart.js';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import * as Hammer from 'hammerjs';
import * as nv from 'nvd3';
import * as nvExtra from 'nvd3-extra';


@Component({
    selector: 'nvd3',
    template: ``,
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
          nvd3 {
            display: block;
            width: 100%;
          }
        `
    ],
    exportAs: 'nvd3'
})

export class nvD3 implements OnChanges {
    @Input() options: any;
    @Input() data: any;
    private el: any;
    private chart: any;
    private svg: any;
    private mc: any;

    @Output('onTap')        onTap       = new EventEmitter();

    @Output('onDoubleTap')  onDoubleTap = new EventEmitter();

    @Output('onPress')      onPress     = new EventEmitter();

    @Output('onSwipe')      onSwipe     = new EventEmitter();

    @Output('onRotate')     onRotate    = new EventEmitter();

    @Output('onPinch')      onPinch     = new EventEmitter();

    constructor(private elementRef: ElementRef) {
      this.el = elementRef.nativeElement;

        this.touchEventManager();

    }

    touchEventManager() {
        const self = this;

        this.mc = new Hammer.Manager(this.el, {
            domEvents: true,
            enable: true
        });
        var singleTap = new Hammer.Tap({event: 'singleTap'});
        var doubleTap = new Hammer.Tap({ event: 'doubleTap', taps: 2});
        var press = new Hammer.Press({event: 'press', time: 300});
        var slide = new Hammer.Swipe({event: "swipe"});
        var rotate = new Hammer.Rotate({event: "rotate"});
        var pinch = new Hammer.Pinch({event: 'pinch'});
        singleTap.requireFailure(doubleTap);
        singleTap.requireFailure(press);
        doubleTap.recognizeWith(singleTap);
        doubleTap.dropRequireFailure(singleTap);
        press.recognizeWith(singleTap);
        press.dropRequireFailure(singleTap);
        this.mc.add([singleTap, doubleTap, press, slide, rotate, pinch]);
        this.mc.get("singleTap").set({enable: true});
        this.mc.on("singleTap", function(event){
            event.preventDefault();
            event.srcEvent.preventDefault();
            self.onTap.emit(event);
        });
        this.mc.get("doubleTap").set({enable: true});
        this.mc.on("doubleTap", function(event){
            event.preventDefault();
            event.srcEvent.preventDefault();
            self.onDoubleTap.emit(event);
        });
        this.mc.get("press").set({enable: true});
        this.mc.on("press", function(event) {
            event.preventDefault();
            event.srcEvent.preventDefault();
            self.onPress.emit(event);
        });
        this.mc.get("swipe").set({enable: true});
        this.mc.on("swipe", (event) => {
            //event.preventDefault();
            //event.srcEvent.preventDefault();
            self.onSwipe.emit(event);
        });
        this.mc.get("rotate").set({enable: true});
        this.mc.on("rotate", (event) => {
            event.preventDefault();
            event.srcEvent.preventDefault();
            self.onRotate.emit(event);
        });
        this.mc.get("pinch").set({enable: true});
        this.mc.on("pinch", (event) => {
            event.preventDefault();
            event.srcEvent.preventDefault();
            self.onPinch.emit(event);
        });

    }

    ngOnChanges(changes: SimpleChanges) {
        let self = this;

        this.updateWithOptions(this.options);
    }

    updateWithOptions(options) {
        let self = this;

        // Clearing
        this.clearElement();

        // Exit if options are not yet bound
        if (!options) return;

        // Initialize chart with specific type
        this.chart = nv.models[options.chart.type]();

        // Generate random chart ID
        this.chart.id = Math.random().toString(36).substr(2, 15);

        for (let key in this.chart) {
            if (!this.chart.hasOwnProperty(key)) continue;

            let value = this.chart[key];


            if (key[0] === '_') {
            }
            else if ([
                    'clearHighlights',
                    'highlightPoint',
                    'id',
                    'options',
                    'resizeHandler',
                    'state',
                    'open',
                    'close',
                    'tooltipContent'
                ].indexOf(key) >= 0) {
            }

            else if (key === 'dispatch') nvD3.configureEvents(this.chart[key], options.chart[key]);

            else if ([
                    'bars',
                    'bars1',
                    'bars2',
                    'boxplot',
                    'bullet',
                    'controls',
                    'discretebar',
                    'distX',
                    'distY',
                    'interactiveLayer',
                    'legend',
                    'lines',
                    'lines1',
                    'lines2',
                    'multibar',
                    'pie',
                    'scatter',
                    'scatters1',
                    'scatters2',
                    'sparkline',
                    'stack1',
                    'stack2',
                    'sunburst',
                    'tooltip',
                    'x2Axis',
                    'xAxis',
                    'y1Axis',
                    'y2Axis',
                    'y3Axis',
                    'y4Axis',
                    'yAxis',
                    'yAxis1',
                    'yAxis2'
                ].indexOf(key) >= 0 ||
                // stacked is a component for stackedAreaChart, but a boolean for multiBarChart and multiBarHorizontalChart
                (key === 'stacked' && options.chart.type === 'stackedAreaChart')) {
                this.configure(this.chart[key], options.chart[key], options.chart.type);
            }

            //TODO: need to fix bug in nvd3
            else if ((key === 'xTickFormat' || key === 'yTickFormat') && options.chart.type === 'lineWithFocusChart') {
            }
            else if ((key === 'tooltips') && options.chart.type === 'boxPlotChart') {
            }
            else if ((key === 'tooltipXContent' || key === 'tooltipYContent') && options.chart.type === 'scatterChart') {
            }

            else if (options.chart[key] === undefined || options.chart[key] === null) {
            }
            else this.chart[key](options.chart[key]);
        }

        this.updateWithData(this.data);

        // nv.addGraph(function () {
        //   if (!self.chart) return;
        //
        //   // Remove resize handler. Due to async execution should be placed here, not in the clearElement
        //   if (self.chart.resizeHandler) self.chart.resizeHandler.clear();
        //
        //   // Update the chart when window resizes
        //   self.chart.resizeHandler = nv.utils.windowResize(function () {
        //     self.chart && self.chart.update && self.chart.update();
        //   });
        //
        //   return self.chart;
        // }, options.chart['callback']);

        nv.addGraph({
            generate: function () {
                if (!self.chart) return;

                // Remove resize handler. Due to async execution should be placed here, not in the clearElement
                if (self.chart.resizeHandler) self.chart.resizeHandler.clear();

                // let width = nv.utils.windowSize().width,
                //   height = nv.utils.windowSize().height;
                // let chart = nv.models.multiBarChart()
                //   .width(width)
                //   .height(height)
                //   .stacked(true);
                // chart.dispatch.on('renderEnd', function () {
                //   console.log('Render Complete');
                // });
                // let svg = d3.select(elem).datum(data);
                // console.log('calling chart');
                // svg.transition().duration(0).call(chart);
                return self.chart;
            },
            callback: function (graph) {
                nv.utils.windowResize(function () {
                    // let width = nv.utils.windowSize().width;
                    // let height = nv.utils.windowSize().height;
                    // graph.width(width).height(height);
                    // d3.select(elem)
                    //   .attr('width', width)
                    //   .attr('height', height)
                    //   .transition().duration(0)
                    //   .call(graph);

                    self.update();
                });

                self.update();

                options.chart['callback'] && options.chart['callback']();
            }
        });
    }

    update() {
        let self = this;
        self.chart && self.chart.update && self.chart.update();
    }

    updateWithData(data) {
        if (data) {
            // remove whole svg element with old data
            d3.select(this.el).select('svg').remove();

            let h, w;

            // Select the current element to add <svg> element and to render the chart in
            this.svg = d3.select(this.el).append('svg');
            if (h = this.options.chart.height) {
                if (!isNaN(+h)) h += 'px';
                this.svg.attr('height', h).style({height: h});
            }
            if (w = this.options.chart.width) {
                if (!isNaN(+w)) w += 'px';
                this.svg.attr('width', w).style({width: w});
            } else {
                this.svg.attr('width', '100%').style({width: '100%'});
            }

            this.svg.datum(data).call(this.chart);
        }
    }

    configure(chart, options, chartType) {
        if (chart && options) {

            for (let key in chart) {
                if (!chart.hasOwnProperty(key)) continue;

                let value = chart[key];

                if (key[0] === '_') {
                }
                else if (key === 'dispatch') nvD3.configureEvents(value, options[key]);
                else if (key === 'tooltip') this.configure(chart[key], options[key], chartType);
                else if (key === 'contentGenerator') {
                    if (options[key]) chart[key](options[key]);
                }
                else if ([
                        'axis',
                        'clearHighlights',
                        'defined',
                        'highlightPoint',
                        'nvPointerEventsClass',
                        'options',
                        'rangeBand',
                        'rangeBands',
                        'scatter',
                        'open',
                        'close'
                    ].indexOf(key) === -1) {
                    if (options[key] === undefined || options[key] === null) {
                    }
                    else chart[key](options[key]);
                }
            }

        }
    }

    static configureEvents(dispatch, options) {
        if (dispatch && options) {
            for (let key in dispatch) {
                if (!dispatch.hasOwnProperty(key)) continue;

                let value = dispatch[key];

                if (options[key] === undefined || options[key] === null) {
                }
                else dispatch.on(key + '._', options[key]);
            }
        }
    }

    clearElement() {
        this.el.innerHTML = '';

        // remove tooltip if exists
        if (this.chart && this.chart.tooltip && this.chart.tooltip.id) {
            d3.select('#' + this.chart.tooltip.id()).remove();
        }

        // To be compatible with old nvd3 (v1.7.1)
        if (nv['graphs'] && this.chart) {
            for (let i = nv['graphs'].length - 1; i >= 0; i--) {
                if (nv['graphs'][i] && (nv['graphs'][i].id === this.chart.id)) {
                    nv['graphs'].splice(i, 1);
                }
            }
        }
        if (nv.tooltip && nv.tooltip.cleanup) {
            nv.tooltip.cleanup();
        }
        if (this.chart && this.chart.resizeHandler) this.chart.resizeHandler.clear();
        this.chart = null;
    }
}