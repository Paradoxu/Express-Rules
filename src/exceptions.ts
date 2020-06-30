export class UnauthorizedReadOperation extends Error {
    constructor() {
        super('Unauthorized read operation request');
    }
}

export class UnauthorizedWriteOperation extends Error {
    constructor() {
        super('Unauthorized write operation request');
    }
}

export class UnauthorizedOperation extends Error {
    constructor() {
        super('Unauthorized operation request');
    }
}