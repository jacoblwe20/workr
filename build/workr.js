/*
 * Workr.js - 0.0.0 
 * Description : webworker, child process 
 * Project Url : https://github.com/jacoblwe20/workr.git 
 * Author : Jacob Lowe <jacoblowe.me> 
 * License : MIT 
 */

!function(a){var b=function(a,c){if(!(this instanceof b))return new b(a,c);"function"==typeof c&&c(this),"object"==typeof c&&this.merge(this,c);var d=function(){return this._init(),a.apply(this,arguments)};return this.constructor=a,d.prototype=a.prototype,d._name=a.name,this.merge(d.prototype,this),d};b.DS={},b.prototype._init=function(){this._store(),"tasker"in this&&this.tasker("initialize",this),"emit"in this&&this.emit("initialize")},b.prototype._store=function(){b.DS[this.constructor.name]||(b.DS[this.constructor.name]=[]);var a=b.DS[this.constructor.name];a.push(this),this.ts=+new Date+a.length},b.prototype.merge=function(){var a=arguments[0];if("object"==typeof a){for(var b=0;b<=arguments.length-1;b+=1){var c=arguments[b];if("object"==typeof c)for(var d in c)a[d]=c[d]}return a}},b.prototype.getState=function(){return this.__state},b.prototype.setState=function(a){this.__state=+a},a.Marrow=b}(this),function(a){a.prototype=a.prototype||{};var b=/\:/g,c=function(a){return"string"==typeof a?a.split(b):null};a.prototype.__events=function(){this._events={}},a.prototype.on=function(a,b){if("object"==typeof a)return this._objBind(a,b,arguments[2]),null;if("function"==typeof a)return this._contructorBind(a,b,arguments[2]),null;if("function"==typeof b&&"string"==typeof a){var d=c(a),e=d.length>1?d[0]+":"+d[1]:d[0];this._events||this.__events(),"object"!=typeof this._events[e]&&(this._events[e]=[]),"number"==typeof this._events[e].length&&this._events[e].push(b)}return this},a.prototype.once=function(a,b){var c=this,d=function(){b.apply(c,arguments),c.off(a,d),c.off(a,b)};this.on(a,d)},a.prototype.off=function(a,b){if("object"==typeof a)return a=this._objUnbind(a,b,arguments[2]),null;if("object"==typeof this._events&&"string"==typeof a&&"object"==typeof this._events[a]&&this._events[a].length){var c=this._events[a];if("function"==typeof b)for(var d=0;d<c.length;d+=1)""+c[d]==""+b&&(this._events[a][d]=null);else this._events[a]=[]}else"undefined"==typeof a&&"undefined"==typeof b&&(this._events={})},a.prototype.emit=function(a){if("object"==typeof this._events&&"string"==typeof a){var b,d=c(a),e=[].slice.call(arguments);this._events||this.__events();for(var f=0;f<d.length;f+=1)if(b=f?d[0]+":"+d[f]:d[f],"object"==typeof this._events[b]&&this._events[b].length)for(var g=0;g<this._events[b].length;g+=1){var h=!f&&d.length>1?e:e.slice(1);this._events[b][g]&&this._events[b][g].apply(this,h)}}},a.prototype._objBind=function(a,b,c){return a||"function"==typeof a.on||"string"==typeof b||"function"==typeof c?(a.on(b,c),void 0):null},a.prototype._objUnbind=function(a,b,c){return a||"function"==typeof a.off||"string"==typeof b?(a.off(b,c),void 0):null},a.prototype._contructorBind=function(a,b,c){if("function"!=typeof a||"string"!=typeof b||"function"!=typeof c||!("registerTask"in this))return null;var d=a._name;this.registerTask("_contructorBind",function(a){a&&"function"==typeof a.on&&a.on(b,c)},{instance:d,event:"initialize"})}}("function"==typeof Marrow?Marrow:this),function(a){a.prototype=a.prototype||{},a.prototype.__extend=function(a,b,c){var d=this;this[a]=function(){"function"==typeof this[c]&&d[c].apply(this,arguments),"number"==typeof b&&(d.__state=b);var e=[].concat(a,Array.prototype.slice.call(arguments));d.emit.apply(this,e)}},a.prototype.to=function(a,b,c){if("string"==typeof a&&"function"==typeof b){var d="__"+a;this[d]=b,this.__extend(a,c,d)}}}("function"==typeof Marrow?Marrow:this),function(a){a.prototype=a.prototype||{},a.DS=a.DS||{},a.prototype._taskName=function(a,b){var c=a;return b.event&&(c+=":_"+(b.event||"all")),b.instance&&(c+=":"+(b.instance||"")),c},a.prototype.registerTask=function(b,c,d){a.DS._tasks||(a.DS._tasks={});var e={};e.fn=c,e.options=d,a.DS._tasks[this._taskName(b,d)]=e},a.prototype.tasker=function(b,c){if("string"!=typeof b||"object"!=typeof c||"function"!=typeof c.constructor)return"console"in parent&&console.error("Could not run Marrow::tasker with the arguments >"+b.toString()+", "+c.toString()),!1;var d=a.DS._tasks,e=c.constructor.name;for(var f in d){var g=d[f];new RegExp(":_"+b+":"+e).test(f)&&g.fn(c)}return!0}}("function"==typeof Marrow?Marrow:this);

var __this = this,
	Workr = Marrow( function Workr( options ){
		options = options || {};
		this.options = options;
		this.isWorker = !( 'document' in __this );
		this.support = ( 'Worker' in __this );
		if ( !this.isWorker ) { 
			if ( !this.support ) {
				return this.emit('error', new Error('Current Enviroment' +
					' does not support webworkers'));
			}

			this.worker = new Worker( options.script );
		} 
		this.startListening( );
	},{
		trigger : function ( ) {
			var args = [].slice.call( arguments );
			args = this.serialize( args );
			if ( this.isWorker ) {
				return __this.postMessage( args );
			}
			this.worker.postMessage( args );
		},
		isValid : function ( _event ) {
			if ( typeof _event !== 'object') return;
			if ( typeof _event[0] !== 'string' ) return;
			return true;
		},
		startListening : function ( ) {
			var _this = this;
			function handler ( msg ) {
				var _event = _this.deserialize( msg.data ),
					isEvent = _this.isValid( _event );
				if ( isEvent ) {
					_this.emit.apply( _this, _event );
				}
			}
			if ( this.isWorker ) {
				__this.onmessage = handler;
				this.on( 'loadScript', function ( src ) {
					if ( typeof src === 'string' ) {
						importScripts( src );
					}
				});
				return;
			}
			this.worker.onmessage = handler;
			this.trigger('loadScript', this.options.src );
		},
		serialize : function ( data ) {
			var value;
			try {	
				value = JSON.stringify( data );
			} catch ( e ) {
				value = data;
			}
			return value;
		},
		deserialize : function ( data ) {
			var value;
			try {	
				value = JSON.parse( data );
			} catch ( e ) {
				value = data;
			}
			return value;
		}
	});

if ( !( 'document' in __this ) ) {
	// i dont know about this
	__this.workr = new Workr( );
}