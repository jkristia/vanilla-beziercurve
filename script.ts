// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

class Point {
	constructor(public x: number, public y: number) {};
	public snap(): Point {
		const snap = 5;
		this.x = Math.round(this.x / snap) * snap;
		this.y = Math.round(this.y / snap) * snap;
		return this;
	}
}
class Circle {
	elm = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	private _point = new Point(0, 0);
	public get point(): Point {
		return this._point;
	}
	public set point(value: Point) {
		this._point = value;
		this.setPosition(value.x, value.y);
	}
	constructor(x: number, y: number) {
		this.point = new Point(x,y);
		this.setPosition(x, y);
	};
	private setPosition(x: number, y: number) {
		this.elm.setAttribute('cx', x.toString());
		this.elm.setAttribute('cy', y.toString());
	}
}

class Main {

	private _svg: SVGSVGElement;
	private _pathElm = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	private _controlLines = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	private _startPoint = new Circle(170, 140);
	private _controlPoint1 = new Circle(300, 130);
	private _center = new Circle(300, 190);
	private _controlPoint2 = new Circle(230, 170);
	private _endPoint = new Circle(190, 210);
	private _points = [this._startPoint, this._controlPoint1, this._center, this._endPoint, this._controlPoint2 ];
	
	constructor() {
		this._svg = document.querySelector('svg') as SVGSVGElement;
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
	private setupListener() {
		this._points.forEach( p => {
			p.elm.onmouseenter = (e) => {
				if (!this._dragging) {
					this._activePoint = p;
				}
			}
			p.elm.onmouseleave = (e) => {
				if (!this._dragging) {
					this._activePoint = null;
				}
			}
		})
		document.addEventListener('mousedown', (e) => {
			this.handleOnMouseDown(e);
		});
		document.addEventListener('mousemove', (e) => {
			this.handleOnMouseMove(e);
		});
		document.addEventListener('mouseup', (e) => {
			this.handleOnMouseUp(e);
		});
	}
	private _dragging = false;
	private _activePoint: Circle | null = null;

	private pointFromMousePosition(e: MouseEvent): Point {
		const r = this._svg.getBoundingClientRect();
		return new Point(e.clientX - r.x, e.clientY - r.y).snap();
	}
	private handleOnMouseDown(e: MouseEvent) {
		const p = this.pointFromMousePosition(e);
		if (this._activePoint) {
			this._dragging = true;
		}
	}
	private handleOnMouseMove(e: MouseEvent) {
		const p = this.pointFromMousePosition(e);
		if (this._dragging && this._activePoint) {
			this._activePoint.point = p;
			this.render();
		}
	}
	private handleOnMouseUp(e: MouseEvent) {
		this._dragging = false;
		this._activePoint = null;
	}
	private render() {
		// curve path
		let path = `M ${this._startPoint.point.x} ${this._startPoint.point.y}`;
		path += `Q ${this._controlPoint1.point.x} ${this._controlPoint1.point.y} ${this._center.point.x} ${this._center.point.y} `;
		path += `Q ${this._controlPoint2.point.x} ${this._controlPoint2.point.y} ${this._endPoint.point.x} ${this._endPoint.point.y} `;
		this._pathElm.setAttribute('d', path);
		
		// control line path
		path = `M ${this._startPoint.point.x} ${this._startPoint.point.y}`;
		path += `L ${this._controlPoint1.point.x} ${this._controlPoint1.point.y}`;
		path += `L ${this._center.point.x} ${this._center.point.y}`;
		path += `L ${this._controlPoint2.point.x} ${this._controlPoint2.point.y}`;
		path += `L ${this._endPoint.point.x} ${this._endPoint.point.y}`;
		this._controlLines.setAttribute('d', path);
		// info text
		path = `P1 (${this._startPoint.point.x}, ${this._startPoint.point.y}), `;
		path += `C1 (${this._controlPoint1.point.x}, ${this._controlPoint1.point.y}), `;
		path += `Center (${this._center.point.x}, ${this._center.point.y}), `;
		path += `C2 (${this._controlPoint2.point.x}, ${this._controlPoint2.point.y}), `;
		path += `P2 (${this._endPoint.point.x}, ${this._endPoint.point.y})`;


		const txtelm = document.querySelector('.info') as HTMLDivElement;
		txtelm.innerText = path;
	}
}
const main = new Main();