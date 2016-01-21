/**
 * Created by Frank on 16/1/12.
 */
'use strict';
const service = require('../../../services');
const nodeExcel = require('excel-export');


module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('common/events/list-events');
    });

    router.get('/:id([a-f0-9]{24})', function*() {
        let eventId = this.params.id;
        let event = yield service.events.event.findById(eventId, true);
        if (event.enroll) {
            event.enrollCount = yield service.events.enroll.getEnrollCount(event.enroll);
        }
        this.state.event = event;
        yield this.render('common/events/manage-event');
    });

    router.get('/:id([a-f0-9]{24})/enroll', function*() {
        let event = yield service.events.event.findById(this.params.id);
        if (event.enroll) {
            yield event.populate('enroll').execPopulate();
            this.state.enroll = event.enroll;
            this.state.enrollNames = yield service.events.enroll.getEnrollNames(event.enroll);
        }
        this.state.eventId = this.params.id;
        yield this.render('common/events/manage-enroll');
    });

    router.get('/:id([a-f0-9]{24})/enroll/excel', function*() {
        console.log('export to excel');
        let event = yield service.events.event.findById(this.params.id);
        if (event.enroll) {
            yield event.populate('enroll').execPopulate();
            let enroll = event.enroll;
            let enrollNames = yield service.events.enroll.getEnrollNames(event.enroll);
            let conf = {};
            conf.cols = [{
                caption: '姓名',
                type: 'string'
            }, {
                caption: '电话',
                type: 'string'
            }];
            for (let i = 0; i < enroll.fields.length; i++) {
                let field = enroll.fields[i];
                conf.cols.push({
                    caption: field.label,
                    type: 'string'
                });
            }
            conf.cols.push({
                caption: '报名日期',
                type: 'date'
            });
            conf.rows = [];
            for (let i = 0; i < enrollNames.length; i++) {
                let enrollName = enrollNames[i];
                let data = [enrollName.name, enrollName.phone, ...enrollName.fields, enrollName.createdTime];
                conf.rows.push(data);
            }
            console.log(conf);
            let result = nodeExcel.execute(conf);
            this.set('Content-Type', 'application/vnd.openxmlformats');
            this.set("Content-Disposition", "attachment; filename=" + "Report.xls");
            this.body = result;
        } else {
            this.body = '暂时没有报名';
        }
    });

    router.get('/:id([a-f0-9]{24})/task', function*() {
        this.state.eventId = this.params.id;
        yield this.render('common/events/manage-task');
    });

    return router;

};