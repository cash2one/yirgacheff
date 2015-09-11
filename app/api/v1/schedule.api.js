/**
 * Created by Frank on 15/6/5.
 */
var Schedule = require('../../models').Schedule;
var api = exports = module.exports = {};

api.add = function (req, res, next) {
    var schedule = new Schedule(req.body);
    schedule.creator = req.user;
    schedule.schoolId = req.user.schoolId;
    schedule.save(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(schedule);
        }
    });
};


api.list = function (req, res, next) {
    var start = req.query.start,
        end = req.query.end;
    Schedule.find({creator: req.user}, '-creator -__v')
        .where('start').gte(start)
        .where('end').lte(end)
        .lean()
        .exec(function (err, schedules) {
            if (err) {
                return next(err);
            }
            res.json(schedules);
        });
};


api.modify = function (req, res, next) {
    Schedule.findByIdAndUpdate(req.params.scheduleId,
        req.body, {new: true}).exec(function (err, schedule) {
            if (err) {
                return next(err);
            }
            res.json(schedule);
        });
};

api.deleteById = function (req, res, next) {
    Schedule.remove({_id: req.params.scheduleId},
        function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
};
