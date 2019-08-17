import * as RedisPackage from "redis";

export type DataBaseCall = (passIns: any, resolve: Function, reject: Function) => any

function wrapper(passIns: string, cb: DataBaseCall): Promise<any> {
    return new Promise(function(resolve, reject) {
        cb(passIns, resolve, reject);
    })
}

interface RedisContextStoreI {
    redisConnection: RedisPackage.RedisClient,
    contexts: Map<string, Context>
    safeMode: boolean,
}

type StoreOptions = {
    safeMode?: boolean
}

const defaultConverter = x => JSON.stringify(x);
const defaultExtractor = x => JSON.parse(x);

export class RedisContextStore implements RedisContextStoreI {
    redisConnection: RedisPackage.RedisClient;
    contexts: Map<string, Context>;
    safeMode: boolean;

    constructor(redisConnection: RedisPackage.RedisClient, options: StoreOptions) {
        this.redisConnection = redisConnection;
        this.contexts = new Map<string, Context>();

        this.safeMode = options.safeMode || true;
    }

    createContext(key: string, passIns: Function, DBCall: DataBaseCall, converter: Function = defaultConverter, extractor: Function = defaultExtractor): Context {
        let contextExists = this.contexts.get(key);

        if(contextExists && this.safeMode) {
            console.error("KEY " + key + " already exists in contextList");
            process.exit(1);
            return;
        }

        const newContext = new Context(this, key, passIns, DBCall, converter, extractor);

        this.contexts.set(key, newContext);

        return newContext;
    }

    getContext(ContextKey): Context {
        return this.contexts.get(ContextKey);
    }
}

export const createStore = (redisConnection: RedisPackage.RedisClient, options: StoreOptions): RedisContextStore => {
    return new RedisContextStore(redisConnection, options);
}

interface ContextI {
    RedisClient: RedisPackage.RedisClient,
    key: ContextKey,
    passIns: Function,
    DBCall: Function,
    converter: Function,
    extractor: Function
}

type ContextKey = string;
type ContextRedisKey = string;

export class Context implements ContextI {
    RedisClient: RedisPackage.RedisClient;
    key: ContextKey;
    passIns: Function;
    DBCall: DataBaseCall;
    converter: Function;
    extractor: Function;

    constructor(ContextStore: RedisContextStore, key: ContextKey, passIns: Function, DBCall: DataBaseCall, converter: Function, extractor: Function) {
        this.RedisClient = ContextStore.redisConnection;
        this.key = key;
        this.passIns = passIns;
        this.DBCall = DBCall;
        this.converter = converter;
    }

    redisKey = (passInContent: string): ContextRedisKey => {
        return this.key + ":" + this.converter(passInContent);
    }

    useCache = (): Function => {
        return function(req, res, next) {
            const getPassIns = this.passIns(req);
            const redisKey: ContextRedisKey = this.redisKey(getPassIns);

            if(!req.redisContext) req.cache = {};

            this.RedisClient.get(redisKey, function(err, reply) {
                if(!reply) {
                    wrapper(getPassIns, this.DBCall).then(data => {
                        let value = this.converter(data);

                        this.RedisClient.set(redisKey, value, function(err, reply) {
                            req.redisContext[this.key] = data;
                            next();
                        })
                    })
                }
                else {
                    req.redisContext[this.key] = this.extractor(reply);
                    next();
                }
            })
        }
    }

    uncache = (passInFunc: Function, cb: Function): Function => {
        return function(req, res, next) {
            let redisKey = this.key + ":" + this.converter(passInFunc(req));

            this.RedisClient.del(redisKey, function(err, reply) {
                cb(err, reply);
            });
        }
    }
}