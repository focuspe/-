/*!
 * mongoose-dao
 */

"use strict";

/**
 * Initialize a new `MongooseDao`.
 *
 * @api public
 */

function MongooseDao(Model) {
    if (!Model) {
        throw new Error(Model + " is not valid, please check if it is a mongoose model!");
    }
    this.model = Model;
    this.pagesize = 20;
}

// create
MongooseDao.prototype.create = function (doc, callback) {
    this.model.create(doc, callback);
};

// read
MongooseDao.prototype.getById = function (id, callback) {
    this.model.findOne({_id: id}, callback);
};

MongooseDao.prototype.count = function () {
    var query = {};
    var callback;
    //count({a:1},callback)
    if (arguments.length == 2) {
        query = arguments[0];
        callback = arguments[1];
    } else {
        //default : count(callback)
        callback = arguments[0];
    }
    this.model.count(query, callback);
};

MongooseDao.prototype.query = MongooseDao.prototype.find = MongooseDao.prototype.getByQuery = function (query, callback) {
    this.model.find(query, callback);
};

MongooseDao.prototype.all = MongooseDao.prototype.getAll = function (callback) {
    this.model.find({}, callback);
};

MongooseDao.prototype.one = MongooseDao.prototype.findOne = function (query, callback) {
    this.model.findOne(query, callback);
};

// update
MongooseDao.prototype.updateById = function (id, update, callback) {
    // console.log('MongooseDao.prototype.updateById' + update);
    this.updateOne({_id: id}, update, callback);
};

MongooseDao.prototype.updateOne = function (conditions, update, callback) {
    this.update(conditions, update, {multi: false}, callback);
};

// way1: conditions, update , callback
// way2: conditions, update ,options, callback
MongooseDao.prototype.update = function () {
    var conditions, update, options, callback;

    var _options;
    if (arguments.length == 3) {
        conditions = arguments[0];
        var update_obj = arguments[1];
        callback = arguments[2];
        console.log(JSON.stringify(conditions));
        console.log(JSON.stringify(update_obj));
        var options_local = {upsert: true, multi: false};

        this.model.update(conditions, {$set: update_obj}, options_local, callback);
        return;


    } else if (arguments.length == 4) {
        conditions = arguments[0];
        update = arguments[1];
        _options = arguments[2];
        callback = arguments[3];
    } else {
        throw new Error("MongooseDao.prototype.update param is not valid!")
    }


    var opt = {multi: true};
    _extend(opt, _options);

    this.model.update(conditions, update, opt, callback);
};

// delete
MongooseDao.prototype.delete = MongooseDao.prototype.remove = function (query, callback) {
    this.model.remove(query, callback);
};

MongooseDao.prototype.deleteAll = MongooseDao.prototype.removeAll = function (callback) {
    this.delete({}, callback);
};

MongooseDao.prototype.deleteById = MongooseDao.prototype.removeById = function (id, callback) {
    // console.log('MongooseDao.prototype.deleteById');
    this.delete({_id: id}, callback);
};

// pagination
MongooseDao.prototype.latest = MongooseDao.prototype.top = MongooseDao.prototype.first = MongooseDao.prototype.n = function () {
    var n;
    var callback;
    var q = {};
    var sort = {};

    // (num, callback)
    if (arguments.length == 2) {
        n = arguments[0];
        callback = arguments[1];
    } else if (arguments.length == 3) {
        // (num, {},callback)
        n = arguments[0];
        q = arguments[1];
        callback = arguments[2];
    } else if (arguments.length == 4) {
        // (num, {},callback)
        n = arguments[0];
        q = arguments[1];
        sort = arguments[2];
        callback = arguments[3];
    } else {
        // (callback)
        n = this.pagesize;
        callback = arguments[0];
    }

    this.model.find(q).sort(sort).limit(n).exec(callback);
};

MongooseDao.prototype.getSelectedList = function () {
    var limit = arguments[0];
    var query = arguments[1];
    var callback = arguments[2];

    this.model.distinct(limit, query).exec(callback);
};


//TODO
MongooseDao.prototype.getPage = function () {
    var n = this.pagesize;
    var callback;
    var q = {};
    var sort = {_id: -1};

    // pageByLastId(query, callback)
    if (arguments.length == 2) {
        var query = arguments[0];
        q = query;
        callback = arguments[1];
    } else if (arguments.length == 3) {
        // pageByLastId(query, count, callback)
        var query = arguments[0];
        q = query;
        n = arguments[1];
        callback = arguments[2];
    } else if (arguments.length == 4) {
        // pageByLastId(query, count, sort, callback)
        var query = arguments[0];
        q = query;
        n = arguments[1];
        sort = arguments[2];

        callback = arguments[3];
    } else if (arguments.length == 5) {
        var query = arguments[0];
        q = query;
        n = arguments[1];
        sort = arguments[2];
        var pageCount = arguments[3];
        callback = arguments[4];
        this.model.find(q).sort(sort).skip(pageCount).limit(n).exec(callback);
        return;
    } else {
        // pageByLastId(query, callback)
        var query = arguments[0];
        q = query;
        callback = arguments[1];
    }
    this.model.find(q).sort(sort).limit(n).exec(callback);
};

// TODO: impl page by lastId
// db.usermodels.find({'_id' :{ "$gt" :ObjectId("55940ae59c39572851075bfd")} }).limit(20).sort({_id:-1})
MongooseDao.prototype.pageByLastId = function () {
    var n = this.pagesize;
    var callback;
    var q = {};
    var sort = {_id: -1};

    // pageByLastId(lid, callback)
    if (arguments.length == 2) {
        var lid = arguments[0];
        q = _get_q_by_last_id(lid);
        callback = arguments[1];
    } else if (arguments.length == 3) {
        // pageByLastId(lid, count, callback)
        var lid = arguments[0];
        q = _get_q_by_last_id(lid);
        n = arguments[1];
        callback = arguments[2];
    } else if (arguments.length == 4) {
        // pageByLastId(lid, count, query, callback)
        var lid = arguments[0];
        q = _get_q_by_last_id(lid);
        n = arguments[1];

        _extend(q, arguments[2]);

        callback = arguments[3];
    } else if (arguments.length == 5) {
        // pageByLastId(lid, count, query, sort, callback)
        var lid = arguments[0];
        q = _get_q_by_last_id(lid);
        n = arguments[1];

        _extend(q, arguments[2]);

        sort = arguments[3];
        callback = arguments[4];
    } else {
        // pageByLastId(lid, callback)
        var lid = arguments[0];
        q = _get_q_by_last_id(lid);
        callback = arguments[1];
    }

    this.model.find(q).sort(sort).limit(n).exec(callback);
};

// private
function _extend(des, src) {
    if (!des) {
        des = {};
    }
    if (src) {
        for (var i in src) {
            des[i] = src[i];
        }
    }

    return des;
}

function _get_q_by_last_id(last_id) {
    return {
        '_id': {
            "$gt": last_id
        }
    }
}

module.exports = MongooseDao;