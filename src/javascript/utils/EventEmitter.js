import EE from 'eventemitter3';

export default class EventEmitter {
	constructor() {
		this.emitter = new EE();
	}

	subscribe = (event, listener) => {
		this.emitter.on(event, listener);
	};

	unsubscribe = (event, listener) => {
		this.emitter.removeListener(event, listener);
	};

	emit = (event, payload, error = false) => {
		this.emitter.emit(event, payload, error);
	};
}