function emptyFunction()
{
}

function alwaysFalse()
{
	return false;
}

function alwaysTrue()
{
	return true;
}

function self()
{
	return function returnArg(arg)
	{
		return arg;
	};
}

function constant(constantRet)
{
	return function returnConstant()
	{
		return constantRet;
	};
}

function addTo()
{
	var additive = arguments.length > 0 ? arguments[0] : NaN;
	Array.forEach(arguments, function addToAdditive(a, index)
	{
		if(index > 0)
			additive += a;
	});
	return Number.isNaN(additive) ? self : function addAdditiveTo(base)
	{
		return base + additive;
	};
}

function subtractFrom()
{
	return addTo.apply(this, Array.map(arguments, function additiveInverseOf(a)
	{
		return -a;
	}));
}

function multiplyBy()
{
	var multiple = arguments.length > 0 ? arguments[0] : NaN;
	Array.forEach(arguments, function multiplyMultipleBy(m, index)
	{
		if(index > 0)
			multiple *= m;
	});
	return Number.isNaN(multiple) ? self : function multiplyByMultiple(base)
	{
		return base * multiple;
	};
}

function divideBy()
{
	var divisor = arguments.length > 0 ? arguments[0] : NaN;
	Array.forEach(arguments, function divideDivisorBy(d, index)
	{
		if(index > 0)
			divisor *= d;
	});
	return Number.isNaN(divisor) ? self : function divideByDivisor(base)
	{
		return base / divisor;
	};
}

function isPowerOfTwo(value)
{
	return (value & (value - 1)) == 0;
}

function degreesReflectionX(degrees)
{
	return (degrees / Math.abs(degrees)) * (180 - Math.abs(degrees));
}

function degreesReflectionY(degrees)
{
	return wrapDegrees(-degrees);
}

function wrapDegrees(degrees)
{
	return (degrees + 180) % 360 == degrees + 180 ? degrees : degrees - (Math.floor((degrees + 180) / 360) * 360);
}

function averageDegrees(a, b)
{
	return isNaN(a) ? b : isNaN(b) ? a : wrapDegrees((a = wrapDegrees(a)) + 180) == (b = wrapDegrees(b)) ? NaN : (((a == -180 ? 180 * Math.abs(b) / b : a) + (b == -180 ? 180 * Math.abs(a) / a : b) + 720) / 2) - 360;
}

function radiansReflectionX(radians)
{
	return (radians / Math.abs(radians)) * (Math.PI - Math.abs(radians));
}

function radiansReflectionY(radians)
{
	return wrapRadians(-radians);
}

function wrapRadians(radians)
{
	return (radians + Math.PI) % Math.PI2 == radians + Math.PI ? radians : radians - (Math.floor((radians + Math.PI) / Math.PI2) * Math.PI2);
}

function averageRadians(a, b)
{
	return isNaN(a) ? b : isNaN(b) ? a : wrapRadians((a = wrapRadians(a)) + Math.PI) == (b = wrapRadians(b)) ? NaN : (((a == -Math.PI ? Math.PI * Math.abs(b) / b : a) + (b == -Math.PI ? Math.PI * Math.abs(a) / Math.PI : b) + Math.PI * 4) / 2) - Math.PI2;
}

function wrapFunction(func, thisArg)
{
	return function callWrappedFunction()
	{
		return func.apply(thisArg, Array.from(arguments));
	};
}

function wrapEventListener(func, thisArg)
{
	var argStrings = Array.from(arguments).slice(2);
	return function callWrappedEventListener(event)
	{
		event = event || window.event;
		var ret = func.apply(thisArg, argStrings.map(function propertyWithName(name)
		{
			return event[name];
		}));
		if(ret)
			event.preventDefault();
	};
}

function callSuper(thisArg, name)
{
	return Object.getPrototypeOf(Object.getPrototypeOf(thisArg))[name].apply(thisArg, Array.from(arguments).splice(2, arguments.length - 2));
}

function isUnicodeNumber(unicode)
{
	return unicode >= 48 && unicode <= 57;
}

function isUnicodeLowercaseLetter(unicode)
{
	return unicode >= 97 && unicode <= 122;
}

function isUnicodeUppercaseLetter(unicode)
{
	return unicode >= 65 && unicode <= 90;
}

function isUnicodeLetter(unicode)
{
	return isUnicodeLowercaseLetter(unicode) || isUnicodeUppercaseLetter(unicode);
}

function isUnicodeAlphaNumeral(unicode)
{
	return isUnicodeLetter(unicode) || isUnicodeNumber(unicode);
}

function requestText(source, onload)
{
	var request = new XMLHttpRequest();
	request.onload = function onTextLoad() { onload(this.status == 200 ? this.responseText : ""); }
	request.open("GET", source);
	request.send();
}

Object.defineProperty(ElementEventListener.prototype, "element", { get: function getElement()
{
	return this._element;
}, set: function setElement(element)
{

	if(this._element)
		this.onElementDelete();
	if(element)
	{
		this._element = element;
		this.onElementSet();
	}
	else
	{
		this._element = null;
		this.reset();
	}
} });
Object.defineProperty(ElementEventListener.prototype, "onElementDelete", { value: function onElementDelete()
{
	this.eventListeners.events.forEach(function removeEventListenerFromPreviousElement(event)
	{
		this.element.removeEventListener(event, this.eventListeners[event]);
	}, this);
} });
Object.defineProperty(ElementEventListener.prototype, "onElementSet", { value: function onElementSet()
{
	this.eventListeners.events.forEach(function addEventListenerToNewEntry(event)
	{
		this.element.addEventListener(event, this.eventListeners[event]);
	}, this);
} });
Object.defineProperty(ElementEventListener.prototype, "addEventListener", { value: function addEventListener(event, func) 
{
	if(this.eventListeners[event])
		this.removeEventListener(event);
	else
		this.eventListeners.events.push(event);
	var wrappedFunc = this.eventListeners[event] = wrapFunction(func, this);
	if(this.element)
		this.element.addEventListener(event, wrappedFunc);
} });
Object.defineProperty(ElementEventListener.prototype, "removeEventListener", { value: function removeEventListener(event)
{
	if(this.element)
		this.element.removeEventListener(event, this.eventListeners[event]);
	delete this.eventListeners.events[this.eventListeners.events.indexOf(event)];
	delete this.eventListeners[event];
} });
Object.defineProperty(ElementEventListener.prototype, "reset", { value: function reset()
{
} });

function ElementEventListener(parameters)
{
	parameters = parameters || { };
	this.reset();
	this.eventListeners = Object.assign({ events: [ ] }, parameters.eventListeners || { });
	this.element = parameters.element;
}

ElementFocusEventListener.prototype = Object.create(ElementEventListener.prototype);
ElementFocusEventListener.prototype.constructor = ElementFocusEventListener;
Object.defineProperty(ElementFocusEventListener.prototype, "focused", { get: function isFocused()
{
	return this.element && document.hasFocus() && document.activeElement == this.element;
} });

function ElementFocusEventListener(parameters)
{
	ElementEventListener.call(this, parameters);
	this.addEventListener("blur", this.reset);
}

Object.defineProperty(Watcher.prototype, "watchable", { set: function setWatchable(watchable)
{
	if(this.parameters[0] != watchable)
	{
		if(this.parameters[0])
			this.parameters[0].removeWatcher(this);
		this.parameters[0] = watchable;
		watchable.addWatcher(this);
		this.notify();
		return true;
	}
	return false;
} });
Object.defineProperty(Watcher.prototype, "notify", { value: function notify()
{
	this.func.apply(this.thisArg, this.parameters);
} });

function Watcher(watchable, func, thisArg, parameters)
{
	this.func = func;
	this.thisArg = thisArg;
	this.parameters = [ undefined ].concat(parameters);
	this.watchable = watchable;
}

Object.defineProperty(Watchable.prototype, "watch", { value: function watch(func, thisArg, parameters)
{
	return new Watcher(this, func, thisArg, parameters || [ ]);
} });
Object.defineProperty(Watchable.prototype, "addWatcher", { value: function addWatcher(watcher)
{
	if(!this.watchers.includes(watcher))
	{
		this.watchers.push(watcher);
		watcher.watchable = this;
	}
} });
Object.defineProperty(Watchable.prototype, "removeWatcher", { value: function removeWatcher(watcher)
{
	var index = this.watchers.indexOf(watcher);
	if(index >= 0)
	{
		this.watchers.splice(index, 1);
		watcher.watchable = undefined;
	}
} });
Object.defineProperty(Watchable.prototype, "notifyWatchers", { value: function notifyWatchers()
{
	(this.watchers || [ ]).forEach(function notifyWatcher(watcher)
	{
		watcher.notify(this);
	}, this);
} });

function Watchable(parameters)
{
	parameters = parameters || { };
	this.watchers = [ ];
	Array.from(parameters.watchers || [ ]).forEach(function addWatcherFromParameters(watcher)
	{
		this.addWatcher(watcher);
	});
}

WatchableValue.prototype = Object.create(Watchable.prototype);
WatchableValue.prototype.constructor = WatchableValue;
Object.defineProperty(WatchableValue, "returnUnmodified", { value: function returnUnmodified(value)
{
	return value;
} });
Object.defineProperty(WatchableValue.prototype, "callback", { get: function getCallback()
{
	return this._callback;
}, set: function setCallback(callback)
{
	this._callback = callback;
	this.value = this.value;
} });
Object.defineProperty(WatchableValue.prototype, "value", { get: function getValue()
{
	return this._value;
}, set: function setValue(value)
{
	this._value = this.callback(value);
	this.notifyWatchers();
	if(this.parent)
		this.parent.notifyWatchers();
} });

function WatchableValue(parameters)
{
	parameters = parameters || { };
	this.parent = parameters.parent instanceof Watchable ? parameters.parent : null;
	this.callback = parameters.callback instanceof Function ? parameters.callback : WatchableValue.returnUnmodified;
	this.value = parameters.value;
	Watchable.call(this, parameters);
}

Updatable.prototype = Object.create(Watchable.prototype);
Updatable.prototype.constructor = Updatable;
Object.defineProperty(Updatable.prototype, "requestUpdate", { value: function requestUpdate()
{
	if(this.requestUpdates && !Number.isInteger(this.updateRequestIndex))
		this.updateRequestIndex = this.game.pushUpdateRequest(wrapFunction(this.updateInternal, this));
} });
Object.defineProperty(Updatable.prototype, "updateInternal", { value: function updateInternal(delta)
{
	this.updateRequestIndex = undefined;
	this.updatePre(delta);
	this.update(delta);
	this.updatePost(delta);
	this.notifyWatchers();
} });
Object.defineProperty(Updatable.prototype, "updatePre", { value: function updatePre(delta)
{
} });
Object.defineProperty(Updatable.prototype, "update", { value: function update(delta)
{
} });
Object.defineProperty(Updatable.prototype, "updatePost", { value: function updatePost(delta)
{
} });

function Updatable(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.game = parameters.game;
	this.requestUpdates = parameters.requestUpdates == false ? false : true;
}

Vector.prototype = Object.create(Watchable.prototype);
Vector.prototype.constructor = Vector;
Object.defineProperty(Vector, "neverNaN", { value: function nevenNaN(number)
{
	return number || 0;
} });
Object.defineProperty(Vector.prototype, 0, { get: function getX()
{
	return this.x.value;
}, set: function setX(x)
{
	this.x.value = x;
} });
Object.defineProperty(Vector.prototype, "length", { value: 1 });

function Vector(parameters)
{
	Watchable.call(this, parameters = parameters || { });
	this.x = Array.isArray(parameters) ? new WatchableValue({ value: parameters[0] }) : Number.isFinite(parameters.x) ? new WatchableValue({ value: parameters.x }) : parameters.x instanceof WatchableValue ? parameters.x : new WatchableValue();
	this.x.callback = Vector.neverNaN;
	this.x.parent = this;
}

