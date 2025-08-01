class CurrencyError extends Error {
    constructor(message: string) {
        super(message);

        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default CurrencyError;