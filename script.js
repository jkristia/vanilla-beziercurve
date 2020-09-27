"use strict";
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    ;
    Point.prototype.snap = function () {
        var snap = 5;
        this.x = Math.round(this.x / snap) * snap;
        this.y = Math.round(this.y / snap) * snap;
        return this;
    };
    return Point;
}());
var Circle = /** @class */ (function () {
    function Circle(x, y) {
        this.elm = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this._point = new Point(0, 0);
        this.point = new Point(x, y);
        this.setPosition(x, y);
    }
    Object.defineProperty(Circle.prototype, "point", {
        get: function () {
            return this._point;
        },
        set: function (value) {
            this._point = value;
            this.setPosition(value.x, value.y);
        },
        enumerable: false,
        configurable: true
    });
    ;
    Circle.prototype.setPosition = function (x, y) {
        this.elm.setAttribute('cx', x.toString());
        this.elm.setAttribute('cy', y.toString());
    };
    return Circle;
}());
var Main = /** @class */ (function () {
    function Main() {
        this._pathElm = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._controlLines = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._startPoint = new Circle(170, 140);
        this._controlPoint1 = new Circle(300, 130);
        this._center = new Circle(300, 190);
        this._controlPoint2 = new Circle(230, 170);
        this._endPoint = new Circle(190, 210);
        this._points = [this._startPoint, this._controlPoint1, this._center, this._endPoint, this._controlPoint2];
        this._dragging = false;
        this._activePoint = null;
        this._svg = document.querySelector('svg');
        this._startPoint.elm.classList.add('point');
        this._endPoint.elm.classList.add('point');
        this._controlPoint1.elm.classList.add('control-point');
        this._controlPoint2.elm.classList.add('control-point');
        this._center.elm.classList.add('center-point');
        this._controlLines.classList.add('control-lines');
        this._svg.appendChild(this._controlLines);
        this._svg.appendChild(this._pathElm);
        this._svg.appendChild(this._startPoint.elm);
        this._svg.appendChild(this._endPoint.elm);
        this._svg.appendChild(this._controlPoint1.elm);
        this._svg.appendChild(this._controlPoint2.elm);
        this._svg.appendChild(this._center.elm);
        this.setupListener();
        this.render();
    }
    Main.prototype.setupListener = function () {
        var _this = this;
        this._points.forEach(function (p) {
            p.elm.onmouseenter = function (e) {
                if (!_this._dragging) {
                    _this._activePoint = p;
                }
            };
            p.elm.onmouseleave = function (e) {
                if (!_this._dragging) {
                    _this._activePoint = null;
                }
            };
        });
        document.addEventListener('mousedown', function (e) {
            _this.handleOnMouseDown(e);
        });
        document.addEventListener('mousemove', function (e) {
            _this.handleOnMouseMove(e);
        });
        document.addEventListener('mouseup', function (e) {
            _this.handleOnMouseUp(e);
        });
    };
    Main.prototype.pointFromMousePosition = function (e) {
        var r = this._svg.getBoundingClientRect();
        return new Point(e.clientX - r.x, e.clientY - r.y).snap();
    };
    Main.prototype.handleOnMouseDown = function (e) {
        var p = this.pointFromMousePosition(e);
        if (this._activePoint) {
            this._dragging = true;
        }
    };
    Main.prototype.handleOnMouseMove = function (e) {
        var p = this.pointFromMousePosition(e);
        if (this._dragging && this._activePoint) {
            this._activePoint.point = p;
            this.render();
        }
    };
    Main.prototype.handleOnMouseUp = function (e) {
        this._dragging = false;
        this._activePoint = null;
    };
    Main.prototype.render = function () {
        // curve path
        var path = "M " + this._startPoint.point.x + " " + this._startPoint.point.y;
        path += "Q " + this._controlPoint1.point.x + " " + this._controlPoint1.point.y + " " + this._center.point.x + " " + this._center.point.y + " ";
        path += "Q " + this._controlPoint2.point.x + " " + this._controlPoint2.point.y + " " + this._endPoint.point.x + " " + this._endPoint.point.y + " ";
        this._pathElm.setAttribute('d', path);
        // control line path
        path = "M " + this._startPoint.point.x + " " + this._startPoint.point.y;
        path += "L " + this._controlPoint1.point.x + " " + this._controlPoint1.point.y;
        path += "L " + this._center.point.x + " " + this._center.point.y;
        path += "L " + this._controlPoint2.point.x + " " + this._controlPoint2.point.y;
        path += "L " + this._endPoint.point.x + " " + this._endPoint.point.y;
        this._controlLines.setAttribute('d', path);
        // info text
        path = "P1 (" + this._startPoint.point.x + ", " + this._startPoint.point.y + "), ";
        path += "C1 (" + this._controlPoint1.point.x + ", " + this._controlPoint1.point.y + "), ";
        path += "Center (" + this._center.point.x + ", " + this._center.point.y + "), ";
        path += "C2 (" + this._controlPoint2.point.x + ", " + this._controlPoint2.point.y + "), ";
        path += "P2 (" + this._endPoint.point.x + ", " + this._endPoint.point.y + ")";
        var txtelm = document.querySelector('.info');
        txtelm.innerText = path;
    };
    return Main;
}());
var main = new Main();