Vector2.prototype = Object.create(Vector.prototype);
Vector2.prototype.constructor = Vector2;
Object.defineProperty(Vector2.prototype, "copy", { value: function copy()
{
	return new Vector2([ this[0], this[1] ]);
} });
Object.defineProperty(Vector2.prototype, "add", { value: function add()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	if(args[0])
		this.x._value = this.x.callback(this[0] + args[0]);
	this.x.notifyWatchers();
	if(args[1])
		this.y._value = this.y.callback(this[1] + args[1]);
	this.y.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector2.prototype, "set", { value: function set()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	this.x._value = this.x.callback(args[0]);
	this.x.notifyWatchers();
	this.y._value = this.y.callback(args[1]);
	this.y.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector2.prototype, 1, { get: function getY()
{
	return this.y.value;
}, set: function setY(y)
{
	this.y.value = y;
} });
Object.defineProperty(Vector2.prototype, "length", { value: 2 });

function Vector2(parameters)
{
	Vector.call(this, parameters = parameters || { });
	this.y = Array.isArray(parameters) ? new WatchableValue({ value: parameters[1] }) : Number.isFinite(parameters.y) ? new WatchableValue({ value: parameters.y }) : parameters.y instanceof WatchableValue ? parameters.y : new WatchableValue();
	this.y.callback = Vector.neverNaN;
	this.y.parent = this;
}

Vector3.prototype = Object.create(Vector2.prototype);
Vector3.prototype.constructor = Vector3;
Object.defineProperty(Vector3.prototype, "copy", { value: function copy()
{
	return new Vector3([ this[0], this[1], this[2] ]);
} });
Object.defineProperty(Vector3.prototype, "add", { value: function add()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	if(args[0])
		this.x._value = this.x.callback(this[0] + args[0]);
	this.x.notifyWatchers();
	if(args[1])
		this.y._value = this.y.callback(this[1] + args[1]);
	this.y.notifyWatchers();
	if(args[2])
		this.z._value = this.z.callback(this[2] + args[2]);
	this.z.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector3.prototype, "set", { value: function set()
{
	var args = arguments;
	if(Array.isArray(args[0]))
		args = args[0];
	this.x._value = this.x.callback(args[0]);
	this.x.notifyWatchers();
	this.y._value = this.y.callback(args[1]);
	this.y.notifyWatchers();
	this.z._value = this.z.callback(args[2]);
	this.z.notifyWatchers();
	this.notifyWatchers();
	return this;
} });
Object.defineProperty(Vector3.prototype, "rotate", { value: function rotate(x, y, z)
{
	return this.rotateRad(Math.rad(x), Math.rad(y), Math.rad(z));
} });
Object.defineProperty(Vector3.prototype, "rotateRad", { value: function rotateRad(x, y, z)
{
	var sinX = Math.sin(x), cosX = Math.cos(x), sinY = Math.sin(y), cosY = Math.cos(y), sinZ = Math.sin(z), cosZ = Math.cos(z);
	return this.rotateMatrix(mat3.invert([ ], [ 1, 0, 0, 0, cosX, -sinX, 0, sinX, cosX ]), [ cosY, 0, sinY, 0, 1, 0, -sinY, 0, cosY ], [ cosZ, -sinZ, 0, sinZ, cosZ, 0, 0, 0, 1 ]);
} });
Object.defineProperty(Vector3.prototype, "rotateMatrix", { value: function rotateMatrix(x, y, z)
{
	return new Vector3(vec3.transformMat3([ ], vec3.transformMat3([ ], vec3.transformMat3([ ], this, y), x), z));
} });
Object.defineProperty(Vector3.prototype, 2, { get: function getZ()
{
	return this.z.value;
}, set: function setZ(z)
{
	this.z.value = z;
} });
Object.defineProperty(Vector3.prototype, "length", { value: 3 });

function Vector3(parameters)
{
	Vector2.call(this, parameters = parameters || { });
	this.z = Array.isArray(parameters) ? new WatchableValue({ value: parameters[2] }) : Number.isFinite(parameters.z) ? new WatchableValue({ value: parameters.z }) : parameters.z instanceof WatchableValue ? parameters.z : new WatchableValue();
	this.z.callback = Vector.neverNaN;
	this.z.parent = this;
}

RotationVector.prototype = Object.create(Vector.prototype);
RotationVector.prototype.constructor = RotationVector;

function RotationVector(parameters)
{
	Vector.call(this, parameters);
	this.x.callback = wrapDegrees;
}

RotationVector2.prototype = Object.create(Vector2.prototype);
RotationVector2.prototype.constructor = RotationVector2;

function RotationVector2(parameters)
{
	Vector2.call(this, parameters);
	this.x.callback = this.y.callback = wrapDegrees;
}

RotationVector3.prototype = Object.create(Vector3.prototype);
RotationVector3.prototype.constructor = RotationVector3;
function RotationVector3(parameters)
{
	Vector3.call(this, parameters);
	this.x.callback = this.y.callback = this.z.callback = wrapDegrees;
}

Color.prototype = Object.create(Watchable);
Color.prototype.constructor = Color;
Object.defineProperty(Color.prototype, "r", { get: function getR()
{
	return this._r;
}, set: function setR(r)
{
	this._r = Math.max(0, Math.min(255, r || 0));
} });
Object.defineProperty(Color.prototype, "g", { get: function getG()
{
	return this._g;
}, set: function setG(g)
{
	this._g = Math.max(0, Math.min(255, g || 0));
} });
Object.defineProperty(Color.prototype, "b", { get: function getB()
{
	return this._b;
}, set: function setB(b)
{
	this._b = Math.max(0, Math.min(255, b || 0));
} });

function Color(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	if(Array.isArray(parameters))
	{
		this.r = parameters[0];
		this.g = parameters[1];
		this.b = parameters[2];
	}
	else
	{
		this.r = parameters.r;
		this.g = parameters.g;
		this.b = parameters.b;
	}
}

Camera.prototype = Object.create(Watchable.prototype);
Camera.prototype.constructor = Camera;
Object.defineProperty(Camera.prototype, "lookAt", { value: function lookAt(vector) 
	{
		this.rotation[0] = Math.deg(Math.atan2(vector[1] - this.position[1], Math.hypot(vector[0] - this.position[0], this.position[2] - vector[2])));
		this.rotation[1] = Math.deg(Math.atan2(vector[0] - this.position[0], this.position[2] - vector[2]));
	}
});
Object.defineProperty(Camera.prototype, "fov", { get: function getFov()
{
	return this._fov;
}, set: function setFov(fov)
{
	this._fov = fov || 45; this.notifyWatchers();
} });
Object.defineProperty(Camera.prototype, "near", { get: function getNear()
{
	return this._near;
}, set: function setNear(near)
{
	this._near = near || .1; this.notifyWatchers(); } });
Object.defineProperty(Camera.prototype, "far", { get: function getFar()
{
	return this._far;
}, set: function setFar(far)
{
	this._far = far || 100;
	this.notifyWatchers();
} });

function Camera(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.position = new Vector3(parameters.position);
	this.rotation = new RotationVector3(parameters.rotation);
	this.fov = parameters.fov;
}

function Physics(parameters)
{
	parameters = parameters || { };
	this.noClip = parameters.noClip || true;
	this.tracable = parameters.tracable || false;
}

Geometry.prototype = Object.create(Updatable.prototype);
Geometry.prototype.constructor = Geometry;
Object.defineProperty(Geometry.prototype, "buildGeometry", { value: function buildGeometry(renderer)
{
	this.relativeVertices = [ ];
	this.requestUpdate();
} });
Object.defineProperty(Geometry.prototype, "onTextureMapChange", { value: function onTextureMapChange(renderer)
{
	this.buildGeometry(renderer);
} });
Object.defineProperty(Geometry.prototype, "addRelativeVertex", { value: function addRelativeVertex(index, position, uv, normal)
{
	var relativeVertex = this.relativeVertices[index] = [ position, uv, normal ];
	position.watch(this.requestUpdate, this);
	uv.watch(this.requestUpdate, this);
	normal.watch(this.requestUpdate, this);
	this.requestUpdate();
} });
Object.defineProperty(Geometry.prototype, "updatePre", { value: function updatePre()
{
	this.updateRequestIndex = undefined;
	var radiansY = Math.rad(this.rotation[1]), sinY = Math.sin(radiansY), cosY = Math.cos(radiansY);
	var radiansX = Math.rad(this.rotation[0]), sinX = Math.sin(radiansX), cosX = Math.cos(radiansX);
	var radiansZ = Math.rad(this.rotation[2]), sinZ = Math.sin(radiansZ), cosZ = Math.cos(radiansZ);
	var matrixY = [ cosY, 0, sinY, 0, 1, 0, -sinY, 0, cosY ];
	var matrixX = [ 1, 0, 0, 0, cosX, -sinX, 0, sinX, cosX ];
	var matrixZ = [ cosZ, -sinZ, 0, sinZ, cosZ, 0, 0, 0, 1 ];
	var x = this.position[0], y = this.position[1], z = this.position[2];
	this.requestUpdates = false;
	for(var i = 0; i < this.relativeVertices.length; i++)
	{
		var relativeVertex = this.relativeVertices[i];
		if(relativeVertex)
		{
			var relativePosition = relativeVertex[0], uv = relativeVertex[1], relativeNormal = relativeVertex[2];
			var vector = relativePosition.rotateMatrix(matrixX, matrixY, matrixZ);
			var normal = relativeNormal.rotateMatrix(matrixX, matrixY, matrixZ);
			this.allocation.setVertex(i, vector[0] + x, vector[1] + y, vector[2] + z, uv[0], uv[1], normal[0], normal[1], normal[2]);
		}
	}
	this.requestUpdates = true;
} });

function Geometry(parameters, layer, vertices, triangles)
{
	Updatable.call(this, parameters = parameters || { });
	this.index = layer.geometries.push(this) - 1;
	this.allocation = layer.vertexBuffer.allocate(vertices, Number.isFinite(triangles) ? triangles : vertices / 2);
	this.render = parameters.render || true;
	this.physics = parameters.physics instanceof Physics ? parameters.physics : new Physics(parameters.physics);
	this.position = parameters.position instanceof Vector3 ? parameters.position : new Vector3(parameters.position);
	this.rotation = parameters.rotation instanceof Vector3 ? parameters.rotation : new RotationVector3(parameters.rotation);
	this.position.watch(this.requestUpdate, this);
	this.rotation.watch(this.requestUpdate, this);
	this.buildGeometry(layer.game.renderer);
}

RectangleGeometry.prototype = Object.create(Geometry.prototype);
RectangleGeometry.prototype.constructor = RectangleGeometry;
Object.defineProperty(RectangleGeometry.prototype, "buildGeometry", { value: function buildGeometry(renderer)
{
	callSuper(this, "buildGeometry", renderer);
	this.requestUpdates = false;
	var index0 = this.allocation.getVertexIndex(0), index2 = this.allocation.getVertexIndex(2);
	this.allocation.setTriangle(0, index0, this.allocation.getVertexIndex(1), index2);
	this.allocation.setTriangle(1, index0, index2, this.allocation.getVertexIndex(3));
	var aU0 = this.texture.getAbsoluteU(0);
	var aU1 = this.texture.getAbsoluteU(1);
	var aV0 = this.texture.getAbsoluteV(0);
	var aV1 = this.texture.getAbsoluteV(1);
	this.addRelativeVertex(0, new Vector3({ x: -this.width / 2, y: -this.height / 2 }), new Vector2({ x: aU0, y: aV1 }), new Vector3({ z: -1 }));
	this.addRelativeVertex(1, new Vector3({ x: this.width / 2, y: -this.height / 2 }), new Vector2({ x: aU1, y: aV1 }), new Vector3({ z: -1 }));
	this.addRelativeVertex(2, new Vector3({ x: this.width / 2, y: this.height / 2 }), new Vector2({ x: aU1, y: aV0 }), new Vector3({ z: -1 }));
	this.addRelativeVertex(3, new Vector3({ x: -this.width / 2, y: this.height / 2 }), new Vector2({ x: aU0, y: aV0 }), new Vector3({ z: -1 }));
	this.requestUpdates = true;

} });

function RectangleGeometry(parameters, layer)
{
	parameters = parameters || { };
	this.texture = parameters.texture instanceof Texture ? parameters.texture : layer.game.renderer.textureMap.textures[0];
	Geometry.call(parameters, layer, 4);
	this.texture = parameters.texture;
	this.width = parameters.width || 1;
	this.height = parameters.height || 1;
}

RectangularPrismGeometry.prototype = Object.create(Geometry.prototype);
RectangularPrismGeometry.prototype.constructor = RectangularPrismGeometry;
Object.defineProperty(RectangularPrismGeometry.prototype, "buildGeometry", { value: function buildGeometry(renderer)
{
	callSuper(this, "buildGeometry", renderer);
	this.requestUpdates = false;
	var index0 = this.allocation.getVertexIndex(0), index2 = this.allocation.getVertexIndex(2);
	var index4 = this.allocation.getVertexIndex(4), index6 = this.allocation.getVertexIndex(6);
	var index8 = this.allocation.getVertexIndex(8), index10 = this.allocation.getVertexIndex(10);
	var index12 = this.allocation.getVertexIndex(12), index14 = this.allocation.getVertexIndex(14);
	var index16 = this.allocation.getVertexIndex(16), index18 = this.allocation.getVertexIndex(18);
	var index20 = this.allocation.getVertexIndex(20), index22 = this.allocation.getVertexIndex(22);
	this.allocation.setTriangle(0, index0, index2, this.allocation.getVertexIndex(1)); this.allocation.setTriangle(1, index0, this.allocation.getVertexIndex(3), index2);
	this.allocation.setTriangle(2, index4, this.allocation.getVertexIndex(5), index6); this.allocation.setTriangle(3, index4, index6, this.allocation.getVertexIndex(7));
	this.allocation.setTriangle(4, index8, index10, this.allocation.getVertexIndex(9)); this.allocation.setTriangle(5, index8, this.allocation.getVertexIndex(11), index10);
	this.allocation.setTriangle(6, index12, index14, this.allocation.getVertexIndex(13)); this.allocation.setTriangle(7, index12, this.allocation.getVertexIndex(15), index14);
	this.allocation.setTriangle(8, index16, index18, this.allocation.getVertexIndex(17)); this.allocation.setTriangle(9, index16, this.allocation.getVertexIndex(19), index18);
	this.allocation.setTriangle(10, index20, index22, this.allocation.getVertexIndex(21)); this.allocation.setTriangle(11, index20, this.allocation.getVertexIndex(23), index22);
	var aU0 = this.texture.getAbsoluteU(0);
	var aU1 = this.texture.getAbsoluteU(1);
	var aV0 = this.texture.getAbsoluteV(0);
	var aV1 = this.texture.getAbsoluteV(1);
	this.addRelativeVertex(0, new Vector3([ this.width / 2, -this.height / 2, -this.depth / 2 ]), new Vector2([ aU0, aV1 ]), new Vector3({ z: -1 }));
	this.addRelativeVertex(1, new Vector3([ -this.width / 2, -this.height / 2, -this.depth / 2 ]), new Vector2([ aU1, aV1 ]), new Vector3({ z: -1 }));
	this.addRelativeVertex(2, new Vector3([ -this.width / 2, this.height / 2, -this.depth / 2 ]), new Vector2([ aU1, aV0 ]), new Vector3({ z: -1 }));

	this.addRelativeVertex(3, new Vector3([ this.width / 2, this.height / 2, -this.depth / 2 ]), new Vector2([ aU0, aV0 ]), new Vector3({ z: -1 }));
	this.addRelativeVertex(4, new Vector3([ this.width / 2, -this.height / 2, this.depth / 2 ]), new Vector2([ aU1, aV1 ]), new Vector3({ z: 1 }));
	this.addRelativeVertex(5, new Vector3([ -this.width / 2, -this.height / 2, this.depth / 2 ]), new Vector2([ aU0, aV1 ]), new Vector3({ z: 1 }));

	this.addRelativeVertex(6, new Vector3([ -this.width / 2, this.height / 2, this.depth / 2 ]), new Vector2([ aU0, aV0 ]), new Vector3({ z: 1 }));
	this.addRelativeVertex(7, new Vector3([ this.width / 2, this.height / 2, this.depth / 2 ]), new Vector2([ aU1, aV0 ]), new Vector3({ z: 1 }));
	this.addRelativeVertex(8, new Vector3([ -this.width / 2, -this.height / 2, -this.depth / 2 ]), new Vector2([ aU0, aV1 ]), new Vector3({ x: -1 }));

	this.addRelativeVertex(9, new Vector3([ -this.width / 2, -this.height / 2, this.depth / 2 ]), new Vector2([ aU1, aV1 ]), new Vector3({ x: -1 }));
	this.addRelativeVertex(10, new Vector3([ -this.width / 2, this.height / 2, this.depth / 2 ]), new Vector2([ aU1, aV0 ]), new Vector3({ x: -1 }));
	this.addRelativeVertex(11, new Vector3([ -this.width / 2, this.height / 2, -this.depth / 2 ]), new Vector2([ aU0, aV0 ]), new Vector3({ x: -1 }));

	this.addRelativeVertex(12, new Vector3([ this.width / 2, -this.height / 2, this.depth / 2 ]), new Vector2([ aU0, aV1 ]), new Vector3({ x: 1 }));
	this.addRelativeVertex(13, new Vector3([ this.width / 2, -this.height / 2, -this.depth / 2 ]), new Vector2([ aU1, aV1 ]), new Vector3({ x: 1 }));
	this.addRelativeVertex(14, new Vector3([ this.width / 2, this.height / 2, -this.depth / 2 ]), new Vector2([ aU1, aV0 ]), new Vector3({ x: 1 }));

	this.addRelativeVertex(15, new Vector3([ this.width / 2, this.height / 2, this.depth / 2 ]), new Vector2([ aU0, aV0 ]), new Vector3({ x: 1 }));
	this.addRelativeVertex(16, new Vector3([ -this.width / 2, -this.height / 2, -this.depth / 2 ]), new Vector2([ aU0, aV1 ]), new Vector3({ y: -1 }));
	this.addRelativeVertex(17, new Vector3([ this.width / 2, -this.height / 2, -this.depth / 2 ]), new Vector2([ aU1, aV1 ]), new Vector3({ y: -1 }));

	this.addRelativeVertex(18, new Vector3([ this.width / 2, -this.height / 2, this.depth / 2 ]), new Vector2([ aU1, aV0 ]), new Vector3({ y: -1 }));
	this.addRelativeVertex(19, new Vector3([ -this.width / 2, -this.height / 2, this.depth / 2 ]), new Vector2([ aU0, aV0 ]), new Vector3({ y: -1 }));
	this.addRelativeVertex(20, new Vector3([ -this.width / 2, this.height / 2, this.depth / 2 ]), new Vector2([ aU0, aV1 ]), new Vector3({ y: 1 }));

	this.addRelativeVertex(21, new Vector3([ this.width / 2, this.height / 2, this.depth / 2 ]), new Vector2([ aU1, aV1 ]), new Vector3({ y: 1 }));
	this.addRelativeVertex(22, new Vector3([ this.width / 2, this.height / 2, -this.depth / 2 ]), new Vector2([ aU1, aV0 ]), new Vector3({ y: 1 }));
	this.addRelativeVertex(23, new Vector3([ -this.width / 2, this.height / 2, -this.depth / 2 ]), new Vector2([ aU0, aV0 ]), new Vector3({ y: 1 }));
	this.requestUpdates = true;
} });

function RectangularPrismGeometry(layer, parameters)
{
	parameters = parameters || { };
	this.width = parameters.width || 1;
	this.height = parameters.height || 1;
	this.depth = parameters.depth || 1;
	this.texture = parameters.texture instanceof Texture ? parameters.texture : layer.game.renderer.textureMap.textures[0];
	Geometry.call(this, parameters, layer, 24);
}

function ElipticalPrism(parameters)
{
	this.heightSegments = parameters.heightSegments || 10;
	this.widthSegments = parameters.widthSegments || 10;
	this.diameter = parameters.diameter || 1;
	var startVector = new Vector3([ 0, -this.diameter / 2, 0 ]);
	var startNormal = new Vector3([ 0, -1, 0 ]);
	for(var i = 0; i < this.heightSegments; i++)
	{
		var vector = vec3.transformMat3([ ], vec3.transformMat3([ ], vec3.transformMat3([ ], [ startVector[0], startVector[1], startVector[2] ], matrixY), matrixX), matrixZ);
		var normal = vec3.transformMat3([ ], vec3.transformMat3([ ], vec3.transformMat3([ ], [ startNormal[0], startNormal[1], startNormal[2] ], matrixY), matrixX), matrixZ);
		for(var j = 0; j < this.widthSegments; j++)
		{
			this.lie;
		}
	}
}

Object.defineProperty(Texture.prototype, "getAbsoluteU", { value: function getAbsoluteU(relativeU)
{
	var uvs = this.textureMap[this.index];
	if(!uvs)
		return NaN;
	var uStart = uvs[0];
	return uStart + relativeU * uvs[2];
} });
Object.defineProperty(Texture.prototype, "getAbsoluteV", { value: function getAbsoluteV(relativeV)
{
	var uvs = this.textureMap[this.index];
	if(!uvs)
		return NaN;
	var vStart = uvs[1];
	return vStart + relativeV * uvs[3];
} });

function Texture(index, textureMap, image)
{
	this.index = index;
	this.textureMap = textureMap;
	this.image = image;
}

Object.defineProperty(TextureMap, "textureComparator", { value: function textureComparator(a, b)
{
	return b.image.height - a.image.height || b.image.width - a.image.width || a.index - b.index;
} });
Object.defineProperty(TextureMap, "boxComparator", { value: function boxComparator(a, b)
{
	return a[0] - b[0] || a[1] - b[1];
} });
Object.defineProperty(TextureMap, "calculateTextureUVs", { value: function calculateTextureUVs(length, textures)
{
	var availableBoxesMap = [ [ 0 ] ];
	availableBoxesMap[-1] = [ 0 ];
	availableBoxesMap[0][-1] = [ 0 ];
	var availableBoxes = [ [ 0, 0, length, length] ];
	var splitBoxesWidth = NaN;
	var splitBoxesHeight = NaN;
	var splitBoxes = [ ];
	var textureUVs = [ ];
	for(var i = 0; textureUVs && i < textures.length; i++)
	{
		var texture = textures[i];
		var width = texture.image.width;
		var height = texture.image.height;
		if(width != splitBoxesWidth && height != splitBoxesHeight)
		{
			availableBoxes.forEach(function shiftAvailableBoxIndexInMap(availableBox)
			{
				availableBoxesMap[availableBox[0]][availableBox[1]] += splitBoxes.length;
			});
			splitBoxes.forEach(function addSplitBoxIndexToMap(splitBox, index)
			{
				if(!availableBoxesMap[-1].includes(splitBox[0]))
					availableBoxesMap[-1].push(splitBox[0]);
				var vArray = availableBoxesMap[splitBox[0]];
				if(!vArray)
				{
					vArray = availableBoxesMap[splitBox[0]] = [ ];
					vArray[-1] = [ ];
					availableBoxesMap[-1].push(splitBox[0]);
				}
				vArray[splitBox[1]] = index;
				vArray[-1].push(splitBox[1]);
				vArray[-1].sort();
			});
			availableBoxesMap[-1].sort();
			availableBoxes = splitBoxes.concat(availableBoxes);
			splitBoxes = [ ];
			var overlappingBoxes = [ ];
			for(var j = 0; j < availableBoxes.length; j++)
			{
				var availableBox = availableBoxes[j];
				if(availableBox)
				{
					var quadrants = [ [ [ availableBox[0], availableBox[1], width, height ] ], [ [ availableBox[0], availableBox[1] - height, width, height ] ], [ [ availableBox[0] - width, availableBox[1], width, height ] ], [ [ availableBox[0] - width, availableBox[1] - height, width, height ] ] ];
					var boxesInArea = [ [ ], [ ], [ ], [ ] ];
					quadrants.forEach(function reduceQuadrantBounds(quadrant, quadrantIndex)
					{
						var quadrantBox = quadrant[0];
						if(quadrantBox[0] < 0 || quadrantBox[1] < 0)
							return;
						for(var k = 0, u = availableBoxesMap[-1][0]; k < availableBoxesMap[-1].length && u < quadrantBox[0] + quadrantBox[2]; u = availableBoxesMap[-1][++k])
						{
							if(u < quadrantBox[0])
								continue;
							var vArray = availableBoxesMap[u];
							for(var l = 0, v = vArray[-1][0]; l < vArray[-1].length && v < quadrantBox[1] + quadrantBox[3]; v = vArray[-1][++l])
							{
								if(v < quadrantBox[1])
									continue;
								var affectedBox = availableBoxes[vArray[v]];
								quadrant.forEach(function reduceQuadrantBoundsByIntersectingBoxes(remainingBox, index)
								{
									if(remainingBox[0] >= affectedBox[0] && remainingBox[1] >= affectedBox[1] && remainingBox[0] + remainingBox[2] <= affectedBox[0] + affectedBox[2] && remainingBox[1] + remainingBox[3] <= affectedBox[1] + affectedBox[3])
										delete quadrant[index];
									else if(remainingBox[1] == affectedBox[1] && remainingBox[3] == affectedBox[3])
									{
										var leftBox = [ remainingBox[0], remainingBox[1], remainingBox[1], Math.max(affectedBox[0] - remainingBox[0], 0), remainingBox[3] ];
										var rightBox = [ affectedBox[0] + affectedBox[2], remainingBox[1], Math.max(remainingBox[0] + remainingBox[2] - affectedBox[0] - affectedBox[2], 0), remainingBox[3] ];
										var replacedRemaining;
										if(leftBox[2] * leftBox[3] > 0)
											replacedRemaining = quadrant[index] = leftBox;
										if(rightBox[2] * rightBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(rightBox);
											else
												quadrant[index] = rightBox;
									}
									else
									{
										var topBox = [ remainingBox[0], remainingBox[1], remainingBox[2], Math.max(affectedBox[1] - remainingBox[1], 0) ];
										var bottomBox = [ remainingBox[0], affectedBox[1] + affectedBox[3], remainingBox[2], Math.max(remainingBox[1] + remainingBox[3] - affectedBox[1] - affectedBox[3], 0) ];
										var leftBox = [ remainingBox[0], affectedBox[1], Math.max(affectedBox[0] - remainingBox[0], 0), affectedBox[3] ];
										var rightBox = [ affectedBox[0] + affectedBox[2], affectedBox[1], Math.max(remainingBox[0] + remainingBox[2] - affectedBox[0] - affectedBox[2], 0), affectedBox[3] ];
										var replacedRemaining;
										if(topBox[2] * topBox[3] > 0)
											replacedRemaining = quadrant[index] = topBox;
										if(bottomBox[2] * bottomBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(bottomBox);
											else
												replacedRemaining = quadrant[index] = bottomBox;
										if(leftBox[2] * leftBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(leftBox);
											else
												replacedRemaining = quadrant[index] = leftBox;
										if(rightBox[2] * rightBox[3] > 0)
											if(replacedRemaining)
												quadrant.push(rightBox);
											else
												quadrant[index] = rightBox;
									}
								});
								boxesInArea[quadrantIndex].push(vArray[v]);
							}
						}
						if(!quadrant.find(WatchableValue.returnUnmodified))
						{
							var splitBoxIndex = splitBoxes.push(quadrantBox) - 1;
							boxesInArea[quadrantIndex].forEach(function addIndexToOverlappingBoxes(boxInArea)
							{
								if(overlappingBoxes[boxInArea])
									overlappingBoxes[boxInArea].push(splitBoxIndex);
								else
									overlappingBoxes[boxInArea] = [ splitBoxIndex ];
							});
						}
					});
				}
			}
			overlappingBoxes.forEach(function divideOverlappingBoxBySplitBoxes(splitBoxIndices, overlappingBoxIndex)
			{
				var overlappingBox = availableBoxes[overlappingBoxIndex];
				var vArray = availableBoxesMap[overlappingBox[0]];
				if(vArray[-1].length <= 1)
					if(availableBoxesMap[-1].length <= 1)
					{
						availableBoxesMap = [ ];
						availableBoxesMap[-1] = [ ];
					}
					else
					{
						delete availableBoxesMap[overlappingBox[0]];
						availableBoxesMap[-1].splice(availableBoxesMap[-1].indexOf(overlappingBox[0]), 1);
					}
				else
				{
					delete vArray[overlappingBox[1]];
					vArray[-1].splice(vArray[-1].indexOf(overlappingBox[1]), 1);
				}
				delete availableBoxes[overlappingBoxIndex];
				var uDivisionPoints = [ overlappingBox[0], overlappingBox[0] + overlappingBox[2] ];
				var vDivisionPoints = [ overlappingBox[1], overlappingBox[1] + overlappingBox[3] ];
				splitBoxIndices.forEach(function addDivisionPoints(splitBoxIndex)
				{
					var splitBox = splitBoxes[splitBoxIndex];
					if(!uDivisionPoints.includes(splitBox[0]))
						uDivisionPoints.push(splitBox[0]);
					if(!uDivisionPoints.includes(splitBox[0] + splitBox[2]))
						uDivisionPoints.push(splitBox[0] + splitBox[2]);
					if(!vDivisionPoints.includes(splitBox[1]))
						vDivisionPoints.push(splitBox[1]);
					if(!vDivisionPoints.includes(splitBox[1] + splitBox[3]))
						vDivisionPoints.push(splitBox[1] + splitBox[3]);
				});
				uDivisionPoints.sort();
				vDivisionPoints.sort();
				for(var j = 0, u = uDivisionPoints[0]; j + 1 < uDivisionPoints.length; u = uDivisionPoints[++j])
					for(var k = 0, v = vDivisionPoints[0]; k + 1 < vDivisionPoints.length; v = vDivisionPoints[++k])
					{
						if(splitBoxIndices.every(function isUVInSplitBox(splitBoxIndex)
						{
							var splitBox = splitBoxes[splitBoxIndex];
							return u < splitBox[0] || u >= splitBox[0] + splitBox[2] || v < splitBox[1] || v >= splitBox[1] + splitBox[3];
						}))
						{
							var newBoxIndex = availableBoxes.push([ u, v, uDivisionPoints[j + 1] - u, vDivisionPoints[k + 1] - v ]) - 1;
							var vArray = availableBoxesMap[u];
							if(!vArray)
							{
								vArray = availableBoxesMap[u] = [ ];
								vArray[-1] = [ ];
								availableBoxesMap[-1].push(u);
							}
							vArray[v] = newBoxIndex;
							vArray[-1].push(v);
							vArray[-1].sort();
						}
					}
			});
			splitBoxesWidth = width;
			splitBoxesHeight = height;
			splitBoxes.reverse();
		}
		var splitBox = splitBoxes.pop();
		if(splitBox)
			textureUVs.push(splitBox);
		else
			textureUVs = undefined;
	}
	return textureUVs;
} });
Object.defineProperty(TextureMap.prototype, "loadTextures", { value: function loadTextures(imageLocations)
{
	var ret = [ ];
	var textures = Array.from(this.textures);
	var loadedImages = textures.length;
	var restitchIfAllLoaded = wrapFunction(function restitchIfAllLoaded()
	{
		loadedImages++;
		if(loadedImages == textures.length)
			this.restitchTextures(textures);
	}, this);
	imageLocations.forEach(function requestTexture(imageLocation)
	{
		var image = new Image();
		var index = textures.length;
		var texture = new Texture(index, this, image);
		textures.push(texture);
		ret.push(texture);
		var removeListeners = function removeTextureisteners(image)
		{
			image.removeEventListener("load", onload);
			image.removeEventListener("error", onerror);
		}
		var onload = function onTextureLoad()
		{
			removeListeners(this);
			restitchIfAllLoaded();
		}
		var onerror = function onTextureError()
		{
			texture.index = 0;
			onload();
		}
		image.addEventListener("load", onload);
		image.addEventListener("error", onerror);
		image.src = imageLocation;
	}, this);
	if(imageLocations.length == 0)
		setTimeout(wrapFunction(function delayedRestitchTextures()
		{
			this.restitchTextures(textures);
		}, this), 0);
	return ret;
} });
Object.defineProperty(TextureMap.prototype, "restitchTextures", { value: function restitchTextures(textures)
{
	textures.sort(TextureMap.textureComparator);
	var stitchedPixels = 0;
	textures.forEach(function addAreaToStitchedPixels(texture)
	{
		stitchedPixels += texture.image.width * texture.image.height;
	});
	var textureUVs;
	var i = Math.ceil(Math.log2(stitchedPixels));
	for(; Math.pow(2, i) < Infinity && !textureUVs;)
		textureUVs = TextureMap.calculateTextureUVs(Math.pow(2, ++i), textures);
	var stitchCanvas = document.createElement("canvas");
	stitchCanvas.width = stitchCanvas.height = Math.pow(2, i);
	var stitchContext = stitchCanvas.getContext("2d");
	textureUVs.forEach(function addTextureToStitched(textureUV, index)
	{
		var texture = textures[index];
		stitchContext.drawImage(texture.image, textureUV[0], textureUV[1], textureUV[2], textureUV[3]);
		this[texture.index] = textureUV.map(function divideUVByStitchedLength(element)
		{
			return element / Math.pow(2, i);
		});
	}, this);
	this.stitched.src = stitchCanvas.toDataURL();
	this.stitched.addEventListener("load", this.onStichedLoad = wrapFunction(function onStitchedTextureMapLoad()
	{
		this.stitched.removeEventListener("load", this.onStitchedLoad);
		this.onStitchedLoad = undefined;
		this.renderer.bindTextureMap();
	}, this));
} });

function TextureMap(parameters)
{
	parameters = parameters || { };
	this.renderer = parameters.renderer;
	this.stitched = new Image();
	var missingImage = new Image();
	this.textures = [ new Texture(0, this, missingImage) ];
	var missingCanvas = document.createElement("canvas");
	missingCanvas.height = missingCanvas.width = 4;
	var missingContext = missingCanvas.getContext("2d");
	var missingImageData = missingContext.createImageData(4, 4);
	for(var x = 0; x < missingImageData.width; x++)
		for(var y = 0; y < missingImageData.height; y++)
			missingImageData.data.set([ Math.max(0, (x + 1) * 64 - 1), Math.max(0, (y + 1) * 64 - 1), Math.max(0, (x + y * missingImageData.width + 1) * 16 - 1), 255 ], (x + y * missingImageData.width) * 4);
	missingContext.putImageData(missingImageData, 0, 0);
	this.stitched.src = missingImage.src = missingCanvas.toDataURL();
	this.stitched.addEventListener("load", this.onStichedLoad = wrapFunction(function onStitchedTextureMapLoad()
	{
		this.stitched.removeEventListener("load", this.onStitchedLoad);
		this.onStitchedLoad = undefined;
		this.renderer.bindTextureMap();
	}, this));
	this[0] = [ 0, 0, 1, 1 ];
}

Object.defineProperty(VertexBufferAllocation.prototype, "disallocate", { value: function disallocate()
{
	this.buffer.allocations.splice(this.index, 1);
	var disallocations = [ ];
	var i = 0;
	var range = null;
	var allocation = this;
	this.buffer.disallocations.forEach(function expandExistingDisallocations(disallocation)
	{
		if(range)
		{
			if(range[1] >= disallocation[0])
			{
				if(range[1] <= disallocation[1])
				{
					disallocations.push([ disallocations.pop()[0], disallocation[1] ]);
					range = null;
				}
				else
					disallocations.push([ disallocations.pop()[0], range[1] ]);
				return;
			}
		}
		for(; i < allocation.ranges.length; i++)
		{
			range = allocation.ranges[i];
			if((range[0] >= disallocation[0] && range[0] <= disallocation[1]) || (range[1] >= disallocation[0] && range[1] <= disallocation[1]))
			{
				range = [ Math.min(range[0], disallocation[0]), Math.max(range[1], disallocation[1]) ];
				disallocations.push(range);
				i++;
				return;
			}
			else if(range[0] > disallocation[1] && range[0] > disallocation[1])
				break;
			else
				disallocations.push(range);
		}
		range = null;
		disallocations.push(disallocation);
	});
	this.buffer.disallocations = disallocations;
	this.buffer.triangles = new Uint16Array(Array.from(this.buffer.triangles).splice(this.triangleRange[0], this.triangleRange[1] - this.triangleRange[0]));
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexX", { value: function setVertexX(vertex, x)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.buffer.vertices[index * 3] = x;
		this.buffer.vertices.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexY", { value: function setVertexY(vertex, y)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.buffer.vertices[index * 3 + 1] = y;
		this.buffer.vertices.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexZ", { value: function setVertexZ(vertex, z)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.buffer.vertices[index * 3 + 2] = z;
		this.buffer.vertices.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexXYZ", { value: function setVertexXYZ(vertex, x, y, z)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		var xyzIndex = index * 3;
		this.buffer.vertices[xyzIndex] = x;
		this.buffer.vertices[xyzIndex + 1] = y;
		this.buffer.vertices[xyzIndex + 2] = z;
		this.buffer.vertices.modified = true;
	} 
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexU", { value: function setVertexU(vertex, u)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.buffer.uvs[index * 2] = u;
		this.buffer.uvs.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexV", { value: function setVertexV(vertex, v)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		this.buffer.uvs[index * 2 + 1] = v;
		this.buffer.uvs.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexUV", { value: function setVertexUV(vertex, u, v)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		var uvIndex = index * 2;
		this.buffer.uvs[uvIndex] = v;
		this.buffer.uvs[uvIndex + 1] = v;
		this.buffer.uvs.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertexNormal", { value: function setVertexNormal(vertex, normalX, normalY, normalZ)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		var normalIndex = index * 3;
		this.buffer.normals[normalIndex] = normalX;
		this.buffer.normals[normalIndex + 1] = normalY;
		this.buffer.normals[normalIndex + 2] = normalZ;
		this.buffer.normals.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setVertex", { value: function setVertex(vertex, x, y, z, u, v, normalX, normalY, normalZ)
{
	var index = this.getVertexIndex(vertex);
	if(index)
	{
		var xyzIndex = index * 3; this.buffer.vertices[xyzIndex] = x; this.buffer.vertices[xyzIndex + 1] = y; this.buffer.vertices[xyzIndex + 2] = z;
		var uvIndex = index * 2; this.buffer.uvs[uvIndex] = u; this.buffer.uvs[uvIndex + 1] = v;
		this.buffer.normals[xyzIndex] = normalX; this.buffer.normals[xyzIndex + 1] = normalY; this.buffer.normals[xyzIndex + 2] = normalZ;
		this.buffer.vertices.modified = this.buffer.uvs.modified = this.buffer.normals.modified = true;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "getVertexIndex", { value: function getVertexIndex(vertex)
{
	var vertices = 0;
	var range = this.vertexRanges.find(function isVertexWithinRange(range)
	{
		vertices += range[1] - range[0];
		return vertices >= vertex;
	}) || [ 0, vertices - vertex ];
	return range[1] - vertices + vertex;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setTriangleCorner", { value: function setTriangleCorner(triangle, corner, vertex)
{
	var index = this.getTriangleIndex(triangle);
	if(index)
		this.buffer.triangles[index + corner] = vertex;
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "setTriangle", { value: function setTriangle(triangle, cornerVertex0, cornerVertex1, cornerVertex2)
{
	var index = this.getTriangleIndex(triangle);
	if(index)
	{
		this.buffer.triangles[index] = cornerVertex0;
		this.buffer.triangles[index + 1] = cornerVertex1;
		this.buffer.triangles[index + 2] = cornerVertex2;
	}
	return index;
} });
Object.defineProperty(VertexBufferAllocation.prototype, "getTriangleIndex", { value: function getTriangleIndex(triangle)
{
	return (this.triangleRange[1] - this.triangleRange[0] > triangle ? this.triangleRange[0] + triangle : 0) * 3;
} });

function VertexBufferAllocation(buffer, index, vertexRanges, triangleRange)
{
	this.buffer = buffer;
	this.index = index;
	this.vertexRanges = vertexRanges;
	this.triangleRange = triangleRange;
}

Object.defineProperty(VertexBuffer.prototype, "allocate", { value: function allocate(vertexCount, triangleCount)
{
	triangleCount = triangleCount || vertexCount;
	var vertexRanges = [ ];
	var allocated = 0;
	var disallocations = [ ];
	this.disallocations.forEach(function addRangeToAllocate(disallocation)
	{
		var to = Math.min(disallocation[0] + Math.max(vertexCount - allocated, 0), disallocation[1]);
		if(allocated < vertexCount)
			vertexRanges.push([ disallocation[0], to ]);
		allocated += to - disallocation[0];
		if(to != disallocation[1])
		disallocations.push([ to, disallocation[1] ]);
	});
	this.disallocations = disallocations;
	var vertexBuffer = this.vertices.glBuffer;
	var vertices = this.vertices instanceof Float32Array ? Array.from(this.vertices) : this.vertices;
	var uvBuffer = this.uvs.glBuffer;
	var uvs = this.uvs instanceof Float32Array ? Array.from(this.uvs) : this.uvs;
	var normalBuffer = this.normals.glBuffer;
	var normals = this.normals instanceof Float32Array ? Array.from(this.normals) : this.normals;
	vertexRanges.forEach(function addVertexToRange(range)
	{
		for(var i = range[0]; i < range[1]; i++)
		{
			var xyzIndex = i * 3;
			var uvIndex = i * 2;
			vertices[xyzIndex] = vertices[xyzIndex + 1] = vertices[xyzIndex + 2] = uvs[uvIndex] = uvs[uvIndex + 1] = normals[xyzIndex] = normals[xyzIndex + 1] = normals[xyzIndex + 2] = 0;
		}
	});
	this.vertices = vertices;
	this.vertices.glBuffer = vertexBuffer;
	this.uvs = uvs;
	this.uvs.glBuffer = uvBuffer;
	this.normals = normals;
	this.normals.glBuffer = normalBuffer;
	this.triangles = new Uint16Array(Array.from(this.triangles).concat(new Array(triangleCount * 3).fill(0)));
	var allocation = new VertexBufferAllocation(this, this.allocations.length, vertexRanges, [ this.triangles.length / 3 - triangleCount, this.triangles.length / 3 ]);
	this.allocations.push(allocation);
	return allocation;
} });

function VertexBuffer()
{
	this.allocations = [ ];
	this.disallocations = [ [ 1, Infinity ] ];
	this.vertices = [ 0, 0, 0 ];
	this.uvs = [ 0, 0 ];
	this.normals = [ 0, 0, 0 ];
	this.triangles = new Uint16Array([ 0, 0, 0 ]);
}

Object.defineProperty(Timestamp, "merge", { value: function mergeTimestamps()
{
	var params = { };
	var fromTime = NaN;
	var toTime = NaN;
	for(var i = arguments.length - 1; i >= 0; i--)
	{
		var timestamp = arguments[i];
		if(timestamp instanceof Timestamp)
		{
			params = Object.merge(true, { }, params, timestamp.params);
			fromTime = fromTime ? Math.min(fromTime, timestamp.fromTime) : timestamp.fromTime;
			toTime = toTime ? Math.max(toTime, timestamp.fromTime + timestamp.time) : timestamp.fromTime + timestamp.time;
		}
	}
	return new Timestamp(JSON.parse(JSON.stringify(params)), fromTime, toTime - fromTime);	
} });
Object.defineProperty(Timestamp, "splitAll", { value: function splitAllTimestamps()
{
	var timestamps = [ ];
	var splitPoints = [ ];
	for(var i = 0; i < arguments.length; i++)
	{
		var  timestamp = arguments[i];
		if(timestamp instanceof Timestamp)
		{
			timestamps.push(timestamp);
			var toTime = timestamp.fromTime + timestamp.time;
			if(splitPoints.indexOf(timestamp.fromTime) < 0)
				splitPoints.push(timestamp.fromTime);
			if(splitPoints.indexOf(toTime) < 0)
				splitPoints.push(toTime);
		}
	}
	splitPoints.sort();
	var splitTimestamps = [ ];
	for(var i = 0; i < timestamps.length; i++)
	{
		var timestamp = timestamps[i];
		var splitTimestamp = timestamp.split.apply(timestamp, splitPoints);
		for(var j = 0; j < splitTimestamp.length; j++)
		{
			var splitTimestampSegment = splitTimestamp[j];
			var index = splitPoints.indexOf(splitTimestampSegment.fromTime);
			var a = splitTimestamps[index];
			if(!a)
				a = splitTimestamps[index] = [ ];
			a.push(splitTimestampSegment);
		}
	}
	timestamps = [ ];
	for(var i = 0; i < splitTimestamps.length; i++)
		timestamps.push(Timestamp.merge.apply(this, splitTimestamps[i]));
	return timestamps;
} });
Object.defineProperty(Timestamp.prototype, "isInTimestamp", { value: function isInTimestamp(time)
{
	return this.fromTime < time && this.fromTime + this.time > time;
} });
Object.defineProperty(Timestamp.prototype, "copy", { value: function copy()
{
	return new Timestamp(JSON.parse(JSON.stringify(this.params)), this.fromTime, this.time);
} });
Object.defineProperty(Timestamp.prototype, "split", { value: function split()
{
	var times = Array.from(arguments);
	var timestamp = this;
	var json = JSON.stringify(this.params);
	times = times.filter(wrapFunction(this.isInTimestamp, this));
	times.push(this.fromTime, this.fromTime + this.time);
	times.sort();
	var timestamps = [ ];
	for(var i = 0; i < times.length - 1; i++)
	{
		var fromTime = times[i];
		timestamps.push(new Timestamp(JSON.parse(json), fromTime, times[i + 1] - fromTime));
	}
	return timestamps;
} });

function Timestamp(params, fromTime, time)
{
	this.params = params || { };
	this.fromTime = fromTime || 0;
	this.time = time || 0;
}
Object.defineProperty(Control.prototype, "addControllers", { value: function addControllers()
{
	Array.forEach(parameters, function addControllerIfAbsent(controller)
	{
		if(!this.controllers.includes(controller))
			this.controllers.push(controller);
	}, this);
	return this;
} });
Object.defineProperty(Control.prototype, "reset", { value: function reset()
{
	this.mouseControllers.forEach(function deactivateMouseController(controller)
	{
		var controller = this.controls.controllers["mouse." + controller];
		if(controller)
			constroller.splice(controller.indexOf(this), 1);
	}, this);
	this.keyboardControllers.forEach(function deactivateKeyboardController(controller)
	{ 
		var controller = this.controls.controllers["keyboard." + controller];
		if(controller)
			controller.splice(controller.indexOf(this), 1);
	}, this);
	this.gamepadControllers.forEach(function deactivateGamepadController(controller)
	{
		var controller = this.controls.controllers["gamepad." + controller];
		if(controller)
			controller.splice(controller.indexOf(this), 1);
	}, this);
	this.defaultMouseControllers.forEach(function activateMouseController(controller)
	{
		var controllerName = "mouse." + controller;
		if(!this.controls.controllers[controllerName])
			this.controls.controllers[controllerName] = [ ];
		this.controls.controllers[controllerName].push(this);
	}, this);
	this.defaultKeyboardControllers.forEach(function activateKeyboardController(controller)
	{
		var controllerName = "keyboard." + controller;
		if(!this.controls.controllers[controllerName])
			this.controls.controllers[controllerName] = [ ];
		this.controls.controllers[controllerName].push(this);
	}, this);
	this.defaultGamepadControllers.forEach(function activateGamepadController(controller)
	{
		var controllerName = "gamepad." + controller;
		if(!this.controls.controllers[controllerName])
			this.controls.controllers[controllerName] = [ ];
		this.controls.controllers[controllerName].push(this);
	}, this);
	this.mouseControllers = Array.from(this.defaultMouseControllers);
	this.keyboardControllers = Array.from(this.defaultKeyboardControllers);
	this.gamepadControllers = Array.from(this.defaultGamepadControllers);
} });

function Control(controls, name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers)
{
	this.controls = controls;
	this.name = name;
	this.func = func;
	this.type = type;
	this.mouseControllerFilter = mouseControllerFilter || alwaysFalse;
	this.keyboardControllerFilter = keyboardControllerFilter || alwaysFalse;
	this.gamepadControllerFilter = gamepadControllerFilter || alwaysFalse;
	this.defaultMouseControllers = Array.from(defaultMouseControllers);
	this.defaultKeyboardControllers = Array.from(defaultKeyboardControllers);
	this.defaultGamepadControllers = Array.from(defaultGamepadControllers);
	this.mouseControllers = [ ];
	this.keyboardControllers = [ ];
	this.gamepadControllers = [ ];
	this.reset();
}

Mouse.prototype = Object.create(ElementFocusEventListener.prototype);
Mouse.prototype.constructor = Mouse;
Object.defineProperty(Mouse, "movementFilter", { value: function isMouseMovement(controller)
{
	return controller == "movement";
} });
Object.defineProperty(Mouse, "buttonFilter", { value: function isMouseButton(controller)
{
	return controller.startsWith("button");
} });
Object.defineProperty(Mouse, "wheelFilter", { value: function isMouseWheel(controller)
{
	return controller == "wheel";
} });
Object.defineProperty(Mouse.prototype, "onButtonDown", { value: function onButtonDown(button)
{
	if(this.focused)
	{
		var buttonArray = this.buttonArrays[button];
		if(!buttonArray)
			buttonArray = this.buttonArrays[button] = [ ];
		var params;
		if(buttonArray.length == 0 || buttonArray[keyArray.length - 1].time < Infinity)
		{
			params = { };
			buttonArray.push(this.timestamps.push(new Timestamp(params, Date.now(), Infinity)) - 1);
		}
		this.controls.getControls("mouse.button" + button).forEach(function processControl(control)
		{
			switch(control.type)
			{
				case 1:
				{
					var instaFuncParams = { };
					instaFuncParams.setPropertyAt("mouse." + control.name, true);
					control.func(instaFuncParams);
					break;
				}
				case 2:
				{
					if(params)
						params.setPropertyAt("mouse." + control.name, true);
					break;
				}
			}
		}, this);
	}
} });
Object.defineProperty(Mouse.prototype, "onButtonUp", { value: function onButtonUp(button)
{
	if(this.focused)
	{
		var now = Date.now();
		(this.buttonArrays[button] || [ ]).forEach(function setButtonTimestampToDefinite(index)
		{
			var timestamp = this.timestamps[index];
			if(timestamp && timestamp.time == Infinity)
				timestamp.time = now - timestamp.fromTime
		}, this);
		delete this.buttonArrays[button];
	}
} });
Object.defineProperty(Mouse.prototype, "onMouseMove", { value: function onMouseMove(movementX, movementY)
{
	if(this.focused && document.pointerLockElement == this.element)
	{
		this.lastMovementTime = this.lastMovementTime || Date.now();
		this.movementX += movementX;
		this.movementY += movementY;
		var movementInfo = [ Math.deg(Math.atan2(movementX, movementY)), Math.hypot(movementX, movementY) ];
		var instantControlFunctions = { list: [ ] };
		this.controls.getControls("mouse.movement").forEach(function pushControlFunctionIfInstantControl(control)
		{
			if(control.type == 1)
			{
				var params;
				if(instantControlFunctions[control.func])
					params = instantControlFunctions[control.func];
				else
				{
					instantControlFunctions.list.push(control.func);
					instantControlFunctions[control.func] = params = { };
				}
				params.setPropertyAt("mouse." + control.name, movementInfo);
				control.func(params);
			}
		});
		instantControlFunctions.list.forEach(function callInstantControlFunction(instantControlFunction)
		{
			instantControlFunction(instantControlFunctions[instantControlFunction]);
		});
	}
} });
Object.defineProperty(Mouse.prototype, "update", { value: function update(last, now)
{
	if(this.lastMovementTime && (this.movementX || this.movementY))
	{
		var params = { };
		var movementInfo = [ Math.deg(Math.atan2(this.movementX, this.movementY)), Math.hypot(this.movementX, this.movementY) ];
		this.controls.getControls("mouse.movement").forEach(function setControlRotaryParameter(control)
		{
			if(control.type == 2)
				params.setPropertyAt("mouse." + control.name, movementInfo);
		});
		this.timestamps.push(new Timestamp(params, this.lastMovementTime, now - this.lastMovementTime));
		this.lastMovementTime = NaN;
		this.movementX = this.movementY = 0;
	}
} });
Object.defineProperty(Mouse.prototype, "reset", { value: function reset()
{
	this.lastMovementTime = NaN;
	this.movementX = this.movementY = 0;
	this.timestamps = [ ];
	this.buttonArrays = { };
} });

function Mouse(parameters)
{
	parameters = parameters || { };
	ElementFocusEventListener.call(this, parameters);
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	this.addEventListener("mousedown", wrapEventListener(this.onButtonDown, this, "button"));
	this.addEventListener("mouseup", wrapEventListener(this.onButtonUp, this, "button"));
	this.addEventListener("mousemove", wrapEventListener(this.onMouseMove, this, "movementX", "movementY"));
}

Keyboard.prototype = Object.create(ElementFocusEventListener.prototype);
Keyboard.prototype.constructor = Keyboard;
Object.defineProperty(Keyboard, "keyFilter", { value: function isKeyboardKey(controller)
{
	return true;
} });
Object.defineProperty(Keyboard, "getKey", { value: function keyToString(key)
{
	if(key == " ")
		return "spacebar";
	else if(key.startsWith("Arrow"))
		return key.substring(5).toLowerCase();
	return key.toLowerCase();
} });
Object.defineProperty(Keyboard.prototype, "processKeyDown", { value: function processKeyDown(key)
{
	this.onKeyDown(Keyboard.getKey(key));
} });
Object.defineProperty(Keyboard.prototype, "onKeyDown", { value: function onKeyDown(key)
{
	if(this.focused)
	{
		var keyArray = this.keyArrays[key];
		if(!keyArray)
			keyArray = this.keyArrays[key] = [ ];
		var params;
		if(keyArray.length == 0 || keyArray[keyArray.length - 1].time < Infinity)
		{
			params = { };
			keyArray.push(this.timestamps.push(new Timestamp(params, Date.now(), Infinity)) - 1);
		}
		this.controls.getControls("keyboard." + key).forEach(function processControl(control)
		{
			switch(control.type)
			{
				case 1:
				{
					var instaFuncParams = { };
					instaFuncParams.setPropertyAt("keyboard." + control.name, true);
					control.func(instaFuncParams);
					break;
				}
				case 2:
				{
					if(params)
						params.setPropertyAt("keyboard." + control.name, true);
					break;
				}
			}
		}, this);
	}
} });
Object.defineProperty(Keyboard.prototype, "processKeyUp", { value: function processKeyUp(key)
{
	this.onKeyUp(Keyboard.getKey(key));
} });
Object.defineProperty(Keyboard.prototype, "onKeyUp", { value: function onKeyUp(key)
{
	if(this.focused)
	{
		var now = Date.now();
		(this.keyArrays[key] || [ ]).forEach(function setKeyTimestampToDefinite(index)
		{
			var timestamp = this.timestamps[index];
			if(timestamp && timestamp.time == Infinity)
				timestamp.time = now - timestamp.fromTime
		}, this);
		delete this.keyArrays[key];
	}
} });
Object.defineProperty(Keyboard.prototype, "reset", { value: function reset()
{
	this.timestamps = [ ];
	this.keyArrays = { };
} });

function Keyboard(parameters)
{
	parameters = parameters || { };
	ElementFocusEventListener.call(this, parameters);
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	this.addEventListener("keydown", wrapEventListener(this.processKeyDown, this, "key"));
	this.addEventListener("keyup", wrapEventListener(this.processKeyUp, this, "key"));
}

Gamepad.prototype = Object.create(ElementFocusEventListener.prototype);
Gamepad.prototype.constructor = Gamepad;
Object.defineProperty(Gamepad, "buttonFilter", { value: function isGamepadButton(controller)
{
	return controller.startsWith("button");
} });
Object.defineProperty(Gamepad, "analogFilter", { value: function isGamepadAnalogStick(controller)
{
	return controller.startsWith("analog");
} });
Object.defineProperty(Gamepad.prototype, "update", { value: function update(last, now)
{
	if(this.focused)
	{
		var gamepads = navigator.getGamepads();
		for(var i = 0; i < gamepads.length; i++)
		{
			var gamepad = gamepads[i];
			if(gamepad)
			{
				var params = { };
				for(var j = 0; j < Math.floor(gamepad.axes.length / 2); j++)
				{
					var analogX = gamepad.axes[j * 2];
					var analogY = -gamepad.axes[(j * 2) + 1];
					var deadZone = this.controls.game.options.controls.gamepad.deadZone;
					if(Math.abs(analogX) < deadZone)
						analogX = 0;
					if(Math.abs(analogY) < deadZone)
						analogY = 0;
					var controller = "analog" + j;
					if(analogX != 0 || analogY != 0)
					{
						var analogInfo = [ Math.deg(Math.atan2(analogX, analogY)), Math.hypot(analogX, analogY) ];
						this.controls.getControls("gamepad." + controller).forEach(function setControlRotaryParameter(control)
						{
							params.setPropertyAt("gamepad." + control.name, analogInfo);
						});
					}
				}
				for(var j = 0; j < gamepad.buttons.length; j++)
				{
					var buttonPressed = gamepad.buttons[j].pressed;
					var controller = "button" + j;
					if(buttonPressed)
					{
						this.controls.getControls("gamepad." + controller).forEach(function setControlButtonParameter(control)
						{
							params.setPropertyAt("gamepad." + control.name, true);
						}, this);
					}
				}
				if(Object.entries(params).length > 0)
					this.timestamps.push(new Timestamp(params, last, now - last));
			}
		}
	}
} });

function Gamepad(parameters)
{
	this.timestamps = [ ];
	if(parameters.controls instanceof Controls)
		this.controls = parameters.controls;
	ElementFocusEventListener.call(this, parameters);
}

Controls.prototype = Object.create(ElementEventListener.prototype);
Controls.prototype.constructor = Controls;
Object.defineProperty(Controls.prototype, "onElementDelete", { value: function onElementDelete()
{
	callSuper(this, "onElementDelete");
	this.keyboard.element = this.mouse.element = this.gamepad.element = undefined;
} });
Object.defineProperty(Controls.prototype, "onElementSet", { value: function onElementSet()
{
	callSuper(this, "onElementSet");
	this.keyboard.element = this.mouse.element = this.gamepad.element = this.element;
} });
Object.defineProperty(Controls.prototype, "addControl", { value: function addControl(name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers)
{
	var control = this.controls[name] = new Control(this, name, func, type, mouseControllerFilter, keyboardControllerFilter, gamepadControllerFilter, defaultMouseControllers, defaultKeyboardControllers, defaultGamepadControllers);
	if(type == 2)
		this.addControlsLoopFunc(func);
} });
Object.defineProperty(Controls.prototype, "getControl", { value: function getControl(name)
{
	return this.controls[name] || this.nullKeyBinding;
} });
Object.defineProperty(Controls.prototype, "getControls", { value: function getControls(controller)
{
	return this.controllers[controller] || [ ];
} });
Object.defineProperty(Controls.prototype, "addControlsLoopFunc", { value: function addControlsLoopFunc(func)
{
	var index = this.controlsLoopFuncs.indexOf(func);
	if(index < 0)
		index = this.controlsLoopFuncs.push(func) - 1;
	this.controlsLoopFuncs[0][index - 1] = (this.controlsLoopFuncs[0][index - 1] || 0) + 1;
} });
Object.defineProperty(Controls.prototype, "removeControlsLoopFunc", { value: function removeControlsLoopFunc(func)
{
	var index = this.controlsLoopFuncs.indexOf(func);
	if(index >= 0)
	{
		var funcs = (this.controlsLoopFuncs[0][index - 1] || 0) - 1;
		if(funcs <= 0)
		{
			this.controlsLoopFuncs[index] = null;
		}
	}
} });
Object.defineProperty(Controls.prototype, "startControlsLoop", { value: function startControlsLoop()
{
	this.controlsLoopTimeout = setTimeout(this.controlsLoop, 0, this);
} });
Object.defineProperty(Controls.prototype, "endControlsLoop", { value: function endControlsLoop()
{
	clearTimeout(this.controlsLoopTimeout);
} });
Object.defineProperty(Controls.prototype, "controlsLoop", { value: function controlsLoop(controls)
{
	var now = Date.now();
	controls.bindingFuncLoopTimeout = setTimeout(controls.controlsLoop, 0, controls);
	controls.mouse.update(controls.lastControlsLoop || now, now);
	controls.gamepad.update(controls.lastControlsLoop || now, now);
	var timestamps = Timestamp.splitAll.apply(null, function processControlTimestamps()
	{	
		var timestamps = [ ];
		Array.forEach(arguments, function addControlTimestamps(ts)
		{
			ts.forEach(function addControlTimestamp(timestamp, index, array)
			{
				if(timestamp.time == Infinity)
				{
					var newTimestamp = timestamp.copy();
					newTimestamp.time = now - newTimestamp.fromTime;
					timestamps.push(newTimestamp);
					timestamp.fromTime = now;
				}
				else
				{
					timestamps.push(timestamp);
					delete array[index];
				}
			});
		});
		return timestamps;
	}(controls.mouse.timestamps, controls.keyboard.timestamps, controls.gamepad.timestamps));
	for(var i = 1; i < controls.controlsLoopFuncs.length; i++)
		controls.controlsLoopFuncs[i](timestamps, controls.lastControlsLoop, now);
	controls.lastControlsLoop = now;
} });
Object.defineProperty(Controls.prototype, "unload", { value: function unload()
{
	this.endControlsLoop();
} });

function Controls(parameters)
{
	parameters = parameters || { };
	this.game = parameters.game;
	this.nullControl = new Control(this, "null", emptyFunction, 0, undefined, undefined, undefined, [ ], [ ], [ ]);
	this.controls = { };
	this.controllers = { };
	this.controlsLoopFuncs = [ [ ] ];
	if(!parameters.mouse)
		parameters.mouse = { };
	parameters.mouse.controls = this;
	if(!parameters.keyboard)
		parameters.keyboard = { };
	parameters.keyboard.controls = this;
	if(!parameters.gamepad)
		parameters.gamepad = { };
	parameters.gamepad.controls = this;
	this.mouse = parameters.mouse instanceof Mouse ? parameters.mouse : new Mouse(parameters.mouse);
	this.keyboard = parameters.keyboard instanceof Keyboard ? parameters.keyboard : new Keyboard(parameters.keyboard);
	this.gamepad = parameters.gamepad instanceof Gamepad ? parameters.gamepad : new Gamepad(parameters.gamepad);
	ElementEventListener.call(this, parameters);
}

Renderer.prototype = Object.create(ElementEventListener.prototype);
Renderer.prototype.constructor = Renderer;
Object.defineProperty(Renderer.prototype, "animate", { value: function animate(now)
{
	now /= 1000;
	if(this.then)
	{
		var delta = now - this.then;
		this.render();
	}
	this.then = now;
	requestAnimationFrame(wrapFunction(this.animate, this));
} });
Object.defineProperty(Renderer.prototype, "render", { value: function render(delta)
{
	var updateRequests = this.updateRequests;
	this.updateRequests = [ ];
	updateRequests.forEach(function callUpdateRequest(request)
	{
		if(request())
		{
			index = this.updateRequests.push(request) - 1;
			if(request.reindexListener)
				request.reindexListener(index);
		}
	}, this);
	return true;
} });
Object.defineProperty(Renderer.prototype, "resize", { value: function resize()
{
	this.game.level.projection.aspect = this.game.gui.projection.aspect = window.innerWidth / window.innerHeight;
} });
Object.defineProperty(Renderer.prototype, "bindTextureMap", { value: function bindTextureMap()
{
} });
Object.defineProperty(Renderer.prototype, "unload", { value: function unload()
{
	this.layers.forEach(function unloadLayer(layer)
	{
		layer.unload();
	});
} });

function Renderer(parameters)
{
	parameters = parameters || { };
	this.game = parameters.game;
	if(!parameters.textureMap)
		parameters.textureMap = { };
	parameters.textureMap.renderer = this;
	this.textureMap = parameters.textureMap instanceof TextureMap ? parameters.textureMap : new TextureMap(parameters.textureMap);
	this.registeredLights = Number.isInteger(parameters.registeredLights) ? parameters.registeredLights : 0;
	this.updateRequests = Array.isArray(parameters.updateRequests) ? parameters.updateRequests : Array.from(parameters.updateRequests);
	this.layers = Array.isArray(parameters.layers) ? parameters.layers : Array.from(parameters.layers);
	this.resizeWrapper = wrapFunction(this.resize, this);
	ElementEventListener.call(this, parameters);
}

WebGLRenderer.prototype = Object.create(Renderer.prototype);
WebGLRenderer.prototype.constructor = WebGLRenderer;
Object.defineProperty(WebGLRenderer.prototype, "onElementDelete", { value: function onElementDelete()
{
	delete this.gl;
} });
Object.defineProperty(WebGLRenderer.prototype, "onElementSet", { value: function onElementSet()
{
	callSuper(this, "onElementSet");
	if(this.element.getContext)
	{
		this.gl = this.element.getContext("webgl2") || this.game.element.getContext("webgl") || this.game.element.getContext("experimental-webgl");
		this.setup();
		if(!this.shaders)
			this.requestShaders("default");
	}
} });
Object.defineProperty(WebGLRenderer.prototype, "setup", { value: function setup()
{
	this.gl.clearColor(0, 0, 0, 1);
	this.gl.clearDepth(1);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.cullFace(this.gl.FRONT);
} });
Object.defineProperty(WebGLRenderer.prototype, "requestShaders", { value: function requestShaders(name)
{
	var shader = this.game.directory.shaders[name];
	var rawVertex;
	var rawFragment;
	var compileShaders = wrapFunction(function compileShaders()
	{
		if(rawVertex && rawFragment)
		{
			this.shaders = new GLSLShaders(this, { vertex: { raw: rawVertex, canReformat: shader.vertex.canReformat, format: shader.vertex.format }, fragment: { raw: rawFragment, canReformat: shader.fragment.canReformat, format: shader.fragment.format } });
		}
	}, this);
	requestText("resources/shaders/" + shader.vertex.source, function compileIfFragmentPresent(text)
	{
		rawVertex = text;
		compileShaders();
	});
	requestText("resources/shaders/" + shader.fragment.source, function compileIfVertexPresent(text)
	{
		rawFragment = text;
		compileShaders();
	});	
} });
Object.defineProperty(WebGLRenderer.prototype, "render", { value: function render(delta)
{
	if(this.gl)
	{
		if(this.textureMap.modified)
		{
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.gl.createTexture());
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureMap.stitched);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			this.gl.generateMipmap(this.gl.TEXTURE_2D);
			this.gl.activeTexture(this.gl.TEXTURE0);
			this.textureMap.modified = false;
			this.layers.forEach(function notifyLayerOfTextureMapChange(layer)
			{
				layer.onTextureMapChange(this);
			});
			this.textureMap.modified = false;
		}
		if(callSuper(this, "render", delta) && this.shaders)
		{
			this.shaders.tryRecompileShaders(this);
			this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
			this.layers.forEach(function drawLayer(layer)
			{
				if(!(layer.vertexBuffer.vertices instanceof Float32Array))
				{
					var glBuffer = layer.vertexBuffer.vertices.glBuffer;
					var vertices = layer.vertexBuffer.vertices = new Float32Array(layer.vertexBuffer.vertices);
					if(!glBuffer)
						this.bindShaderAttribute(glBuffer = this.gl.createBuffer(), 0, this.shaders.attributes.vertexPosition, layer.vertexBuffer.vertices, { });
					vertices.glBuffer = glBuffer;
					vertices.modified = true;
				}
				if(!(layer.vertexBuffer.uvs instanceof Float32Array))
				{
					var glBuffer= layer.vertexBuffer.uvs.glBuffer;
					var uvs = layer.vertexBuffer.uvs = new Float32Array(layer.vertexBuffer.uvs);
					if(!glBuffer)
						this.bindShaderAttribute(glBuffer = this.gl.createBuffer(), 0, this.shaders.attributes.textureCoord, layer.vertexBuffer.uvs, { components: 2 });
					uvs.glBuffer = glBuffer;
					uvs.modified = true;
				}
				if(!(layer.vertexBuffer.normals instanceof Float32Array))
				{
					var glBuffer = layer.vertexBuffer.normals.glBuffer;
					var normals = layer.vertexBuffer.normals = new Float32Array(layer.vertexBuffer.normals);
					if(!glBuffer)
						this.bindShaderAttribute(glBuffer = this.gl.createBuffer(), 0, this.shaders.attributes.normalDirection, layer.vertexBuffer.normals, { });
					normals.glBuffer = glBuffer;
					normals.modified = true;
				}
				if(layer.vertexBuffer.vertices.modified)
				{
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, layer.vertexBuffer.vertices.glBuffer);
					this.gl.bufferData(this.gl.ARRAY_BUFFER, layer.vertexBuffer.vertices, this.gl.STATIC_DRAW);
					layer.vertexBuffer.vertices.modified = false;
				}
				if(layer.vertexBuffer.uvs.modified)
				{	
					layer.vertexBuffer.uvs.modified = false;
				}
				if(layer.vertexBuffer.normals.modified)
				{
					layer.vertexBuffer.normals.modified = false;
				}
				var indexBuffer = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
				this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, layer.vertexBuffer.triangles, this.gl.STATIC_DRAW);
				this.gl.useProgram(this.shaders.program);
				var aIntensity = layer.lighting.ambient.intensity;
				var aColor = layer.lighting.ambient.color;
				this.gl.uniform3f(this.shaders.uniforms.ambientColor, (aColor.r + 1) / 256 * aIntensity, (aColor.g + 1) / 256 * aIntensity, (aColor.b + 1) / 256 * aIntensity);
				layer.lighting.directionals.forEach(function pushLightToGPU(directional, index)
				{
					if(index < this.registeredLights)
					{
						var direction = directional.direction;
						this.gl.uniform3fv(this.shaders.uniforms.dlDirections[index], new Float32Array(direction));
						var dIntensity = directional.intensity;
						var dColor = directional.color;
						this.gl.uniform3fv(this.shaders.uniforms.dlColors[index], [ (dColor.r + 1) / 256 * dIntensity, (dColor.g + 1) / 256 * dIntensity, (dColor.b + 1) / 256 * dIntensity ]);
					}
				});
				if(layer.projection.matrix.modified)
				{
					this.gl.uniformMatrix4fv(this.shaders.uniforms.projectionMatrix, false, layer.projection.matrix);
					layer.projection.matrix.modified = false;
				}
				if(layer.modelView.matrix.modified)
				{
					this.gl.uniformMatrix4fv(this.shaders.uniforms.modelViewMatrix, false, layer.modelView.matrix);
					this.gl.uniformMatrix3fv(this.shaders.uniforms.normalMatrix, false, mat3.transpose([ ], mat3.invert([ ], mat3.fromMat4([ ], layer.modelView.matrix))));
					layer.modelView.matrix.modified = false;
				}
				this.gl.uniform1i(this.shaders.uniforms.uSampler, 0);
				this.gl.drawElements(this.gl.TRIANGLES, layer.vertexBuffer.triangles.length, this.gl.UNSIGNED_SHORT, 0);
			}, this);
			return true;
		}
		return false;
	}
	callSuper(this, "render", delta);
	return false;
} });
Object.defineProperty(WebGLRenderer.prototype, "bindShaderAttribute", { value: function bindShaderAttribute(buffer, type, location, source, parameters)
{
	switch(type)
	{
		case 0:
		{
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, source, this.gl.STATIC_DRAW);
			this.gl.vertexAttribPointer(location, parameters.components || 3, parameters.type || this.gl.FLOAT, parameters.normalize || false, parameters.stride || 0, parameters.offset || 0);
			this.gl.enableVertexAttribArray(location);
			break;
		}
	}
} });
Object.defineProperty(WebGLRenderer.prototype, "resize", { value: function resize()
{
	callSuper(this, "resize");
	this.gl.viewport(0, 0, innerWidth, innerHeight);
	this.game.element.width = innerWidth; this.game.element.height = innerHeight;
} });
Object.defineProperty(WebGLRenderer.prototype, "bindTextureMap", { value: function bindTextureMap()
{
	this.textureMap.modified = true;
} });

function WebGLRenderer(parameters)
{
	parameters = parameters || { };
	Renderer.call(this, parameters);
}

Object.defineProperty(GLSLShaders, "populateShader", { value: function populateShader(shader, parameters)
{
	shader.raw = parameters.raw || "";
	shader.canReformat = parameters.canReformat ? new Function("renderer", parameters.canReformat) : alwaysFalse;
	shader.format = parameters.format ? new Function("renderer", "raw", parameters.format) : function unmodifiedShader(renderer, raw) { return raw; }; 
	return shader;
} });
Object.defineProperty(GLSLShaders.prototype, "tryRecompileShaders", { value: function tryRecompileShaders(renderer)
{
	var program = this.program;
	var relink = false;
	relink |= this.tryRecompileShader(renderer, this.vertex);
	relink |= this.tryRecompileShader(renderer, this.fragment);
	if(relink)
	{
		renderer.gl.linkProgram(program);
		this.populateVariables(renderer);
	}
} });
Object.defineProperty(GLSLShaders.prototype, "tryRecompileShader", { value: function tryRecompileShader(renderer, shader)
{
	if(shader.canReformat(renderer))
	{
		this.compileShader(renderer, shader);
		return true;
	}
	return false;
} });
Object.defineProperty(GLSLShaders.prototype, "compileShader", { value: function compileShader(renderer, shader)
{
	renderer.gl.shaderSource(shader, shader.format(renderer, shader.raw));
	renderer.gl.compileShader(shader);
} });
Object.defineProperty(GLSLShaders.prototype, "populateVariables", { value: function populateVariables(renderer)
{
	this.attributes = this.getAttributes(renderer);
	this.uniforms = this.getUniforms(renderer);
} });
Object.defineProperty(GLSLShaders.prototype, "getAttributes", { value: function getAttributes(renderer)
{
	var attributes =
	{
		vertexPosition: renderer.gl.getAttribLocation(this.program, "aVertexPosition"),
		textureCoord: renderer.gl.getAttribLocation(this.program, "aTextureCoord"),
		normalDirection: renderer.gl.getAttribLocation(this.program, "aNormalDirection")
	};
	return attributes;
} });
Object.defineProperty(GLSLShaders.prototype, "getUniforms", { value: function getUniforms(renderer)
{
	var uniforms =
	{
		projectionMatrix: renderer.gl.getUniformLocation(this.program, "uProjectionMatrix"),
		modelViewMatrix: renderer.gl.getUniformLocation(this.program, "uModelViewMatrix"),
		normalMatrix: renderer.gl.getUniformLocation(this.program, "uNormalMatrix"),
		uSampler: renderer.gl.getUniformLocation(this.program, "uSampler"),
		ambientColor: renderer.gl.getUniformLocation(this.program, "uAmbientColor"),
		dlDirections: [ ],
		dlColors: [ ]
	}
	for(var i = 0; i < renderer.registeredLights; i++)
	{
		uniforms.dlDirections[i] = renderer.gl.getUniformLocation(this.program, "uDlDirections[" + i + "]");
		uniforms.dlColors[i] = renderer.gl.getUniformLocation(this.program, "uDlColors[" + i + "]");
	}
	return uniforms;
} });

function GLSLShaders(renderer, parameters)
{
	parameters = parameters || { };
	this.program = parameters.program || renderer.gl.createProgram();
	this.vertex = GLSLShaders.populateShader(renderer.gl.createShader(renderer.gl.VERTEX_SHADER), parameters.vertex || { });
	this.fragment = GLSLShaders.populateShader(renderer.gl.createShader(renderer.gl.FRAGMENT_SHADER), parameters.fragment || { });
	this.compileShader(renderer, this.vertex);
	this.compileShader(renderer, this.fragment);
	renderer.gl.attachShader(this.program, this.vertex);
	renderer.gl.attachShader(this.program, this.fragment);
	renderer.gl.linkProgram(this.program);
	this.populateVariables(renderer);
}

Projection.prototype = Object.create(Updatable.prototype);
Projection.prototype.constructor = Projection;
Object.defineProperty(Projection.prototype, "aspect", { get: function getAspect()
{
	return this._aspect;
}, set: function setAspect(aspect)
{
	this._aspect = aspect;
	this.requestUpdate();
} });
Object.defineProperty(Projection.prototype, "near", { get: function getNear()
{
	return this._near;
}, set: function setNear(near)
{
	this._near = near;
	this.requestUpdate();
} });
Object.defineProperty(Projection.prototype, "far", { get: function getFar()
{
	return this._far;
}, set: function setFar(far)
{
	this._far = far;
	this.requestUpdate();
} });

function Projection(parameters)
{
	parameters = parameters || { };
	Updatable.call(this, parameters);
	this.matrix = new Float32Array(mat4.create());
	this.matrix.defaultMatrix = true;
	this.matrix.modified = true;
	this.aspect = window.innerWidth / window.innerHeight;
	this.near = parameters.near || .1;
	this.far = parameters.far || 100;
}

PerspectiveProjection.prototype = Object.create(Projection.prototype);
PerspectiveProjection.prototype.constructor = PerspectiveProjection;
Object.defineProperty(PerspectiveProjection.prototype, "update", { value: function update()
{
	var rotation = (this.camera || { }).rotation;
	if(this.camera)
	{
		mat4.rotateZ(this.matrix, mat4.rotateY([ ], mat4.rotateX([ ], mat4.perspective([ ], Math.rad(this.camera.fov), this.aspect, this.near, this.far), Math.rad(-rotation[0])), Math.rad(rotation[1])), Math.rad(rotation[2]));
		this.matrix.defaultMatrix = false;
		this.matrix.modified = true;
	}
	else if(!this.matrix.defaultMatrix)
	{
		this.matrix[0] = 1;
		this.matrix[1] = 0;
		this.matrix[2] = 0;
		this.matrix[3] = 0;
		this.matrix[4] = 0;
		this.matrix[5] = 1;
		this.matrix[6] = 0;
		this.matrix[7] = 0;
		this.matrix[8] = 0;
		this.matrix[9] = 0;
		this.matrix[10] = 1;
		this.matrix[11] = 0;
		this.matrix[12] = 0;
		this.matrix[13] = 0;
		this.matrix[14] = 0;
		this.matrix[15] = 1;
		this.matrix.defaultMatrix = true;
		this.matrix.modified = true;
	}
} });
Object.defineProperty(PerspectiveProjection.prototype, "camera", { get: function getCamera()
{
	return this._camera;
}, set: function setCamera(camera)
{
	if(this._camera)
	{
		this._camera.removeWatcher(this.cameraWatcher);
		this._camera.rotation.removeWatcher(this.rotationWatcher);
	}
	if(camera)
	{
		this.cameraWatcher = camera.watch(this.requestUpdate, this);
		this.rotationWatcher = camera.rotation.watch(this.requestUpdate, this);
	}
	else
	{
		this.cameraWatcher = undefined;
		this.rotationWatcher = undefined;
		this.requestUpdate();
	}
	this._camera = camera; 
} });

function PerspectiveProjection(parameters)
{
	parameters = parameters || { };
	Projection.call(this, parameters);
	this.camera = parameters.camera;
}

OrthographicProjection.prototype = Object.create(Projection.prototype);
OrthographicProjection.prototype.constructor = OrthographicProjection;
Object.defineProperty(OrthographicProjection.prototype, "horizontal", { set: function setHorizontal(horizontal)
{
	this.left = -(this.right = horizontal / 2);
} });
Object.defineProperty(OrthographicProjection.prototype, "vertical", { set: function setVertical(vertical)
{
	this.bottom = -(this.top = vertical / 2);
} });
Object.defineProperty(OrthographicProjection.prototype, "left", { get: function getLeft()
{
	return this._left;
}, set: function setLeft(left)
{
	this._left = left;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicProjection.prototype, "right", { get: function getRight()
{
	return this._right;
}, set: function setRight(right)
{
	this._right = right;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicProjection.prototype, "bottom", { get: function getBottom()
{
	return this._bottom;
}, set: function setBottom(bottom)
{
	this._bottom = bottom;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicProjection.prototype, "top", { get: function getTop()
{
	return this._top;
}, set: function setTop(top)
{
	this._top = top;
	this.requestUpdate();
} });
Object.defineProperty(OrthographicProjection.prototype, "update", { value: function update()
{
	mat4.ortho(this.matrix, this.left * this.aspect, this.right * this.aspect, this.bottom, this.top, this.near, this.far);
} });

function OrthographicProjection(parameters)
{
	parameters = parameters || { };
	Projection.call(this, parameters);
	this.left = parameters.left || parameters.horizontal / -2 || -1;
	this.right = parameters.right || parameters.horizontal / 2 || 1;
	this.bottom = parameters.bottom || parameters.vertical / -2 || -1;
	this.top = parameters.top || parameters.vertical / 2 || 1;
}

ModelView.prototype = Object.create(Updatable.prototype);
ModelView.prototype.constructor = ModelView;

function ModelView(parameters)
{
	parameters = parameters || { };
	Updatable.call(this, parameters);
	this.matrix = new Float32Array(mat4.create());
	this.matrix.defaultMatrix = true;
	this.matrix.modified = true;
}

CameraModelView.prototype = Object.create(ModelView.prototype);
CameraModelView.prototype.constructor = CameraModelView;
Object.defineProperty(CameraModelView.prototype, "update", { value: function update()
{
	var position = (this.camera || { }).position;
	if(this.camera)
	{
		mat4.invert(this.matrix, mat4.translate([ ], mat4.identity([ ]), position));
		this.matrix.defaultMatrix = false;
		this.matrix.modified = true;
	}
	else if(!this.matrix.defaultMatrix)
	{
		this.matrix[0] = 1;
		this.matrix[1] = 0;
		this.matrix[2] = 0;
		this.matrix[3] = 0;
		this.matrix[4] = 0;
		this.matrix[5] = 1;
		this.matrix[6] = 0;
		this.matrix[7] = 0;
		this.matrix[8] = 0;
		this.matrix[9] = 0;
		this.matrix[10] = 1;
		this.matrix[11] = 0;
		this.matrix[12] = 0;
		this.matrix[13] = 0;
		this.matrix[14] = 0;
		this.matrix[15] = 1;
		this.matrix.defaultMatrix = true;
		this.matrix.modified = true;
	}
} });
Object.defineProperty(CameraModelView.prototype, "camera", { get: function getCamera()
{
	return this._camera;
}, set: function setCamera(camera)
{
	if(this._camera)
		this._camera.position.removeWatcher(this.positionWatcher);
	if(camera)
		this.positionWatcher = camera.position.watch(this.requestUpdate, this);
	else
	{
		this.positionWatcher = undefined;
		this.requestUpdate();
	}
	this._camera = camera;
} });

function CameraModelView(parameters)
{
	parameters = parameters || { };
	ModelView.call(this, parameters);
	this.camera = parameters.camera;
}

Light.prototype = Object.create(Watchable.prototype);
Light.prototype.constructor = Light;

function Light(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.color = parameters.color instanceof Color ? parameters.color : new Color(parameters.color || [ 255, 255, 255 ]);
	this.intensity = parameters.intensity || 1;
}

DirectionalLight.prototype = Object.create(Light.prototype);
DirectionalLight.prototype.constructor = DirectionalLight;

function DirectionalLight(parameters)
{
	parameters = parameters || { };
	Light.call(this, parameters);
	this.direction = parameters.direction instanceof Vector3 ? parameters.direction : new Vector3(parameters.direction);
}

function Lighting(parameters)
{
	parameters = parameters || { };
	this.ambient = parameters.ambient instanceof Light ? parameters.ambient : new Light(parameters.ambient);
	this.directionals = parameters.directionals || [ ];
	this.points = parameters.points || [ ];
}

Layer.prototype = Object.create(Watchable.prototype);
Layer.prototype.constructor = Layer;
Object.defineProperty(Layer.prototype, "onTextureMapChange", { value: function onTextureMapChange(renderer)
{
	this.geometries.forEach(function notifyGeometryOfTextureMapChange(geometry)
	{
		geometry.onTextureMapChange(renderer);
	});
} });

function Layer(parameters)
{
	parameters = parameters || { };
	Watchable.call(this, parameters);
	this.game = parameters.game;
	this.geometries = [ ];
	this.vertexBuffer = new VertexBuffer();
	if(!parameters.projection)
		parameters.projection = { };
	parameters.projection.game = this.game;
	if(!parameters.modelView)
		parameters.modelView = { };
	parameters.modelView.game = this.game;
	this.projection = parameters.projection instanceof Projection ? parameters.projection : new Projection(parameters.projection);
	this.modelView = parameters.modelView instanceof ModelView ? parameters.modelView : new ModelView(parameters.modelView);
	this.lighting = parameters.lighting instanceof Lighting ? parameters.lighting : new Lighting(parameters.lighting);
}

Gui.prototype = Object.create(Layer.prototype);
Gui.prototype.constructor = Gui;
Object.defineProperty(Gui.prototype, "unload", { value: function unload() { } });

function Gui(parameters)
{
	parameters = parameters || { };
	Layer.call(this, parameters);
	this.projection = parameters.projection instanceof OrthographicProjection ? parameters.projection : new OrthographicProjection(parameters.projection);
}

Object.defineProperty(Player.prototype, "updateCameraPosition", { value: function updateCameraPosition()
{
	this.camera.position.set(this.position.copy().add(this.headOffset));
} });
Object.defineProperty(Player.prototype, "instantControls", { value: function instantControls(params)
{
	var mouse = params.mouse;
	var lookAngle = NaN;
	var lookDistance = 0;
	if(mouse.instalook)
	{
		lookAngle = averageDegrees(lookAngle, mouse.instalook.horizontal ? degreesReflectionX(mouse.instalook.horizontal[0]) : NaN);
		lookDistance = mouse.instalook.horizontal ? Math.max(Math.min(mouse.instalook.horizontal[1], 2), lookDistance) : lookDistance;
	}
	if(!isNaN(lookAngle))
	{
		this.camera.rotation[0] = Math.max(Math.min(this.camera.rotation[0] + Math.cos(Math.rad(lookAngle)) * lookDistance, 90), -90);
		this.camera.rotation[1] += Math.sin(Math.rad(lookAngle)) * lookDistance;
	}
} });
Object.defineProperty(Player.prototype, "controlsLoop", { value: function controlsLoop(timestamps, last, now)
{
	timestamps.forEach(function timeBasedMove(timestamp)
	{
		var positionOffset = [ 0, 0, 0 ];
		var mouse = timestamp.params.mouse || { };
		var keyboard = timestamp.params.keyboard || { };
		var gamepad = timestamp.params.gamepad || { };
		var lookAngle = NaN;
		var lookDistance = 0;
		if(keyboard.look)
		{
			lookAngle = averageDegrees(lookAngle, averageDegrees(averageDegrees(keyboard.look.downwards ? 180 : NaN, keyboard.look.upwards ? 0 : NaN), averageDegrees(keyboard.look.leftwards ? -90 : NaN, keyboard.look.rightwards ? 90 : NaN)));
			lookDistance = 1;
		}
		if(gamepad.look)
		{
			lookAngle = averageDegrees(lookAngle, averageDegrees(averageDegrees(gamepad.look.downwards ? 180 : NaN, gamepad.look.upwards ? 0 : NaN), averageDegrees(gamepad.look.leftwards ? -90 : NaN, gamepad.look.rightwards ? 90 : NaN)));
			lookAngle = averageDegrees(lookAngle, gamepad.look.horizontal ? gamepad.look.horizontal[0] : NaN);
			lookDistance = gamepad.look.horizontal ? Math.max(Math.min(gamepad.look.horizontal[1], 1), lookDistance) : lookDistance;
		}
		if(!isNaN(lookAngle))
		{
			this.camera.rotation[0] = Math.max(Math.min(this.camera.rotation[0] + Math.cos(Math.rad(lookAngle)) * lookDistance, 90), -90);
			this.camera.rotation[1] += Math.sin(Math.rad(lookAngle)) * lookDistance;
		}
		var moveAngle = NaN;
		var moveDistance = 1;
		if(keyboard.movement)
		{
			moveAngle = averageDegrees(moveAngle, averageDegrees(averageDegrees(keyboard.movement.forwards ? 0 : NaN, keyboard.movement.backwards ? 180 : NaN), averageDegrees(keyboard.movement.leftwards ? -90 : NaN, keyboard.movement.rightwards ? 90 : NaN)));
			positionOffset[1] += ((keyboard.movement.upwards ? 1 : 0) + (keyboard.movement.downwards ? -1 : 0)) * timestamp.time / 1000;
		}
		if(gamepad.movement)
		{
			moveAngle = averageDegrees(moveAngle, averageDegrees(averageDegrees(gamepad.movement.forwards ? 0 : NaN, gamepad.movement.backwards ? 180 : NaN), averageDegrees(gamepad.movement.leftwards ? -90 : NaN, gamepad.movement.rightwards ? 90 : NaN)));
			moveAngle = averageDegrees(moveAngle, gamepad.movement.horizontal ? gamepad.movement.horizontal[0] : NaN);
			moveDistance = gamepad.movement.horizontal ? gamepad.movement.horizontal[1] : moveDistance;
			positionOffset[1] += ((gamepad.movement.upwards ? 1 : 0) + (gamepad.movement.downwards ? -1 : 0)) * timestamp.time / 1000;
		}
		if(!isNaN(moveAngle))
		{
			positionOffset[0] += Math.sin(Math.rad(this.camera.rotation[1]) + Math.rad(moveAngle)) * timestamp.time / 1000 * moveDistance;
			positionOffset[2] -= Math.cos(Math.rad(this.camera.rotation[1]) + Math.rad(moveAngle)) * timestamp.time / 1000 * moveDistance;
		}
		if(keyboard)
		{
		}
		this.position.add(positionOffset);
	}, this);
} });

function Player(parameters)
{
	parameters = parameters || { };
	this.level = parameters.level;
	this.camera = new Camera(parameters.camera);
	this.position = parameters.position instanceof Vector3 ? parameters.position : new Vector3(parameters.position);
	this.headOffset = parameters.eyeOffset instanceof Vector3 ? parameters.headOffset : new Vector3(parameters.eyeOffset || [ 0, 1, 0 ]);
	this.position.watch(this.updateCameraPosition, this);
	this.headOffset.watch(this.updateCameraPosition, this);
	this.headRotation = parameters.headRotation instanceof RotationVector3 ? parameters.headRotation : new RotationVector3(parameters.headRotation);
	this.controlsLoopWrapped = wrapFunction(this.controlsLoop, this);
}

Level.prototype = Object.create(Layer.prototype);
Level.prototype.constructor = Level;
Object.defineProperty(Level.prototype, "unload", { value: function unload()
{
} });

function Level(parameters)
{
	parameters = parameters || { };
	Layer.call(this, parameters);
	if(!parameters.player)
		parameters.player = { };
	parameters.player.level = this;
	this.player = new Player(parameters.player);
	this.projection = parameters.projection instanceof PerspectiveProjection ? parameters.projection : new PerspectiveProjection(Object.assign(parameters.projection || { }, { camera: this.player.camera }));
	this.modelView = parameters.modelView instanceof ModelView ? parameters.modelView : new CameraModelView(Object.assign(parameters.modelView || { }, { camera: this.player.camera }));
}

Game.prototype = Object.create(ElementEventListener.prototype);
Game.prototype.constructor = Game;
Object.defineProperty(Game.prototype, "onElementDelete", { value: function onElementDelete()
{
	callSuper(this, "onElementDelete");
	if(this.element.requestFullscreen == this.element.webkitRequestFullscreen || this.element.requestFullscreen == this.element.mozRequestFullScreen || this.element.requestFullscreen == this.element.msRequestFullscreen)
		delete this.element.requestFullscreen;
	if(this.element.requestPointerLock == this.element.webkitRequestPointerLock || this.element.requestPointerLock == this.element.mozRequestPointerLock)
		delete this.element.requestPointerLock;
	this.renderer.element = this.controls.element = undefined;
} });
Object.defineProperty(Game.prototype, "onElementSet", { value: function onElementSet()
{
	callSuper(this, "onElementSet");
	this.element.requestFullscreen = this.element.requestFullscreen || this.element.webkitRequestFullscreen || this.element.mozRequestFullScreen || this.element.msRequestFullscreen;
	this.element.requestPointerLock = this.element.requestPointerLock || this.element.webkitRequestPointerLock || this.element.mozRequestPointerLock;
	this.renderer.element = this.controls.element = this.element;
} });
Object.defineProperty(Game.prototype, "pushUpdateRequest", { value: function pushUpdateRequest(request)
{
	return this.renderer.updateRequests.push(request) - 1;
}, writable: true });
Object.defineProperty(Game.prototype, "replaceUpdateRequest", { value: function replaceUpdateRequest(request, index)
{
	var oldRequest = this.renderer.updateRequests[index];
	this.renderer.updateRequests[index] = request;
	return oldRequest;
} });
Object.defineProperty(Game.prototype, "pullUpdateRequest", { value: function pullUpdateRequest(index)
{
	delete this.renderer.updateRequests[index];
}, writable: true });
Object.defineProperty(Game.prototype, "unload", { value: function unload(event)
{
	this.save();
	this.controls.unload();
	this.renderer.unload();
	this.removeEventListener("contextmenu");
	window.removeEventListener("beforeunload", this.unloadWrapper);
	return "g";
} });
Object.defineProperty(Game.prototype, "save", { value: function save()
{
} });

function Game(parameters)
{
	parameters = parameters || { };
	if(!parameters.renderer)
		parameters.renderer = { };
	parameters.renderer.game = this;
	var updateRequests = parameters.renderer.updateRequests || [ ];
	this.pushUpdateRequest = function pushUpdateRequest(request)
	{
		return updateRequests.push(request);
	};
	this.replaceUpdateRequest = function replaceUpdateRequest(request, index)
	{
		var oldRequest = updateRequests[index];
		updateRequests[index] = request;
		return oldRequest;
	};
	this.pullUpdateRequest = function pullUpdateRequest(index)
	{
		delete updateRequests[index];
	};
	this.directory = parameters.directory || { };
	this.options = { controls: { gamepad: { deadZone: .3 } } };
	if(!parameters.controls)
		parameters.controls = { };
	parameters.controls.game = this;
	this.controls = new Controls(parameters.controls);
	if(!parameters.gui)
		parameters.gui = { };
	parameters.gui.game = this;
	this.gui = new Gui(parameters.gui);
	if(!parameters.level)
		parameters.level = { };
	parameters.level.game = this;
	this.level = new Level(parameters.level);
	if(parameters.renderer)
		parameters.renderer.layers = [ this.gui, this.level ].concat(parameters.renderer.layers || [ ]);
	else
		parameters.renderer = { layers: [ this.gui, this.level ] };
	parameters.renderer.updateRequests = updateRequests;
	this.renderer = new WebGLRenderer(parameters.renderer);
	this.pushUpdateRequest = Game.prototype.pushUpdateRequest;
	this.replaceUpdateRequest = Game.prototype.replaceUpdateRequest;
	this.pullUpdateRequest = Game.prototype.pullUpdateRequest;
	window.addEventListener("resize", this.renderer.resizeWrapper);
	this.controls.startControlsLoop();
	this.renderer.animate();
	window.addEventListener("beforeunload", this.unloadWrapper = wrapFunction(this.unload, this));
	ElementEventListener.call(this, parameters);
	this.addEventListener("contextmenu", wrapEventListener(function preventContextMenu(preventDefault) { return true; }, this));
	this.addEventListener("click", function requestPointerLockOnElement()
	{
		if(this.element.requestPointerLock)
			this.element.requestPointerLock();
	});
}
